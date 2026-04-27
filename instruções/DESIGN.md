# DESIGN DAS TELAS - SALA DO TEMPO 21

## 🎨 Cores

```
Preto:    #0D0D0D  ███████  (Fundo principal)
Vermelho: #FF3B3B  ███████  (Ações, perigo, títulos)
Verde:    #00C853  ███████  (Sucesso, conclusão)
Amarelo:  #FFC857  ███████  (Destaques, checkpoints)
Cinza:    #1F1F1F  ███████  (Cards, inputs)
```

---

## 📱 TELA 1: LOGIN

```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│       SALA DO TEMPO 21             │
│                                     │
│   Você não entra aqui por          │
│   motivação. Entra por decisão.    │
│                                     │
│   ┌─────────────────────────┐      │
│   │ seu-email@email.com     │      │
│   └─────────────────────────┘      │
│                                     │
│   ┌─────────────────────────┐      │
│   │       ENTRAR           │      │
│   └─────────────────────────┘      │
│                                     │
└─────────────────────────────────────┘
```

**Elementos:**
- Título vermelho (#FF3B3B)
- Subtítulo cinza claro
- Input com fundo #1F1F1F
- Botão vermelho com hover
- Background preto (#0D0D0D)

---

## 📱 TELA 2: ONBOARDING (Etapa 1/4 - Nome)

```
┌─────────────────────────────────────┐
│ [█ ░ ░ ░]                          │ ← Indicador de progresso
│                                     │
│   Como você quer ser chamado       │
│   aqui dentro?                     │
│                                     │
│   ┌─────────────────────────┐      │
│   │ Seu nome                │      │
│   └─────────────────────────┘      │
│                                     │
│   ┌─────────────────────────┐      │
│   │     CONTINUAR          │      │
│   └─────────────────────────┘      │
│                                     │
└─────────────────────────────────────┘
```

---

## 📱 TELA 3: ONBOARDING (Etapa 2/4 - Nível)

```
┌─────────────────────────────────────┐
│ [█ █ ░ ░]                          │
│                                     │
│   Seja honesto.                    │
│   Onde você está hoje?             │
│                                     │
│   ┌─────────────────────────┐      │
│   │     INICIANTE          │      │
│   └─────────────────────────┘      │
│                                     │
│   ┌─────────────────────────┐      │
│   │   INTERMEDIÁRIO        │      │
│   └─────────────────────────┘      │
│                                     │
│   ┌─────────────────────────┐      │
│   │     AVANÇADO           │      │
│   └─────────────────────────┘      │
│                                     │
└─────────────────────────────────────┘
```

---

## 📱 TELA 4: ONBOARDING (Etapa 4/4 - Modo)

```
┌─────────────────────────────────────┐
│ [█ █ █ █]                          │
│                                     │
│   Você quer ir até onde?           │
│                                     │
│   ┌─────────────────────────┐      │
│   │   MODO NORMAL          │      │
│   │ Disciplina e evolução  │      │
│   │    consistente         │      │
│   └─────────────────────────┘      │ ← Amarelo se selecionado
│                                     │
│   ┌─────────────────────────┐      │
│   │   MODO GUERRA          │      │
│   │ Pressão máxima.        │      │
│   │    Sem piedade.        │      │
│   └─────────────────────────┘      │ ← Vermelho se selecionado
│                                     │
│   ┌─────────────────────────┐      │
│   │   COMEÇAR AGORA        │      │
│   └─────────────────────────┘      │ ← Verde
│                                     │
└─────────────────────────────────────┘
```

---

## 📱 TELA 5: HOME

```
┌─────────────────────────────────────┐
│ SALA DO TEMPO 21        João       │
│                         Soldado    │
│                                     │
│ ┌──────────┐  ┌──────────┐        │
│ │ DIA      │  │ STREAK   │        │
│ │  05/21   │  │    3     │        │
│ └──────────┘  └──────────┘        │
│                                     │
│ PROGRESSO            [████░░] 24%  │
│                                     │
│ ┌─────────────────────────────┐    │
│ │     DIA 05                  │    │
│ │  VELOCIDADE DO SONIC        │    │
│ │                             │    │
│ │ Você vai executar ou vai    │    │
│ │ falhar hoje?                │    │
│ │                             │    │
│ │ ┌───────────────────────┐   │    │
│ │ │  INICIAR MISSÃO      │   │    │
│ │ └───────────────────────┘   │    │
│ └─────────────────────────────┘    │
│                                     │
│           Sair                      │
└─────────────────────────────────────┘
```

**Elementos:**
- Header: Título + Nome/Nível
- 2 Cards lado a lado (Dia e Streak)
- Barra de progresso animada
- Card principal com missão do dia
- Botão vermelho "INICIAR MISSÃO"

---

## 📱 TELA 6: MISSÃO

```
┌─────────────────────────────────────┐
│ ← Voltar              DIA 05/21    │
│                                     │
│ VELOCIDADE DO SONIC                │
│ Nível: INTERMEDIÁRIO               │
│                                     │
│ ┌─────────────────────────────┐    │
│ │ CORPO                       │    │ ← Borda vermelha
│ │                             │    │
│ │ Flexões           35        │    │
│ │ Corrida no lugar  120       │    │
│ │ Mountain climbers 30        │    │
│ │                             │    │
│ │ [CONCLUÍDO]  [FALHEI]      │    │
│ └─────────────────────────────┘    │
│                                     │
│ ┌─────────────────────────────┐    │
│ │ MENTE                       │    │ ← Borda amarela
│ │                             │    │
│ │ Meditar ou respirar fundo   │    │
│ │ por 5 minutos               │    │
│ │                             │    │
│ │ [CONCLUÍDO]  [FALHEI]      │    │
│ └─────────────────────────────┘    │
│                                     │
│ ┌─────────────────────────────┐    │
│ │ DISCIPLINA                  │    │ ← Borda verde
│ │                             │    │
│ │ Dormir antes das 23h        │    │
│ │                             │    │
│ │ [CONCLUÍDO]  [FALHEI]      │    │
│ └─────────────────────────────┘    │
│                                     │
│ ┌─────────────────────────────┐    │
│ │     FINALIZAR DIA          │    │ ← Verde
│ └─────────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘
```

**Elementos:**
- 3 cards de missão com bordas coloridas
- Botões de ação em cada card
- Botão principal "FINALIZAR DIA"
- Estados: normal, concluído (verde), falhou (vermelho)

---

## 📱 TELA 7: CHECKPOINT (Dia 7)

```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│              🔥                     │
│                                     │
│       CHECKPOINT - DIA 7           │
│                                     │
│    A maioria já desistiu.          │
│         Você não.                  │
│                                     │
│                                     │
│   ┌─────────────────────────┐      │
│   │     CONTINUAR          │      │
│   └─────────────────────────┘      │
│                                     │
│                                     │
└─────────────────────────────────────┘
```

**Elementos:**
- Fullscreen overlay
- Emoji grande (🔥)
- Título amarelo
- Mensagem motivacional
- Botão vermelho "CONTINUAR"

---

## 📱 TELA 8: CONCLUSÃO (Dia 21)

```
┌─────────────────────────────────────┐
│                                     │
│              🏆                     │
│                                     │
│       MISSÃO COMPLETA              │
│                                     │
│   Você completou os 21 dias.       │
│     Agora você é Elite.            │
│                                     │
│ ┌─────────────────────────────┐    │
│ │ DIAS COMPLETOS  │ STREAK    │    │
│ │      21         │    18     │    │
│ └─────────────────────────────┘    │
│                                     │
│ A maioria desiste. Você não        │
│ desistiu. Agora carregue isso      │
│ para o resto da vida.              │
│                                     │
│   ┌─────────────────────────┐      │
│   │  VOLTAR AO INÍCIO      │      │
│   └─────────────────────────┘      │
│                                     │
└─────────────────────────────────────┘
```

---

## 📱 TELA 9: MODAL DE CONFIRMAÇÃO

```
        ┌─────────────────────┐
        │                     │
        │ VOCÊ VOLTOU ATRÁS   │
        │                     │
        │ Falhar significa    │
        │ reset de streak.    │
        │ Tem certeza?        │
        │                     │
        │ [CANCELAR] [CONFIRMAR] │
        │                     │
        └─────────────────────┘
```

**Variações:**
- Sucesso: "VOCÊ FEZ O QUE POUCOS FAZEM"
- Falha: "VOCÊ VOLTOU ATRÁS"
- Sair: "É ISSO? JÁ VAI DESISTIR?"

---

## 🎯 Hierarquia Visual

### Prioridade 1 (Maior destaque)
- Botões de ação principais
- Números de dia e streak
- Títulos de missões

### Prioridade 2 (Médio destaque)
- Cards de missão
- Barra de progresso
- Nível do usuário

### Prioridade 3 (Menor destaque)
- Textos de apoio
- Labels
- Botão "Sair"

---

## 📐 Espaçamento

```
Padding dos cards: 24px (p-6)
Gap entre elementos: 16px (gap-4)
Margem bottom: 24px (mb-6)
Border radius: 8px (rounded-lg)
Border width: 2px (border-2)
```

---

## 🎨 Estados dos Componentes

### Botão Normal
```
Background: #1F1F1F
Texto: #FFFFFF
Hover: Cor da categoria (vermelho/verde/amarelo)
Active: scale(0.98)
```

### Botão Primário
```
Background: #FF3B3B (vermelho)
Texto: #FFFFFF
Hover: #E63030
Active: scale(0.98)
```

### Botão Sucesso
```
Background: #00C853 (verde)
Texto: #FFFFFF
Hover: #00A844
Active: scale(0.98)
```

### Input
```
Background: #1F1F1F
Border: #2A2A2A
Focus: Border vermelho (#FF3B3B)
Texto: #FFFFFF
Placeholder: #666666
```

---

## 💫 Animações

### Transições
```css
transition: all 0.2s ease-in-out
```

### Barra de Progresso
```css
transition: width 0.5s ease-in-out
```

### Loading Spinner
```css
animation: spin 1s linear infinite
```

### Botões
```css
hover: transform scale(1.02)
active: transform scale(0.98)
```

---

## 📱 Responsividade

### Mobile First
```
Container: max-w-2xl
Padding: px-4
Cards: flex-col em mobile, flex-row em desktop
Font sizes: text-sm → text-base → text-lg
```

### Breakpoints (Tailwind)
```
sm: 640px   (tablets)
md: 768px   (tablets landscape)
lg: 1024px  (desktop)
xl: 1280px  (desktop large)
```

---

## 🎭 Tipografia

### Títulos
```
h1: text-3xl font-bold (Login, Checkpoint)
h2: text-2xl font-bold (Onboarding, Home)
h3: text-xl font-bold (Cards de missão)
```

### Corpo
```
Normal: text-base
Pequeno: text-sm
Extra pequeno: text-xs
```

### Peso
```
Normal: font-normal
Negrito: font-bold
```

---

Feito com 🎨
