# 📧 Sistema de Emails - Sala do Tempo

Este documento contém todos os templates de emails personalizados e instruções para configuração.

## 🎨 Templates de Email Disponíveis

### 1. Email de Boas-Vindas
**Quando:** Enviado automaticamente após a compra via webhook da Cakto  
**Função:** `sendWelcomeEmail(to, nome, senhaTemporaria)`

**Conteúdo:**
- Boas-vindas ao programa
- Credenciais de acesso (email + senha temporária)
- Link para fazer login
- Design com identidade visual da Sala do Tempo

---

### 2. Email de Recuperação de Senha
**Quando:** Enviado quando usuário solicita "Recuperar senha" na tela de login  
**Função:** `sendPasswordResetEmail(to, nome, resetLink)`

**Conteúdo:**
- Instruções para redefinir senha
- Link seguro de recuperação (expira em 24h)
- Aviso sobre segurança
- Design com identidade visual da Sala do Tempo

---

### 3. Email de Marco de 7 Dias
**Quando:** Enviado automaticamente quando usuário completa 7 dias consecutivos  
**Função:** `send7DayMilestoneEmail(to, nome)`

**Conteúdo:**
- Parabéns pelo marco de 7 dias
- Mensagem motivacional
- Citação inspiradora
- Link para continuar a jornada
- Design com identidade visual da Sala do Tempo

---

### 4. Email de Conclusão dos 21 Dias
**Quando:** Enviado automaticamente quando usuário completa os 21 dias  
**Função:** `sendCompletionEmail(to, nome)`

**Conteúdo:**
- Parabéns pela conclusão do desafio
- Resumo das conquistas
- Mensagem de transformação
- Link para ver progresso completo
- Design com troféu e identidade visual da Sala do Tempo

---

## 🎨 Elementos de Design dos Emails

Todos os emails seguem a identidade visual da Sala do Tempo:

### Cores:
- **Fundo Principal:** `#0a0a0a` (preto profundo)
- **Fundo Card:** `#1a1a1a` (cinza escuro)
- **Texto Principal:** `#f5f5f5` (branco)
- **Texto Secundário:** `#d1d1d1` (cinza claro)
- **Texto Dim:** `#888` (cinza médio)
- **Vermelho (Destaque):** `#ff3b3b`
- **Bordas:** `#222` e `#333`

### Tipografia:
- **Logo:** Bebas Neue, 36px, letter-spacing 4px
- **Headings:** Inter/System, 20-24px, semi-bold
- **Body:** Inter/System, 14px, line-height 1.6
- **Small:** 11-13px para notas e footer

### Elementos Visuais:
- Glow effect vermelho (opcional)
- Divider horizontal vermelho (32px × 2px)
- Cards com fundo escuro e bordas sutis
- Botões vermelhos com hover states
- Ícones e emojis para marcos

---

## 📄 Exemplos Visuais

### Email de Boas-Vindas
```
┌─────────────────────────────────────┐
│         SALA DO                     │
│         TEMPO                       │ (vermelho)
│   — 21 DIAS DE EXECUÇÃO —           │
│         ────                        │ (divider vermelho)
│                                     │
│  Olá, João!                         │
│                                     │
│  Você não entrou aqui por           │
│  motivação. Entrou por decisão.     │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ SUAS CREDENCIAIS DE ACESSO:   │ │
│  │ Email: joao@email.com         │ │
│  │ Senha: abc123def              │ │
│  └───────────────────────────────┘ │
│                                     │
│      [ENTRAR NA SALA] (botão)       │
│                                     │
└─────────────────────────────────────┘
```

### Email de 7 Dias
```
┌─────────────────────────────────────┐
│         SALA DO                     │
│         TEMPO                       │
│         ────                        │
│                                     │
│            7 DIAS                   │ (grande, vermelho)
│        Marco alcançado              │
│                                     │
│  Parabéns, João!                    │
│                                     │
│  Você completou 7 dias na Sala      │
│  do Tempo...                        │
│                                     │
│  ┃ "A diferença entre quem          │
│  ┃ sonha e quem realiza..."         │
│                                     │
│    [CONTINUAR JORNADA]              │
│                                     │
└─────────────────────────────────────┘
```

