"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import StepFlow from "@/components/botao-acao/StepFlow";
import LockedOverlay from "@/components/botao-acao/LockedOverlay";

/* ─────────────────────────────────────────────
   FONTS
───────────────────────────────────────────── */
function Fonts() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@400;500;600;700&family=Share+Tech+Mono&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html, body { height: 100%; overflow: hidden; background: #0D0D0D; -webkit-tap-highlight-color: transparent; }
      button { -webkit-appearance: none; appearance: none; }
      input::placeholder { color: rgba(255,255,255,0.2); }
      input:focus { border-color: rgba(255,59,59,0.6) !important; }
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      .page-in { animation: fadeIn 0.3s ease forwards; }
    `}</style>
  );
}

/* ─────────────────────────────────────────────
   STEP IDS (must match StepFlow)
───────────────────────────────────────────── */
const STEPS = [
  { id: "trigger",   label: "INÍCIO" },
  { id: "countdown", label: "CONTAGEM" },
  { id: "physical",  label: "CORPO" },
  { id: "choice",    label: "FOCO" },
  { id: "execute",   label: "AÇÃO" },
  { id: "done",      label: "FIM" },
];

/* ─────────────────────────────────────────────
   STEP PROGRESS DOTS
───────────────────────────────────────────── */
function StepDots({ current, total }) {
  return (
    <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            width: i === current ? "20px" : "5px",
            background:
              i < current
                ? "#00C853"
                : i === current
                ? "#FF3B3B"
                : "rgba(255,255,255,0.1)",
          }}
          transition={{ duration: 0.2 }}
          style={{ height: "3px", borderRadius: "3px" }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   HEADER
───────────────────────────────────────────── */
function Header({ stepIndex, onClose }) {
  const total = STEPS.length;
  const label = STEPS[stepIndex]?.label ?? "";
  const isFirst = stepIndex === 0;
  const isDone = stepIndex === total - 1;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        height: "100%",
      }}
    >
      {/* Left: wordmark */}
      <div>
        <span
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "7px",
            letterSpacing: "3px",
            color: "rgba(255,255,255,0.2)",
            display: "block",
            textTransform: "uppercase",
          }}
        >
          SALA DO TEMPO 21
        </span>
        <span
          style={{
            fontFamily: "'Bebas Neue', cursive",
            fontSize: "13px",
            letterSpacing: "2px",
            color: isDone ? "#00C853" : "rgba(255,255,255,0.35)",
          }}
        >
          {isDone ? "CONCLUÍDO" : "BOTÃO DE AÇÃO"}
        </span>
      </div>

      {/* Center: dots */}
      <StepDots current={stepIndex} total={total} />

      {/* Right: close */}
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "4px",
          padding: "5px 9px",
          cursor: "pointer",
        }}
      >
        <span
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "9px",
            color: "rgba(255,255,255,0.3)",
          }}
        >
          ✕
        </span>
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PAGE
   Props (normally supplied by the parent or
   a context hook):
     isUnlocked  – boolean  controls gate
     onPurchase  – () => void  triggers payment flow
                   (simulated here with local state)
───────────────────────────────────────────── */

/*
  ┌─────────────────────────────────────────────┐
  │  INTEGRATION NOTE                           │
  │  In production, pass `isUnlocked` from:     │
  │  - a context / global auth store            │
  │  - a server component prop                  │
  │  - a database flag (user.hasPremium)        │
  │                                             │
  │  For testing: set SIMULATE_LOCKED = true    │
  └─────────────────────────────────────────────┘
*/
const SIMULATE_LOCKED = false; // ← change to true to test gate

export default function BotaoAcaoPage() {
  const router = useRouter();

  /*
    isUnlocked:
    In production → replace with real auth/purchase check:
      const { user } = useAuth();
      const isUnlocked = user?.purchases?.includes("botao-acao");
  */
  const [isUnlocked, setIsUnlocked] = useState(!SIMULATE_LOCKED);

  /* Tracks which step the StepFlow is on (lifted for header) */
  const [stepIndex, setStepIndex] = useState(0);

  /* StepFlow calls this when it advances; we mirror the index here */
  /* We use a key trick: StepFlow is self-contained, so we listen
     to DOM events or pass a callback chain. Here we pass onStepChange. */
  const handleStepChange = useCallback((idx) => setStepIndex(idx), []);

  const handleClose = useCallback(() => router.back(), [router]);

  const handleFinish = useCallback(() => {
    router.push("/"); // ← swap for your missions route
  }, [router]);

  /* Simulate purchase unlock */
  const handleUnlock = useCallback(() => {
    /*
      In production, replace with:
        router.push("/checkout/botao-acao");
      or open a payment modal.
    */
    setIsUnlocked(true);
  }, []);

  return (
    <>
      <Fonts />

      <div
        className="page-in"
        style={{
          position: "fixed",
          inset: 0,
          background: "#0D0D0D",
          display: "flex",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* Ambient glow — red top-right */}
        <motion.div
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "260px",
            height: "260px",
            background:
              "radial-gradient(circle, rgba(255,59,59,0.07) 0%, transparent 70%)",
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
          {/* ── HEADER ── */}
          <div style={{ height: "60px", flexShrink: 0 }}>
            <Header stepIndex={stepIndex} onClose={handleClose} />
          </div>

          {/* ── THIN SEPARATOR ── */}
          <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", flexShrink: 0 }} />

          {/* ── STEP FLOW (flex: 1) ── */}
          <StepFlow
            onFinish={handleFinish}
            onStepChange={handleStepChange}
          />

          {/* ── LOCKED OVERLAY (absolute, above everything) ── */}
          <AnimatePresence>
            {!isUnlocked && (
              <LockedOverlay onUnlock={handleUnlock} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
