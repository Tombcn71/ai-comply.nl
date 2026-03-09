'use client';

import { useState } from 'react';
import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { DashboardHeader } from '@/components/dashboard/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Users, UserPlus, Copy, Check, Loader2, AlertCircle } from 'lucide-react';
import { inviteTeamMemberAction, getTeamMembersAction } from '@/app/actions/team';
import { useEffect } from 'react';

interface TeamMember {
  id: string;
  email: string;
  role: string;
  created_at: Date;
}

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);
  const [tempPassword, setTempPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load team members on mount
  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    try {
      setIsLoadingMembers(true);
      const members = await getTeamMembersAction();
      setTeamMembers(members);
    } catch (err) {
      console.error('Error loading team members:', err);
      setError('Failed to load team members');
    } finally {
      setIsLoadingMembers(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      const result = await inviteTeamMemberAction(email);
      
      if (result.success) {
        setTempPassword(result.tempPassword || '');
        setSuccess(`User ${email} invited successfully. Share the temporary password below.`);
        setEmail('');
        await loadTeamMembers();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to invite team member');
      setTempPassword('');
    } finally {
      setIsLoading(false);
    }
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(tempPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="pl-0 pt-16 transition-all duration-300 lg:pl-64 lg:pt-0">
        <DashboardHeader />

        <main className="p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">Team Management</h1>
            <p className="text-muted-foreground">Manage your organization's team members</p>
          </div>

          {/* Invite New Member Card */}
          <Card className="mb-6 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                Invite Team Member
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInvite} className="space-y-4">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <input
                    type="email"
                    placeholder="colleague@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                  <Button type="submit" disabled={isLoading} className="gap-2">
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Inviting...
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4" />
                        Invite
                      </>
                    )}
                  </Button>
                </div>

                {error && (
                  <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-red-700">{error}</span>
                  </div>
                )}

                {success && tempPassword && (
                  <div className="space-y-3 rounded-lg border border-green-200 bg-green-50 p-4">
                    <p className="text-sm font-medium text-green-700">{success}</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 rounded bg-black/10 px-3 py-2 font-mono text-sm text-green-900">
                        {tempPassword}
                      </code>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={copyPassword}
                        className="gap-2"
                      >
                        {copied ? (
                          <>
                            <Check className="h-4 w-4" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Team Members Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                Team Members ({teamMembers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingMembers ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : teamMembers.length === 0 ? (
                <p className="text-center text-muted-foreground">No team members yet</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teamMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.email}</TableCell>
                        <TableCell>
                          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary capitalize">
                            {member.role}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(member.created_at).toLocaleDateString('nl-NL')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
