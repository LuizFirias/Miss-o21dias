-- Adicionar campo para controlar se usuário completou onboarding
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS onboarding_completo BOOLEAN DEFAULT FALSE;

-- Marcar usuários existentes como onboarding completo (já têm perfil configurado)
UPDATE usuarios SET onboarding_completo = TRUE WHERE dia_atual > 1 OR nivel_progressao > 0;
