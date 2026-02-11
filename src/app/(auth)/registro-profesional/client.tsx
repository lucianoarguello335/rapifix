"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/use-auth";
import { createClient } from "@/lib/supabase/client";
import { SignupForm } from "@/components/auth/signup-form";
import { RegistrationWizard } from "@/components/professional/registration-wizard";

export function RegistroProfesionalClient() {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [checkingProfile, setCheckingProfile] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }

    const checkProfile = async () => {
      setCheckingProfile(true);
      const supabase = createClient();
      const { data } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single();

      if (data) {
        // User already has a profile, redirect to dashboard
        router.push("/mi-perfil");
        return;
      }

      setHasProfile(false);
      setCheckingProfile(false);
    };

    checkProfile();
  }, [user, router]);

  if (loading || checkingProfile) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  // User is logged in as professional and has no profile: show wizard
  if (user && role === "professional" && hasProfile === false) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-2 text-center text-2xl font-bold">
          Completá tu perfil profesional
        </h1>
        <p className="mb-8 text-center text-muted-foreground">
          Seguí estos pasos para crear tu perfil y empezar a recibir clientes.
        </p>
        <RegistrationWizard />
      </div>
    );
  }

  // User is logged in but not as professional
  if (user && role !== "professional") {
    return (
      <div className="container mx-auto max-w-md px-4 py-8">
        <div className="rounded-lg border p-6 text-center">
          <h2 className="mb-2 text-lg font-semibold">
            Tu cuenta no es profesional
          </h2>
          <p className="text-sm text-muted-foreground">
            Tu cuenta está registrada como buscador. Si querés ofrecer servicios,
            contactanos para cambiar tu rol.
          </p>
        </div>
      </div>
    );
  }

  // Not logged in: show signup form for professionals
  return (
    <div className="container mx-auto max-w-md px-4 py-8">
      <SignupForm
        role="professional"
        title="Registro profesional"
        description="Creá tu cuenta y empezá a recibir clientes"
      />
    </div>
  );
}
