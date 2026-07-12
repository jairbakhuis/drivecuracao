// Map any tenant category name (messy: "Compact", "compact automaat", "SUV",
// "Mid size suv", "sedan"…) to one of a small set of clean image buckets, so
// the marketplace shows one professional photo per category type regardless of
// how each rental company names it. Drop the photos in public/categories/.

export type CategoryBucket =
  | "economy" | "compact" | "hatchback" | "sedan"
  | "suv" | "pickup" | "van" | "luxury" | "convertible";

/**
 * Match a category name to a bucket, or return null when nothing matches — so
 * callers that must NOT lump unknown categories together (e.g. grouping the
 * marketplace listing) can fall back to the raw name instead of the "economy"
 * catch-all.
 */
export function categoryBucketExact(name: string): CategoryBucket | null {
  const n = (name || "").toLowerCase();
  if (/\b(suv|jeep|4x4|4wd|crossover)\b/.test(n)) return "suv";
  if (/pick.?up|truck/.test(n)) return "pickup";
  if (/\b(van|minivan|mpv|people|7.?seat|8.?seat)\b/.test(n)) return "van";
  if (/convert|cabrio/.test(n)) return "convertible";
  if (/lux|premium|exec/.test(n)) return "luxury";
  if (/sedan|mid.?size|midsize|mid.?class|intermediate|standard|full.?size/.test(n)) return "sedan";
  if (/hatch/.test(n)) return "hatchback";
  if (/compact/.test(n)) return "compact";
  if (/economy|student|sub.?compact|mini|budget|small/.test(n)) return "economy";
  return null;
}

export function categoryBucket(name: string): CategoryBucket {
  return categoryBucketExact(name) ?? "economy"; // sensible default for anything unrecognised
}

/** Clean, customer-facing label per bucket for the collapsed listing card. */
const BUCKET_LABEL: Record<CategoryBucket, string> = {
  economy: "Economy",
  compact: "Compact",
  hatchback: "Hatchback",
  sedan: "Sedan",
  suv: "SUV",
  pickup: "Pickup",
  van: "Van",
  luxury: "Luxury",
  convertible: "Convertible",
};

export function bucketLabel(bucket: CategoryBucket): string {
  return BUCKET_LABEL[bucket];
}

// Absolute path (custom domain served at root). Files that don't exist simply
// fail to load and the component falls back — so nothing breaks before upload.
export function categoryImagePath(name: string): string {
  return `/categories/${categoryBucket(name)}.jpg`;
}
