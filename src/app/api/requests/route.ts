import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requestApiSchema } from "@/lib/validations/request.schema";
import { formatWhatsApp } from "@/lib/utils";

// Admin client usando service role — nunca exposto ao browser
const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MINUTES = 60;

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

async function checkRateLimit(ip: string): Promise<boolean> {
  const windowStart = new Date(
    Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000
  ).toISOString();

  const { count, error } = await adminSupabase
    .from("rate_limits")
    .select("*", { count: "exact", head: true })
    .eq("ip", ip)
    .eq("action", "submit_request")
    .gte("created_at", windowStart);

  if (error) return true; // fail open — não bloquear por erro de DB
  return (count ?? 0) < RATE_LIMIT_MAX;
}

async function recordRateLimit(ip: string): Promise<void> {
  await adminSupabase
    .from("rate_limits")
    .insert({ ip, action: "submit_request" });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = requestApiSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const ip = getClientIp(req);
    const allowed = await checkRateLimit(ip);

    if (!allowed) {
      return NextResponse.json(
        { error: "Você atingiu o limite de pedidos. Aguarde 1 hora para publicar novamente." },
        { status: 429 }
      );
    }

    const { nome, whatsapp, email, descricao, category_id, bairro_id, urgente } = parsed.data;

    const whatsappFormatted = formatWhatsApp(whatsapp);

    const { error: insertError } = await adminSupabase.from("requests").insert({
      nome: nome.trim(),
      whatsapp: whatsappFormatted,
      email: email && email.length > 0 ? email.toLowerCase().trim() : null,
      descricao: descricao.trim(),
      category_id,
      bairro_id,
      urgente,
      status: "pending",
    });

    if (insertError) {
      console.error("[POST /api/requests] DB error:", insertError.message);
      return NextResponse.json(
        { error: "Erro ao salvar pedido. Tente novamente." },
        { status: 500 }
      );
    }

    // Registra o rate limit após inserção bem-sucedida
    await recordRateLimit(ip);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/requests] Unexpected error:", err);
    return NextResponse.json(
      { error: "Erro interno. Tente novamente." },
      { status: 500 }
    );
  }
}
