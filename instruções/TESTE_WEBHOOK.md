# 🧪 Teste Local do Webhook Cakto

Este script testa o endpoint do webhook localmente antes do deploy.

## 📋 Pré-requisitos

1. App rodando localmente: `npm run dev`
2. Variáveis de ambiente configuradas no `.env.local`
3. PowerShell 7+ (ou use Git Bash/WSL no Windows)

---

## 🚀 Teste 1: Verificar se endpoint responde

```powershell
# GET deve retornar 405 (Method not allowed)
curl http://localhost:3000/api/webhook-cakto
```

**Resposta esperada:**
```json
{"error":"Method not allowed"}
```

---

## 🚀 Teste 2: POST com assinatura válida

### PowerShell (Windows)

```powershell
# 1. Definir variáveis
$secret = "eaa8e41f-ad47-4f95-9edc-9eeec0d51461"
$payload = '{"event":"sale.approved","data":{"id":"test_123","customer":{"email":"teste@exemplo.com","name":"João Teste"},"amount":4700,"status":"approved","created_at":"2026-04-26T15:30:00Z","order_bumps":[{"id":"1","name":"Modo Guerra (Acesso Oculto)","amount":1700}]}}'

# 2. Calcular assinatura HMAC SHA256
$hmac = [System.Security.Cryptography.HMACSHA256]::new([System.Text.Encoding]::UTF8.GetBytes($secret))
$hash = $hmac.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($payload))
$signature = [System.BitConverter]::ToString($hash).Replace('-','').ToLower()

# 3. Enviar requisição
Invoke-WebRequest -Uri "http://localhost:3000/api/webhook-cakto" `
  -Method POST `
  -Headers @{
    "Content-Type" = "application/json"
    "x-cakto-signature" = $signature
  } `
  -Body $payload
```

### Bash (Linux/Mac/WSL)

```bash
#!/bin/bash

# 1. Definir variáveis
SECRET="eaa8e41f-ad47-4f95-9edc-9eeec0d51461"
PAYLOAD='{"event":"sale.approved","data":{"id":"test_123","customer":{"email":"teste@exemplo.com","name":"João Teste"},"amount":4700,"status":"approved","created_at":"2026-04-26T15:30:00Z","order_bumps":[{"id":"1","name":"Modo Guerra (Acesso Oculto)","amount":1700}]}}'

# 2. Calcular assinatura HMAC SHA256
SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$SECRET" | sed 's/^.* //')

# 3. Enviar requisição
curl -X POST http://localhost:3000/api/webhook-cakto \
  -H "Content-Type: application/json" \
  -H "x-cakto-signature: $SIGNATURE" \
  -d "$PAYLOAD"
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "User created successfully",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "email": "teste@exemplo.com",
  "orderBumps": {
    "modo_guerra_acesso": true,
    "continuidade_30dias": false,
    "disparo_rapido_acesso": false
  }
}
```

---

## 🚀 Teste 3: POST com múltiplos order bumps

```powershell
$payload = '{"event":"sale.approved","data":{"id":"test_456","customer":{"email":"premium@exemplo.com","name":"Maria Premium"},"amount":11100,"status":"approved","created_at":"2026-04-26T15:30:00Z","order_bumps":[{"id":"1","name":"Modo Guerra (Acesso Oculto)","amount":1700},{"id":"2","name":"Continuidade (30 dias extras)","amount":2700},{"id":"3","name":"Disparo Rápido: Sistema de execução imediata","amount":1700}]}}'

$hmac = [System.Security.Cryptography.HMACSHA256]::new([System.Text.Encoding]::UTF8.GetBytes($secret))
$hash = $hmac.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($payload))
$signature = [System.BitConverter]::ToString($hash).Replace('-','').ToLower()

Invoke-WebRequest -Uri "http://localhost:3000/api/webhook-cakto" `
  -Method POST `
  -Headers @{
    "Content-Type" = "application/json"
    "x-cakto-signature" = $signature
  } `
  -Body $payload
```

**Resposta esperada:**
```json
{
  "success": true,
  "orderBumps": {
    "modo_guerra_acesso": true,
    "continuidade_30dias": true,
    "disparo_rapido_acesso": true
  }
}
```

---

## 🚀 Teste 4: POST sem assinatura (deve falhar)

```powershell
$payload = '{"event":"sale.approved","data":{"id":"test_789","customer":{"email":"teste2@exemplo.com","name":"Teste 2"},"amount":4700,"status":"approved","created_at":"2026-04-26T15:30:00Z"}}'

Invoke-WebRequest -Uri "http://localhost:3000/api/webhook-cakto" `
  -Method POST `
  -Headers @{"Content-Type" = "application/json"} `
  -Body $payload
