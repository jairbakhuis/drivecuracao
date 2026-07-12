import { useState } from "react";
import CategoryIllustration from "./CategoryIllustration";
import { categoryImagePath } from "../categoryImage";

/**
 * Category thumbnail. Default is the branded illustration for the category TYPE
 * (so it's clear the customer picks a class of car, not one specific vehicle).
 * If a professional photo was dropped into public/categories for this bucket,
 * that overrides the illustration; a missing file just falls back cleanly.
 * The tenant's own car photo is intentionally NOT used here — showing a specific
 * car would imply the customer gets that exact vehicle.
 */
export default function CategoryImage({ name, alt }: { name: string; alt?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <CategoryIllustration name={name} />;
  return (
    <img
      src={categoryImagePath(name)}
      alt={alt || name}
      loading="lazy"
      onError={() => setFailed(true)}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  );
}
