import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout, { useReveal, WHATSAPP } from "../components/Layout";
import { HeroScene, CarIllustration } from "../components/Brand";
import { CategoryOffer, listCategories, formatPrice } from "../api";
import { todayPlus, daysBetween, FAQS } from "../utils";

const Check = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
);

const SAMPLE: { name: string; desc: string; price: string }[] = [
  { name: "Economy", desc: "Small, easy to park, great on fuel — perfect for exploring the island.", price: "ƒ75" },
  { name: "Compact automatic", desc: "Comfortable automatic for relaxed island driving.", price: "ƒ90" },
  { name: "SUV", desc: "Higher seating and space for the family, beach gear and coolers.", price: "ƒ120" },
];

export default function Home() {
  const nav = useNavigate();
  const reveal = useReveal();
  const [pickupDate, setPickupDate] = useState(todayPlus(3));
  const [returnDate, setReturnDate] = useState(todayPlus(8));
  const [offers, setOffers] = useState<CategoryOffer[] | null>(null);
  const rentalDays = daysBetween(pickupDate, returnDate);
  const datesValid = pickupDate < returnDate;

  useEffect(() => { listCategories().then((r) => setOffers(r.categories)).catch(() => setOffers([])); }, []);

  const search = () => nav(`/cars?pickup=${pickupDate}&return=${returnDate}`);
  const popular = (offers && offers.length > 0 ? offers.slice(0, 6) : null);

  return (
    <Layout onHero>
      {/* HERO */}
      <header className="hero">
        <HeroScene />
        <div className="container hero-inner">
          <div className="hero-copy">
            <span className="hero-badge">🌴 Local rental cars · Willemstad &amp; island-wide</span>
            <h1>Rent a car in Curaçao, <span className="u">the easy way</span>.</h1>
            <p className="lead">
              Compare cars from trusted local rental companies in one place. Transparent prices, free
              cancellation, and you pay at pickup — no prepayment, no surprises.
            </p>
            <div className="hero-ticks">
              <span><Check /> Licensed local companies</span>
              <span><Check /> Pay at pickup</span>
              <span><Check /> Free cancellation</span>
            </div>
          </div>

          <div className="search-card">
            <div className="search-grid">
              <div className="field">
                <label>📅 Pick-up date</label>
                <input type="date" value={pickupDate} min={todayPlus(0)} onChange={(e) => setPickupDate(e.target.value)} />
              </div>
              <div className="field">
                <label>📅 Return date</label>
                <input type="date" value={returnDate} min={pickupDate} onChange={(e) => setReturnDate(e.target.value)} />
              </div>
              <button className="btn btn-coral btn-lg" onClick={search} disabled={!datesValid}>
                Search cars
              </button>
            </div>
            <p className="search-note">🔒 Free to search · {rentalDays} day{rentalDays !== 1 ? "s" : ""} selected · you only pay the rental company at pickup</p>
          </div>
        </div>
        <svg className="wave" viewBox="0 0 1440 70" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 40 Q 360 0 720 34 T 1440 30 V70 H0 Z" fill="var(--sand)" />
        </svg>
      </header>

      {/* TRUST BAR */}
      <section className="trustbar">
        <div className="container trustbar-inner">
          <div className="trust-item"><span className="n">100%</span><span className="l">Licensed local partners</span></div>
          <div className="trust-sep" />
          <div className="trust-item"><span className="n">0</span><span className="l">Prepayment — pay at pickup</span></div>
          <div className="trust-sep" />
          <div className="trust-item"><span className="n">3</span><span className="l">Languages: EN · NL · PAP</span></div>
          <div className="trust-sep" />
          <div className="trust-item"><span className="n">24/7</span><span className="l">WhatsApp support</span></div>
        </div>
      </section>

      <div ref={reveal}>
        {/* HOW IT WORKS */}
        <section className="section" id="how">
          <div className="container">
            <div className="section-head reveal">
              <span className="eyebrow">How it works</span>
              <h2>Book a car in three easy steps</h2>
              <p>No account, no prepayment. From search to keys in your hand.</p>
            </div>
            <div className="steps">
              <div className="step reveal"><div className="num">1</div><h3>Search your dates</h3><p>Tell us when you land and leave. We show cars available from local companies across Curaçao.</p></div>
              <div className="step reveal"><div className="num">2</div><h3>Request a category</h3><p>Pick the type of car you want — economy, automatic, SUV — and send a free request in under a minute.</p></div>
              <div className="step reveal"><div className="num">3</div><h3>Pick up &amp; drive</h3><p>The rental company confirms, meets you at pickup, and you pay them directly. Enjoy the island!</p></div>
            </div>
          </div>
        </section>

        {/* WHY */}
        <section className="section" style={{ background: "var(--sand-2)" }}>
          <div className="container">
            <div className="section-head reveal">
              <span className="eyebrow">Why Drive Curaçao</span>
              <h2>Everything a visitor actually wants</h2>
            </div>
            <div className="why">
              <div className="benefit reveal"><div className="ic">🏝️</div><div><h3>One island, one place</h3><p>Compare cars from many local companies side by side instead of calling around.</p></div></div>
              <div className="benefit reveal"><div className="ic">💳</div><div><h3>No prepayment</h3><p>Pay the rental company at pickup on their normal terms. We never charge your card.</p></div></div>
              <div className="benefit reveal"><div className="ic">🔎</div><div><h3>Honest prices</h3><p>Clear per-day pricing with no hidden booking fees added on top.</p></div></div>
              <div className="benefit reveal"><div className="ic">💬</div><div><h3>Real local help</h3><p>Message us on WhatsApp in English, Dutch or Papiamentu and get a fast, human answer.</p></div></div>
            </div>
          </div>
        </section>

        {/* POPULAR CATEGORIES */}
        <section className="section">
          <div className="container">
            <div className="section-head reveal">
              <span className="eyebrow">Popular cars</span>
              <h2>Choose your ride</h2>
              <p>From nippy economy runabouts to family SUVs — book a category, get that car or similar.</p>
            </div>
            <div className="cats">
              {popular ? (
                popular.map((o, i) => (
                  <article key={`${o.tenant_id}-${o.category_id}`} className="cat-card reveal">
                    <div className="cat-media">
                      {o.image_url ? <img src={o.image_url} alt={o.name} loading="lazy" /> : <CarIllustration variant={i} />}
                      <span className="cat-tag">Local partner</span>
                    </div>
                    <div className="cat-body">
                      <h3>{o.name}</h3>
                      <p className="cat-similar">or similar — assigned at confirmation</p>
                      {o.description && <p className="cat-desc">{o.description}</p>}
                      <div className="cat-foot">
                        <div className="cat-price">
                          {o.from_price != null ? <><b>{formatPrice(o.from_price, o.currency)}</b><span>per day, from</span></> : <b style={{ fontSize: 16 }}>On request</b>}
                        </div>
                        <Link className="btn btn-teal" to={`/cars?pickup=${pickupDate}&return=${returnDate}`}>Book</Link>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                SAMPLE.map((s, i) => (
                  <article key={s.name} className="cat-card reveal">
                    <div className="cat-media"><CarIllustration variant={i} /><span className="cat-tag">Coming soon</span></div>
                    <div className="cat-body">
                      <h3>{s.name}</h3>
                      <p className="cat-similar">or similar — assigned at confirmation</p>
                      <p className="cat-desc">{s.desc}</p>
                      <div className="cat-foot">
                        <div className="cat-price"><b>{s.price}</b><span>per day, from</span></div>
                        <Link className="btn btn-teal" to="/cars">View</Link>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
            <div style={{ textAlign: "center", marginTop: 34 }}>
              <Link className="btn btn-ghost btn-lg" to="/cars">See all available cars →</Link>
            </div>
          </div>
        </section>

        {/* LOCAL SPLIT */}
        <section className="section" style={{ background: "var(--sand-2)" }}>
          <div className="container split">
            <div className="split-media reveal" aria-hidden="true">
              <LocalIllustration />
            </div>
            <div className="reveal">
              <span className="eyebrow">Proudly local</span>
              <h2>Built in Curaçao, for Curaçao</h2>
              <p>
                Drive Curaçao isn't a faceless global booking site. We partner with the island's own
                licensed rental companies — the people who actually meet you at pickup and know the best
                road to Playa Kenepa.
              </p>
              <ul className="list">
                <li><Check /> Prices in guilders (ƒ) or dollars — your choice</li>
                <li><Check /> Support in Nederlands, English &amp; Papiamentu</li>
                <li><Check /> Every partner is a licensed local business</li>
                <li><Check /> Your money stays on the island</li>
              </ul>
              <Link className="btn btn-teal btn-lg" to="/about" style={{ marginTop: 22 }}>Our story</Link>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="section">
          <div className="container">
            <div className="section-head reveal">
              <span className="eyebrow">Loved by visitors</span>
              <h2>What travelers say</h2>
            </div>
            <div className="quotes">
              <div className="quote reveal"><div className="stars">★★★★★</div><p>"Booked in two minutes, picked up the car right at the airport, paid on the spot. So much easier than emailing five companies."</p><div className="who"><span className="av">L</span><div><b>Lisa M.</b><span>Netherlands · Compact</span></div></div></div>
              <div className="quote reveal"><div className="stars">★★★★★</div><p>"Loved that there was no prepayment. The local company was friendly and the price was exactly what the site showed."</p><div className="who"><span className="av">D</span><div><b>Daniel R.</b><span>USA · SUV</span></div></div></div>
              <div className="quote reveal"><div className="stars">★★★★★</div><p>"WhatsApp answered in Papiamentu within minutes and sorted an automatic for us. Highly recommend for the island."</p><div className="who"><span className="av">S</span><div><b>Shanice B.</b><span>Curaçao · Automatic</span></div></div></div>
            </div>
          </div>
        </section>

        {/* FAQ PREVIEW */}
        <section className="section" style={{ background: "var(--sand-2)" }}>
          <div className="container">
            <div className="section-head reveal">
              <span className="eyebrow">Good to know</span>
              <h2>Frequently asked questions</h2>
            </div>
            <div className="faq reveal">
              {FAQS.slice(0, 4).map((f, i) => (
                <details key={i} open={i === 0}><summary>{f.q}</summary><p>{f.a}</p></details>
              ))}
              <div style={{ textAlign: "center", marginTop: 22 }}>
                <Link className="btn btn-ghost" to="/faq">All questions →</Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-sm">
          <div className="container">
            <div className="cta-band reveal" style={{ background: "linear-gradient(120deg, var(--ocean), var(--teal))" }}>
              <CtaGlow />
              <div style={{ position: "relative", zIndex: 2 }}>
                <h2>Ready to explore the island?</h2>
                <p>Find your rental car in under a minute. Free to search, pay at pickup.</p>
                <div className="btns">
                  <button className="btn btn-coral btn-lg" onClick={search}>Search cars</button>
                  <a className="btn btn-ghost-light btn-lg" href={WHATSAPP} target="_blank" rel="noreferrer">Chat on WhatsApp</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

function CtaGlow() {
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 1000 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <circle cx="120" cy="40" r="160" fill="#ffffff" opacity="0.06" />
      <circle cx="900" cy="280" r="200" fill="var(--gold)" opacity="0.14" />
    </svg>
  );
}

function LocalIllustration() {
  return (
    <svg viewBox="0 0 560 420" preserveAspectRatio="xMidYMid slice" style={{ width: "100%", height: "100%" }} aria-hidden="true">
      <defs>
        <linearGradient id="lsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0a6076" /><stop offset="1" stopColor="#12a99b" /></linearGradient>
      </defs>
      <rect width="560" height="420" fill="url(#lsky)" />
      <circle cx="440" cy="90" r="52" fill="var(--gold)" />
      {/* Handelskade-style colorful houses */}
      <g>
        {["#ff8a5b", "#ffc63f", "#0fb3a6", "#ff6f52", "#7fe0d6", "#ffb020"].map((c, i) => (
          <g key={i} transform={`translate(${40 + i * 82} 190)`}>
            <rect width="70" height="120" fill={c} />
            <path d="M0 0 L35 -26 L70 0 Z" fill="#06303f" opacity="0.85" />
            <rect x="12" y="24" width="16" height="22" fill="#ffffff" opacity="0.8" />
            <rect x="42" y="24" width="16" height="22" fill="#ffffff" opacity="0.8" />
            <rect x="26" y="70" width="18" height="50" fill="#06303f" opacity="0.7" />
          </g>
        ))}
      </g>
      {/* waterline */}
      <rect y="310" width="560" height="110" fill="#0d8f8c" />
      <g stroke="#bff3ec" strokeWidth="3" strokeLinecap="round" opacity="0.5" fill="none">
        <path d="M60 350 q 30 -8 60 0" /><path d="M260 372 q 30 -8 60 0" /><path d="M420 352 q 30 -8 60 0" />
      </g>
    </svg>
  );
}
