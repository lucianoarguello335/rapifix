import type { Metadata } from "next";
import { RegistroProfesionalClient } from "./client";

export const metadata: Metadata = {
  title: "Registro profesional | Rapifix",
  description:
    "Registrate como profesional en Rapifix y empezá a recibir clientes en Córdoba.",
};

export default function RegistroProfesionalPage() {
  return <RegistroProfesionalClient />;
}
