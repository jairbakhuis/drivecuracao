import assert from "node:assert/strict";
import test from "node:test";
import { addCalendarDays, curacaoLocalDateTimeISO, isCalendarDate, todayPlus } from "../src/utils.ts";
import { DISPLAY_CURRENCIES, displayPrice, formatPrice } from "../src/api.ts";

test("calendar arithmetic stays on the intended date across leap days", () => {
  assert.equal(addCalendarDays("2028-02-28", 1), "2028-02-29");
  assert.equal(addCalendarDays("2028-02-29", 1), "2028-03-01");
  assert.equal(addCalendarDays("2026-12-31", 1), "2027-01-01");
});

test("calendar validation rejects impossible dates", () => {
  assert.equal(isCalendarDate("2028-02-29"), true);
  assert.equal(isCalendarDate("2027-02-29"), false);
  assert.throws(() => addCalendarDays("2026-02-31", 1), RangeError);
});

test("todayPlus uses the Curaçao calendar date", () => {
  const expected = new Intl.DateTimeFormat("en", {
    timeZone: "America/Curacao",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date()).reduce((parts, part) => {
    parts[part.type] = part.value;
    return parts;
  }, {});
  const today = `${expected.year}-${expected.month}-${expected.day}`;
  assert.equal(todayPlus(0), today);
  assert.equal(todayPlus(2), addCalendarDays(today, 2));
});

test("Curaçao pickup wall time serializes with the correct UTC-04:00 offset", () => {
  const value = curacaoLocalDateTimeISO("2026-10-26", "10:00");
  assert.equal(value, "2026-10-26T10:00:00-04:00");
  assert.equal(new Date(value).toISOString(), "2026-10-26T14:00:00.000Z");
  assert.throws(() => curacaoLocalDateTimeISO("2026-02-31", "10:00"), RangeError);
  assert.throws(() => curacaoLocalDateTimeISO("2026-10-26", "25:00"), RangeError);
});

test("display currencies use XCG for the Caribbean guilder and format it unambiguously", () => {
  assert.deepEqual(DISPLAY_CURRENCIES, ["USD", "EUR", "XCG"]);
  assert.equal(formatPrice(25, "XCG"), "XCG 25.00");
  assert.equal(displayPrice(50, "USD", "XCG"), "XCG 89.50");
  assert.equal(displayPrice(50, "ANG", "XCG"), "XCG 50.00");
});