### Email de Conclusão (21 Dias)
```
┌─────────────────────────────────────┐
│         SALA DO                     │
│         TEMPO                       │
│         ────                        │
│                                     │
│            🏆                       │
│          21 DIAS                    │ (grande, vermelho)
│      Desafio Completo               │
│                                     │
│    PARABÉNS, JOÃO!                  │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ O QUE VOCÊ CONQUISTOU:        │ │
│  │ ✓ 21 dias de execução         │ │
│  │ ✓ Disciplina forjada          │ │
│  │ ✓ Controle do seu tempo       │ │
│  │ ✓ Prova de que é capaz        │ │
│  └───────────────────────────────┘ │
│                                     │
│     [VER MEU PROGRESSO]             │
│                                     │
└─────────────────────────────────────┘
```

---

## 🔧 Como os Emails São Acionados

### 1. Email de Boas-Vindas
- ✅ **Automático** via webhook da Cakto
- Acionado em: `pages/api/webhook-cakto.ts`
- Quando: Compra aprovada na plataforma

### 2. Email de Recuperação de Senha
- ⚠️ **Manual** (Supabase Auth nativo)
- Acionado em: `app/login/page.tsx` → função `handleRecuperarSenha()`
- Quando: Usuário clica em "Recuperar senha"
- **Nota:** Por padrão usa template do Supabase. Para usar nosso template customizado, precisamos configurar Supabase Auth Hooks.

### 3. Email de 7 Dias
- ⏳ **Precisa ser implementado**
- Sugestão: Criar uma Edge Function no Supabase ou Cron Job
- Quando: Usuário atinge 7 dias consecutivos (dia_atual >= 7)

### 4. Email de 21 Dias
- ⏳ **Precisa ser implementado**
- Sugestão: Criar uma Edge Function no Supabase ou Cron Job
- Quando: Usuário completa dia 21

---

## 🚀 Como Implementar Emails de Marco (7 e 21 dias)

### Opção 1: Edge Function no Supabase (Recomendado)

```typescript
// supabase/functions/check-milestones/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  // Buscar usuários que atingiram marcos hoje
  const { data: users } = await supabase
    .from('usuarios')
    .select('*')
    .or('dia_atual.eq.7,dia_atual.eq.21')

  // Enviar emails para cada usuário
  for (const user of users || []) {
    if (user.dia_atual === 7) {
      // Enviar email de 7 dias via Resend
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Sala do Tempo <noreply@seudominio.com>',
          to: user.email,
          subject: '🎯 7 Dias Completos',
          // ... template aqui
        }),
      })
    }
    
    if (user.dia_atual === 21) {
      // Enviar email de conclusão
      // Similar ao de 7 dias
    }
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
```

**Agendar com Cron:**
```sql
-- No Supabase Dashboard → Database → Cron Jobs
select cron.schedule(
  'check-milestones-daily',
  '0 12 * * *', -- Todos os dias ao meio-dia
  $$
  select net.http_post(
    url:='https://SEU_PROJETO.supabase.co/functions/v1/check-milestones',
    headers:='{"Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
  );
  $$
);
```

### Opção 2: Vercel Cron Jobs

```typescript
// pages/api/cron/check-milestones.ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verificar autorização
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Buscar usuários e enviar emails
  // ... código similar ao da Edge Function
}
```

**Configurar no vercel.json:**
```json
{
  "crons": [
    {
      "path": "/api/cron/check-milestones",
      "schedule": "0 12 * * *"
    }
  ]
}
```

---

## 📝 Notas Importantes

### Para Emails de Marco (7 e 21 dias):
1. Adicionar campo `milestone_7_sent` e `milestone_21_sent` na tabela `usuarios`
2. Evitar enviar email duplicado
3. Considerar timezone do usuário
4. Log de emails enviados

### Melhores Práticas:
- ✅ Sempre incluir versão texto (não apenas HTML)
- ✅ Testar em diferentes clientes de email (Gmail, Outlook, Apple Mail)
- ✅ Manter design simples e responsivo
- ✅ Incluir link de cancelamento de inscrição (se aplicável)
- ✅ Monitorar taxa de entrega e abertura no Resend Dashboard

### Personalização:
- Todos os templates podem ser editados em `lib/resend.ts`
- Modificar cores, textos e estrutura conforme necessário
- Adicionar novos templates seguindo o mesmo padrão
