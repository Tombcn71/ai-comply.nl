import { LayoutGrid, Activity, FileCheck, Check } from "lucide-react";

const solutions = [
  {
    icon: LayoutGrid,
    title: "Het Automatische AI-Register",
    description:
      "Zie welke tools er binnen je bedrijf draaien. Van ChatGPT tot interne ML-modellen – alles in één overzicht.",
    features: [
      "Automatische detectie van AI-tools",
      "Risicoklassificatie per systeem",
      "Inzicht in datastromen",
    ],
  },
  {
    icon: Activity,
    title: "De Compliance-Monitor",
    description:
      "Volg de AI-geletterdheid van je team live. Wie heeft welke training afgerond? Real-time inzicht.",
    features: [
      "Live dashboard per afdeling",
      "Automatische herinneringen",
      "Certificaten & rapportages",
    ],
  },
  {
    icon: FileCheck,
    title: "Eén Knop voor de Inspectie",
    description:
      "Genereer direct een volledig PDF-dossier met alle bewijslast. Geen paniek bij een audit.",
    features: [
      "Compleet bewijs-dossier",
      "Audit-trail ingebouwd",
      "Export in 1 klik",
    ],
  },
];

export function Solutions() {
  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
            De Oplossing
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Drie modules. Eén platform. Volledige compliance.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            AIBewijs.nl automatiseert alles wat je nodig hebt om te voldoen aan de AI Act.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {solutions.map((solution, index) => (
            <div
              key={solution.title}
              className="group relative flex flex-col rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/30 hover:shadow-xl"
            >
              <div className="absolute -top-4 left-8 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {index + 1}
              </div>

              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <solution.icon className="h-7 w-7" />
              </div>

              <h3 className="mb-3 text-xl font-semibold text-foreground">
                {solution.title}
              </h3>

              <p className="mb-6 flex-1 leading-relaxed text-muted-foreground">
                {solution.description}
              </p>

              <ul className="space-y-3">
                {solution.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-foreground">
                    <Check className="h-4 w-4 shrink-0 text-accent" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
