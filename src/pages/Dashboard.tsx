import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2, FileText, Shield } from "lucide-react";

export default function Dashboard() {
  const stats = [
    {
      title: "Total Contracts",
      value: "0",
      icon: FileText,
      description: "Analyzed contracts",
    },
    {
      title: "Active Policies",
      value: "0",
      icon: Shield,
      description: "Risk policies configured",
    },
    {
      title: "High Risk Clauses",
      value: "0",
      icon: AlertTriangle,
      description: "Requiring attention",
    },
    {
      title: "Compliant Clauses",
      value: "0",
      icon: CheckCircle2,
      description: "Meeting standards",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Contract risk analysis overview and statistics
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            Follow these steps to start analyzing contracts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              1
            </div>
            <div>
              <h3 className="font-semibold">Configure Policies</h3>
              <p className="text-sm text-muted-foreground">
                Set up your company's compliance policies in the Policy Library
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              2
            </div>
            <div>
              <h3 className="font-semibold">Upload Contract</h3>
              <p className="text-sm text-muted-foreground">
                Upload a contract PDF for automated risk analysis
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              3
            </div>
            <div>
              <h3 className="font-semibold">Review Results</h3>
              <p className="text-sm text-muted-foreground">
                Get detailed risk scores and compliance recommendations
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
