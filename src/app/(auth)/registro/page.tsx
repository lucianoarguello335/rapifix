import type { Metadata } from "next";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Crear cuenta | Rapifix",
  description: "Registrate en Rapifix para encontrar profesionales de confianza en Córdoba.",
};

export default function RegistroPage() {
  return <SignupForm />;
}
