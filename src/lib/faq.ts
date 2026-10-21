import type { Service, Settings } from "./booking";

export type Faq = { q: string; a: string };

// FAQ für Seite und strukturierte Daten (FAQPage). Die Preis-Antwort entsteht aus den aktuellen Preisen im Admin.
export function buildFaqs(services: Service[], settings: Settings): Faq[] {
  const sorted = [...services].sort((a, b) => a.priceFrom - b.priceFrom);
  const cheapest = sorted[0];
  const priciest = sorted[sorted.length - 1];
  const priceAnswer =
    cheapest && priciest
      ? `Die Richtpreise für Kleinwagen reichen von CHF ${cheapest.priceFrom} (${cheapest.name}) bis CHF ${priciest.priceFrom} (${priciest.name}). Mittlere Autos kosten etwa ${Math.round((settings.sizeFactors.mittel - 1) * 100)} %, grosse etwa ${Math.round((settings.sizeFactors.gross - 1) * 100)} % mehr. Der Endpreis hängt vom Zustand ab und wird vorher abgesprochen.`
      : "Die aktuellen Richtpreise stehen im Abschnitt Pakete und Preise. Der Endpreis hängt vom Zustand ab und wird vorher abgesprochen.";

  return [
    { q: "Was kostet eine Autoaufbereitung in Frauenfeld?", a: priceAnswer },
    {
      q: "Wie buche ich einen Termin?",
      a: "Über das Anfrageformular auf dieser Seite: Paket, Fahrzeuggrösse und Wunschtermin wählen. Jeremia meldet sich persönlich, um den Termin zu bestätigen oder eine andere Zeit vorzuschlagen.",
    },
    {
      q: "Wie lange brauche ich ohne Auto?",
      a: "Aussen- und Innenpflege dauern ein paar Stunden. Die Komplettaufbereitung braucht einen Tag, Politur mit Keramik zwei Tage, weil die Versiegelung aushärten muss.",
    },
    {
      q: "Was ist der Unterschied zwischen Wachs und Keramik?",
      a: "Wachs gibt schönen Glanz und hält einige Wochen bis Monate. Eine Keramikversiegelung bildet eine harte Schutzschicht, die deutlich länger hält und die Pflege danach viel einfacher macht.",
    },
    {
      q: "Kann jeder Kratzer wegpoliert werden?",
      a: "Feine Kratzer und Waschstrassen-Swirls ja. Tiefe Kratzer, bei denen man den Fingernagel spürt, gehen meist bis in die Grundierung. Das schauen wir uns vor Ort an und sagen dir ehrlich, was möglich ist.",
    },
    {
      q: "Muss ich das Auto vorher ausräumen?",
      a: "Am besten ja, vor allem für die Innenraumpflege. Persönliche Sachen legen wir sonst in eine Box und geben sie dir bei der Abholung zurück.",
    },
    {
      q: "Wo ist jj.detailing01?",
      a: `In ${settings.address}. Die genaue Adresse bekommst du mit der Terminbestätigung.`,
    },
    {
      q: "Kann ich einen Termin verschieben?",
      a: "Klar. Melde dich bis 24 Stunden vorher, dann finden wir einen neuen Termin.",
    },
  ];
}
