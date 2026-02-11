"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  User,
  Star,
  MessageSquare,
  FileText,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { createClient } from "@/lib/supabase/client";
import type { TierType } from "@/types";

const navItems = [
  { href: "/mi-perfil", label: "Mi Perfil", icon: User },
  { href: "/mis-resenas", label: "Mis Resenas", icon: Star },
  { href: "/mis-contactos", label: "Mis Contactos", icon: MessageSquare },
  { href: "/mis-cotizaciones", label: "Mis Cotizaciones", icon: FileText },
  { href: "/mi-plan", label: "Mi Plan", icon: CreditCard },
  { href: "/configuracion", label: "Configuracion", icon: Settings },
];

interface SidebarProps {
  profileCompleteness: number;
  tier: TierType;
  firstName: string;
  lastName: string;
}

function ProfileCompletenessBar({ value }: { value: number }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Perfil completo</span>
        <span className="font-medium">{value}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${value}%` }}
        />
      </div>
      {value < 100 && (
        <p className="text-xs text-muted-foreground">
          Completa tu perfil para mejorar tu posicionamiento
        </p>
      )}
    </div>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            <Icon className="size-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <Button
      variant="ghost"
      className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
      onClick={handleLogout}
      disabled={isLoading}
    >
      <LogOut className="size-4" />
      {isLoading ? "Cerrando sesion..." : "Cerrar sesion"}
    </Button>
  );
}

function SidebarContent({ profileCompleteness, tier, firstName, lastName }: SidebarProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="space-y-4 p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
            {firstName.charAt(0)}{lastName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-semibold">
              {firstName} {lastName}
            </p>
            <div className="flex items-center gap-1.5">
              {tier === "paid" ? (
                <Badge className="gap-1 bg-amber-500 text-white hover:bg-amber-500">
                  <Crown className="size-3" />
                  PRO
                </Badge>
              ) : (
                <Badge variant="secondary">Gratuito</Badge>
              )}
            </div>
          </div>
        </div>

        <ProfileCompletenessBar value={profileCompleteness} />
      </div>

      <Separator />

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        <NavLinks />
      </div>

      <Separator />

      {/* Footer */}
      <div className="p-4">
        <LogoutButton />
      </div>
    </div>
  );
}

export function Sidebar(props: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r bg-muted/40 lg:block">
        <SidebarContent {...props} />
      </aside>

      {/* Mobile sidebar */}
      <div className="sticky top-0 z-40 flex items-center gap-2 border-b bg-background px-4 py-3 lg:hidden">
        <MobileSidebar {...props} />
        <span className="text-sm font-semibold">Panel Profesional</span>
      </div>
    </>
  );
}

function MobileSidebar(props: SidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="size-5" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>Menu de navegacion</SheetTitle>
        </SheetHeader>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="space-y-4 p-4 pt-8">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                {props.firstName.charAt(0)}{props.lastName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-semibold">
                  {props.firstName} {props.lastName}
                </p>
                <div className="flex items-center gap-1.5">
                  {props.tier === "paid" ? (
                    <Badge className="gap-1 bg-amber-500 text-white hover:bg-amber-500">
                      <Crown className="size-3" />
                      PRO
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Gratuito</Badge>
                  )}
                </div>
              </div>
            </div>

            <ProfileCompletenessBar value={props.profileCompleteness} />
          </div>

          <Separator />

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-4">
            <NavLinks onNavigate={() => setOpen(false)} />
          </div>

          <Separator />

          {/* Footer */}
          <div className="p-4">
            <LogoutButton />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
