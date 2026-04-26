-- SALA DO TEMPO 21 - SCHEMA DO BANCO DE DADOS
-- Execute este script no SQL Editor do Supabase
-- 
-- INSTRUÇÕES:
-- 1. Acesse o Supabase Dashboard → SQL Editor
-- 2. Cole este script completo
-- 3. Execute (Run)
-- 4. Verifique se as tabelas foram criadas em Database → Tables

-- ============================================
-- LIMPEZA: REMOVER TABELAS ANTIGAS
-- ============================================
-- Remove a tabela antiga 'users' se existir (foi renomeada para 'usuarios')
DROP TABLE IF EXISTS users CASCADE;
DROP VIEW IF EXISTS v_usuario_dashboard CASCADE;

-- ============================================
-- TABELA PRINCIPAL: USUARIOS
-- ============================================
-- Armazena informações do perfil e progresso do usuário na jornada
CREATE TABLE usuarios (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  
  -- Configuração da jornada escolhida no onboarding
  nivel TEXT NOT NULL CHECK (nivel IN ('iniciante', 'intermediario', 'avancado')),
  modo TEXT NOT NULL CHECK (modo IN ('normal', 'guerra')),
  limitacao TEXT DEFAULT 'nenhuma' CHECK (limitacao IN ('nenhuma', 'joelho', 'lombar', 'ombro')),
  
  -- Progresso do usuário
  dia_atual INTEGER DEFAULT 1 CHECK (dia_atual >= 1 AND dia_atual <= 21),
  streak INTEGER DEFAULT 0,
  nivel_progressao INTEGER DEFAULT 0,
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABELA DE PROGRESSO DIÁRIO
-- ============================================
-- Registra o histórico de execução das missões diárias
DROP TABLE IF EXISTS progresso_dia CASCADE;
CREATE TABLE progresso_dia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  dia INTEGER NOT NULL CHECK (dia >= 1 AND dia <= 21),
  
  -- Status da execução
  status TEXT NOT NULL CHECK (status IN ('feito', 'falhou')),
  
  -- Detalhamento das missões (JSON)
  corpo_completo BOOLEAN DEFAULT FALSE,
  mente_completo BOOLEAN DEFAULT FALSE,
  disciplina_completo BOOLEAN DEFAULT FALSE,
  
  -- Data de execução
  data DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Garantir apenas um registro por usuário/dia
  UNIQUE(user_id, dia, data)
);

-- ============================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_progresso_user_id ON progresso_dia(user_id);
CREATE INDEX IF NOT EXISTS idx_progresso_data ON progresso_dia(data);
CREATE INDEX IF NOT EXISTS idx_progresso_user_dia ON progresso_dia(user_id, dia);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
-- Garante que cada usuário só acessa seus próprios dados
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE progresso_dia ENABLE ROW LEVEL SECURITY;

-- Políticas para USUARIOS
DROP POLICY IF EXISTS "Usuários podem ver apenas seus próprios dados" ON usuarios;
CREATE POLICY "Usuários podem ver apenas seus próprios dados"
  ON usuarios FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Usuários podem atualizar apenas seus próprios dados" ON usuarios;
CREATE POLICY "Usuários podem atualizar apenas seus próprios dados"
  ON usuarios FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Usuários podem inserir seus próprios dados" ON usuarios;
CREATE POLICY "Usuários podem inserir seus próprios dados"
  ON usuarios FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Políticas para PROGRESSO_DIA
DROP POLICY IF EXISTS "Usuários podem ver apenas seu próprio progresso" ON progresso_dia;
CREATE POLICY "Usuários podem ver apenas seu próprio progresso"
  ON progresso_dia FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem inserir apenas seu próprio progresso" ON progresso_dia;
CREATE POLICY "Usuários podem inserir apenas seu próprio progresso"
  ON progresso_dia FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem atualizar apenas seu próprio progresso" ON progresso_dia;
CREATE POLICY "Usuários podem atualizar apenas seu próprio progresso"
  ON progresso_dia FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem deletar apenas seu próprio progresso" ON progresso_dia;
CREATE POLICY "Usuários podem deletar apenas seu próprio progresso"
  ON progresso_dia FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- FUNÇÕES AUXILIARES
-- ============================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION atualizar_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at em usuarios
DROP TRIGGER IF EXISTS trigger_usuarios_updated_at ON usuarios;
CREATE TRIGGER trigger_usuarios_updated_at
  BEFORE UPDATE ON usuarios
  FOR EACH ROW
  EXECUTE FUNCTION atualizar_updated_at();

-- Função para verificar falhas consecutivas (usado para reset)
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

-- Função para calcular streak atual
CREATE OR REPLACE FUNCTION calcular_streak(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  streak_atual INTEGER := 0;
  registro RECORD;
BEGIN
  FOR registro IN (
    SELECT status, data
    FROM progresso_dia
    WHERE user_id = p_user_id
    ORDER BY data DESC
  ) LOOP
    IF registro.status = 'feito' THEN
      streak_atual := streak_atual + 1;
    ELSE
      EXIT;
    END IF;
  END LOOP;
  
  RETURN streak_atual;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VIEWS ÚTEIS
-- ============================================

-- View para dashboard do usuário
CREATE OR REPLACE VIEW v_usuario_dashboard AS
SELECT 
  u.id,
  u.email,
  u.nome,
  u.nivel,
  u.modo,
  u.dia_atual,
  u.streak,
  u.nivel_progressao,
  u.limitacao,
  COUNT(pd.id) FILTER (WHERE pd.status = 'feito') as dias_completos,
  COUNT(pd.id) FILTER (WHERE pd.status = 'falhou') as dias_falhados
FROM usuarios u
LEFT JOIN progresso_dia pd ON u.id = pd.user_id
GROUP BY u.id;

-- ============================================
-- DADOS INICIAIS (OPCIONAL)
-- ============================================
-- Descomente se quiser adicionar dados de teste
/*
INSERT INTO usuarios (id, email, nome, nivel, modo) VALUES 
  (gen_random_uuid(), 'teste@exemplo.com', 'Usuário Teste', 'iniciante', 'normal')
ON CONFLICT DO NOTHING;
*/
