import type { Metadata } from "next";
import { getPublicVenue } from "@/lib/publicData";
import { SITE_URL } from "@/lib/site";

interface Props {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const venue = await getPublicVenue(id);
  if (!venue?.venueName) {
    // Unknown or unreadable venue: fall back to the section metadata rather
    // than emitting a title built from a raw document id.
    return { title: "Venue", alternates: { canonical: `/venues/${id}` } };
  }

  const where = venue.address ? ` in ${venue.address}` : "";
  const capacity = venue.capacity ? ` Capacity ${venue.capacity}.` : "";
  const types = venue.eventTypes?.length
    ? ` Hosts ${venue.eventTypes.slice(0, 3).join(", ")}.`
    : "";

  const description =
    `Book ${venue.venueName}${where} on Timeless.${capacity}${types}`.trim();

  return {
    title: venue.venueName,
    description,
    alternates: { canonical: `/venues/${id}` },
    openGraph: {
      type: "website",
      title: `${venue.venueName} | Timeless`,
      description,
      url: `/venues/${id}`,
    },
  };
}

export default async function VenueLayout({ children, params }: Props) {
  const { id } = await params;
  const venue = await getPublicVenue(id);

  return (
    <>
      {venue?.venueName && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EventVenue",
              name: venue.venueName,
              url: `${SITE_URL}/venues/${id}`,
              ...(venue.address ? { address: venue.address } : {}),
              ...(venue.capacity
                ? { maximumAttendeeCapacity: venue.capacity }
                : {}),
            }),
          }}
        />
      )}
      {children}
    </>
  );
}
