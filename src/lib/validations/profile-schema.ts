import { z } from "zod";

export const basicInfoSchema = z.object({
  firstName: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede superar los 50 caracteres"),
  lastName: z
    .string()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(50, "El apellido no puede superar los 50 caracteres"),
  phone: z
    .string()
    .min(8, "El teléfono debe tener al menos 8 dígitos")
    .max(20, "El teléfono no puede superar los 20 dígitos"),
  whatsapp: z.string().max(20).optional().or(z.literal("")),
  email: z.string().email("Email inválido"),
});

export const categorySchema = z.object({
  categoryId: z.number().min(1, "Seleccioná una categoría"),
});

export const neighborhoodsSchema = z.object({
  neighborhoodIds: z
    .array(z.number())
    .min(1, "Seleccioná al menos un barrio")
    .max(5, "Máximo 5 barrios en el plan gratuito"),
});

export const descriptionSchema = z.object({
  description: z
    .string()
    .max(500, "Máximo 500 caracteres en el plan gratuito")
    .optional()
    .or(z.literal("")),
  yearsExperience: z.number().min(0).max(99).optional(),
  availability: z
    .enum(["available", "busy", "unavailable"])
    .optional(),
  priceRange: z.enum(["low", "medium", "high", "premium"]).optional(),
});

export const profileUpdateSchema = z.object({
  firstName: z.string().min(2).max(50).optional(),
  lastName: z.string().min(2).max(50).optional(),
  phone: z.string().min(8).max(20).optional(),
  whatsapp: z.string().max(20).optional().or(z.literal("")),
  email: z.string().email().optional(),
  description: z.string().max(2000).optional().or(z.literal("")),
  categoryId: z.number().min(1).optional(),
  yearsExperience: z.number().min(0).max(99).optional().nullable(),
  availability: z
    .enum(["available", "busy", "unavailable"])
    .optional()
    .nullable(),
  priceRange: z
    .enum(["low", "medium", "high", "premium"])
    .optional()
    .nullable(),
  priceDescription: z.string().max(500).optional().or(z.literal("")),
  certifications: z.array(z.string()).optional(),
});

export const contactFormSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional().or(z.literal("")),
  message: z
    .string()
    .min(10, "El mensaje debe tener al menos 10 caracteres")
    .max(1000, "Máximo 1000 caracteres"),
});

export type BasicInfoFormData = z.infer<typeof basicInfoSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type NeighborhoodsFormData = z.infer<typeof neighborhoodsSchema>;
export type DescriptionFormData = z.infer<typeof descriptionSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;
