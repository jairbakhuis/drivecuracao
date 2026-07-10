import { useState } from "react";
import { CategoryOffer, BookingResult, createBooking, formatPrice } from "../api";

interface Props {
  offer: CategoryOffer;
  pickupDate: string;
  returnDate: string;
  rentalDays: number;
  onClose: () => void;
  onBooked: (r: BookingResult) => void;
}

const empty = {
  first_name: "", last_name: "", email: "", phone: "",
  date_of_birth: "", driver_license_number: "", flight_number: "", notes: "",
};

export default function BookingModal({ offer, pickupDate, returnDate, rentalDays, onClose, onBooked }: Props) {
  const [form, setForm] = useState(empty);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const set = (k: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const r = await createBooking({
        tenant_id: offer.tenant_id,
        category_id: offer.category_id,
        rental_start_date: `${pickupDate}T10:00:00.000Z`,
        rental_end_date: `${returnDate}T10:00:00.000Z`,
        flight_number: form.flight_number || undefined,
        notes: form.notes || undefined,
        customer: {
          first_name: form.first_name, last_name: form.last_name,
          email: form.email, phone: form.phone, date_of_birth: form.date_of_birth,
          driver_license_number: form.driver_license_number || undefined,
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
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-head">
          <h2>Book a {offer.name}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <p className="modal-sub">
          {pickupDate} → {returnDate} · {rentalDays} day{rentalDays !== 1 ? "s" : ""}
          {offer.from_price != null && (
            <> · est. <b>{formatPrice(offer.from_price * rentalDays, offer.currency)}</b> total · pay at pickup</>
          )}
        </p>
        <form className="form" onSubmit={submit}>
          <div className="form-row">
            <label>First name<input required value={form.first_name} onChange={set("first_name")} autoComplete="given-name" /></label>
            <label>Last name<input required value={form.last_name} onChange={set("last_name")} autoComplete="family-name" /></label>
          </div>
          <div className="form-row">
            <label>Email<input required type="email" value={form.email} onChange={set("email")} autoComplete="email" /></label>
            <label>Phone (WhatsApp)<input required type="tel" value={form.phone} onChange={set("phone")} placeholder="+599 9 …" autoComplete="tel" /></label>
          </div>
          <div className="form-row">
            <label>Date of birth<input required type="date" value={form.date_of_birth} onChange={set("date_of_birth")} /></label>
            <label>Driver's license no.<input value={form.driver_license_number} onChange={set("driver_license_number")} placeholder="Optional" /></label>
          </div>
          <div className="form-row">
            <label>Flight number<input value={form.flight_number} onChange={set("flight_number")} placeholder="Optional" /></label>
            <label>Notes<input value={form.notes} onChange={set("notes")} placeholder="Optional" /></label>
          </div>
          {error && <p className="form-error">{error}</p>}
          <button className="btn btn-coral btn-block" disabled={submitting}>
            {submitting ? "Sending request…" : "Request this car — pay at pickup"}
          </button>
          <p className="form-fine">
            No payment now. The rental company confirms availability and emails you the full details.
            Free cancellation before pickup.
          </p>
        </form>
      </div>
    </div>
  );
}
