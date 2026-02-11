"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createContact } from "@/lib/actions/contact-actions";
import { contactFormSchema } from "@/lib/validations/profile-schema";
import type { ProfileWithRelations } from "@/types";
import { MessageCircle, Phone, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ProfileContactCardProps {
  profile: ProfileWithRelations;
}

export function ProfileContactCard({ profile }: ProfileContactCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const whatsappNumber = profile.whatsapp || profile.phone;
  const cleanPhone = whatsappNumber.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${cleanPhone}`;
  const phoneUrl = `tel:${profile.phone}`;

  async function handlePhoneClick() {
    try {
      await createContact({
        profileId: profile.id,
        name: "Visitante",
        email: "anonimo@rapifix.com",
        contactMethod: "phone",
      });
    } catch {
      // Silently fail for tracking
    }
  }

  async function handleWhatsAppClick() {
    try {
      await createContact({
        profileId: profile.id,
        name: "Visitante",
        email: "anonimo@rapifix.com",
        contactMethod: "whatsapp",
      });
    } catch {
      // Silently fail for tracking
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const result = contactFormSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[String(err.path[0])] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createContact({
        profileId: profile.id,
        name: result.data.name,
        email: result.data.email,
        phone: result.data.phone || undefined,
        message: result.data.message,
        contactMethod: "form",
      });

      if (response.error) {
        toast.error("Error al enviar el mensaje. Intenta de nuevo.");
        return;
      }

      toast.success("Mensaje enviado correctamente.");
      setFormData({ name: "", email: "", phone: "", message: "" });
      setDialogOpen(false);
    } catch {
      toast.error("Error al enviar el mensaje. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {/* Desktop sidebar card */}
      <Card className="hidden lg:block lg:sticky lg:top-4">
        <CardHeader>
          <CardTitle>Contactar a {profile.first_name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button asChild className="w-full" size="lg" onClick={handlePhoneClick}>
            <a href={phoneUrl}>
              <Phone className="size-4" />
              Llamar
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
            size="lg"
            onClick={handleWhatsAppClick}
          >
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="size-4" />
              WhatsApp
            </a>
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary" className="w-full" size="lg">
                <Send className="size-4" />
                Enviar mensaje
              </Button>
            </DialogTrigger>
            <ContactDialog
              profile={profile}
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
            />
          </Dialog>
        </CardContent>
      </Card>

      {/* Mobile sticky bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background p-3 lg:hidden">
        <div className="flex gap-2">
          <Button asChild className="flex-1" size="lg" onClick={handlePhoneClick}>
            <a href={phoneUrl}>
              <Phone className="size-4" />
              Llamar
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            className="flex-1 border-green-500 text-green-600"
            size="lg"
            onClick={handleWhatsAppClick}
          >
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="size-4" />
              WhatsApp
            </a>
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary" size="icon-lg">
                <Send className="size-4" />
              </Button>
            </DialogTrigger>
            <ContactDialog
              profile={profile}
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
            />
          </Dialog>
        </div>
      </div>
    </>
  );
}

function ContactDialog({
  profile,
  formData,
  setFormData,
  errors,
  isSubmitting,
  onSubmit,
}: {
  profile: ProfileWithRelations;
  formData: { name: string; email: string; phone: string; message: string };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      name: string;
      email: string;
      phone: string;
      message: string;
    }>
  >;
  errors: Record<string, string>;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          Enviar mensaje a {profile.first_name}
        </DialogTitle>
        <DialogDescription>
          Completa el formulario y el profesional recibira tu mensaje.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="contact-name">Nombre *</Label>
          <Input
            id="contact-name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Tu nombre"
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-email">Email *</Label>
          <Input
            id="contact-email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="tu@email.com"
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-phone">Telefono (opcional)</Label>
          <Input
            id="contact-phone"
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phone: e.target.value }))
            }
            placeholder="351 123 4567"
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-message">Mensaje *</Label>
          <Textarea
            id="contact-message"
            value={formData.message}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                message: e.target.value,
              }))
            }
            placeholder="Describe brevemente lo que necesitas..."
            rows={4}
          />
          {errors.message && (
            <p className="text-sm text-destructive">{errors.message}</p>
          )}
        </div>
        <DialogFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="size-4" />
                Enviar mensaje
              </>
            )}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
