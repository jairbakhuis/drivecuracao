import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout, { useReveal } from "../components/Layout";
import CategoryCard from "../components/CategoryCard";
import BookingModal from "../components/BookingModal";
import { CategoryOffer, BookingResult, listCategories, formatPrice } from "../api";
import { todayPlus, daysBetween } from "../utils";
import { IconCalendar, IconCheck } from "../components/Icons";

/** Add days to a YYYY-MM-DD string. */
function addDays(date: string, n: number): string {
  const d = new Date(date + "T00:00:00");
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

export default function Cars() {
  const [params, setParams] = useSearchParams();
  const [pickupDate, setPickupDate] = useState(params.get("pickup") || todayPlus(3));
  const [returnDate, setReturnDate] = useState(params.get("return") || todayPlus(8));
  const [offers, setOffers] = useState<CategoryOffer[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selected, setSelected] = useState<CategoryOffer | null>(null);
  const [confirmation, setConfirmation] = useState<BookingResult | null>(null);
  const reveal = useReveal();

  const rentalDays = useMemo(() => daysBetween(pickupDate, returnDate), [pickupDate, returnDate]);
  const datesValid = pickupDate < returnDate && pickupDate >= todayPlus(0);

  // Keep the return date sane: never before/equal to pickup.
  const changePickup = (d: string) => {
    setPickupDate(d);
    if (d >= returnDate) setReturnDate(addDays(d, Math.max(1, rentalDays)));
  };

  // Re-fetch availability whenever the dates change (date-aware listing).
  // Robust: always resolve to a concrete state (cards / empty / error). If the
  // date-aware availability call fails, fall back to the plain listing so a
  // transient backend hiccup never leaves the page blank.
  useEffect(() => {
    if (!datesValid) return;
    setParams({ pickup: pickupDate, return: returnDate }, { replace: true });
    let cancelled = false;
    setLoadError(null);
    setOffers(null);
    // Always coerce to an array — a malformed/unexpected response must resolve to
    // "no cars", never crash the render (which would leave the section blank).
    const asList = (r: { categories?: unknown }) => (Array.isArray(r?.categories) ? (r.categories as CategoryOffer[]) : []);
    (async () => {
      try {
        const r = await listCategories(pickupDate, returnDate);
        if (!cancelled) setOffers(asList(r));
      } catch {
        // Availability path failed — try the undated listing before giving up.
        try {
          const r = await listCategories();
          if (!cancelled) setOffers(asList(r));
        } catch {
          if (!cancelled) setLoadError("We couldn't load the cars right now. Please try again in a moment.");
        }
      }
    })();
    return () => { cancelled = true; };
  }, [pickupDate, returnDate, datesValid]);

  return (
    <Layout>
      <header className="page-hero" style={{ "--hero-img": "url(/images/hero-cars.jpg)" } as React.CSSProperties}>
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <span className="eyebrow on-dark">Browse cars</span>
          <h1>Find your car in Curaçao</h1>
          <p>Pick your dates and choose a category. Every car comes from a licensed local company — you pay at pickup.</p>

          <div className="search-card" style={{ marginTop: 28 }}>
            <div className="search-grid">
              <div className="field">
                <label><IconCalendar size={14} /> Pick-up date</label>
                <input type="date" value={pickupDate} min={todayPlus(0)} onChange={(e) => changePickup(e.target.value)} />
              </div>
              <div className="field">
                <label><IconCalendar size={14} /> Return date</label>
                <input type="date" value={returnDate} min={addDays(pickupDate, 1)} onChange={(e) => setReturnDate(e.target.value)} />
              </div>
              <div className="field" style={{ justifyContent: "flex-end" }}>
                <div className="btn btn-dark" style={{ pointerEvents: "none" }}>
                  {rentalDays} day{rentalDays !== 1 ? "s" : ""}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="section" ref={reveal}>
        <div className="container">
          {confirmation ? (
            <div className="confirm">
              <div className="big"><IconCheck size={30} /></div>
              <h2>{confirmation.confirmed ? "Your car is booked" : "Request received"}</h2>
              {confirmation.confirmed ? (
                <p>
                  Booking <strong>{confirmation.reservation_number}</strong> is <strong>confirmed</strong>. The rental
                  company will email you the pickup details and their name shortly.
                </p>
              ) : (
                <p>
                  Your request <strong>{confirmation.reservation_number}</strong> is in. We're confirming availability
                  with the rental company and you'll get an email shortly with the full details.
                </p>
              )}
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
                <h2 style={{ fontSize: 26 }}>Available cars</h2>
                <span style={{ color: "var(--muted)", fontSize: 14.5 }}>Prices per day · pay at pickup</span>
              </div>

              {loadError && <p className="state-msg card">{loadError}</p>}
              {!loadError && offers === null && <p className="state-msg">Checking availability…</p>}
              {offers !== null && offers.length === 0 && (
                <div className="state-msg card">
                  <strong style={{ color: "var(--ink)" }}>No cars available for these dates.</strong>
                  <br />Try different dates, or message us on WhatsApp and we'll help you find one.
                </div>
              )}

              <div className="cats">
                {(offers || []).map((offer) => (
                  <CategoryCard
                    key={`${offer.tenant_id}-${offer.category_name}`}
                    offer={offer}
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
