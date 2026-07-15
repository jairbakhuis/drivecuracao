import Layout, { useReveal, WHATSAPP } from "../components/Layout";

// Owners who land here go straight to the SuaveCars sign-up form, tagged so the
// signup is attributed to Drive Curaçao.
const SUAVECARS_SIGNUP = "https://saas.suavecars.com/admin/auth?signup=1&ref=drivecuracao";

const STEPS = [
  {
    title: "Bookings come to you",
    body: "Drive Curaçao sends booking requests from island visitors straight to your fleet — extra rentals without extra marketing.",
  },
  {
    title: "Run it all in one place",
    body: "Bookings, deposits, contracts and invoices, handled automatically in SuaveCars — the software behind Drive Curaçao. No more WhatsApp, paper and spreadsheets.",
  },
  {
    title: "Free to start",
    body: "Create your account, add your cars, and go live. No setup cost, no card needed — try it with your own fleet.",
  },
];

export default function ForRentalCompanies() {
  const reveal = useReveal();
  return (
    <Layout>
      <header className="page-hero" style={{ "--hero-img": "url(/images/hero-about.jpg)" } as React.CSSProperties}>
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <span className="eyebrow on-dark">For rental companies</span>
          <h1>Get more bookings — and run your whole rental in one place</h1>
          <p>List your cars on Drive Curaçao and manage everything with SuaveCars, the software built right here in Kòrsou for island rentals.</p>
        </div>
      </header>

      <section className="section" ref={reveal}>
        <div className="container prose reveal">
          <p className="big">
            Most rentals on the island still run on WhatsApp, paper contracts and a spreadsheet — losing
            bookings at night, deposits nobody chases, and hours retyping the same contracts.
          </p>
          <p>
            Drive Curaçao brings you the customers. SuaveCars runs the rest: bookings, deposits, contracts
            and invoices, all automated, in one place, from your phone.
          </p>

          <div className="steps" style={{ marginTop: 30 }}>
            {STEPS.map((s, i) => (
              <div className="step" key={s.title}>
                <span className="num">{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 34 }}>
            <a className="btn btn-coral btn-lg" href={SUAVECARS_SIGNUP} target="_blank" rel="noreferrer">Start free →</a>
            <a className="btn btn-ghost btn-lg" href={WHATSAPP} target="_blank" rel="noreferrer">Talk to us</a>
          </div>
        </div>
      </section>

      <section className="section-sm">
        <div className="container">
          <div className="cta-band" style={{ background: "linear-gradient(120deg, var(--coral), var(--gold))" }}>
            <div style={{ position: "relative", zIndex: 2 }}>
              <h2>Ready to fill more of your calendar?</h2>
              <p>Join the local rental companies already getting bookings through Drive Curaçao, powered by SuaveCars.</p>
              <a className="btn btn-dark btn-lg" href={SUAVECARS_SIGNUP} target="_blank" rel="noreferrer">List your cars — free</a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
