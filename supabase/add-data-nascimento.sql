-- Migração: Adicionar campos de informações pessoais
-- Descrição: Adiciona data_nascimento e idade para cálculo de personalização
-- Data: 2024

-- Adicionar colunas de informações pessoais
ALTER TABLE usuarios
ADD COLUMN IF NOT EXISTS data_nascimento DATE,
ADD COLUMN IF NOT EXISTS idade INTEGER;

-- Adicionar comentários para documentação
COMMENT ON COLUMN usuarios.data_nascimento IS 'Data de nascimento do usuário (capturada no onboarding)';
COMMENT ON COLUMN usuarios.idade IS 'Idade do usuário (calculada automaticamente a partir da data de nascimento)';

-- Criar índice para consultas por idade (opcional)
CREATE INDEX IF NOT EXISTS idx_usuarios_idade ON usuarios(idade);
