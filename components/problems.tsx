import { EyeOff, GraduationCap, FileWarning } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const problems = [
  {
    icon: EyeOff,
    title: "Shadow AI",
    description:
      "Medewerkers gebruiken AI-tools zonder dat je het weet. ChatGPT, Copilot, Midjourney – ze draaien al binnen je organisatie. Zonder overzicht, geen controle.",
  },
  {
    icon: GraduationCap,
    title: "Wettelijke Scholingsplicht",
    description:
      "Artikel 4 van de AI Act verplicht je om medewerkers AI-geletterd te maken. Maar wie bijhoudt wie wat heeft geleerd? Precies, niemand.",
  },
  {
    icon: FileWarning,
    title: "Audit Stress",
    description:
      "Straks staat de inspectie voor de deur en heb je geen centraal dossier. Verspreide Excel-bestanden en losse e-mails zijn geen bewijslast.",
  },
];

export function Problems() {
  return (
    <section className="bg-card py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
            Herkenbaar?
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            De uitdagingen waar elke organisatie mee worstelt
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {problems.map((problem) => (
            <Card
              key={problem.title}
              className="group border-border bg-background transition-all hover:border-primary/30 hover:shadow-lg"
            >
              <CardContent className="p-8">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <problem.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-foreground">
                  {problem.title}
                </h3>
                <p className="leading-relaxed text-muted-foreground">
                  {problem.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
