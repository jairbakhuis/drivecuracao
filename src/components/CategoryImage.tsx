import { useState } from "react";
import CategoryIllustration from "./CategoryIllustration";
import { categoryBucket } from "../categoryImage";

/**
 * Class thumbnail for the browse grid. Prefers OUR OWN professional class image
 * (public/categories/<bucket>.jpg|.png) so browsing looks consistent regardless
 * of how good each partner's photos are; falls back to the partner's real car
 * photo (`src`) when we have no class image for that bucket, and to the built-in
 * vector only as a last resort. Represents a TYPE of car ("or similar"), never a
 * promise of one specific vehicle.
 */
export default function CategoryImage({ src, name, alt, preferSrc }: { src?: string | null; name: string; alt?: string; preferSrc?: boolean }) {
  const bucket = categoryBucket(name);
  // Browse grid: our consistent class image wins. Checkout (preferSrc): show the
  // partner's ACTUAL car first so the customer sees the real vehicle they'll get.
  const own = [`/categories/${bucket}.jpg`, `/categories/${bucket}.png`];
  const partner = src ? [src] : [];
  const candidates = preferSrc ? [...partner, ...own] : [...own, ...partner];
  const [i, setI] = useState(0);
  if (i >= candidates.length) return <CategoryIllustration name={name} />;
  return (
    <img
      src={candidates[i]}
      alt={alt || name}
      loading="lazy"
      onError={() => setI((n) => n + 1)}
      style={{ width: "100%", height: "100%", objectFit: "contain", padding: "4px" }}
    />
  );
}
