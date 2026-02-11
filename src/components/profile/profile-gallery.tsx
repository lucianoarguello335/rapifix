"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { WorkPhoto } from "@/types";
import { ImageIcon } from "lucide-react";

interface ProfileGalleryProps {
  photos: WorkPhoto[];
}

export function ProfileGallery({ photos }: ProfileGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<WorkPhoto | null>(null);

  if (photos.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Fotos de trabajos</h2>
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-muted-foreground">
          <ImageIcon className="mb-2 size-10" />
          <p>No hay fotos de trabajos</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Fotos de trabajos</h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {photos.map((photo) => (
          <button
            key={photo.id}
            type="button"
            className="group relative aspect-square overflow-hidden rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => setSelectedPhoto(photo)}
          >
            <Image
              src={photo.url}
              alt={photo.caption || "Foto de trabajo"}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
            {photo.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                <p className="text-xs text-white line-clamp-2">
                  {photo.caption}
                </p>
              </div>
            )}
          </button>
        ))}
      </div>

      <Dialog
        open={selectedPhoto !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedPhoto(null);
        }}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedPhoto?.caption || "Foto de trabajo"}
            </DialogTitle>
          </DialogHeader>
          {selectedPhoto && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={selectedPhoto.url}
                alt={selectedPhoto.caption || "Foto de trabajo"}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
          )}
          {selectedPhoto?.caption && (
            <p className="text-sm text-muted-foreground">
              {selectedPhoto.caption}
            </p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
