import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { RequestForm } from "@/components/forms/RequestForm";
import { MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Publicar pedido",
  description: "Publique o que você precisa e receba contato de prestadores locais em Marília/SP pelo WhatsApp.",
};

export default async function SolicitarPage() {
  const supabase = await createClient();

  const [{ data: categories }, { data: bairros }] = await Promise.all([
    supabase.from("categories").select("id, name, slug, icon").order("sort_order"),
    supabase.from("bairros").select("id, name, slug").eq("active", true).order("name"),
  ]);

  return (
    <main className="min-h-screen bg-brand-cream py-10 px-4">
      <div className="mx-auto max-w-lg">
        {/* Header */}
        <div className="mb-8 space-y-2">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 font-sans text-sm text-muted-foreground hover:text-brand-orange transition-colors"
          >
            ← Voltar
          </a>
          <h1 className="font-heading text-3xl font-bold text-brand-brown">
            O que você precisa?
          </h1>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-brand-orange" />
            <p className="font-sans text-sm text-muted-foreground">
              Prestadores locais de Marília/SP vão entrar em contato pelo WhatsApp.
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl bg-white p-6 shadow-[0_4px_40px_rgba(0,0,0,0.08)] sm:p-8">
          <RequestForm
            categories={categories ?? []}
            bairros={bairros ?? []}
          />
        </div>

        {/* Trust footer */}
        <p className="mt-6 text-center font-sans text-xs text-muted-foreground">
          Gratuito · Sem cadastro · Contato direto pelo WhatsApp
        </p>
      </div>
    </main>
  );
}
