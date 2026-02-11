"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { profileUpdateSchema, type ProfileUpdateFormData } from "@/lib/validations/profile-schema";
import { updateProfile } from "@/lib/actions/profile-actions";
import { toast } from "sonner";
import type { Profile, Category, Neighborhood } from "@/types";

interface ProfileEditorProps {
  profile: Profile;
  categories: Category[];
  neighborhoods: Neighborhood[];
  profileNeighborhoodIds: number[];
}

const availabilityLabels: Record<string, string> = {
  available: "Disponible",
  busy: "Ocupado",
  unavailable: "No disponible",
};

const priceRangeLabels: Record<string, string> = {
  low: "Economico",
  medium: "Intermedio",
  high: "Alto",
  premium: "Premium",
};

export function ProfileEditor({
  profile,
  categories,
  neighborhoods: _neighborhoods,
  profileNeighborhoodIds: _profileNeighborhoodIds,
}: ProfileEditorProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [certifications, setCertifications] = useState<string[]>(
    profile.certifications || []
  );
  const [newCert, setNewCert] = useState("");

  const maxDescriptionLength = profile.tier === "paid" ? 2000 : 500;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileUpdateFormData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      firstName: profile.first_name,
      lastName: profile.last_name,
      phone: profile.phone,
      whatsapp: profile.whatsapp || "",
      email: profile.email,
      description: profile.description || "",
      categoryId: profile.category_id || undefined,
      yearsExperience: profile.years_experience,
      availability: profile.availability,
      priceRange: profile.price_range,
      priceDescription: profile.price_description || "",
      certifications: profile.certifications || [],
    },
  });

  const descriptionValue = watch("description") || "";

  async function onSubmit(data: ProfileUpdateFormData) {
    setIsSaving(true);
    try {
      const result = await updateProfile({
        ...data,
        certifications,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Perfil actualizado correctamente");
      }
    } catch {
      toast.error("Error al guardar. Intenta de nuevo.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleAddCertification() {
    const trimmed = newCert.trim();
    if (!trimmed) return;
    if (certifications.includes(trimmed)) {
      toast.error("Esta certificacion ya esta agregada");
      return;
    }
    setCertifications([...certifications, trimmed]);
    setNewCert("");
  }

  function handleRemoveCertification(index: number) {
    setCertifications(certifications.filter((_, i) => i !== index));
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informacion basica</CardTitle>
          <CardDescription>
            Tus datos de contacto visibles para los clientes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nombre</Label>
              <Input
                id="firstName"
                {...register("firstName")}
                placeholder="Tu nombre"
              />
              {errors.firstName && (
                <p className="text-xs text-destructive">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Apellido</Label>
              <Input
                id="lastName"
                {...register("lastName")}
                placeholder="Tu apellido"
              />
              {errors.lastName && (
                <p className="text-xs text-destructive">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefono</Label>
              <Input
                id="phone"
                {...register("phone")}
                placeholder="351 1234567"
              />
              {errors.phone && (
                <p className="text-xs text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                {...register("whatsapp")}
                placeholder="351 1234567"
              />
              {errors.whatsapp && (
                <p className="text-xs text-destructive">
                  {errors.whatsapp.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="tu@email.com"
            />
            {errors.email && (
              <p className="text-xs text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Descripcion</CardTitle>
          <CardDescription>
            Conta sobre tu experiencia y servicios
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Descripcion del servicio</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Describe tus servicios, experiencia y especializaciones..."
              rows={5}
              maxLength={maxDescriptionLength}
            />
            <div className="flex items-center justify-between">
              {errors.description && (
                <p className="text-xs text-destructive">
                  {errors.description.message}
                </p>
              )}
              <p className="ml-auto text-xs text-muted-foreground">
                {descriptionValue.length}/{maxDescriptionLength}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="yearsExperience">Anos de experiencia</Label>
            <Input
              id="yearsExperience"
              type="number"
              min={0}
              max={99}
              {...register("yearsExperience", { valueAsNumber: true })}
              placeholder="5"
              className="w-32"
            />
            {errors.yearsExperience && (
              <p className="text-xs text-destructive">
                {errors.yearsExperience.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Category */}
      <Card>
        <CardHeader>
          <CardTitle>Categoria</CardTitle>
          <CardDescription>
            Tu rubro principal de trabajo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Categoria principal</Label>
            <Select
              defaultValue={profile.category_id?.toString()}
              onValueChange={(value) =>
                setValue("categoryId", parseInt(value), { shouldDirty: true })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona una categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Availability & Pricing */}
      <Card>
        <CardHeader>
          <CardTitle>Disponibilidad y precios</CardTitle>
          <CardDescription>
            Indica tu disponibilidad y rango de precios
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Disponibilidad</Label>
              <Select
                defaultValue={profile.availability || undefined}
                onValueChange={(value) =>
                  setValue(
                    "availability",
                    value as "available" | "busy" | "unavailable",
                    { shouldDirty: true }
                  )
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona disponibilidad" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(availabilityLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Rango de precios</Label>
              <Select
                defaultValue={profile.price_range || undefined}
                onValueChange={(value) =>
                  setValue(
                    "priceRange",
                    value as "low" | "medium" | "high" | "premium",
                    { shouldDirty: true }
                  )
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona rango" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(priceRangeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priceDescription">
              Detalle de precios (opcional)
            </Label>
            <Textarea
              id="priceDescription"
              {...register("priceDescription")}
              placeholder="Ej: Consulta inicial sin cargo. Presupuesto a domicilio..."
              rows={2}
              maxLength={500}
            />
          </div>
        </CardContent>
      </Card>

      {/* Certifications */}
      <Card>
        <CardHeader>
          <CardTitle>Certificaciones</CardTitle>
          <CardDescription>
            Agrega tus certificaciones, titulos o capacitaciones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {certifications.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {certifications.map((cert, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="gap-1 pr-1"
                >
                  {cert}
                  <button
                    type="button"
                    onClick={() => handleRemoveCertification(index)}
                    className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
                  >
                    <X className="size-3" />
                    <span className="sr-only">Eliminar {cert}</span>
                  </button>
                </Badge>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <Input
              placeholder="Ej: Matricula Nacional de Electricista"
              value={newCert}
              onChange={(e) => setNewCert(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddCertification();
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleAddCertification}
            >
              <Plus className="size-4" />
              <span className="sr-only">Agregar certificacion</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving} size="lg">
          {isSaving ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Guardando...
            </>
          ) : (
            "Guardar cambios"
          )}
        </Button>
      </div>
    </form>
  );
}
