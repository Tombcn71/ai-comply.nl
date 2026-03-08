"use client";

import { useState, useEffect } from "react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { AlertTriangle, FileText, Upload, Users, TrendingUp, Plus } from "lucide-react";
import {
  getEmployeesAction,
  getCertificationStatsAction,
  certifyEmployeeAction,
  createEmployeeAction,
} from "@/app/actions/tools";

interface Employee {
  id: string;
  name: string;
  department: string;
  status: string;
  certificate_url?: string;
  certified_date?: string;
}

type Department = "Marketing" | "HR" | "IT" | "Sales";

export default function TrainingPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ total: 0, certified: 0, percentage: 0 });
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [certDate, setCertDate] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Form state for adding new employee
  const [newEmployeeForm, setNewEmployeeForm] = useState({
    name: "",
    department: "" as Department | "",
  });

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [empData, statsData] = await Promise.all([
        getEmployeesAction(),
        getCertificationStatsAction(),
      ]);
      setEmployees(empData);
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setCertDate("");
    setSelectedFile(null);
    setIsUploadOpen(true);
  };

  const handleUploadSubmit = async () => {
    if (!selectedEmployee || !certDate) return;

    try {
      const certificateUrl = selectedFile?.name || `cert_${selectedEmployee.name}`;
      await certifyEmployeeAction(selectedEmployee.id, certificateUrl);
      await loadData();
      setIsUploadOpen(false);
      setSelectedEmployee(null);
      setCertDate("");
      setSelectedFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save certification");
    }
  };

  const handleAddEmployee = async () => {
    if (!newEmployeeForm.name || !newEmployeeForm.department) {
      setError("Vul alle velden in");
      return;
    }

    try {
      await createEmployeeAction({
        name: newEmployeeForm.name,
        department: newEmployeeForm.department,
        status: "pending",
      });
      await loadData();
      setIsAddEmployeeOpen(false);
      setNewEmployeeForm({ name: "", department: "" });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add employee");
    }
  };

  const missingCertificates = employees.filter((e) => e.status !== "certified").length;

  // Calculate department-specific stats
  const departmentStats = employees.reduce(
    (acc, emp) => {
      const dept = emp.department;
      if (!acc[dept]) {
        acc[dept] = { total: 0, certified: 0 };
      }
      acc[dept].total++;
      if (emp.status === "certified") {
        acc[dept].certified++;
      }
      return acc;
    },
    {} as Record<string, { total: number; certified: number }>
  );

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="pl-0 pt-16 transition-all duration-300 lg:pl-64 lg:pt-0">
        <DashboardHeader />

        <main className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">AI-Geletterdheid Training</h1>
              <p className="text-muted-foreground">
                Beheer en monitor de AI-geletterdheid van je team conform Artikel 4 van de AI Act
              </p>
            </div>

            <Dialog open={isAddEmployeeOpen} onOpenChange={setIsAddEmployeeOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Medewerker Toevoegen
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Nieuwe Medewerker Toevoegen</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="emp-name">Naam</Label>
                    <Input
                      id="emp-name"
                      placeholder="Volledige naam"
                      value={newEmployeeForm.name}
                      onChange={(e) =>
                        setNewEmployeeForm({ ...newEmployeeForm, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="emp-dept">Afdeling</Label>
                    <Select
                      value={newEmployeeForm.department}
                      onValueChange={(value: Department) =>
                        setNewEmployeeForm({ ...newEmployeeForm, department: value })
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
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddEmployeeOpen(false);
                      setNewEmployeeForm({ name: "", department: "" });
                    }}
                  >
                    Annuleren
                  </Button>
                  <Button onClick={handleAddEmployee}>Toevoegen</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          {/* KPI Cards */}
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Totaal AI-Geletterd</p>
                    <p className="mt-1 text-3xl font-bold text-foreground">{stats.percentage}%</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {stats.certified} van {stats.total} medewerkers
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${stats.percentage}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            {Object.entries(departmentStats).slice(0, 2).map(([dept, data]) => {
              const percentage = data.total > 0 ? Math.round((data.certified / data.total) * 100) : 0;
              const colors = {
                Marketing: { bg: "bg-green-100", text: "text-green-600", bar: "bg-green-500" },
                Sales: { bg: "bg-orange-100", text: "text-orange-600", bar: "bg-orange-500" },
              };
              const color = colors[dept as keyof typeof colors] || {
                bg: "bg-blue-100",
                text: "text-blue-600",
                bar: "bg-blue-500",
              };

              return (
                <Card key={dept} className="border-border bg-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{dept}</p>
                        <p className={`mt-1 text-3xl font-bold ${color.text}`}>{percentage}%</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {data.certified} van {data.total} medewerkers
                        </p>
                      </div>
                      <div className={`flex h-12 w-12 items-center justify-center rounded-full ${color.bg}`}>
                        <TrendingUp className={`h-6 w-6 ${color.text}`} />
                      </div>
                    </div>
                    <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full ${color.bar} transition-all`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Action Banner */}
          {missingCertificates > 0 && (
            <div className="mb-6 flex items-center gap-3 rounded-lg border border-orange-200 bg-orange-50 px-4 py-3">
              <AlertTriangle className="h-5 w-5 flex-shrink-0 text-orange-500" />
              <p className="text-sm text-orange-800">
                Er missen nog certificaten voor{" "}
                <span className="font-semibold">{missingCertificates} medewerkers</span> om volledig
                aan de AI Act te voldoen.
              </p>
            </div>
          )}

          {/* Employee Table */}
          <Card className="border-border bg-card">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Medewerker</TableHead>
                    <TableHead className="text-muted-foreground">Afdeling</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground">Bewijsstuk</TableHead>
                    <TableHead className="text-right text-muted-foreground">Actie</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-8 text-center">
                        Laden...
                      </TableCell>
                    </TableRow>
                  ) : employees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                        Geen medewerkers gevonden
                      </TableCell>
                    </TableRow>
                  ) : (
                    employees.map((employee) => (
                      <TableRow key={employee.id} className="border-border">
                        <TableCell className="font-medium text-foreground">{employee.name}</TableCell>
                        <TableCell className="text-muted-foreground">{employee.department}</TableCell>
                        <TableCell>
                          {employee.status === "certified" ? (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                              Gecertificeerd
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-muted text-muted-foreground">
                              Niet getraind
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {employee.certificate_url ? (
                            <div className="flex items-center gap-2 text-primary">
                              <FileText className="h-4 w-4" />
                              <span className="text-sm">PDF</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUploadClick(employee)}
                            className="gap-2"
                          >
                            <Upload className="h-4 w-4" />
                            Certificaat
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Upload Modal */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Certificaat Uploaden</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="employee-name">Naam medewerker</Label>
              <Input
                id="employee-name"
                value={selectedEmployee?.name || ""}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cert-date">Datum behaald</Label>
              <Input
                id="cert-date"
                type="date"
                value={certDate}
                onChange={(e) => setCertDate(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Bewijsstuk</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("file-upload")?.click()}
                  className="gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Selecteer PDF/Afbeelding
                </Button>
                {selectedFile && (
                  <span className="text-sm text-muted-foreground">{selectedFile.name}</span>
                )}
              </div>
              <input
                id="file-upload"
                type="file"
                accept=".pdf,image/*"
                className="hidden"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
              Annuleren
            </Button>
            <Button onClick={handleUploadSubmit} disabled={!certDate}>
              Uploaden
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
