"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function sanitizeError(message: string): string {
  if (message.includes("duplicate key")) {
    return "Ya existe un registro con estos datos";
  }
  if (message.includes("violates foreign key")) {
    return "Referencia inválida. Verificá los datos ingresados.";
  }
  if (message.includes("row-level security")) {
    return "No tenés permisos para realizar esta acción";
  }
  return "Ocurrió un error. Intentá de nuevo más tarde.";
}

function validateFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Tipo de archivo no permitido. Usá JPG, PNG, WebP o GIF.";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "El archivo es demasiado grande. Máximo 5MB.";
  }
  return null;
}

function getSafeFileExtension(file: File): string {
  const typeToExt: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  };
  return typeToExt[file.type] || "jpg";
}

export async function createProfile(data: {
  firstName: string;
  lastName: string;
  phone: string;
  whatsapp?: string;
  email: string;
  categoryId: number;
  neighborhoodIds: number[];
  description?: string;
  yearsExperience?: number;
  availability?: "available" | "busy" | "unavailable";
  priceRange?: "low" | "medium" | "high" | "premium";
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "No autenticado" };
  }

  // Get category slug for slug generation
  const { data: category } = await supabase
    .from("categories")
    .select("slug")
    .eq("id", data.categoryId)
    .single<{ slug: string }>();

  if (!category) {
    return { error: "Categoría no encontrada" };
  }

  // Get first neighborhood slug for slug generation
  const { data: neighborhood } = await supabase
    .from("neighborhoods")
    .select("slug")
    .eq("id", data.neighborhoodIds[0])
    .single<{ slug: string }>();

  if (!neighborhood) {
    return { error: "Barrio no encontrado" };
  }

  // Generate slug using database function
  const { data: slugResult } = (await supabase.rpc("generate_profile_slug", {
    p_first_name: data.firstName,
    p_last_name: data.lastName,
    p_category_slug: category.slug,
    p_neighborhood_slug: neighborhood.slug,
  } as never)) as { data: string | null };

  // Insert profile
  const { error: profileError } = await supabase.from("profiles").insert({
    id: user.id,
    slug: slugResult,
    first_name: data.firstName,
    last_name: data.lastName,
    phone: data.phone,
    whatsapp: data.whatsapp || data.phone,
    email: data.email,
    category_id: data.categoryId,
    description: data.description,
    years_experience: data.yearsExperience,
    availability: data.availability,
    price_range: data.priceRange,
  } as never);

  if (profileError) {
    return { error: sanitizeError(profileError.message) };
  }

  // Insert neighborhoods
  const neighborhoodInserts = data.neighborhoodIds.map((nId) => ({
    profile_id: user.id,
    neighborhood_id: nId,
  }));

  const { error: neighborhoodError } = await supabase
    .from("profile_neighborhoods")
    .insert(neighborhoodInserts as never);

  if (neighborhoodError) {
    return { error: sanitizeError(neighborhoodError.message) };
  }

  // Calculate completeness
  await supabase.rpc("calculate_profile_completeness", {
    p_profile_id: user.id,
  } as never);

  revalidatePath("/mi-perfil");
  return { success: true, slug: slugResult };
}

export async function updateProfile(data: {
  firstName?: string;
  lastName?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  description?: string;
  categoryId?: number;
  yearsExperience?: number | null;
  availability?: "available" | "busy" | "unavailable" | null;
  priceRange?: "low" | "medium" | "high" | "premium" | null;
  priceDescription?: string;
  certifications?: string[];
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "No autenticado" };
  }

  const updateData: Record<string, unknown> = {};
  if (data.firstName !== undefined) updateData.first_name = data.firstName;
  if (data.lastName !== undefined) updateData.last_name = data.lastName;
  if (data.phone !== undefined) updateData.phone = data.phone;
  if (data.whatsapp !== undefined) updateData.whatsapp = data.whatsapp;
  if (data.email !== undefined) updateData.email = data.email;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.categoryId !== undefined) updateData.category_id = data.categoryId;
  if (data.yearsExperience !== undefined)
    updateData.years_experience = data.yearsExperience;
  if (data.availability !== undefined)
    updateData.availability = data.availability;
  if (data.priceRange !== undefined) updateData.price_range = data.priceRange;
  if (data.priceDescription !== undefined)
    updateData.price_description = data.priceDescription;
  if (data.certifications !== undefined)
    updateData.certifications = data.certifications;

  updateData.last_active_at = new Date().toISOString();

  const { error } = await supabase
    .from("profiles")
    .update(updateData as never)
    .eq("id", user.id);

  if (error) {
    return { error: sanitizeError(error.message) };
  }

  // Recalculate completeness
  const { data: completeness } = (await supabase.rpc(
    "calculate_profile_completeness",
    { p_profile_id: user.id } as never
  )) as { data: number | null };

  if (completeness !== null) {
    await supabase
      .from("profiles")
      .update({ profile_completeness: completeness } as never)
      .eq("id", user.id);
  }

  revalidatePath("/mi-perfil");
  return { success: true };
}

