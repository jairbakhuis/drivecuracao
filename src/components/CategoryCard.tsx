import { CategoryOffer, formatPrice } from "../api";
import CategoryImage from "./CategoryImage";

export default function CategoryCard({
  offer, onBook, disabled, title,
}: {
  offer: CategoryOffer;
  onBook: (o: CategoryOffer) => void;
  disabled?: boolean;
  /** Clean class label ("Compact", "SUV"). Falls back to the offer name. */
  title?: string;
}) {
  return (
    <article className="cat-card">
      <div className="cat-media">
        <CategoryImage name={offer.category_name || offer.name} alt={title || offer.name} />
        <span className="cat-tag">Local partner</span>
      </div>
      <div className="cat-body">
        <h3>{title || offer.name}</h3>
        <p className="cat-similar">or similar — assigned at confirmation</p>
        {offer.description && <p className="cat-desc">{offer.description}</p>}
        <div className="cat-foot">
          <div className="cat-price">
            {offer.from_price != null ? (
              <>
                <b>{formatPrice(offer.from_price, offer.currency)}</b>
                <span>per day, from</span>
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
