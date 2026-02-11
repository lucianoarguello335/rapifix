"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonsProps {
  url: string;
  title: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const whatsappShareUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Copiado!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("No se pudo copiar el enlace.");
    }
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        <Share2 className="size-4" />
        Compartir perfil
      </h3>
      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm">
          <a
            href={whatsappShareUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>
        </Button>
        <Button asChild variant="outline" size="sm">
          <a
            href={facebookShareUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook
          </a>
        </Button>
        <Button asChild variant="outline" size="sm">
          <a
            href={twitterShareUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            X / Twitter
          </a>
        </Button>
        <Button variant="outline" size="sm" onClick={handleCopyLink}>
          {copied ? (
            <>
              <Check className="size-3" />
              Copiado!
            </>
          ) : (
            <>
              <Copy className="size-3" />
              Copiar enlace
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
