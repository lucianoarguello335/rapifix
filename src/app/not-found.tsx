import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="text-muted-foreground mt-4 text-xl">Página no encontrada</p>
        <Link href="/" className="mt-6 inline-block text-sm underline">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
