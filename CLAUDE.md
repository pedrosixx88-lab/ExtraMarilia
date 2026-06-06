# ExtraMarília — Claude Code Guide

## WORKFLOW OBRIGATÓRIO POR MILESTONE

### INÍCIO de cada milestone — sempre fazer isso primeiro
1. Ler `CLAUDE.md` e `milestones.md` na íntegra
2. Criar branch: `git checkout -b feat/m[N]-[nome-curto]` (ex: `feat/m0-scaffold`)
3. Descrever em texto o que será implementado neste milestone antes de escrever qualquer código

### FIM de cada milestone — sempre fazer isso antes de avançar
1. Revisar todo código criado no milestone
2. Rodar `npm run build` — deve passar sem erros de TypeScript ou build
3. Rodar `npm run dev` e testar visualmente no browser (caminho principal + casos de erro)
4. Corrigir tudo que estiver errado — não avançar com bugs conhecidos
5. Rodar `/security-review` — sem vulnerabilidades abertas
6. Fazer commit de todos os arquivos do milestone
7. Abrir PR para `main` via `gh pr create`
8. Fazer merge do PR
9. Deletar a branch (`git branch -d feat/m[N]-[nome]`)
10. Marcar o milestone como `[x]` no `milestones.md`

### Regras de segurança — não negociável
- Rodar `security-review` ao final de CADA milestone, sem exceção
- Nunca fazer merge com vulnerabilidades abertas ou secrets expostos
- Usar `frontend-design` em TODA criação de UI — nunca entregar visual genérico
- Usar `verify` para confirmar que o milestone funciona antes do PR
- Usar `code-review` após features críticas (auth, API routes, webhooks)
- Instalar e configurar ferramentas de segurança adicionais quando necessário



## Project
Hyperlocal service-request platform for Marília/SP, Brazil.
Anyone can post a service need anonymously; registered providers respond via WhatsApp.

## Tech Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase (auth, database, storage, realtime)
- Vercel (hosting) + Resend (email) + MercadoPago (Phase 2 payments)

## Design System
- Background: `#F5F0E8` (warm cream)
- Accent: `#E8431A` (orange)
- Headings: Syne (Google Fonts)
- Body: DM Sans (Google Fonts)
- Component library: shadcn/ui (components in `src/components/ui/`)
- UX references: GetNinjas (request/category flow), OLX Brasil (frictionless posting)

## Key Concepts
- **Solicitante**: anonymous requester (no signup required)
- **Prestador**: registered service provider (Supabase Auth)
- **Pedido/Solicitação**: a service request; starts `pending`, admin approves → `approved`
- **Bairro**: Marília neighborhood (static list in `src/lib/constants/bairros.ts`)
- **Categoria**: service category (static list in `src/lib/constants/categories.ts`)
- **Urgente**: boolean flag with distinct visual treatment on request cards
- **Destaque/Highlighted**: admin-toggled flag on providers; max 5 at a time

## Folder Structure
```
src/
  app/                  # Next.js App Router pages and API routes
    api/                # API route handlers
  components/
    ui/                 # shadcn/ui generated
    feed/               # RequestCard, RequestFeed, FeedFilters, UrgentBadge
    forms/              # RequestForm, ProviderForm
    providers/          # ProviderCard, ProviderGrid, WhatsAppButton
    admin/              # RequestModerationTable, MetricsCard, HighlightToggle
    layout/             # Navbar, Footer, AdminSidebar
  lib/
    supabase/           # client.ts (browser), server.ts (SSR), middleware.ts
    validations/        # Zod schemas
    email/              # Resend client + React Email templates
    constants/          # categories.ts, bairros.ts (static data)
    mercadopago/        # Phase 2
  hooks/                # useRealtimeFeed.ts, useAuth.ts
  types/                # database.types.ts (Supabase generated), index.ts
supabase/
  migrations/           # SQL migrations (numbered 0001, 0002…)
  seed.sql              # Categories + bairros reference data
  functions/            # Supabase Edge Functions (expire-requests)
```

## Supabase Database
Tables: `categories`, `bairros`, `requests`, `providers`, `email_log`, `subscriptions`

