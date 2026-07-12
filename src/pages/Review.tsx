import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Layout, { WHATSAPP } from "../components/Layout";
import { IconChat } from "../components/Icons";
import { submitReview } from "../api";

function Star({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="34" height="34" fill={filled ? "#f4b400" : "none"} stroke={filled ? "#f4b400" : "currentColor"} strokeWidth="1.6" strokeLinejoin="round">
      <path d="M12 2.5l2.9 5.9 6.5.95-4.7 4.6 1.1 6.5L12 18l-5.8 3 1.1-6.5-4.7-4.6 6.5-.95z" />
    </svg>
  );
}

const LABELS = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

export default function Review() {
  const [params] = useSearchParams();
  const reservationId = params.get("reservation") || params.get("res") || "";

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const shown = hover || rating;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!rating) { setError("Please tap a star to rate your rental."); return; }
    setSubmitting(true);
    setError(null);
    try {
      await submitReview({
        reservation_id: reservationId,
        rating,
        comment: comment.trim() || undefined,
        reviewer_name: name.trim() || undefined,
      });
      setDone(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      // An already-reviewed booking is a friendly end state, not an error.
      if (/already been reviewed/i.test(msg)) setDone(true);
      else setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Layout>
      <section className="section review-section">
        <div className="container review-wrap">
          {!reservationId ? (
            <div className="review-card state-msg card">
              <strong style={{ color: "var(--ink)" }}>This review link looks incomplete.</strong>
              <br />Please open the link from your email again, or{" "}
              <a href={WHATSAPP} target="_blank" rel="noreferrer">message us on WhatsApp</a> and we'll help.
            </div>
          ) : done ? (
            <div className="review-card review-done">
              <div className="review-check"><svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg></div>
              <h1>Thank you! 🎉</h1>
              <p>Your review helps other travellers book with confidence. We appreciate you taking the time.</p>
              <Link className="btn btn-teal" to="/">Back to Drive Curaçao</Link>
            </div>
          ) : (
            <form className="review-card" onSubmit={submit}>
              <span className="eyebrow">Your rental</span>
              <h1>How was your trip?</h1>
              <p className="review-sub">Rate your experience with the local partner who provided your car. It only takes a moment.</p>

              <div className="stars-pick" role="radiogroup" aria-label="Rating">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    type="button"
                    key={n}
                    className="star-btn"
                    aria-label={`${n} star${n > 1 ? "s" : ""}`}
                    aria-checked={rating === n}
                    role="radio"
                    onMouseEnter={() => setHover(n)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => { setRating(n); setError(null); }}
                  >
                    <Star filled={n <= shown} />
                  </button>
                ))}
              </div>
              <p className="stars-label">{shown ? LABELS[shown] : "Tap to rate"}</p>

              <label className="field review-field">
                <span>Your name <em>(optional)</em></span>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Mark D." maxLength={120} />
              </label>

              <label className="field review-field">
                <span>Tell us more <em>(optional)</em></span>
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Clean car, easy pickup, friendly service…" maxLength={2000} rows={4} />
              </label>

              {error && <p className="review-error">{error}</p>}

              <button className="btn btn-teal btn-block" disabled={submitting}>
                {submitting ? "Sending…" : "Submit review"}
              </button>
              <p className="review-foot"><IconChat /> Something wrong with your rental? <a href={WHATSAPP} target="_blank" rel="noreferrer">Message us</a> instead.</p>
            </form>
          )}
        </div>
      </section>
    </Layout>
  );
}
