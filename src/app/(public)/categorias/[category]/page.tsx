export default async function CategoriaPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Categoría: {category}</h1>
      <p className="text-muted-foreground mt-2">Próximamente</p>
    </div>
  );
}
