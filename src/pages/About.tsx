import { Link } from "react-router-dom";
import Layout, { useReveal, WHATSAPP } from "../components/Layout";

export default function About() {
  const reveal = useReveal();
  return (
    <Layout>
      <header className="page-hero" style={{ "--hero-img": "url(/images/hero-about.jpg)" } as React.CSSProperties}>
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <span className="eyebrow on-dark">About us</span>
          <h1>The friendliest way to rent a car in Curaçao</h1>
          <p>One island. Many great local rental companies. One simple place to book them all.</p>
        </div>
      </header>

      <section className="section" ref={reveal}>
        <div className="container prose reveal">
          <p className="big">
            Drive Curaçao was born from a simple frustration: visitors landing on our beautiful island had
            to email and call a dozen different rental companies just to find an available car.
          </p>
          <p>
            We thought there should be a better way — one place where you can see cars from trusted local
            companies, compare them honestly, and book in a minute. No prepayment. No hidden booking fees.
            No faceless international call center. Just island cars, island prices, and island hospitality.
          </p>

          <h2>Local first, always</h2>
          <p>
            Every car on Drive Curaçao comes from a licensed rental company based right here in Curaçao.
            When you book, you're supporting a local business — and you get someone who actually knows the
            island, meets you at pickup, and can tell you the best beach to watch the sunset. Your money
            stays where you're spending your holiday.
          </p>

          <h2>How we keep it simple</h2>
          <p>
            You choose a category of car — economy, compact automatic, SUV — rather than hunting for one
            exact vehicle. The rental company then assigns you the best available car in that class when
            they confirm. It's flexible for them and fair for you, and it means you always get a well-kept
            car ready to go.
          </p>

          <h2>You're always in control</h2>
          <p>
            Searching and requesting is completely free. You pay the rental company directly at pickup,
            on their normal terms — we never touch your card. Plans changed? Cancel any time before pickup
            at no cost. And if you ever need a hand, we're a WhatsApp message away in English, Dutch or
            Papiamentu.
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 34 }}>
            <Link className="btn btn-coral btn-lg" to="/cars">Find a car</Link>
            <a className="btn btn-ghost btn-lg" href={WHATSAPP} target="_blank" rel="noreferrer">Talk to us</a>
          </div>
        </div>
      </section>

      <section className="section-sm">
        <div className="container">
          <div className="cta-band" style={{ background: "linear-gradient(120deg, var(--coral), var(--gold))" }}>
            <div style={{ position: "relative", zIndex: 2 }}>
              <h2>Own a rental company in Curaçao?</h2>
              <p>List your cars on Drive Curaçao and get extra bookings — powered by SuaveCars, so you run everything in one place.</p>
              <Link className="btn btn-dark btn-lg" to="/for-rental-companies">List your cars</Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
