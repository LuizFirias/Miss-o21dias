# 🚀 Início Rápido - Sistema de Cadastro e Emails

Guia rápido para colocar o sistema de vendas + emails em funcionamento.

## ✅ O Que Foi Criado

### 1. Página de Cadastro Manual
- **URL:** `/cadastro`
- **Arquivo:** `app/cadastro/page.tsx`
- Permite que usuários criem conta manualmente

### 2. API Webhook Cakto
- **Endpoint:** `/api/webhook-cakto`
- **Arquivo:** `pages/api/webhook-cakto.ts`
- Recebe compras da Cakto e cria usuários automaticamente

### 3. Sistema de Emails com Resend
- **Arquivo:** `lib/resend.ts`
- 4 templates de email prontos:
  - ✅ Boas-vindas (após compra)
  - ✅ Recuperação de senha
  - ✅ Marco de 7 dias
  - ✅ Conclusão dos 21 dias

## 📦 Instalar Dependências

```bash
npm install resend
```

## ⚙️ Configurar Variáveis de Ambiente

### 1. Obter Service Role Key do Supabase

1. Dashboard do Supabase → Seu projeto
2. Settings → API
3. Copie **service_role** (secret key)

### 2. Criar conta no Resend

1. Acesse [resend.com](https://resend.com)
2. Crie conta gratuita
3. Domains → Add Domain → Adicione seu domínio
4. Configure registros DNS (SPF, DKIM)
5. API Keys → Create → Copie a chave

### 3. Atualizar `.env.local`

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://btvciolxbfpcqhoonwst.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role-aqui

# Resend
RESEND_API_KEY=re_sua_chave_api_aqui
RESEND_FROM_EMAIL=Sala do Tempo <noreply@seudominio.com>

# Cakto (opcional)
CAKTO_WEBHOOK_SECRET=sua-senha-secreta-webhook

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🌐 Deploy no Vercel

### 1. Fazer Deploy

```bash
# Instalar Vercel CLI (se ainda não tiver)
npm install -g vercel

# Deploy
vercel --prod
```

### 2. Adicionar Variáveis de Ambiente

No dashboard do Vercel:
1. Seu projeto → Settings → Environment Variables
2. Adicionar todas as variáveis do `.env.local`
3. Marcar para Production, Preview e Development
4. Save → Redeploy

### 3. Anotar URL do Deploy

Exemplo: `https://sala-do-tempo.vercel.app`

## 🔗 Configurar Cakto

### 1. Criar Produto

1. Dashboard Cakto → Produtos → Novo Produto
2. Nome: "Sala do Tempo - 21 Dias de Execução"
3. Preço: R$ 97,00 (ou seu valor)
4. Salvar

### 2. Configurar Webhook

1. Produto → Configurações → Webhooks
2. Adicionar Webhook:
   - URL: `https://sua-url.vercel.app/api/webhook-cakto`
   - Evento: `purchase.approved`
   - Formato: JSON
   - Método: POST
3. Salvar

## ✅ Testar Sistema

### Teste 1: Webhook Local

```bash
# Terminal 1: Rodar app
npm run dev

# Terminal 2: Simular webhook
curl -X POST http://localhost:3000/api/webhook-cakto \
  -H "Content-Type: application/json" \
  -d '{
    "event": "purchase.approved",
    "data": {
      "comprador_email": "teste@email.com",
      "comprador_nome": "João Teste",
      "status": "approved"
    }
  }'
```

**Verificar:**
- ✅ Console mostra "Usuário criado"
- ✅ Supabase Auth tem novo usuário
- ✅ Tabela `usuarios` tem novo registro

### Teste 2: Email

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

**Verificar:**
- ✅ Email chegou na caixa de entrada
- ✅ Resend Dashboard mostra status "delivered"

### Teste 3: Compra Real (Produção)

1. Fazer compra de teste na Cakto (modo sandbox ou valor mínimo)
2. Verificar logs no Vercel: Dashboard → Functions → Logs
3. Verificar usuário criado no Supabase
4. Verificar email recebido

## 📧 Fluxo Completo

```
Cliente compra na Cakto
    ↓
Webhook enviado para Vercel
    ↓
API cria usuário no Supabase
    ↓
Email de boas-vindas enviado via Resend
    ↓
Cliente recebe email com credenciais
    ↓
Cliente acessa /login
    ↓
Cliente faz primeiro acesso
    ↓
Cliente vai para /onboarding
```

## 📚 Documentação Completa

- **[CONFIGURACAO_CAKTO_RESEND.md](./CONFIGURACAO_CAKTO_RESEND.md)** - Guia passo a passo detalhado
- **[TEMPLATES_EMAILS.md](./TEMPLATES_EMAILS.md)** - Detalhes dos templates de email
- **[CADASTRO_USUARIOS.md](./CADASTRO_USUARIOS.md)** - Visão geral do sistema

## 🆘 Problemas Comuns

### Webhook não funciona
- Verificar URL no painel da Cakto
- Verificar logs do Vercel
- Testar endpoint com curl

### Email não chega
- Verificar domínio verificado no Resend
- Verificar registros DNS (SPF, DKIM)
- Verificar logs no Resend Dashboard
- Verificar spam

### Usuário não é criado
- Verificar `SUPABASE_SERVICE_ROLE_KEY`
- Verificar tabela `usuarios` existe
- Verificar logs de erro no console

## ⏭️ Próximos Passos

### 1. Implementar Emails Automáticos de Marco

Para enviar emails nos dias 7 e 21:

**Opção A: Vercel Cron**
```json
// vercel.json
{
  "crons": [{
    "path": "/api/cron/check-milestones",
    "schedule": "0 12 * * *"
  }]
}
```

**Opção B: Supabase Edge Function + pg_cron**

Ver detalhes em: [TEMPLATES_EMAILS.md](./TEMPLATES_EMAILS.md#como-implementar-emails-de-marco-7-e-21-dias)

### 2. Personalizar Templates de Email

Editar arquivo: `lib/resend.ts`

Ajustar:
- Cores
- Textos
- CTAs
- Imagens (se quiser adicionar)

### 3. Monitoramento

- Resend Dashboard → Emails (ver taxa de entrega)
- Vercel Dashboard → Functions → Logs (debug)
- Supabase Dashboard → Auth (novos usuários)

---

**Pronto! Sistema configurado e funcionando! 🎉**
