import { Link } from "react-router-dom";
import Layout, { useReveal, WHATSAPP } from "../components/Layout";

export default function CheapCarRentalCuracao() {
  const reveal = useReveal();
  return (
    <Layout>
      <header className="page-hero" style={{ "--hero-img": "url(/images/hero-cars.jpg)" } as React.CSSProperties}>
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <span className="eyebrow on-dark">Cheap car rental Curaçao</span>
          <h1>Affordable car rental in Curaçao with no prepayment</h1>
          <p>
            Compare budget-friendly rental car categories from local companies and request your car online in minutes.
          </p>
        </div>
      </header>

      <section className="section" ref={reveal}>
        <div className="container prose reveal" style={{ maxWidth: 860 }}>
          <p className="big">
            Looking for a cheap rental car in Curaçao? Drive Curaçao helps you compare local options clearly, without
            hidden booking fees or paying before your rental company confirms the request.
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", margin: "28px 0 34px" }}>
            <Link className="btn btn-coral btn-lg" to="/cars">Compare affordable cars</Link>
            <a className="btn btn-ghost btn-lg" href={WHATSAPP} target="_blank" rel="noreferrer">Ask for help</a>
          </div>

          <h2>How to keep your Curaçao rental cost lower</h2>
          <ul className="list">
            <li>Choose an economy or compact category if you only need simple island transport.</li>
            <li>Book the right size car instead of paying extra for space you will not use.</li>
            <li>Compare local companies side by side before sending a request.</li>
            <li>Check whether you need add-ons like insurance, child seats, or extra drivers.</li>
            <li>Request early during busy travel periods so more categories are available.</li>
          </ul>

          <h2>No payment today</h2>
          <p>
            Drive Curaçao is free to search. You send a rental request, the local company confirms the car or a similar
            model, and you pay the rental company at pickup on their normal terms.
          </p>

          <h2>Best budget-friendly categories</h2>
          <p>
            Economy and compact cars are usually the best fit for travelers who want to explore Willemstad, beaches,
            restaurants, and accommodations without overspending. If you travel with more luggage or family, an SUV or
            van may still be the better value.
          </p>

          <h2>Transparent local rental options</h2>
          <p>
            Prices can change by season, availability, rental days, and car category. Drive Curaçao shows clear from-prices
            so you can compare options before requesting your car.
          </p>

          <div className="confirm" style={{ marginTop: 36, textAlign: "left" }}>
            <h2 style={{ fontSize: 22 }}>Find an affordable rental car</h2>
            <p>Choose your dates, compare available categories, and request a car with no prepayment today.</p>
            <Link className="btn btn-teal" to="/cars">Search cars</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
