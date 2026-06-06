import { ArrowRight, MapPin, Zap, Shield, MessageCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { RequestCard } from "@/components/feed/RequestCard";
import type { FeedRequest } from "@/hooks/useRealtimeFeed";

export const revalidate = 60;

export default async function HomePage() {
  const supabase = await createClient();

  const { data: rawRequests } = await supabase
    .from("requests")
    .select("id, nome, whatsapp, descricao, urgente, created_at, categories(name, icon), bairros(name)")
    .eq("status", "approved")
    .gt("expires_at", new Date().toISOString())
    .order("urgente", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(3);

  const recentRequests = (rawRequests ?? []) as unknown as FeedRequest[];

  return (
    <main className="min-h-screen bg-brand-cream">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-20 pt-24 text-center">
        {/* Decoração de fundo */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-brand-orange/5 blur-3xl" />
        </div>

        <div className="mx-auto max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-orange/20 bg-white px-4 py-1.5 shadow-sm">
            <MapPin className="h-3.5 w-3.5 text-brand-orange" />
            <span className="font-sans text-xs font-semibold text-brand-brown">Marília/SP</span>
          </div>

          <h1 className="font-heading text-5xl font-bold leading-tight text-brand-brown sm:text-6xl">
            Encontre quem{" "}
            <span className="relative inline-block text-brand-orange">
              resolve
              <span className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-brand-orange/30" />
            </span>{" "}
            pra você
          </h1>

          <p className="mt-5 font-sans text-lg leading-relaxed text-muted-foreground">
            Publique o que você precisa gratuitamente. Prestadores locais de Marília entram em contato pelo WhatsApp — sem intermediários.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href="/solicitar"
              className="inline-flex items-center gap-2 rounded-2xl bg-brand-orange px-8 py-4 font-heading text-base font-bold text-white shadow-[0_8px_32px_rgba(232,67,26,0.35)] transition-all hover:bg-brand-orange-dark hover:shadow-[0_12px_40px_rgba(232,67,26,0.45)] hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Publicar meu pedido
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="/feed"
              className="inline-flex items-center gap-2 rounded-2xl border border-brand-sand bg-white px-8 py-4 font-sans text-base font-semibold text-brand-brown shadow-sm transition-all hover:border-brand-orange/40 hover:shadow-md"
            >
              Ver pedidos abertos
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-brand-sand/60 bg-white/60 px-4 py-12">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            { icon: Shield, title: "Sem cadastro", desc: "Publique seu pedido sem criar conta. Só preencha e envie." },
            { icon: Zap, title: "Contato direto", desc: "Prestadores entram em contato pelo WhatsApp — sem chat interno." },
            { icon: MapPin, title: "100% local", desc: "Apenas prestadores de Marília/SP. Perto de você." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-orange/10">
                <Icon className="h-6 w-6 text-brand-orange" />
              </div>
              <h3 className="font-heading text-base font-bold text-brand-brown">{title}</h3>
              <p className="font-sans text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pedidos recentes */}
      {recentRequests.length > 0 && (
        <section className="px-4 py-14">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex items-baseline justify-between">
              <h2 className="font-heading text-2xl font-bold text-brand-brown">
                Pedidos recentes
              </h2>
              <a
                href="/feed"
                className="font-sans text-sm font-semibold text-brand-orange underline underline-offset-4 hover:text-brand-orange-dark"
              >
                Ver todos →
              </a>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recentRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA final */}
      <section className="px-4 pb-20">
        <div className="mx-auto max-w-2xl rounded-3xl bg-brand-brown px-8 py-12 text-center shadow-[0_20px_60px_rgba(92,61,46,0.25)]">
          <h2 className="font-heading text-3xl font-bold text-white">
            Pronto para resolver?
          </h2>
          <p className="mt-3 font-sans text-base text-white/70">
            Publique gratuitamente e receba contato de prestadores locais em minutos.
          </p>
          <a
            href="/solicitar"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-brand-orange px-8 py-4 font-heading text-base font-bold text-white shadow-[0_8px_24px_rgba(232,67,26,0.4)] transition-all hover:bg-brand-orange-dark hover:-translate-y-0.5"
          >
            <MessageCircle className="h-4 w-4" />
            Publicar pedido grátis
          </a>
        </div>
      </section>
    </main>
  );
}