```

**Resposta esperada:**
```json
{"error":"Invalid signature"}
```
**Status:** `401 Unauthorized`

---

## 🚀 Teste 5: POST com evento ignorado

```powershell
$payload = '{"event":"sale.pending","data":{"id":"test_999","customer":{"email":"teste3@exemplo.com","name":"Teste 3"},"amount":4700,"status":"pending"}}'

$hmac = [System.Security.Cryptography.HMACSHA256]::new([System.Text.Encoding]::UTF8.GetBytes($secret))
$hash = $hmac.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($payload))
$signature = [System.BitConverter]::ToString($hash).Replace('-','').ToLower()

Invoke-WebRequest -Uri "http://localhost:3000/api/webhook-cakto" `
  -Method POST `
  -Headers @{
    "Content-Type" = "application/json"
    "x-cakto-signature" = $signature
  } `
  -Body $payload
```

**Resposta esperada:**
```json
{"message":"Event ignored"}
```

---

## 📊 Logs para Verificar

Durante os testes, no terminal onde rodou `npm run dev`, você deve ver:

```
📨 Webhook recebido: { hasSignature: true, bodyLength: 456 }
📦 Payload: { event: 'sale.approved', email: 'teste@exemplo.com', orderBumps: 1 }
🎯 Order Bumps detectados: { modo_guerra_acesso: true, continuidade_30dias: false, disparo_rapido_acesso: false }
✅ Usuário criado no Auth: 550e8400-e29b-41d4-a716-446655440000
✅ Perfil criado na tabela usuarios
✅ Email enviado
```

---

## ✅ Checklist de Validação

Após rodar os testes, verificar:

- [ ] Teste 1: GET retorna 405 ✓
- [ ] Teste 2: POST válido cria usuário ✓
- [ ] Teste 3: Múltiplos order bumps são detectados ✓
- [ ] Teste 4: POST sem assinatura retorna 401 ✓
- [ ] Teste 5: Eventos não-aprovados são ignorados ✓
- [ ] Usuários criados aparecem no Supabase Auth
- [ ] Perfis criados aparecem na tabela `usuarios`
- [ ] Campos de order bumps corretos (`modo_guerra_acesso`, etc)
- [ ] Email recebido na caixa de entrada de teste

---

## 🐛 Erros Comuns

### Erro: `Invalid signature`
**Causa:** Secret incorreto ou payload modificado  
**Solução:** Verificar se `CAKTO_WEBHOOK_SECRET` no .env.local está correto

### Erro: `Failed to create auth user`
**Causa:** Email já existe ou Supabase fora do ar  
**Solução:** Usar email diferente ou verificar conexão com Supabase

### Erro: `Failed to create user profile`
**Causa:** Migração SQL não executada  
**Solução:** Executar `supabase/add-arsenal-fields.sql` no Supabase SQL Editor

### Erro: Email não enviado
**Causa:** Resend API key inválida  
**Solução:** Verificar `RESEND_API_KEY` no .env.local

---

## 🔍 Verificação no Supabase

### **1. Verificar usuário criado no Auth**

```sql
SELECT id, email, created_at, email_confirmed_at
FROM auth.users
WHERE email = 'teste@exemplo.com';
```

### **2. Verificar perfil criado**

```sql
SELECT id, email, nome, modo_guerra_acesso, continuidade_30dias, disparo_rapido_acesso
FROM usuarios
WHERE email = 'teste@exemplo.com';
```

### **3. Limpar dados de teste**

```sql
-- Deletar perfil
DELETE FROM usuarios WHERE email LIKE '%@exemplo.com';

-- Deletar usuário do Auth (precisa fazer via Supabase Dashboard)
-- Authentication > Users > buscar email > Delete
```

---

## 🌐 Teste em Produção (após deploy)

Substituir `http://localhost:3000` por `https://saladotempo.site`:

```powershell
$secret = "eaa8e41f-ad47-4f95-9edc-9eeec0d51461"
$payload = '{"event":"sale.approved","data":{"id":"prod_test_123","customer":{"email":"teste.prod@exemplo.com","name":"Teste Produção"},"amount":4700,"status":"approved","created_at":"2026-04-26T15:30:00Z"}}'

$hmac = [System.Security.Cryptography.HMACSHA256]::new([System.Text.Encoding]::UTF8.GetBytes($secret))
$hash = $hmac.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($payload))
$signature = [System.BitConverter]::ToString($hash).Replace('-','').ToLower()

Invoke-WebRequest -Uri "https://saladotempo.site/api/webhook-cakto" `
  -Method POST `
  -Headers @{
    "Content-Type" = "application/json"
    "x-cakto-signature" = $signature
  } `
  -Body $payload
```

---

**Nota:** O erro 500 que você recebeu ao fazer GET é esperado, pois o endpoint está em produção mas só aceita POST com assinatura válida. Para testar GET, deve retornar 405 (Method not allowed), não 500. Se continuar retornando 500 em GET, pode haver erro no código do método GET.
