import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout, { useReveal, WHATSAPP } from "../components/Layout";
import { CarIllustration } from "../components/Brand";
import CategoryImage from "../components/CategoryImage";
import Marquee from "../components/Marquee";
import { CategoryOffer, listCategories, formatPrice } from "../api";
import { todayPlus, daysBetween, FAQS } from "../utils";
import { IconPin, IconCalendar, IconShield, IconTag, IconChat, IconGlobe, Stars } from "../components/Icons";

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
      {/* HERO — full-bleed photo */}
      <header className="hero hero-photo-mode">
        <div className="hero-photo" />
        <div className="hero-scrim" />
        <div className="container hero-inner">
          <div className="hero-copy">
            <span className="hero-badge"><IconPin size={15} /> Local rental cars · Willemstad &amp; island-wide</span>
            <h1 className="poster hero-poster">Your island,<br />your wheels.</h1>
            <p className="lead">
              Rent a car from trusted local companies and explore Curaçao at your own pace.
              Transparent prices, free cancellation, pay at pickup.
            </p>
            <div className="hero-stickers">
              <span className="sticker s-gold tilt-l"><Check /> Pay at pickup</span>
              <span className="sticker tilt-r">Free cancellation</span>
              <span className="sticker s-sky tilt-l">Local companies</span>
            </div>
          </div>

          <div className="search-card">
            <div className="search-grid">
              <div className="field">
                <label><IconCalendar size={14} /> Pick-up date</label>
                <input type="date" value={pickupDate} min={todayPlus(0)} onChange={(e) => setPickupDate(e.target.value)} />
              </div>
              <div className="field">
                <label><IconCalendar size={14} /> Return date</label>
                <input type="date" value={returnDate} min={pickupDate} onChange={(e) => setReturnDate(e.target.value)} />
              </div>
              <button className="btn btn-coral btn-lg" onClick={search} disabled={!datesValid}>
                Search cars
              </button>
            </div>
            <p className="search-note"><IconShield size={14} /> Free to search · {rentalDays} day{rentalDays !== 1 ? "s" : ""} selected · you only pay the rental company at pickup</p>
          </div>
        </div>
        <svg className="wave" viewBox="0 0 1440 70" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 40 Q 360 0 720 34 T 1440 30 V70 H0 Z" fill="var(--sand)" />
        </svg>
      </header>

      {/* MARQUEE TICKER */}
      <Marquee items={["Pay at pickup", "Free cancellation", "Licensed local companies", "No prepayment", "No hidden fees", "EN · NL · Papiamentu", "WhatsApp support"]} />

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
              <div className="benefit reveal"><div className="ic"><IconGlobe /></div><div><h3>One island, one place</h3><p>Compare cars from many local companies side by side instead of calling around.</p></div></div>
              <div className="benefit reveal"><div className="ic"><IconTag /></div><div><h3>No prepayment</h3><p>Pay the rental company at pickup on their normal terms. We never charge your card.</p></div></div>
              <div className="benefit reveal"><div className="ic"><IconShield /></div><div><h3>Honest prices</h3><p>Clear per-day pricing with no hidden booking fees added on top.</p></div></div>
              <div className="benefit reveal"><div className="ic"><IconChat /></div><div><h3>Real local help</h3><p>Message us on WhatsApp in English, Dutch or Papiamentu and get a fast, human answer.</p></div></div>
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
                  <article key={`${o.tenant_id}-${o.category_name}`} className="cat-card">
                    <div className="cat-media">
                      <CategoryImage name={o.category_name || o.name} tenantImage={o.image_url} index={i} alt={o.name} />
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
                        <Link className="btn btn-quick" to={`/cars?pickup=${pickupDate}&return=${returnDate}`}>Quick book</Link>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                SAMPLE.map((s, i) => (
                  <article key={s.name} className="cat-card">
                    <div className="cat-media"><CarIllustration variant={i} /><span className="cat-tag">Coming soon</span></div>
                    <div className="cat-body">
                      <h3>{s.name}</h3>
                      <p className="cat-similar">or similar — assigned at confirmation</p>
                      <p className="cat-desc">{s.desc}</p>
                      <div className="cat-foot">
                        <div className="cat-price"><b>{s.price}</b><span>per day, from</span></div>
                        <Link className="btn btn-quick" to="/cars">Quick book</Link>
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
            <div className="split-media reveal">
              <img src="/images/local-panel.jpg" alt="A calm turquoise Curaçao beach" loading="lazy" />
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
              <div className="quote reveal"><div className="stars"><Stars /></div><p>"Booked in two minutes, picked up the car right at the airport, paid on the spot. So much easier than emailing five companies."</p><div className="who"><span className="av">L</span><div><b>Lisa M.</b><span>Netherlands · Compact</span></div></div></div>
              <div className="quote reveal"><div className="stars"><Stars /></div><p>"Loved that there was no prepayment. The local company was friendly and the price was exactly what the site showed."</p><div className="who"><span className="av">D</span><div><b>Daniel R.</b><span>USA · SUV</span></div></div></div>
              <div className="quote reveal"><div className="stars"><Stars /></div><p>"WhatsApp answered in Papiamentu within minutes and sorted an automatic for us. Highly recommend for the island."</p><div className="who"><span className="av">S</span><div><b>Shanice B.</b><span>Curaçao · Automatic</span></div></div></div>
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

      </div>

      {/* BIG COLOR-BLOCK CTA */}
      <section className="block b-coral cta-block">
        <div className="container">
          <span className="sticker s-gold tilt-l" style={{ marginBottom: 20 }}>Free to search</span>
          <h2 className="poster cta-poster">More island,<br />less hassle.</h2>
          <p>Find your rental car in under a minute. No account, no prepayment — you pay the local company at pickup.</p>
          <div className="btns">
            <button className="btn btn-quick btn-lg" onClick={search}>Search cars</button>
            <a className="btn btn-dark btn-lg" href={WHATSAPP} target="_blank" rel="noreferrer">Chat on WhatsApp</a>
          </div>
        </div>
      </section>
    </Layout>
  );
}

