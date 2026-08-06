import type { Metadata } from "next";
import { getPublicVenue } from "@/lib/publicData";
import { SITE_URL } from "@/lib/site";

interface Props {
  children: React.ReactNode;
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const venue = await getPublicVenue(params.id);
  if (!venue?.venueName) {
    // Unknown or unreadable venue: fall back to the section metadata rather
    // than emitting a title built from a raw document id.
    return { title: "Venue", alternates: { canonical: `/venues/${params.id}` } };
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
    alternates: { canonical: `/venues/${params.id}` },
    openGraph: {
      type: "website",
      title: `${venue.venueName} | Timeless`,
      description,
      url: `/venues/${params.id}`,
    },
  };
}

export default async function VenueLayout({ children, params }: Props) {
  const venue = await getPublicVenue(params.id);

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
              url: `${SITE_URL}/venues/${params.id}`,
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
