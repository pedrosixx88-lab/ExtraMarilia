import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function UrgentBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-brand-orange px-2.5 py-0.5",
        "font-sans text-xs font-bold uppercase tracking-wide text-white",
        className
      )}
    >
      <Zap className="h-3 w-3" strokeWidth={2.5} />
      Urgente
    </span>
  );
}
