import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout, { useReveal } from "../components/Layout";
import { PageScene } from "../components/Brand";
import CategoryCard from "../components/CategoryCard";
import BookingModal from "../components/BookingModal";
import { CategoryOffer, BookingResult, listCategories, formatPrice } from "../api";
import { todayPlus, daysBetween } from "../utils";

export default function Cars() {
  const [params, setParams] = useSearchParams();
  const [pickupDate, setPickupDate] = useState(params.get("pickup") || todayPlus(3));
  const [returnDate, setReturnDate] = useState(params.get("return") || todayPlus(8));
  const [offers, setOffers] = useState<CategoryOffer[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selected, setSelected] = useState<CategoryOffer | null>(null);
  const [confirmation, setConfirmation] = useState<BookingResult | null>(null);
  const reveal = useReveal();

  useEffect(() => {
    listCategories()
      .then((r) => setOffers(r.categories))
      .catch(() => setLoadError("We couldn't load the cars right now. Please try again in a moment."));
  }, []);

  const rentalDays = useMemo(() => daysBetween(pickupDate, returnDate), [pickupDate, returnDate]);
  const datesValid = pickupDate < returnDate && pickupDate >= todayPlus(0);

  useEffect(() => {
    setParams({ pickup: pickupDate, return: returnDate }, { replace: true });
  }, [pickupDate, returnDate]);

  return (
    <Layout>
      <header className="page-hero">
        <PageScene />
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <span className="eyebrow on-dark">Browse cars</span>
          <h1>Find your car in Curaçao</h1>
          <p>Pick your dates and choose a category. Every car comes from a licensed local company — you pay at pickup.</p>

          <div className="search-card" style={{ marginTop: 28 }}>
            <div className="search-grid">
              <div className="field">
                <label>Pick-up date</label>
                <input type="date" value={pickupDate} min={todayPlus(0)} onChange={(e) => setPickupDate(e.target.value)} />
              </div>
              <div className="field">
                <label>Return date</label>
                <input type="date" value={returnDate} min={pickupDate} onChange={(e) => setReturnDate(e.target.value)} />
              </div>
              <div className="field" style={{ justifyContent: "flex-end" }}>
                <div className="btn btn-dark" style={{ pointerEvents: "none" }}>
                  {rentalDays} day{rentalDays !== 1 ? "s" : ""}
                </div>
              </div>
            </div>
            {!datesValid && <p className="search-note" style={{ color: "#c02c1c" }}>Return date must be after the pick-up date.</p>}
          </div>
        </div>
      </header>

      <section className="section" ref={reveal}>
        <div className="container">
          {confirmation ? (
            <div className="confirm">
              <div className="big">🎉</div>
              <h2>Request received!</h2>
              <p>
                Your booking request <strong>{confirmation.reservation_number}</strong> is in. We're confirming
                availability with the rental company and you'll get an email shortly with the full details.
              </p>
              <p className="total">
                Estimated total <strong>{formatPrice(confirmation.total_amount, "USD")}</strong> for{" "}
                {confirmation.rental_days} day{confirmation.rental_days !== 1 ? "s" : ""} — payment at pickup.
              </p>
              <button className="btn btn-teal" style={{ marginTop: 10 }} onClick={() => setConfirmation(null)}>
                Browse more cars
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 24 }}>
                <h2 style={{ fontSize: 26 }}>Available categories</h2>
                <span style={{ color: "var(--muted)", fontSize: 14.5 }}>Prices shown per day · pay at pickup</span>
              </div>

              {loadError && <p className="state-msg card">{loadError}</p>}
              {!loadError && offers === null && <p className="state-msg">Loading cars…</p>}
              {offers !== null && offers.length === 0 && (
                <div className="state-msg card">
                  <strong style={{ color: "var(--ink)" }}>We're onboarding our first rental partners.</strong>
                  <br />New cars are being added right now — check back very soon, or message us on WhatsApp and we'll
                  find you a car today.
                </div>
              )}

              <div className="cats">
                {(offers || []).map((offer, i) => (
                  <CategoryCard
                    key={`${offer.tenant_id}-${offer.category_id}`}
                    offer={offer}
                    index={i}
                    disabled={!datesValid}
                    onBook={setSelected}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {selected && (
        <BookingModal
          offer={selected}
          pickupDate={pickupDate}
          returnDate={returnDate}
          rentalDays={rentalDays}
          onClose={() => setSelected(null)}
          onBooked={(r) => { setConfirmation(r); setSelected(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}
        />
      )}
    </Layout>
  );
}