Critical RLS rules:
- `requests` INSERT: anon allowed (anonymous posting)
- `requests` SELECT: only `status = 'approved' AND expires_at > now()` for anon/authenticated
- `providers` SELECT: public (active providers)
- Admin actions: enforced via `auth.jwt()->'app_metadata'->>'role' = 'admin'`

## WhatsApp Links
Always generate as `https://wa.me/55{digits_only}`. Store numbers in E.164 without `+` prefix.
Example: stored as `5514999887766`, linked as `https://wa.me/5514999887766`.

## Admin Role
Set via Supabase service role SQL:
```sql
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}'
WHERE email = 'admin@...';
```
Never use a separate `admins` table.

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=      # server-side only, never expose to client
RESEND_API_KEY=
RESEND_FROM_EMAIL=noreply@extramarilia.com.br
MERCADOPAGO_ACCESS_TOKEN=       # Phase 2
MERCADOPAGO_WEBHOOK_SECRET=     # Phase 2
NEXT_PUBLIC_APP_URL=https://extramarilia.com.br
ADMIN_EMAIL=admin@extramarilia.com.br
```

## Commands
```bash
npm run dev          # local dev server
npm run build        # production build
npm run lint         # ESLint
supabase start       # local Supabase stack
supabase db diff     # check pending migrations
supabase gen types typescript --local > src/types/database.types.ts
```

## Supabase Best Practices (OBRIGATÓRIO)

### RLS — Row Level Security
- **TODA tabela nova** precisa de `ALTER TABLE nome ENABLE ROW LEVEL SECURITY;` imediatamente após o CREATE TABLE
- **TODA tabela com RLS** precisa de pelo menos uma policy — tabela com RLS sem policy fica completamente inacessível (nem o owner acessa)
- Padrão de policy para leitura pública: `USING (status = 'approved' AND expires_at > now())`
- Padrão de policy para escrita do próprio usuário: `WITH CHECK (auth.uid() = user_id)`
- Admin usa JWT claim: `(auth.jwt()->'app_metadata'->>'role') = 'admin'`

### Chaves — Nunca expor a service role key
- `SUPABASE_SERVICE_ROLE_KEY` → apenas em server-side (API routes, Server Components, Edge Functions)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → pode ir ao client, mas só faz o que as RLS policies permitem
- Nunca usar a service role key em `src/lib/supabase/client.ts` (browser client)

### Clients corretos por contexto
```ts
// Browser / Client Components → createBrowserClient (NEXT_PUBLIC_* keys)
import { createBrowserClient } from '@supabase/ssr'

// Server Components / API Routes / middleware → createServerClient (cookie-based)
import { createServerClient } from '@supabase/ssr'
// Passa cookies() do next/headers — NÃO usar service role key aqui para operações comuns

// Operações admin (API routes protegidas) → service role key
import { createClient } from '@supabase/supabase-js'
const adminClient = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!)
```

### Realtime — Filtrar subscriptions
```ts
// ERRADO — expõe todos os status incluindo 'pending'
.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'requests' }, cb)

// CORRETO — filtrar por status
.on('postgres_changes', {
  event: 'INSERT', schema: 'public', table: 'requests',
  filter: 'status=eq.approved'
}, cb)
```

### Storage — Policies obrigatórias
- Bucket `provider-photos`: leitura pública, escrita apenas pelo próprio prestador
- Nunca deixar bucket sem policy (fica privado por padrão, mas é melhor declarar explicitamente)

### Migrations — Estrutura obrigatória
```sql
-- 1. Criar tabela
CREATE TABLE IF NOT EXISTS nome (...);

-- 2. Habilitar RLS imediatamente
ALTER TABLE nome ENABLE ROW LEVEL SECURITY;

-- 3. Criar policies antes de qualquer dado de teste
CREATE POLICY "leitura publica" ON nome FOR SELECT USING (...);
CREATE POLICY "insercao anonima" ON nome FOR INSERT WITH CHECK (true);

-- 4. Criar índices para colunas de filtro
CREATE INDEX IF NOT EXISTS idx_nome_col ON nome(coluna);
```

### Erro comum em Next.js 14 + Supabase SSR
O `createServerClient` precisa dos cookies do request. Sem isso, a sessão do usuário não é reconhecida em Server Components:
```ts
// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  )
}
```

## Current Milestone
See `milestones.md` for milestone status.
