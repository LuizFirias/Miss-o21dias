# Cadastro de Usuários - Sala do Tempo

## 🔐 Sistema de Autenticação

O app usa **apenas senha pessoal** para cada usuário. Não existe mais senha de acesso compartilhada.

## 📝 Fluxo de Cadastro de Novos Usuários

### ✅ IMPLEMENTADO: Webhook Cakto + Email Automático

Quando um cliente compra na Cakto:

1. **Compra aprovada** → Webhook enviado para `/api/webhook-cakto`
2. **Sistema cria conta** automaticamente no Supabase
3. **Email de boas-vindas** enviado via Resend com credenciais temporárias
4. **Cliente acessa** `/login` e faz primeiro login
5. **Recomendado:** Cliente altera senha no perfil

### Manual: Página de Cadastro

Também existe a página `/cadastro` para cadastros manuais:
- Usuário insere nome, email e cria senha
- Recebe confirmação por email
- Faz login normalmente

## 🛠️ Arquivos Criados

### 1. Página de Cadastro
- **Arquivo:** `app/cadastro/page.tsx`
- **URL:** `/cadastro`
- **Funcionalidade:** Formulário para criar conta manualmente

### 2. API Webhook Cakto
- **Arquivo:** `pages/api/webhook-cakto.ts`
- **URL:** `https://seu-dominio.vercel.app/api/webhook-cakto`
- **Funcionalidade:** 
  - Recebe webhooks da Cakto
  - Cria usuário no Supabase Auth
  - Cria perfil na tabela `usuarios`
  - Envia email de boas-vindas via Resend

### 3. Utilitário de Emails
- **Arquivo:** `lib/resend.ts`
- **Funcionalidade:** Funções para envio de emails:
  - `sendWelcomeEmail()` - Boas-vindas após compra
  - `sendPasswordResetEmail()` - Recuperação de senha
  - `send7DayMilestoneEmail()` - Marco de 7 dias
  - `sendCompletionEmail()` - Conclusão dos 21 dias

## 📧 Emails Disponíveis

Todos os templates de email seguem o design da Sala do Tempo (preto/vermelho).

Ver detalhes em: **[TEMPLATES_EMAILS.md](./TEMPLATES_EMAILS.md)**

## 🔗 Configuração Necessária

### Passo 1: Configurar Resend
1. Criar conta em [resend.com](https://resend.com)
2. Adicionar e verificar seu domínio
3. Obter API Key
4. Configurar variável `RESEND_API_KEY`

### Passo 2: Configurar Cakto
1. Criar produto na Cakto
2. Configurar webhook para: `https://seu-dominio.vercel.app/api/webhook-cakto`
3. Evento: `purchase.approved`
4. Obter secret do webhook (opcional)

### Passo 3: Variáveis de Ambiente

Adicione no `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role

# Resend
RESEND_API_KEY=re_sua_chave_api
RESEND_FROM_EMAIL=Sala do Tempo <noreply@seudominio.com>

# Cakto
CAKTO_WEBHOOK_SECRET=sua-senha-secreta

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Passo 4: Instalar Dependências

```bash
npm install resend
```

### Passo 5: Deploy no Vercel

```bash
vercel --prod
```

Não esqueça de adicionar as variáveis de ambiente no dashboard do Vercel!

## 📚 Documentação Completa

- **[CONFIGURACAO_CAKTO_RESEND.md](./CONFIGURACAO_CAKTO_RESEND.md)** - Guia passo a passo completo
- **[TEMPLATES_EMAILS.md](./TEMPLATES_EMAILS.md)** - Detalhes de todos os emails

## ✅ Checklist de Implementação

- [x] Remover senha de acesso compartilhada (SALA21GUERRA)
- [x] Simplificar página de login para usar apenas email + senha
- [x] Adicionar "Recuperar senha"
- [x] Criar página de cadastro (`/cadastro`)
- [x] Criar API endpoint para webhook da Cakto
- [x] Integrar com Resend para emails
- [x] Criar templates de emails personalizados:
  - [x] Email de boas-vindas
  - [x] Email de recuperação de senha
  - [x] Email de 7 dias
  - [x] Email de conclusão (21 dias)
- [ ] Configurar Resend (domínio + API key)
- [ ] Configurar webhook na Cakto
- [ ] Configurar SMTP no Supabase (opcional)
- [ ] Deploy no Vercel com variáveis de ambiente
- [ ] Testar fluxo completo de compra → cadastro → login
- [ ] Implementar envio automático de emails de marco (7 e 21 dias)

## 📧 Suporte

Caso o usuário tenha problemas:
- ✅ "Esqueci minha senha" → Use a função "Recuperar senha"
- ✅ "Não recebi email" → Verifique spam, logs do Resend
- ✅ "Comprei mas não consigo acessar" → Verificar se webhook foi recebido, se usuário foi criado no Supabase

## 🚨 Próximos Passos

### Implementar Emails Automáticos de Marco

Para enviar emails automaticamente nos dias 7 e 21, você precisa:

**Opção 1: Edge Function + Cron no Supabase** (Recomendado)
- Criar função que verifica `dia_atual` dos usuários
- Agendar execução diária com pg_cron

**Opção 2: Vercel Cron Jobs**
- Criar endpoint `/api/cron/check-milestones`
- Configurar cron no `vercel.json`

Ver detalhes completos em: **[TEMPLATES_EMAILS.md](./TEMPLATES_EMAILS.md#como-implementar-emails-de-marco-7-e-21-dias)**
