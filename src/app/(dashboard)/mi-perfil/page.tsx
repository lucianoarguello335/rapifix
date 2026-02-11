import { redirect } from "next/navigation";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProfileEditor } from "@/components/dashboard/profile-editor";
import { ProfilePhotoUpload } from "@/components/dashboard/profile-photo-upload";
import { WorkPhotosManager } from "@/components/dashboard/work-photos-manager";

export default async function MiPerfilPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch profile with relations
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single() as { data: Database["public"]["Tables"]["profiles"]["Row"] | null };

  if (!profile) {
    redirect("/registro-profesional");
  }

  // Fetch related data in parallel
  const [categoriesResult, neighborhoodsResult, workPhotosResult, profileNeighborhoodsResult] =
    await Promise.all([
      supabase.from("categories").select("*").eq("is_active", true).order("sort_order"),
      supabase.from("neighborhoods").select("*").eq("is_active", true).order("name"),
      supabase.from("work_photos").select("*").eq("profile_id", user.id).order("sort_order"),
      supabase
        .from("profile_neighborhoods")
        .select("neighborhood_id")
        .eq("profile_id", user.id),
    ]);

  const categories = categoriesResult.data || [];
  const neighborhoods = neighborhoodsResult.data || [];
  const workPhotos = workPhotosResult.data || [];
  const profileNeighborhoodIds = (
    (profileNeighborhoodsResult.data || []) as { neighborhood_id: number }[]
  ).map((pn) => pn.neighborhood_id);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      {/* Page header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mi Perfil</h1>
          <p className="text-muted-foreground">
            Edita tu informacion profesional
          </p>
        </div>
        {profile.slug && (
          <Button variant="outline" asChild>
            <Link
              href={`/profesional/${profile.slug}`}
              target="_blank"
              rel="noopener"
            >
              <ExternalLink className="size-4" />
              Ver perfil publico
            </Link>
          </Button>
        )}
      </div>

      {/* Profile completeness */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Perfil completado</p>
              <p className="text-2xl font-bold">{profile.profile_completeness}%</p>
            </div>
            <div className="flex items-center gap-2">
              {profile.is_verified && (
                <Badge className="bg-green-600 text-white hover:bg-green-600">
                  Verificado
                </Badge>
              )}
              {profile.tier === "paid" ? (
                <Badge className="bg-amber-500 text-white hover:bg-amber-500">
                  PRO
                </Badge>
              ) : (
                <Badge variant="secondary">Gratuito</Badge>
              )}
            </div>
          </div>
          <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${profile.profile_completeness}%` }}
            />
          </div>
          {profile.profile_completeness < 100 && (
            <p className="mt-2 text-xs text-muted-foreground">
              Un perfil completo aparece mejor posicionado en los resultados de busqueda
            </p>
          )}
        </CardContent>
      </Card>

      {/* Profile Photo */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Foto de perfil</CardTitle>
          <CardDescription>
            Tu foto principal visible en los resultados de busqueda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfilePhotoUpload
            currentPhotoUrl={profile.profile_photo_url}
            firstName={profile.first_name}
            lastName={profile.last_name}
          />
        </CardContent>
      </Card>

      {/* Profile Editor (all editable sections) */}
      <ProfileEditor
        profile={profile}
        categories={categories}
        neighborhoods={neighborhoods}
        profileNeighborhoodIds={profileNeighborhoodIds}
      />

      <Separator className="my-8" />

      {/* Work Photos */}
      <Card>
        <CardHeader>
          <CardTitle>Fotos de trabajos</CardTitle>
          <CardDescription>
            Mostra tus mejores trabajos para generar confianza
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WorkPhotosManager photos={workPhotos} tier={profile.tier} />
        </CardContent>
      </Card>
    </div>
  );
}
