import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Protected routes
  const isDashboardRoute = pathname.startsWith("/mi-perfil") ||
    pathname.startsWith("/mis-resenas") ||
    pathname.startsWith("/mis-contactos") ||
    pathname.startsWith("/mis-cotizaciones") ||
    pathname.startsWith("/mi-plan") ||
    pathname.startsWith("/configuracion");

  const isUserRoute = pathname.startsWith("/favoritos");

  const isAdminRoute = pathname.startsWith("/admin");

  // Redirect unauthenticated users
  if (!user && (isDashboardRoute || isUserRoute || isAdminRoute)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Role-based protection
  if (user && (isDashboardRoute || isAdminRoute)) {
    const role = user.user_metadata?.role as string | undefined;

    if (isDashboardRoute && role !== "professional" && role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    if (isAdminRoute && role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  // Redirect authenticated users away from auth pages
  if (user) {
    const isAuthRoute = pathname.startsWith("/login") ||
      pathname.startsWith("/registro") ||
      pathname.startsWith("/recuperar-clave");

    if (isAuthRoute) {
      const role = user.user_metadata?.role as string | undefined;
      const url = request.nextUrl.clone();
      url.pathname = role === "professional" ? "/mi-perfil" : "/";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
