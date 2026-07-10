export function todayPlus(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function daysBetween(start: string, end: string): number {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  return Math.max(1, Math.ceil(ms / 86_400_000));
}

export const FAQS: { q: string; a: string }[] = [
  {
    q: "How does Drive Curaçao work?",
    a: "We list rental cars from trusted local companies across Curaçao in one place. You pick your dates, choose a car category, and send a booking request. The rental company confirms availability and emails you the details. You pay at pickup — no prepayment needed.",
  },
  {
    q: "Do I book a specific car or a category?",
    a: "You book a category — for example \"Compact automatic\" — and the rental company assigns you a specific car of that type (or similar) when they confirm. This keeps things flexible and gets you the best available car in your class.",
  },
  {
    q: "When and how do I pay?",
    a: "You pay the rental company directly at pickup, following their normal terms. Drive Curaçao never charges your card — there's no prepayment and no booking fee for you.",
  },
  {
    q: "Which company will I rent from?",
    a: "All our partners are licensed local rental companies in Curaçao. You'll see the confirmed company's name and pickup details in your confirmation email once your request is accepted.",
  },
  {
    q: "What do I need to rent a car?",
    a: "A valid driver's license, a form of ID or passport, and to meet the rental company's minimum age (usually 21–23). Some companies ask for a credit card for the security deposit. Requirements are confirmed by the company when they accept your request.",
  },
  {
    q: "Can I cancel my booking?",
    a: "Yes — a request costs you nothing and you can cancel any time before pickup for free. If your plans change, just let us or the rental company know.",
  },
  {
    q: "Is my driver's license from abroad valid in Curaçao?",
    a: "Most foreign licenses in English, Dutch, Spanish, or with an International Driving Permit are accepted for short-term rentals. If in doubt, message us before booking and we'll check for you.",
  },
  {
    q: "Do you offer airport pickup?",
    a: "Many partners offer pickup at or near Hato International Airport (CUR). Add your flight number when you book and the company will coordinate the handover with you.",
  },
];
