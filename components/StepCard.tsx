"use client";

import { motion, AnimatePresence } from "framer-motion";

/* ─────────────────────────────────────────────────────────
   VARIANTS
───────────────────────────────────────────────────────── */
const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 32 : -32,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -32 : 32,
    opacity: 0,
  }),
};

const transition = {
  duration: 0.25,
  ease: [0.32, 0.72, 0, 1] as const,
};

/* ─────────────────────────────────────────────────────────
   TAG COMPONENT
───────────────────────────────────────────────────────── */
function StepTag({ label }: { label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12, duration: 0.2 }}
      style={{ marginBottom: "24px" }}
    >
      <span
        style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "10px",
          letterSpacing: "4px",
          color: "#FF3B3B",
          textTransform: "uppercase",
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: "20px",
            height: "1px",
            background: "#FF3B3B",
          }}
        />
        {label}
      </span>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   TEXT RENDERER — splits \n\n into paragraphs
───────────────────────────────────────────────────────── */
function StepText({ text }: { text: string }) {
  const paragraphs = text.split("\n\n");
  return (
    <>
      {paragraphs.map((para, i) => {
        const isSecondary = i > 0;
        return (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 + i * 0.1, duration: 0.25 }}
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: isSecondary ? "20px" : "26px",
              fontWeight: isSecondary ? 500 : 700,
              lineHeight: 1.45,
              color: isSecondary ? "rgba(255,255,255,0.45)" : "#F5F5F5",
              marginBottom: i < paragraphs.length - 1 ? "20px" : 0,
              letterSpacing: "0.3px",
              whiteSpace: "pre-line",
            }}
          >
            {para}
          </motion.p>
        );
      })}
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   STEP CARD
───────────────────────────────────────────────────────── */
interface StepData {
  step: number;
  tag?: string;
  text: string;
}

interface StepCardProps {
  data: StepData;
  direction: number;
}

export default function StepCard({ data, direction }: StepCardProps) {
  return (
    <motion.div
      key={data.step}
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={transition}
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 24px",
        minHeight: 0,
      }}
    >
      {data.tag && <StepTag label={data.tag} />}
      <StepText text={data.text} />
    </motion.div>
  );
}
