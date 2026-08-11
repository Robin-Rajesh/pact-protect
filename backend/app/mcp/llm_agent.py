from typing import Dict, Any, List, Optional
import re
import os
import json

from .utils import MCPConfig, mcp_post
from ..llm_providers import get_llm_provider, get_settings


DOMAINS = [
    "Legal","Financial","Compliance","HR","Security","Vendor","Operational","Environmental","Intellectual Property","Privacy","Data Protection","Other"
]


class LLMClient:
    def __init__(self) -> None:
        self.cfg = MCPConfig()

    def _get_provider(self):
        """Get the current LLM provider."""
        return get_llm_provider()

    def generate_contract_summary(self, contract_text: str, clauses: List[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
        """Generate an executive summary of the entire contract."""
        provider = self._get_provider()
        if not provider.is_available():
            print(f"LLM provider not available")
            return None

        try:
            # Count risk levels
            high_risk = sum(1 for c in clauses if (c.get('classification', {}).get('risk_level', '')).lower() == 'high')
            medium_risk = sum(1 for c in clauses if (c.get('classification', {}).get('risk_level', '')).lower() == 'medium')

            prompt = f"""You are a legal contract analyst. Analyze this contract and provide a comprehensive executive summary.

Contract has {len(clauses)} clauses:
- High Risk: {high_risk}
- Medium Risk: {medium_risk}
- Low Risk: {len(clauses) - high_risk - medium_risk}

Provide a JSON response with:
1. "executive_summary": 2-3 paragraph overview
2. "key_obligations": list of 3-5 main obligations
3. "major_risks": list of 3-5 top risks identified
4. "recommendations": list of 3-5 action items
5. "overall_sentiment": one of ["Favorable", "Balanced", "Unfavorable"]

Return only valid JSON."""

            content = provider.invoke(prompt, temperature=0.3)
            return json.loads(content)
        except Exception as e:
            print(f"Summary generation error: {e}")
            return None

    def generate_recommendation(self, text: str, risk_level: str, reasons: List[str]) -> Optional[str]:
        """Generate alternative wording recommendation for high-risk clauses."""
        if risk_level.lower() != "high":
            return None

        provider = self._get_provider()
        if not provider.is_available():
            return None

        try:
            prompt = f"""You are a legal contract advisor. Given the following high-risk contract clause, suggest an alternative wording that reduces risk while maintaining the intent.

Original Clause:
{text}

Risk Factors:
{'; '.join(reasons)}

Provide a single paragraph alternative wording that:
1. Addresses the risk factors identified
2. Maintains balanced obligations
3. Uses clear, professional language
4. Protects both parties' interests

Alternative Wording:"""

            content = provider.invoke(prompt, temperature=0.7)
            return content.strip() if content else None
        except Exception as e:
            print(f"Recommendation generation error: {e}")
            return None

    def classify_clause(self, text: str, metadata: Dict[str, Any], context: Optional[List[Dict[str, Any]]] = None) -> Dict[str, Any]:
        prompt = self._build_prompt(text, metadata, context)
        system = "You are a contract clause analysis assistant. Return strict JSON only with keys: domain, risk_level, reasons, key_metadata."

        provider = self._get_provider()
        if provider.is_available():
            try:
                content = provider.invoke(prompt, system=system, temperature=0)
                result = json.loads(content)
                # Ensure risk_level is properly formatted
                if "risk_level" in result:
                    result["risk_level"] = result["risk_level"].capitalize()
                return result
            except Exception as e:
                import traceback
                print(f"LLM classification error: {e}")
                traceback.print_exc()

        if self.cfg.is_configured():
            payload = {
                "model": self.cfg.model,
                "messages": [
                    {"role": "system", "content": "You are a contract clause analysis assistant. Return strict JSON only."},
                    {"role": "user", "content": prompt},
                ],
                "response_format": {"type": "json_object"}
            }
            try:
                res = mcp_post("/v1/chat/completions", payload, self.cfg)
                if res and "choices" in res and res["choices"]:
                    content = res["choices"][0]["message"]["content"]
                    return json.loads(content)
            except Exception:
                pass

        # Fallback local heuristic if MCP not configured or failed
        return self._local_fallback(text, metadata)

    def _build_prompt(self, text: str, metadata: Dict[str, Any], context: Optional[List[Dict[str, Any]]] = None) -> str:
        ctx_snippets = ""
        if context:
            top = context[:3]
            joined = "\n---\n".join([c.get("text", "") for c in top if c.get("text")])
            if joined:
                ctx_snippets = f"\n\nSimilar clauses for reference (do not assume they are correct, use only as context):\n{joined}"
        return (
            "Classify the following contract clause into a domain and assess risk. "
            "Return JSON with keys: domain (one of: " + ", ".join(DOMAINS) + "), "
            "risk_level (Low, Medium, High), reasons (list of strings), and key_metadata (object). "
            f"Clause: \n{text}\n\nKnown metadata: {metadata}" + ctx_snippets
        )

    def _local_fallback(self, text: str, metadata: Dict[str, Any]) -> Dict[str, Any]:
        t = text.lower()
        domain = "Other"
        if any(w in t for w in ["payment","invoice","fee","price","pricing","revenue","cost"]):
            domain = "Financial"
        elif any(w in t for w in ["confidential","nda","non-disclosure","trade secret"]):
            domain = "Legal"
        elif any(w in t for w in ["privacy","gdpr","hipaa","data","personal information"]):
            domain = "Privacy"
        elif any(w in t for w in ["security","breach","encrypt","vulnerability","patch"]):
            domain = "Security"
        elif any(w in t for w in ["termination","term","renewal","expiry"]):
            domain = "Operational"
        elif any(w in t for w in ["employee","employment","non-compete","hr"]):
            domain = "HR"

        risk = "Low"
        if any(w in t for w in ["indemnify","penalty","unlimited liability","liquidated damages","warranty disclaimer"]):
            risk = "High"
        elif any(w in t for w in ["breach","termination","fine","forfeit","late"]):
            risk = "Medium"

        reasons = []
        if risk == "High":
            reasons.append("Contains high-risk terms like indemnification/liability caps")
        elif risk == "Medium":
            reasons.append("Contains moderately risky enforcement or termination language")
        else:
            reasons.append("No strong risky keywords detected")

        km = dict(metadata)
        if re.search(r"\b(expires|expiry|expiration)\b", t):
            km["expiry_signal"] = True

        return {
            "domain": domain,
            "risk_level": risk,
            "reasons": reasons,
            "key_metadata": km,
        }
