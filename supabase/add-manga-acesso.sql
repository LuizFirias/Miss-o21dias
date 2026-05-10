-- Add manga_acesso column to usuarios table
-- manga_acesso: true = paid order bump, unlocks manga volumes for days 11-21
-- days 1-10 are free for all users

ALTER TABLE usuarios
ADD COLUMN IF NOT EXISTS manga_acesso boolean NOT NULL DEFAULT false;

-- If you want to grant access to existing users manually:
-- UPDATE usuarios SET manga_acesso = true WHERE id = '<user_id>';
