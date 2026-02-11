export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Blog: {slug}</h1>
      <p className="text-muted-foreground mt-2">Próximamente</p>
    </div>
  );
}
