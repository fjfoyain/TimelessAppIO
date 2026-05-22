// Blog content for SEO. File-based (no CMS) so posts are statically rendered.
// Add a new entry here to publish a post at /blog/<slug>.

export interface BlogSection {
  heading?: string;
  body: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string; // ISO date
  readTime: string;
  sections: BlogSection[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-hire-the-right-dj-for-your-event",
    title: "How to Hire the Right DJ for Your Event",
    excerpt:
      "A practical guide to choosing a DJ who matches your event's vibe, budget and crowd — from first message to signed contract.",
    category: "Hiring Guides",
    author: "Timeless Team",
    date: "2026-05-12",
    readTime: "5 min read",
    sections: [
      {
        body: [
          "The DJ sets the energy of your event more than almost any other vendor. A great one reads the room and keeps the floor moving; the wrong one can flatten an evening you spent months planning. The good news: picking well is mostly about asking the right questions early.",
        ],
      },
      {
        heading: "Start with the vibe, not the name",
        body: [
          "Before you look at any profiles, write down two or three words that describe the night you want — intimate and warm, high-energy and loud, elegant and restrained. Use those words to filter. A wedding DJ and a club DJ are both excellent at very different jobs.",
          "On Timeless you can browse by category and city, then read each talent's bio and reviews to see whether their style matches your words.",
        ],
      },
      {
        heading: "Ask about their setup and backup plan",
        body: [
          "A professional brings their own equipment, carries spare cables, and has a plan for a failed laptop or speaker. Ask directly: what do you bring, and what happens if something fails mid-set? The confidence of the answer tells you a lot.",
        ],
      },
      {
        heading: "Agree on everything in writing",
        body: [
          "Set hours, song requests, breaks and the final price before you confirm. Keep the whole conversation and the contract on the platform — it protects both sides if anything is disputed later.",
        ],
      },
    ],
  },
  {
    slug: "choosing-a-venue-questions-to-ask",
    title: "Choosing a Venue: 7 Questions to Ask Before You Book",
    excerpt:
      "Capacity, sound limits, parking, hidden fees — the questions that save you from an expensive surprise on event day.",
    category: "Planning",
    author: "Timeless Team",
    date: "2026-05-06",
    readTime: "4 min read",
    sections: [
      {
        body: [
          "The venue shapes your budget, your guest list and your timeline. A few specific questions up front prevent the most common — and most expensive — surprises.",
        ],
      },
      {
        heading: "The questions that matter most",
        body: [
          "1. What is the real capacity once tables, a stage and a dance floor are in? 2. Are there noise limits or a hard curfew? 3. What is included — sound, lighting, staff — and what costs extra? 4. Is there parking or nearby transport for guests? 5. When can vendors arrive to set up? 6. What is the cancellation and deposit policy? 7. Is insurance required?",
        ],
      },
      {
        heading: "See it in person, at the right time",
        body: [
          "Visit the venue at roughly the same hour your event will run. A space that looks perfect at noon can feel very different after dark. Browse venues on Timeless to compare capacity and event types, then shortlist two or three to visit.",
        ],
      },
    ],
  },
  {
    slug: "getting-booked-as-a-talent-on-timeless",
    title: "Getting Booked: How Talent Stands Out on Timeless",
    excerpt:
      "Your profile is your storefront. Here's how artists, photographers and engineers turn views into paid gigs.",
    category: "For Talent",
    author: "Timeless Team",
    date: "2026-04-28",
    readTime: "5 min read",
    sections: [
      {
        body: [
          "Clients on Timeless often compare several profiles before they reach out. The talent who gets the message is rarely the cheapest — it is the one whose profile makes the decision easy.",
        ],
      },
      {
        heading: "Complete every field",
        body: [
          "A bio, a clear category, your city, tags and a real rate all help you appear in the right searches. Verified profiles with a finished portfolio are contacted far more often than empty ones.",
        ],
      },
      {
        heading: "Offer clear service plans",
        body: [
          "Package your work into a few plans with a fixed price and a short list of what's included. It removes friction — a client can pick a plan and start a conversation in one click instead of negotiating from zero.",
        ],
      },
      {
        heading: "Reply fast, keep it on-platform",
        body: [
          "Response time is part of your reputation. Answer quickly, keep the negotiation and the contract inside Timeless, and ask happy clients to leave a review — social proof compounds.",
        ],
      },
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
