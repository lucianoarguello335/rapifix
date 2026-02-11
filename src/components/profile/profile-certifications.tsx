import { Badge } from "@/components/ui/badge";
import { ShieldCheck } from "lucide-react";

interface ProfileCertificationsProps {
  certifications: string[];
}

export function ProfileCertifications({
  certifications,
}: ProfileCertificationsProps) {
  if (certifications.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <ShieldCheck className="size-5" />
        Certificaciones
      </h2>
      <div className="flex flex-wrap gap-2">
        {certifications.map((cert) => (
          <Badge key={cert} variant="outline">
            {cert}
          </Badge>
        ))}
      </div>
    </div>
  );
}
