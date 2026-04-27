"use client";

import { motion } from "framer-motion";

/* ─────────────────────────────────────────────
   LOCKED OVERLAY
   Props:
     onUnlock – () => void  called when user taps CTA
                            (in prod: triggers payment flow)
───────────────────────────────────────────── */
export default function LockedOverlay({ onUnlock }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 30,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 28px",
        background:
          "linear-gradient(to bottom, rgba(13,13,13,0.85) 0%, rgba(13,13,13,0.97) 60%, #0D0D0D 100%)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      {/* Lock icon ring */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 20 }}
        style={{
          width: "76px",
          height: "76px",
          borderRadius: "50%",
          border: "2px solid rgba(255,59,59,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "28px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "6px",
            borderRadius: "50%",
            border: "1px solid rgba(255,59,59,0.12)",
          }}
        />
        <span style={{ fontSize: "28px", lineHeight: 1 }}>🔒</span>
      </motion.div>

      {/* Label */}
      <motion.span
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "9px",
          letterSpacing: "4px",
          color: "#FF3B3B",
          textTransform: "uppercase",
          marginBottom: "14px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: "16px",
            height: "1px",
            background: "#FF3B3B",
          }}
        />
        FERRAMENTA PREMIUM
        <span
          style={{
            display: "inline-block",
            width: "16px",
            height: "1px",
            background: "#FF3B3B",
          }}
        />
      </motion.span>

      {/* Headline */}
      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          fontFamily: "'Bebas Neue', cursive",
          fontSize: "32px",
          letterSpacing: "3px",
          color: "#F5F5F5",
          textAlign: "center",
          lineHeight: 1.1,
          marginBottom: "16px",
        }}
      >
        FERRAMENTA DE
        <br />
        EXECUÇÃO IMEDIATA
      </motion.h2>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: "15px",
          fontWeight: 500,
          color: "rgba(255,255,255,0.4)",
          textAlign: "center",
          lineHeight: 1.6,
          marginBottom: "32px",
          maxWidth: "260px",
        }}
      >
        Quebra a inércia em menos de 60 segundos.
        <br />
        Sem leitura. Sem conteúdo. Só ação.
      </motion.p>

      {/* Feature pills */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          width: "100%",
          marginBottom: "32px",
        }}
      >
        {[
          "Contagem regressiva anti-paralisia",
          "Ação física de desbloqueio",
          "Foco em 1 tarefa só",
          "Execução sem revisão",
        ].map((feat, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 14px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "6px",
            }}
          >
            <span style={{ color: "#FF3B3B", fontSize: "12px", flexShrink: 0 }}>→</span>
            <span
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                color: "rgba(255,255,255,0.7)",
                letterSpacing: "0.3px",
              }}
            >
              {feat}
            </span>
          </div>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.button
        onClick={onUnlock}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        whileTap={{ scale: 0.97 }}
        style={{
          width: "100%",
          background: "#FF3B3B",
          border: "none",
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
            color: "#fff",
          }}
        >
          DESBLOQUEAR AGORA
        </span>
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "8px",
          letterSpacing: "2px",
          color: "rgba(255,255,255,0.15)",
          marginTop: "12px",
          textAlign: "center",
          textTransform: "uppercase",
        }}
      >
        ACESSO ÚNICO · SEM MENSALIDADE
      </motion.p>
    </motion.div>
  );
}
