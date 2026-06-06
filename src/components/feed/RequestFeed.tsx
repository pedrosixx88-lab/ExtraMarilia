"use client";

import { useRealtimeFeed, type FeedRequest } from "@/hooks/useRealtimeFeed";
import { RequestCard } from "./RequestCard";
import { Inbox } from "lucide-react";

interface RequestFeedProps {
  initialRequests: FeedRequest[];
  categorySlug?: string;
  bairroSlug?: string;
}

export function RequestFeed({ initialRequests, categorySlug, bairroSlug }: RequestFeedProps) {
  const { requests, newIds } = useRealtimeFeed(initialRequests, { categorySlug, bairroSlug });

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-brand-sand bg-white/60 py-16 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-cream">
          <Inbox className="h-8 w-8 text-brand-orange/50" strokeWidth={1.5} />
        </span>
        <div className="space-y-1">
          <p className="font-heading text-lg font-bold text-brand-brown">Nenhum pedido encontrado</p>
          <p className="font-sans text-sm text-muted-foreground">
            Tente outros filtros ou volte mais tarde.
          </p>
        </div>
        <a
          href="/solicitar"
          className="mt-2 inline-flex rounded-xl bg-brand-orange px-5 py-2.5 font-sans text-sm font-semibold text-white shadow-[0_4px_16px_rgba(232,67,26,0.3)] transition-all hover:bg-brand-orange-dark"
        >
          Publicar um pedido
        </a>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {requests.map((request) => (
        <RequestCard
          key={request.id}
          request={request}
          isNew={newIds.has(request.id)}
        />
      ))}
    </div>
  );
}
