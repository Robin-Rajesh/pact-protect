import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit, Tags } from "lucide-react";
import { LabelManager, PolicyLabel } from "@/components/LabelManager";
import { LabelChip } from "@/components/LabelChip";
import { LabelTree } from "@/components/LabelTree";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Policy {
  id: string;
  name: string;
  description: string;
  riskLevel: "high" | "medium" | "low";
  labelIds: string[];
}

export default function Policies() {
  const [policies, setPolicies] = useState<Policy[]>([
    {
      id: "1",
      name: "Unlimited Liability Clause",
      description: "Contracts must not contain clauses that impose unlimited liability on the company",
      riskLevel: "high",
      labelIds: [],
    },
    {
      id: "2",
      name: "Indemnification Requirements",
      description: "Broad indemnification clauses that exceed industry standards",
      riskLevel: "high",
      labelIds: [],
    },
    {
      id: "3",
      name: "Non-Standard Payment Terms",
      description: "Payment terms that deviate from 30-day net standard",
      riskLevel: "medium",
      labelIds: [],
    },
  ]);

  const [labels, setLabels] = useState<PolicyLabel[]>([
    // Financial
    { id: "1", name: "Financial", parentLabelId: null, color: "#22c55e", policyIds: ["3"] },
    { id: "1.1", name: "Payment Terms", parentLabelId: "1", color: "#16a34a", policyIds: ["3"] },
    { id: "1.2", name: "Pricing & Discounts", parentLabelId: "1", color: "#16a34a", policyIds: [] },
    { id: "1.3", name: "Taxation", parentLabelId: "1", color: "#16a34a", policyIds: [] },
    { id: "1.4", name: "Invoicing", parentLabelId: "1", color: "#16a34a", policyIds: [] },
    { id: "1.5", name: "Currency/Exchange Clauses", parentLabelId: "1", color: "#16a34a", policyIds: [] },

    // Legal
    { id: "2", name: "Legal", parentLabelId: null, color: "#ef4444", policyIds: ["1", "2"] },
    { id: "2.1", name: "Jurisdiction & Governing Law", parentLabelId: "2", color: "#dc2626", policyIds: [] },
    { id: "2.2", name: "Liability & Indemnity", parentLabelId: "2", color: "#dc2626", policyIds: ["1", "2"] },
    { id: "2.3", name: "Confidentiality", parentLabelId: "2", color: "#dc2626", policyIds: [] },
    { id: "2.4", name: "Force Majeure", parentLabelId: "2", color: "#dc2626", policyIds: [] },
    { id: "2.5", name: "Termination Clauses", parentLabelId: "2", color: "#dc2626", policyIds: [] },
    { id: "2.6", name: "Arbitration & Dispute Resolution", parentLabelId: "2", color: "#dc2626", policyIds: [] },

    // Compliance
    { id: "3", name: "Compliance", parentLabelId: null, color: "#f97316", policyIds: [] },
    { id: "3.1", name: "Data Privacy (GDPR/PCI-DSS)", parentLabelId: "3", color: "#ea580c", policyIds: [] },
    { id: "3.2", name: "Anti-Money Laundering (AML)", parentLabelId: "3", color: "#ea580c", policyIds: [] },
    { id: "3.3", name: "Know Your Customer (KYC)", parentLabelId: "3", color: "#ea580c", policyIds: [] },
    { id: "3.4", name: "Sanctions & Export Controls", parentLabelId: "3", color: "#ea580c", policyIds: [] },
    { id: "3.5", name: "Ethical Conduct", parentLabelId: "3", color: "#ea580c", policyIds: [] },

    // Operational
    { id: "4", name: "Operational", parentLabelId: null, color: "#3b82f6", policyIds: [] },
    { id: "4.1", name: "Service Level Agreements (SLA)", parentLabelId: "4", color: "#2563eb", policyIds: [] },
    { id: "4.2", name: "Performance Metrics", parentLabelId: "4", color: "#2563eb", policyIds: [] },
    { id: "4.3", name: "Delivery & Acceptance", parentLabelId: "4", color: "#2563eb", policyIds: [] },
    { id: "4.4", name: "Maintenance Obligations", parentLabelId: "4", color: "#2563eb", policyIds: [] },

    // Security
    { id: "5", name: "Security", parentLabelId: null, color: "#a855f7", policyIds: [] },
    { id: "5.1", name: "Data Encryption", parentLabelId: "5", color: "#9333ea", policyIds: [] },
    { id: "5.2", name: "Access Control", parentLabelId: "5", color: "#9333ea", policyIds: [] },
    { id: "5.3", name: "Security Breach Response", parentLabelId: "5", color: "#9333ea", policyIds: [] },
    { id: "5.4", name: "Third-Party Security Requirements", parentLabelId: "5", color: "#9333ea", policyIds: [] },

    // Risk & Audit
    { id: "6", name: "Risk & Audit", parentLabelId: null, color: "#eab308", policyIds: [] },
    { id: "6.1", name: "Insurance Coverage", parentLabelId: "6", color: "#ca8a04", policyIds: [] },
    { id: "6.2", name: "Risk Assessment Clauses", parentLabelId: "6", color: "#ca8a04", policyIds: [] },
    { id: "6.3", name: "Audit Rights", parentLabelId: "6", color: "#ca8a04", policyIds: [] },
    { id: "6.4", name: "Reporting Obligations", parentLabelId: "6", color: "#ca8a04", policyIds: [] },

    // Intellectual Property
    { id: "7", name: "Intellectual Property", parentLabelId: null, color: "#ec4899", policyIds: [] },
    { id: "7.1", name: "IP Ownership", parentLabelId: "7", color: "#db2777", policyIds: [] },
    { id: "7.2", name: "Licensing", parentLabelId: "7", color: "#db2777", policyIds: [] },
    { id: "7.3", name: "Patent/Trademark Protection", parentLabelId: "7", color: "#db2777", policyIds: [] },

    // Environmental & Sustainability
    { id: "8", name: "Environmental & Sustainability", parentLabelId: null, color: "#14b8a6", policyIds: [] },
    { id: "8.1", name: "Waste Management", parentLabelId: "8", color: "#0d9488", policyIds: [] },
    { id: "8.2", name: "Green Procurement", parentLabelId: "8", color: "#0d9488", policyIds: [] },
    { id: "8.3", name: "ESG Commitments", parentLabelId: "8", color: "#0d9488", policyIds: [] },
  ]);

  const [selectedLabelId, setSelectedLabelId] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    riskLevel: "medium" as "high" | "medium" | "low",
    labelIds: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPolicy) {
      setPolicies(policies.map(p => p.id === editingPolicy.id ? { ...editingPolicy, ...formData } : p));
    } else {
      setPolicies([...policies, { id: Date.now().toString(), ...formData }]);
    }
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", riskLevel: "medium", labelIds: [] });
    setEditingPolicy(null);
  };

  const handleEdit = (policy: Policy) => {
    setEditingPolicy(policy);
    setFormData({
      name: policy.name,
      description: policy.description,
      riskLevel: policy.riskLevel,
      labelIds: policy.labelIds,
    });
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    setPolicies(policies.filter(p => p.id !== id));
    // Remove policy from all labels
    setLabels(labels.map(label => ({
      ...label,
      policyIds: label.policyIds.filter(pid => pid !== id)
    })));
  };

  const handleCreateLabel = (labelData: Omit<PolicyLabel, "id" | "policyIds">) => {
    const newLabel: PolicyLabel = {
      ...labelData,
      id: Date.now().toString(),
      policyIds: [],
    };
    setLabels([...labels, newLabel]);
  };

  const handleDeleteLabel = (labelId: string) => {
    // Remove child labels first
    const childLabelIds = labels.filter(l => l.parentLabelId === labelId).map(l => l.id);
    setLabels(labels.filter(l => l.id !== labelId && !childLabelIds.includes(l.id)));
    
    // Remove label from all policies
    setPolicies(policies.map(policy => ({
      ...policy,
      labelIds: policy.labelIds.filter(lid => lid !== labelId && !childLabelIds.includes(lid))
    })));
  };

  const togglePolicyLabel = (labelId: string) => {
    setFormData(prev => ({
      ...prev,
      labelIds: prev.labelIds.includes(labelId)
        ? prev.labelIds.filter(id => id !== labelId)
        : [...prev.labelIds, labelId]
    }));
  };

  const removePolicyLabel = (policyId: string, labelId: string) => {
    setPolicies(policies.map(p => 
      p.id === policyId 
        ? { ...p, labelIds: p.labelIds.filter(id => id !== labelId) }
        : p
    ));
    setLabels(labels.map(l =>
      l.id === labelId
        ? { ...l, policyIds: l.policyIds.filter(id => id !== policyId) }
        : l
    ));
  };

  const filteredPolicies = selectedLabelId
    ? policies.filter(p => p.labelIds.includes(selectedLabelId))
    : policies;

  return (
    <div className="flex gap-6">
      {/* Label Sidebar */}
      <Card className="w-64 flex-shrink-0 h-fit sticky top-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Tags className="h-5 w-5" />
              Labels
            </CardTitle>
          </div>
          <div className="pt-2">
            <LabelManager labels={labels} onCreateLabel={handleCreateLabel} />
          </div>
        </CardHeader>
        <CardContent>
          <LabelTree
            labels={labels}
            selectedLabelId={selectedLabelId}
            onSelectLabel={setSelectedLabelId}
            onDeleteLabel={handleDeleteLabel}
          />
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Policy Library</h1>
            <p className="text-muted-foreground">
              {selectedLabelId 
                ? `Showing policies with label: ${labels.find(l => l.id === selectedLabelId)?.name}`
                : "Manage compliance policies used for contract analysis"
              }
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                Add Policy
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>{editingPolicy ? "Edit" : "Add"} Policy</DialogTitle>
                  <DialogDescription>
                    Define a compliance policy that will be used to analyze contracts
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Policy Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="riskLevel">Risk Level</Label>
                    <Select
                      value={formData.riskLevel}
                      onValueChange={(value: "high" | "medium" | "low") =>
                        setFormData({ ...formData, riskLevel: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Assign Labels</Label>
                    <div className="border rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
                      {labels.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No labels available. Create labels first.</p>
                      ) : (
                        labels.map(label => (
                          <div key={label.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`label-${label.id}`}
                              checked={formData.labelIds.includes(label.id)}
                              onCheckedChange={() => togglePolicyLabel(label.id)}
                            />
                            <label
                              htmlFor={`label-${label.id}`}
                              className="flex items-center gap-2 cursor-pointer flex-1"
                            >
                              <div
                                className="h-3 w-3 rounded-full"
                                style={{ backgroundColor: label.color }}
                              />
                              <span className="text-sm">{label.name}</span>
                            </label>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">{editingPolicy ? "Update" : "Create"} Policy</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {filteredPolicies.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">
                  {selectedLabelId 
                    ? "No policies with this label"
                    : "No policies yet. Create one to get started."
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredPolicies.map((policy) => (
              <Card key={policy.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <CardTitle>{policy.name}</CardTitle>
                      <CardDescription>{policy.description}</CardDescription>
                      {policy.labelIds.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {policy.labelIds.map(labelId => {
                            const label = labels.find(l => l.id === labelId);
                            if (!label) return null;
                            return (
                              <LabelChip
                                key={labelId}
                                name={label.name}
                                color={label.color}
                                showRemove
                                onRemove={() => removePolicyLabel(policy.id, labelId)}
                                onClick={() => setSelectedLabelId(labelId)}
                              />
                            );
                          })}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(policy)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(policy.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Badge
                    variant={
                      policy.riskLevel === "high"
                        ? "destructive"
                        : policy.riskLevel === "medium"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {policy.riskLevel.toUpperCase()} RISK LEVEL
                  </Badge>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
