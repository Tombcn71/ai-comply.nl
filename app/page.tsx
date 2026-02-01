import { CountdownBanner } from "@/components/countdown-banner";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Problems } from "@/components/problems";
import { Solutions } from "@/components/solutions";
import { UrgencyBanner } from "@/components/urgency-banner";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <CountdownBanner />
      <Header />
      <Hero />
      <Problems />
      <Solutions />
      <UrgencyBanner />
      <Footer />
    </main>
  );
}
