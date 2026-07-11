import { Link } from "react-router-dom";
import Layout, { useReveal, WHATSAPP } from "../components/Layout";
import { IconChat } from "../components/Icons";
import { FAQS } from "../utils";

export default function Faq() {
  const reveal = useReveal();
  return (
    <Layout>
      <header className="page-hero" style={{ "--hero-img": "url(/images/hero-faq.jpg)" } as React.CSSProperties}>
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <span className="eyebrow on-dark">FAQ</span>
          <h1>Questions? We've got answers</h1>
          <p>Everything you need to know about renting a car in Curaçao with us.</p>
        </div>
      </header>

      <section className="section" ref={reveal}>
        <div className="container">
          <div className="faq reveal">
            {FAQS.map((f, i) => (
              <details key={i} open={i === 0}><summary>{f.q}</summary><p>{f.a}</p></details>
            ))}
          </div>

          <div className="confirm reveal" style={{ marginTop: 40 }}>
            <div className="big"><IconChat size={28} /></div>
            <h2 style={{ fontSize: 22 }}>Still have a question?</h2>
            <p>Message us on WhatsApp — we answer in English, Dutch and Papiamentu, usually within minutes.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 8 }}>
              <a className="btn btn-coral" href={WHATSAPP} target="_blank" rel="noreferrer">Chat on WhatsApp</a>
              <Link className="btn btn-ghost" to="/cars">Browse cars</Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
