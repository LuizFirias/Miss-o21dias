-- SALA DO TEMPO 21 - SCHEMA DO BANCO DE DADOS
-- Execute este script no SQL Editor do Supabase

-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  nivel TEXT NOT NULL CHECK (nivel IN ('iniciante', 'intermediario', 'avancado')),
  modo TEXT NOT NULL CHECK (modo IN ('normal', 'guerra')),
  dia_atual INTEGER DEFAULT 1,
  streak INTEGER DEFAULT 0,
  nivel_progressao INTEGER DEFAULT 0,
  limitacao TEXT DEFAULT 'nenhuma',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de progresso diário
CREATE TABLE IF NOT EXISTS progresso_dia (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  dia INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('feito', 'falhou')),
  data DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_progresso_user_id ON progresso_dia(user_id);
CREATE INDEX IF NOT EXISTS idx_progresso_data ON progresso_dia(data);

-- Habilitar Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE progresso_dia ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para users
CREATE POLICY "Usuários podem ver apenas seus próprios dados"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar apenas seus próprios dados"
  ON users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem inserir seus próprios dados"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Políticas de segurança para progresso_dia
CREATE POLICY "Usuários podem ver apenas seu próprio progresso"
  ON progresso_dia FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir apenas seu próprio progresso"
  ON progresso_dia FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar apenas seu próprio progresso"
  ON progresso_dia FOR UPDATE
  USING (auth.uid() = user_id);

-- Função para verificar falhas consecutivas
CREATE OR REPLACE FUNCTION verificar_falhas_consecutivas(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  falhas_consecutivas INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO falhas_consecutivas
  FROM (
    SELECT status
    FROM progresso_dia
    WHERE user_id = p_user_id
    ORDER BY data DESC
    LIMIT 2
  ) AS ultimos_dois
  WHERE status = 'falhou';
  
  RETURN falhas_consecutivas >= 2;
END;
$$ LANGUAGE plpgsql;
