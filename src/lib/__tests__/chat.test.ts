import { describe, it, expect } from "vitest";
import { maskContactInfo } from "@/lib/chat";

describe("maskContactInfo", () => {
  it("masks a plain phone number", () => {
    const r = maskContactInfo("call me 0958909112");
    expect(r.masked).toBe(true);
    expect(r.text).not.toContain("0958909112");
  });

  it("masks a phone number with separators", () => {
    const r = maskContactInfo("my number is +593 95-890-9112");
    expect(r.masked).toBe(true);
    expect(r.text).not.toMatch(/9112/);
  });

  it("masks a phone number with spaces between digits", () => {
    const r = maskContactInfo("098 555 1234 is my cel");
    expect(r.masked).toBe(true);
  });

  it("masks an email address", () => {
    const r = maskContactInfo("write me at john@example.com please");
    expect(r.masked).toBe(true);
    expect(r.text).not.toContain("john@example.com");
  });

  it("masks both a phone and an email in one message", () => {
    const r = maskContactInfo("reach me 0991234567 or a@b.com");
    expect(r.masked).toBe(true);
    expect(r.text).not.toContain("0991234567");
    expect(r.text).not.toContain("a@b.com");
  });

  it("leaves a normal message untouched", () => {
    const r = maskContactInfo("Can you do a 2 hour set on Friday?");
    expect(r.masked).toBe(false);
    expect(r.text).toBe("Can you do a 2 hour set on Friday?");
  });

  it("leaves a short price untouched", () => {
    const r = maskContactInfo("the plan costs 1500 dollars");
    expect(r.masked).toBe(false);
  });

  it("keeps the rest of the sentence intact when masking", () => {
    const r = maskContactInfo("ok, my cel 0958909112 thanks");
    expect(r.text.startsWith("ok, my cel ")).toBe(true);
    expect(r.text.endsWith(" thanks")).toBe(true);
  });
});
