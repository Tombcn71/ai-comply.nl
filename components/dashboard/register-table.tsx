"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  CheckCircle2,
  AlertCircle,
  Plus,
  Filter,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  ShieldAlert,
  ShieldCheck,
  ShieldMinus,
} from "lucide-react"

const tools = [
  {
    id: 1,
    name: "ChatGPT",
    department: "Marketing",
    riskLevel: "Beperkt risico",
    dateAdded: "15-1-2024",
    status: "compliant" as const,
  },
  {
    id: 2,
    name: "Midjourney",
    department: "Marketing",
    riskLevel: "Minimaal risico",
    dateAdded: "20-2-2024",
    status: "compliant" as const,
  },
  {
    id: 3,
    name: "Jasper",
    department: "Sales",
    riskLevel: "Minimaal risico",
    dateAdded: "10-3-2024",
    status: "action" as const,
  },
  {
    id: 4,
    name: "Recruiting-bot",
    department: "HR",
    riskLevel: "Hoog risico",
    dateAdded: "5-4-2024",
    status: "action" as const,
  },
]

const statusConfig = {
  compliant: {
    label: "Conform",
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  action: {
    label: "Actie Vereist",
    icon: AlertCircle,
    className: "bg-red-50 text-red-700 border-red-200",
  },
}

const riskConfig: Record<
  string,
  { icon: typeof ShieldAlert; className: string }
> = {
  "Hoog risico": {
    icon: ShieldAlert,
    className: "bg-red-50 text-red-700 border-red-200",
  },
  "Beperkt risico": {
    icon: ShieldMinus,
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  "Minimaal risico": {
    icon: ShieldCheck,
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
}

export function RegisterTable() {
  const [riskFilter, setRiskFilter] = useState("all")
  const [dialogOpen, setDialogOpen] = useState(false)

  const filteredTools =
    riskFilter === "all"
      ? tools
      : tools.filter((tool) => tool.riskLevel === riskFilter)

  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold">
          Geregistreerde AI-tools
        </CardTitle>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Alle risicos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle risicos</SelectItem>
                <SelectItem value="Hoog risico">Hoog risico</SelectItem>
                <SelectItem value="Beperkt risico">Beperkt risico</SelectItem>
                <SelectItem value="Minimaal risico">Minimaal risico</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Tool Toevoegen
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nieuwe AI-tool toevoegen</DialogTitle>
                <DialogDescription>
                  Voeg een nieuwe AI-tool toe aan het register van uw
                  organisatie.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="tool-name">Tool naam</Label>
                  <Input id="tool-name" placeholder="Bijv. ChatGPT" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="department">Afdeling</Label>
                  <Select>
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Selecteer afdeling" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="hr">HR</SelectItem>
                      <SelectItem value="it">IT</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="alle">Alle afdelingen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="risk">Risiconiveau</Label>
                  <Select>
                    <SelectTrigger id="risk">
                      <SelectValue placeholder="Selecteer risiconiveau" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minimaal">Minimaal risico</SelectItem>
                      <SelectItem value="beperkt">Beperkt risico</SelectItem>
                      <SelectItem value="hoog">Hoog risico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Annuleren
                </Button>
                <Button onClick={() => setDialogOpen(false)}>Toevoegen</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <th className="pb-3 pr-4">Tool Naam</th>
                <th className="pb-3 pr-4">Afdeling</th>
                <th className="pb-3 pr-4">Risico</th>
                <th className="pb-3 pr-4">Datum Toegevoegd</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 text-right">Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTools.map((tool) => {
                const status = statusConfig[tool.status]
                const risk = riskConfig[tool.riskLevel]
                return (
                  <tr key={tool.id} className="text-sm">
                    <td className="py-3.5 pr-4 font-medium text-foreground">
                      {tool.name}
                    </td>
                    <td className="py-3.5 pr-4 text-muted-foreground">
                      {tool.department}
                    </td>
                    <td className="py-3.5 pr-4">
                      {risk && (
                        <Badge
                          variant="outline"
                          className={`gap-1 font-normal ${risk.className}`}
                        >
                          <risk.icon className="h-3 w-3" />
                          {tool.riskLevel}
                        </Badge>
                      )}
                    </td>
                    <td className="py-3.5 pr-4 text-muted-foreground">
                      {tool.dateAdded}
                    </td>
                    <td className="py-3.5 pr-4">
                      {status && (
                        <Badge
                          variant="outline"
                          className={`gap-1 font-normal ${status.className}`}
                        >
                          <status.icon className="h-3 w-3" />
                          {status.label}
                        </Badge>
                      )}
                    </td>
                    <td className="py-3.5 text-right">
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
                          <DropdownMenuItem className="gap-2">
                            <Eye className="h-4 w-4" />
                            Bekijken
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Pencil className="h-4 w-4" />
                            Bewerken
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-destructive">
                            <Trash2 className="h-4 w-4" />
                            Verwijderen
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
