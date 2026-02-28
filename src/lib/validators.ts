import { z } from "zod";

export const artistRegistrationSchema = z.object({
  stageName: z.string().min(2, "Stage name must be at least 2 characters"),
  genre: z.string().min(1, "Please select a genre"),
  bio: z.string().min(10, "Bio must be at least 10 characters").max(500),
  instagram: z.string().optional(),
  spotify: z.string().optional(),
  soundcloud: z.string().optional(),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  agreeTerms: z.literal(true, { error: "You must agree to the terms" }),
});

export const clientRegistrationSchema = z.object({
  company: z.string().min(2, "Company name required"),
  role: z.string().min(2, "Role required"),
  interest: z.string().min(1, "Please select an interest area"),
  budget: z.string().min(1, "Please select a budget range"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  agreeTerms: z.literal(true, { error: "You must agree to the terms" }),
});

export const talentRegistrationSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  category: z.string().min(1, "Please select a category"),
  experience: z.enum(["newcomer", "pro", "veteran"]),
  baseRate: z.string().min(1, "Rate is required"),
  ratePer: z.enum(["Hour", "Day", "Project"]),
  portfolioLink: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  agreeTerms: z.literal(true, { error: "You must agree to the terms" }),
});

export const venueRegistrationSchema = z.object({
  venueName: z.string().min(2, "Venue name required"),
  location: z.string().min(2, "Location required"),
  capacity: z.string().min(1, "Capacity is required"),
  eventTypes: z.array(z.string()).min(1, "Select at least one event type"),
  equipment: z.string().optional(),
  websiteLink: z.string().optional(),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  agreeTerms: z.literal(true, { error: "You must agree to the terms" }),
});

export type ArtistRegistration = z.infer<typeof artistRegistrationSchema>;
export type ClientRegistration = z.infer<typeof clientRegistrationSchema>;
export type TalentRegistration = z.infer<typeof talentRegistrationSchema>;
export type VenueRegistration = z.infer<typeof venueRegistrationSchema>;

// ─── App Form Validators ─────────────────────────────────────────

export const profileUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  jobTitle: z.string().optional(),
  bio: z.string().max(500, "Bio must be under 500 characters").optional(),
  portfolioLink: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});

export const eventSchema = z.object({
  title: z.string().min(3, "Event name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  venueId: z.string().min(1, "Please select a venue"),
  services: z.array(z.string()),
});

export const bookingSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  day: z.string().min(1, "Day is required"),
  hour: z.number().min(0).max(23),
  duration: z.number().min(1).max(12),
});

export const serviceSchema = z.object({
  name: z.string().min(2, "Service name must be at least 2 characters"),
  category: z.string().min(1, "Please select a category"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  hourlyRate: z.number().min(1, "Rate must be at least $1"),
  availability: z.array(z.string()).min(1, "Select at least one day"),
});

export type ProfileUpdate = z.infer<typeof profileUpdateSchema>;
export type EventFormData = z.infer<typeof eventSchema>;
export type BookingFormData = z.infer<typeof bookingSchema>;
export type ServiceFormData = z.infer<typeof serviceSchema>;
