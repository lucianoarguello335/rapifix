import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/dashboard/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch the professional's profile for sidebar data
  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name, profile_completeness, tier")
    .eq("id", user.id)
    .single<{
      first_name: string;
      last_name: string;
      profile_completeness: number;
      tier: "free" | "paid";
    }>();

  if (!profile) {
    // User exists but no professional profile yet
    redirect("/registro-profesional");
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <Sidebar
        profileCompleteness={profile.profile_completeness}
        tier={profile.tier}
        firstName={profile.first_name}
        lastName={profile.last_name}
      />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
