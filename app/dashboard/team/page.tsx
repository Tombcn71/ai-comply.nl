"use client";

import { useState, useEffect } from "react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  UserPlus,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  Building2,
} from "lucide-react";
import {
  inviteTeamMemberAction,
  getTeamMembersAction,
} from "@/app/actions/team";
import { authClient, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function TeamPage() {
  const { data: session } = useSession();
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);
  const [tempPassword, setTempPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (session && !(session as any)?.session?.activeOrganizationId) {
      window.location.href = "/dashboard";
    }
  }, [session]);

  useEffect(() => {
    if ((session as any)?.session?.activeOrganizationId) {
      loadTeamMembers();
    }
  }, [session]);

  const loadTeamMembers = async () => {
    try {
      const members = await getTeamMembersAction();
      if (Array.isArray(members)) {
        setTeamMembers(members);
      }
    } catch (err) {
      console.error("Kon leden niet laden", err);
    } finally {
      setIsLoadingMembers(false);
    }
  };

  const createFirstOrg = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authClient.organization.create({
        name: "Mijn AI Bedrijf",
        slug: "ai-comp-" + Math.random().toString(36).slice(-4),
      });

      if (res.error) throw new Error(res.error.message);

      window.location.reload();
    } catch (err: any) {
      setError(
        err.message || "Database is te druk, probeer over 10 seconden opnieuw.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await inviteTeamMemberAction(email);

      // FIX VOOR TYPESCRIPT: || "" zorgt dat het altijd tekst is
      setTempPassword(res.tempPassword || "");

      setSuccess(true);
      setEmail("");
      await loadTeamMembers();
    } catch (err: any) {
      setError(err.message || "Uitnodigen mislukt");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="pl-0 pt-16 lg:pl-64 lg:pt-0">
        <DashboardHeader />

        <main className="p-6">
          <h1 className="text-2xl font-bold mb-6 text-foreground">
            Team Beheer
          </h1>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <Card className="mb-8 border-primary/20">
            <CardHeader>
              <CardTitle>Organisatie Status</CardTitle>
            </CardHeader>
            <CardContent>
              {teamMembers.length === 0 && !isLoadingMembers ? (
                <div className="text-center py-6">
                  <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="mb-4 text-muted-foreground">
                    Geen actieve organisatie gevonden.
                  </p>
                  <Button onClick={createFirstOrg} disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Activeer nu mijn Organisatie
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-green-600 font-bold">
                  <Check className="h-5 w-5" />
                  <span>Organisatie is succesvol gekoppeld.</span>
                </div>
              )}
            </CardContent>
          </Card>

          {teamMembers.length > 0 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Nieuw Lid Uitnodigen</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleInvite} className="flex gap-4">
                    <input
                      type="email"
                      placeholder="collega@email.nl"
                      className="flex-1 p-2 border rounded-md bg-background text-foreground"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Button type="submit" disabled={isLoading}>
                      Invite
                    </Button>
                  </form>

                  {tempPassword && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-sm text-green-800">
                        Wachtwoord voor collega:{" "}
                        <strong className="text-lg">{tempPassword}</strong>
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Teamleden ({teamMembers.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Rol</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teamMembers.map((m) => (
                        <TableRow key={m.id}>
                          <TableCell className="font-medium">
                            {m.email}
                          </TableCell>
                          <TableCell className="capitalize">{m.role}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
