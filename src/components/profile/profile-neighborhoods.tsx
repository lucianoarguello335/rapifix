import { Badge } from "@/components/ui/badge";
import type { Neighborhood } from "@/types";
import { MapPin } from "lucide-react";

interface ProfileNeighborhoodsProps {
  neighborhoods: { neighborhoods: Neighborhood }[];
}

export function ProfileNeighborhoods({
  neighborhoods,
}: ProfileNeighborhoodsProps) {
  if (neighborhoods.length === 0) {
    return null;
  }

  // Group neighborhoods by zone
  const grouped = neighborhoods.reduce<Record<string, Neighborhood[]>>(
    (acc, pn) => {
      const zone = pn.neighborhoods.zone;
      if (!acc[zone]) {
        acc[zone] = [];
      }
      acc[zone].push(pn.neighborhoods);
      return acc;
    },
    {}
  );

  const sortedZones = Object.keys(grouped).sort();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <MapPin className="size-5" />
        Barrios donde trabaja
      </h2>
      <div className="space-y-3">
        {sortedZones.map((zone) => (
          <div key={zone}>
            <p className="mb-2 text-sm font-medium text-muted-foreground">
              {zone}
            </p>
            <div className="flex flex-wrap gap-2">
              {grouped[zone].map((neighborhood) => (
                <Badge key={neighborhood.id} variant="secondary">
                  {neighborhood.name}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
