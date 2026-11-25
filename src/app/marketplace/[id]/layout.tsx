import type { Metadata } from "next";
import { getPublicTalent } from "@/lib/publicData";
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
  const talent = await getPublicTalent(id);
  if (!talent?.name) {
    return {
      title: "Talent profile",
      alternates: { canonical: `/marketplace/${id}` },
    };
  }

  // "DJ in Quito" is the query shape this page should win, so it leads.
  const role = talent.category ?? "Talent";
  const where = talent.city ? ` in ${talent.city}` : "";
  const description =
    trim(talent.bio) ?? `Book ${talent.name}, ${role}${where}, on Timeless.`;

  return {
    title: `${talent.name} — ${role}${where}`,
    description,
    alternates: { canonical: `/marketplace/${id}` },
    openGraph: {
      type: "profile",
      title: `${talent.name} — ${role}${where} | Timeless`,
      description,
      url: `/marketplace/${id}`,
    },
  };
}

export default async function TalentLayout({ children, params }: Props) {
  const { id } = await params;
  const talent = await getPublicTalent(id);

  return (
    <>
      {talent?.name && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: talent.name,
              url: `${SITE_URL}/marketplace/${id}`,
              ...(talent.category ? { jobTitle: talent.category } : {}),
              ...(talent.bio ? { description: talent.bio } : {}),
              ...(talent.city
                ? { address: { "@type": "PostalAddress", addressLocality: talent.city } }
                : {}),
            }),
          }}
        />
      )}
      {children}
    </>
  );
}
