-- Seed: Categorias de serviço
INSERT INTO categories (name, slug, icon, sort_order) VALUES
  ('Diarista / Limpeza',    'diarista',        'sparkles',       1),
  ('Elétrica',              'eletrica',        'zap',            2),
  ('Encanamento',           'encanamento',     'droplets',       3),
  ('Pedreiro / Construção', 'pedreiro',        'hard-hat',       4),
  ('Pintura',               'pintura',         'paint-roller',   5),
  ('Jardinagem',            'jardinagem',      'leaf',           6),
  ('Mudança / Frete',       'mudanca',         'truck',          7),
  ('Marcenaria / Móveis',   'marcenaria',      'hammer',         8),
  ('Ar-condicionado',       'ar-condicionado', 'wind',           9),
  ('Informática / TI',      'informatica',     'monitor',        10),
  ('Design / Criação',      'design',          'palette',        11),
  ('Fotografia',            'fotografia',      'camera',         12),
  ('Aulas / Tutoria',       'aulas',           'book-open',      13),
  ('Cuidador / Saúde',      'cuidador',        'heart',          14),
  ('Segurança / Câmeras',   'seguranca',       'shield',         15),
  ('Outros',                'outros',          'more-horizontal',16)
ON CONFLICT (slug) DO NOTHING;

-- Seed: Bairros de Marília/SP
INSERT INTO bairros (name, slug, active) VALUES
  ('Centro',                    'centro',                   true),
  ('Jardim América',            'jardim-america',           true),
  ('Jardim Itaipu',             'jardim-itaipu',            true),
  ('Jardim Europa',             'jardim-europa',            true),
  ('Palmital',                  'palmital',                 true),
  ('Bom Pastor',                'bom-pastor',               true),
  ('Jardim Califórnia',         'jardim-california',        true),
  ('Jardim Alvorada',           'jardim-alvorada',          true),
  ('Parque São Domingos',       'parque-sao-domingos',      true),
  ('Vila Mendonça',             'vila-mendonca',            true),
  ('Jardim Cruzeiro do Sul',    'jardim-cruzeiro-do-sul',   true),
  ('Vila Nova',                 'vila-nova',                true),
  ('Jardim Universitário',      'jardim-universitario',     true),
  ('Higienópolis',              'higienopolis',             true),
  ('Santa Cruz',                'santa-cruz',               true),
  ('Parque Yolanda',            'parque-yolanda',           true),
  ('Jardim Marabá',             'jardim-maraba',            true),
  ('Conjunto Habitacional',     'conjunto-habitacional',    true),
  ('Jardim Tropical',           'jardim-tropical',          true),
  ('Cecap',                     'cecap',                    true),
  ('Outro bairro',              'outro',                    true)
ON CONFLICT (slug) DO NOTHING;
