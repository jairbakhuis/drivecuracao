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
export default function CategoryImage({ src, name, alt }: { src?: string | null; name: string; alt?: string }) {
  const bucket = categoryBucket(name);
  const candidates = [
    `/categories/${bucket}.jpg`,
    `/categories/${bucket}.png`,
    ...(src ? [src] : []),
  ];
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
