// Limits for a price offer, relative to the plan's listed price. They keep a
// typo or an absurd figure out of the negotiation without preventing a real
// one: offers below list are expected, offers above cover extras.
export const OFFER_MIN_RATIO = 0.5;
export const OFFER_MAX_RATIO = 2;

export function offerBounds(planPrice: number): { min: number; max: number } {
  return {
    min: Math.ceil(planPrice * OFFER_MIN_RATIO),
    max: Math.floor(planPrice * OFFER_MAX_RATIO),
  };
}

// Returns why an offer is not acceptable, or null when it is.
export function offerError(amount: number, planPrice: number): string | null {
  if (!Number.isFinite(amount) || amount <= 0) return "Enter a valid amount.";
  const { min, max } = offerBounds(planPrice);
  if (amount < min || amount > max) {
    return `Offers for this plan must be between $${min} and $${max}.`;
  }
  return null;
}
