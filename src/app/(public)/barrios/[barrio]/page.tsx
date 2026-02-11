export default async function BarrioPage({ params }: { params: Promise<{ barrio: string }> }) {
  const { barrio } = await params;
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Barrio: {barrio}</h1>
      <p className="text-muted-foreground mt-2">Próximamente</p>
    </div>
  );
}
