# 🔗 WEBHOOK CAKTO — Integração Automática

## 📍 Endpoint Configurado

**URL no Cakto:** `https://saladotempo.site/api/webhook-cakto`  
**Método:** `POST`  
**Validação:** HMAC SHA256 com `CAKTO_WEBHOOK_SECRET`

---

## 🎯 Fluxo Automático

### **Evento:** `sale.approved` (compra aprovada)

1. **Cakto envia webhook** com dados da compra
2. **Endpoint valida assinatura** (segurança)
3. **Detecta order bumps** comprados
4. **Cria usuário no Supabase Auth** com senha temporária
5. **Cria perfil na tabela usuarios** com campos de acesso
6. **Envia email via Resend** com credenciais

---

## 📦 Payload do Cakto

```json
{
  "event": "sale.approved",
  "data": {
    "id": "txn_abc123",
    "customer": {
      "email": "cliente@exemplo.com",
      "name": "João Silva",
      "phone": "+5511999999999"
    },
    "amount": 4700,
    "status": "approved",
    "created_at": "2026-04-26T15:30:00Z",
    "order_bumps": [
      {
        "id": "bump_1",
        "name": "Modo Guerra (Acesso Oculto)",
        "amount": 1700
      },
      {
        "id": "bump_2",
        "name": "Continuidade (30 dias extras)",
        "amount": 2700
      }
    ]
  }
}
```

---

## 🔐 Mapeamento de Order Bumps

### **Detecção por Nome**

| Nome do Order Bump (keywords) | Campo no Supabase |
|-------------------------------|-------------------|
| `"modo guerra"` ou `"acesso oculto"` | `modo_guerra_acesso = true` |
| `"continuidade"` ou `"30 dias"` | `"continuidade_30dias = true"` |
| `"disparo rápido"` ou `"execução imediata"` | `disparo_rapido_acesso = true` |

**Nota:** A detecção é case-insensitive e busca por palavras-chave.

---

## 📧 Email Automático

### **Enviado via Resend**

**De:** `Sala do Tempo <contato@saladotempo.site>`  
**Para:** Email do cliente  
**Assunto:** `🎯 Acesso Confirmado — SALA DO TEMPO 21 DIAS`

**Conteúdo:**
- Boas-vindas personalizadas
- Credenciais de acesso (email + senha temporária)
- Lista de produtos premium desbloqueados (se comprou order bumps)
- CTA para fazer login
- Instruções dos primeiros passos

---

## 🧪 Testar Webhook (Desenvolvimento)

### **Opção 1: Teste Local com Ngrok**

1. Instalar ngrok: `npm install -g ngrok`
2. Rodar app local: `npm run dev`
3. Expor porta: `ngrok http 3000`
4. Copiar URL do ngrok: `https://abc123.ngrok.io`
5. Configurar no Cakto: `https://abc123.ngrok.io/api/webhook-cakto`
6. Fazer compra de teste no Cakto
7. Verificar logs no terminal

### **Opção 2: Teste Manual (curl)**

```bash
# Gerar assinatura HMAC
SECRET="eaa8e41f-ad47-4f95-9edc-9eeec0d51461"
PAYLOAD='{"event":"sale.approved","data":{"id":"test_123","customer":{"email":"teste@exemplo.com","name":"Teste"},"amount":4700,"status":"approved","created_at":"2026-04-26T15:30:00Z","order_bumps":[{"id":"1","name":"Modo Guerra","amount":1700}]}}'
SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$SECRET" | sed 's/^.* //')

# Enviar requisição
curl -X POST https://saladotempo.site/api/webhook-cakto \
  -H "Content-Type: application/json" \
  -H "x-cakto-signature: $SIGNATURE" \
  -d "$PAYLOAD"
```

### **Opção 3: Ferramentas Online**

- **Webhook.site:** Capturar payload real do Cakto
- **Postman/Insomnia:** Testar endpoint com payloads customizados

---

## 🛡️ Segurança

### **Validação de Assinatura**

```typescript
function verifyWebhookSignature(payload: string, signature: string): boolean {
  const hmac = crypto.createHmac('sha256', webhookSecret);
  const digest = hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}
```

