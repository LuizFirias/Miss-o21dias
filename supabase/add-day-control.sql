-- Adicionar campos para rastrear progresso das missões e controle de avanço de dia
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS ultimo_acesso_dia DATE DEFAULT CURRENT_DATE;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS pode_avancar_dia BOOLEAN DEFAULT TRUE;

-- Adicionar campos detalhados ao progresso_dia para rastrear cada missão
ALTER TABLE progresso_dia ADD COLUMN IF NOT EXISTS corpo_completo BOOLEAN DEFAULT FALSE;
ALTER TABLE progresso_dia ADD COLUMN IF NOT EXISTS mente_completo BOOLEAN DEFAULT FALSE;
ALTER TABLE progresso_dia ADD COLUMN IF NOT EXISTS disciplina_completo BOOLEAN DEFAULT FALSE;

-- Atualizar registros existentes baseado no status
UPDATE progresso_dia 
SET corpo_completo = TRUE, mente_completo = TRUE, disciplina_completo = TRUE 
WHERE status = 'feito';

-- Criar função para verificar se pode avançar dia (após 00:00 Brasília e completou 2+ missões)
CREATE OR REPLACE FUNCTION pode_avancar_para_proximo_dia(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  ultimo_acesso DATE;
  hoje DATE;
  missoes_completas INTEGER;
BEGIN
  -- Pegar último acesso do usuário
  SELECT ultimo_acesso_dia INTO ultimo_acesso
  FROM usuarios
  WHERE id = p_user_id;

  -- Data de hoje em horário de Brasília (UTC-3)
  hoje := (NOW() AT TIME ZONE 'America/Sao_Paulo')::DATE;

  -- Se ainda é o mesmo dia, não pode avançar
  IF ultimo_acesso = hoje THEN
    RETURN FALSE;
  END IF;

  -- Contar quantas missões foram completadas no último dia
  SELECT 
    (CASE WHEN corpo_completo THEN 1 ELSE 0 END) +
    (CASE WHEN mente_completo THEN 1 ELSE 0 END) +
    (CASE WHEN disciplina_completo THEN 1 ELSE 0 END)
  INTO missoes_completas
  FROM progresso_dia
  WHERE user_id = p_user_id
    AND data = ultimo_acesso
  ORDER BY created_at DESC
  LIMIT 1;

  -- Se completou menos de 2 missões, volta para dia 1
  IF missoes_completas IS NULL OR missoes_completas < 2 THEN
    RETURN FALSE;
  END IF;

  -- Pode avançar
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
