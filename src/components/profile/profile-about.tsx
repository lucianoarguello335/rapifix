import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { ProfileWithRelations } from "@/types";
import { Clock, DollarSign } from "lucide-react";

interface ProfileAboutProps {
  profile: ProfileWithRelations;
}

const availabilityConfig: Record<
  string,
  { label: string; className: string }
> = {
  available: {
    label: "Disponible",
    className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
  busy: {
    label: "Ocupado",
    className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  },
  unavailable: {
    label: "No disponible",
    className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  },
};

const priceRangeLabels: Record<string, string> = {
  low: "Economico ($)",
  medium: "Moderado ($$)",
  high: "Alto ($$$)",
  premium: "Premium ($$$$)",
};

export function ProfileAbout({ profile }: ProfileAboutProps) {
  const availability = profile.availability
    ? availabilityConfig[profile.availability]
    : null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Acerca de</h2>

      {profile.description ? (
        <p className="whitespace-pre-line text-muted-foreground leading-relaxed">
          {profile.description}
        </p>
      ) : (
        <p className="text-muted-foreground italic">
          Este profesional aun no agrego una descripcion.
        </p>
      )}

      <Separator />

      <div className="flex flex-wrap gap-4">
        {availability && (
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-muted-foreground" />
            <Badge className={availability.className}>
              {availability.label}
            </Badge>
          </div>
        )}

        {profile.price_range && (
          <div className="flex items-center gap-2">
            <DollarSign className="size-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {priceRangeLabels[profile.price_range] || profile.price_range}
            </span>
          </div>
        )}
      </div>

      {profile.price_description && (
        <p className="text-sm text-muted-foreground">
          {profile.price_description}
        </p>
      )}
    </div>
  );
}
