import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search,
  ArrowRight,
  CheckCircle,
  Users,
  Star,
  Phone,
  Zap,
  Droplets,
  Paintbrush,
  Flame,
  Hammer,
  Lock,
  Wrench,
  Refrigerator,
  Wind,
  Truck,
  Fence,
  TreePine,
  Bug,
  Shield,
  Plug,
  Home,
  Pipette,
  Scissors,
  Warehouse,
  Cog,
} from "lucide-react";
import type { Category } from "@/types";

// Map category slugs to icons for visual display
const categoryIcons: Record<string, React.ReactNode> = {
  electricistas: <Zap className="h-6 w-6" />,
  plomeros: <Droplets className="h-6 w-6" />,
  pintores: <Paintbrush className="h-6 w-6" />,
  gasistas: <Flame className="h-6 w-6" />,
  albaniles: <Hammer className="h-6 w-6" />,
  cerrajeros: <Lock className="h-6 w-6" />,
  carpinteros: <Wrench className="h-6 w-6" />,
  "aire-acondicionado": <Wind className="h-6 w-6" />,
  "reparacion-electrodomesticos": <Refrigerator className="h-6 w-6" />,
  mudanzas: <Truck className="h-6 w-6" />,
  herreros: <Fence className="h-6 w-6" />,
  jardineros: <TreePine className="h-6 w-6" />,
  fumigadores: <Bug className="h-6 w-6" />,
  "alarmas-seguridad": <Shield className="h-6 w-6" />,
  electricidad: <Plug className="h-6 w-6" />,
  "limpieza-hogar": <Home className="h-6 w-6" />,
  impermeabilizacion: <Pipette className="h-6 w-6" />,
  tapiceros: <Scissors className="h-6 w-6" />,
  "pisos-revestimientos": <Warehouse className="h-6 w-6" />,
  "cortinas-persianas": <Cog className="h-6 w-6" />,
};

function getCategoryIcon(slug: string) {
  return categoryIcons[slug] || <Wrench className="h-6 w-6" />;
}

export default async function HomePage() {
  let categories: Category[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true });
    categories = data || [];
  } catch {
    // Categories will be empty if Supabase is unavailable
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Encontra al profesional ideal en{" "}
              <span className="text-primary">Cordoba</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              Electricistas, plomeros, pintores y mas. Busca, compara resenas y
              contacta directamente al mejor profesional para tu necesidad.
            </p>

            {/* Search bar */}
            <div className="mt-10 flex items-center gap-2 mx-auto max-w-xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Link href="/buscar" className="block">
                  <Input
                    placeholder="Que servicio necesitas?"
                    className="h-12 pl-10 text-base"
                    readOnly
                  />
                </Link>
              </div>
              <Button asChild size="lg" className="h-12 px-6">
                <Link href="/buscar">
                  <Search className="mr-2 h-4 w-4" />
                  Buscar
                </Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-accent" />
                <span>Profesionales verificados</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 text-secondary" />
                <span>Resenas reales</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="h-4 w-4 text-primary" />
                <span>Contacto directo</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Explora por categoria
          </h2>
          <p className="mt-3 text-muted-foreground">
            Encontra el profesional que necesitas entre nuestras categorias de
            servicios.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {categories.length > 0
            ? categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categorias/${category.slug}`}
                >
                  <Card className="group cursor-pointer transition-all hover:shadow-md hover:border-primary/50">
                    <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                      <div className="rounded-full bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        {getCategoryIcon(category.slug)}
                      </div>
                      <span className="text-sm font-medium">
                        {category.name}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))
            : /* Fallback static categories when DB is unavailable */
              [
                { name: "Electricistas", slug: "electricistas" },
                { name: "Plomeros", slug: "plomeros" },
                { name: "Pintores", slug: "pintores" },
                { name: "Gasistas", slug: "gasistas" },
                { name: "Albaniles", slug: "albaniles" },
                { name: "Cerrajeros", slug: "cerrajeros" },
                { name: "Carpinteros", slug: "carpinteros" },
                { name: "Aire acondicionado", slug: "aire-acondicionado" },
                { name: "Herreros", slug: "herreros" },
                { name: "Jardineros", slug: "jardineros" },
              ].map((cat) => (
                <Link key={cat.slug} href={`/categorias/${cat.slug}`}>
                  <Card className="group cursor-pointer transition-all hover:shadow-md hover:border-primary/50">
                    <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                      <div className="rounded-full bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        {getCategoryIcon(cat.slug)}
                      </div>
                      <span className="text-sm font-medium">{cat.name}</span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
        </div>

        {categories.length > 0 && (
          <div className="mt-8 text-center">
            <Button variant="outline" asChild>
              <Link href="/buscar">
                Ver todas las categorias
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Como funciona
            </h2>
            <p className="mt-3 text-muted-foreground">
              Encontrar al profesional ideal es simple y rapido.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                1
              </div>
              <h3 className="mt-6 text-xl font-semibold">Busca</h3>
              <p className="mt-2 text-muted-foreground">
                Busca el servicio que necesitas por categoria, barrio o nombre.
                Filtra por calificacion, precio y disponibilidad.
              </p>
              <Search className="mt-4 h-8 w-8 text-primary/60" />
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-secondary-foreground text-2xl font-bold">
                2
              </div>
              <h3 className="mt-6 text-xl font-semibold">Compara</h3>
              <p className="mt-2 text-muted-foreground">
                Revisa perfiles, fotos de trabajos anteriores y resenas de otros
                clientes para elegir al mejor profesional.
              </p>
              <Users className="mt-4 h-8 w-8 text-secondary/60" />
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-foreground text-2xl font-bold">
                3
              </div>
              <h3 className="mt-6 text-xl font-semibold">Contacta</h3>
              <p className="mt-2 text-muted-foreground">
                Llama, envia un WhatsApp o solicita un presupuesto directamente.
                Sin intermediarios.
              </p>
              <Phone className="mt-4 h-8 w-8 text-accent/60" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-2xl rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-8 text-center text-primary-foreground md:p-12">
          <h2 className="text-3xl font-bold md:text-4xl">
            Sos profesional?
          </h2>
          <p className="mt-4 text-primary-foreground/90">
            Crea tu perfil gratis y empeza a recibir contactos de clientes en
            tu zona. Miles de personas buscan servicios como el tuyo todos los
            dias en Cordoba.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="w-full sm:w-auto"
            >
              <Link href="/registro-profesional">
                Registrarme gratis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 sm:w-auto"
            >
              <Link href="/como-funciona">Saber mas</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
