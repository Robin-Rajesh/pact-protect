import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit } from "lucide-react";
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
}

export default function Policies() {
  const [policies, setPolicies] = useState<Policy[]>([
    {
      id: "1",
      name: "Unlimited Liability Clause",
      description: "Contracts must not contain clauses that impose unlimited liability on the company",
      riskLevel: "high",
    },
    {
      id: "2",
      name: "Indemnification Requirements",
      description: "Broad indemnification clauses that exceed industry standards",
      riskLevel: "high",
    },
    {
      id: "3",
      name: "Non-Standard Payment Terms",
      description: "Payment terms that deviate from 30-day net standard",
      riskLevel: "medium",
    },
  ]);

  const [open, setOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    riskLevel: "medium" as "high" | "medium" | "low",
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
    setFormData({ name: "", description: "", riskLevel: "medium" });
    setEditingPolicy(null);
  };

  const handleEdit = (policy: Policy) => {
    setEditingPolicy(policy);
    setFormData({
      name: policy.name,
      description: policy.description,
      riskLevel: policy.riskLevel,
    });
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    setPolicies(policies.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Policy Library</h1>
          <p className="text-muted-foreground">
            Manage compliance policies used for contract analysis
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Policy
            </Button>
          </DialogTrigger>
          <DialogContent>
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
              </div>
              <DialogFooter>
                <Button type="submit">{editingPolicy ? "Update" : "Create"} Policy</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {policies.map((policy) => (
          <Card key={policy.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle>{policy.name}</CardTitle>
                  <CardDescription>{policy.description}</CardDescription>
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
        ))}
      </div>
    </div>
  );
}
