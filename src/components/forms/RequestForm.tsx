"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { requestSchema, type RequestFormData } from "@/lib/validations/request.schema";
import { cn } from "@/lib/utils";
import { CheckCircle2, Loader2, AlertCircle, Zap } from "lucide-react";

interface RequestFormProps {
  categories: { id: string; name: string; icon: string }[];
  bairros: { id: string; name: string }[];
  onSuccess?: () => void;
}

function applyPhoneMask(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function RequestForm({ categories, bairros, onSuccess }: RequestFormProps) {
  const [apiError, setApiError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
    defaultValues: { urgente: false, email: "" },
  });

  const urgente = watch("urgente");
  const descricao = watch("descricao") ?? "";

  async function onSubmit(data: RequestFormData) {
    setApiError(null);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setApiError(json.error ?? "Erro ao enviar pedido. Tente novamente.");
        return;
      }
      setSubmitted(true);
      onSuccess?.();
    } catch {
      setApiError("Erro de conexão. Verifique sua internet e tente novamente.");
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 rounded-2xl bg-white px-8 py-14 shadow-[0_4px_40px_rgba(0,0,0,0.08)] text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
          <CheckCircle2 className="h-10 w-10 text-green-500" strokeWidth={1.5} />
        </span>
        <div className="space-y-2">
          <h2 className="font-heading text-2xl font-bold text-brand-brown">Pedido enviado!</h2>
          <p className="font-sans text-base text-muted-foreground max-w-xs mx-auto">
            Prestadores locais vão entrar em contato com você pelo WhatsApp em breve.
          </p>
        </div>
        <div className="w-full rounded-xl border border-brand-sand bg-brand-cream p-4 text-left space-y-1">
          <p className="font-sans text-xs font-semibold uppercase tracking-widest text-brand-orange">
            Dica
          </p>
          <p className="font-sans text-sm text-brand-brown">
            Mantenha o WhatsApp com notificações ativadas para não perder o contato dos prestadores.
          </p>
        </div>
        <button
          onClick={() => setSubmitted(false)}
          className="font-sans text-sm text-muted-foreground underline underline-offset-4 hover:text-brand-orange transition-colors"
        >
          Publicar outro pedido
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      {/* API error banner */}
      {apiError && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <p className="font-sans text-sm text-red-700">{apiError}</p>
        </div>
      )}

      {/* Nome */}
      <div className="space-y-1.5">
        <label className="block font-sans text-sm font-semibold text-brand-brown" htmlFor="nome">
          Seu nome <span className="text-brand-orange">*</span>
        </label>
        <input
          {...register("nome")}
          id="nome"
          type="text"
          autoComplete="given-name"
          placeholder="Como posso te chamar?"
          className={cn(
            "w-full rounded-xl border bg-white px-4 py-3 font-sans text-sm text-brand-brown placeholder:text-muted-foreground",
            "outline-none transition-all duration-150",
            "focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20",
            errors.nome ? "border-red-300 bg-red-50/50" : "border-brand-sand hover:border-brand-orange/50"
          )}
        />
        {errors.nome && (
          <p className="font-sans text-xs text-red-500">{errors.nome.message}</p>
        )}
      </div>

      {/* WhatsApp */}
      <div className="space-y-1.5">
        <label className="block font-sans text-sm font-semibold text-brand-brown" htmlFor="whatsapp">
          WhatsApp <span className="text-brand-orange">*</span>
        </label>
        <input
          {...register("whatsapp")}
          id="whatsapp"
          type="tel"
          autoComplete="tel"
          placeholder="(14) 99999-9999"
          onChange={(e) => {
            const masked = applyPhoneMask(e.target.value);
            setValue("whatsapp", masked, { shouldValidate: true });
          }}
          className={cn(
            "w-full rounded-xl border bg-white px-4 py-3 font-sans text-sm text-brand-brown placeholder:text-muted-foreground",
            "outline-none transition-all duration-150",
            "focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20",
            errors.whatsapp ? "border-red-300 bg-red-50/50" : "border-brand-sand hover:border-brand-orange/50"
          )}
        />
        {errors.whatsapp && (
          <p className="font-sans text-xs text-red-500">{errors.whatsapp.message}</p>
        )}
      </div>

      {/* Categoria + Bairro lado a lado em md+ */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="block font-sans text-sm font-semibold text-brand-brown" htmlFor="category_id">
            Categoria <span className="text-brand-orange">*</span>
          </label>
          <select
            {...register("category_id")}
            id="category_id"
            className={cn(
              "w-full rounded-xl border bg-white px-4 py-3 font-sans text-sm text-brand-brown",
              "outline-none transition-all duration-150 cursor-pointer appearance-none",
              "focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20",
              errors.category_id ? "border-red-300 bg-red-50/50" : "border-brand-sand hover:border-brand-orange/50"
            )}
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%235C3D2E' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 1rem center" }}
          >
            <option value="">Selecione...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {errors.category_id && (
            <p className="font-sans text-xs text-red-500">{errors.category_id.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="block font-sans text-sm font-semibold text-brand-brown" htmlFor="bairro_id">
            Bairro <span className="text-brand-orange">*</span>
          </label>
          <select
            {...register("bairro_id")}
            id="bairro_id"
            className={cn(
              "w-full rounded-xl border bg-white px-4 py-3 font-sans text-sm text-brand-brown",
              "outline-none transition-all duration-150 cursor-pointer appearance-none",
              "focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20",
              errors.bairro_id ? "border-red-300 bg-red-50/50" : "border-brand-sand hover:border-brand-orange/50"
            )}
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%235C3D2E' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 1rem center" }}
          >
            <option value="">Selecione...</option>
            {bairros.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
          {errors.bairro_id && (
            <p className="font-sans text-xs text-red-500">{errors.bairro_id.message}</p>
          )}
        </div>
      </div>

      {/* Descrição */}
      <div className="space-y-1.5">
        <div className="flex items-baseline justify-between">
          <label className="block font-sans text-sm font-semibold text-brand-brown" htmlFor="descricao">
            O que você precisa? <span className="text-brand-orange">*</span>
          </label>
          <span className={cn(
            "font-sans text-xs tabular-nums transition-colors",
            descricao.length < 20 ? "text-red-400" : "text-muted-foreground"
          )}>
            {descricao.length}/1000
          </span>
        </div>
        <textarea
          {...register("descricao")}
          id="descricao"
          rows={4}
          placeholder="Descreva o que você precisa com detalhes — dia, horário, tamanho do serviço..."
          className={cn(
            "w-full rounded-xl border bg-white px-4 py-3 font-sans text-sm text-brand-brown placeholder:text-muted-foreground",
            "outline-none transition-all duration-150 resize-y min-h-[100px]",
            "focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20",
            errors.descricao ? "border-red-300 bg-red-50/50" : "border-brand-sand hover:border-brand-orange/50"
          )}
        />
        {errors.descricao && (
          <p className="font-sans text-xs text-red-500">{errors.descricao.message}</p>
        )}
      </div>

      {/* Urgente */}
      <div
        className={cn(
          "rounded-xl border-2 p-4 transition-all duration-150 cursor-pointer",
          urgente
            ? "border-brand-orange bg-orange-50"
            : "border-brand-sand bg-white hover:border-brand-orange/40"
        )}
        onClick={() => setValue("urgente", !urgente, { shouldValidate: true })}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "h-5 w-5 rounded border-2 flex items-center justify-center transition-all duration-150 shrink-0",
              urgente ? "border-brand-orange bg-brand-orange" : "border-brand-sand bg-white"
            )}
          >
            {urgente && (
              <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <input
            {...register("urgente")}
            type="checkbox"
            className="sr-only"
            aria-label="Pedido urgente"
          />
          <div className="flex items-center gap-2">
            <span className="font-sans text-sm font-semibold text-brand-brown">
              É urgente?
            </span>
            {urgente && (
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-orange px-2.5 py-0.5 font-sans text-xs font-bold uppercase tracking-wide text-white">
                <Zap className="h-3 w-3" />
                Urgente
              </span>
            )}
          </div>
        </div>
        <p className="mt-1 pl-8 font-sans text-xs text-muted-foreground">
          Seu pedido aparece em destaque no topo do feed para prestadores disponíveis.
        </p>
      </div>

      {/* E-mail opcional */}
      <div className="space-y-1.5">
        <label className="block font-sans text-sm font-medium text-muted-foreground" htmlFor="email">
          E-mail <span className="text-muted-foreground font-normal">(opcional — para receber confirmação)</span>
        </label>
        <input
          {...register("email")}
          id="email"
          type="email"
          autoComplete="email"
          placeholder="seuemail@exemplo.com"
          className={cn(
            "w-full rounded-xl border bg-white px-4 py-3 font-sans text-sm text-brand-brown placeholder:text-muted-foreground",
            "outline-none transition-all duration-150",
            "focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20",
            errors.email ? "border-red-300 bg-red-50/50" : "border-brand-sand hover:border-brand-orange/50"
          )}
        />
        {errors.email && (
          <p className="font-sans text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          "w-full rounded-xl bg-brand-orange px-6 py-4 font-heading text-base font-bold text-white",
          "transition-all duration-150 hover:bg-brand-orange-dark active:scale-[0.98]",
          "focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2 focus:ring-offset-brand-cream",
          "disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100",
          "shadow-[0_4px_16px_rgba(232,67,26,0.35)] hover:shadow-[0_6px_20px_rgba(232,67,26,0.45)]"
        )}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Enviando...
          </span>
        ) : (
          "Publicar pedido"
        )}
      </button>

      <p className="text-center font-sans text-xs text-muted-foreground">
        Seus dados são usados apenas para conectar você com prestadores locais.
      </p>
    </form>
  );
}
