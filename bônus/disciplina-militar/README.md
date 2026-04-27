# Código da Disciplina Militar
### Sala do Tempo 21 — Bônus Story Flow

Fluxo de leitura interativo em 12 telas, estilo story/onboarding.

---

## Arquivos entregues

```
app/
  bonus/
    codigo-disciplina/
      page.jsx          ← página principal (rota /bonus/codigo-disciplina)

components/
  bonus/
    StepCard.jsx        ← componente reutilizável de cada step
```

---

## Instalação

### 1. Dependência obrigatória

```bash
npm install framer-motion
# ou
yarn add framer-motion
```

### 2. Copie os arquivos para seu projeto

```bash
# Página
cp app/bonus/codigo-disciplina/page.jsx \
   SEU_PROJETO/app/bonus/codigo-disciplina/page.jsx

# Componente
cp components/bonus/StepCard.jsx \
   SEU_PROJETO/components/bonus/StepCard.jsx
```

### 3. Ajuste o redirect da última tela

Em `page.jsx`, localize a função `goNext` e troque a rota:

```js
// Linha ~130 — troque "/" pela rota real das suas missões
router.push("/missoes"); // ou "/home", "/dashboard", etc.
```

### 4. Acesse

```
http://localhost:3000/bonus/codigo-disciplina
```

---

## Arquitetura de componentes

```
CodigoDisciplinaPage           (page.jsx)
│
├── Fonts                      Injeção de Google Fonts via <style>
├── CompletionFlash            Overlay verde sutil na última transição
│
├── Header                     Título + botão fechar (router.back())
├── ProgressBar                Segmentos + contador X/12
│
├── StepCard                   (StepCard.jsx) — AnimatePresence + motion.div
│   ├── StepTag                Tag vermelha opcional (ex: EXECUÇÃO)
│   └── StepText               Parágrafos com fade staggered
│
├── [dot indicators]           Mini dots animados no rodapé
└── CtaButton                  CONTINUAR / VOLTAR PARA MISSÕES
```

---

## Hooks internos

| Hook / util | Onde | O que faz |
|---|---|---|
| `useState(currentIndex)` | page.jsx | Controla qual step está ativo |
| `useState(direction)` | page.jsx | Passa 1 ou -1 para AnimatePresence |
| `useSwipe()` | page.jsx | Touch events → goNext / goPrev |
| `useEffect(keyboard)` | page.jsx | ArrowRight/Space = avançar; ArrowLeft = voltar; Esc = fechar |

---

## Navegação

| Ação | Resultado |
|---|---|
| Botão CONTINUAR | Avança step |
| Swipe ← (esquerda) | Avança step |
| Swipe → (direita) | Volta step |
| Seta direita / espaço | Avança step |
| Seta esquerda | Volta step |
| Esc / botão ✕ | `router.back()` |
| Última tela → CONTINUAR | `router.push("/missoes")` + flash verde |

---

## Customização de conteúdo

Para trocar ou adicionar steps, edite o array `STEPS` em `page.jsx`:

```js
const STEPS = [
  {
    step: 1,
    // tag: "OPCIONAL",          ← remove ou adiciona a tag vermelha
    text: "Linha 1.\n\nLinha 2 em cinza.", // \n\n = parágrafo secundário (cinza)
  },
  // ...
];
```

> **Regra de cor do texto:**
> - Primeiro parágrafo (antes do `\n\n`) → branco, 26px, bold
> - Segundo parágrafo (após o `\n\n`) → cinza 45% opacidade, 20px, medium

---

## Paleta

| Token | Valor | Uso |
|---|---|---|
| Background | `#0D0D0D` | Fundo fixo |
| Red | `#FF3B3B` | Tags, botão, barra de progresso |
| Green | `#00C853` | Flash de conclusão |
| White | `#F5F5F5` | Texto principal |
| Gray | `rgba(255,255,255,0.45)` | Texto secundário |
| Dim | `rgba(255,255,255,0.1–0.25)` | Bordas, textos de apoio |

---

## Fontes (Google Fonts)

Carregadas via `<style>` inline para não depender de `next/font` com configuração:

```
Bebas Neue    → títulos (SALA DO TEMPO 21, botões)
Rajdhani      → texto dos steps (26px bold / 20px medium)
Share Tech Mono → tags, contadores, labels mono
```

Se preferir usar `next/font/google`, substitua a função `Fonts` e passe
as variáveis CSS para o layout raiz.