- Usa `crypto.timingSafeEqual()` para prevenir timing attacks
- Rejeita requisições sem header `x-cakto-signature`
- Secret armazenado em variável de ambiente

### **Service Role Key**

- Usa `SUPABASE_SERVICE_ROLE_KEY` para criar usuários
- Permite bypass de RLS (Row Level Security)
- **Nunca** expor no frontend

---

## 📊 Logs e Monitoramento

### **Console Logs**

```
📨 Webhook recebido: { hasSignature: true, bodyLength: 456 }
📦 Payload: { event: 'sale.approved', email: 'cliente@exemplo.com', orderBumps: 2 }
🎯 Order Bumps detectados: { modo_guerra_acesso: true, continuidade_30dias: true }
✅ Usuário criado no Auth: 550e8400-e29b-41d4-a716-446655440000
✅ Perfil criado na tabela usuarios
✅ Email enviado
```

### **Erros Comuns**

| Erro | Causa | Solução |
|------|-------|---------|
| `Invalid signature` | Secret incorreto ou header ausente | Verificar `CAKTO_WEBHOOK_SECRET` no .env.local |
| `Failed to create auth user` | Email já existe ou inválido | Verificar se usuário já foi criado |
| `Failed to create user profile` | Campos obrigatórios faltando | Verificar schema da tabela `usuarios` |
| `Email not sent` | Resend API key inválida | Verificar `RESEND_API_KEY` |

---

## 🔄 Casos Especiais

### **Usuário já existe**

Se o email já estiver cadastrado:
1. Não cria novo usuário
2. **Atualiza** campos de order bumps (se comprou novos produtos)
3. Retorna sucesso com mensagem: `"User already exists, access updated"`

### **Falha no envio de email**

- Webhook **não falha** se email falhar
- Usuário é criado normalmente
- Email pode ser reenviado manualmente depois
- Credenciais ficam salvas no Supabase

### **Rollback em caso de erro**

Se falhar ao criar perfil na tabela `usuarios`:
1. Deleta usuário do Supabase Auth automaticamente
2. Retorna erro 500
3. Cakto pode reenviar webhook (retry)

---

## 🚀 Deploy

### **Checklist Pré-Deploy**

- [x] Criar endpoint `app/api/webhook-cakto/route.ts`
- [x] Configurar variáveis de ambiente no Vercel/Netlify:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` ⚠️
  - `RESEND_API_KEY`
  - `RESEND_FROM_EMAIL`
  - `CAKTO_WEBHOOK_SECRET`
  - `NEXT_PUBLIC_APP_URL`
- [ ] Fazer deploy no Vercel/Netlify
- [ ] Testar endpoint: `curl https://saladotempo.site/api/webhook-cakto`
- [ ] Configurar webhook no Cakto: `https://saladotempo.site/api/webhook-cakto`
- [ ] Fazer compra de teste
- [ ] Verificar logs no painel de deploy
- [ ] Confirmar email recebido
- [ ] Testar login com credenciais do email

### **Configurar no Painel do Cakto**

1. Acessar painel do produto
2. Ir em **Configurações → Webhooks**
3. Adicionar webhook:
   - **URL:** `https://saladotempo.site/api/webhook-cakto`
   - **Evento:** `sale.approved`
   - **Secret:** `eaa8e41f-ad47-4f95-9edc-9eeec0d51461`
4. Salvar e testar

---

## ⚙️ Próximas Melhorias (Opcional)

### **1. Evento de Reembolso**

```typescript
if (payload.event === 'sale.refunded') {
  // Bloquear acesso do usuário
  await supabaseAdmin
    .from('usuarios')
    .update({ acesso_ativo: false })
    .eq('email', email);
}
```

### **2. Retry Automático**

- Cakto faz retry automático em caso de erro 5xx
- Implementar idempotência: verificar `payload.data.id` para evitar duplicatas

### **3. Webhook de Teste**

Criar endpoint `/api/webhook-cakto/test` para desenvolvimento:

```typescript
export async function POST(request: NextRequest) {
  const { email, name } = await request.json();
  // Criar usuário de teste sem validação de assinatura
}
```

---

**Última atualização:** 26/04/2026  
**Status:** ✅ Implementado e pronto para deploy
