# 🎯 ESTRATÉGIA DE ROTAS — SALA DO TEMPO

## 📍 Mapa de Rotas

### **Rotas Públicas** (sem autenticação)
```
/              → Página raiz (redireciona para /sales se não autenticado)
/sales         → Landing page de vendas (pública)
/auth/callback → Callback do Supabase Auth (necessário para magic link)
```

### **Rotas Autenticadas** (requer login)
```
/login         → Página de login (email + senha)
/onboarding    → Configuração inicial do perfil
/home          → Dashboard principal (missões do dia)
/missao        → Tela de execução de missão
/conclusao     → Checkpoint de progresso (dias 7, 14, 21)
/bonus         → Listagem de bônus desbloqueados
/bonus/*       → Páginas de bônus específicos
/arsenal       → Arsenal Avançado (produtos premium)
/arsenal/*     → Ferramentas premium (Modo Guerra, etc)
```

---

## 🚀 Funil de Conversão

### **1. Visitante chega ao site**
```
saladotempo.site → app/page.tsx
```
- **Se não autenticado:** redireciona para `/sales`
- **Se autenticado e onboarding completo:** redireciona para `/home`
- **Se autenticado mas sem onboarding:** redireciona para `/onboarding`

### **2. Landing Page (/sales)**
```
app/sales/page.tsx
```
- Página pública de vendas (1555 linhas)
- 16 seções: Hero, Ticker, Social Proof, Problema, Solução, etc
- CTAs conectados ao checkout Cakto
- URL: `https://pay.cakto.com.br/97n7exq_861235`

### **3. Checkout no Cakto**
```
pay.cakto.com.br/97n7exq_861235
```
- Compra processada no Cakto
- **Produto principal:** Sala do Tempo 21 (R$ 47)
- **Order Bumps disponíveis:**
  - Modo Guerra (acesso oculto)
  - Continuidade (30 dias extras)
  - Disparo Rápido (sistema de execução imediata)

### **4. Webhook Cakto → Supabase** ✅ IMPLEMENTADO
```
Cakto envia webhook → app/api/webhook-cakto/route.ts → Cria/atualiza usuário
```

**URL do Webhook:** `https://saladotempo.site/api/webhook-cakto`  
**Evento:** `sale.approved`  
**Validação:** HMAC SHA256 com `CAKTO_WEBHOOK_SECRET`

**Fluxo automático:**
1. ✅ Validar assinatura do webhook (segurança)
2. ✅ Detectar order bumps por nome (keywords)
3. ✅ Criar usuário no Supabase Auth com `admin.createUser()`
4. ✅ Criar perfil na tabela `usuarios` com campos de acesso
5. ✅ Enviar email via Resend com credenciais
6. ✅ Rollback automático em caso de erro

**📖 Documentação completa:** Ver `instruções/WEBHOOK_CAKTO.md`

### **5. Cliente acessa /login**
```
app/login/page.tsx
```
- Login com email + senha (Supabase Auth)
- Valida credenciais
- Se sucesso → verifica `onboarding_completo`
- Se false → `/onboarding`
- Se true → `/home`

### **6. Onboarding**
```
app/onboarding/page.tsx
```
- Define nome, nível (iniciante/intermediário/avançado), modo (normal/guerra)
- Atualiza `usuarios.onboarding_completo = true`
- Redireciona para `/home`

### **7. App Autenticado**
```
/home, /missao, /bonus, /arsenal, etc
```
- Todas as rotas protegidas por `useAuth()` hook
- Verifica `supabase.auth.getSession()`
- Se sem sessão → redireciona para `/login`
- Se sessão válida → carrega dados do usuário e renderiza

---

## 🔒 Controle de Acesso

### **Arsenal Avançado** (premium)
```
/arsenal/modo-guerra      → requer usuarios.modo_guerra_acesso = true
/arsenal/continuidade     → requer usuarios.continuidade_30dias = true
/arsenal/disparo-rapido   → requer usuarios.disparo_rapido_acesso = true
```

**Lógica de unlock:**
- Verificação em `app/arsenal/page.tsx`
- Se `campo = false` → exibe cadeado
- Se `campo = true` → permite acesso
- Click no produto bloqueado → alerta "Compre order bump no checkout"

### **Bônus Desbloqueados** (progressão)
```
/bonus/protocolo-anti-vicio  → desbloqueado no dia 1
/bonus/resiliencia-mental    → desbloqueado no dia 7
/bonus/quebra-procrastinacao → desbloqueado no dia 14
/bonus/arsenal-diario        → desbloqueado no dia 21
```

**Lógica de desbloqueio:**
- Verificação em `app/bonus/page.tsx`
- Compara `user.dia_atual` com `bonus.desbloqueioDia`
- Se `dia_atual >= desbloqueioDia` → desbloqueado
- Se não → exibe "Desbloqueado no dia X"

---

## 📊 Fluxo de Dados

### **Autenticação**
```
Supabase Auth (JWT) → localStorage → useAuth() → user context
```

### **Dados do Usuário**
```
supabase.from('usuarios').select('*').eq('id', user.id).single()
```

**Campos principais:**
- `id` (UUID, PK)
- `email`, `nome`
- `dia_atual` (1-21)
- `nivel` (iniciante/intermediário/avançado)
- `modo` (normal/guerra)
- `streak` (dias consecutivos)
- `onboarding_completo` (boolean)
- `modo_guerra_acesso` (boolean) ⚠️ precisa migração SQL
- `continuidade_30dias` (boolean) ⚠️ precisa migração SQL
- `disparo_rapido_acesso` (boolean) ⚠️ precisa migração SQL

### **Progresso Diário**
```
supabase.from('progresso_dia').select('*').eq('usuario_id', user.id).eq('dia', dia_atual)
```

