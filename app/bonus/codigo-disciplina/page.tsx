"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import StepCard from "@/components/StepCard";

/* ─────────────────────────────────────────────────────────
   STEPS DATA
───────────────────────────────────────────────────────── */
const STEPS = [
  {
    step: 1,
    text: "Ninguém avisa quando você começa a ficar pra trás.\n\nIsso acontece em silêncio.",
  },
  {
    step: 2,
    text: "Você só percebe depois.\n\nQuando já perdeu o ritmo.",
  },
  {
    step: 3,
    text: "Esse código serve pra uma coisa só:\n\ncortar isso antes que vire padrão.",
  },
  {
    step: 4,
    tag: "EXECUÇÃO",
    text: "Tem dia que vai.\nTem dia que não vai.\n\nVocê faz mesmo assim.",
  },
  {
    step: 5,
    tag: "BÁSICO",
    text: "Não é sobre algo extraordinário.\n\nÉ não falhar no simples.",
  },
  {
    step: 6,
    tag: "REPETIÇÃO",
    text: "No começo parece inútil.\n\nDepois vira automático.",
  },
  {
    step: 7,
    tag: "CONFORTO",
    text: "O caminho fácil custa caro.\n\nSó não cobra na hora.",
  },
  {
    step: 8,
    tag: "CONSTÂNCIA",
    text: "Começar forte é fácil.\n\nContinuar é raro.",
  },
  {
    step: 9,
    tag: "MENTE",
    text: "Sua mente vai tentar te parar.\n\nSempre.",
  },
  {
    step: 10,
    tag: "INÍCIO",
    text: "O jeito que você começa o dia...\n\ndefine o resto dele.",
  },
  {
    step: 11,
    tag: "FALHA",
    text: "Falhar acontece.\n\nFicar parado depois disso é escolha.",
  },
  {
    step: 12,
    text: "Isso aqui não muda nada sozinho.\n\nO que você faz agora muda.",
  },
];

const TOTAL = STEPS.length;

/* ─────────────────────────────────────────────────────────
   PROGRESS BAR
───────────────────────────────────────────────────────── */
function ProgressBar({ current, total }: { current: number; total: number }) {
  const isComplete = current === total;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "0 24px",
        height: "100%",
      }}
    >
      {/* Segmented dots */}
      <div style={{ flex: 1, display: "flex", gap: "4px" }}>
        {Array.from({ length: total }).map((_, i) => {
          const filled = i < current;
          return (
            <motion.div
              key={i}
              style={{
                flex: 1,
                height: "2px",
                borderRadius: "2px",
                background: filled
                  ? isComplete
                    ? "#00C853"
                    : "#FF3B3B"
                  : "rgba(255,255,255,0.1)",
                transformOrigin: "left",
              }}
              animate={{
                scaleX: filled ? 1 : 1,
                opacity: filled ? 1 : 1,
              }}
              transition={{ duration: 0.3 }}
            />
          );
        })}
      </div>

      {/* Counter */}
      <span
        style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "10px",
          letterSpacing: "2px",
          color: "rgba(255,255,255,0.3)",
          flexShrink: 0,
          minWidth: "30px",
          textAlign: "right",
        }}
      >
        {current}/{total}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   HEADER
───────────────────────────────────────────────────────── */
function Header({ onClose }: { onClose: () => void }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        height: "100%",
      }}
    >
      <div>
        <span
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "8px",
            letterSpacing: "3px",
            color: "rgba(255,255,255,0.25)",
            textTransform: "uppercase",
            display: "block",
          }}
        >
          SALA DO TEMPO 21
        </span>
        <span
          style={{
            fontFamily: "'Bebas Neue', cursive",
            fontSize: "15px",
            letterSpacing: "2px",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          CÓDIGO DA DISCIPLINA MILITAR
        </span>
      </div>

      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "4px",
          padding: "6px 10px",
          cursor: "pointer",
          lineHeight: 1,
        }}
      >
        <span
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "9px",
            letterSpacing: "1px",
            color: "rgba(255,255,255,0.3)",
          }}
        >
          ✕
        </span>
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   CTA BUTTON
───────────────────────────────────────────────────────── */
function CtaButton({ isLast, onClick }: { isLast: boolean; onClick: () => void }) {
  return (
    <motion.div
      style={{ padding: "0 24px 36px" }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.2 }}
    >
      <motion.button
        onClick={onClick}
        whileTap={{ scale: 0.97 }}
        style={{
          width: "100%",
          background: isLast ? "transparent" : "#FF3B3B",
          border: isLast ? "1px solid #FF3B3B" : "none",
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
        {/* Shimmer on last step */}
        {isLast && (
          <motion.div
            animate={{ x: ["-100%", "200%"] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "linear", repeatDelay: 1 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "40%",
              height: "100%",
              background: "linear-gradient(90deg, transparent, rgba(255,59,59,0.15), transparent)",
              pointerEvents: "none",
            }}
          />
        )}

        <span
          style={{
            fontFamily: "'Bebas Neue', cursive",
            fontSize: "18px",
            letterSpacing: "5px",
            color: isLast ? "#FF3B3B" : "#FFFFFF",
          }}
        >
          {isLast ? "VOLTAR PARA BÔNUS" : "CONTINUAR"}
        </span>

        {!isLast && (
          <motion.span
            animate={{ x: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "14px",
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1,
            }}
          >
            →
          </motion.span>
        )}
      </motion.button>

      {/* Step hint */}
      {!isLast && (
        <p
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "8px",
            letterSpacing: "2px",
            color: "rgba(255,255,255,0.15)",
            textAlign: "center",
            marginTop: "10px",
            textTransform: "uppercase",
          }}
        >
          ou deslize para avançar
        </p>
      )}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   COMPLETION OVERLAY
───────────────────────────────────────────────────────── */
function CompletionFlash({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,200,83,0.06)",
            zIndex: 50,
            pointerEvents: "none",
          }}
        />
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────────────────
   SWIPE HOOK
