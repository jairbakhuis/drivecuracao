import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout, { useReveal } from "../components/Layout";
import CategoryCard from "../components/CategoryCard";
import BookingModal from "../components/BookingModal";
import {
  CategoryOffer, BookingResult, PartnerReqs, DisplayCurrency, DISPLAY_CURRENCIES,
  listCategories, groupOffers, insuranceOption, ratingFor, carTier, formatPrice,
} from "../api";
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
  const [pickupTime, setPickupTime] = useState(params.get("pickupTime") || "10:00");
  const [returnTime, setReturnTime] = useState(params.get("returnTime") || "10:00");
  const [offers, setOffers] = useState<CategoryOffer[] | null>(null);
  const [partners, setPartners] = useState<Record<string, PartnerReqs>>({});
  const [displayCurrency, setDisplayCurrency] = useState<DisplayCurrency>(() => {
    try {
      const v = localStorage.getItem("dc") as DisplayCurrency | null;
      if (v && (DISPLAY_CURRENCIES as readonly string[]).includes(v)) return v;
    } catch { /* ignore */ }
    return "USD";
  });
  const changeCurrency = (c: DisplayCurrency) => {
    setDisplayCurrency(c);
    try { localStorage.setItem("dc", c); } catch { /* ignore */ }
  };
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selected, setSelected] = useState<{ offer: CategoryOffer; preselectExtraId?: string } | null>(null);
  const [confirmation, setConfirmation] = useState<BookingResult | null>(null);
  const reveal = useReveal();

  // One card per car CLASS (cheapest partner wins) — the storefront is
  // white-label, so the customer picks a class, never a company.
  const groups = useMemo(() => groupOffers(offers || [], partners), [offers, partners]);
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
    setParams({ pickup: pickupDate, return: returnDate, pickupTime, returnTime }, { replace: true });
    let cancelled = false;
    setLoadError(null);
    setOffers(null);
    // Always coerce to an array — a malformed/unexpected response must resolve to
    // "no cars", never crash the render (which would leave the section blank).
    const asList = (r: { categories?: unknown }) => (Array.isArray(r?.categories) ? (r.categories as CategoryOffer[]) : []);
    (async () => {
      try {
        const r = await listCategories(pickupDate, returnDate);
        if (!cancelled) { setOffers(asList(r)); setPartners(r.partners || {}); }
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
                <label>Pick-up time</label>
                <input type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} />
              </div>
              <div className="field">
                <label><IconCalendar size={14} /> Return date</label>
                <input type="date" value={returnDate} min={addDays(pickupDate, 1)} onChange={(e) => setReturnDate(e.target.value)} />
              </div>
              <div className="field">
                <label>Return time</label>
                <input type="time" value={returnTime} onChange={(e) => setReturnTime(e.target.value)} />
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
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 24 }}>
                <h2 style={{ fontSize: 26 }}>Available cars</h2>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div className="cur-switch" role="group" aria-label="Display currency">
                    {DISPLAY_CURRENCIES.map((c) => (
                      <button key={c} className={c === displayCurrency ? "on" : ""} onClick={() => changeCurrency(c)}>{c}</button>
                    ))}
                  </div>
                  <span style={{ color: "var(--muted)", fontSize: 14.5 }}>per day · pay at pickup</span>
                </div>
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
                {groups.map((g) => {
                  const ins = insuranceOption(g, partners);
                  const cardIns = ins ? {
                    sameAsBest: ins.offer.tenant_id === g.best.tenant_id,
                    priceFrom: ins.offer.from_price ?? 0,
                    currency: ins.offer.currency,
                    onBook: () => setSelected({ offer: ins.offer, preselectExtraId: ins.extra.id }),
                  } : undefined;
                  return (
                    <CategoryCard
                      key={g.key}
                      offer={g.best}
                      title={g.title}
                      disabled={!datesValid}
                      displayCurrency={displayCurrency}
                      insurance={cardIns}
                      rating={ratingFor(g.best, partners)}
                      tier={carTier(g.best.specs?.year)}
                      onBook={(o) => setSelected({ offer: o })}
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {selected && (
        <BookingModal
          offer={selected.offer}
          reqs={partners[selected.offer.tenant_id]}
          preselectExtraId={selected.preselectExtraId}
          displayCurrency={displayCurrency}
          pickupDate={pickupDate}
          returnDate={returnDate}
          pickupTime={pickupTime}
          returnTime={returnTime}
          rentalDays={rentalDays}
          onClose={() => setSelected(null)}
          onBooked={(r) => { setConfirmation(r); setSelected(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}
        />
      )}
    </Layout>
  );
}
