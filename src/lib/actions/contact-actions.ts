"use server";

import { createClient } from "@/lib/supabase/server";

export async function createContact(data: {
  profileId: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  contactMethod: "form" | "whatsapp" | "phone";
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("contacts").insert({
    profile_id: data.profileId,
    searcher_name: data.name,
    searcher_email: data.email,
    searcher_phone: data.phone || null,
    message: data.message || null,
    contact_method: data.contactMethod,
    user_id: user?.id || null,
  } as never);

  if (error) {
    return { error: "No se pudo enviar el mensaje. Intentá de nuevo más tarde." };
  }

  return { success: true };
}
