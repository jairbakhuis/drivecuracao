import { CategoryOffer, Specs, DisplayCurrency, displayPrice, CardRating } from "../api";
import CategoryImage from "./CategoryImage";

/** Optional peace-of-mind option surfaced for this class (see insuranceOption). */
export interface CardInsurance {
  sameAsBest: boolean;      // does the cheapest partner already offer it?
  priceFrom: number;        // the insurance-offering partner's daily rate
  currency: string;         // that partner's native currency
  onBook: () => void;       // open booking for that partner (extra pre-selected)
}

function Spec({ icon, label }: { icon: JSX.Element; label: string }) {
  return <span className="spec">{icon}{label}</span>;
}

const S = { width: 15, height: 15, fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

const IconSeat = () => <svg viewBox="0 0 24 24" {...S}><path d="M4 9a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v3h6V6a2 2 0 0 1 2-2 2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H8l-4-4z" /></svg>;
const IconBag = () => <svg viewBox="0 0 24 24" {...S}><rect x="5" y="8" width="14" height="11" rx="2" /><path d="M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /></svg>;
const IconGear = () => <svg viewBox="0 0 24 24" {...S}><path d="M6 5v14M6 9h6a2 2 0 0 1 2 2v0M18 5v14" /><circle cx="6" cy="5" r="1.6" /><circle cx="18" cy="5" r="1.6" /><circle cx="6" cy="19" r="1.6" /></svg>;
const IconSnow = () => <svg viewBox="0 0 24 24" {...S}><path d="M12 3v18M4.5 7.5l15 9M19.5 7.5l-15 9M12 6l-2.5-2.5M12 6l2.5-2.5M12 18l-2.5 2.5M12 18l2.5 2.5" /></svg>;

function transmissionLabel(t: string | null): string | null {
  if (!t) return null;
  return /auto|automa/i.test(t) ? "Automatic" : "Manual";
}

export function SpecsRow({ specs }: { specs?: Specs }) {
  if (!specs) return null;
  const trans = transmissionLabel(specs.transmission);
  const items: JSX.Element[] = [];
  if (specs.seats) items.push(<Spec key="s" icon={<IconSeat />} label={`${specs.seats}`} />);
  if (specs.luggage) items.push(<Spec key="b" icon={<IconBag />} label={`${specs.luggage}`} />);
  if (trans) items.push(<Spec key="t" icon={<IconGear />} label={trans} />);
  if (specs.aircon) items.push(<Spec key="a" icon={<IconSnow />} label="A/C" />);
  if (items.length === 0) return null;
  return <div className="cat-specs">{items}</div>;
}

/**
 * Verified rating — the trust substitute that makes booking an unbranded local
 * partner feel safe (MARKETPLACE_PLAN §3b). Shows the score + review count, or a
 * neutral "New" pill when the partner has no published reviews yet (never a fake
 * or empty score).
 */
export function RatingBadge({ rating }: { rating?: CardRating | null }) {
  if (!rating) return <span className="cat-rating cat-rating--new">New</span>;
  return (
    <span className="cat-rating" title={`${rating.avg.toFixed(1)} from ${rating.count} verified ${rating.count === 1 ? "review" : "reviews"}`}>
      <IconStar />
      <b>{rating.avg.toFixed(1)}</b>
      <span className="cat-rating-count">· {rating.count}</span>
    </span>
  );
}

export default function CategoryCard({
  offer, onBook, disabled, title, displayCurrency, rentalDays, insurance, rating,
}: {
  offer: CategoryOffer;
  onBook: (o: CategoryOffer) => void;
  disabled?: boolean;
  title?: string;
  displayCurrency: DisplayCurrency;
  rentalDays: number;
  insurance?: CardInsurance;
  rating?: CardRating | null;
}) {
  const hasPrice = offer.from_price != null;
  return (
    <article className="cat-card">
      <div className="cat-media">
        <CategoryImage src={offer.image_url} name={offer.category_name || offer.name} alt={title || offer.name} />
        <span className="cat-tag">Local partner</span>
      </div>
      <div className="cat-body">
        <div className="cat-head">
          <h3>{title || offer.name}</h3>
          <RatingBadge rating={rating} />
        </div>
        <p className="cat-similar">or similar — assigned at confirmation</p>
        <SpecsRow specs={offer.specs} />
        {offer.description && <p className="cat-desc">{offer.description}</p>}

        {/* Peace-of-mind option: shown only when a partner in this class offers
            insurance. Cheapest stays the default; this is the optional trigger. */}
        {insurance && insurance.sameAsBest && (
          <span className="cat-ins-chip"><IconShield /> Insurance option available</span>
        )}
        {insurance && !insurance.sameAsBest && (
          <button className="cat-ins-upsell" disabled={disabled} onClick={insurance.onBook}>
            <IconShield /> With full insurance — from {displayPrice(insurance.priceFrom, insurance.currency, displayCurrency)}/day
          </button>
        )}

        <div className="cat-foot">
          <div className="cat-price">
            {hasPrice ? (
              <>
                <b>{displayPrice(offer.from_price!, offer.currency, displayCurrency)}</b>
                <span>per day, from{rentalDays > 0 ? ` · ${displayPrice(offer.from_price! * rentalDays, offer.currency, displayCurrency)} total` : ""}</span>
              </>
            ) : (
              <b style={{ fontSize: 16 }}>On request</b>
            )}
          </div>
          <button className="btn btn-teal" disabled={disabled} onClick={() => onBook(offer)}>Book</button>
        </div>
      </div>
    </article>
  );
}

function IconStar() {
  return <svg viewBox="0 0 24 24" width={13} height={13} fill="currentColor" stroke="none" style={{ flexShrink: 0 }}><path d="M12 2.5l2.9 5.9 6.5.95-4.7 4.6 1.1 6.5L12 18l-5.8 3 1.1-6.5-4.7-4.6 6.5-.95z" /></svg>;
}

function IconShield() {
  return <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 5, flexShrink: 0 }}><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" /><path d="M9 12l2 2 4-4" /></svg>;
}
