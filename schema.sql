-- ============================================================
--  CHECKLISTS — Schema D1 (Cloudflare SQLite)
--  Executar: wrangler d1 execute checklists-db --remote --file schema.sql
-- ============================================================

-- 1. Colaboradores
CREATE TABLE IF NOT EXISTS colaboradores (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  nome       TEXT    NOT NULL,
  cargo      TEXT,
  pin        TEXT    NOT NULL,
  email      TEXT,
  ativo      INTEGER NOT NULL DEFAULT 1,
  criado_em  TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_colaboradores_ativo ON colaboradores (ativo);

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
  tipo       TEXT NOT NULL,        -- COLABORADOR | CHECKLIST | ALERTA | LICENCA | SISTEMA
  descricao  TEXT NOT NULL,
  criado_em  TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_atividade_tipo      ON atividade (tipo);
CREATE INDEX IF NOT EXISTS idx_atividade_criado_em ON atividade (criado_em);

-- 6. Licenças
CREATE TABLE IF NOT EXISTS licencas (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  chave       TEXT    NOT NULL UNIQUE,  -- formato: XXXX-XXXX-XXXX-XXXX
  empresa     TEXT,
  tipo        TEXT    NOT NULL DEFAULT 'starter', -- starter | business | enterprise
  lojas       INTEGER NOT NULL DEFAULT 1,
  ativo       INTEGER NOT NULL DEFAULT 1,
  ativada_em  TEXT,
  expira_em   TEXT    -- NULL = lifetime / sem expiração
);

CREATE INDEX IF NOT EXISTS idx_licencas_chave ON licencas (chave);
CREATE INDEX IF NOT EXISTS idx_licencas_ativo ON licencas (ativo);
