-- Migração: Adicionar campos de order bumps (Arsenal Avançado)
-- Descrição: Adiciona campos para controlar acesso aos produtos premium
-- Data: 2024

-- Adicionar colunas de controle de acesso aos produtos premium
ALTER TABLE usuarios
ADD COLUMN IF NOT EXISTS modo_guerra_acesso BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS continuidade_30dias BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS disparo_rapido_acesso BOOLEAN DEFAULT false;

-- Adicionar comentários para documentação
COMMENT ON COLUMN usuarios.modo_guerra_acesso IS 'Acesso ao Modo Guerra (order bump)';
COMMENT ON COLUMN usuarios.continuidade_30dias IS 'Acesso a Continuidade - 30 dias extras (order bump)';
COMMENT ON COLUMN usuarios.disparo_rapido_acesso IS 'Acesso ao Disparo Rápido (order bump)';

-- Criar índice para consultas por produtos adquiridos (opcional, para analytics)
CREATE INDEX IF NOT EXISTS idx_usuarios_modo_guerra ON usuarios(modo_guerra_acesso) WHERE modo_guerra_acesso = true;
CREATE INDEX IF NOT EXISTS idx_usuarios_continuidade ON usuarios(continuidade_30dias) WHERE continuidade_30dias = true;
CREATE INDEX IF NOT EXISTS idx_usuarios_disparo_rapido ON usuarios(disparo_rapido_acesso) WHERE disparo_rapido_acesso = true;
