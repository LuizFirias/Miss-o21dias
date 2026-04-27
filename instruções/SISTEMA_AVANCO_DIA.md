# 🎯 Atualização: Sistema de Avanço de Dia e Trilha de Progresso

## ✅ **Mudanças Implementadas:**

### 1️⃣ **Sistema de Avanço de Dia Corrigido**
**ANTES:** Avançava automaticamente após completar missões
**AGORA:** 
- Missões só avançam após 00:00 (horário de Brasília)
- **Regra**: Precisa completar **pelo menos 2 missões** para avançar
- Se completou **apenas 1 missão**: após 00:00 volta para **Dia 1**
- Se completou **0 missões**: após 00:00 volta para **Dia 1**
- Se completou **2 ou 3 missões**: após 00:00 avança para próximo dia

### 2️⃣ **Nível de Progressão Dourado**
- Adicionado acima do nome do usuário no perfil
- Cores dourada com brilho (#FFC857)
- Níveis: **RECRUTA** → **SOLDADO** → **CABO** → **ELITE**

### 3️⃣ **Trilha de Progresso no Perfil**
Nova seção mostrando:
- **Missões Completas**: X/63 (total de missões)
- **Porcentagem**: X% de conclusão
- **Barra de Progresso**: Visual com gradiente
- **Indicadores de Níveis**: Mostra quais níveis foram alcançados

### 4️⃣ **Salvamento Detalhado de Missões**
Agora salva individualmente:
- `corpo_completo`: Boolean
- `mente_completo`: Boolean
- `disciplina_completo`: Boolean

### 5️⃣ **Controle de Acesso Diário**
Novos campos na tabela `usuarios`:
- `ultimo_acesso_dia`: Rastreia última vez que acessou
- `pode_avancar_dia`: Flag de controle

---

## 🚀 **EXECUTE AGORA (OBRIGATÓRIO):**

### **Passo 1: SQL no Supabase**

1. Acesse: [Supabase Dashboard](https://supabase.com/dashboard)
2. **SQL Editor** → **New Query**
3. Cole e execute **TODO** este SQL:

```sql
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
```

4. Clique em **Run** (Ctrl+Enter)
5. Verifique: ✅ **Success**

---

### **Passo 2: Reiniciar Servidor**

Execute no terminal:

```powershell
# Parar processos
$processes = Get-NetTCPConnection -LocalPort 3000,3001,3002 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
foreach ($p in $processes) { Stop-Process -Id $p -Force -ErrorAction SilentlyContinue }

# Limpar cache
Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue

# Reiniciar
npm run dev
```

---

## 🧪 **Como Testar:**

### **Teste 1: Regra de Avanço de Dia**

1. Acesse `/missao`
2. Complete **apenas 1 missão**
3. Clique **"FINALIZAR DIA"**
4. **NÃO deve avançar para dia 2**
5. Volte amanhã (ou mude a data no banco) → deve voltar para Dia 1

### **Teste 2: Avançar Corretamente**

1. Complete **2 ou 3 missões**
2. Clique **"FINALIZAR DIA"**
3. **Ainda está no mesmo dia**
4. Volte amanhã (ou mude a data) → deve avançar para próximo dia

### **Teste 3: Nível Dourado no Perfil**

1. Acesse `/perfil`
2. Deve ver em **DOURADO** acima do nome:
   - Dia 0-3: **RECRUTA**
   - Dia 4-7: **SOLDADO**
   - Dia 8-14: **CABO**
   - Dia 15-21: **ELITE**

### **Teste 4: Trilha de Progresso**

1. Acesse `/perfil`
2. Deve mostrar:
   - Missões completas: X/63
   - Porcentagem: X%
   - Barra de progresso visual
   - 4 cards de níveis (Recruta, Soldado, Cabo, Elite)

---

## 📋 **Arquivos Modificados:**

- ✅ `app/missao/page.tsx` - Nova lógica de avanço de dia
- ✅ `app/perfil/page.tsx` - Nível dourado + trilha de progresso
- ✅ `types/index.ts` - Novos campos no User
- ✅ `supabase/add-day-control.sql` - SQL de migração

---

## 🎯 **Regras de Avanço (Resumo):**

| Missões Completas | Após 00:00 Brasília |
|-------------------|---------------------|
| 0 missões         | Volta para Dia 1    |
| 1 missão          | Volta para Dia 1    |
| 2 missões         | Avança próximo dia  |
| 3 missões         | Avança próximo dia  |

---

## 🔍 **Para Testar Mudança de Dia Manualmente:**

Se quiser testar sem esperar até amanhã:

1. Acesse **Supabase** → **Table Editor** → **usuarios**
2. Encontre seu usuário
3. Mude `ultimo_acesso_dia` para **data de ontem**
4. Recarregue a página `/missao`
5. Deve verificar e aplicar regras de avanço

---

## ✨ **Melhorias Futuras Sugeridas:**

- [ ] Notificação às 00:00 lembrando de fazer missões
- [ ] Histórico detalhado de cada dia
- [ ] Gráfico de progresso ao longo do tempo
- [ ] Conquistas/badges especiais
- [ ] Comparação com outros usuários (leaderboard)

---

**Execute o SQL e teste! 🚀**
