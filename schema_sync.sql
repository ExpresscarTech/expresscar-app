BEGIN;

-- ─── CLIENTES ────────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS clientes CASCADE;
CREATE TABLE clientes (
  id_cliente       SERIAL PRIMARY KEY,
  nif               VARCHAR(20)    NOT NULL,
  nome_abreviado    VARCHAR(100),
  nome              VARCHAR(200)   NOT NULL,
  morada            TEXT,
  codigo_postal     VARCHAR(20),
  localidade        VARCHAR(100),
  contactos         JSONB,
  email             VARCHAR(120),
  observacoes       TEXT,
  data_criacao      TIMESTAMPTZ    DEFAULT now()
);
ALTER TABLE clientes
  ADD CONSTRAINT clientes_nif_key UNIQUE(nif);

-- ─── FORNECEDORES ───────────────────────────────────────────────────────────
DROP TABLE IF EXISTS fornecedores CASCADE;
CREATE TABLE fornecedores (
  id_fornecedor           SERIAL PRIMARY KEY,
  nome                    TEXT      NOT NULL,
  nif                     TEXT,
  morada                  TEXT,
  codigo_postal           TEXT,
  localidade              TEXT,
  telefone_comercial      TEXT,
  telefone_contabilidade  TEXT,
  email_comercial         TEXT,
  email_contabilidade     TEXT,
  contacto_responsavel    TEXT,
  observacoes             TEXT,
  data_registo            TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  ativo                   BOOLEAN   DEFAULT TRUE
);

-- ─── VEÍCULOS ───────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS veiculos CASCADE;
CREATE TABLE veiculos (
  id_veiculo                SERIAL PRIMARY KEY,
  id_cliente                INTEGER REFERENCES clientes(id_cliente) ON DELETE CASCADE,
  matricula                 TEXT    NOT NULL UNIQUE,
  marca                     TEXT,
  modelo                    TEXT,
  cc                        INTEGER,
  cv                        INTEGER,
  kw                        INTEGER,
  combustivel               TEXT,
  numero_motor              TEXT,
  tecdoc                    TEXT,
  vin                       TEXT,
  data_primeira_matricula   DATE,
  rev_km                    INTEGER,
  rev_dias                  INTEGER,
  data_registo              TIMESTAMPTZ DEFAULT now()
);

-- ─── ARTIGOS ───────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS artigos CASCADE;
CREATE TABLE artigos (
  id_artigo            SERIAL PRIMARY KEY,
  referencia           TEXT    UNIQUE,
  descricao            TEXT,
  familia              TEXT,
  marca                TEXT,
  equivalencia         TEXT,
  preco_custo          NUMERIC(10,2),
  preco_venda          NUMERIC(10,2),
  stock_atual          INTEGER DEFAULT 0,
  stock_minimo         INTEGER DEFAULT 0,
  unidade_medida       TEXT,
  contabiliza_stock    BOOLEAN DEFAULT TRUE,
  data_ultima_entrada  TIMESTAMP WITHOUT TIME ZONE,
  ativo                BOOLEAN DEFAULT TRUE
);

COMMIT;
