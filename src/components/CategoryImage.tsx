import { useMemo, useState } from "react";
import { CarIllustration } from "./Brand";
import { categoryImagePath } from "../categoryImage";

/**
 * Category thumbnail with a graceful fallback chain:
 *   1. the shared professional photo for this category bucket (public/categories)
 *   2. the tenant's own image, if any
 *   3. the built-in illustration
 * A missing/broken image just advances to the next candidate — nothing breaks
 * before the photos are uploaded.
 */
export default function CategoryImage({
  name, tenantImage, index, alt,
}: {
  name: string; tenantImage?: string | null; index: number; alt: string;
}) {
  const candidates = useMemo(
    () => [categoryImagePath(name), tenantImage || ""].filter(Boolean),
    [name, tenantImage]
  );
  const [i, setI] = useState(0);
  if (i >= candidates.length) return <CarIllustration variant={index} />;
  return (
    <img
      src={candidates[i]}
      alt={alt}
      loading="lazy"
      onError={() => setI((n) => n + 1)}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  );
}
