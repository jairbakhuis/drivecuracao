# Category images

Drop one image per **category type** here and it appears on every matching car
card across the marketplace — no matter how each rental company spells their
category. Until a file is added, that category falls back to the built-in
vector, so nothing ever looks broken.

The site shows a **type** of car (a class, "or similar"), never one specific
vehicle — so a clean side-profile illustration is exactly right here.

## Filenames the site looks for

For each bucket the site tries `<bucket>.png` first, then `<bucket>.jpg`, then
the built-in vector. **Use transparent PNG** for the illustration style below —
the card gives it padding and a soft background, so a car floating on
transparency looks best.

| File | Used for category names like… |
|---|---|
| `economy.png` | Economy, Economy plus, Student, Sub-Compact, Mini, Budget, Small |
| `compact.png` | Compact, Compact automaat, Compact Car, Compact handgeschakeld |
| `hatchback.png` | Hatchback |
| `sedan.png` | Sedan, Mid-Size / Midsize, Mid Class Sedan, Intermediate, Standard, Full-size |
| `suv.png` | SUV, Mini SUV, Mid-size SUV, Full-size SUV, Jeep, 4x4, Crossover |
| `pickup.png` | Pickup, Pickup truck, Truck |
| `van.png` | Van, Minivan, MPV, 7/8-seater |
| `luxury.png` | Luxury, Premium, Executive |
| `convertible.png` | Convertible, Cabrio |

You only need the ones you actually rent. Today the fleets use mostly
**economy, compact, sedan and suv** — start with those four.

## Style that matches the reference set

- **Side profile**, single car, **centred** with a little breathing room.
- **Detailed illustration** (not a photo): rich body colour, tinted windows,
  visible alloy wheels — the premium "stock illustration" look.
- **Transparent background** (PNG). No shadow baked in is fine; the card adds
  its own soft backdrop.
- Keep the **same viewpoint, scale and lighting** across all files so the grid
  reads as one consistent set.
- **No text or watermarks** — they clash with the card overlay, and a
  watermarked image isn't licensed for the live site.
- Around **1000 × 600px**, PNG compressed to **under ~200 KB** each.

## How to add them

GitHub → this folder → **Add file → Upload files** → drop the images in with the
exact names above → **Commit changes**. They go live on the next deploy.

## Want me to generate the whole set?

I can generate a consistent, brand-matched set of all nine illustrations in this
exact style and wire them in for you — no sourcing or licensing hassle. That
runs on the Higgsfield image tool, which needs credits on your account (the plan
currently shows just 1). Top it up and say the word, and I'll produce the full
set in one pass.
