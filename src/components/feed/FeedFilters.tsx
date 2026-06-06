"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface FeedFiltersProps {
  categories: { id: string; name: string; slug: string; icon: string | null }[];
  bairros: { id: string; name: string; slug: string }[];
  selectedCategory: string;
  selectedBairro: string;
}

const CATEGORY_EMOJIS: Record<string, string> = {
  sparkles: "✨", zap: "⚡", droplets: "💧", "hard-hat": "⛑️",
  "paint-roller": "🖌️", leaf: "🌿", truck: "🚛", hammer: "🔨",
  wind: "❄️", monitor: "💻", palette: "🎨", camera: "📷",
  "book-open": "📚", heart: "❤️", shield: "🛡️", "more-horizontal": "⚙️",
};

export function FeedFilters({ categories, bairros, selectedCategory, selectedBairro }: FeedFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const clearAll = () => {
    router.push(pathname, { scroll: false });
  };

  const hasFilters = selectedCategory || selectedBairro;

  return (
    <div className="space-y-4">
      {/* Category chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => updateFilter("categoria", "")}
          className={cn(
            "rounded-full border px-3.5 py-1.5 font-sans text-sm font-medium transition-all duration-150",
            !selectedCategory
              ? "border-brand-orange bg-brand-orange text-white shadow-[0_2px_8px_rgba(232,67,26,0.3)]"
              : "border-brand-sand bg-white text-brand-brown hover:border-brand-orange/50 hover:text-brand-orange"
          )}
        >
          Todos
        </button>
        {categories.map((cat) => {
          const emoji = CATEGORY_EMOJIS[cat.icon ?? ""] ?? "⚙️";
          const isActive = selectedCategory === cat.slug;
          return (
            <button
              key={cat.id}
              onClick={() => updateFilter("categoria", isActive ? "" : cat.slug)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5",
                "font-sans text-sm font-medium transition-all duration-150",
                isActive
                  ? "border-brand-orange bg-brand-orange text-white shadow-[0_2px_8px_rgba(232,67,26,0.3)]"
                  : "border-brand-sand bg-white text-brand-brown hover:border-brand-orange/50 hover:text-brand-orange"
              )}
            >
              <span>{emoji}</span>
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Bairro dropdown + clear */}
      <div className="flex items-center gap-3">
        <select
          value={selectedBairro}
          onChange={(e) => updateFilter("bairro", e.target.value)}
          className={cn(
            "rounded-xl border px-4 py-2 font-sans text-sm text-brand-brown",
            "cursor-pointer appearance-none bg-white outline-none transition-all duration-150",
            "focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20",
            selectedBairro
              ? "border-brand-orange font-medium"
              : "border-brand-sand hover:border-brand-orange/50"
          )}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%235C3D2E' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 0.75rem center",
            paddingRight: "2.25rem",
          }}
        >
          <option value="">Todos os bairros</option>
          {bairros.map((b) => (
            <option key={b.id} value={b.slug}>
              {b.name}
            </option>
          ))}
        </select>

        {hasFilters && (
          <button
            onClick={clearAll}
            className="inline-flex items-center gap-1 rounded-xl border border-brand-sand bg-white px-3 py-2 font-sans text-sm text-muted-foreground transition-all hover:border-red-300 hover:text-red-500"
          >
            <X className="h-3.5 w-3.5" />
            Limpar filtros
          </button>
        )}
      </div>
    </div>
  );
}
