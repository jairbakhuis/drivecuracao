# Category images (our own, professional)

One professional photo per category type. This is the browse image for every
matching car card across the marketplace, no matter how each rental company
spells their category — so browsing stays consistent even when partners have
poor or missing photos.

The card shows a **type** of car (a class, "or similar"), never one specific
vehicle — so a clean, well-lit studio-style car photo is ideal.

## Priority the site uses (per class)

1. **Our own image here** — `<bucket>.jpg` then `<bucket>.png` (this file wins).
2. **The partner's real car photo** — only when we have no class image yet.
3. Built-in vector — last resort so nothing ever looks broken.

## Filenames (lowercase, GitHub Pages is case-sensitive)

`economy.jpg`, `compact.jpg`, `hatchback.jpg`, `sedan.jpg`, `suv.jpg`,
`pickup.jpg`, `van.jpg`, `luxury.jpg`, `convertible.jpg`

These map 1:1 to the 9 fixed SuaveCars vehicle categories.

## Photo guidance

Real photographic images: front ¾ or side angle, plain/neutral (ideally white)
background, no visible plate/logos preferred, landscape, ~1000–1600px wide,
**JPG under ~300 KB** (resize with squoosh.app before uploading — PNGs are often
too large for GitHub's web upload). Keep the same angle/background across all
files so the grid reads as one set.

## How to add / replace

GitHub → this folder → **Add file → Upload files** → drop the images in with the
exact lowercase names above → **Commit changes**. Live on the next deploy.
