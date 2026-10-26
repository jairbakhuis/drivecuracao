import { useEffect, useRef, useState } from "react";
import { CategoryOffer, BookingResult, PartnerReqs, NotableExtra, DisplayCurrency, createBooking, displayPrice, carTier } from "../api";
import CategoryImage from "./CategoryImage";
import { curacaoLocalDateTimeISO } from "../utils";

interface Props {
  offer: CategoryOffer;
  /** Booking rules for the matched partner (drives required fields). */
  reqs?: PartnerReqs;
  /** Pre-tick this add-on (e.g. arrived via the "with insurance" trigger). */
  preselectExtraId?: string;
  displayCurrency: DisplayCurrency;
  pickupDate: string;
  returnDate: string;
  pickupTime: string;
  returnTime: string;
  rentalDays: number;
  onClose: () => void;
  onBooked: (r: BookingResult) => void;
}

/** Price of an add-on for the whole rental (flat fee, or daily × days). */
function extraPrice(e: NotableExtra, days: number): number {
  if (e.flat_fee && e.flat_fee > 0) return e.flat_fee;
  return (e.daily_rate || 0) * days;
}

// White-label pickup/drop-off choices. We never show a partner's branded
// locations (that would reveal who they are); we capture where the customer
// wants to meet, and the rental company confirms the exact spot afterwards.
const PLACES = ["Airport (Hato)", "Hotel / accommodation", "Other address"] as const;
const needsDetail = (place: string) => place !== "Airport (Hato)";

const empty = {
  first_name: "", last_name: "", email: "", phone: "",
  date_of_birth: "", country: "",
  driver_license_number: "", driver_license_expiry: "",
  flight_number: "", notes: "",
  pickup_place: PLACES[0] as string, pickup_detail: "",
  dropoff_same: true, dropoff_place: PLACES[0] as string, dropoff_detail: "",
};

/** Age in whole years as of today — mirrors the tenant app's age check. */
function calcAge(dob: string): number {
  const b = new Date(dob.includes("T") ? dob : `${dob}T00:00:00`);
  if (isNaN(b.getTime())) return NaN;
  const now = new Date();
  let age = now.getFullYear() - b.getFullYear();
  const md = now.getMonth() - b.getMonth();
  if (md < 0 || (md === 0 && now.getDate() < b.getDate())) age--;
  return age;
}

/** Combine a place choice + free-text detail into one stored location string. */
function locString(place: string, detail: string): string {
  return needsDetail(place) && detail.trim() ? `${place}: ${detail.trim()}` : place;
}

