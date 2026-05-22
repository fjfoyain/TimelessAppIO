// Keeps deals on the platform: phone numbers and emails typed into chat
// messages are masked before the message is stored (Airbnb-style).

const MASK = "•••";

/**
 * Masks contact information (phone numbers, emails) in a chat message.
 * Returns the cleaned text and whether anything was masked.
 */
export function maskContactInfo(text: string): { text: string; masked: boolean } {
  let masked = false;

  // Emails: user@domain.tld
  let out = text.replace(/[^\s@]+@[^\s@]+\.[^\s@]+/g, () => {
    masked = true;
    return MASK;
  });

  // Phone-like runs: a digit, then digits/separators, ending in a digit.
  // Only masked when the run contains 7+ actual digits, so prices, short
  // quantities and years embedded in words are left alone.
  out = out.replace(/\+?\d[\d\s().\-]{5,}\d/g, (match) => {
    const digitCount = (match.match(/\d/g) || []).length;
    if (digitCount >= 7) {
      masked = true;
      return MASK;
    }
    return match;
  });

  return { text: out, masked };
}
