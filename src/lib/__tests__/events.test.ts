import { describe, it, expect } from "vitest";
import { isUpcoming, localDateString } from "../events";

// Local evening of 24 Nov 2026 — late enough that UTC is already the 25th in
// Quito, which is exactly when a UTC-based comparison goes wrong.
const now = new Date(2026, 10, 24, 21, 30);

describe("localDateString", () => {
  it("formats the local calendar day", () => {
    expect(localDateString(now)).toBe("2026-11-24");
  });
});

describe("isUpcoming", () => {
  it("keeps an event happening today", () => {
    expect(isUpcoming("2026-11-24", now)).toBe(true);
  });

  it("keeps a future event", () => {
    expect(isUpcoming("2026-12-05", now)).toBe(true);
  });

  it("drops the March and May events", () => {
    expect(isUpcoming("2026-03-14", now)).toBe(false);
    expect(isUpcoming("2026-05-02", now)).toBe(false);
  });

  it("drops events with a missing or malformed date", () => {
    expect(isUpcoming(undefined, now)).toBe(false);
    expect(isUpcoming("", now)).toBe(false);
    expect(isUpcoming("next friday", now)).toBe(false);
  });
});
