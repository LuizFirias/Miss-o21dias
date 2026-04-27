# 🚀 INSTRUÇÕES: EXECUTAR SQL NO SUPABASE

## ⚠️ IMPORTANTE: Execute este passo ANTES de usar o app

O app está travando no onboarding porque a tabela `usuarios` ainda não existe no seu banco de dados Supabase.

---

## 🧹 ATENÇÃO: Tabela antiga 'users' detectada

Se você já executou o SQL antes, pode ter uma tabela antiga chamada `users` no banco. **Você precisa ter apenas a tabela `usuarios`** (sem a antiga `users`).

### Opção 1: Remover tabela antiga (RECOMENDADO se não tem dados importantes)

Execute no SQL Editor:
```sql
DROP TABLE IF EXISTS users CASCADE;
```

Depois execute o `schema.sql` completo normalmente.

### Opção 2: Migrar dados da tabela antiga

Se você tem dados importantes na tabela `users`:
1. Execute o arquivo `supabase/migracao-users-para-usuarios.sql`
2. Depois execute `supabase/schema.sql`

### Verificar quais tabelas existem

Execute no SQL Editor:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name LIKE '%user%'
ORDER BY table_name;
```

**Resultado esperado**: Deve mostrar APENAS `usuarios` (sem `users`)

---

## 📋 Passo a Passo

### 1. Acesse o Supabase Dashboard

Vá para: https://supabase.com/dashboard

### 2. Selecione seu projeto

Clique no projeto **Sala do Tempo 21** (ou o nome que você deu)

### 3. Abra o SQL Editor

No menu lateral esquerdo:
- Clique em **SQL Editor** (ícone de engrenagem com código)
- Ou acesse diretamente: `https://supabase.com/dashboard/project/SEU_PROJECT_ID/sql`

### 4. Execute o Schema SQL

1. Clique em **"New query"** (botão verde)
2. Cole **TODO** o conteúdo do arquivo `supabase/schema.sql`
3. Clique em **"Run"** (botão azul no canto inferior direito)

**OU**

Se preferir, copie e cole o SQL abaixo:

```sql
-- ============================================
-- TABELA PRINCIPAL: USUARIOS
-- ============================================
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  
  -- Configuração da jornada
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
CREATE TABLE IF NOT EXISTS progresso_dia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  dia INTEGER NOT NULL CHECK (dia >= 1 AND dia <= 21),
  
  -- Status da execução
  status TEXT NOT NULL CHECK (status IN ('feito', 'falhou')),
  
  -- Detalhamento das missões
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

-- Atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION atualizar_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_usuarios_updated_at ON usuarios;
CREATE TRIGGER trigger_usuarios_updated_at
  BEFORE UPDATE ON usuarios
  FOR EACH ROW
  EXECUTE FUNCTION atualizar_updated_at();

-- Verificar falhas consecutivas
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

-- Calcular streak atual
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
-- VIEW PARA DASHBOARD
-- ============================================
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
```

### 5. Verificar se funcionou

Após executar o SQL:

1. Vá em **Database** → **Tables** no menu lateral
2. Você deve ver as tabelas:
   - ✅ `usuarios`
   - ✅ `progresso_dia`
   - ✅ `v_usuario_dashboard` (view)

### 6. Adicionar Redirect URL

**IMPORTANTE**: Para o Magic Link funcionar, adicione a URL de callback:

1. Vá em **Authentication** → **URL Configuration**
2. Em **Redirect URLs**, adicione:
   ```
   http://localhost:3000/auth/callback
   https://seudominio.com/auth/callback
   ```
3. Clique em **Save**

---

## ✅ Pronto!

Agora você pode:

1. **Reiniciar o servidor local** (se necessário):
   ```bash
   npm run dev
   ```

2. **Testar o login**:
   - Acesse http://localhost:3000/login
   - Use a senha: `SALA21GUERRA`
   - Digite seu email
   - Verifique o email e clique no link
   - Complete o onboarding (modo + nível)
   - Será redirecionado para /home

---

## 🔍 Estrutura de Dados

### Tabela `usuarios`

Armazena o perfil e progresso de cada usuário:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | ID do usuário (mesmo do Supabase Auth) |
| `email` | TEXT | Email do usuário |
| `nome` | TEXT | Nome extraído do email |
| `nivel` | TEXT | iniciante, intermediario ou avancado |
| `modo` | TEXT | normal ou guerra |
| `limitacao` | TEXT | nenhuma, joelho, lombar ou ombro |
| `dia_atual` | INTEGER | Dia atual na jornada (1-21) |
| `streak` | INTEGER | Dias consecutivos sem falhar |
| `nivel_progressao` | INTEGER | Nível de progressão (0-21) |
| `created_at` | TIMESTAMP | Data de criação |
| `updated_at` | TIMESTAMP | Data de última atualização |

### Tabela `progresso_dia`

Registra o histórico de execução das missões:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | ID único do registro |
| `user_id` | UUID | Referência ao usuário |
| `dia` | INTEGER | Dia da missão (1-21) |
| `status` | TEXT | feito ou falhou |
| `corpo_completo` | BOOLEAN | Missão do corpo completa |
| `mente_completo` | BOOLEAN | Missão da mente completa |
| `disciplina_completo` | BOOLEAN | Missão da disciplina completa |
| `data` | DATE | Data de execução |
| `created_at` | TIMESTAMP | Data de registro |

---

## 🛡️ Segurança (RLS)

O Row Level Security (RLS) garante que:

- ✅ Cada usuário vê **apenas seus próprios dados**
- ✅ Ninguém pode modificar dados de outros usuários
- ✅ O ID do usuário é validado automaticamente via `auth.uid()`

---

## 📊 Consultas Úteis (SQL)

### Ver todos os usuários cadastrados:
```sql
SELECT * FROM usuarios;
```

### Ver progresso de um usuário específico:
```sql
SELECT * FROM progresso_dia WHERE user_id = 'SEU_UUID';
```

### Ver dashboard completo:
```sql
SELECT * FROM v_usuario_dashboard;
```

### Resetar progresso de um usuário:
```sql
UPDATE usuarios 
SET dia_atual = 1, streak = 0, nivel_progressao = 0 
WHERE id = 'SEU_UUID';

DELETE FROM progresso_dia WHERE user_id = 'SEU_UUID';
```

---

## ❓ Problemas Comuns

### "Erro ao finalizar cadastro"
- ✅ Verifique se executou o SQL completo
- ✅ Verifique se as tabelas `usuarios` e `progresso_dia` existem
- ✅ Verifique os logs do console do navegador (F12)

### "Magic Link não funciona"
- ✅ Adicione a URL de callback nas configurações do Supabase
- ✅ Verifique se o email está correto
- ✅ Aguarde alguns minutos se recebeu erro de rate limit

### "Não consigo fazer login"
- ✅ Senha de acesso: `SALA21GUERRA`
- ✅ Aguarde 5 segundos entre tentativas
- ✅ Verifique se há erro de rate limit do Supabase

---

## 🚀 Próximos Passos

Após o onboarding funcionar:

1. ✅ Implementar trilha personalizada baseada em nivel/modo
2. ✅ Adicionar checkpoint screens
3. ✅ Implementar fail modal
4. ✅ Adicionar notificações push
5. ✅ Deploy para produção

**Arquivo criado**: `INSTRUCOES_SQL.md`
