export default function DataPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="pl-0 pt-16 transition-all duration-300 lg:pl-64 lg:pt-0">
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-5xl pb-7 font-bold text-foreground">
              Deze app is "100% EU made and based" en dat was simpeler dan ik
              had gedacht
            </h1>
            <p className="text-muted-foreground">
              Wij hebben een app onwikkelde waarbij we alles volledig in de eu
              hebben draaien in europa. Vaak word gezegd dat je afhankelijk
              bent, er is geen infrastructuur etc. Onzin!
              <br /> Maar na een korte inventarisatie kon ik dit vrij siple
              opzetten met "europese infrastructuur"
              <br /> We hebben top hosting in europa, we hebben betalings
              platfrmen en authenticatie kan je makkelijk zelf bouwen en ook op
              je eigen servers draaien. <br />
              Dit gezegd hebbende moet ik melden dat deze app geen "Heavy data"
              opslaat zoals bsn nummers of bankgegevens, we slaan nog minder op
              dan een gemiddeld LMS platform dus er valt in principe niets te
              halen. <br />
              Desondanks vind ik dat het belangrijk is om zelfbeschikking te
              hebben over de data van ons ai gebruik vandaar deze opzet.
            </p>
          </div>
          <h2 className="text-2xl font-bold text-foreground">De data opslag</h2>
          <p>
            Onze database word gehost binnen de eu, net over de grens bij
            hetzner in Duitsland
          </p>{" "}
          <h2 className="text-2xl pt-6 font-bold text-foreground">
            Authenticatie
          </h2>
          <p>
            Wij hebben authenticatie niet uitbesteed aan een derde partij maar
            zelf ontwikkeld, dit draait volledig autonoom op onze server in
            duitsland
          </p>
          <h2 className="text-2xl pt-6 font-bold text-foreground">
            Betalings systeem
          </h2>
          <p>
            Ook ons betalingssysteem is van europese makelij, namelijk ons eigen
            Nederlandse mollie
          </p>{" "}
          <h2 className="text-3xl pt-6 font-bold text-foreground">
            Conclusie{" "}
          </h2>
          <p>
            Ik ben zeker voor mezelf niet op zoek naar alternatieven want ik
            vind het heerlijk om met vercel, strpe, neon, google en noem ze
            allemaal maar op te werken en dat blijf ik ook doen. Maar voor
            sommige projecten zijn er bepalde vereisten of is de zeitgeist op
            dit moment dat willen we in de eu hoden maar we kunnen het niet.
            Contacten zus en zo. Dit bleek voor mij totale onzin. Het ging
            allemaal vrij simpel en ieder land in de eu heeft zo zijn
            specialismes. Duitsland prima hosting, nederland goede betaal
            systemen. Frankrijk heeft in principe alles van betaalsystemen tot
            AI modellen, de toekomst ziet er wat mij betreft prima uit.
          </p>
          <div className="mt-6 grid gap-6 lg:grid-cols-3"></div>
        </main>
      </div>
    </div>
  );
}
