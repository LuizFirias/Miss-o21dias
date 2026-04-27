# 🔐 CONFIGURAR AUTENTICAÇÃO COM SENHA NO SUPABASE

## ⚠️ IMPORTANTE: Configure antes de testar o login

Para que o login com email + senha funcione sem precisar de Magic Link toda vez, você precisa ajustar as configurações de autenticação no Supabase Dashboard.

---

## 📋 Passo a Passo

### 1. Acesse as configurações de autenticação

1. Vá para: https://supabase.com/dashboard
2. Selecione seu projeto **Sala do Tempo 21**
3. No menu lateral, clique em **Authentication** → **Settings**

---

### 2. Desabilitar confirmação obrigatória de email (OPCIONAL)

Se você quer que os usuários possam fazer login **imediatamente** após criar a conta (sem precisar clicar no email de confirmação):

1. Em **Authentication** → **Settings** → **Email Auth**
2. Role até **Email Confirmation**
3. **Desmarque** a opção **"Enable email confirmations"**
4. Clique em **Save**

**⚠️ Atenção**: Isso significa que qualquer email pode criar uma conta sem confirmação. Como você tem a barreira da senha de acesso `SALA21GUERRA`, isso é aceitável para este caso específico.

---

### 3. Configurar Email Templates (SE quiser manter confirmação)

Se você **mantiver** a confirmação de email habilitada:

1. Vá em **Authentication** → **Email Templates**
2. Configure os templates:
   - **Confirm signup**: Email enviado ao criar conta
   - **Magic Link**: Não usado mais (login agora é com senha)
   - **Change Email Address**: Email de confirmação ao mudar email
   - **Reset Password**: Email de recuperação de senha

---

### 4. Habilitar Email/Password como provider

Verifique se o provider está habilitado:

1. Vá em **Authentication** → **Providers**
2. Certifique-se que **Email** está **habilitado** (toggle verde)
3. Se não estiver, clique no toggle para habilitar
4. Clique em **Save**

---

### 5. Configurar Redirect URLs

Adicione as URLs de callback (já deve ter feito isso antes):

1. Vá em **Authentication** → **URL Configuration**
2. Em **Redirect URLs**, adicione:
   ```
   http://localhost:3000/auth/callback
   http://localhost:3001/auth/callback
   http://localhost:3002/auth/callback
   http://localhost:3000/
   https://seudominio.com/auth/callback
   https://seudominio.com/
   ```
3. Clique em **Save**

---

## 🔄 Novo Fluxo de Autenticação

### **Primeiro Acesso (Cadastro)**

1. Usuário acessa `/login`
2. Clica em **"Primeira vez? Criar conta"**
3. Preenche:
   - Email
   - Senha de acesso: `SALA21GUERRA`
   - Senha pessoal (mínimo 6 caracteres)
4. Clica em **"CRIAR CONTA"**
5. **COM confirmação de email**:
   - Recebe email de confirmação
   - Clica no link do email
   - É redirecionado para `/auth/callback`
   - Completa o onboarding
6. **SEM confirmação de email**:
   - É redirecionado automaticamente para `/onboarding`
   - Completa o onboarding

### **Acessos Seguintes (Login)**

1. Usuário acessa `/login`
2. Preenche:
   - Email
   - Senha de acesso: `SALA21GUERRA`
   - Senha pessoal (a que criou)
3. Clica em **"ENTRAR"**
4. **Entra direto** sem precisar de email! 🎉

---

## 🔒 Segurança

### Duas camadas de segurança:

1. **Senha de Acesso** (`SALA21GUERRA`): 
   - Apenas membros que compraram têm acesso
   - Validada no frontend antes de chamar o Supabase
   - Pode ser trocada via variável de ambiente

2. **Senha Pessoal** (definida pelo usuário):
   - Mínimo 6 caracteres
   - Armazenada com hash pelo Supabase Auth
   - Única para cada usuário
   - Recuperável via "Esqueci minha senha" (futuro)

---

## 🧪 Testar

### 1. Criar nova conta

```bash
npm run dev
```

1. Acesse http://localhost:3000/login
2. Clique em "Primeira vez? Criar conta"
3. Preencha:
   - Email: `seu@email.com`
   - Senha de acesso: `SALA21GUERRA`
   - Senha pessoal: `suasenha123`
4. Clique em "CRIAR CONTA"
5. Se habilitou confirmação, verifique o email
6. Complete o onboarding

### 2. Login em acessos seguintes

1. Feche o navegador (para simular sessão encerrada)
2. Acesse http://localhost:3000/login novamente
3. Preencha:
   - Email: `seu@email.com`
   - Senha de acesso: `SALA21GUERRA`
   - Senha pessoal: `suasenha123`
4. Clique em "ENTRAR"
5. **Deve entrar direto!** Sem precisar de email 🎉

---

## 🛠️ Comandos SQL Úteis

### Ver usuários cadastrados no Supabase Auth

```sql
-- Ver todos os usuários autenticados
SELECT 
  id,
  email,
  confirmed_at,
  created_at,
  last_sign_in_at
FROM auth.users
ORDER BY created_at DESC;
```

### Confirmar email manualmente (útil para testes)

```sql
-- Confirmar email de um usuário específico
UPDATE auth.users 
SET confirmed_at = NOW() 
WHERE email = 'seu@email.com';
```

### Resetar senha de um usuário

```sql
-- Gerar link de reset (enviar por email manualmente)
-- Execute no SQL Editor e copie o link gerado
SELECT 
  id,
  email,
  confirmation_token
FROM auth.users 
WHERE email = 'seu@email.com';
```

---

## ❓ Problemas Comuns

### "Email not confirmed"

- ✅ Verifique o email de confirmação
- ✅ Ou desabilite confirmação em Authentication → Settings
- ✅ Ou confirme manualmente via SQL (acima)

### "Invalid login credentials"

- ✅ Verifique se o email está correto
- ✅ Verifique se a senha pessoal está correta
- ✅ Verifique se a conta foi criada (veja no auth.users)

### "Senha de acesso incorreta"

- ✅ Use exatamente: `SALA21GUERRA` (maiúsculas)
- ✅ Sem espaços antes ou depois

### "User already registered"

- ✅ A conta já existe
- ✅ Clique em "Já tem conta? Fazer login"
- ✅ Use a senha pessoal que você criou antes

---

## 🎯 Resumo das Mudanças

### Antes (Magic Link toda vez):
1. Usuário digita email
2. Recebe Magic Link por email
3. Clica no link
4. Entra no app
5. **Precisa repetir isso TODA VEZ** ❌

### Agora (Senha persistente):
1. **Primeira vez**: Cria conta com email + senha pessoal
2. (Opcional) Confirma email se habilitado
3. **Próximas vezes**: Login direto com email + senha ✅
4. **Sem precisar de email!** 🎉

---

## 🚀 Próximos Passos (Futuro)

- [ ] Implementar "Esqueci minha senha"
- [ ] Implementar atualização de senha
- [ ] Implementar atualização de email
- [ ] Implementar login social (Google, etc.)
- [ ] Implementar 2FA (autenticação de dois fatores)

---

**Arquivo criado**: `CONFIGURAR_AUTH_SENHA.md`
