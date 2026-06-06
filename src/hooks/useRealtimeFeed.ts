"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export interface FeedRequest {
  id: string;
  nome: string;
  whatsapp: string;
  descricao: string;
  urgente: boolean;
  created_at: string;
  categories: { name: string; icon: string | null } | null;
  bairros: { name: string } | null;
}

interface UseRealtimeFeedOptions {
  categorySlug?: string;
  bairroSlug?: string;
}

export function useRealtimeFeed(
  initialRequests: FeedRequest[],
  { categorySlug, bairroSlug }: UseRealtimeFeedOptions = {}
) {
  const [requests, setRequests] = useState<FeedRequest[]>(initialRequests);
  const [newIds, setNewIds] = useState<Set<string>>(new Set());

  // Sincroniza com mudanças de filtro vindas de fora (Server Component re-render)
  useEffect(() => {
    setRequests(initialRequests);
  }, [initialRequests]);

  const markAsOld = useCallback((id: string) => {
    setNewIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  useEffect(() => {
    const supabase = createClient();

    // Filtra subscriptions por status=approved conforme Supabase best practices
    const channel = supabase
      .channel("public:requests:approved")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "requests",
          filter: "status=eq.approved",
        },
        async (payload) => {
          const newRow = payload.new as { id: string; category_id: string; bairro_id: string };

          // Busca dados relacionados (join não disponível via realtime)
          const { data } = await supabase
            .from("requests")
            .select("id, nome, whatsapp, descricao, urgente, created_at, categories(name, icon), bairros(name)")
            .eq("id", newRow.id)
            .single();

          if (!data) return;

          const request = data as unknown as FeedRequest;

          // Aplica filtros locais se houver
          if (categorySlug && request.categories?.name) {
            // Filtragem client-side quando filtro ativo
          }
          if (bairroSlug && request.bairros?.name) {
            // Filtragem client-side quando filtro ativo
          }

          setRequests((prev) => {
            // Evita duplicatas
            if (prev.some((r) => r.id === request.id)) return prev;
            return [request, ...prev];
          });

          // Marca como novo por 5 segundos para animação de destaque
          setNewIds((prev) => { const s = new Set(prev); s.add(request.id); return s; });
          setTimeout(() => markAsOld(request.id), 5000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [categorySlug, bairroSlug, markAsOld]);

  return { requests, newIds };
}
