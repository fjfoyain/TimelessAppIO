import { describe, it, expect } from "vitest";
import {
  artistRegistrationSchema,
  clientRegistrationSchema,
  talentRegistrationSchema,
  venueRegistrationSchema,
  profileUpdateSchema,
  eventSchema,
  bookingSchema,
  serviceSchema,
} from "@/lib/validators";

// ─── eventSchema ─────────────────────────────────────────────────
// This is the schema wired into /events/create — most important to cover.

describe("eventSchema", () => {
  const valid = {
    title: "Neon Nights",
    description: "A rooftop launch party with live DJs.",
    date: "2026-06-01",
    time: "21:00",
    venueId: "venue-123",
    services: ["DJ Spark", "Security"],
  };

  it("accepts a complete event", () => {
    expect(eventSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts an empty services array", () => {
    expect(eventSchema.safeParse({ ...valid, services: [] }).success).toBe(true);
  });

  it("rejects a title shorter than 3 characters", () => {
    expect(eventSchema.safeParse({ ...valid, title: "ab" }).success).toBe(false);
  });

  it("rejects a description shorter than 10 characters", () => {
    expect(eventSchema.safeParse({ ...valid, description: "short" }).success).toBe(false);
  });

  it("rejects a missing date", () => {
    expect(eventSchema.safeParse({ ...valid, date: "" }).success).toBe(false);
  });

  it("rejects a missing time", () => {
    expect(eventSchema.safeParse({ ...valid, time: "" }).success).toBe(false);
  });

  it("rejects a missing venueId", () => {
    expect(eventSchema.safeParse({ ...valid, venueId: "" }).success).toBe(false);
  });
});

// ─── venueRegistrationSchema ─────────────────────────────────────

describe("venueRegistrationSchema", () => {
  const valid = {
    venueName: "Neon Garden",
    location: "Av. Amazonas 1234, Quito",
    capacity: "300",
    eventTypes: ["Techno"],
    equipment: "Sound system",
    websiteLink: "https://neongarden.example.com",
    email: "venue@example.com",
    password: "supersecret",
    agreeTerms: true as const,
  };

  it("accepts a complete venue registration", () => {
    expect(venueRegistrationSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects an empty eventTypes array", () => {
    expect(venueRegistrationSchema.safeParse({ ...valid, eventTypes: [] }).success).toBe(false);
  });

  it("rejects an invalid email", () => {
    expect(venueRegistrationSchema.safeParse({ ...valid, email: "not-an-email" }).success).toBe(false);
  });

  it("rejects a password shorter than 8 characters", () => {
    expect(venueRegistrationSchema.safeParse({ ...valid, password: "short" }).success).toBe(false);
  });

  it("rejects when terms are not agreed", () => {
    expect(venueRegistrationSchema.safeParse({ ...valid, agreeTerms: false }).success).toBe(false);
  });
});

// ─── talentRegistrationSchema ────────────────────────────────────

describe("talentRegistrationSchema", () => {
  const valid = {
    fullName: "Luna Vega",
    category: "DJ / Producer",
    experience: "veteran" as const,
    baseRate: "180",
    ratePer: "Hour" as const,
    portfolioLink: "https://luna.example.com",
    email: "luna@example.com",
    password: "supersecret",
    agreeTerms: true as const,
  };

  it("accepts a complete talent registration", () => {
    expect(talentRegistrationSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts an empty portfolio link", () => {
    expect(talentRegistrationSchema.safeParse({ ...valid, portfolioLink: "" }).success).toBe(true);
  });

  it("rejects an invalid portfolio URL", () => {
    expect(talentRegistrationSchema.safeParse({ ...valid, portfolioLink: "notaurl" }).success).toBe(false);
  });

  it("rejects an unknown experience level", () => {
    expect(talentRegistrationSchema.safeParse({ ...valid, experience: "expert" }).success).toBe(false);
  });

  it("rejects an unknown ratePer value", () => {
    expect(talentRegistrationSchema.safeParse({ ...valid, ratePer: "Week" }).success).toBe(false);
  });
});

// ─── artistRegistrationSchema ────────────────────────────────────

describe("artistRegistrationSchema", () => {
  const valid = {
    stageName: "DJ Aurora",
    genre: "House",
    bio: "Producer and DJ blending melodic house and techno.",
    email: "aurora@example.com",
    password: "supersecret",
    agreeTerms: true as const,
  };

  it("accepts a complete artist registration", () => {
    expect(artistRegistrationSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a bio shorter than 10 characters", () => {
    expect(artistRegistrationSchema.safeParse({ ...valid, bio: "short" }).success).toBe(false);
  });

  it("rejects a stage name shorter than 2 characters", () => {
    expect(artistRegistrationSchema.safeParse({ ...valid, stageName: "A" }).success).toBe(false);
  });
});

// ─── clientRegistrationSchema ────────────────────────────────────

describe("clientRegistrationSchema", () => {
  const valid = {
    company: "Acme Events",
    role: "Producer",
    interest: "Booking talent",
    budget: "5k-10k",
    email: "client@example.com",
    password: "supersecret",
    agreeTerms: true as const,
  };

  it("accepts a complete client registration", () => {
    expect(clientRegistrationSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a missing budget", () => {
    expect(clientRegistrationSchema.safeParse({ ...valid, budget: "" }).success).toBe(false);
  });
});

// ─── profileUpdateSchema ─────────────────────────────────────────

describe("profileUpdateSchema", () => {
  it("accepts a minimal profile update", () => {
    expect(profileUpdateSchema.safeParse({ name: "Pancho" }).success).toBe(true);
  });

  it("accepts an empty portfolio link", () => {
    expect(profileUpdateSchema.safeParse({ name: "Pancho", portfolioLink: "" }).success).toBe(true);
  });

  it("rejects an invalid portfolio URL", () => {
    expect(profileUpdateSchema.safeParse({ name: "Pancho", portfolioLink: "nope" }).success).toBe(false);
  });

  it("rejects a name shorter than 2 characters", () => {
    expect(profileUpdateSchema.safeParse({ name: "P" }).success).toBe(false);
  });
});

// ─── bookingSchema ───────────────────────────────────────────────

describe("bookingSchema", () => {
  const valid = { title: "Studio session", day: "Mon", hour: 14, duration: 2 };

  it("accepts a valid booking", () => {
    expect(bookingSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects an hour outside 0-23", () => {
    expect(bookingSchema.safeParse({ ...valid, hour: 25 }).success).toBe(false);
  });

  it("rejects a duration outside 1-12", () => {
    expect(bookingSchema.safeParse({ ...valid, duration: 0 }).success).toBe(false);
  });
});

// ─── serviceSchema ───────────────────────────────────────────────

describe("serviceSchema", () => {
  const valid = {
    name: "Live sound mixing",
    category: "Sound Engineer",
    description: "Front-of-house mixing for live shows.",
    hourlyRate: 150,
    availability: ["Fri", "Sat"],
  };

  it("accepts a valid service", () => {
    expect(serviceSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects an hourly rate below 1", () => {
    expect(serviceSchema.safeParse({ ...valid, hourlyRate: 0 }).success).toBe(false);
  });

  it("rejects an empty availability array", () => {
    expect(serviceSchema.safeParse({ ...valid, availability: [] }).success).toBe(false);
  });
});
