// Map any tenant category name (messy: "Compact", "compact automaat", "SUV",
// "Mid size suv", "sedan"…) to one of a small set of clean image buckets, so
// the marketplace shows one professional photo per category type regardless of
// how each rental company names it. Drop the photos in public/categories/.

export type CategoryBucket =
  | "economy" | "compact" | "hatchback" | "sedan"
  | "suv" | "pickup" | "van" | "luxury" | "convertible";

export function categoryBucket(name: string): CategoryBucket {
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
  return "economy"; // sensible default for anything unrecognised
}

// Absolute path (custom domain served at root). Files that don't exist simply
// fail to load and the component falls back — so nothing breaks before upload.
export function categoryImagePath(name: string): string {
  return `/categories/${categoryBucket(name)}.jpg`;
}
