import { cn } from "@/lib/utils";

function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-gradient-to-r from-brand-sand/60 via-brand-cream to-brand-sand/60",
        "bg-[length:400%_100%]",
        className
      )}
      style={{ backgroundSize: "400% 100%", animation: "shimmer 1.6s ease-in-out infinite" }}
    />
  );
}

export function RequestCardSkeleton() {
  return (
    <div className="rounded-2xl border border-brand-sand bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Shimmer className="h-8 w-8 rounded-lg" />
          <div className="space-y-1.5">
            <Shimmer className="h-3 w-20" />
            <Shimmer className="h-3.5 w-28" />
          </div>
        </div>
      </div>
      <div className="mt-3 space-y-2">
        <Shimmer className="h-3.5 w-full" />
        <Shimmer className="h-3.5 w-5/6" />
        <Shimmer className="h-3.5 w-4/6" />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-3">
          <Shimmer className="h-3 w-20" />
          <Shimmer className="h-3 w-16" />
        </div>
        <Shimmer className="h-7 w-32 rounded-xl" />
      </div>
    </div>
  );
}

export function FeedSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <RequestCardSkeleton key={i} />
      ))}
    </div>
  );
}
