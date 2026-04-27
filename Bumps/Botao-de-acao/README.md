# Botão de Ação — Desbloqueio Imediato
### Sala do Tempo 21 — Ferramenta Premium

Ferramenta anti-inércia. 6 telas. 30–60 segundos. Zero leitura.

---

## Arquivos

```
app/
  ferramentas/
    botao-acao/
      page.jsx                ← rota /ferramentas/botao-acao

components/
  botao-acao/
    StepFlow.jsx              ← orquestra os 6 steps (sem back navigation)
    CountdownStep.jsx         ← contagem 5→1 com animação isolada
    LockedOverlay.jsx         ← gate premium (overlay absoluto)
```

---

## Setup

```bash
npm install framer-motion

cp -r app/ferramentas/botao-acao          SEU_PROJETO/app/ferramentas/botao-acao
cp -r components/botao-acao               SEU_PROJETO/components/botao-acao
```

---

## Fluxo dos 6 Steps

```
[trigger] → [countdown] → [physical] → [choice] → [execute] → [done]
  CTA btn    auto 5→0      CTA btn      input+btn   CTA btn    CTA → router
```

| Step       | ID          | Duração estimada | Auto-avança? |
|------------|-------------|------------------|--------------|
| Gatilho    | `trigger`   | 3–5s             | Não (CTA)    |
| Contagem   | `countdown` | 5s automático    | **Sim**      |
| Ação física| `physical`  | 3s               | Não (CTA)    |
| Escolha    | `choice`    | 5–10s            | Após input   |
| Execução   | `execute`   | 3s               | Não (CTA)    |
| Feito      | `done`      | livre            | Não (CTA)    |

---

## Lógica de Bloqueio (isUnlocked)

### Modo simulado (desenvolvimento)
```js
// Em page.jsx, linha ~50:
const SIMULATE_LOCKED = true;   // mostra overlay
const SIMULATE_LOCKED = false;  // fluxo liberado
```

### Modo produção — 3 opções

**Opção A — Prop do componente**
```jsx
// Em page.jsx, substituir useState por prop:
export default function BotaoAcaoPage({ isUnlocked }) { ... }

// No layout pai:
<BotaoAcaoPage isUnlocked={user.purchases.includes("botao-acao")} />
```

**Opção B — Context / auth store**
```js
// Exemplo com contexto customizado:
const { user } = useAuth();
const isUnlocked = user?.premium === true;
```

**Opção C — Server Component (App Router)**
```tsx
// page.tsx (server):
import { getUserPurchases } from "@/lib/db";
import BotaoAcaoClient from "./BotaoAcaoClient";

export default async function Page() {
  const purchases = await getUserPurchases();
  const isUnlocked = purchases.includes("botao-acao");
  return <BotaoAcaoClient isUnlocked={isUnlocked} />;
}
```

### Redirect após compra
```js
// Em page.jsx, função handleUnlock():
const handleUnlock = () => {
  router.push("/checkout/botao-acao");  // ← sua rota de pagamento
  // ou abra um modal de pagamento
};
```

---

## Redirect final (última tela)

```js
// Em page.jsx, função handleFinish():
router.push("/missoes");  // ← sua rota real
```

---

## Arquitetura de componentes

```
BotaoAcaoPage (page.jsx)
│
├── Fonts              Google Fonts injetado via <style>
├── Header             Wordmark + 6 dots de progresso + botão ✕
│
├── StepFlow           (StepFlow.jsx) — AnimatePresence linear
│   ├── StepTrigger    "Travou?" → CTA DESTRAVAR AGORA
│   ├── StepCountdown  → CountdownStep.jsx (auto 5→0 → goNext)
│   ├── StepPhysical   "Levanta agora." → CTA OK
│   ├── StepChoice     Input de tarefa + CTA ESCOLHER
│   ├── StepExecute    3 cards amarelos + CTA COMEÇAR
│   └── StepDone       Anel verde ✓ + CTA VOLTAR PARA MISSÕES
│
└── LockedOverlay      (LockedOverlay.jsx) — position:absolute, z-index:30
    Aparece quando isUnlocked === false
    Blurs o conteúdo abaixo (backdrop-filter)
```

---

## Propriedades dos componentes

### StepFlow
| Prop | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `onFinish` | `() => void` | ✓ | Chamado ao clicar "VOLTAR PARA MISSÕES" |
| `onStepChange` | `(i: number) => void` | — | Sincroniza dots do header |

### CountdownStep
| Prop | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `onComplete` | `() => void` | ✓ | Chamado 520ms após chegar em 0 |

### LockedOverlay
| Prop | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `onUnlock` | `() => void` | ✓ | CTA "DESBLOQUEAR AGORA" |

---

## Paleta

| Token | Valor | Uso |
|---|---|---|
| Background | `#0D0D0D` | Fundo fixo |
| Red | `#FF3B3B` | CTAs, tags, botões |
| Yellow | `#FFC857` | Step Execute |
| Green | `#00C853` | Step Done, desbloqueio |
| White | `#F5F5F5` | Texto principal |
| Dim | `rgba(255,255,255,0.35)` | Subtexto |