export async function updateProfileNeighborhoods(neighborhoodIds: number[]) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "No autenticado" };
  }

  // Delete existing
  await supabase
    .from("profile_neighborhoods")
    .delete()
    .eq("profile_id", user.id);

  // Insert new
  const inserts = neighborhoodIds.map((nId) => ({
    profile_id: user.id,
    neighborhood_id: nId,
  }));

  const { error } = await supabase
    .from("profile_neighborhoods")
    .insert(inserts as never);

  if (error) {
    return { error: sanitizeError(error.message) };
  }

  revalidatePath("/mi-perfil");
  return { success: true };
}

export async function uploadProfilePhoto(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "No autenticado" };
  }

  const file = formData.get("file") as File;
  if (!file) {
    return { error: "No se seleccionó ningún archivo" };
  }

  const validationError = validateFile(file);
  if (validationError) {
    return { error: validationError };
  }

  const fileExt = getSafeFileExtension(file);
  const filePath = `${user.id}/profile.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("profile-photos")
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    return { error: sanitizeError(uploadError.message) };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("profile-photos").getPublicUrl(filePath);

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ profile_photo_url: publicUrl } as never)
    .eq("id", user.id);

  if (updateError) {
    return { error: sanitizeError(updateError.message) };
  }

  revalidatePath("/mi-perfil");
  return { success: true, url: publicUrl };
}

export async function addWorkPhoto(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "No autenticado" };
  }

  const file = formData.get("file") as File;
  const caption = formData.get("caption") as string;

  if (!file) {
    return { error: "No se seleccionó ningún archivo" };
  }

  const validationError = validateFile(file);
  if (validationError) {
    return { error: validationError };
  }

  // Check photo limit
  const { count } = await supabase
    .from("work_photos")
    .select("*", { count: "exact", head: true })
    .eq("profile_id", user.id);

  const { data: profile } = await supabase
    .from("profiles")
    .select("tier")
    .eq("id", user.id)
    .single<{ tier: "free" | "paid" }>();

  const maxPhotos = profile?.tier === "paid" ? 20 : 5;
  if ((count ?? 0) >= maxPhotos) {
    return {
      error: `Máximo ${maxPhotos} fotos. Actualizá tu plan para subir más.`,
    };
  }

  const fileExt = getSafeFileExtension(file);
  const fileName = `${user.id}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("work-photos")
    .upload(fileName, file);

  if (uploadError) {
    return { error: sanitizeError(uploadError.message) };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("work-photos").getPublicUrl(fileName);

  const { error: insertError } = await supabase.from("work_photos").insert({
    profile_id: user.id,
    url: publicUrl,
    caption: caption || null,
    sort_order: (count ?? 0) + 1,
  } as never);

  if (insertError) {
    return { error: sanitizeError(insertError.message) };
  }

  revalidatePath("/mi-perfil");
  return { success: true };
}

export async function deleteWorkPhoto(photoId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "No autenticado" };
  }

  const { data: photo } = await supabase
    .from("work_photos")
    .select("url")
    .eq("id", photoId)
    .eq("profile_id", user.id)
    .single<{ url: string }>();

  if (!photo) {
    return { error: "Foto no encontrada" };
  }

  // Delete from storage
  const storagePath = photo.url.split("/work-photos/")[1];
  if (storagePath) {
    await supabase.storage.from("work-photos").remove([storagePath]);
  }

  // Delete from database
  const { error } = await supabase
    .from("work_photos")
    .delete()
    .eq("id", photoId)
    .eq("profile_id", user.id);

  if (error) {
    return { error: sanitizeError(error.message) };
  }

  revalidatePath("/mi-perfil");
  return { success: true };
}
