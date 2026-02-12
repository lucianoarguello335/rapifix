import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ProfileWithRelations } from "@/types";

import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileAbout } from "@/components/profile/profile-about";
import { ProfileGallery } from "@/components/profile/profile-gallery";
import { ProfileNeighborhoods } from "@/components/profile/profile-neighborhoods";
import { ProfileCertifications } from "@/components/profile/profile-certifications";
import { ProfileContactCard } from "@/components/profile/profile-contact-card";
import { ShareButtons } from "@/components/profile/share-buttons";
import { Separator } from "@/components/ui/separator";
import { generateProfileJsonLd, safeJsonLdStringify } from "@/lib/seo/structured-data";

async function getProfile(slug: string) {
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select(
      `
      *,
      categories (*),
      profile_neighborhoods (
        neighborhoods (*)
      ),
      work_photos (*)
    `
    )
    .eq("slug", slug)
    .single();

  if (error || !profile) {
    return null;
  }

  return profile as ProfileWithRelations;
}

async function getReviewStats(profileId: string) {
  const supabase = await createClient();

  const { data, error } = (await supabase
    .from("reviews")
    .select("rating_overall")
    .eq("profile_id", profileId)
    .eq("is_visible", true)) as { data: { rating_overall: number }[] | null; error: unknown };

  if (error || !data || data.length === 0) {
    return { averageRating: undefined, reviewCount: 0 };
  }

  const total = data.reduce((sum, r) => sum + r.rating_overall, 0);
  const averageRating = Math.round((total / data.length) * 10) / 10;

  return { averageRating, reviewCount: data.length };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getProfile(slug);

  if (!profile) {
    return {
      title: "Profesional no encontrado | Rapifix",
    };
  }

  const fullName = `${profile.first_name} ${profile.last_name}`;
  const categoryName = profile.categories?.name || "Profesional";
  const title = `${fullName} - ${categoryName} en Cordoba | Rapifix`;
  const description =
    profile.description ||
    `Contacta a ${fullName}, ${categoryName.toLowerCase()} en Cordoba, Argentina. Presupuestos sin cargo.`;

  const profileUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://rapifix.com.ar"}/profesional/${slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: profileUrl,
      type: "profile",
      images: profile.profile_photo_url
        ? [
            {
              url: profile.profile_photo_url,
              width: 400,
              height: 400,
              alt: fullName,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: profile.profile_photo_url
        ? [profile.profile_photo_url]
        : undefined,
    },
    alternates: {
      canonical: profileUrl,
    },
  };
}

export default async function ProfesionalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const profile = await getProfile(slug);

  if (!profile || !profile.is_active || profile.is_suspended) {
    notFound();
  }

  const { averageRating, reviewCount } = await getReviewStats(profile.id);

  const profileUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://rapifix.com.ar"}/profesional/${slug}`;
  const fullName = `${profile.first_name} ${profile.last_name}`;
  const categoryName = profile.categories?.name || "Profesional";

  const jsonLd = generateProfileJsonLd({
    profile,
    url: profileUrl,
    averageRating,
    reviewCount,
  });

  // Sort work photos by sort_order
  const sortedPhotos = [...profile.work_photos].sort(
    (a, b) => a.sort_order - b.sort_order
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLd) }}
      />

      <div className="container mx-auto px-4 py-8 pb-24 lg:pb-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="space-y-8 lg:col-span-2">
            <ProfileHeader
              profile={profile}
              averageRating={averageRating}
              reviewCount={reviewCount}
            />

            <Separator />

            <ProfileAbout profile={profile} />

            <Separator />

            <ProfileGallery photos={sortedPhotos} />

            <Separator />

            <ProfileNeighborhoods
              neighborhoods={profile.profile_neighborhoods}
            />

            {profile.certifications.length > 0 && (
              <>
                <Separator />
                <ProfileCertifications
                  certifications={profile.certifications}
                />
              </>
            )}

            <Separator />

            <ShareButtons
              url={profileUrl}
              title={`${fullName} - ${categoryName} en Cordoba | Rapifix`}
            />
          </div>

          {/* Sidebar */}
          <div>
            <ProfileContactCard profile={profile} />
          </div>
        </div>
      </div>
    </>
  );
}
