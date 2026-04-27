# 🔄 Atualização: Sistema de Onboarding e Edição de Missões

## ✅ O que foi implementado:

### 1️⃣ **Fluxo de Onboarding Corrigido**
- Agora novos usuários são redirecionados para `/onboarding` antes de acessar o app
- Campo `onboarding_completo` adicionado na tabela `usuarios`
- Login detecta se usuário precisa completar perfil

### 2️⃣ **Novo Design dos Botões nas Missões**
- **Botões sempre visíveis** com opacidade 40%
- **Botão "FEITO"** verde, fica 100% opaco quando clicado
- **Botão "FALHOU"** vermelho, fica 100% opaco quando clicado
- **Efeito de escala** ao clicar (scale animation)
- **Possível trocar a escolha** antes de finalizar o dia

### 3️⃣ **Sistema de Edição de Missões**
- **Edição permitida mesmo após finalizar o dia**
- Banner verde aparece quando dia está finalizado
- Botão "EDITAR" permite alterar as escolhas
- **Auto-save**: Progresso salvo automaticamente ao clicar nos botões

### 4️⃣ **Três Modais de Conclusão Personalizados**
Baseado em quantas missões foram completadas (1, 2 ou 3):

- **1 Missão**: Modal amarelo com incentivo
  - "UM PASSO DE CADA VEZ" 💪
  - Mensagem de encorajamento

- **2 Missões**: Modal laranja com reforço
  - "QUASE LÁ!" 🔥
  - Mensagem de motivação

- **3 Missões**: Modal verde com parabéns
  - "DIA PERFEITO!" ⚡
  - Mensagem de conquista

**Features dos modais:**
- Área central vazia (160x160px) para PNG de personagem anime
- Design com borda colorida seguindo paleta do app
- Auto-close em 4 segundos
- Animações suaves (scale + opacity)

### 5️⃣ **Atualização Automática do Progresso**
- App verifica se há progresso salvo ao entrar na página de missão
- Carrega estado anterior se usuário voltar
- Permite marcar 2 missões às 18h e completar a 3ª depois
- Sistema detecta e atualiza automaticamente

---

## 🚀 Como Aplicar:

### **Passo 1: Executar SQL no Supabase**

1. Acesse [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **SQL Editor** (ícone de banco de dados no menu)
4. Clique em **New Query**
5. Cole e execute este SQL:

```sql
-- Adicionar campo para controlar se usuário completou onboarding
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS onboarding_completo BOOLEAN DEFAULT FALSE;

-- Marcar usuários existentes como onboarding completo
UPDATE usuarios SET onboarding_completo = TRUE WHERE dia_atual > 1 OR nivel_progressao > 0;
```

6. Clique em **Run** (ou pressione Ctrl+Enter)
7. Verifique se apareceu: ✅ **Success. No rows returned**

---

### **Passo 2: Reiniciar o Servidor**

Execute no terminal:

```powershell
# Parar processos nas portas 3000-3002
$processes = Get-NetTCPConnection -LocalPort 3000,3001,3002 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
foreach ($p in $processes) { Stop-Process -Id $p -Force -ErrorAction SilentlyContinue }

# Reiniciar servidor
npm run dev
```

---

## 🎨 Personalizações Futuras:

### **Adicionar PNG de Personagem no Modal**

Edite: `components/DayCompletionModal.tsx`

Substitua esta seção:

```tsx
<div className="w-40 h-40 mx-auto mb-6 flex items-center justify-center">
  {/* Placeholder - usuário adicionará PNG aqui */}
  <div className="text-8xl select-none">
    {selectedConfig.emoji}
  </div>
</div>
```

Por:

```tsx
<div className="w-40 h-40 mx-auto mb-6 flex items-center justify-center">
  <img 
    src="/personagens/anime-character.png" 
    alt="Personagem" 
    className="w-full h-full object-contain"
  />
</div>
```

E adicione o PNG em: `public/personagens/anime-character.png`

---

## 📋 Arquivos Modificados:

- ✅ `components/MissionCard.tsx` - Novo design de botões
- ✅ `components/DayCompletionModal.tsx` - Novo componente criado
- ✅ `app/missao/page.tsx` - Lógica de edição e auto-save
- ✅ `app/login/page.tsx` - Verificação de onboarding
- ✅ `app/onboarding/page.tsx` - Marca onboarding como completo
- ✅ `types/index.ts` - Adicionado campo onboarding_completo
- ✅ `tailwind.config.js` - Adicionada cor laranja
- ✅ `supabase/add-onboarding-field.sql` - SQL de migração

---

## 🧪 Testando:

1. **Teste o Onboarding:**
   - Crie novo usuário via webhook ou cadastro manual
   - Faça login
   - Deve redirecionar para `/onboarding` antes de `/home`

2. **Teste os Botões:**
   - Vá em `/missao`
   - Clique em "FEITO" - deve acender verde
   - Clique em "FALHOU" na mesma missão - deve trocar para vermelho
   - Botões devem ficar opacos quando não selecionados

3. **Teste a Edição:**
   - Complete um dia clicando em "FINALIZAR DIA"
   - Banner verde deve aparecer
   - Clique em "EDITAR"
   - Deve permitir alterar as escolhas

4. **Teste os Modais:**
   - Complete apenas 1 missão → Modal amarelo
   - Complete apenas 2 missões → Modal laranja
   - Complete as 3 missões → Modal verde

---

## 🎯 Próximos Passos Sugeridos:

- [ ] Adicionar PNGs de personagens anime nos modais
- [ ] Implementar notificações push para lembrar das missões
- [ ] Adicionar página de histórico de progresso
- [ ] Implementar sistema de conquistas/badges
- [ ] Criar dashboard de estatísticas

---

**Tudo funcionando! 🚀**
