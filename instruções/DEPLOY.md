# GUIA DE DEPLOY - SALA DO TEMPO 21

## ✅ PRÉ-REQUISITOS

Antes de fazer o deploy, complete os seguintes passos:

### 1. Criar conta no Supabase
- Acesse: https://supabase.com
- Crie uma conta gratuita
- Crie um novo projeto

### 2. Configurar banco de dados
1. Acesse o projeto no Supabase
2. Vá em "SQL Editor"
3. Copie todo o conteúdo de `supabase/schema.sql`
4. Cole e execute no SQL Editor
5. Verifique se as tabelas foram criadas

### 3. Configurar autenticação
1. No Supabase, vá em "Authentication" > "Providers"
2. Habilite "Email" provider
3. Configure o Magic Link:
   - Enable "Confirm email" = OFF (para testes)
   - Enable "Secure email change" = ON
4. Em "Email Templates", personalize se desejar

### 4. Obter credenciais
1. No Supabase, vá em "Settings" > "API"
2. Copie:
   - `Project URL` (NEXT_PUBLIC_SUPABASE_URL)
   - `anon/public` key (NEXT_PUBLIC_SUPABASE_ANON_KEY)

---

## 🚀 DEPLOY NA VERCEL

### Opção 1: Via GitHub (Recomendado)

1. **Criar repositório no GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/seu-usuario/sala-do-tempo-21.git
git push -u origin main
```

2. **Deploy na Vercel**
- Acesse: https://vercel.com
- Faça login com GitHub
- Clique em "Add New" > "Project"
- Selecione o repositório
- Configure as variáveis de ambiente:
  - `NEXT_PUBLIC_SUPABASE_URL` = sua URL do Supabase
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = sua chave anon do Supabase
- Clique em "Deploy"

### Opção 2: Via Vercel CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Configurar variáveis de ambiente
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

# Deploy de produção
vercel --prod
```

---

## 🔧 CONFIGURAÇÕES PÓS-DEPLOY

### 1. Atualizar redirect URLs no Supabase
1. Vá em "Authentication" > "URL Configuration"
2. Adicione sua URL da Vercel em "Site URL":
   - `https://seu-app.vercel.app`
3. Adicione em "Redirect URLs":
   - `https://seu-app.vercel.app/onboarding`
   - `https://seu-app.vercel.app/home`

### 2. Testar o PWA
1. Acesse seu app no celular
2. Chrome: Menu > "Adicionar à tela inicial"
3. Safari: Compartilhar > "Adicionar à Tela de Início"

### 3. Configurar domínio customizado (Opcional)
1. Na Vercel, vá em "Settings" > "Domains"
2. Adicione seu domínio
3. Configure o DNS conforme instruções

---

## 📱 NOTIFICAÇÕES WEB PUSH

Para habilitar notificações:

1. **Gerar VAPID keys**
```bash
npm install -g web-push
web-push generate-vapid-keys
```

2. **Adicionar keys ao .env**
```
NEXT_PUBLIC_VAPID_PUBLIC_KEY=sua_public_key
VAPID_PRIVATE_KEY=sua_private_key
```

3. **Atualizar Vercel**
```bash
vercel env add NEXT_PUBLIC_VAPID_PUBLIC_KEY
vercel env add VAPID_PRIVATE_KEY
vercel --prod
```

---

## 🧪 TESTES LOCAIS

Antes de fazer deploy, teste localmente:

```bash
# Build de produção
npm run build

# Testar build
npm start

# Acessar em http://localhost:3000
```

---

## 📊 MONITORAMENTO

### Analytics (Opcional)

Adicionar Vercel Analytics:
```bash
npm install @vercel/analytics
```

Em `app/layout.tsx`:
```tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

---

## 🐛 TROUBLESHOOTING

### Erro: "Invalid API key"
- Verifique se as variáveis de ambiente estão corretas
- Verifique se copiou as keys corretas do Supabase

### Erro: "Authentication error"
- Verifique redirect URLs no Supabase
- Verifique se Magic Link está habilitado

### PWA não instala
- Verifique se está em HTTPS
- Verifique se os ícones existem
- Use Chrome DevTools > Application > Manifest

### Build falha
- Verifique erros de TypeScript: `npm run lint`
- Limpe cache: `rm -rf .next`
- Reinstale dependências: `rm -rf node_modules && npm install`

---

## 📞 SUPORTE

Se encontrar problemas:
1. Verifique os logs na Vercel
2. Verifique os logs no Supabase
3. Use Chrome DevTools > Console para erros no cliente
