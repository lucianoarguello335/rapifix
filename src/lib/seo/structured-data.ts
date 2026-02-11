import type { ProfileWithRelations } from "@/types";

interface ProfileJsonLdInput {
  profile: ProfileWithRelations;
  url: string;
  averageRating?: number;
  reviewCount?: number;
}

export function generateProfileJsonLd({
  profile,
  url,
  averageRating,
  reviewCount,
}: ProfileJsonLdInput) {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `${profile.first_name} ${profile.last_name}`,
    description: profile.description || undefined,
    url,
    image: profile.profile_photo_url || undefined,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Córdoba",
      addressRegion: "Córdoba",
      addressCountry: "AR",
    },
    telephone: profile.phone,
    priceRange: getPriceRangeSymbol(profile.price_range),
  };

  if (profile.categories) {
    jsonLd.category = profile.categories.name;
  }

  if (profile.profile_neighborhoods?.length > 0) {
    jsonLd.areaServed = profile.profile_neighborhoods.map((pn) => ({
      "@type": "Place",
      name: pn.neighborhoods.name,
    }));
  }

  if (averageRating && reviewCount && reviewCount > 0) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: averageRating,
      reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return jsonLd;
}

export function safeJsonLdStringify(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function getPriceRangeSymbol(
  priceRange: string | null | undefined
): string | undefined {
  switch (priceRange) {
    case "low":
      return "$";
    case "medium":
      return "$$";
    case "high":
      return "$$$";
    case "premium":
      return "$$$$";
    default:
      return undefined;
  }
}
