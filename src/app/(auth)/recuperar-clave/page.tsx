import type { Metadata } from "next";
import { RecoverPasswordForm } from "@/components/auth/recover-password-form";

export const metadata: Metadata = {
  title: "Recuperar contraseña | Rapifix",
  description: "Restablecé tu contraseña de Rapifix.",
};

export default function RecuperarClavePage() {
  return <RecoverPasswordForm />;
}
