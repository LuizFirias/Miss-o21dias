-- ============================================
-- MIGRAÇÃO: users → usuarios
-- ============================================
-- Execute este script APENAS SE você já tem dados na tabela antiga 'users'
-- e quer migrar para a nova tabela 'usuarios'
--
-- ATENÇÃO: Este script VAI APAGAR a tabela antiga 'users'
-- Se você não tem dados importantes, execute apenas o schema.sql normal

-- ============================================
-- PASSO 1: Verificar se existem dados
-- ============================================
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN
    RAISE NOTICE 'Tabela "users" encontrada. Iniciando migração...';
  ELSE
    RAISE NOTICE 'Tabela "users" não existe. Execute o schema.sql normal.';
    RETURN;
  END IF;
END $$;

-- ============================================
-- PASSO 2: Criar tabela nova (se não existir)
-- ============================================
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  nivel TEXT NOT NULL CHECK (nivel IN ('iniciante', 'intermediario', 'avancado')),
  modo TEXT NOT NULL CHECK (modo IN ('normal', 'guerra')),
  limitacao TEXT DEFAULT 'nenhuma' CHECK (limitacao IN ('nenhuma', 'joelho', 'lombar', 'ombro')),
  dia_atual INTEGER DEFAULT 1 CHECK (dia_atual >= 1 AND dia_atual <= 21),
  streak INTEGER DEFAULT 0,
  nivel_progressao INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PASSO 3: Migrar dados da tabela antiga
-- ============================================
INSERT INTO usuarios (
  id,
  email,
  nome,
  nivel,
  modo,
  limitacao,
  dia_atual,
  streak,
  nivel_progressao,
  created_at
)
SELECT 
  id,
  email,
  nome,
  nivel,
  modo,
  COALESCE(limitacao, 'nenhuma') as limitacao,
  dia_atual,
  streak,
  nivel_progressao,
  created_at
FROM users
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  nome = EXCLUDED.nome,
  nivel = EXCLUDED.nivel,
  modo = EXCLUDED.modo,
  limitacao = EXCLUDED.limitacao,
  dia_atual = EXCLUDED.dia_atual,
  streak = EXCLUDED.streak,
  nivel_progressao = EXCLUDED.nivel_progressao;

-- ============================================
-- PASSO 4: Verificar migração
-- ============================================
DO $$
DECLARE
  count_users INTEGER;
  count_usuarios INTEGER;
BEGIN
  SELECT COUNT(*) INTO count_users FROM users;
  SELECT COUNT(*) INTO count_usuarios FROM usuarios;
  
  RAISE NOTICE 'Registros na tabela "users": %', count_users;
  RAISE NOTICE 'Registros na tabela "usuarios": %', count_usuarios;
  
  IF count_users = count_usuarios THEN
    RAISE NOTICE '✅ Migração bem-sucedida!';
  ELSE
    RAISE WARNING '⚠️ Número de registros difere. Verifique antes de continuar.';
  END IF;
END $$;

-- ============================================
-- PASSO 5: Remover tabela antiga
-- ============================================
-- DESCOMENTE A LINHA ABAIXO APENAS APÓS CONFIRMAR QUE A MIGRAÇÃO FUNCIONOU
-- DROP TABLE users CASCADE;

-- ============================================
-- INSTRUÇÕES FINAIS
-- ============================================
-- 1. Execute este script
-- 2. Verifique os logs (NOTICES) para confirmar que a migração foi bem-sucedida
-- 3. Compare os dados nas duas tabelas:
--    SELECT COUNT(*) FROM users;
--    SELECT COUNT(*) FROM usuarios;
-- 4. Se tudo estiver correto, descomente a linha DROP TABLE acima
-- 5. Execute novamente para remover a tabela antiga
-- 6. Execute o schema.sql completo para adicionar RLS, funções, etc.
