import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const template = await readFile(path.join(dist, "index.html"), "utf8");

const pages = [
  {
    route: "cars",
    title: "Browse Curaçao Rental Cars | Drive Curaçao",
    description: "Compare car categories for your Curaçao dates, request from local rental companies, and pay at pickup.",
    image: "/images/hero-cars.jpg",
  },
  {
    route: "how-it-works",
    title: "How Car Rental Requests Work | Drive Curaçao",
    description: "See how to compare a car category, send a rental request, and arrange pickup directly with a local Curaçao company.",
    image: "/images/hero-how.jpg",
  },
  {
    route: "about",
    title: "About Drive Curaçao | Local Car Rental Marketplace",
    description: "Learn about Drive Curaçao, a local marketplace connecting visitors with Curaçao car-rental companies.",
    image: "/images/hero-about.jpg",
  },
  {
    route: "faq",
    title: "Curaçao Car Rental FAQ | Drive Curaçao",
    description: "Answers about car categories, rental requests, payment at pickup, driver requirements, and Curaçao airport pickup.",
    image: "/images/hero-faq.jpg",
  },
  {
    route: "for-rental-companies",
    title: "For Curaçao Rental Companies | Drive Curaçao",
    description: "Information for Curaçao rental companies interested in receiving marketplace booking requests.",
    image: "/images/hero-about.jpg",
  },
  {
    route: "auto-huren-curacao",
    title: "Auto Huren op Curaçao | Drive Curaçao",
    description: "Vergelijk autoklassen op Curaçao, vraag een huurauto aan en betaal de lokale verhuurder bij het ophalen.",
    image: "/images/hero-cars.jpg",
  },
  {
    route: "car-rental-curacao-airport",
    title: "Curaçao Airport Car Rental | Drive Curaçao",
    description: "Request a Curaçao rental car for your trip and coordinate Hato Airport pickup directly with the local company.",
    image: "/images/hero-cars.jpg",
  },
  {
    route: "cheap-car-rental-curacao",
    title: "Affordable Car Rental in Curaçao | Drive Curaçao",
    description: "Compare rental-car categories and prices for Curaçao. Send a request without prepayment and pay at pickup.",
    image: "/images/hero-cars.jpg",
  },
  {
    route: "rent-a-car-willemstad",
    title: "Rent a Car in Willemstad | Drive Curaçao",
    description: "Find a rental-car category for exploring Willemstad and the rest of Curaçao with local rental companies.",
    image: "/images/hero-cars.jpg",
  },
  {
    route: "review",
    title: "Review Your Curaçao Car Rental | Drive Curaçao",
    description: "Share feedback about your Curaçao car-rental experience.",
    image: "/images/hero-home.jpg",
    robots: "noindex, nofollow",
  },
];

function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function setMeta(html, attribute, key, content) {
  const tag = `<meta ${attribute}="${escapeHtml(key)}" content="${escapeHtml(content)}" />`;
  const pattern = new RegExp(`<meta\\b(?=[^>]*\\b${attribute}=["']${escapeRegExp(key)}["'])[^>]*>`, "i");
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace("</head>", `  ${tag}\n</head>`);
}

for (const page of pages) {
  const url = `https://drivecuracao.com/${page.route}/`;
  let html = template.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(page.title)}</title>`);
  html = setMeta(html, "name", "description", page.description);
  html = setMeta(html, "property", "og:title", page.title);
  html = setMeta(html, "property", "og:url", url);
  html = setMeta(html, "property", "og:description", page.description);
  html = setMeta(html, "property", "og:image", `https://drivecuracao.com${page.image}`);
  html = setMeta(html, "property", "og:image:alt", page.title);
  html = setMeta(html, "name", "twitter:title", page.title);
  html = setMeta(html, "name", "twitter:description", page.description);
  html = setMeta(html, "name", "twitter:image", `https://drivecuracao.com${page.image}`);
  if (page.robots) html = setMeta(html, "name", "robots", page.robots);
  html = html.replace(
    /<link\s+rel=["']canonical["'][^>]*>/i,
    `<link rel="canonical" href="${url}" />`
  );
  html = html.replace(/(src|href)="\.\/assets\//g, '$1="/assets/');
  const staticFallback = `<noscript><main><h1>${escapeHtml(page.title)}</h1><p>${escapeHtml(page.description)}</p><p><a href="/cars/">Browse Curaçao rental cars</a></p></main></noscript>`;
  html = html.replace('<div id="root"></div>', `<div id="root"></div>\n    ${staticFallback}`);

  // GitHub Pages serves these as real static files (HTTP 200) while React
  // still renders the requested route in the browser. The root asset base
  // keeps scripts and styles loading from each nested directory.
  const directory = path.join(dist, page.route);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, "index.html"), html);
}

console.log(`Generated ${pages.length} route-specific static HTML shells.`);
