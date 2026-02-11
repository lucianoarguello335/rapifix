"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "./logo";
import { useAuth } from "@/hooks/use-auth";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Menu,
  Search,
  User,
  LogOut,
  Settings,
  Star,
  Heart,
  LayoutDashboard,
} from "lucide-react";
import { useState } from "react";

const navLinks = [
  { label: "Buscar", href: "/buscar", icon: Search },
  { label: "Categorias", href: "/buscar", icon: null },
  { label: "Como funciona", href: "/como-funciona", icon: null },
];

export function Header() {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const professionalLink =
    user && role === "professional" ? "/mi-perfil" : "/registro-profesional";

  const userInitials = user?.email?.slice(0, 2).toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Logo />

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href + link.label}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={professionalLink}
            className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            Soy profesional
          </Link>

          {/* Auth section */}
          {!loading && (
            <>
              {user ? (
                <UserMenu
                  role={role}
                  userInitials={userInitials}
                  onLogout={handleLogout}
                />
              ) : (
                <Button asChild size="sm">
                  <Link href="/login">Iniciar sesion</Link>
                </Button>
              )}
            </>
          )}
        </nav>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-2 md:hidden">
          {!loading && user && (
            <UserMenu
              role={role}
              userInitials={userInitials}
              onLogout={handleLogout}
            />
          )}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="sr-only">Menu de navegacion</SheetTitle>
              <div className="flex flex-col gap-4 pt-8">
                <Logo className="mb-4" />
                <Separator />
                {navLinks.map((link) => (
                  <Link
                    key={link.href + link.label}
                    href={link.href}
                    className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
                    onClick={() => setSheetOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href={professionalLink}
                  className="text-base font-medium text-primary transition-colors hover:text-primary/80"
                  onClick={() => setSheetOpen(false)}
                >
                  Soy profesional
                </Link>
                <Separator />
                {!loading && !user && (
                  <Button asChild size="sm" className="w-full">
                    <Link href="/login" onClick={() => setSheetOpen(false)}>
                      Iniciar sesion
                    </Link>
                  </Button>
                )}
                {!loading && user && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      setSheetOpen(false);
                      handleLogout();
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar sesion
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function UserMenu({
  role,
  userInitials,
  onLogout,
}: {
  role: string | null;
  userInitials: string;
  onLogout: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">{userInitials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {role === "professional" && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/mi-perfil" className="cursor-pointer">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Mi Perfil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/mis-resenas" className="cursor-pointer">
                <Star className="mr-2 h-4 w-4" />
                Mis Resenas
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/mis-contactos" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Mis Contactos
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/configuracion" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Configuracion
              </Link>
            </DropdownMenuItem>
          </>
        )}
        {role === "searcher" && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/favoritos" className="cursor-pointer">
                <Heart className="mr-2 h-4 w-4" />
                Mis Favoritos
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/mis-resenas" className="cursor-pointer">
                <Star className="mr-2 h-4 w-4" />
                Mis Resenas
              </Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar sesion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
