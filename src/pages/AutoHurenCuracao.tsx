import { Link } from "react-router-dom";
import Layout, { useReveal, WHATSAPP } from "../components/Layout";

export default function AutoHurenCuracao() {
  const reveal = useReveal();
  return (
    <Layout>
      <header className="page-hero" style={{ "--hero-img": "url(/images/hero-cars.jpg)" } as React.CSSProperties}>
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <span className="eyebrow on-dark">Auto huren Curaçao</span>
          <h1>Auto huren op Curaçao zonder vooruitbetaling</h1>
          <p>
            Vergelijk huurauto's van lokale verhuurbedrijven, vraag online een categorie aan en betaal pas bij het ophalen.
          </p>
        </div>
      </header>

      <section className="section" ref={reveal}>
        <div className="container prose reveal" style={{ maxWidth: 860 }}>
          <p className="big">
            Zoek je een huurauto op Curaçao? Drive Curaçao maakt het makkelijk om lokale autoverhuurders te vergelijken
            zonder vooraf te betalen of meerdere bedrijven apart te moeten mailen.
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", margin: "28px 0 34px" }}>
            <Link className="btn btn-coral btn-lg" to="/cars">Bekijk beschikbare auto's</Link>
            <a className="btn btn-ghost btn-lg" href={WHATSAPP} target="_blank" rel="noreferrer">Vraag hulp via WhatsApp</a>
          </div>

          <h2>Waarom via Drive Curaçao huren?</h2>
          <ul className="list">
            <li>Geen vooruitbetaling — je betaalt het lokale verhuurbedrijf bij het ophalen.</li>
            <li>Duidelijke dagprijzen voor economy, compact, SUV, van en meer.</li>
            <li>Lokale verhuurbedrijven bevestigen je aanvraag per e-mail.</li>
            <li>Ondersteuning in Nederlands, Engels en Papiamentu.</li>
          </ul>

          <h2>Auto huren bij Hato Airport of in Willemstad</h2>
          <p>
            Veel bezoekers willen hun auto direct bij aankomst ophalen, bijvoorbeeld bij Hato Airport, of bij hun hotel
            of accommodatie in Willemstad. Kies je datums, vraag een autocategorie aan en vermeld je ophaallocatie of
            vluchtnummer. Het verhuurbedrijf bevestigt daarna de exacte details.
          </p>

          <h2>Hoe werkt het?</h2>
          <ol>
            <li>Kies je ophaal- en retourdatum.</li>
            <li>Selecteer een autocategorie, zoals economy, compact automatic of SUV.</li>
            <li>Stuur gratis je aanvraag in — zonder betaling vooraf.</li>
            <li>Het lokale verhuurbedrijf bevestigt de auto of een vergelijkbaar model.</li>
            <li>Je betaalt bij het ophalen volgens de voorwaarden van het verhuurbedrijf.</li>
          </ol>

          <div className="confirm" style={{ marginTop: 36, textAlign: "left" }}>
            <h2 style={{ fontSize: 22 }}>Klaar om een auto te huren?</h2>
            <p>
              Bekijk beschikbare auto's voor jouw reisdatums en stuur gratis een aanvraag. Je betaalt niets vandaag.
            </p>
            <Link className="btn btn-teal" to="/cars">Auto's bekijken</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
