# 🚀 INÍCIO RÁPIDO - SALA DO TEMPO 21

## ⚡ Instalação em 3 passos

### 1️⃣ Instalar dependências

**Windows:**
```bash
install.bat
```

**Mac/Linux:**
```bash
chmod +x install.sh
./install.sh
```

**Ou manualmente:**
```bash
npm install
```

### 2️⃣ Configurar Supabase

1. Acesse https://supabase.com e crie uma conta
2. Crie um novo projeto
3. Vá em SQL Editor e execute o conteúdo de `supabase/schema.sql`
4. Vá em Settings > API e copie:
   - Project URL
   - anon/public key
5. Cole no arquivo `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-aqui
```

### 3️⃣ Rodar o projeto

```bash
npm run dev
```

Acesse: http://localhost:3000

---

## 📁 Estrutura do Projeto

```
sala-do-tempo-21/
├── app/                          # Páginas (Next.js App Router)
│   ├── layout.tsx               # Layout global
│   ├── globals.css              # Estilos globais
│   ├── page.tsx                 # Página inicial (redirect)
│   ├── login/
│   │   └── page.tsx            # Login com magic link
│   ├── onboarding/
│   │   └── page.tsx            # Configuração inicial (4 etapas)
│   ├── home/
│   │   └── page.tsx            # Dashboard principal
│   ├── missao/
│   │   └── page.tsx            # Execução das missões
│   └── conclusao/
│       └── page.tsx            # Tela de finalização (dia 21)
│
├── components/                   # Componentes React
│   ├── Layout.tsx               # Container principal
│   ├── Header.tsx               # Cabeçalho com dia/streak
│   ├── ProgressBar.tsx          # Barra de progresso
│   ├── DayCard.tsx              # Card do dia atual
│   ├── MissionCard.tsx          # Card de missão (corpo/mente/disciplina)
│   ├── Modal.tsx                # Modal genérico
│   ├── CheckpointScreen.tsx     # Tela de checkpoint (dias 7 e 14)
│   └── Loading.tsx              # Indicador de carregamento
│
├── data/
│   └── missoes.ts               # 21 missões completas
│
├── hooks/
│   └── useAuth.ts               # Hook de autenticação
│
├── lib/
│   └── supabase.ts              # Cliente Supabase
│
├── store/
│   └── userStore.ts             # Estado global (Zustand)
│
├── types/
│   └── index.ts                 # TypeScript types
│
├── utils/
│   ├── helpers.ts               # Funções auxiliares
│   └── notifications.ts         # Sistema de notificações
│
├── public/                       # Arquivos estáticos
│   ├── manifest.json            # PWA manifest
│   ├── sw.js                    # Service Worker
│   ├── icon-192.png             # ⚠️ CRIAR
│   ├── icon-512.png             # ⚠️ CRIAR
│   └── favicon.ico              # ⚠️ CRIAR
│
├── supabase/
│   └── schema.sql               # Schema do banco de dados
│
├── docs/
│   └── supabase-examples.ts     # Exemplos de uso da API
│
├── .env.local                   # Variáveis de ambiente (preencher)
├── .env.local.example           # Exemplo de variáveis
├── package.json                 # Dependências
├── tsconfig.json                # Config TypeScript
├── tailwind.config.ts           # Config Tailwind
├── next.config.js               # Config Next.js
├── README.md                    # Documentação principal
├── DEPLOY.md                    # Guia de deploy
├── ICONES.md                    # Instruções para criar ícones
└── PROXIMOS_PASSOS.md          # Lista de tarefas
```

---

## 🎯 Fluxo do Usuário

