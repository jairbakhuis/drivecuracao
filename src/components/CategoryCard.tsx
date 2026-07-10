import { CategoryOffer, formatPrice } from "../api";
import { CarIllustration } from "./Brand";

export default function CategoryCard({
  offer, index, onBook, disabled,
}: {
  offer: CategoryOffer;
  index: number;
  onBook: (o: CategoryOffer) => void;
  disabled?: boolean;
}) {
  return (
    <article className="cat-card reveal">
      <div className="cat-media">
        {offer.image_url ? (
          <img src={offer.image_url} alt={offer.name} loading="lazy" />
        ) : (
          <CarIllustration variant={index} />
        )}
        <span className="cat-tag">Local partner</span>
      </div>
      <div className="cat-body">
        <h3>{offer.name}</h3>
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
