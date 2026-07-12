import { useState } from "react";
import CategoryIllustration from "./CategoryIllustration";
import { categoryBucket } from "../categoryImage";

/**
 * Class thumbnail. Prefers the real partner car photo the marketplace API sends
 * for this class (`src` — a representative "or similar" vehicle), then a
 * dropped-in category illustration (public/categories/<bucket>.png|.jpg), and
 * only falls back to the built-in vector when neither exists. Represents a TYPE
 * of car ("or similar"), never a promise of one specific vehicle.
 */
export default function CategoryImage({ src, name, alt }: { src?: string | null; name: string; alt?: string }) {
  const bucket = categoryBucket(name);
  const candidates = [
    ...(src ? [src] : []),
    `/categories/${bucket}.png`,
    `/categories/${bucket}.jpg`,
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
