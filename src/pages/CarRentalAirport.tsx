import { Link } from "react-router-dom";
import Layout, { useReveal, WHATSAPP } from "../components/Layout";

export default function CarRentalAirport() {
  const reveal = useReveal();
  return (
    <Layout>
      <header className="page-hero" style={{ "--hero-img": "url(/images/hero-cars.jpg)" } as React.CSSProperties}>
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <span className="eyebrow on-dark">Curaçao airport car rental</span>
          <h1>Car rental at Curaçao Airport, without prepayment</h1>
          <p>
            Request a local rental car for Hato International Airport, get confirmation by email, and pay at pickup.
          </p>
        </div>
      </header>

      <section className="section" ref={reveal}>
        <div className="container prose reveal" style={{ maxWidth: 860 }}>
          <p className="big">
            Arriving at Hato International Airport (CUR)? Drive Curaçao helps you compare local car rental options and
            request the right car category before you land — with no payment today.
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", margin: "28px 0 34px" }}>
            <Link className="btn btn-coral btn-lg" to="/cars">Search airport rental cars</Link>
            <a className="btn btn-ghost btn-lg" href={WHATSAPP} target="_blank" rel="noreferrer">Ask on WhatsApp</a>
          </div>

          <h2>Why rent a car from Curaçao Airport?</h2>
          <p>
            A rental car is one of the easiest ways to explore Curaçao from the moment you arrive. With your own car,
            you can drive from the airport to Willemstad, beaches, restaurants, and apartments without waiting for taxis
            or planning around fixed transport.
          </p>

          <h2>How airport pickup works</h2>
          <ol>
            <li>Choose your arrival and return dates.</li>
            <li>Select a category such as economy, compact automatic, SUV, or van.</li>
            <li>Add your flight number or airport pickup note if available.</li>
            <li>The local rental company confirms the car or a similar model by email.</li>
            <li>You meet the company at pickup and pay them directly on their normal terms.</li>
          </ol>

          <h2>No prepayment, clear request flow</h2>
          <p>
            Drive Curaçao does not charge your card. You send a free request, the local rental company confirms the
            details, and you pay at pickup. This keeps the process simple and transparent for travelers.
          </p>

          <h2>Popular airport rental categories</h2>
          <ul className="list">
            <li>Economy cars for budget-friendly island driving.</li>
            <li>Compact automatic cars for easy city and beach trips.</li>
            <li>SUVs for families, luggage, and beach gear.</li>
            <li>Vans for groups traveling together.</li>
          </ul>

          <div className="confirm" style={{ marginTop: 36, textAlign: "left" }}>
            <h2 style={{ fontSize: 22 }}>Ready to request an airport rental car?</h2>
            <p>Search your dates and request a car category from a local Curaçao rental company.</p>
            <Link className="btn btn-teal" to="/cars">Search cars</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
