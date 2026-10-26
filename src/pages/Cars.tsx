import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout, { useReveal } from "../components/Layout";
import CategoryCard from "../components/CategoryCard";
import BookingModal from "../components/BookingModal";
import {
  CategoryOffer, BookingResult, PartnerReqs, DisplayCurrency, DISPLAY_CURRENCIES,
  listCategories, groupOffers, insuranceOption, ratingFor, carTier, displayPrice,
} from "../api";
import { todayPlus, daysBetween, addCalendarDays, isCalendarDate } from "../utils";
import { IconCalendar, IconCheck } from "../components/Icons";

interface Confirmation {
  result: BookingResult;
  offerCurrency: string;
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
      const v = localStorage.getItem("dc");
      if (v === "ANG") return "XCG";
      if (v && (DISPLAY_CURRENCIES as readonly string[]).includes(v)) return v as DisplayCurrency;
    } catch { /* ignore */ }
    return "USD";
  });
  const changeCurrency = (c: DisplayCurrency) => {
    setDisplayCurrency(c);
    try { localStorage.setItem("dc", c); } catch { /* ignore */ }
  };
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selected, setSelected] = useState<{ offer: CategoryOffer; preselectExtraId?: string } | null>(null);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const reveal = useReveal();

  // One card per car CLASS (cheapest partner wins) — the storefront is
  // white-label, so the customer picks a class, never a company.
  const groups = useMemo(() => groupOffers(offers || [], partners), [offers, partners]);
  const rentalDays = useMemo(() => daysBetween(pickupDate, returnDate), [pickupDate, returnDate]);
  const datesValid = isCalendarDate(pickupDate) && isCalendarDate(returnDate) && pickupDate < returnDate && pickupDate >= todayPlus(0);

  // Keep the return date sane: never before/equal to pickup.
  const changePickup = (d: string) => {
    setPickupDate(d);
    if (d >= returnDate) setReturnDate(addCalendarDays(d, Math.max(1, rentalDays)));
  };

  // Keep the shareable URL in sync with both dates and Curaçao-local times.
  useEffect(() => {
    setParams({ pickup: pickupDate, return: returnDate, pickupTime, returnTime }, { replace: true });
  }, [pickupDate, returnDate, pickupTime, returnTime, setParams]);

  // Re-fetch availability whenever the dates change (date-aware listing).
  // Never substitute an undated listing if the date-aware request fails: that
  // could present unavailable cars as available for the selected dates.
  useEffect(() => {
    if (!datesValid) {
      setOffers(null);
      setPartners({});
      setLoadError(null);
      return;
    }
    let cancelled = false;
    setLoadError(null);
    setOffers(null);
    setPartners({});
    // Always coerce to an array — a malformed/unexpected response must resolve to
    // "no cars", never crash the render (which would leave the section blank).
    const asList = (r: { categories?: unknown }) => (Array.isArray(r?.categories) ? (r.categories as CategoryOffer[]) : []);
    (async () => {
      try {
        const r = await listCategories(pickupDate, returnDate);
        if (!cancelled) { setOffers(asList(r)); setPartners(r.partners || {}); }
      } catch {
        if (!cancelled) {
          setLoadError("We couldn't confirm availability for those dates. Please try again in a moment.");
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
                <label htmlFor="cars-pickup-date"><IconCalendar size={14} /> Pick-up date</label>
                <input id="cars-pickup-date" type="date" value={pickupDate} min={todayPlus(0)} onChange={(e) => changePickup(e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="cars-pickup-time">Pick-up time (Curaçao local time)</label>
                <input id="cars-pickup-time" type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="cars-return-date"><IconCalendar size={14} /> Return date</label>
                <input id="cars-return-date" type="date" value={returnDate} min={isCalendarDate(pickupDate) ? addCalendarDays(pickupDate, 1) : todayPlus(1)} onChange={(e) => setReturnDate(e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="cars-return-time">Return time (Curaçao local time)</label>
                <input id="cars-return-time" type="time" value={returnTime} onChange={(e) => setReturnTime(e.target.value)} />
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
              {(() => {
                const result = confirmation.result;
                const sourceCurrency = result.currency || confirmation.offerCurrency;
                return (
                  <>
              <div className="big"><IconCheck size={30} /></div>
              <h2>{result.confirmed ? "Your car is booked" : "Request received"}</h2>
              {result.confirmed ? (
                <p>
                  Booking <strong>{result.reservation_number}</strong> is <strong>confirmed</strong>. The rental
                  company will email you the pickup details and their name shortly.
                </p>
              ) : (
                <p>
                  Your request <strong>{result.reservation_number}</strong> is in. We're confirming availability
                  with the rental company and you'll get an email shortly with the full details.
                </p>
              )}
              <p className="total">
                Estimated total <strong>{displayPrice(result.total_amount, sourceCurrency, displayCurrency)}</strong> for{" "}
                {result.rental_days} day{result.rental_days !== 1 ? "s" : ""} — payment at pickup.
              </p>
              {sourceCurrency !== displayCurrency && (
                <p className="currency-note">Displayed as an estimate in {displayCurrency}; the rental company charges in {sourceCurrency} at pickup.</p>
              )}
              <button className="btn btn-teal" style={{ marginTop: 10 }} onClick={() => setConfirmation(null)}>
                Browse more cars
              </button>
                  </>
                );
              })()}
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
                  <span className="currency-disclaimer">Per day · converted prices are estimates · pay in partner currency at pickup</span>
                </div>
              </div>

              {loadError && <p className="state-msg card" role="alert">{loadError}</p>}
              {!datesValid && <p className="state-msg card" role="alert">Choose a valid future pick-up date and a return date after pick-up.</p>}
              {!loadError && datesValid && offers === null && <p className="state-msg">Checking availability…</p>}
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
          onBooked={(r) => { setConfirmation({ result: r, offerCurrency: selected.offer.currency }); setSelected(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}
        />
      )}
    </Layout>
  );
}
