import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Iniciar sesión | Rapifix",
  description: "Iniciá sesión en tu cuenta de Rapifix para acceder a tu perfil y gestionar tus servicios.",
};

export default function LoginPage() {
  return <LoginForm />;
}