export default function BookingModal({ offer, reqs, preselectExtraId, displayCurrency, pickupDate, returnDate, pickupTime, returnTime, rentalDays, onClose, onBooked }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  const submittingRef = useRef(false);
  const [form, setForm] = useState(empty);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  closeRef.current = onClose;
  submittingRef.current = submitting;

  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    const heading = modal.querySelector<HTMLElement>("#booking-dialog-title");
    document.body.style.overflow = "hidden";
    heading?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !submittingRef.current) {
        event.preventDefault();
        closeRef.current();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = Array.from(modal.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )).filter((element) => element.getAttribute("aria-hidden") !== "true");
      if (!focusable.length) {
        event.preventDefault();
        heading?.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!modal.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && (document.activeElement === first || document.activeElement === heading)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === heading)) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, []);

  const extras = reqs?.notable_extras ?? [];
  const [chosenExtras, setChosenExtras] = useState<string[]>(
    preselectExtraId && extras.some((e) => e.id === preselectExtraId) ? [preselectExtraId] : []
  );
  const toggleExtra = (id: string) =>
    setChosenExtras((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));

  const money = (amount: number) => displayPrice(amount, offer.currency, displayCurrency);
  const base = (offer.from_price ?? 0) * rentalDays;
  const extrasTotal = extras.filter((e) => chosenExtras.includes(e.id)).reduce((s, e) => s + extraPrice(e, rentalDays), 0);
  const estTotal = base + extrasTotal;

  // Defaults are deliberately strict when we don't have the partner's rules yet
  // (license expected), so we never under-collect. The server enforces the rest.
  const licenseRequired = reqs?.license_required ?? true;
  const flightRequired = reqs?.flight_required ?? false;
  const minAge = reqs?.min_age ?? null;
  const minDays = reqs?.min_days ?? null;

  const setText = (k: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side pre-checks with clear messages (the server re-checks all of
    // these — this is just to fail fast and kindly).
    if (minDays && rentalDays < minDays) {
      setError(`This car needs a minimum rental of ${minDays} day${minDays !== 1 ? "s" : ""}. Please extend your dates.`);
      return;
    }
    if (minAge && form.date_of_birth) {
      const age = calcAge(form.date_of_birth);
      if (isNaN(age) || age < minAge) {
        setError(`Drivers must be at least ${minAge} for this car. Try a different car or dates.`);
        return;
      }
    }
    if (licenseRequired) {
      if (!form.driver_license_number.trim() || !form.driver_license_expiry) {
        setError("Please add your driver's license number and expiry date.");
        return;
      }
      if (new Date(form.driver_license_expiry) < new Date(returnDate)) {
        setError("Your driver's license expires before the return date.");
        return;
      }
    }
    if (flightRequired && !form.flight_number.trim()) {
      setError("Please enter your flight number for this rental.");
      return;
    }

    const pickupLoc = locString(form.pickup_place, form.pickup_detail);
    const dropoffLoc = form.dropoff_same ? pickupLoc : locString(form.dropoff_place, form.dropoff_detail);

    setSubmitting(true);
    try {
      const r = await createBooking({
        tenant_id: offer.tenant_id,
        category_name: offer.category_name,
        tier: offer.tier,
        rental_start_date: curacaoLocalDateTimeISO(pickupDate, pickupTime),
        rental_end_date: curacaoLocalDateTimeISO(returnDate, returnTime),
        pickup_location_details: pickupLoc,
        return_location_details: dropoffLoc,
        flight_number: form.flight_number || undefined,
        notes: form.notes || undefined,
        extras: chosenExtras.length ? chosenExtras : undefined,
        customer: {
          first_name: form.first_name, last_name: form.last_name,
          email: form.email, phone: form.phone, date_of_birth: form.date_of_birth,
          country: form.country || undefined,
          driver_license_number: form.driver_license_number || undefined,
          driver_license_expiry: form.driver_license_expiry || undefined,
          communication_preference: "email",
        },
      });
      onBooked(r);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={() => !submitting && onClose()}>
      <div ref={modalRef} className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="booking-dialog-title" aria-describedby="booking-dialog-summary">
        <div className="modal-head">
          <h2 id="booking-dialog-title" tabIndex={-1}>Book a {offer.name}</h2>
          <button type="button" className="modal-close" onClick={onClose} disabled={submitting} aria-label="Close booking form">×</button>
        </div>
        {/* The partner's ACTUAL car (preferSrc), so the customer sees the real
            vehicle at the point of decision; falls back to the class image. */}
        <div className="modal-car">
          <CategoryImage preferSrc src={offer.image_url} name={offer.category_name || offer.name} alt={offer.name} />
        </div>
        <p id="booking-dialog-summary" className="modal-sub">
          {pickupDate} {pickupTime} → {returnDate} {returnTime} (Curaçao local time) · {rentalDays} day{rentalDays !== 1 ? "s" : ""}
          {offer.from_price != null && (
            <> · est. <b>{money(estTotal)}</b> total · pay at pickup</>
          )}
        </p>
        {displayCurrency !== offer.currency && (
          <p className="currency-note">Displayed as an estimate in {displayCurrency}; the rental company charges in {offer.currency} at pickup.</p>
        )}
        <div className="modal-trust" aria-label="Booking reassurance">
          <span>No payment today</span>
          <span>Free cancellation before pickup</span>
          <span>Local company confirms by email</span>
        </div>
        {(() => {
          const tier = carTier(offer.specs?.year);
          return tier && tier.blurb ? (
            <p className={`modal-tier modal-tier--${tier.key}`}>
              <b>{tier.label} car.</b> {tier.blurb}
            </p>
          ) : null;
        })()}
        {reqs?.deposit_enabled && reqs.deposit_amount ? (
          <p className="modal-note">A refundable deposit of {money(reqs.deposit_amount)} is held at pickup.</p>
        ) : null}

        <form className="form" onSubmit={submit}>
          <p className="form-section">Pick-up &amp; drop-off</p>
          <div className="form-row">
            <label>Pick-up
              <select value={form.pickup_place} onChange={(e) => setForm((f) => ({ ...f, pickup_place: e.target.value }))}>
                {PLACES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </label>
            {needsDetail(form.pickup_place) ? (
              <label>Hotel name / address<input required value={form.pickup_detail} onChange={setText("pickup_detail")} placeholder="e.g. Marriott, Piscadera" /></label>
            ) : <span />}
          </div>
          <label className="check">
            <input type="checkbox" checked={form.dropoff_same} onChange={(e) => setForm((f) => ({ ...f, dropoff_same: e.target.checked }))} />
            Drop off at the same place
          </label>
          {!form.dropoff_same && (
            <div className="form-row">
              <label>Drop-off
                <select value={form.dropoff_place} onChange={(e) => setForm((f) => ({ ...f, dropoff_place: e.target.value }))}>
                  {PLACES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </label>
              {needsDetail(form.dropoff_place) ? (
                <label>Hotel name / address<input required value={form.dropoff_detail} onChange={setText("dropoff_detail")} placeholder="e.g. Marriott, Piscadera" /></label>
              ) : <span />}
            </div>
          )}

          {extras.length > 0 && (
            <>
              <p className="form-section">Add-ons <span className="opt">(optional)</span></p>
              <div className="addons">
                {extras.map((e) => {
                  const perDay = !(e.flat_fee && e.flat_fee > 0);
                  return (
                    <label key={e.id} className="addon">
                      <input type="checkbox" checked={chosenExtras.includes(e.id)} onChange={() => toggleExtra(e.id)} />
                      <span className="addon-name">{e.name}</span>
                      <span className="addon-price">
                        +{money(extraPrice(e, rentalDays))}{perDay ? <span className="addon-rate"> · {money(e.daily_rate || 0)}/day</span> : null}
                      </span>
                    </label>
                  );
                })}
              </div>
            </>
          )}

          <p className="form-section">Your details</p>
          <div className="form-row">
            <label>First name<input required value={form.first_name} onChange={setText("first_name")} autoComplete="given-name" /></label>
            <label>Last name<input required value={form.last_name} onChange={setText("last_name")} autoComplete="family-name" /></label>
          </div>
          <div className="form-row">
            <label>Email<input required type="email" value={form.email} onChange={setText("email")} autoComplete="email" /></label>
            <label>Phone (WhatsApp)<input required type="tel" value={form.phone} onChange={setText("phone")} placeholder="+599 9 …" autoComplete="tel" /></label>
          </div>
          <div className="form-row">
            <label>Date of birth<input required type="date" value={form.date_of_birth} onChange={setText("date_of_birth")} /></label>
            <label>Country / nationality<input value={form.country} onChange={setText("country")} placeholder="e.g. Netherlands" autoComplete="country-name" /></label>
          </div>

          {licenseRequired && (
            <>
              <p className="form-section">Driver's license</p>
              <div className="form-row">
                <label>License number<input required value={form.driver_license_number} onChange={setText("driver_license_number")} /></label>
                <label>License expiry<input required type="date" value={form.driver_license_expiry} onChange={setText("driver_license_expiry")} /></label>
              </div>
            </>
          )}

          <p className="form-section">
            Trip details {flightRequired ? "" : <span className="opt">(optional)</span>}
          </p>
          <div className="form-row">
            <label>Flight number{flightRequired ? "" : <span className="opt"> (optional)</span>}
              <input required={flightRequired} value={form.flight_number} onChange={setText("flight_number")} placeholder="e.g. KL0735" />
            </label>
            <label>Anything we should know?<input value={form.notes} onChange={setText("notes")} placeholder="Child seat, extra driver, etc." /></label>
          </div>

          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="btn btn-coral btn-block" disabled={submitting}>
            {submitting ? "Sending…" : "Book now — pay at pickup"}
          </button>
          <p className="form-fine">
            No payment now. Free cancellation before pickup. Your details go straight to the local rental
            company, who confirms and meets you at pickup.
          </p>
        </form>
      </div>
    </div>
  );
}
