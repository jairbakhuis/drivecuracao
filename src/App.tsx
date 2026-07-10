import { useEffect, useMemo, useState } from "react";
import {
  CategoryOffer,
  BookingResult,
  listCategories,
  createBooking,
  formatPrice,
} from "./api";

function todayPlus(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function daysBetween(startDate: string, endDate: string): number {
  const ms = new Date(endDate).getTime() - new Date(startDate).getTime();
  return Math.max(1, Math.ceil(ms / 86_400_000));
}

interface BookingForm {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  driver_license_number: string;
  flight_number: string;
  notes: string;
}

const emptyForm: BookingForm = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  date_of_birth: "",
  driver_license_number: "",
  flight_number: "",
  notes: "",
};

export default function App() {
  const [pickupDate, setPickupDate] = useState(todayPlus(3));
  const [returnDate, setReturnDate] = useState(todayPlus(8));
  const [offers, setOffers] = useState<CategoryOffer[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [selected, setSelected] = useState<CategoryOffer | null>(null);
  const [form, setForm] = useState<BookingForm>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<BookingResult | null>(null);

  useEffect(() => {
    listCategories()
      .then((r) => setOffers(r.categories))
      .catch(() => setLoadError("We couldn't load the cars right now. Please try again in a moment."));
  }, []);

  const rentalDays = useMemo(() => daysBetween(pickupDate, returnDate), [pickupDate, returnDate]);
  const datesValid = pickupDate < returnDate && pickupDate >= todayPlus(0);

  const set = (field: keyof BookingForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const result = await createBooking({
        tenant_id: selected.tenant_id,
        category_id: selected.category_id,
        rental_start_date: `${pickupDate}T10:00:00.000Z`,
        rental_end_date: `${returnDate}T10:00:00.000Z`,
        flight_number: form.flight_number || undefined,
        notes: form.notes || undefined,
        customer: {
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          phone: form.phone,
          date_of_birth: form.date_of_birth,
          driver_license_number: form.driver_license_number || undefined,
          communication_preference: "email",
        },
      });
      setConfirmation(result);
      setSelected(null);
      setForm(emptyForm);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <header className="site-header">
        <div className="container header-row">
          <span className="wordmark">
            drive<b>curaçao</b>
          </span>
          <span className="header-note">Local rental cars · Pay at pickup</span>
        </div>
      </header>

      <section className="hero">
        <div className="container">
          <h1>
            Rent a car in Curaçao,
            <br />
            <em>the easy way.</em>
          </h1>
          <p className="hero-sub">
            Compare rental cars from licensed local companies on one site. Transparent prices, free
            cancellation, and you pay at pickup — no prepayment, no hidden fees.
          </p>

          <div className="search-bar" role="search" aria-label="Choose rental dates">
            <label>
              <span>Pickup</span>
              <input
                type="date"
                value={pickupDate}
                min={todayPlus(0)}
                onChange={(e) => setPickupDate(e.target.value)}
              />
            </label>
            <label>
              <span>Return</span>
              <input
                type="date"
                value={returnDate}
                min={pickupDate}
                onChange={(e) => setReturnDate(e.target.value)}
              />
            </label>
            <div className="days-chip">{rentalDays} day{rentalDays !== 1 ? "s" : ""}</div>
          </div>
          {!datesValid && <p className="date-warning">Return date must be after the pickup date.</p>}

          <ul className="ticks">
            <li>Licensed local companies</li>
            <li>Pay at pickup</li>
            <li>Personal confirmation for every booking</li>
          </ul>
        </div>
      </section>

      <main className="container results" id="cars">
        {confirmation && (
          <div className="confirmation" role="status">
            <h2>Request received! 🎉</h2>
            <p>
              Your booking request <strong>{confirmation.reservation_number}</strong> is in. We're
              confirming availability with the rental company and you'll receive an email shortly with
              the full details.
            </p>
            <p className="confirmation-total">
              Estimated total: <strong>{formatPrice(confirmation.total_amount, "USD")}</strong> for{" "}
              {confirmation.rental_days} day{confirmation.rental_days !== 1 ? "s" : ""} — payment at
              pickup.
            </p>
            <button className="btn btn-ghost" onClick={() => setConfirmation(null)}>
              Book another car
            </button>
          </div>
        )}

        {!confirmation && (
          <>
            <h2 className="results-title">Available categories</h2>
            {loadError && <p className="state-msg">{loadError}</p>}
            {!loadError && offers === null && <p className="state-msg">Loading cars…</p>}
            {offers !== null && offers.length === 0 && (
              <p className="state-msg">
                We're onboarding our first rental partners — check back very soon!
              </p>
            )}
            <div className="grid">
              {(offers || []).map((offer) => (
                <article key={`${offer.tenant_id}-${offer.category_id}`} className="card">
                  {offer.image_url ? (
                    <img src={offer.image_url} alt="" className="card-img" loading="lazy" />
                  ) : (
                    <div className="card-img card-img-placeholder" aria-hidden="true">
                      🚗
                    </div>
                  )}
                  <div className="card-body">
                    <h3>{offer.name}</h3>
                    <p className="card-similar">or similar — assigned at confirmation</p>
                    {offer.description && <p className="card-desc">{offer.description}</p>}
                    <div className="card-foot">
                      <div className="price">
                        {offer.from_price != null ? (
                          <>
                            <b>{formatPrice(offer.from_price, offer.currency)}</b>
                            <span>/day, from</span>
                          </>
                        ) : (
                          <b>Price on request</b>
                        )}
                      </div>
                      <button
                        className="btn btn-primary"
                        disabled={!datesValid}
                        onClick={() => {
                          setSelected(offer);
                          setSubmitError(null);
                        }}
                      >
                        Book
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </main>

      {selected && (
        <div className="modal-backdrop" onClick={() => !submitting && setSelected(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="modal-head">
              <h2>Book: {selected.name}</h2>
              <button className="modal-close" onClick={() => setSelected(null)} aria-label="Close">
                ×
              </button>
            </div>
            <p className="modal-sub">
              {pickupDate} → {returnDate} · {rentalDays} day{rentalDays !== 1 ? "s" : ""}
              {selected.from_price != null && (
                <>
                  {" "}
                  · est. <b>{formatPrice(selected.from_price * rentalDays, selected.currency)}</b> total,
                  pay at pickup
                </>
              )}
            </p>
            <form onSubmit={submit} className="form">
              <div className="form-row">
                <label>
                  <span>First name *</span>
                  <input required value={form.first_name} onChange={set("first_name")} autoComplete="given-name" />
                </label>
                <label>
                  <span>Last name *</span>
                  <input required value={form.last_name} onChange={set("last_name")} autoComplete="family-name" />
                </label>
              </div>
              <div className="form-row">
                <label>
                  <span>Email *</span>
                  <input required type="email" value={form.email} onChange={set("email")} autoComplete="email" />
                </label>
                <label>
                  <span>Phone (WhatsApp) *</span>
                  <input required type="tel" value={form.phone} onChange={set("phone")} autoComplete="tel" placeholder="+599 9 ..." />
                </label>
              </div>
              <div className="form-row">
                <label>
                  <span>Date of birth *</span>
                  <input required type="date" value={form.date_of_birth} onChange={set("date_of_birth")} max={todayPlus(-6570)} />
                </label>
                <label>
                  <span>Driver's license no.</span>
                  <input value={form.driver_license_number} onChange={set("driver_license_number")} />
                </label>
              </div>
              <div className="form-row">
                <label>
                  <span>Flight number</span>
                  <input value={form.flight_number} onChange={set("flight_number")} placeholder="Optional" />
                </label>
                <label>
                  <span>Notes</span>
                  <input value={form.notes} onChange={set("notes")} placeholder="Optional" />
                </label>
              </div>
              {submitError && <p className="form-error">{submitError}</p>}
              <button className="btn btn-primary btn-block" disabled={submitting}>
                {submitting ? "Sending request…" : "Request this car — pay at pickup"}
              </button>
              <p className="form-fineprint">
                No payment now. The rental company confirms availability and you'll receive the full
                details by email. Free cancellation before pickup.
              </p>
            </form>
          </div>
        </div>
      )}

      <footer className="site-footer">
        <div className="container footer-row">
          <span className="wordmark small">
            drive<b>curaçao</b>
          </span>
          <span>All cars provided by licensed rental companies in Curaçao.</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
}
