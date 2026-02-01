"use client";

import { useState } from "react";
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
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertTriangle, FileText, Upload, Users, TrendingUp } from "lucide-react";

interface Employee {
  id: number;
  name: string;
  department: string;
  status: "certified" | "not_trained";
  certificate: string | null;
  certifiedDate: string | null;
}

const initialEmployees: Employee[] = [
  {
    id: 1,
    name: "Jan de Vries",
    department: "Marketing",
    status: "certified",
    certificate: "cert_jan_devries.pdf",
    certifiedDate: "2025-11-15",
  },
  {
    id: 2,
    name: "Lisa Bakker",
    department: "Marketing",
    status: "certified",
    certificate: "cert_lisa_bakker.pdf",
    certifiedDate: "2025-10-22",
  },
  {
    id: 3,
    name: "Pieter Jansen",
    department: "Sales",
    status: "not_trained",
    certificate: null,
    certifiedDate: null,
  },
  {
    id: 4,
    name: "Emma Visser",
    department: "Sales",
    status: "certified",
    certificate: "cert_emma_visser.pdf",
    certifiedDate: "2025-12-01",
  },
  {
    id: 5,
    name: "Thomas Mulder",
    department: "IT",
    status: "certified",
    certificate: "cert_thomas_mulder.pdf",
    certifiedDate: "2025-09-10",
  },
  {
    id: 6,
    name: "Sophie van Dijk",
    department: "HR",
    status: "not_trained",
    certificate: null,
    certifiedDate: null,
  },
  {
    id: 7,
    name: "Mark Hendriks",
    department: "Sales",
    status: "not_trained",
    certificate: null,
    certifiedDate: null,
  },
  {
    id: 8,
    name: "Anna de Boer",
    department: "Finance",
    status: "certified",
    certificate: "cert_anna_deboer.pdf",
    certifiedDate: "2025-11-28",
  },
  {
    id: 9,
    name: "Sander Smit",
    department: "Operations",
    status: "not_trained",
    certificate: null,
    certifiedDate: null,
  },
  {
    id: 10,
    name: "Eva Meijer",
    department: "Marketing",
    status: "certified",
    certificate: "cert_eva_meijer.pdf",
    certifiedDate: "2025-10-05",
  },
];

export default function TrainingPage() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [certDate, setCertDate] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const certifiedCount = employees.filter((e) => e.status === "certified").length;
  const totalCount = employees.length;
  const overallPercentage = Math.round((certifiedCount / totalCount) * 100);

  const marketingEmployees = employees.filter((e) => e.department === "Marketing");
  const marketingCertified = marketingEmployees.filter((e) => e.status === "certified").length;
  const marketingPercentage = Math.round((marketingCertified / marketingEmployees.length) * 100);

  const salesEmployees = employees.filter((e) => e.department === "Sales");
  const salesCertified = salesEmployees.filter((e) => e.status === "certified").length;
  const salesPercentage = Math.round((salesCertified / salesEmployees.length) * 100);

  const missingCertificates = employees.filter((e) => e.status === "not_trained").length;

  const handleUploadClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setCertDate("");
    setSelectedFile(null);
    setIsUploadOpen(true);
  };

  const handleUploadSubmit = () => {
    if (selectedEmployee && certDate) {
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === selectedEmployee.id
            ? {
                ...emp,
                status: "certified" as const,
                certificate: `cert_${emp.name.toLowerCase().replace(" ", "_")}.pdf`,
                certifiedDate: certDate,
              }
            : emp
        )
      );
      setIsUploadOpen(false);
      setSelectedEmployee(null);
      setCertDate("");
      setSelectedFile(null);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="pl-0 pt-16 transition-all duration-300 lg:pl-64 lg:pt-0">
        <DashboardHeader />

        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">AI-Geletterdheid Training</h1>
            <p className="text-muted-foreground">
              Beheer en monitor de AI-geletterdheid van je team conform Artikel 4 van de AI Act
            </p>
          </div>

          {/* KPI Cards */}
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Totaal AI-Geletterd</p>
                    <p className="mt-1 text-3xl font-bold text-foreground">{overallPercentage}%</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {certifiedCount} van {totalCount} medewerkers
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${overallPercentage}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Marketing</p>
                    <p className="mt-1 text-3xl font-bold text-green-600">{marketingPercentage}%</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {marketingCertified} van {marketingEmployees.length} medewerkers
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-green-500 transition-all"
                    style={{ width: `${marketingPercentage}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Sales</p>
                    <p className="mt-1 text-3xl font-bold text-orange-500">{salesPercentage}%</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {salesCertified} van {salesEmployees.length} medewerkers
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                    <AlertTriangle className="h-6 w-6 text-orange-500" />
                  </div>
                </div>
                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-orange-500 transition-all"
                    style={{ width: `${salesPercentage}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Banner */}
          {missingCertificates > 0 && (
            <div className="mb-6 flex items-center gap-3 rounded-lg border border-orange-200 bg-orange-50 px-4 py-3">
              <AlertTriangle className="h-5 w-5 flex-shrink-0 text-orange-500" />
              <p className="text-sm text-orange-800">
                Er missen nog certificaten voor <span className="font-semibold">{missingCertificates} medewerkers</span> om
                volledig aan de AI Act te voldoen.
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
                  {employees.map((employee) => (
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
                        {employee.certificate ? (
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
                          Certificaat Uploaden
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
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
