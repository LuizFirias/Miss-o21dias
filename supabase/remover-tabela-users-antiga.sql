-- ============================================
-- LIMPEZA RÁPIDA: Remover tabela antiga 'users'
-- ============================================
-- Execute este script no SQL Editor do Supabase se:
-- - Você NÃO tem dados importantes na tabela 'users', OU
-- - Você já migrou os dados para 'usuarios'
--
-- ⚠️ ATENÇÃO: Este comando VAI APAGAR todos os dados da tabela 'users'
-- Se você tem dados importantes, use o arquivo 'migracao-users-para-usuarios.sql'

-- Ver quantos registros existem antes de deletar
SELECT 
  'users' as tabela,
  COUNT(*) as total_registros
FROM users
WHERE EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'users'
);

-- Remover a tabela antiga 'users'
-- DESCOMENTE A LINHA ABAIXO quando tiver certeza:
-- DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- INSTRUÇÕES
-- ============================================
-- 1. Execute a query SELECT acima primeiro
-- 2. Se mostrar 0 registros ou dados não importantes, prossiga
-- 3. Descomente a linha DROP TABLE acima
-- 4. Execute novamente
-- 5. Execute o schema.sql completo para recriar tudo limpo

-- ============================================
-- Verificar se foi removida com sucesso
-- ============================================
-- Execute após fazer o DROP TABLE:
/*
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('users', 'usuarios')
ORDER BY table_name;
*/

-- Resultado esperado:
-- Deve mostrar APENAS 'usuarios', sem 'users'
