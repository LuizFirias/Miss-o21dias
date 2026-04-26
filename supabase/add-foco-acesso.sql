-- Adiciona campo de acesso completo à biblioteca FOCO (vídeos + áudios)
-- Executar no SQL Editor do Supabase

ALTER TABLE usuarios
  ADD COLUMN IF NOT EXISTS foco_acesso BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN usuarios.foco_acesso IS
  'TRUE quando o usuário comprou acesso completo à biblioteca FOCO (vídeos + áudios). FALSE = apenas o item gratuito de cada categoria.';
