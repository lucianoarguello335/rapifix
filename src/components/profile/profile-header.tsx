import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { ProfileWithRelations } from "@/types";
import {
  BadgeCheck,
  Crown,
  Star,
  Briefcase,
} from "lucide-react";

interface ProfileHeaderProps {
  profile: ProfileWithRelations;
  averageRating?: number;
  reviewCount?: number;
}

export function ProfileHeader({
  profile,
  averageRating,
  reviewCount,
}: ProfileHeaderProps) {
  const initials =
    `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`.toUpperCase();

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
      <Avatar className="size-24 sm:size-32">
        {profile.profile_photo_url ? (
          <AvatarImage
            src={profile.profile_photo_url}
            alt={`${profile.first_name} ${profile.last_name}`}
          />
        ) : null}
        <AvatarFallback className="text-2xl sm:text-3xl">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col items-center gap-2 sm:items-start">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
          <h1 className="text-2xl font-bold sm:text-3xl">
            {profile.first_name} {profile.last_name}
          </h1>
          {profile.is_verified && (
            <BadgeCheck className="size-6 text-blue-500" aria-label="Verificado" />
          )}
          {profile.tier === "paid" && (
            <Badge className="bg-amber-500 text-white hover:bg-amber-600">
              <Crown className="size-3" />
              PRO
            </Badge>
          )}
        </div>

        {profile.categories && (
          <div className="flex items-center gap-2 text-muted-foreground">
            {profile.categories.icon ? (
              <span className="text-lg">{profile.categories.icon}</span>
            ) : (
              <Briefcase className="size-4" />
            )}
            <span className="text-base font-medium">
              {profile.categories.name}
            </span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1">
            <Star className="size-5 fill-amber-400 text-amber-400" />
            <span className="font-semibold">
              {averageRating ? averageRating.toFixed(1) : "Sin calificaciones"}
            </span>
            {reviewCount !== undefined && reviewCount > 0 && (
              <span className="text-muted-foreground text-sm">
                ({reviewCount}{" "}
                {reviewCount === 1 ? "opinion" : "opiniones"})
              </span>
            )}
          </div>

          {profile.years_experience != null && profile.years_experience > 0 && (
            <Badge variant="secondary">
              {profile.years_experience}{" "}
              {profile.years_experience === 1
                ? "ano de experiencia"
                : "anos de experiencia"}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
