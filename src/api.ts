// Thin client for the SuaveCars marketplace API (public, keyless).
// The storefront is white-label: tenant_id is an opaque routing key and is
// never shown to the customer.

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

export interface BookingInput {
  tenant_id: string;
  category_name: string;
  rental_start_date: string; // ISO
  rental_end_date: string; // ISO
  pickup_location_details?: string;
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
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error || `Request failed (${res.status})`);
  }
  return data as T;
}

export function listCategories(pickupDate?: string, returnDate?: string): Promise<{ categories: CategoryOffer[] }> {
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
