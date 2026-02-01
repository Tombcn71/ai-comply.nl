"use client";

import { useEffect, useState } from "react";
import { Clock, AlertTriangle } from "lucide-react";

export function UrgencyBanner() {
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    const deadline = new Date("2026-08-02T00:00:00");
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    setDaysLeft(days);
  }, []);

  return (
    <section className="bg-primary py-6">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center justify-center gap-4 text-center sm:flex-row sm:gap-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary-foreground" />
            <span className="font-semibold text-primary-foreground">
              Tijd dringt
            </span>
          </div>
          
          <div className="flex items-center gap-3 text-primary-foreground">
            <Clock className="h-5 w-5" />
            <span className="text-lg">
              Nog maar{" "}
              <span className="mx-1 inline-flex min-w-[3ch] items-center justify-center rounded bg-primary-foreground/20 px-2 py-0.5 font-mono font-bold tabular-nums">
                {daysLeft}
              </span>{" "}
              dagen tot de volledige handhaving van de AI-verordening.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
