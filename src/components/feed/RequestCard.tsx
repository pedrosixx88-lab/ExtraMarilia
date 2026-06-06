import { MessageCircle, MapPin, Clock } from "lucide-react";
import { UrgentBadge } from "./UrgentBadge";
import { whatsAppLink, timeAgo, cn } from "@/lib/utils";

interface RequestCardProps {
  request: {
    id: string;
    nome: string;
    whatsapp: string;
    descricao: string;
    urgente: boolean;
    created_at: string;
    categories: { name: string; icon: string | null } | null;
    bairros: { name: string } | null;
  };
  isNew?: boolean;
}

const CATEGORY_EMOJIS: Record<string, string> = {
  sparkles: "✨",
  zap: "⚡",
  droplets: "💧",
  "hard-hat": "⛑️",
  "paint-roller": "🖌️",
  leaf: "🌿",
  truck: "🚛",
  hammer: "🔨",
  wind: "❄️",
  monitor: "💻",
  palette: "🎨",
  camera: "📷",
  "book-open": "📚",
  heart: "❤️",
  shield: "🛡️",
  "more-horizontal": "⚙️",
};

export function RequestCard({ request, isNew }: RequestCardProps) {
  const emoji = CATEGORY_EMOJIS[request.categories?.icon ?? ""] ?? "⚙️";
  const waLink = whatsAppLink(
    request.whatsapp,
    `Olá ${request.nome}, vi seu pedido no ExtraMarília e posso te ajudar!`
  );

  return (
    <article
      className={cn(
        "group relative rounded-2xl border bg-white p-5 transition-all duration-200",
        "hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)] hover:-translate-y-0.5",
        request.urgente
          ? "border-brand-orange/40 shadow-[0_2px_16px_rgba(232,67,26,0.12)]"
          : "border-brand-sand shadow-[0_2px_8px_rgba(0,0,0,0.06)]",
        isNew && "animate-pulse-once ring-2 ring-brand-orange/30"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl leading-none" role="img" aria-label={request.categories?.name}>
            {emoji}
          </span>
          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-widest text-brand-orange">
              {request.categories?.name ?? "Serviço"}
            </p>
            <p className="font-sans text-sm font-medium text-brand-brown">{request.nome}</p>
          </div>
        </div>
        {request.urgente && <UrgentBadge />}
      </div>

      {/* Descrição */}
      <p className="mt-3 line-clamp-3 font-sans text-sm leading-relaxed text-muted-foreground">
        {request.descricao}
      </p>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-sans text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 text-brand-orange/70" />
            {request.bairros?.name ?? "Marília"}
          </span>
          <span className="flex items-center gap-1 font-sans text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {timeAgo(request.created_at)}
          </span>
        </div>

        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5",
            "bg-[#25D366] font-sans text-xs font-semibold text-white",
            "transition-all duration-150 hover:bg-[#1ebe5d] hover:shadow-[0_4px_12px_rgba(37,211,102,0.4)]",
            "active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#25D366]/50"
          )}
        >
          <MessageCircle className="h-3.5 w-3.5" />
          Entrar em contato
        </a>
      </div>
    </article>
  );
}
