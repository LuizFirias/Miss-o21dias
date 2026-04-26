"use client";

import { useState, useReducer, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import ProtocoloScreen from "@/components/ProtocoloScreen";
import type { ScreenData } from "@/components/ProtocoloScreen";

/* ─────────────────────────────────────────────────────────
   SCREENS DATA
───────────────────────────────────────────────────────── */
const SCREENS: ScreenData[] = [
  /* 01 — REALIDADE */
  {
    id: "s01",
    type: "impact",
    tag: "REALIDADE",
    title: "ISSO NÃO É FALTA DE\nDISCIPLINA",
    lines: [
      { text: "Isso não é falta de disciplina.", size: "26px", weight: 700 },
      { text: "É um sistema que você alimentou.", size: "22px", weight: 600, color: "rgba(255,255,255,0.5)" },
    ],
    highlight: "Você não vai cortar na força de vontade.\nVai cortar no ambiente e no acesso.",
    cta: "COMEÇAR",
  },

  /* 02 — DIAGNÓSTICO */
  {
    id: "s02",
    type: "checklist",
    tag: "DIAGNÓSTICO",
    title: "QUANDO VOCÊ\nMAIS CAI?",
    subtitle: "Marque os seus gatilhos",
    items: [
      { id: "d_quarto", text: "Sozinho no quarto", note: "AMBIENTE DE RISCO #1" },
      { id: "d_madrugada", text: "De madrugada", note: "HORÁRIO CRÍTICO" },
      { id: "d_tedio", text: "No tédio", note: "ESTÍMULO AUSENTE" },
      { id: "d_redes", text: "Após redes sociais", note: "GATILHO VISUAL" },
      { id: "d_stress", text: "Estressado ou ansioso", note: "ESCAPE EMOCIONAL" },
      { id: "d_celular", text: "Celular na cama à noite", note: "ACESSO FACILITADO" },
    ],
    note: "Isso fica salvo. São os seus gatilhos prioritários.",
  },

  /* 03 — BLOQUEIO IMEDIATO */
  {
    id: "s03",
    type: "checklist",
    tag: "BLOQUEIO",
    title: "CORTE O\nACESSO",
    subtitle: "Ação agora, não amanhã",
    items: [
      {
        id: "b_bloqueador",
        text: "Ativar bloqueador de sites (celular e navegador)",
        note: "Cold Turkey, BlockSite, Screen Time",
      },
      {
        id: "b_contas",
        text: "Remover contas e atalhos salvos",
        note: "LIMPAR HISTÓRICO E FAVORITOS",
      },
      {
        id: "b_perfis",
        text: "Parar de seguir perfis gatilho",
        note: "INSTAGRAM, TWITTER, REDDIT",
      },
      {
        id: "b_historico",
        text: "Desativar histórico automático",
        note: "CONFIGURAÇÕES DO NAVEGADOR",
      },
      {
        id: "b_apostas",
        text: "Bloquear CPF em sites de apostas",
        note: "bet.br ou SIGAP — gratuito e oficial",
        special: true,
      },
    ],
    note: "Se está fácil… você vai voltar.",
  },

  /* 04 — AMBIENTE */
  {
    id: "s04",
    type: "checklist",
    tag: "AMBIENTE",
    title: "MUDE O\nCENÁRIO",
    subtitle: "O ambiente vence a vontade — sempre",
    items: [
      { id: "a_sozinho", text: "Evitar ficar sozinho nos horários críticos" },
      { id: "a_cama", text: "Celular longe da cama à noite", note: "CARREGADOR FORA DO QUARTO" },
      { id: "a_escuro", text: "Dormir com ambiente escuro e limpo" },
      { id: "a_publico", text: "Usar o celular só em locais comuns" },
      { id: "a_rotina", text: "Ter uma rotina para os horários de risco" },
    ],
    note: "Você não vence no mesmo ambiente que te derruba.",
  },

  /* 05 — ENTENDIMENTO */
  {
    id: "s05",
    type: "impact",
    tag: "MENTE",
    title: "POR QUE VOCÊ\nNÃO CONSEGUE\nPARAR",
    lines: [
      {
        text: "Seu cérebro aprendeu que isso é prazer rápido.",
        size: "22px",
        weight: 700,
      },
      {
        text: "Agora ele pede. Sempre.",
        size: "20px",
        weight: 600,
        color: "rgba(255,255,255,0.45)",
      },
    ],
    highlight: "Dopamina não é prazer. É antecipação.\n\nQuanto mais você alimenta, mais ele pede.\nCom o tempo, precisa de mais pra sentir o mesmo.",
  },

  /* 06 — SUBSTITUIÇÃO */
  {
    id: "s06",
    type: "checklist",
    tag: "SUBSTITUIÇÃO",
    title: "TROCA\nOBRIGATÓRIA",
    subtitle: "Você não corta um hábito sem colocar outro no lugar",
    items: [
      { id: "sub_treino", text: "Treino físico (mínimo 20 min)", note: "MAIOR RELEASE DE DOPAMINA REAL" },
      { id: "sub_frio", text: "Banho gelado quando der vontade", note: "RESET IMEDIATO DO SISTEMA" },
      { id: "sub_caminhada", text: "Caminhada fora de casa" },
      { id: "sub_estudo", text: "Estudo ou leitura focada" },
      { id: "sub_conversa", text: "Conversar com alguém de verdade" },
      { id: "sub_projeto", text: "Trabalhar em um projeto próprio" },
    ],
    note: "Qual desses você vai fazer agora?",
  },

  /* 07 — REGRA DOS 10 MINUTOS */
  {
    id: "s07",
    type: "checklist",
    tag: "REGRA SIMPLES",
    title: "REGRA DOS\n10 MINUTOS",
    subtitle: "Deu vontade? Espera 10 minutos antes de qualquer coisa.",
    items: [
      { id: "r10_levantar", text: "Levantar do lugar imediatamente" },
      { id: "r10_ambiente", text: "Mudar de ambiente (sair do quarto)" },
      { id: "r10_fisico", text: "Fazer qualquer ação física" },
      { id: "r10_agua", text: "Beber água / molhar o rosto" },
    ],
    note: "A vontade não é constante. Ela passa.",
  },

  /* 08 — RECAÍDA */
  {
    id: "s08",
    type: "checklist",
    tag: "RECAÍDA",
    title: "VAI\nACONTECER",
    subtitle: "O erro não é cair. É transformar em sequência.",
    items: [
      { id: "rec_dia", text: "Não repetir no mesmo dia", note: "UMA RECAÍDA NÃO É DERROTA" },
      { id: "rec_volta", text: "Voltar com força no dia seguinte" },
      { id: "rec_culpa", text: "Não entrar em culpa paralisante" },
      { id: "rec_gatilho", text: "Identificar o que causou e bloquear" },
      { id: "rec_reset", text: "Tratar como dado, não como fracasso" },
    ],
    note: "Quem desiste depois de cair perde duas vezes.",
  },

  /* 09 — REDES SOCIAIS */
  {
    id: "s09",
    type: "checklist",
    tag: "GRANDE VILÃO",
    title: "O GATILHO\nVEM ANTES",
    subtitle: "Redes sociais alimentam o ciclo antes do vício",
    items: [
      { id: "rs_instagram", text: "Limitar Instagram / TikTok (1h/dia max)", note: "SCREEN TIME → CONFIGURAR LIMITE" },
      { id: "rs_conteudo", text: "Parar de consumir conteúdo sexualizado" },
      { id: "rs_scroll", text: "Evitar scroll infinito sem intenção" },
      { id: "rs_notif", text: "Desativar notificações de redes sociais" },
      { id: "rs_manha", text: "Não abrir celular na primeira hora do dia" },
    ],
    note: "O gatilho vem antes do vício.",
  },

  /* 10 — ENERGIA */
  {
    id: "s10",
    type: "impact",
    tag: "ENERGIA",
    title: "VOCÊ ESTÁ\nDESPERDIÇANDO\nPOTENCIAL",
    lines: [
      {
        text: "Quanto mais você cede…",
        size: "22px",
        weight: 700,
      },
      {
        text: "menos vontade você tem de fazer qualquer coisa.",
        size: "20px",
        weight: 600,
        color: "rgba(255,255,255,0.45)",
      },
    ],
    highlight: "Não é coincidência que dias de recaída são os dias de menor produtividade.\n\nA energia é a mesma. Você decide onde vai.",
  },

  /* 11 — REGRA FINAL */
  {
    id: "s11",
    type: "impact",
    tag: "REGRA FINAL",
    title: "NÃO É\nPRA SEMPRE",
    lines: [
      { text: "Não é pra sempre.", size: "28px", weight: 700 },
      {
        text: "É só hoje.",
        size: "26px",
        weight: 700,
        color: "#FF3B3B",
      },
      {
        text: "Amanhã você decide de novo.\nAgora você decide esse momento.",
        size: "18px",
        weight: 500,
        color: "rgba(255,255,255,0.4)",
      },
    ],
  },

  /* 12 — FECHAMENTO */
  {
    id: "s12",
    type: "impact",
    tag: null,
    title: null,
    lines: [
      {
        text: "Controle não volta sozinho.",
        size: "26px",
        weight: 700,
      },
      {
        text: "Ele volta quando você começa a cortar.",
        size: "22px",
        weight: 600,
        color: "rgba(255,255,255,0.45)",
      },
    ],
    highlight: "Bloquear acesso.\nMudar ambiente.\nSubstituir comportamento.\n\nIsso é o que funciona.",
    cta: "VOLTAR PARA BÔNUS",
  },
];

const TOTAL = SCREENS.length;

/* ─────────────────────────────────────────────────────────
   REDUCER
───────────────────────────────────────────────────────── */
type CheckedState = Record<string, boolean>;
type CheckAction = { type: 'TOGGLE'; id: string } | { type: 'RESET' };

function checkReducer(state: CheckedState, action: CheckAction): CheckedState {
  switch (action.type) {
    case "TOGGLE":
      return { ...state, [action.id]: !state[action.id] };
    case "RESET":
      return {};
    default:
      return state;
  }
}

/* ─────────────────────────────────────────────────────────
   PROGRESS HEADER
───────────────────────────────────────────────────────── */
function ProgressHeader({ current, total, onClose }: { current: number; total: number; onClose: () => void }) {
  const pct = (current / total) * 100;
  const isLast = current === total;

  return (
    <div style={{ padding: "0 20px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", gap: "8px" }}>
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <span
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "7px",
              letterSpacing: "3px",
              color: "rgba(255,255,255,0.2)",
              textTransform: "uppercase",
              display: "block",
            }}
          >
            SALA DO TEMPO 21
          </span>
          <span
            style={{
              fontFamily: "'Bebas Neue', cursive",
              fontSize: "13px",
              letterSpacing: "2px",
              color: "rgba(255,255,255,0.35)",
            }}
          >
            PROTOCOLO ANTI-VÍCIO
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "9px",
              letterSpacing: "2px",
              color: isLast ? "#00C853" : "rgba(255,255,255,0.3)",
            }}
          >
            {current}/{total}
          </span>
          <button
            onClick={onClose}
            aria-label="Sair para bônus"
            style={{
              background: "none",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "4px",
              padding: "5px 9px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "9px", letterSpacing: "2px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>SAIR</span>
            <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "9px", color: "rgba(255,255,255,0.3)" }}>✕</span>
          </button>
        </div>
      </div>

      {/* Segment bar */}
      <div style={{ display: "flex", gap: "3px" }}>
        {Array.from({ length: total }).map((_, i) => (
          <motion.div
            key={i}
            style={{ flex: 1, height: "2px", borderRadius: "2px" }}
            animate={{
              background:
                i < current
                  ? isLast
                    ? "#00C853"
                    : "#FF3B3B"
                  : "rgba(255,255,255,0.08)",
            }}
            transition={{ duration: 0.25 }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   SECTION MINI MAP (dots)
───────────────────────────────────────────────────────── */
function SectionDots({ current }: { current: number }) {
  const sections = [
    { label: "REAL", range: [0, 0] },
    { label: "DIAG", range: [1, 1] },
    { label: "BLOQ", range: [2, 3] },
    { label: "SUB", range: [4, 6] },
    { label: "RECAÍDA", range: [7, 8] },
    { label: "FIM", range: [9, 11] },
  ];

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "14px", padding: "8px 0" }}>
      {sections.map((s) => {
        const inRange = current >= s.range[0] && current <= s.range[1];
        const past = current > s.range[1];
        return (
          <div key={s.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
            <motion.div
              animate={{
                width: inRange ? "24px" : "6px",
                background: past ? "#00C853" : inRange ? "#FF3B3B" : "rgba(255,255,255,0.1)",
              }}
              style={{ height: "3px", borderRadius: "3px" }}
              transition={{ duration: 0.25 }}
            />
            {inRange && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "6px",
                  letterSpacing: "1px",
                  color: "#FF3B3B",
                  textTransform: "uppercase",
                }}
              >
                {s.label}
              </motion.span>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   CHECKLIST PROGRESS
───────────────────────────────────────────────────────── */
function ChecklistProgress({ screen, checked }: { screen: ScreenData; checked: CheckedState }) {
  if (screen.type !== "checklist" || !screen.items) return null;
  const done = screen.items.filter((i) => checked[i.id]).length;
  const total = screen.items.length;
  const pct = Math.round((done / total) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "6px 12px",
        background: pct === 100 ? "rgba(0,200,83,0.1)" : "rgba(255,255,255,0.04)",
        border: `1px solid ${pct === 100 ? "rgba(0,200,83,0.25)" : "rgba(255,255,255,0.08)"}`,
        borderRadius: "20px",
      }}
    >
      <span
        style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "9px",
          letterSpacing: "2px",
          color: pct === 100 ? "#00C853" : "rgba(255,255,255,0.4)",
          textTransform: "uppercase",
        }}
      >
        {pct === 100 ? "✓ COMPLETO" : `${done}/${total} ITENS`}
      </span>
      <div style={{ width: "48px", height: "2px", background: "rgba(255,255,255,0.08)", borderRadius: "2px", overflow: "hidden" }}>
        <motion.div
          animate={{ width: `${pct}%` }}
          style={{ height: "100%", background: pct === 100 ? "#00C853" : "#FF3B3B", borderRadius: "2px" }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   CTA BUTTON
───────────────────────────────────────────────────────── */
function CtaButton({ screen, isLast, onClick }: { screen: ScreenData; isLast: boolean; onClick: () => void }) {
  const label = screen.cta || (isLast ? "VOLTAR PARA BÔNUS" : "CONTINUAR");
  const isOutline = isLast && !screen.cta?.includes("COMEÇ");

  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      style={{
        width: "100%",
        background: isOutline ? "transparent" : "#FF3B3B",
        border: isOutline ? "1px solid #FF3B3B" : "none",
        borderRadius: "6px",
        padding: "16px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {isOutline && (
        <motion.div
          animate={{ x: ["-100%", "200%"] }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear", repeatDelay: 1 }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "35%",
            height: "100%",
            background: "linear-gradient(90deg, transparent, rgba(255,59,59,0.12), transparent)",
            pointerEvents: "none",
          }}
        />
      )}
      <span
        style={{
          fontFamily: "'Bebas Neue', cursive",
          fontSize: "19px",
          letterSpacing: "5px",
          color: isOutline ? "#FF3B3B" : "#fff",
        }}
      >
        {label}
      </span>
      {!isLast && (
        <motion.span
          animate={{ x: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", fontFamily: "'Share Tech Mono', monospace" }}
        >
          →
        </motion.span>
      )}
    </motion.button>
  );
}

/* ─────────────────────────────────────────────────────────
   SWIPE HOOK
───────────────────────────────────────────────────────── */
function useSwipe({ 
  onSwipeLeft, 
  onSwipeRight, 
  threshold = 48 
}: { 
  onSwipeLeft?: () => void; 
  onSwipeRight?: () => void; 
  threshold?: number;
}) {
  const startX = useRef<number | null>(null);
  
  const onTouchStart = useCallback((e: React.TouchEvent) => { 
    startX.current = e.touches[0].clientX; 
  }, []);
  
  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (startX.current === null) return;
    const delta = startX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) < threshold) return;
    delta > 0 ? onSwipeLeft?.() : onSwipeRight?.();
    startX.current = null;
  }, [onSwipeLeft, onSwipeRight, threshold]);
  
  return { onTouchStart, onTouchEnd };
}

/* ─────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────── */
export default function ProtocoloAntiVicioPage() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [checked, dispatch] = useReducer(checkReducer, {});
  const [flash, setFlash] = useState(false);

  const screen = SCREENS[index];
  const isLast = index === TOTAL - 1;

  /* ── Nav ── */
  const goNext = useCallback(() => {
    if (isLast) {
      setFlash(true);
      setTimeout(() => { 
        setFlash(false); 
        router.push("/bonus"); 
      }, 320);
      return;
    }
    setDirection(1);
    setIndex((i) => Math.min(i + 1, TOTAL - 1));
  }, [isLast, router]);

  const goPrev = useCallback(() => {
    if (index === 0) return;
    setDirection(-1);
    setIndex((i) => Math.max(i - 1, 0));
  }, [index]);

  const handleClose = useCallback(() => router.push("/bonus"), [router]);
  const handleToggle = useCallback((id: string) => dispatch({ type: "TOGGLE", id }), []);

  /* ── Keyboard ── */
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [goNext, goPrev, handleClose]);

  /* ── Swipe ── */
  const swipe = useSwipe({ onSwipeLeft: goNext, onSwipeRight: goPrev });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@400;500;600;700&family=Share+Tech+Mono&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; overflow: hidden; background: #0D0D0D; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px; }
      `}</style>

      {/* Completion flash */}
      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,200,83,0.07)", zIndex: 50, pointerEvents: "none" }}
          />
        )}
      </AnimatePresence>

      {/* Root */}
      <div
        {...swipe}
        style={{
          position: "fixed",
          inset: 0,
          background: "#0D0D0D",
          display: "flex",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* Ambient glow */}
        <div
          style={{
            position: "absolute",
            top: "-60px",
            right: "-60px",
            width: "240px",
            height: "240px",
            background: "radial-gradient(circle, rgba(255,59,59,0.05) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Content column */}
        <div
          style={{
            width: "100%",
            maxWidth: "390px",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* ── HEADER (fixed) ── */}
          <div style={{ height: "64px", flexShrink: 0 }}>
            <ProgressHeader current={index + 1} total={TOTAL} onClose={handleClose} />
          </div>

          {/* ── SECTION MINI DOTS ── */}
          <div style={{ flexShrink: 0 }}>
            <SectionDots current={index} />
          </div>

          {/* ── SCREEN CONTENT (flex: 1) ── */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
            <ProtocoloScreen
              screen={screen}
              screenKey={screen.id}
              direction={direction}
              checked={checked}
              onToggle={handleToggle}
            />
          </div>

          {/* ── BOTTOM ZONE ── */}
          <div style={{ flexShrink: 0, padding: "12px 24px 32px" }}>
            {/* Checklist progress pill */}
            {screen.type === "checklist" && (
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "14px" }}>
                <ChecklistProgress screen={screen} checked={checked} />
              </div>
            )}

            {/* CTA */}
            <CtaButton screen={screen} isLast={isLast} onClick={goNext} />

            {/* Back + swipe hint */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
              {index > 0 ? (
                <button
                  onClick={goPrev}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "8px", letterSpacing: "2px", color: "rgba(255,255,255,0.2)" }}>
                    ← VOLTAR
                  </span>
                </button>
              ) : <div />}
              {!isLast && (
                <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "8px", letterSpacing: "1.5px", color: "rgba(255,255,255,0.12)" }}>
                  ou deslize
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
