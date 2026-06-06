export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-brand-cream">
      <div className="text-center space-y-4 px-6">
        <h1 className="font-heading text-5xl font-bold text-brand-brown">
          Extra<span className="text-brand-orange">Marília</span>
        </h1>
        <p className="font-sans text-lg text-muted-foreground max-w-md">
          Plataforma de serviços locais em Marília/SP.
          Em construção — M0 concluído ✓
        </p>
      </div>
    </main>
  );
}
