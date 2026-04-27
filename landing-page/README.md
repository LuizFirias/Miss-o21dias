# Landing Page — Sala do Tempo 21
## Rota: `/vendas`

---

## Arquivo
```
app/vendas/page.tsx
```

## Setup
```bash
# Framer Motion já está no projeto
# Copie o arquivo para seu projeto:
cp app/vendas/page.tsx SEU_PROJETO/app/vendas/page.tsx
```

## Conectar o botão de compra
Localize `scrollToCTA` e substitua pelo seu link de checkout:

```tsx
// Em VendasPage (root):
const scrollToCTA = () => {
  // Opção A: scroll interno (padrão)
  document.getElementById('comprar')?.scrollIntoView({ behavior: 'smooth' });

  // Opção B: redirecionar para checkout
  router.push('/checkout');

  // Opção C: link externo (Cakto, Hotmart, etc.)
  window.open('https://pay.cakto.com.br/SEU_LINK', '_blank');
};
```

---

## Seções da página (em ordem)

| Seção | Componente | Descrição |
|---|---|---|
| Header fixo | `StickyHeader` | Aparece ao rolar, CTA no canto |
| Hero | `HeroSection` | Headline + value props + 2 mockups de celular |
| Ticker | `TickerBar` | Faixa animada com keywords |
| Números | `SocialProofBar` | 4 stats de prova social |
| Problema | `ProblemSection` | 5 dores mapeadas |
| Solução | `SolutionSection` | 3 pilares (Corpo, Mente, Disciplina) |
| Como funciona | `HowItWorksSection` | 3 passos com mockups de celular |
| Missões | `MissionsSection` | Preview das 21 missões |
| Bônus | `BonusSection` | 4 bônus com dias de desbloqueio |
| Order bumps | `OrderBumpsSection` | Arsenal Avançado (3 upgrades) |
| Depoimentos | `TestimonialsSection` | 6 cards de depoimento |
| Progressão | `ProgressionSection` | Timeline Recruta → Elite |
| Garantia | `GuaranteeSection` | 7 dias de garantia |
| CTA final | `FinalCTASection` | Preço + botão + inclusões |
| FAQ | `FAQSection` | 7 perguntas expansíveis |
| Footer | `Footer` | Logo + copyright |

---

## Mockups de celular

3 telas embutidas como componentes React (não imagens):
- `HomeScreen` — tela home com missões e streak
- `MissionScreen` — tela de missão com 3 cards
- `CheckpointScreen` — modal de checkpoint dia 7

Para trocar as telas dos mockups, edite diretamente os componentes.

---

## Customizações rápidas

### Preço
```tsx
// FinalCTASection — linha ~480:
<div className="font-display" style={{ fontSize: '56px', color: '#FF3B3B' }}>
  R$ 47  {/* ← mude aqui */}
</div>
```

### Preços dos order bumps
```tsx
// OrderBumpsSection — array `bumps`:
{ titulo: 'MODO GUERRA', preco: 'R$ 27' },    // ← mude
{ titulo: 'CONTINUIDADE 30 DIAS', preco: 'R$ 37' },
{ titulo: 'DISPARO RÁPIDO', preco: 'R$ 17' },
```

### Depoimentos
```tsx
// TestimonialsSection — array `testimonials`:
{ nome: 'Lucas M.', texto: '...', nivel: 'ELITE' }
```

### Stats de prova social
```tsx
// SocialProofBar — array `stats`:
{ val: '2.400+', label: 'ALUNOS ATIVOS' }
```

---

## Performance

- Fonts carregadas via Google Fonts (pode trocar por `next/font`)
- Animações de scroll usam `useInView` com `once: true`
- Mockups de celular são SVG/JSX puro (zero imagens)
- Ticker em CSS puro (zero JS no loop)
