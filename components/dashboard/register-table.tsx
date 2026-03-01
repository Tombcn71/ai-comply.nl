"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  Plus,
  Search,
  Filter,
  ExternalLink,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AiTool {
  id: string;
  name: string;
  provider: string;
  department: string;
  riskLevel: "Minimaal risico" | "Beperkt risico" | "Hoog risico" | "Onaanvaardbaar";
  status: "compliant" | "pending" | "action";
  category: string;
  users: number;
  lastAudit: string;
  description: string;
}

const initialTools: AiTool[] = [
  {
    id: "1",
    name: "ChatGPT Enterprise",
    provider: "OpenAI",
    department: "Marketing",
    riskLevel: "Beperkt risico",
    status: "compliant",
    category: "Generatieve AI",
    users: 45,
    lastAudit: "15 jan 2026",
    description: "Tekstgeneratie en chatbot voor marketingcontent.",
  },
  {
    id: "2",
    name: "Microsoft Copilot",
    provider: "Microsoft",
    department: "Alle afdelingen",
    riskLevel: "Beperkt risico",
    status: "compliant",
    category: "Productiviteit",
    users: 120,
    lastAudit: "20 jan 2026",
    description: "AI-assistent geïntegreerd in Microsoft 365.",
  },
  {
    id: "3",
    name: "Jasper AI",
    provider: "Jasper",
    department: "Content",
    riskLevel: "Beperkt risico",
    status: "pending",
    category: "Generatieve AI",
    users: 12,
    lastAudit: "In behandeling",
    description: "AI-schrijftool voor marketingcontent en blogs.",
  },
  {
    id: "4",
    name: "Notion AI",
    provider: "Notion",
    department: "Product",
    riskLevel: "Minimaal risico",
    status: "compliant",
    category: "Productiviteit",
    users: 35,
    lastAudit: "10 jan 2026",
    description: "AI-functionaliteit binnen Notion werkruimte.",
  },
  {
    id: "5",
    name: "Midjourney",
    provider: "Midjourney Inc.",
    department: "Design",
    riskLevel: "Beperkt risico",
    status: "action",
    category: "Beeldgeneratie",
    users: 8,
    lastAudit: "Actie vereist",
    description: "AI-beeldgeneratie voor visueel ontwerp.",
  },
  {
    id: "6",
    name: "GitHub Copilot",
    provider: "GitHub / OpenAI",
    department: "Engineering",
    riskLevel: "Beperkt risico",
    status: "compliant",
    category: "Codegeneratie",
    users: 28,
    lastAudit: "12 jan 2026",
    description: "AI-codeerondersteuning in de IDE.",
  },
  {
    id: "7",
    name: "HR Screening Tool",
    provider: "Intern ontwikkeld",
    department: "HR",
    riskLevel: "Hoog risico",
    status: "action",
    category: "Besluitvorming",
    users: 5,
    lastAudit: "Actie vereist",
    description: "Intern AI-model voor het screenen van CV's.",
  },
  {
    id: "8",
    name: "Grammarly Business",
    provider: "Grammarly",
    department: "Communicatie",
    riskLevel: "Minimaal risico",
    status: "compliant",
    category: "Productiviteit",
    users: 60,
    lastAudit: "18 jan 2026",
    description: "AI-schrijfassistent voor grammatica en stijl.",
  },
  {
    id: "9",
    name: "Salesforce Einstein",
    provider: "Salesforce",
    department: "Sales",
    riskLevel: "Beperkt risico",
    status: "compliant",
    category: "Predictive Analytics",
    users: 15,
    lastAudit: "22 jan 2026",
    description: "AI-gedreven inzichten en voorspellingen in CRM.",
  },
  {
    id: "10",
    name: "Kredietbeoordeling AI",
    provider: "Intern ontwikkeld",
    department: "Finance",
    riskLevel: "Hoog risico",
    status: "pending",
    category: "Besluitvorming",
    users: 3,
    lastAudit: "In behandeling",
    description: "Geautomatiseerde kredietbeoordeling voor klanten.",
  },
];

