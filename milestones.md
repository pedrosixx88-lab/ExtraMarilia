# ExtraMarília — Milestones

## M0 — Project Scaffolding [x]
- Initialize Next.js 14 + TypeScript + Tailwind + shadcn/ui
- Configure brand theme (#F5F0E8, #E8431A, Syne + DM Sans)
- Supabase project + local dev (`supabase start`)
- Migration 0001: categories + bairros tables + seed data
- Vercel project linked, .env.local template
- Resend account verified

**Done when:** `npm run dev` loads cream background at localhost:3000 with no errors

---

## M1 — Anonymous Request Form [x]
- `/solicitar` page: nome, WhatsApp, descrição, categoria, bairro, urgente checkbox
- Zod + React Hook Form validation; Brazilian phone mask
- `POST /api/requests` → inserts with `status='pending'`
- Rate limiting (IP-based) to prevent spam
- Migration 0002: requests table + anon INSERT RLS policy

**Done when:** form submits → row in Supabase with `status='pending'`; invalid data rejected inline

---

## M2 — Public Feed + Realtime [ ]
- `/feed` page: approved requests as cards with category icon, bairro, urgente badge, wa.me CTA
- FeedFilters: category chips + bairro dropdown; URL-synced (`?categoria=&bairro=`)
- `useRealtimeFeed` hook: new approved requests appear without page refresh
- Homepage `/`: hero with CTA + latest 3 requests preview
- Skeleton loading + empty state

**Done when:** realtime update appears in <2s across browser tabs; filters update URL

---

## M3 — Provider Auth + Profiles [ ]
- `/auth/cadastro` and `/auth/login` via Supabase Auth (email+password)
- `middleware.ts` protecting `/painel/**` routes
- `/painel`: profile editor (foto, nome, bio, WhatsApp, categoria, bairro)
- Photo upload to Supabase Storage (2MB limit enforced client-side)
- `/prestadores`: public provider grid with category/bairro filter
- `/prestadores/[slug]`: individual provider profile + WhatsApp CTA
- Migration 0004: providers table + Storage bucket `provider-photos`

**Done when:** provider registers, uploads photo, profile visible at `/prestadores/[slug]` without login

---

## M4 — Email Notifications [ ]
- React Email templates: RequestReceived + NewLead
- Optional email field added to request form
- `POST /api/requests` sends RequestReceived on submission (if email provided)
- Admin approval triggers NewLead to matching providers (same category + bairro)
- `email_log` table records all send attempts
- Migration 0005: email_log table

**Done when:** approval email arrives in inbox with branded template; failed send does not block approval

---

## M5 — Admin Panel [ ]
- Admin role via Supabase JWT `app_metadata` claim (no separate table)
- `/admin` protected by role check in middleware; sidebar navigation
- `/admin`: metrics cards (requests today, pending count, active providers)
- `/admin/solicitacoes`: approve/reject requests data table
- `/admin/prestadores`: highlight toggle (max 5 highlighted providers)
- `/admin/emails`: paginated email log
- Migration 0006: admin role SQL

**Done when:** approve → request in feed + providers notified; 6th highlight returns 400

---

## M6 — Leads Dashboard + Polish [ ]
- `/painel/leads`: requests matching provider's category + bairro with WhatsApp CTA
- Navbar + Footer finalized
- SEO: `generateMetadata` on all key pages + Open Graph image
- Supabase Edge Function: auto-expire requests (`expires_at < now()`)
- `not-found.tsx` and `error.tsx` pages
- Responsive audit: 375px / 768px / 1280px viewports
- Target: Lighthouse Performance 80+, Accessibility 90+

**Done when:** Lighthouse scores hit targets; expired requests gone from public feed

---

## M7 — MercadoPago Paid Plans (Phase 2) [ ]
- Plan tiers: Free / Básico R$19/mês / Premium R$49/mês
- `/painel/plano`: plan selector + MercadoPago checkout redirect
- `POST /api/webhooks/mercadopago`: HMAC-verified, updates `subscriptions` + `providers.plan`
- Premium providers sorted above free providers in `/prestadores`
- Migration 0007: subscriptions table

**Done when:** sandbox payment → provider plan upgraded; cancellation reverts to free after period end
