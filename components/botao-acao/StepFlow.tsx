"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CountdownStep from "./CountdownStep";

/* ─────────────────────────────────────────────
   STEP IDS (no back navigation — linear only)
───────────────────────────────────────────── */
const STEP_IDS = ["trigger", "countdown", "physical", "choice", "execute", "done"];

/* ─────────────────────────────────────────────
   MOTION VARIANTS — fast upward reveal
───────────────────────────────────────────── */
const stepVariants = {
  enter:  { y: 24,  opacity: 0, filter: "blur(3px)" },
  center: { y: 0,   opacity: 1, filter: "blur(0px)" },
  exit:   { y: -24, opacity: 0, filter: "blur(3px)" },
};
const stepTransition = { duration: 0.22, ease: [0.32, 0.72, 0, 1] as const };

/* ─────────────────────────────────────────────
   SHARED ATOMS
───────────────────────────────────────────── */
interface TagProps {
  children: React.ReactNode;
  color?: string;
}

function Tag({ children, color = "#FF3B3B" }: TagProps) {
  return (
    <motion.span
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      style={{
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: "9px",
        letterSpacing: "4px",
        color,
        textTransform: "uppercase",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "20px",
      }}
    >
      <span style={{ display: "inline-block", width: "16px", height: "1px", background: color }} />
      {children}
    </motion.span>
  );
}

interface BigTextProps {
  children: React.ReactNode;
  color?: string;
  size?: string;
  delay?: number;
}

function BigText({ children, color = "#F5F5F5", size = "56px", delay = 0.1 }: BigTextProps) {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      style={{
        fontFamily: "'Bebas Neue', cursive",
        fontSize: size,
        letterSpacing: "3px",
        color,
        lineHeight: 1,
        textAlign: "center",
        whiteSpace: "pre-line",
      }}
    >
      {children}
    </motion.h1>
  );
}

interface SubTextProps {
  children: React.ReactNode;
  delay?: number;
}

function SubText({ children, delay = 0.18 }: SubTextProps) {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      style={{
        fontFamily: "'Rajdhani', sans-serif",
        fontSize: "17px",
        fontWeight: 500,
        color: "rgba(255,255,255,0.35)",
        textAlign: "center",
        lineHeight: 1.5,
        marginTop: "14px",
        whiteSpace: "pre-line",
      }}
    >
      {children}
    </motion.p>
  );
}

interface RedButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  delay?: number;
  outline?: boolean;
}

function RedButton({ children, onClick, delay = 0.22, outline = false }: RedButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileTap={{ scale: 0.97 }}
      style={{
        width: "100%",
        background: outline ? "transparent" : "#FF3B3B",
        border: outline ? "1px solid #FF3B3B" : "none",
        borderRadius: "6px",
        padding: "16px",
        cursor: "pointer",
      }}
    >
      <span
        style={{
          fontFamily: "'Bebas Neue', cursive",
          fontSize: "20px",
          letterSpacing: "5px",
          color: outline ? "#FF3B3B" : "#fff",
        }}
      >
        {children}
      </span>
    </motion.button>
  );
}

/* ─────────────────────────────────────────────
   STEP 1 — TRIGGER
───────────────────────────────────────────── */
interface StepTriggerProps {
  onNext: () => void;
}

function StepTrigger({ onNext }: StepTriggerProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        padding: "0 28px",
        position: "relative",
      }}
    >
      {/* Ambient pulse */}
      <motion.div
        animate={{ opacity: [0, 0.07, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, rgba(255,59,59,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <Tag>MODO GUERRA</Tag>
      <BigText size="72px" delay={0.1}>TRAVOU?</BigText>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.2, duration: 0.28 }}
        style={{ width: "40px", height: "2px", background: "#FF3B3B", margin: "22px auto", transformOrigin: "left" }}
      />

      <SubText delay={0.22}>{"Sem explicação.\nSem análise.\nAção direta."}</SubText>

      <div style={{ height: "48px" }} />
      <RedButton onClick={onNext} delay={0.28}>DESTRAVAR AGORA</RedButton>
    </div>
  );
}

/* ─────────────────────────────────────────────
   STEP 2 — COUNTDOWN (delegated)
───────────────────────────────────────────── */
interface StepCountdownProps {
  onNext: () => void;
}

function StepCountdown({ onNext }: StepCountdownProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <CountdownStep onComplete={onNext} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   STEP 3 — PHYSICAL ACTION
───────────────────────────────────────────── */
interface StepPhysicalProps {
  onNext: () => void;
}

function StepPhysical({ onNext }: StepPhysicalProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        padding: "0 28px",
      }}
    >
      <Tag>AÇÃO FÍSICA</Tag>
      <BigText size="62px" delay={0.08}>{"LEVANTA\nAGORA."}</BigText>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.18 }}
        style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "10px",
          letterSpacing: "3px",
          color: "rgba(255,255,255,0.2)",
          textAlign: "center",
          marginTop: "16px",
          textTransform: "uppercase",
        }}
      >
        CORPO PRIMEIRO. MENTE DEPOIS.
      </motion.p>

      <div style={{ height: "56px" }} />
      <RedButton onClick={onNext} delay={0.24}>OK — LEVANTEI</RedButton>
    </div>
  );
}

/* ─────────────────────────────────────────────
   STEP 4 — CHOICE
───────────────────────────────────────────── */
interface StepChoiceProps {
  onNext: () => void;
}

