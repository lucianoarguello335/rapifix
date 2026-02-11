"use client";

export default function Error({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Error</h1>
        <p className="text-muted-foreground mt-4">Algo salió mal.</p>
        <button
          onClick={() => reset()}
          className="mt-6 inline-block rounded bg-foreground px-4 py-2 text-sm text-background"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}
