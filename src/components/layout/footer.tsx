import Link from "next/link";
import { Logo } from "./logo";

const popularCategories = [
  { name: "Electricistas", slug: "electricistas" },
  { name: "Plomeros", slug: "plomeros" },
  { name: "Pintores", slug: "pintores" },
  { name: "Gasistas", slug: "gasistas" },
  { name: "Albaniles", slug: "albaniles" },
  { name: "Cerrajeros", slug: "cerrajeros" },
];

const aboutLinks = [
  { label: "Como funciona", href: "/como-funciona" },
  { label: "Sobre nosotros", href: "/sobre-nosotros" },
  { label: "Blog", href: "/blog" },
  { label: "Preguntas frecuentes", href: "/preguntas-frecuentes" },
];

const legalLinks = [
  { label: "Terminos y condiciones", href: "/terminos" },
  { label: "Politica de privacidad", href: "/privacidad" },
  { label: "Politica de cookies", href: "/cookies" },
  { label: "Terminos profesional", href: "/terminos-profesional" },
];

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-muted-foreground">
              Encontra al profesional ideal para tu hogar en Cordoba, Argentina.
            </p>
          </div>

          {/* Categorias populares */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Categorias populares</h3>
            <ul className="space-y-2">
              {popularCategories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/categorias/${cat.slug}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Acerca de */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Acerca de</h3>
            <ul className="space-y-2">
              {aboutLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              &copy; 2026 Rapifix. Todos los derechos reservados.
            </p>
            <p className="text-sm text-muted-foreground">
              Hecho en Cordoba, Argentina
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
