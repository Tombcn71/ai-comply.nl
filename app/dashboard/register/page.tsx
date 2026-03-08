"use client";

import { useState, useTransition } from "react";
import {
  Plus,
  Search,
  Filter,
  Pencil,
  Trash2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import {
  getTools,
  createTool,
  updateTool,
  deleteTool,
  toggleCompliance,
  type Tool,
  type RiskCategory,
  type Department,
} from "@/app/actions/tools";

const riskConfig: Record<
  RiskCategory,
  { label: string; className: string }
> = {
  minimaal: {
    label: "Minimaal risico",
    className: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
  },
  beperkt: {
    label: "Beperkt risico",
    className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  },
  hoog: {
    label: "Hoog risico",
    className: "bg-orange-100 text-orange-800 hover:bg-orange-100",
  },
  onaanvaardbaar: {
    label: "Onaanvaardbaar",
    className: "bg-red-100 text-red-800 hover:bg-red-100",
  },
};

export default function AIRegisterPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [toolsLoaded, setToolsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState<RiskCategory | "all">("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    name: "",
    department: "" as Department | "",
    risk: "" as RiskCategory | "",
    purpose: "",
  });

  // Load tools on mount
  if (!toolsLoaded) {
    startTransition(async () => {
      const data = await getTools();
      setTools(data);
      setToolsLoaded(true);
    });
  }

  const filteredTools = tools.filter((tool) => {
    const matchesSearch = tool.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesRisk = riskFilter === "all" || tool.risk === riskFilter;
    return matchesSearch && matchesRisk;
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.department || !formData.risk) return;

    startTransition(async () => {
      try {
        if (editingTool) {
          await updateTool(editingTool.id, {
            name: formData.name,
            department: formData.department as Department,
            risk: formData.risk as RiskCategory,
            purpose: formData.purpose,
          });
        } else {
          await createTool({
            name: formData.name,
            department: formData.department as Department,
            risk: formData.risk as RiskCategory,
            purpose: formData.purpose,
            isCompliant: false,
          });
        }
        const updated = await getTools();
        setTools(updated);
        resetForm();
      } catch (error) {
        console.error("Error saving tool:", error);
      }
    });
  };

  const resetForm = () => {
    setFormData({ name: "", department: "", risk: "", purpose: "" });
    setEditingTool(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (tool: Tool) => {
    setEditingTool(tool);
    setFormData({
      name: tool.name,
      department: tool.department,
      risk: tool.risk,
      purpose: tool.purpose,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        await deleteTool(id);
        const updated = await getTools();
        setTools(updated);
      } catch (error) {
        console.error("Error deleting tool:", error);
      }
    });
  };

  const handleToggleCompliance = (id: string) => {
    startTransition(async () => {
      try {
        await toggleCompliance(id);
        const updated = await getTools();
        setTools(updated);
      } catch (error) {
        console.error("Error toggling compliance:", error);
      }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <div className="pl-0 pt-16 transition-all duration-300 lg:pl-64 lg:pt-0">
        <DashboardHeader />
        <main className="p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                AI-Register
              </h1>
              <p className="mt-1 text-muted-foreground">
                Beheer en monitor alle AI-tools binnen uw organisatie
              </p>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingTool(null);
                    setFormData({
                      name: "",
                      department: "",
                      risk: "",
                      purpose: "",
                    });
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Tool Toevoegen
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingTool ? "Tool Bewerken" : "Nieuwe Tool Toevoegen"}
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Naam van de Tool</Label>
                    <Input
                      id="name"
                      placeholder="Bijv. ChatGPT, Midjourney..."
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="department">Afdeling</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value: Department) =>
                        setFormData({ ...formData, department: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecteer afdeling" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="HR">HR</SelectItem>
                        <SelectItem value="IT">IT</SelectItem>
                        <SelectItem value="Sales">Sales</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="risk">Risicocategorie</Label>
                    <Select
                      value={formData.risk}
                      onValueChange={(value: RiskCategory) =>
                        setFormData({ ...formData, risk: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecteer risico" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minimaal">
                          <span className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            Minimaal risico
                          </span>
                        </SelectItem>
                        <SelectItem value="beperkt">
                          <span className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-yellow-500" />
                            Beperkt risico
                          </span>
                        </SelectItem>
                        <SelectItem value="hoog">
                          <span className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-orange-500" />
                            Hoog risico
                          </span>
                        </SelectItem>
                        <SelectItem value="onaanvaardbaar">
                          <span className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-red-500" />
                            Onaanvaardbaar
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="purpose">Doel van Gebruik</Label>
                    <Textarea
                      id="purpose"
                      placeholder="Beschrijf waarvoor deze tool wordt gebruikt..."
                      value={formData.purpose}
                      onChange={(e) =>
                        setFormData({ ...formData, purpose: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={resetForm}>
                    Annuleren
                  </Button>
                  <Button onClick={handleSubmit} disabled={isPending}>
                    {isPending ? "Bezig..." : "Tool Opslaan"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Zoek op tool naam..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Filter className="h-4 w-4" />
                  {riskFilter === "all"
                    ? "Alle risicos"
                    : riskConfig[riskFilter].label}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setRiskFilter("all")}>
                  Alle risicos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRiskFilter("minimaal")}>
                  <span className="mr-2 h-2 w-2 rounded-full bg-emerald-500" />
                  Minimaal risico
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRiskFilter("beperkt")}>
                  <span className="mr-2 h-2 w-2 rounded-full bg-yellow-500" />
                  Beperkt risico
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRiskFilter("hoog")}>
                  <span className="mr-2 h-2 w-2 rounded-full bg-orange-500" />
                  Hoog risico
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setRiskFilter("onaanvaardbaar")}
                >
                  <span className="mr-2 h-2 w-2 rounded-full bg-red-500" />
                  Onaanvaardbaar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="rounded-lg border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tool Naam</TableHead>
                  <TableHead>Afdeling</TableHead>
                  <TableHead>Risico</TableHead>
                  <TableHead>Datum Toegevoegd</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Acties</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTools.map((tool) => (
                  <TableRow key={tool.id}>
                    <TableCell className="font-medium">{tool.name}</TableCell>
                    <TableCell>{tool.department}</TableCell>
                    <TableCell>
                      <Badge className={riskConfig[tool.risk].className}>
                        {riskConfig[tool.risk].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(tool.dateAdded).toLocaleDateString("nl-NL")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={tool.isCompliant}
                          onCheckedChange={() =>
                            handleToggleCompliance(tool.id)
                          }
                          disabled={isPending}
                        />
                        {tool.isCompliant ? (
                          <span className="flex items-center gap-1 text-sm text-emerald-600">
                            <CheckCircle2 className="h-4 w-4" />
                            Conform
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-sm text-red-600">
                            <AlertCircle className="h-4 w-4" />
                            Actie Vereist
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(tool)}
                          disabled={isPending}
                        >
                          <Pencil className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(tool.id)}
                          disabled={isPending}
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredTools.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-8 text-center text-muted-foreground"
                    >
                      {toolsLoaded ? "Geen tools gevonden" : "Tools laden..."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>
    </div>
  );
}
