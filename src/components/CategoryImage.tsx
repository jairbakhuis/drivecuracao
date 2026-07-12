import { useState } from "react";
import CategoryIllustration from "./CategoryIllustration";
import { categoryBucket } from "../categoryImage";

/**
 * Category thumbnail. Prefers a dropped-in illustration for the category bucket
 * (public/categories/<bucket>.png or .jpg — transparent PNG looks best), and
 * falls back to the built-in vector only until those are uploaded. Shows a TYPE
 * of car, never a specific vehicle, so no tenant car photo is used.
 */
export default function CategoryImage({ name, alt }: { name: string; alt?: string }) {
  const bucket = categoryBucket(name);
  const candidates = [`/categories/${bucket}.png`, `/categories/${bucket}.jpg`];
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
