"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─────────────────────────────────────────────
   COUNTDOWN STEP
   Props:
     onComplete – () => void  called when countdown hits 0
───────────────────────────────────────────── */
interface CountdownStepProps {
  onComplete: () => void;
}

export default function CountdownStep({ onComplete }: CountdownStepProps) {
  const [count, setCount] = useState(5);
  const [done, setDone] = useState(false);
  const calledRef = useRef(false);

  /* tick every 800ms */
  useEffect(() => {
    if (count <= 0) return;
    const t = setTimeout(() => setCount((c) => c - 1), 800);
    return () => clearTimeout(t);
  }, [count]);

  /* when count hits 0, wait 400ms then fire */
  useEffect(() => {
    if (count === 0 && !calledRef.current) {
      calledRef.current = true;
      setDone(true);
      const t = setTimeout(onComplete, 520);
      return () => clearTimeout(t);
    }
  }, [count, onComplete]);

  /* color per tick */
  const colors: Record<number, string> = {
    5: "#FF3B3B",
    4: "#FF5C3B",
    3: "#FF803B",
    2: "#FFA33B",
    1: "#FFC857",
    0: "#00C853",
  };
  const color = colors[count] ?? "#00C853";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        gap: "28px",
      }}
    >
      {/* Hint */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "10px",
          letterSpacing: "4px",
          color: "rgba(255,255,255,0.3)",
          textTransform: "uppercase",
        }}
      >
        SEM PENSAR
      </motion.span>

      {/* Number */}
      <AnimatePresence mode="wait">
        <motion.div
          key={done ? "done" : count}
          initial={{ scale: 1.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
          style={{
            fontFamily: "'Bebas Neue', cursive",
            fontSize: "120px",
            lineHeight: 1,
            color: done ? "#00C853" : color,
            letterSpacing: "-4px",
            textShadow: `0 0 40px ${done ? "rgba(0,200,83,0.25)" : `${color}33`}`,
            userSelect: "none",
          }}
        >
          {done ? "↑" : count === 0 ? "GO" : count}
        </motion.div>
      </AnimatePresence>

      {/* Ring progress */}
      <svg width="80" height="80" viewBox="0 0 80 80" style={{ position: "absolute", opacity: 0.25 }}>
        <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
        <motion.circle
          cx="40"
          cy="40"
          r="36"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={226}
          animate={{ strokeDashoffset: 226 - (226 * (5 - count)) / 5 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{ transform: "rotate(-90deg)", transformOrigin: "40px 40px" }}
        />
      </svg>

      {/* Pulse dot */}
      {!done && (
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: color,
          }}
        />
      )}
    </div>
  );
}