───────────────────────────────────────────────────────── */
function useSwipe({ 
  onSwipeLeft, 
  onSwipeRight, 
  threshold = 50 
}: { 
  onSwipeLeft?: () => void; 
  onSwipeRight?: () => void; 
  threshold?: number;
}) {
  const touchStart = useRef<number | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStart.current === null) return;
      const delta = touchStart.current - e.changedTouches[0].clientX;
      if (Math.abs(delta) < threshold) return;
      if (delta > 0) onSwipeLeft?.();
      else onSwipeRight?.();
      touchStart.current = null;
    },
    [onSwipeLeft, onSwipeRight, threshold]
  );

  return { onTouchStart, onTouchEnd };
}

/* ─────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────── */
export default function CodigoDisciplinaPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [flash, setFlash] = useState(false);

  const currentStep = STEPS[currentIndex];
  const isLast = currentIndex === TOTAL - 1;

  /* ── Navigation ── */
  const goNext = useCallback(() => {
    if (isLast) {
      setFlash(true);
      setTimeout(() => {
        setFlash(false);
        router.push("/bonus");
      }, 300);
      return;
    }
    setDirection(1);
    setCurrentIndex((i) => Math.min(i + 1, TOTAL - 1));
  }, [isLast, router]);

  const goPrev = useCallback(() => {
    if (currentIndex === 0) return;
    setDirection(-1);
    setCurrentIndex((i) => Math.max(i - 1, 0));
  }, [currentIndex]);

  const handleClose = useCallback(() => {
    router.push("/bonus");
  }, [router]);

  /* ── Swipe ── */
  const swipeHandlers = useSwipe({
    onSwipeLeft: goNext,
    onSwipeRight: goPrev,
  });

  /* ── Keyboard ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, handleClose]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@400;500;600;700&family=Share+Tech+Mono&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; overflow: hidden; background: #0D0D0D; }
      `}</style>
      
      <CompletionFlash visible={flash} />

      {/* Root — full screen, fixed, no scroll */}
      <div
        {...swipeHandlers}
        style={{
          position: "fixed",
          inset: 0,
          background: "#0D0D0D",
          display: "flex",
          justifyContent: "center",
          alignItems: "stretch",
          overflow: "hidden",
        }}
      >
        {/* Content column — max 360px */}
        <div
          style={{
            width: "100%",
            maxWidth: "360px",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* ── HEADER (fixed height) ── */}
          <div style={{ height: "56px", flexShrink: 0 }}>
            <Header onClose={handleClose} />
          </div>

          {/* ── PROGRESS BAR (fixed height) ── */}
          <div style={{ height: "28px", flexShrink: 0 }}>
            <ProgressBar current={currentIndex + 1} total={TOTAL} />
          </div>

          {/* ── STEP CARD (flex: 1 — fills remaining space) ── */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <AnimatePresence initial={false} custom={direction}>
              <StepCard
                key={currentStep.step}
                data={currentStep}
                direction={direction}
              />
            </AnimatePresence>
          </div>

          {/* ── BOTTOM INDICATOR + CTA ── */}
          <div style={{ flexShrink: 0 }}>
            {/* Tap zone indicator */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "6px",
                paddingBottom: "20px",
              }}
            >
              {STEPS.map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    width: i === currentIndex ? "20px" : "5px",
                    background:
                      i === currentIndex
                        ? "#FF3B3B"
                        : i < currentIndex
                        ? "rgba(255,59,59,0.3)"
                        : "rgba(255,255,255,0.1)",
                  }}
                  transition={{ duration: 0.25 }}
                  style={{ height: "3px", borderRadius: "3px" }}
                />
              ))}
            </div>

            {/* CTA */}
            <CtaButton isLast={isLast} onClick={goNext} />
          </div>
        </div>
      </div>
    </>
  );
}
