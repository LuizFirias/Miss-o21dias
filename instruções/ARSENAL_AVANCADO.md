# Migração SQL: Arsenal Avançado

## 📋 O que foi criado

Esta migração adiciona suporte para os produtos premium do Arsenal Avançado, que são desbloqueados através dos **order bumps** no checkout.

## 🎯 Campos Adicionados

A tabela `usuarios` agora possui 3 novos campos booleanos:

- `modo_guerra_acesso` - Controla acesso ao Modo Guerra
- `continuidade_30dias` - Controla acesso aos 30 dias extras
- `disparo_rapido_acesso` - Controla acesso ao Disparo Rápido

**Valor padrão:** `false` (bloqueado)

## 🚀 Como Executar a Migração

### 1. Acessar o Supabase Dashboard
- Acesse: https://supabase.com/dashboard
- Entre no projeto: **btvciolxbfpcqhoonwst**

### 2. Abrir o SQL Editor
- No menu lateral, clique em **SQL Editor**
- Clique em **New query**

### 3. Executar o SQL
- Copie todo o conteúdo do arquivo: `supabase/add-arsenal-fields.sql`
- Cole no editor SQL
- Clique em **Run** (ou pressione `Ctrl/Cmd + Enter`)

### 4. Verificar Execução
Você deve ver a mensagem: **Success. No rows returned**

## ✅ Validação

Para confirmar que a migração foi executada corretamente, rode esta query:

```sql
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'usuarios'
  AND column_name IN ('modo_guerra_acesso', 'continuidade_30dias', 'disparo_rapido_acesso');
```

Deve retornar 3 linhas mostrando as colunas criadas.

## 🔓 Como Desbloquear Produtos (Manualmente para Teste)

Para testar o acesso aos produtos, você pode desbloquear manualmente para um usuário:

```sql
-- Substituir 'SEU_EMAIL_AQUI' pelo email do usuário de teste
UPDATE usuarios
SET modo_guerra_acesso = true,
    continuidade_30dias = true,
    disparo_rapido_acesso = true
WHERE email = 'SEU_EMAIL_AQUI';
```

## 🌐 Rotas Criadas

Após a migração, estas rotas estarão disponíveis:

- `/arsenal` - Página principal do Arsenal Avançado
- `/arsenal/modo-guerra` - Modo Guerra (bloqueado por padrão)
- `/arsenal/continuidade` - 30 dias extras (bloqueado por padrão)
- `/arsenal/disparo-rapido` - Disparo Rápido (bloqueado por padrão)

## 🎨 Navegação Atualizada

O botão **ARSENAL AVANÇADO** foi adicionado ao header do app, ao lado de BÔNUS.

## ⚠️ Importante

- Esta migração **NÃO afeta** dados existentes
- Todos os usuários terão os campos em `false` por padrão
- Para liberar acesso via webhook Cakto, será necessário implementar lógica adicional no endpoint

## 📝 Próximos Passos

1. ✅ Executar a migração SQL no Supabase
2. 🔄 Implementar lógica no webhook `/api/webhook-cakto` para:
   - Detectar quando order bumps são comprados
   - Atualizar os campos correspondentes para `true`
3. 📄 Criar conteúdo para os produtos premium (atualmente são placeholders)
