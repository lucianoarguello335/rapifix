import Link from "next/link";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={`text-2xl font-bold ${className || ""}`}>
      <span className="text-primary">Rapi</span>
      <span className="text-secondary">fix</span>
    </Link>
  );
}
