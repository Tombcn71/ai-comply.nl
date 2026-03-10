"use client";

import React from "react"

import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Building2, Upload, Lock, Check } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useEffect } from "react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => {
    if (session && !(session as any)?.session?.activeOrganizationId) {
      window.location.href = "/dashboard";
    }
  }, [session]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleUpdatePassword = () => {
    if (newPassword === confirmPassword && newPassword.length > 0) {
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <div className="pl-0 pt-16 transition-all duration-300 lg:pl-64 lg:pt-0">
        <DashboardHeader />
        <main className="p-4 lg:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
              Instellingen
            </h1>
            <p className="mt-1 text-muted-foreground">
              Beheer uw basisgegevens en accountbeveiliging.
            </p>
          </div>

          <div className="mx-auto max-w-2xl space-y-8">
            {/* Bedrijfsprofiel Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Bedrijfsprofiel
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Deze gegevens worden gebruikt voor de header van gegenereerde
                  PDF-rapporten.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Bedrijfsnaam</Label>
                  <Input
                    id="company-name"
                    placeholder="Voer uw bedrijfsnaam in"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Bedrijfslogo</Label>
                  <div className="flex items-center gap-4">
                    <div className="flex h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted">
                      {logoPreview ? (
                        <img
                          src={logoPreview || "/placeholder.svg"}
                          alt="Logo preview"
                          className="h-full w-full rounded-lg object-contain p-2"
                        />
                      ) : (
                        <Upload className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label
                        htmlFor="logo-upload"
                        className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                      >
                        <Upload className="h-4 w-4" />
                        Logo uploaden
                      </Label>
                      <input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoUpload}
                      />
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG of SVG (max. 2MB)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-person">Contactpersoon</Label>
                  <Input
                    id="contact-person"
                    placeholder="Naam van de contactpersoon"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Accountbeveiliging Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  Accountbeveiliging
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Wijzig uw wachtwoord om uw account veilig te houden.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Huidig Wachtwoord</Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="Voer uw huidige wachtwoord in"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">Nieuw Wachtwoord</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Voer een nieuw wachtwoord in"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">
                    Bevestig Nieuw Wachtwoord
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Bevestig uw nieuwe wachtwoord"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleUpdatePassword}
                  disabled={
                    !currentPassword ||
                    !newPassword ||
                    newPassword !== confirmPassword
                  }
                  className="mt-2"
                >
                  {passwordSuccess ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Wachtwoord Bijgewerkt
                    </>
                  ) : (
                    "Wachtwoord Bijwerken"
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button onClick={handleSaveProfile} className="px-8">
                {saveSuccess ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Opgeslagen
                  </>
                ) : (
                  "Opslaan"
                )}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
