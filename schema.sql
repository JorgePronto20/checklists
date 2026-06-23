-- ============================================================
--  CHECKLISTS — Schema D1 (Cloudflare SQLite) v3
--  Executar (base de dados nova):
--    wrangler d1 execute checklists-db --remote --file schema.sql
--
--  MIGRAÇÃO v2 → v3 (base de dados existente):
--    wrangler d1 execute checklists-db --remote --command "ALTER TABLE colaboradores ADD COLUMN email_rh TEXT;"
--    wrangler d1 execute checklists-db --remote --command "CREATE TABLE IF NOT EXISTS lojas (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT NOT NULL, email_rh_default TEXT, ativo INTEGER NOT NULL DEFAULT 1, criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);"
--    wrangler d1 execute checklists-db --remote --command "CREATE TABLE IF NOT EXISTS pontos_registo (id INTEGER PRIMARY KEY AUTOINCREMENT, colaborador_id INTEGER NOT NULL REFERENCES colaboradores(id), loja_id INTEGER REFERENCES lojas(id), tipo TEXT NOT NULL DEFAULT 'entrada', token_usado TEXT, criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);"
--    wrangler d1 execute checklists-db --remote --command "CREATE TABLE IF NOT EXISTS email_logs (id INTEGER PRIMARY KEY AUTOINCREMENT, colaborador_id INTEGER REFERENCES colaboradores(id), mes INTEGER NOT NULL, ano INTEGER NOT NULL, email_destino TEXT, sucesso INTEGER NOT NULL DEFAULT 0, erro TEXT, enviado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);"
-- ============================================================

-- 1. Colaboradores
CREATE TABLE IF NOT EXISTS colaboradores (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  nome                  TEXT    NOT NULL,
  cargo                 TEXT,
  pin                   TEXT    NOT NULL,
  email                 TEXT,
  email_rh              TEXT,    -- email de RH específico deste colaborador (override)
  username              TEXT    UNIQUE,
  password_hash         TEXT,
  force_password_change INTEGER NOT NULL DEFAULT 1,
  ativo                 INTEGER NOT NULL DEFAULT 1,
  criado_em             TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_colaboradores_ativo    ON colaboradores (ativo);
CREATE INDEX IF NOT EXISTS idx_colaboradores_username ON colaboradores (username);

-- 2. Modelos de checklist
CREATE TABLE IF NOT EXISTS modelos (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  nome       TEXT    NOT NULL,
  descricao  TEXT,
  estrutura  TEXT,   -- JSON com os itens/perguntas do modelo
  criado_em  TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Checklists executados
CREATE TABLE IF NOT EXISTS checklists (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  colaborador_id   INTEGER NOT NULL REFERENCES colaboradores(id),
  modelo_id        INTEGER NOT NULL REFERENCES modelos(id),
  atribuicao_id    INTEGER REFERENCES atribuicoes(id),
  data             TEXT,
  hora             TEXT,
  estado           TEXT NOT NULL DEFAULT 'aberto', -- aberto | concluido
  respostas        TEXT,  -- JSON com as respostas
  criado_em        TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_checklists_estado      ON checklists (estado);
CREATE INDEX IF NOT EXISTS idx_checklists_colaborador ON checklists (colaborador_id);
CREATE INDEX IF NOT EXISTS idx_checklists_modelo      ON checklists (modelo_id);
CREATE INDEX IF NOT EXISTS idx_checklists_data        ON checklists (data);
CREATE INDEX IF NOT EXISTS idx_checklists_atribuicao  ON checklists (atribuicao_id);

-- 4. Alertas de checklist
CREATE TABLE IF NOT EXISTS checklist_alertas (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo       TEXT    NOT NULL,
  mensagem     TEXT,
  prioridade   TEXT    NOT NULL DEFAULT 'normal', -- baixa | normal | alta | critica
  checklist_id INTEGER REFERENCES checklists(id),
  ativo        INTEGER NOT NULL DEFAULT 1,
  criado_em    TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_alertas_ativo ON checklist_alertas (ativo);

-- 5. Registo de atividade
CREATE TABLE IF NOT EXISTS atividade (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  tipo       TEXT NOT NULL,
  descricao  TEXT NOT NULL,
  criado_em  TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_atividade_tipo      ON atividade (tipo);
CREATE INDEX IF NOT EXISTS idx_atividade_criado_em ON atividade (criado_em);

-- 6. Licenças
CREATE TABLE IF NOT EXISTS licencas (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  chave       TEXT    NOT NULL UNIQUE,
  empresa     TEXT,
  tipo        TEXT    NOT NULL DEFAULT 'starter',
  lojas       INTEGER NOT NULL DEFAULT 1,
  ativo       INTEGER NOT NULL DEFAULT 1,
  ativada_em  TEXT,
  expira_em   TEXT
);

CREATE INDEX IF NOT EXISTS idx_licencas_chave ON licencas (chave);
CREATE INDEX IF NOT EXISTS idx_licencas_ativo ON licencas (ativo);

-- 7. Atribuições (modelo → colaborador → período → hora_limite)
CREATE TABLE IF NOT EXISTS atribuicoes (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  modelo_id      INTEGER NOT NULL REFERENCES modelos(id),
  colaborador_id INTEGER REFERENCES colaboradores(id),
  periodo        TEXT    NOT NULL DEFAULT 'recorrente',
  hora_limite    TEXT    NOT NULL DEFAULT '23:59',
  dias_semana    TEXT    NOT NULL DEFAULT '1,2,3,4,5,6,7',
  ativo          INTEGER NOT NULL DEFAULT 1,
  criado_em      TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_atribuicoes_modelo      ON atribuicoes (modelo_id);
CREATE INDEX IF NOT EXISTS idx_atribuicoes_colaborador ON atribuicoes (colaborador_id);
CREATE INDEX IF NOT EXISTS idx_atribuicoes_periodo     ON atribuicoes (periodo);
CREATE INDEX IF NOT EXISTS idx_atribuicoes_ativo       ON atribuicoes (ativo);

-- 8. Lojas (locais físicos com QR de picagem)
CREATE TABLE IF NOT EXISTS lojas (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  nome             TEXT    NOT NULL,
  email_rh_default TEXT,   -- email de RH padrão desta loja
  ativo            INTEGER NOT NULL DEFAULT 1,
  criado_em        TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_lojas_ativo ON lojas (ativo);

-- 9. Registos de ponto (picagens)
CREATE TABLE IF NOT EXISTS pontos_registo (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  colaborador_id INTEGER NOT NULL REFERENCES colaboradores(id),
  loja_id        INTEGER REFERENCES lojas(id),
  tipo           TEXT    NOT NULL DEFAULT 'entrada', -- entrada | saida
  token_usado    TEXT,   -- token QR que foi validado
  criado_em      TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_pontos_colaborador ON pontos_registo (colaborador_id);
CREATE INDEX IF NOT EXISTS idx_pontos_loja        ON pontos_registo (loja_id);
CREATE INDEX IF NOT EXISTS idx_pontos_criado_em   ON pontos_registo (criado_em);

-- 10. Logs de envio de folhas de ponto por email
CREATE TABLE IF NOT EXISTS email_logs (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  colaborador_id INTEGER REFERENCES colaboradores(id),
  mes            INTEGER NOT NULL,  -- 1-12
  ano            INTEGER NOT NULL,
  email_destino  TEXT,
  sucesso        INTEGER NOT NULL DEFAULT 0,
  erro           TEXT,
  enviado_em     TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_email_logs_colaborador ON email_logs (colaborador_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_periodo     ON email_logs (ano, mes);