**Campos:**
- `usuario_id`, `dia`
- `corpo_concluido`, `mente_concluido`, `disciplina_concluido`
- `todas_concluidas` (boolean)
- `concluido_em` (timestamp)

---

## ⚠️ PENDÊNCIAS TÉCNICAS

### **1. Migração SQL** (CRÍTICO)
```sql
-- Executar em Supabase SQL Editor
ALTER TABLE usuarios ADD COLUMN modo_guerra_acesso BOOLEAN DEFAULT false;
ALTER TABLE usuarios ADD COLUMN continuidade_30dias BOOLEAN DEFAULT false;
ALTER TABLE usuarios ADD COLUMN disparo_rapido_acesso BOOLEAN DEFAULT false;

CREATE INDEX idx_usuarios_modo_guerra ON usuarios(modo_guerra_acesso);
CREATE INDEX idx_usuarios_continuidade ON usuarios(continuidade_30dias);
CREATE INDEX idx_usuarios_disparo ON usuarios(disparo_rapido_acesso);
```
**Arquivo:** `supabase/add-arsenal-fields.sql`

### **2. Configurar Webhook no Cakto** (IMPORTANTE)
1. Acessar painel do produto no Cakto
2. Ir em **Configurações → Webhooks**
3. Adicionar webhook:
   - **URL:** `https://saladotempo.site/api/webhook-cakto`
   - **Evento:** `sale.approved`
   - **Secret:** (valor de `CAKTO_WEBHOOK_SECRET` do .env.local)
4. Salvar e fazer compra de teste

**📖 Documentação completa do webhook:** Ver `instruções/WEBHOOK_CAKTO.md`

### **3. Analytics** (OPCIONAL)
- Google Analytics em `/sales`
- Pixel de conversão após compra
- Tracking de eventos (CTA clicks, scroll depth, etc)

---

## 🧪 Testes Manuais

### **Teste 1: Visitante sem compra**
1. Acesse `saladotempo.site`
2. Deve redirecionar para `/sales`
3. Veja a landing page completa
4. Clique em "QUERO COMEÇAR AGORA"
5. Deve abrir checkout Cakto em nova aba

### **Teste 2: Cliente que comprou**
1. Execute webhook manualmente ou crie usuário via SQL
2. Acesse `saladotempo.site/login`
3. Faça login com email + senha
4. Se primeiro acesso → vai para `/onboarding`
5. Complete onboarding → vai para `/home`
6. Navegue para `/arsenal`
7. Verifique se produtos premium estão bloqueados/desbloqueados corretamente

### **Teste 3: Progressão de bônus**
1. Login como usuário dia 1 → `/bonus` → apenas Protocolo Anti-Vício desbloqueado
2. Atualizar `dia_atual = 8` → `/bonus` → Resiliência Mental também desbloqueado
3. Atualizar `dia_atual = 15` → `/bonus` → Quebra Procrastinação também desbloqueado
4. Atualizar `dia_atual = 21` → `/bonus` → todos 4 bônus desbloqueados

### **Teste 4: Arsenal Avançado**
1. Login como usuário sem order bumps → `/arsenal` → todos bloqueados
2. Atualizar `modo_guerra_acesso = true` → `/arsenal/modo-guerra` → acesso liberado
3. Click em produto bloqueado → deve mostrar overlay com CTA para checkout

---

## 📝 Notas de Implementação

### **Proteção de Rotas**
- Todas as rotas em `/app/*` (exceto `/sales` e `/auth`) usam `useAuth()` hook
- Se `!user` → `router.replace('/login')`
- Se `user && !onboarding_completo` → `router.replace('/onboarding')`

### **Redirecionamentos**
- Usar `router.replace()` ao invés de `router.push()` para evitar histórico desnecessário
- Exemplo: `router.replace('/home')` após login

### **SEO**
- `/sales` deve ter metadata completa (title, description, og:image)
- Adicionar `metadata` export em `app/sales/page.tsx`
- Configurar `robots.txt` para permitir `/sales` e bloquear `/app/*`

### **Performance**
- Landing page já otimizada com Framer Motion (lazy animations)
- PWA instalável (manifest.json + sw.js já criados)
- Fontes carregadas via Google Fonts com `display=swap`

---

## ✅ Checklist de Deploy

- [ ] Executar `supabase/add-arsenal-fields.sql` no Supabase SQL Editor
- [ ] Configurar variáveis de ambiente no Vercel/Netlify:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` ⚠️ (necessário para webhook)
  - `RESEND_API_KEY`
  - `RESEND_FROM_EMAIL`
  - `CAKTO_WEBHOOK_SECRET`
  - `NEXT_PUBLIC_APP_URL`
- [ ] Fazer deploy no Vercel/Netlify
- [ ] Testar endpoint webhook: `curl https://saladotempo.site/api/webhook-cakto`
- [ ] Configurar webhook no Cakto: `https://saladotempo.site/api/webhook-cakto`
- [ ] Fazer compra de teste e verificar:
  - [ ] Usuário criado no Supabase Auth
  - [ ] Perfil criado na tabela `usuarios`
  - [ ] Order bumps mapeados corretamente
  - [ ] Email recebido com credenciais
- [ ] Testar login com credenciais do email
- [ ] Validar fluxo completo: compra → email → login → onboarding → home
- [ ] Testar PWA em mobile (Android + iOS)
- [ ] Configurar domínio `saladotempo.site` com SSL (automático no Vercel)
- [ ] Configurar Google Analytics (opcional)
- [ ] Adicionar pixel de conversão (opcional)

---

**Última atualização:** 26/04/2026  
**Checkout URL:** https://pay.cakto.com.br/97n7exq_861235  
**Webhook URL:** https://saladotempo.site/api/webhook-cakto
