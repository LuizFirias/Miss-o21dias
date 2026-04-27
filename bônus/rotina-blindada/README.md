# Rotina Blindada — Protocolo Diário de Alta Performance

Seção PWA interativa de checklist diário para o app **Sala do Tempo 21**.

---

## Stack
- Next.js 14+ (App Router)
- React (hooks: useState, useReducer)
- TailwindCSS (layout base)
- Google Fonts: Bebas Neue · Rajdhani · Share Tech Mono

---

## Estrutura de arquivos

```
app/
  rotina-blindada/
    page.jsx               ← rota /rotina-blindada

components/
  rotina/
    RotinaBlinada.jsx      ← componente principal (tudo aqui)
```

---

## Como usar

### 1. Copie os arquivos para o seu projeto Next.js

```bash
# Copie a página
cp app/rotina-blindada/page.jsx  SEU_PROJETO/app/rotina-blindada/page.jsx

# Copie o componente
cp components/rotina/RotinaBlinada.jsx  SEU_PROJETO/components/rotina/RotinaBlinada.jsx
```

### 2. Certifique-se que o TailwindCSS está configurado

O componente usa majoritariamente inline styles para controle preciso de cores
e animações. O TailwindCSS é necessário para o reset base e utilitários.

### 3. Acesse a rota

```
http://localhost:3000/rotina-blindada
```

---

## Telas (Screens)

| Screen       | Conteúdo                                      |
|--------------|-----------------------------------------------|
| `intro`      | Apresentação do protocolo + CTA de início     |
| `manha`      | 7 itens da rotina matinal                     |
| `dia`        | 5 itens para durante o dia                    |
| `noite`      | 6 itens noturnos + suporte (creatina etc.)    |
| `checklist`  | Resumo final com progresso total e reset      |

---

## Funcionalidades

- ✅ Checkboxes interativos com animação de "pop"
- ✅ Barra de progresso por seção (% em tempo real)
- ✅ Barra de progresso global (itens/total)
- ✅ Feedback visual verde ao completar item
- ✅ CTA muda para verde ao completar 100% de um bloco
- ✅ Tela final com resumo por seção
- ✅ Reset completo para o próximo dia
- ✅ Navegação forward/back entre telas
- ✅ Nav dots indicando posição e progresso
- ✅ Mobile-first (max-width 430px)

---

## Paleta de cores

| Token          | Hex         | Uso                        |
|----------------|-------------|----------------------------|
| Background     | `#0D0D0D`   | Fundo principal            |
| Red            | `#FF3B3B`   | CTAs, acentos, Manhã       |
| Green          | `#00C853`   | Concluído, 100%            |
| Yellow         | `#FFC857`   | Noite                      |
| Blue           | `#5B8CFF`   | Durante o Dia              |
| Text           | `#F5F5F5`   | Texto principal            |
| Text dim       | `rgba(255,255,255,0.4)` | Texto secundário |

---

## Customização de conteúdo

Para alterar itens, edite o objeto `SECTIONS` no topo de `RotinaBlinada.jsx`:

```js
const SECTIONS = {
  manha: {
    id: "manha",
    label: "MANHÃ",
    icon: "☀",
    accentColor: "#FF3B3B",
    items: [
      { id: "m1", text: "Levantar sem soneca", icon: "⚡" },
      // ... adicione ou remova itens aqui
    ],
  },
  // ...
};
```

---

## Persistência

O estado atual usa `useReducer` local (in-memory).  
Para persistir entre sessões, envolva o reducer com `localStorage`:

```js
// Após o useReducer, adicione:
useEffect(() => {
  localStorage.setItem("rotina_checked", JSON.stringify(checked));
}, [checked]);

// E no estado inicial:
const saved = typeof window !== "undefined"
  ? JSON.parse(localStorage.getItem("rotina_checked") || "{}")
  : {};
const [checked, dispatch] = useReducer(checklistReducer, saved);
```
