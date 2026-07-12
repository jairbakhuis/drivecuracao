// Thin client for the SuaveCars marketplace API (public, keyless).
// The storefront is white-label: tenant_id is an opaque routing key and is
// never shown to the customer.

import { categoryBucketExact, bucketLabel } from "./categoryImage";

const API_URL =
  "https://lppyxeoskelndowurxay.supabase.co/functions/v1/marketplace-api";

export interface CategoryOffer {
  tenant_id: string;
  category_name: string;
  name: string;
  description: string | null;
  image_url: string | null;
  from_price: number | null;
  currency: string;
}

/**
 * Booking rules for a partner, mirrored from their own site so the storefront
 * asks for exactly what they'd ask for. No identifying data — white-label safe.
 */
export interface PartnerReqs {
  min_age: number | null;
  license_required: boolean;
  flight_required: boolean;
  min_days: number | null;
  deposit_enabled: boolean;
  deposit_amount: number | null;
  downpayment_enabled: boolean;
  downpayment_amount: number | null;
  currency: string;
}

export interface BookingInput {
  tenant_id: string;
  category_name: string;
  rental_start_date: string; // ISO
  rental_end_date: string; // ISO
  pickup_location_details?: string;
  return_location_details?: string;
  flight_number?: string;
  notes?: string;
  customer: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    date_of_birth: string; // YYYY-MM-DD
    driver_license_number?: string;
    driver_license_expiry?: string; // YYYY-MM-DD
    country?: string;
    communication_preference?: "email" | "whatsapp" | "both";
  };
}

export interface BookingResult {
  ok: boolean;
  reservation_id: string;
  reservation_number: string;
  total_amount: number;
  daily_rate: number;
  rental_days: number;
  payment: string;
  confirmed?: boolean;
}

async function call<T>(body: Record<string, unknown>): Promise<T> {
  // Guard against a hung request leaving the UI stuck on a loading state.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  let res: Response;
  try {
    res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error || `Request failed (${res.status})`);
  }
  return data as T;
}

export function listCategories(
  pickupDate?: string,
  returnDate?: string
): Promise<{ categories: CategoryOffer[]; partners?: Record<string, PartnerReqs> }> {
  return call({
    action: "list_categories",
    ...(pickupDate && returnDate ? { pickup_date: pickupDate, return_date: returnDate } : {}),
  });
}

export function createBooking(input: BookingInput): Promise<BookingResult> {
  return call({ action: "create_booking", ...input });
}

export function formatPrice(amount: number, currency: string): string {
  const symbol = currency === "XCG" ? "ƒ" : currency === "EUR" ? "€" : "$";
  return `${symbol}${amount.toFixed(2)}`;
}

// ---------------------------------------------------------------------------
// Collapse the raw per-(partner, category) offers into ONE card per car class.
// The storefront is white-label: a customer chooses a CLASS of car ("a compact,
// or similar"), never a company. So when several partners offer the same class
// we show a single card at the cheapest available price and book that partner
// behind the scenes. The other offers are kept as `alternatives` so a later
// step can surface a partner's noteworthy extra (e.g. included insurance) as an
// optional upgrade — without ever exposing who the partner is.

export interface CategoryGroup {
  /** Stable grouping key (bucket name, or "name:<raw>" when unbucketed). */
  key: string;
  /** Clean customer-facing title, e.g. "Compact", "SUV". */
  title: string;
  /** Cheapest available offer — the default the Book button acts on. */
  best: CategoryOffer;
  /** All offers in this class, cheapest first (includes `best`). */
  alternatives: CategoryOffer[];
}

const cheapestFirst = (a: CategoryOffer, b: CategoryOffer) =>
  (a.from_price ?? Infinity) - (b.from_price ?? Infinity);

export function groupOffers(offers: CategoryOffer[]): CategoryGroup[] {
  // Local import to keep api.ts free of a hard dependency cycle at module load.
  const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");
  const groups = new Map<string, { title: string; members: CategoryOffer[] }>();

  for (const o of offers) {
    const raw = o.category_name || o.name || "";
    const bucket = categoryBucketExact(raw);
    const key = bucket ?? `name:${norm(raw)}`;
    const title = bucket ? bucketLabel(bucket) : (o.name || raw).trim();
    const g = groups.get(key);
    if (g) g.members.push(o);
    else groups.set(key, { title, members: [o] });
  }

  const out: CategoryGroup[] = [];
  for (const [key, { title, members }] of groups) {
    members.sort(cheapestFirst);
    out.push({ key, title, best: members[0], alternatives: members });
  }
  // Cheapest classes first, mirroring the API's own ordering.
  out.sort((a, b) => cheapestFirst(a.best, b.best));
  return out;
}