const statusConfig = {
  compliant: {
    label: "Conform",
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  pending: {
    label: "In behandeling",
    icon: Clock,
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  action: {
    label: "Actie vereist",
    icon: AlertCircle,
    className: "bg-red-50 text-red-700 border-red-200",
  },
};

const riskConfig: Record<string, string> = {
  "Minimaal risico": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Beperkt risico": "bg-blue-50 text-blue-700 border-blue-200",
  "Hoog risico": "bg-red-50 text-red-700 border-red-200",
  "Onaanvaardbaar": "bg-red-100 text-red-900 border-red-300",
};

export function RegisterTable() {
  const [tools, setTools] = useState<AiTool[]>(initialTools);
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk =
      riskFilter === "all" || tool.riskLevel === riskFilter;
    const matchesStatus =
      statusFilter === "all" || tool.status === statusFilter;
    return matchesSearch && matchesRisk && matchesStatus;
  });

  const handleAddTool = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newTool: AiTool = {
      id: String(tools.length + 1),
      name: formData.get("name") as string,
      provider: formData.get("provider") as string,
      department: formData.get("department") as string,
      riskLevel: formData.get("riskLevel") as AiTool["riskLevel"],
      status: "pending",
      category: formData.get("category") as string,
      users: Number(formData.get("users")) || 0,
      lastAudit: "In behandeling",
      description: formData.get("description") as string,
    };
    setTools([...tools, newTool]);
    setDialogOpen(false);
  };

  return (
    <Card className="border-border">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-lg font-semibold">
            Alle AI-systemen
          </CardTitle>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5">
                <Plus className="h-4 w-4" />
                AI-systeem toevoegen
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Nieuw AI-systeem registreren</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddTool} className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Naam</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Bijv. ChatGPT Enterprise"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="provider">Leverancier</Label>
                    <Input
                      id="provider"
                      name="provider"
                      placeholder="Bijv. OpenAI"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="department">Afdeling</Label>
                    <Input
                      id="department"
                      name="department"
                      placeholder="Bijv. Marketing"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Categorie</Label>
                    <Input
                      id="category"
                      name="category"
                      placeholder="Bijv. Generatieve AI"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="users">Aantal gebruikers</Label>
                    <Input
                      id="users"
                      name="users"
                      type="number"
                      placeholder="0"
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="riskLevel">Risicoklassificatie</Label>
                  <select
                    id="riskLevel"
                    name="riskLevel"
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    required
                  >
                    <option value="Minimaal risico">Minimaal risico</option>
                    <option value="Beperkt risico">Beperkt risico</option>
                    <option value="Hoog risico">Hoog risico</option>
                    <option value="Onaanvaardbaar">Onaanvaardbaar</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Beschrijving</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Korte beschrijving van het AI-systeem en het gebruik..."
                    rows={3}
                    required
                  />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Annuleren
                    </Button>
                  </DialogClose>
                  <Button type="submit">Registreren</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Zoeken op naam, leverancier of afdeling..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Risiconiveau" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle risiconiveaus</SelectItem>
                <SelectItem value="Minimaal risico">Minimaal risico</SelectItem>
                <SelectItem value="Beperkt risico">Beperkt risico</SelectItem>
                <SelectItem value="Hoog risico">Hoog risico</SelectItem>
                <SelectItem value="Onaanvaardbaar">Onaanvaardbaar</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle statussen</SelectItem>
                <SelectItem value="compliant">Conform</SelectItem>
                <SelectItem value="pending">In behandeling</SelectItem>
                <SelectItem value="action">Actie vereist</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <th className="pb-3 pr-4">AI-systeem</th>
                <th className="pb-3 pr-4">Afdeling</th>
                <th className="pb-3 pr-4">Categorie</th>
                <th className="pb-3 pr-4">Risiconiveau</th>
                <th className="pb-3 pr-4">Gebruikers</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4">Laatste audit</th>
                <th className="pb-3">
                  <span className="sr-only">Acties</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTools.map((tool) => {
                const status =
                  statusConfig[tool.status as keyof typeof statusConfig];
                return (
                  <tr
                    key={tool.id}
                    className="text-sm transition-colors hover:bg-muted/50"
                  >
                    <td className="py-3.5 pr-4">
                      <div>
                        <p className="font-medium text-foreground">
                          {tool.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {tool.provider}
                        </p>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4 text-muted-foreground">
                      {tool.department}
                    </td>
                    <td className="py-3.5 pr-4">
                      <Badge variant="secondary" className="font-normal">
                        {tool.category}
                      </Badge>
                    </td>
                    <td className="py-3.5 pr-4">
                      <Badge
                        variant="outline"
                        className={`font-normal ${riskConfig[tool.riskLevel] || ""}`}
                      >
                        {tool.riskLevel}
                      </Badge>
                    </td>
                    <td className="py-3.5 pr-4 text-muted-foreground">
                      {tool.users}
                    </td>
                    <td className="py-3.5 pr-4">
                      <Badge
                        variant="outline"
                        className={`gap-1 font-normal ${status.className}`}
                      >
                        <status.icon className="h-3 w-3" />
                        {status.label}
                      </Badge>
                    </td>
                    <td className="py-3.5 pr-4 text-muted-foreground">
                      {tool.lastAudit}
                    </td>
                    <td className="py-3.5">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Acties openen</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Details bekijken
                          </DropdownMenuItem>
                          <DropdownMenuItem>Bewerken</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Verwijderen
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredTools.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-sm font-medium text-foreground">
                Geen resultaten gevonden
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Pas je filters of zoekopdracht aan.
              </p>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <p className="text-sm text-muted-foreground">
            {filteredTools.length} van {tools.length} AI-systemen
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
