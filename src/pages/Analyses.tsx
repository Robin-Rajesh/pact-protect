import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RiskBadge } from "@/components/RiskBadge";
import { FileText, Calendar } from "lucide-react";

interface Analysis {
  id: string;
  contractName: string;
  date: string;
  overallRisk: "high" | "medium" | "low";
  clausesAnalyzed: number;
  highRiskCount: number;
}

export default function Analyses() {
  const analyses: Analysis[] = [
    {
      id: "1",
      contractName: "Vendor Agreement - Sample.pdf",
      date: "2024-01-15",
      overallRisk: "high",
      clausesAnalyzed: 23,
      highRiskCount: 5,
    },
    {
      id: "2",
      contractName: "Service Contract - Example.pdf",
      date: "2024-01-14",
      overallRisk: "medium",
      clausesAnalyzed: 18,
      highRiskCount: 2,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contract Analyses</h1>
        <p className="text-muted-foreground">
          View and manage completed contract risk analyses
        </p>
      </div>

      {analyses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No analyses yet</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              Upload a contract to get started with automated risk analysis
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {analyses.map((analysis) => (
            <Card key={analysis.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {analysis.contractName}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Analyzed on {new Date(analysis.date).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <RiskBadge level={analysis.overallRisk} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Clauses Analyzed:</span>
                    <span className="ml-2 font-medium">{analysis.clausesAnalyzed}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">High Risk Found:</span>
                    <Badge variant="destructive" className="ml-2">
                      {analysis.highRiskCount}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
