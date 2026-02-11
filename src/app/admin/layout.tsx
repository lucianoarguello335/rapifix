export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Admin sidebar placeholder */}
      <aside className="w-64 border-r bg-muted/40 p-4">
        <nav>
          <p className="text-sm font-semibold text-muted-foreground">Panel Admin</p>
        </nav>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
