-- Adiciona campo para rastrear se o usuário já trocou a senha temporária
-- gerada pelo webhook da Cakto. Quando FALSE, o app força a tela de
-- atualização de senha no primeiro login.
-- Executar no SQL Editor do Supabase.

ALTER TABLE usuarios
  ADD COLUMN IF NOT EXISTS senha_alterada BOOLEAN DEFAULT FALSE;

-- Marca usuários antigos que já estão usando o app como senha já alterada
-- (evita forçar a tela em quem já passou pelo onboarding antes da feature)
UPDATE usuarios
SET senha_alterada = TRUE
WHERE onboarding_completo = TRUE OR dia_atual > 1 OR nivel_progressao > 0;

COMMENT ON COLUMN usuarios.senha_alterada IS
  'FALSE quando o usuário ainda usa a senha temporária gerada pelo webhook. TRUE após a primeira troca via /trocar-senha.';
