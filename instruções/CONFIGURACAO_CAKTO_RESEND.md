# 🚀 Configuração Completa - Cakto + Resend + Vercel

Este guia mostra como configurar o sistema completo de vendas e emails para a Sala do Tempo.

## 📋 Índice

1. [Configurar Resend](#1-configurar-resend)
2. [Configurar Cakto](#2-configurar-cakto)
3. [Variáveis de Ambiente](#3-variáveis-de-ambiente)
4. [Instalar Dependências](#4-instalar-dependências)
5. [Deploy no Vercel](#5-deploy-no-vercel)
6. [Testar Webhooks](#6-testar-webhooks)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. Configurar Resend

### Passo 1: Criar conta no Resend

1. Acesse [resend.com](https://resend.com)
2. Crie uma conta gratuita (100 emails/dia grátis)
3. Faça login no dashboard

### Passo 2: Adicionar domínio

1. No dashboard, vá em **Domains**
2. Clique em **Add Domain**
3. Digite seu domínio (ex: `seudominio.com`)
4. Siga as instruções para adicionar os registros DNS:
   - **SPF:** registro TXT
   - **DKIM:** registro TXT
   - **MX:** registro MX (opcional, se quiser receber emails)

**Exemplo de registros DNS (na sua hospedagem/Cloudflare):**

```
Tipo    Nome                    Valor
TXT     @                       v=spf1 include:resend.com ~all
TXT     resend._domainkey       [valor fornecido pelo Resend]
MX      @                       feedback-smtp.resend.com (prioridade 10)
```

5. Aguarde verificação (geralmente 5-30 minutos)
6. Status deve mudar para **Verified** ✅

### Passo 3: Criar API Key

1. No dashboard do Resend, vá em **API Keys**
2. Clique em **Create API Key**
3. Nome: `Sala do Tempo - Production`
4. Permissões: **Send emails**
5. Copie a chave (começa com `re_...`)
6. **⚠️ Guarde essa chave em local seguro - ela não será mostrada novamente!**

### Passo 4: Configurar email de envio

No código, o email de envio está definido em `lib/resend.ts`:

```typescript
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Sala do Tempo <noreply@seudominio.com>';
```

**Opções de email:**
- `noreply@seudominio.com` - Não recebe respostas
- `contato@seudominio.com` - Recebe respostas
- `suporte@seudominio.com` - Para emails de suporte

---

## 2. Configurar Cakto

### Passo 1: Criar conta na Cakto

1. Acesse [cakto.com.br](https://cakto.com.br)
2. Crie uma conta de vendedor
3. Complete o cadastro

### Passo 2: Criar produto

1. No dashboard da Cakto, vá em **Produtos**
2. Clique em **Novo Produto**
3. Preencha:
   - **Nome:** Sala do Tempo - 21 Dias de Execução
   - **Preço:** R$ 97,00 (ou seu valor)
   - **Descrição:** [sua descrição de venda]
   - **Tipo:** Produto Digital / Curso Online
4. Salve o produto

### Passo 3: Configurar Webhook

1. No produto, vá em **Configurações > Webhooks**
2. Clique em **Adicionar Webhook**
3. Preencha:
   - **URL:** `https://seu-dominio.vercel.app/api/webhook-cakto`
   - **Eventos:** Marque `purchase.approved`
   - **Formato:** JSON
   - **Método:** POST

**⚠️ Importante:**
- A URL do webhook só funciona após fazer deploy no Vercel
- Para testar localmente, use [ngrok](https://ngrok.com) ou [localtunnel](https://localtunnel.github.io/www/)

### Passo 4: Secret do Webhook (Opcional, mas recomendado)

1. Na configuração do webhook, procure por **Secret** ou **Chave Secreta**
2. Gere uma senha forte aleatória (ex: `wh_sk_abc123xyz789`)
3. Salve essa chave
4. Adicione nas variáveis de ambiente: `CAKTO_WEBHOOK_SECRET`

### Passo 5: Estrutura do Webhook da Cakto

A Cakto envia dados neste formato:

```json
{
  "event": "purchase.approved",
  "data": {
    "produto_id": "abc123",
    "produto_nome": "Sala do Tempo",
    "comprador_email": "cliente@email.com",
    "comprador_nome": "João Silva",
    "comprador_telefone": "+5511999999999",
    "valor": 97.00,
    "status": "approved",
    "data_compra": "2026-04-23T10:30:00Z"
  }
}
```

**Nota:** A estrutura pode variar. Consulte a [documentação oficial da Cakto](https://docs.cakto.com.br) para confirmar.

---

## 3. Variáveis de Ambiente

### Arquivo `.env.local` (desenvolvimento)

Crie/edite o arquivo `.env.local` na raiz do projeto:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role

# Resend
RESEND_API_KEY=re_sua_chave_api_aqui
RESEND_FROM_EMAIL=Sala do Tempo <noreply@seudominio.com>

# Cakto
CAKTO_WEBHOOK_SECRET=sua-senha-secreta-webhook

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Onde encontrar as chaves do Supabase:

1. **NEXT_PUBLIC_SUPABASE_URL** e **NEXT_PUBLIC_SUPABASE_ANON_KEY:**
   - Dashboard do Supabase → Seu projeto → Settings → API
   - Project URL e anon/public key

2. **SUPABASE_SERVICE_ROLE_KEY:**
   - Mesma página (Settings → API)
   - Service Role key (secret)
   - ⚠️ **NUNCA** exponha essa chave no front-end!

---

## 4. Instalar Dependências

### Instalar Resend SDK

```bash
npm install resend
```

### Verificar package.json

Certifique-se de que tem todas as dependências:

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.x.x",
    "resend": "^3.x.x",
    "next": "^14.x.x",
    "react": "^18.x.x",
    "framer-motion": "^10.x.x"
  }
}
```

### Instalar tudo

```bash
npm install
```

---

## 5. Deploy no Vercel

### Passo 1: Preparar projeto

```bash
# Testar build local
npm run build

# Se der erro, corrigir antes de fazer deploy
```

### Passo 2: Deploy no Vercel

**Opção A: Via Interface Web**

1. Acesse [vercel.com](https://vercel.com)
2. Conecte sua conta GitHub/GitLab/Bitbucket
3. Importe o repositório do projeto
4. Vercel detectará Next.js automaticamente
5. Clique em **Deploy**

**Opção B: Via CLI**

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy para produção
vercel --prod
```

### Passo 3: Configurar Variáveis de Ambiente no Vercel

1. No dashboard do Vercel, vá em **Settings > Environment Variables**
2. Adicione TODAS as variáveis do `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
RESEND_API_KEY
RESEND_FROM_EMAIL
CAKTO_WEBHOOK_SECRET
NEXT_PUBLIC_APP_URL
```

3. Para `NEXT_PUBLIC_APP_URL`, use sua URL do Vercel:
   - Ex: `https://sala-do-tempo.vercel.app`

4. Marque as variáveis para **Production**, **Preview** e **Development**

5. Clique em **Save**

### Passo 4: Redeploy

Após adicionar variáveis, faça um novo deploy:

```bash
vercel --prod
```

Ou no dashboard: **Deployments** → ... → **Redeploy**

---

## 6. Testar Webhooks

### Teste Local (Desenvolvimento)

**Opção 1: Usar ngrok**

```bash
# Instalar ngrok
npm install -g ngrok

# Rodar o app Next.js
npm run dev

# Em outro terminal, expor porta 3000
ngrok http 3000

# Copiar URL gerada (ex: https://abc123.ngrok.io)
# Usar no webhook da Cakto: https://abc123.ngrok.io/api/webhook-cakto
```

**Opção 2: Simular webhook com cURL**

```bash
curl -X POST http://localhost:3000/api/webhook-cakto \
  -H "Content-Type: application/json" \
  -d '{
    "event": "purchase.approved",
    "data": {
      "produto_id": "test123",
      "produto_nome": "Sala do Tempo - Teste",
      "comprador_email": "teste@email.com",
      "comprador_nome": "João Teste",
      "valor": 97.00,
      "status": "approved",
      "data_compra": "2026-04-23T10:30:00Z"
    }
  }'
```

### Teste em Produção

1. Fazer uma compra de teste na Cakto
2. Verificar logs:
   - **Vercel:** Dashboard → Projeto → Functions → Logs
   - **Supabase:** Dashboard → Auth → Users (verificar se usuário foi criado)
   - **Resend:** Dashboard → Emails → Logs (verificar se email foi enviado)

### Monitorar Logs

**No Vercel:**
```bash
vercel logs
```

**No código:**
- Todos os `console.log()` aparecem nos logs do Vercel
- Use para debug: `console.log('Webhook recebido:', payload)`

---

## 7. Troubleshooting

### Problema: Webhook não está sendo recebido

**Verificar:**
- ✅ URL do webhook está correta no painel da Cakto
- ✅ Deploy foi feito com sucesso no Vercel
- ✅ API route existe: `pages/api/webhook-cakto.ts`
- ✅ Cakto está configurado para POST em JSON

**Testar:**
```bash
curl -X POST https://seu-dominio.vercel.app/api/webhook-cakto \
  -H "Content-Type: application/json" \
  -d '{"event": "test"}'
```

Deve retornar resposta (mesmo que seja erro).

---

### Problema: Email não está sendo enviado

**Verificar:**
- ✅ `RESEND_API_KEY` está configurada corretamente
- ✅ Domínio está verificado no Resend
- ✅ Email de envio usa domínio verificado
- ✅ Registros DNS estão configurados

**Logs do Resend:**
- Dashboard → Emails → Logs
- Verificar status: `delivered`, `bounced`, `complained`

**Testar envio manual:**
```bash
curl -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer re_sua_chave" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "Sala do Tempo <noreply@seudominio.com>",
    "to": "seu-email@gmail.com",
    "subject": "Teste",
    "html": "<p>Teste de email</p>"
  }'
```

---

### Problema: Usuário não está sendo criado no Supabase

**Verificar:**
- ✅ `SUPABASE_SERVICE_ROLE_KEY` está correta
- ✅ Tabela `usuarios` existe no banco
- ✅ Schema está correto (rodar `schema.sql`)
- ✅ Políticas RLS não estão bloqueando insert

**Logs:**
- Verificar console do Vercel: `console.error('Erro ao criar perfil:', error)`

**Testar criação manual:**
```sql
-- No Supabase SQL Editor
INSERT INTO usuarios (id, email, nome, nivel, modo, dia_atual)
VALUES (
  gen_random_uuid(),
  'teste@email.com',
  'João Teste',
  'iniciante',
  'normal',
  1
);
```

---

### Problema: Assinatura do webhook inválida

**Se você configurou `CAKTO_WEBHOOK_SECRET`:**

Verifique se a Cakto está enviando a assinatura no header correto:
- Header esperado: `x-cakto-signature`
- Pode ser: `x-signature`, `signature`, etc.

Consulte a documentação da Cakto para confirmar.

**Solução temporária:**
Comente a verificação de assinatura no código:

```typescript
// Comentar isso temporariamente:
/*
if (webhookSecret) {
  // ... validação de assinatura
}
*/
```

---

### Problema: Página /cadastro não abre

**Verificar:**
- ✅ Arquivo existe: `app/cadastro/page.tsx`
- ✅ Rebuild do projeto: `npm run build`
- ✅ Redeploy no Vercel

---

## 📞 Suporte

### Documentações Oficiais:
- **Resend:** https://resend.com/docs
- **Cakto:** https://docs.cakto.com.br (se disponível)
- **Supabase:** https://supabase.com/docs
- **Vercel:** https://vercel.com/docs

### Testes Recomendados:
1. ✅ Teste local com webhook simulado
2. ✅ Teste de envio de email via Resend
3. ✅ Compra de teste na Cakto (modo sandbox, se disponível)
4. ✅ Verificar criação de usuário no Supabase
5. ✅ Verificar recebimento de email de boas-vindas

---

## ✅ Checklist Final

- [ ] Resend configurado e domínio verificado
- [ ] API Key do Resend obtida
- [ ] Produto criado na Cakto
- [ ] Webhook configurado na Cakto
- [ ] Todas as variáveis de ambiente configuradas
- [ ] Dependências instaladas (`npm install resend`)
- [ ] Deploy feito no Vercel
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Teste de webhook realizado
- [ ] Teste de email enviado com sucesso
- [ ] Usuário de teste criado no Supabase
- [ ] Email de boas-vindas recebido

**Tudo pronto! 🎉**

Seu sistema está configurado para:
- ✅ Receber compras da Cakto via webhook
- ✅ Criar usuários automaticamente no Supabase
- ✅ Enviar emails de boas-vindas com Resend
- ✅ Permitir cadastro manual via `/cadastro`
- ✅ Enviar emails de recuperação de senha
