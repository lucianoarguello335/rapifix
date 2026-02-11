"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { addWorkPhoto, deleteWorkPhoto } from "@/lib/actions/profile-actions";
import { toast } from "sonner";
import type { WorkPhoto, TierType } from "@/types";

interface WorkPhotosManagerProps {
  photos: WorkPhoto[];
  tier: TierType;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function WorkPhotosManager({ photos, tier }: WorkPhotosManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [caption, setCaption] = useState("");

  const maxPhotos = tier === "paid" ? 20 : 5;
  const currentCount = photos.length;
  const canUpload = currentCount < maxPhotos;

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Formato no soportado. Usa JPG, PNG o WebP.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("El archivo es muy grande. Maximo 5MB.");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("caption", caption);

      const result = await addWorkPhoto(formData);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Foto agregada correctamente");
        setCaption("");
      }
    } catch {
      toast.error("Error al subir la foto. Intenta de nuevo.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function handleDelete(photoId: string) {
    setDeletingId(photoId);
    try {
      const result = await deleteWorkPhoto(photoId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Foto eliminada");
      }
    } catch {
      toast.error("Error al eliminar la foto");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-4">
      {/* Photo count and limit */}
      <div className="flex items-center justify-between">
        <Badge variant="secondary">
          {currentCount}/{maxPhotos} fotos
        </Badge>
        {!canUpload && tier === "free" && (
          <p className="text-xs text-muted-foreground">
            Actualiza a PRO para subir hasta 20 fotos
          </p>
        )}
      </div>

      {/* Photo grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photos.map((photo) => (
            <div key={photo.id} className="group relative aspect-square overflow-hidden rounded-lg border">
              <Image
                src={photo.url}
                alt={photo.caption || "Foto de trabajo"}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, 33vw"
              />

              {/* Delete overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/40">
                <Button
                  variant="destructive"
                  size="icon-sm"
                  className="opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => handleDelete(photo.id)}
                  disabled={deletingId === photo.id}
                >
                  {deletingId === photo.id ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                </Button>
              </div>

              {/* Caption */}
              {photo.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
                  <p className="truncate text-xs text-white">{photo.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload section */}
      {canUpload && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Descripcion de la foto (opcional)"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              maxLength={100}
            />
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileSelect}
          />

          <Button
            variant="outline"
            className="w-full"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Subiendo...
              </>
            ) : (
              <>
                <ImagePlus className="size-4" />
                Agregar foto de trabajo
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            JPG, PNG o WebP. Maximo 5MB por foto.
          </p>
        </div>
      )}

      {/* Empty state */}
      {photos.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed p-8 text-center">
          <ImagePlus className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Agrega fotos de tus trabajos para mostrar tu experiencia
          </p>
        </div>
      )}
    </div>
  );
}
