import type { Metadata } from "next";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { FeedFilters } from "@/components/feed/FeedFilters";
import { RequestFeed } from "@/components/feed/RequestFeed";
import { FeedSkeleton } from "@/components/feed/RequestCardSkeleton";
import type { FeedRequest } from "@/hooks/useRealtimeFeed";

export const metadata: Metadata = {
  title: "Feed de pedidos",
  description: "Veja os pedidos de serviço mais recentes em Marília/SP e entre em contato pelo WhatsApp.",
};

export const revalidate = 0;

interface FeedPageProps {
  searchParams: { categoria?: string; bairro?: string };
}

export default async function FeedPage({ searchParams }: FeedPageProps) {
  const supabase = await createClient();
  const { categoria, bairro } = searchParams;

  // Busca dados de filtro e pedidos em paralelo
  type CategoryRow = { id: string; name: string; slug: string; icon: string | null };
  type BairroRow = { id: string; name: string; slug: string };

  const [{ data: categories }, { data: bairros }, { data: rawRequests }] = await Promise.all([
    supabase.from("categories").select("id, name, slug, icon").order("sort_order") as unknown as Promise<{ data: CategoryRow[] | null }>,
    supabase.from("bairros").select("id, name, slug").eq("active", true).order("name") as unknown as Promise<{ data: BairroRow[] | null }>,
    supabase
      .from("requests")
      .select("id, nome, whatsapp, descricao, urgente, created_at, categories(name, icon), bairros(name, slug)")
      .eq("status", "approved")
      .gt("expires_at", new Date().toISOString())
      .order("urgente", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(60),
  ]);

  // Filtra por categoria e bairro no lado do servidor
  let requests = (rawRequests ?? []) as unknown as (FeedRequest & {
    bairros: { name: string; slug: string } | null;
  })[];

  if (categoria) {
    const cat = (categories ?? []).find((c) => c.slug === categoria);
    if (cat) {
      requests = requests.filter((r) => {
        const rCat = r.categories as { name: string } | null;
        return rCat?.name === cat.name;
      });
    }
  }

  if (bairro) {
    requests = requests.filter((r) => r.bairros?.slug === bairro);
  }

  const feedRequests: FeedRequest[] = requests.map((r) => ({
    id: r.id,
    nome: r.nome,
    whatsapp: r.whatsapp,
    descricao: r.descricao,
    urgente: r.urgente,
    created_at: r.created_at,
    categories: r.categories,
    bairros: r.bairros ? { name: r.bairros.name } : null,
  }));

  return (
    <main className="min-h-screen bg-brand-cream">
      {/* Header */}
      <div className="border-b border-brand-sand/60 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <h1 className="font-heading text-2xl font-bold text-brand-brown">
                Pedidos em Marília
              </h1>
              <p className="mt-0.5 font-sans text-sm text-muted-foreground">
                {feedRequests.length} pedido{feedRequests.length !== 1 ? "s" : ""} disponíve{feedRequests.length !== 1 ? "is" : "l"}
                {categoria || bairro ? " com os filtros selecionados" : ""}
              </p>
            </div>
            <a
              href="/solicitar"
              className="shrink-0 rounded-xl bg-brand-orange px-4 py-2 font-sans text-sm font-semibold text-white shadow-[0_4px_12px_rgba(232,67,26,0.3)] transition-all hover:bg-brand-orange-dark"
            >
              + Publicar pedido
            </a>
          </div>

          {/* Filtros */}
          <div className="mt-5">
            <Suspense fallback={null}>
              <FeedFilters
                categories={categories ?? []}
                bairros={bairros ?? []}
                selectedCategory={categoria ?? ""}
                selectedBairro={bairro ?? ""}
              />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Suspense fallback={<FeedSkeleton count={6} />}>
          <RequestFeed
            initialRequests={feedRequests}
            categorySlug={categoria}
            bairroSlug={bairro}
          />
        </Suspense>
      </div>
    </main>
  );
}
