"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Server,
  GraduationCap,
  FileText,
  Settings,
  HelpCircle,
  Shield,
  Users, // Toegevoegd voor het team-icoon
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Overzicht", href: "/dashboard", icon: LayoutDashboard },
  { name: "AI-Register", href: "/dashboard/register", icon: Server },
  { name: "Training", href: "/dashboard/training", icon: GraduationCap },
  { name: "Dossier", href: "/dashboard/dossier", icon: FileText },
  { name: "Team Beheer", href: "/dashboard/team", icon: Users }, // Hier is je nieuwe knop!
  { name: "Instellingen", href: "/dashboard/settings", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-border bg-card lg:block">
      <Link
        href="/"
        className="flex h-16 items-center gap-2 border-b border-border px-6 transition-opacity hover:opacity-80">
        <Shield className="h-7 w-7 text-primary" />
        <span className="text-lg font-bold text-foreground">AI-Comply.nl</span>
      </Link>

      <nav className="flex flex-col gap-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}>
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 border-t border-border p-4">
        <Link
          href="/dashboard/help"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <HelpCircle className="h-5 w-5" />
          Hulp & Support
        </Link>
      </div>
    </aside>
  );
}
