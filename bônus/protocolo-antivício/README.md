# Protocolo Anti-Vício
### Sala do Tempo 21 — Bônus 3

Fluxo interativo de 12 telas com checklists de ação imediata.

---

## Arquivos

```
app/
  bonus/
    protocolo-anti-vicio/
      page.jsx              ← rota /bonus/protocolo-anti-vicio

components/
  bonus/
    ProtocoloScreen.jsx     ← componente reutilizável por tela
```

---

## Setup

```bash
# 1. Instalar Framer Motion (se ainda não tiver)
npm install framer-motion

# 2. Copiar arquivos
cp app/bonus/protocolo-anti-vicio/page.jsx \
   SEU_PROJETO/app/bonus/protocolo-anti-vicio/page.jsx

cp components/bonus/ProtocoloScreen.jsx \
   SEU_PROJETO/components/bonus/ProtocoloScreen.jsx

# 3. Ajustar redirect da última tela (page.jsx ~linha 155)
router.push("/missoes")   # troque pela sua rota
```

---

## Mapa das 12 telas

| Tela | ID    | Tipo       | Seção        |
|------|-------|------------|--------------|
| 01   | s01   | impact     | Realidade    |
| 02   | s02   | checklist  | Diagnóstico  |
| 03   | s03   | checklist  | Bloqueio     |
| 04   | s04   | checklist  | Ambiente     |
| 05   | s05   | impact     | Entendimento |
| 06   | s06   | checklist  | Substituição |
| 07   | s07   | checklist  | Regra 10min  |
| 08   | s08   | checklist  | Recaída      |
| 09   | s09   | checklist  | Redes sociais|
| 10   | s10   | impact     | Energia      |
| 11   | s11   | impact     | Regra final  |
| 12   | s12   | impact     | Fechamento   |

---

## Tipos de tela

### `type: "impact"` — Texto puro
```js
{
  id: "s01",
  type: "impact",
  tag: "REALIDADE",            // opcional — label vermelho no topo
  title: "TÍTULO\nEM CAPS",    // opcional — Bebas Neue grande
  lines: [
    { text: "Linha principal.",  size: "26px", weight: 700 },
    { text: "Linha secundária.", size: "22px", color: "rgba(255,255,255,0.45)" },
  ],
  highlight: "Texto em caixa vermelha sutil.", // opcional
  cta: "TEXTO DO BOTÃO",       // opcional — padrão: "CONTINUAR"
}
```

### `type: "checklist"` — Checklist interativo
```js
{
  id: "s02",
  type: "checklist",
  tag: "DIAGNÓSTICO",
  title: "TÍTULO",
  subtitle: "Subtítulo menor em cinza",
  items: [
    {
      id: "item_unico",          // ID único para o reducer
      text: "Texto do item",
      note: "NOTA MONO ABAIXO",  // opcional
      special: true,             // opcional — destaca em vermelho
    },
  ],
  note: "Nota de rodapé em itálico", // opcional
}
```

---

## Arquitetura

```
ProtocoloAntiVicioPage (page.jsx)
│
├── Fonts                  Google Fonts via <style>
├── ProgressHeader         Barra segmentada X/12 + botão ✕
├── SectionDots            Mini mapa das 6 seções do protocolo
│
├── ProtocoloScreen (ProtocoloScreen.jsx)
│   ├── ImpactContent      Telas de texto puro (type: "impact")
│   └── ChecklistContent   Checklists interativos (type: "checklist")
│       ├── StepTag        Label vermelho opcional
│       └── ChecklistItem  Checkbox animado com spring
│
├── ChecklistProgress      Pill com "X/Y ITENS" para telas checklist
└── CtaButton              CONTINUAR / VOLTAR PARA MISSÕES
```

---

## Estado

```js
// useReducer com dois tipos de ação:
dispatch({ type: "TOGGLE", id: "item_id" })  // marca/desmarca item
dispatch({ type: "RESET" })                   // limpa tudo

// IDs são globais — o mesmo item pode ser referenciado entre telas
// se quiser persistir, adicione localStorage (ver abaixo)
```

### Persistência opcional (localStorage)

```js
// Substitua o useReducer em page.jsx:
const saved = typeof window !== "undefined"
  ? JSON.parse(localStorage.getItem("protocolo_checked") || "{}")
  : {};
const [checked, dispatch] = useReducer(checkReducer, saved);

useEffect(() => {
  localStorage.setItem("protocolo_checked", JSON.stringify(checked));
}, [checked]);
```

---

## Navegação

| Ação | Resultado |
|---|---|
| Botão CONTINUAR | Avança tela |
| Swipe ← | Avança |
| Swipe → | Volta |
| `ArrowRight` / `Space` | Avança |
| `ArrowLeft` | Volta |
| `Escape` / ✕ | `router.back()` |
| Tela 12 → CONTINUAR | flash verde + `router.push("/")` |

---

## Paleta

| Token | Valor | Uso |
|---|---|---|
| Background | `#0D0D0D` | Fundo geral |
| Red | `#FF3B3B` | Tags, botão, barra, items especiais |
| Green | `#00C853` | Concluído, checklist 100%, flash final |
| White | `#F5F5F5` | Texto principal |
| Gray dim | `rgba(255,255,255,0.45)` | Texto secundário |
| Border | `rgba(255,255,255,0.06–0.12)` | Bordas sutis |
