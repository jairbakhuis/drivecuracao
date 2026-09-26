import { Link } from "react-router-dom";
import Layout, { useReveal, WHATSAPP } from "../components/Layout";

export default function RentCarWillemstad() {
  const reveal = useReveal();
  return (
    <Layout>
      <header className="page-hero" style={{ "--hero-img": "url(/images/hero-cars.jpg)" } as React.CSSProperties}>
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <span className="eyebrow on-dark">Rent a car Willemstad</span>
          <h1>Rent a car in Willemstad and explore Curaçao freely</h1>
          <p>
            Request a rental car from local Curaçao companies for your stay in or near Willemstad. No prepayment today.
          </p>
        </div>
      </header>

      <section className="section" ref={reveal}>
        <div className="container prose reveal" style={{ maxWidth: 860 }}>
          <p className="big">
            Staying in Willemstad? A rental car makes it easier to visit beaches, restaurants, viewpoints, and
            accommodations across Curaçao without depending on taxis or fixed transport times.
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", margin: "28px 0 34px" }}>
            <Link className="btn btn-coral btn-lg" to="/cars">Search rental cars</Link>
            <a className="btn btn-ghost btn-lg" href={WHATSAPP} target="_blank" rel="noreferrer">Ask on WhatsApp</a>
          </div>

          <h2>Car rental for Willemstad hotels and apartments</h2>
          <p>
            Drive Curaçao helps visitors compare rental car categories from local companies. You can request airport pickup,
            hotel pickup, accommodation pickup, or another address depending on the rental company's confirmation.
          </p>

          <h2>Popular trips from Willemstad</h2>
          <ul className="list">
            <li>Drive to beaches like Mambo Beach, Jan Thiel, Blue Bay, and Playa Kenepa.</li>
            <li>Visit restaurants, supermarkets, and nightlife without arranging taxis each time.</li>
            <li>Explore Westpunt, Shete Boka, and other island highlights at your own pace.</li>
            <li>Choose a compact car for city driving or an SUV for family, luggage, and beach gear.</li>
          </ul>

          <h2>How the request works</h2>
          <ol>
            <li>Choose your pickup and return dates.</li>
            <li>Select the car category that fits your trip.</li>
            <li>Send a free request with your preferred pickup location.</li>
            <li>The local rental company confirms the car or a similar model by email.</li>
            <li>You pay the rental company at pickup on their normal terms.</li>
          </ol>

          <h2>No prepayment through Drive Curaçao</h2>
          <p>
            You do not pay Drive Curaçao online. The platform helps you compare and request a car; payment happens directly
            with the local rental company when your rental starts.
          </p>

          <div className="confirm" style={{ marginTop: 36, textAlign: "left" }}>
            <h2 style={{ fontSize: 22 }}>Ready to rent a car in Willemstad?</h2>
            <p>Search available categories and send a free rental request with no payment today.</p>
            <Link className="btn btn-teal" to="/cars">Search cars</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