```
1. / (page.tsx)
   ↓ Verifica autenticação
   ├─→ Não autenticado → /login
   ├─→ Autenticado sem perfil → /onboarding
   └─→ Autenticado com perfil → /home

2. /login
   → Usuário digita email
   → Recebe magic link
   → Clica no link
   → Redirecionado para /onboarding

3. /onboarding (4 etapas)
   ├─ Etapa 1: Nome
   ├─ Etapa 2: Nível (iniciante/intermediário/avançado)
   ├─ Etapa 3: Limitação física
   └─ Etapa 4: Modo (normal/guerra)
   → Salva no banco
   → Redireciona para /home

4. /home
   → Mostra dia atual
   → Mostra streak
   → Mostra progresso
   → Botão "INICIAR MISSÃO"
   → Checkpoint nos dias 7 e 14

5. /missao
   → Mostra 3 cards (Corpo, Mente, Disciplina)
   → Usuário marca como concluído ou falhou
   → Botão "FINALIZAR DIA"
   → Salva progresso
   → Atualiza streak
   → Redireciona para /home

6. /conclusao (dia 21+)
   → Tela de parabéns
   → Mostra estatísticas finais
   → Opção de voltar ao início
```

---

## 🎨 Componentes Principais

### Header
```tsx
<Header diaAtual={5} streak={3} nome="João" />
```
Exibe: DIA 5/21 | STREAK 3 | SOLDADO

### ProgressBar
```tsx
<ProgressBar progresso={24} />
```
Barra visual de 0-100%

### DayCard
```tsx
<DayCard 
  dia={5} 
  nome="VELOCIDADE DO SONIC"
  onClick={() => router.push('/missao')}
/>
```
Card do dia com nome e botão de ação

### MissionCard
```tsx
<MissionCard
  titulo="CORPO"
  tipo="corpo"
  conteudo={{ flexoes: 35, corrida_no_lugar: 120 }}
  onComplete={() => handleComplete('corpo')}
  onFail={() => handleFail('corpo')}
  completed={false}
  failed={false}
/>
```
Card de missão individual

---

## 🔧 Configurações Importantes

### Cores (Tailwind)
```css
preto: #0D0D0D      /* Fundo principal */
vermelho: #FF3B3B   /* Ação/perigo */
verde: #00C853      /* Sucesso */
amarelo: #FFC857    /* Destaque */
```

### Níveis de Progressão
```
0-3 dias: Recruta
4-7 dias: Soldado
8-14 dias: Cabo
15-21 dias: Elite
```

### Multiplicadores por Nível
```
Iniciante: 0.6x
Intermediário: 1.0x
Avançado: 1.4x
```

---

## 🐛 Solução de Problemas

### Erro: "Cannot find module..."
```bash
rm -rf node_modules
npm install
```

### Erro: "Invalid API key"
- Verifique se copiou corretamente do Supabase
- Verifique se o arquivo `.env.local` existe
- Reinicie o servidor: `npm run dev`

### Página em branco
- Abra o console do navegador (F12)
- Verifique erros no terminal
- Verifique se o Supabase está configurado

### Build falha
```bash
# Verificar erros
npm run lint

# Limpar cache
rm -rf .next

# Build novamente
npm run build
```

---

## 📱 Testar PWA

1. Build de produção:
```bash
npm run build
npm start
```

2. Acesse via HTTPS ou localhost

3. Chrome: Menu > Instalar app

4. Teste em mobile:
- Use ngrok para HTTPS local
- Ou faça deploy na Vercel

---

## ✅ Checklist Pré-Launch

- [ ] Supabase configurado e funcionando
- [ ] Schema do banco executado
- [ ] Magic Link testado e funcionando
- [ ] Variáveis de ambiente configuradas
- [ ] Ícones PWA criados
- [ ] Testado fluxo completo (login → dia 21)
- [ ] Testado em Chrome, Safari, Firefox
- [ ] Testado em mobile (iOS e Android)
- [ ] PWA instala corretamente
- [ ] Notificações funcionando (opcional)
- [ ] Todos os textos revisados
- [ ] Testado falha e reset de streak
- [ ] Testado checkpoints (dias 7 e 14)

---

## 🚀 Deploy Rápido

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# 4. Configurar variáveis de ambiente
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

# 5. Deploy de produção
vercel --prod
```

Ver mais detalhes em `DEPLOY.md`

---

## 📞 Suporte

- Erros de build: Verifique `npm run lint`
- Erros do Supabase: Verifique o dashboard do Supabase
- Erros do cliente: Verifique Console do navegador (F12)
- Erros do servidor: Verifique terminal onde roda `npm run dev`

---

Feito com 💪 para criar disciplina real.
