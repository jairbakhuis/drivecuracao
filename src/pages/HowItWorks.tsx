import { Link } from "react-router-dom";
import Layout, { useReveal } from "../components/Layout";
import { PageScene } from "../components/Brand";

const STEPS = [
  { n: 1, t: "Search your dates", d: "Enter your pick-up and return dates. We instantly show the car categories available from local rental companies across Curaçao — with clear per-day prices." },
  { n: 2, t: "Request a category", d: "Choose the type of car you want and fill in a short form. It takes under a minute and costs nothing — you're sending a free booking request, not paying." },
  { n: 3, t: "Get confirmed", d: "The rental company checks availability and confirms by email, with the pickup location and the specific car (or similar) you'll get. If anything's unclear, we're on WhatsApp." },
  { n: 4, t: "Pick up & pay", d: "Meet the company at pickup — often at or near the airport — show your license and ID, and pay them directly on their normal terms. Then go enjoy the island!" },
];

export default function HowItWorks() {
  const reveal = useReveal();
  return (
    <Layout>
      <header className="page-hero">
        <PageScene />
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <span className="eyebrow on-dark">How it works</span>
          <h1>From search to sunshine in four steps</h1>
          <p>Booking a car with Drive Curaçao is quick, free, and refreshingly simple.</p>
        </div>
      </header>

      <section className="section" ref={reveal}>
        <div className="container" style={{ maxWidth: 820 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {STEPS.map((s) => (
              <div key={s.n} className="step reveal" style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 20, alignItems: "start" }}>
                <div className="num" style={{ margin: 0 }}>{s.n}</div>
                <div><h3>{s.t}</h3><p>{s.d}</p></div>
              </div>
            ))}
          </div>

          <div className="confirm reveal" style={{ marginTop: 40, textAlign: "left" }}>
            <h2 style={{ fontSize: 22 }}>Why book a category, not a specific car?</h2>
            <p style={{ marginTop: 10 }}>
              Local companies rotate their fleet to keep every car well-maintained. By booking a
              category — say "Compact automatic" — you're guaranteed a car of that type in great
              condition, rather than waiting on one exact vehicle that might be out for service. You get
              flexibility and reliability; they get to give you their best available car.
            </p>
          </div>

          <div style={{ textAlign: "center", marginTop: 36 }}>
            <Link className="btn btn-coral btn-lg" to="/cars">Find your car now</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