function StepChoice({ onNext }: StepChoiceProps) {
  const [task, setTask] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleConfirm = useCallback(() => {
    if (!task.trim()) { inputRef.current?.focus(); return; }
    setConfirmed(true);
    setTimeout(onNext, 280);
  }, [task, onNext]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        padding: "0 28px",
      }}
    >
      <Tag>ESCOLHA</Tag>
      <BigText size="50px" delay={0.08}>{"ESCOLHE UMA\nCOISA."}</BigText>
      <SubText delay={0.16}>Sem lista. Só uma.</SubText>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22 }}
        style={{ width: "100%", marginTop: "28px" }}
      >
        <input
          ref={inputRef}
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
          placeholder="qual é a tarefa?"
          maxLength={60}
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${task ? "rgba(255,59,59,0.5)" : "rgba(255,255,255,0.1)"}`,
            borderRadius: "6px",
            padding: "14px 16px",
            color: "#F5F5F5",
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: "18px",
            fontWeight: 600,
            letterSpacing: "0.5px",
            outline: "none",
            textAlign: "center",
            transition: "border-color 0.2s",
          }}
          autoComplete="off"
          spellCheck={false}
        />
        <p
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "8px",
            letterSpacing: "2px",
            color: "rgba(255,255,255,0.15)",
            textAlign: "center",
            marginTop: "6px",
            textTransform: "uppercase",
          }}
        >
          APENAS UMA · PRESSIONE ENTER
        </p>
      </motion.div>

      <div style={{ height: "20px" }} />
      <RedButton onClick={handleConfirm} delay={0.28} outline={!task}>
        {confirmed ? "✓ DEFINIDO" : "ESCOLHER"}
      </RedButton>
    </div>
  );
}

/* ─────────────────────────────────────────────
   STEP 5 — EXECUTE
───────────────────────────────────────────── */
interface StepExecuteProps {
  onNext: () => void;
}

function StepExecute({ onNext }: StepExecuteProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        padding: "0 28px",
      }}
    >
      <Tag color="#FFC857">EXECUÇÃO</Tag>
      <BigText size="46px" delay={0.08}>{"COMEÇA\nAGORA."}</BigText>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.16 }}
        style={{ marginTop: "24px", width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}
      >
        {["Sem ajustar.", "Sem revisar.", "Sem esperar."].map((line, i) => (
          <motion.div
            key={line}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.08 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 14px",
              background: "rgba(255,200,87,0.05)",
              border: "1px solid rgba(255,200,87,0.12)",
              borderLeft: "3px solid rgba(255,200,87,0.45)",
              borderRadius: "6px",
            }}
          >
            <span style={{ color: "#FFC857", fontSize: "12px", fontFamily: "'Share Tech Mono', monospace" }}>→</span>
            <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "17px", fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: "0.5px" }}>
              {line}
            </span>
          </motion.div>
        ))}
      </motion.div>

      <div style={{ height: "36px" }} />
      <RedButton onClick={onNext} delay={0.44}>COMEÇAR</RedButton>
    </div>
  );
}

/* ─────────────────────────────────────────────
   STEP 6 — DONE
───────────────────────────────────────────── */
interface StepDoneProps {
  onFinish: () => void;
}

function StepDone({ onFinish }: StepDoneProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        padding: "0 28px",
      }}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.35, type: "spring", stiffness: 260, damping: 18 }}
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          border: "2px solid #00C853",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "28px",
          boxShadow: "0 0 32px rgba(0,200,83,0.2)",
        }}
      >
        <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "36px", color: "#00C853", lineHeight: 1 }}>✓</span>
      </motion.div>

      <Tag color="#00C853">DESBLOQUEADO</Tag>
      <BigText size="44px" delay={0.15}>{"VOCÊ JÁ\nSAIU NA\nFRENTE."}</BigText>
      <SubText delay={0.24}>{"A maioria ainda está parada.\nVocê já começou."}</SubText>

      <div style={{ height: "48px" }} />
      <RedButton onClick={onFinish} delay={0.32} outline>VOLTAR PARA ARSENAL</RedButton>
    </div>
  );
}

/* ─────────────────────────────────────────────
   EXPORT: StepFlow
   Props:
     onFinish     – () => void
     onStepChange – (index: number) => void  (optional)
───────────────────────────────────────────── */
interface StepFlowProps {
  onFinish: () => void;
  onStepChange?: (index: number) => void;
}

export default function StepFlow({ onFinish, onStepChange }: StepFlowProps) {
  const [stepIndex, setStepIndex] = useState(0);

  const goNext = useCallback(() => {
    setStepIndex((i) => {
      const next = Math.min(i + 1, STEP_IDS.length - 1);
      return next;
    });
  }, []);

  // Call onStepChange when stepIndex changes (after state update)
  useEffect(() => {
    onStepChange?.(stepIndex);
  }, [stepIndex, onStepChange]);

  const currentId = STEP_IDS[stepIndex];

  const stepMap: Record<string, React.ReactNode> = {
    trigger:   <StepTrigger   onNext={goNext} />,
    countdown: <StepCountdown onNext={goNext} />,
    physical:  <StepPhysical  onNext={goNext} />,
    choice:    <StepChoice    onNext={goNext} />,
    execute:   <StepExecute   onNext={goNext} />,
    done:      <StepDone      onFinish={onFinish} />,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentId}
          variants={stepVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={stepTransition}
          style={{ display: "flex", flexDirection: "column", flex: 1 }}
        >
          {stepMap[currentId]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
