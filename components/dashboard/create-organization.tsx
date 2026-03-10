"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function CreateOrganizationForm() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await authClient.organization.create({
        name: name.trim(),
      });
      // Refresh the page to load with the new organization
      router.refresh();
    } catch (error) {
      console.error("Failed to create organization:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-xl font-semibold mb-4">Organisatie aanmaken</h2>
      <form onSubmit={handleCreate} className="space-y-4">
        <div>
          <Label htmlFor="org-name">Organisatienaam</Label>
          <Input
            id="org-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Voer organisatienaam in"
            required
          />
        </div>
        <Button type="submit" disabled={loading || !name.trim()}>
          {loading ? "Aanmaken..." : "Organisatie aanmaken"}
        </Button>
      </form>
    </div>
  );
}