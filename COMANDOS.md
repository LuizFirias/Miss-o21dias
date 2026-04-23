# COMANDOS ÚTEIS - SALA DO TEMPO 21

## 📦 NPM

### Instalação
```bash
npm install                    # Instalar todas as dependências
npm install <pacote>          # Instalar pacote específico
npm install -g <pacote>       # Instalar globalmente
npm update                    # Atualizar pacotes
```

### Desenvolvimento
```bash
npm run dev                   # Iniciar servidor de desenvolvimento (porta 3000)
npm run build                 # Build de produção
npm start                     # Rodar build de produção
npm run lint                  # Verificar erros de código
```

### Limpeza
```bash
rm -rf node_modules           # Remover dependências (Mac/Linux)
rmdir /s node_modules         # Remover dependências (Windows)
rm -rf .next                  # Limpar cache do Next.js
npm cache clean --force       # Limpar cache do NPM
```

---

## 🗄️ Supabase CLI (Opcional)

### Instalação
```bash
npm install -g supabase
```

### Comandos
```bash
supabase login                # Login na conta
supabase init                 # Inicializar projeto local
supabase start                # Iniciar Supabase local
supabase db reset             # Resetar banco de dados local
supabase db push              # Aplicar migrações
supabase functions deploy     # Deploy de functions
```

---

## 🚀 Vercel CLI

### Instalação
```bash
npm install -g vercel
```

### Comandos
```bash
vercel login                  # Login
vercel                        # Deploy preview
vercel --prod                 # Deploy de produção
vercel env ls                 # Listar variáveis de ambiente
vercel env add <NAME>         # Adicionar variável
vercel env rm <NAME>          # Remover variável
vercel logs                   # Ver logs
vercel domains                # Gerenciar domínios
vercel rollback               # Voltar para deploy anterior
```

---

## 🔧 Git

### Inicialização
```bash
git init                      # Inicializar repositório
git add .                     # Adicionar todos os arquivos
git commit -m "mensagem"      # Commit
git branch -M main            # Renomear branch para main
git remote add origin <url>   # Adicionar remote
git push -u origin main       # Primeiro push
```

### Operações comuns
```bash
git status                    # Ver status
git add .                     # Adicionar arquivos
git commit -m "feat: nova funcionalidade"  # Commit
git push                      # Enviar para remote
git pull                      # Baixar atualizações
git log                       # Ver histórico
git diff                      # Ver diferenças
```

### Branches
```bash
git branch                    # Listar branches
git branch <nome>             # Criar branch
git checkout <nome>           # Mudar de branch
git checkout -b <nome>        # Criar e mudar
git merge <nome>              # Fazer merge
git branch -d <nome>          # Deletar branch
```

---

## 🐳 Docker (Supabase Local - Opcional)

### Supabase Local
```bash
supabase start                # Iniciar containers
supabase stop                 # Parar containers
supabase db reset             # Resetar banco
```

---

## 🧪 Testes e Debug

### Next.js
```bash
npm run dev                   # Modo desenvolvimento (com hot reload)
npm run build                 # Build e verificar erros
NODE_ENV=production npm start # Testar build de produção
```

### TypeScript
```bash
npx tsc --noEmit             # Verificar erros TypeScript
npx tsc --watch              # Modo watch
```

### ESLint
```bash
npm run lint                 # Verificar erros de lint
npm run lint -- --fix        # Corrigir automaticamente
```

---

## 📱 PWA

### Service Worker
```bash
# Registrar SW (adicionar em useEffect)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
}
```

### Testar PWA
```bash
npm run build
npm start
# Abrir Chrome DevTools > Application > Manifest
```

### Lighthouse
```bash
npm install -g lighthouse
lighthouse http://localhost:3000 --view
```

---

## 🔍 Debug

### Logs do Next.js
```bash
DEBUG=* npm run dev          # Logs detalhados
```

### Logs do Supabase
```javascript
// Habilitar logs no cliente
const supabase = createClient(url, key, {
  auth: {
    debug: true
  }
})
```

### Verificar variáveis de ambiente
```bash
# Windows
echo %NEXT_PUBLIC_SUPABASE_URL%

# Mac/Linux
echo $NEXT_PUBLIC_SUPABASE_URL

# Ou no código
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
```

---

## 🧹 Manutenção

### Limpar tudo e reinstalar
```bash
# Mac/Linux
rm -rf node_modules .next package-lock.json
npm install
npm run dev

# Windows
rmdir /s /q node_modules
rmdir /s /q .next
del package-lock.json
npm install
npm run dev
```

### Atualizar dependências
```bash
npm outdated                 # Ver pacotes desatualizados
npm update                   # Atualizar respeitando semver
npx npm-check-updates        # Ver todas as atualizações
npx npm-check-updates -u     # Atualizar package.json
npm install                  # Instalar novas versões
```

---

## 🔐 Segurança

### Verificar vulnerabilidades
```bash
npm audit                    # Ver vulnerabilidades
npm audit fix                # Corrigir automaticamente
npm audit fix --force        # Forçar correções (cuidado!)
```

### Verificar variáveis de ambiente
```bash
# Nunca commite .env.local!
git rm --cached .env.local   # Remover do git se adicionado
echo ".env.local" >> .gitignore  # Adicionar ao .gitignore
```

---

## 📊 Performance

### Analisar bundle
```bash
npm run build                # Build de produção
# Verifique o tamanho dos chunks no output
```

### Lighthouse
```bash
lighthouse http://localhost:3000 --view
# Ou use Chrome DevTools > Lighthouse
```

---

## 🚨 Troubleshooting

### Porta 3000 em uso
```bash
# Matar processo na porta 3000
# Mac/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Erros de cache
```bash
rm -rf .next
rm -rf node_modules/.cache
npm run dev
```

### Erros de TypeScript
```bash
rm -rf node_modules
rm package-lock.json
npm install
npx tsc --noEmit
```

---

## 🔄 Scripts personalizados (adicionar ao package.json)

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf .next node_modules",
    "fresh": "npm run clean && npm install",
    "analyze": "ANALYZE=true npm run build"
  }
}
```

---

## 📖 Recursos

### Documentação
```bash
# Next.js
open https://nextjs.org/docs

# Supabase
open https://supabase.com/docs

# Tailwind
open https://tailwindcss.com/docs

# TypeScript
open https://www.typescriptlang.org/docs
```

### Ferramentas úteis
```bash
# VS Code Extensions recomendadas
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
```

---

## ⚡ Atalhos VS Code

```
Ctrl/Cmd + P         # Buscar arquivo
Ctrl/Cmd + Shift + P # Command palette
Ctrl/Cmd + B         # Toggle sidebar
Ctrl/Cmd + J         # Toggle terminal
Ctrl/Cmd + /         # Comentar linha
Alt + Up/Down        # Mover linha
Shift + Alt + Up/Down # Duplicar linha
F2                   # Renomear símbolo
```

---

Feito com 💪
