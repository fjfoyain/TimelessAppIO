import { describe, it, expect } from "vitest";
import { offerBounds, offerError } from "../negotiation";

describe("offerBounds", () => {
  it("allows half to double the listed price", () => {
    expect(offerBounds(240)).toEqual({ min: 120, max: 480 });
  });

  it("rounds inward so the limits are never looser than the ratio", () => {
    expect(offerBounds(75)).toEqual({ min: 38, max: 150 });
  });
});

describe("offerError", () => {
  it("rejects the $2000 offer on a $240 plan", () => {
    expect(offerError(2000, 240)).toMatch(/between \$120 and \$480/);
  });

  it("rejects an offer far below the listed price", () => {
    expect(offerError(10, 240)).not.toBeNull();
  });

  it("rejects zero, negatives and non-numbers", () => {
    expect(offerError(0, 240)).not.toBeNull();
    expect(offerError(-50, 240)).not.toBeNull();
    expect(offerError(NaN, 240)).not.toBeNull();
  });

  it("accepts the listed price and both limits", () => {
    expect(offerError(240, 240)).toBeNull();
    expect(offerError(120, 240)).toBeNull();
    expect(offerError(480, 240)).toBeNull();
  });
});
