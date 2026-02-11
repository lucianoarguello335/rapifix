"use client";

import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { uploadProfilePhoto } from "@/lib/actions/profile-actions";
import { toast } from "sonner";

interface ProfilePhotoUploadProps {
  currentPhotoUrl: string | null;
  firstName: string;
  lastName: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function ProfilePhotoUpload({
  currentPhotoUrl,
  firstName,
  lastName,
}: ProfilePhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const displayUrl = previewUrl || currentPhotoUrl;
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
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

    // Show preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    handleUpload(file);
  }

  async function handleUpload(file: File) {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadProfilePhoto(formData);

      if (result.error) {
        toast.error(result.error);
        setPreviewUrl(null);
      } else {
        toast.success("Foto de perfil actualizada");
      }
    } catch {
      toast.error("Error al subir la foto. Intenta de nuevo.");
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Avatar className="size-24">
          {displayUrl ? (
            <AvatarImage src={displayUrl} alt={`${firstName} ${lastName}`} />
          ) : null}
          <AvatarFallback className="text-xl">{initials}</AvatarFallback>
        </Avatar>

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
            <Loader2 className="size-6 animate-spin text-white" />
          </div>
        )}
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
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
      >
        <Camera className="size-4" />
        {isUploading ? "Subiendo..." : "Cambiar foto"}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        JPG, PNG o WebP. Maximo 5MB.
      </p>
    </div>
  );
}
