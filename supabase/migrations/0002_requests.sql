-- Migration 0002: Tabela de pedidos (requests)

CREATE TABLE IF NOT EXISTS requests (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome          TEXT NOT NULL CHECK (char_length(nome) >= 2 AND char_length(nome) <= 100),
  whatsapp      TEXT NOT NULL CHECK (whatsapp ~ '^\d{12,13}$'),
  email         TEXT CHECK (email IS NULL OR email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  descricao     TEXT NOT NULL CHECK (char_length(descricao) >= 20 AND char_length(descricao) <= 1000),
  category_id   UUID NOT NULL REFERENCES categories(id),
  bairro_id     UUID NOT NULL REFERENCES bairros(id),
  urgente       BOOLEAN DEFAULT false,
  status        TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  moderated_at  TIMESTAMPTZ,
  moderated_by  UUID REFERENCES auth.users(id),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  expires_at    TIMESTAMPTZ DEFAULT NOW() + INTERVAL '30 days'
);

ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

-- Qualquer visitante pode inserir um pedido (sem login)
CREATE POLICY "requests_insert_anon" ON requests
  FOR INSERT WITH CHECK (status = 'pending');

-- Leitura pública apenas de pedidos aprovados e não expirados
CREATE POLICY "requests_select_approved" ON requests
  FOR SELECT USING (
    status = 'approved'
    AND expires_at > NOW()
  );

-- Admin pode fazer tudo
CREATE POLICY "requests_admin_all" ON requests
  FOR ALL USING (
    (auth.jwt()->'app_metadata'->>'role') = 'admin'
  );

-- Índices para performance nas queries do feed e admin
CREATE INDEX IF NOT EXISTS idx_requests_status        ON requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_category      ON requests(category_id);
CREATE INDEX IF NOT EXISTS idx_requests_bairro        ON requests(bairro_id);
CREATE INDEX IF NOT EXISTS idx_requests_created_at    ON requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_requests_expires_at    ON requests(expires_at);
CREATE INDEX IF NOT EXISTS idx_requests_feed          ON requests(status, expires_at, created_at DESC);

-- Tabela auxiliar para rate limiting por IP (sem Redis)
CREATE TABLE IF NOT EXISTS rate_limits (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip         TEXT NOT NULL,
  action     TEXT NOT NULL DEFAULT 'submit_request',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Apenas service role insere (via API route server-side)
-- Nenhuma policy pública — acesso somente via service role key

CREATE INDEX IF NOT EXISTS idx_rate_limits_ip_action ON rate_limits(ip, action, created_at DESC);

-- Limpeza automática de rate limits antigos (mais de 1 hora)
CREATE OR REPLACE FUNCTION cleanup_rate_limits() RETURNS void
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  DELETE FROM rate_limits WHERE created_at < NOW() - INTERVAL '1 hour';
END;
$$;
