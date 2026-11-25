import type { Metadata } from "next";
import { getPublicEvent } from "@/lib/publicData";
import { SITE_URL } from "@/lib/site";

interface Props {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

function trim(text: string | undefined, max = 155): string | undefined {
  if (!text) return undefined;
  return text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const event = await getPublicEvent(id);
  if (!event?.title) {
    return { title: "Event", alternates: { canonical: `/events/${id}` } };
  }

  const where = event.location ? ` at ${event.location}` : "";
  const when = event.date ? ` on ${event.date}` : "";
  const description =
    trim(event.description) ??
    `${event.title}${where}${when}. Tickets and line-up on Timeless.`;

  return {
    title: event.title,
    description,
    alternates: { canonical: `/events/${id}` },
    openGraph: {
      type: "website",
      title: `${event.title} | Timeless`,
      description,
      url: `/events/${id}`,
      ...(event.image ? { images: [{ url: event.image }] } : {}),
    },
  };
}

export default async function EventLayout({ children, params }: Props) {
  const { id } = await params;
  const event = await getPublicEvent(id);

  return (
    <>
      {event?.title && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Event",
              name: event.title,
              url: `${SITE_URL}/events/${id}`,
              ...(event.date ? { startDate: event.date } : {}),
              ...(event.description ? { description: event.description } : {}),
              ...(event.image ? { image: event.image } : {}),
              ...(event.location
                ? { location: { "@type": "Place", name: event.location } }
                : {}),
            }),
          }}
        />
      )}
      {children}
    </>
  );
}
