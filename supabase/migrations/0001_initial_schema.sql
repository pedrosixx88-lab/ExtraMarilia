-- Migration 0001: Tabelas de referência (categories e bairros)

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  icon        TEXT,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "categories_select_public" ON categories
  FOR SELECT USING (true);

CREATE POLICY "categories_admin_all" ON categories
  FOR ALL USING (
    (auth.jwt()->'app_metadata'->>'role') = 'admin'
  );

-- Bairros
CREATE TABLE IF NOT EXISTS bairros (
  id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name    TEXT NOT NULL,
  slug    TEXT NOT NULL UNIQUE,
  active  BOOLEAN DEFAULT true
);

ALTER TABLE bairros ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bairros_select_public" ON bairros
  FOR SELECT USING (active = true);

CREATE POLICY "bairros_admin_all" ON bairros
  FOR ALL USING (
    (auth.jwt()->'app_metadata'->>'role') = 'admin'
  );

-- Índices de performance
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_bairros_slug ON bairros(slug);
CREATE INDEX IF NOT EXISTS idx_bairros_active ON bairros(active);
