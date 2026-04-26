"use client";

import { motion, AnimatePresence } from "framer-motion";

/* ─────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────── */
interface ScreenLine {
  text: string;
  size?: string;
  weight?: number;
  color?: string;
}

interface ChecklistItem {
  id: string;
  text: string;
  note?: string;
  special?: boolean;
}

interface ScreenData {
  id: string;
  type: 'impact' | 'checklist';
  tag?: string | null;
  tagColor?: string;
  title?: string | null;
  subtitle?: string;
  lines?: ScreenLine[];
  highlight?: string;
  cta?: string;
  items?: ChecklistItem[];
  note?: string;
}

interface ProtocoloScreenProps {
  screen: ScreenData;
  screenKey: string;
  direction: number;
  checked: Record<string, boolean>;
  onToggle: (id: string) => void;
}

/* ─────────────────────────────────────────────────────────
   MOTION VARIANTS
───────────────────────────────────────────────────────── */
const cardVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 40 : -40,
    opacity: 0,
    filter: "blur(4px)",
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -40 : 40,
    opacity: 0,
    filter: "blur(4px)",
  }),
};

const cardTransition = {
  duration: 0.28,
  ease: [0.32, 0.72, 0, 1] as const,
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.1 + i * 0.07, duration: 0.22 },
  }),
};

/* ─────────────────────────────────────────────────────────
   SCREEN TYPE: "IMPACT"
───────────────────────────────────────────────────────── */
function ImpactContent({ screen }: { screen: ScreenData }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1, padding: "0 28px" }}>
      {screen.tag && (
        <motion.span
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "9px",
            letterSpacing: "4px",
            color: screen.tagColor || "#FF3B3B",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "20px",
          }}
        >
          <span style={{ display: "inline-block", width: "18px", height: "1px", background: screen.tagColor || "#FF3B3B" }} />
          {screen.tag}
        </motion.span>
      )}

      {screen.title && (
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          style={{
            fontFamily: "'Bebas Neue', cursive",
            fontSize: "40px",
            letterSpacing: "3px",
            color: "#F5F5F5",
            lineHeight: 1,
            marginBottom: "20px",
          }}
        >
          {screen.title}
        </motion.h2>
      )}

      {screen.lines?.map((line, i) => (
        <motion.p
          key={i}
          custom={i}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: line.size || "22px",
            fontWeight: line.weight || 600,
            color: line.color || (i === 0 ? "#F5F5F5" : "rgba(255,255,255,0.45)"),
            lineHeight: 1.5,
            marginBottom: "16px",
            letterSpacing: "0.2px",
            whiteSpace: "pre-line",
          }}
        >
          {line.text}
        </motion.p>
      ))}

      {screen.highlight && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            marginTop: "8px",
            padding: "14px 16px",
            background: "rgba(255,59,59,0.08)",
            border: "1px solid rgba(255,59,59,0.2)",
            borderLeft: "3px solid #FF3B3B",
            borderRadius: "6px",
          }}
        >
          <span
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.5,
            }}
          >
            {screen.highlight}
          </span>
        </motion.div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   SCREEN TYPE: "CHECKLIST"
───────────────────────────────────────────────────────── */
function ChecklistContent({ 
  screen, 
  checked, 
  onToggle 
}: { 
  screen: ScreenData; 
  checked: Record<string, boolean>; 
  onToggle: (id: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "0 24px", overflowY: "auto" }}>
      {/* Title block */}
      <div style={{ paddingTop: "4px", marginBottom: "24px", flexShrink: 0 }}>
        {screen.tag && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.08 }}
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "9px",
              letterSpacing: "4px",
              color: screen.tagColor || "#FF3B3B",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "10px",
            }}
          >
            <span style={{ display: "inline-block", width: "18px", height: "1px", background: screen.tagColor || "#FF3B3B" }} />
            {screen.tag}
          </motion.span>
        )}

        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            fontFamily: "'Bebas Neue', cursive",
            fontSize: "34px",
            letterSpacing: "2px",
            color: "#F5F5F5",
            lineHeight: 1,
            marginBottom: screen.subtitle ? "8px" : 0,
          }}
        >
          {screen.title}
        </motion.h2>

        {screen.subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: "14px",
              fontWeight: 500,
              color: "rgba(255,255,255,0.35)",
              letterSpacing: "0.3px",
              lineHeight: 1.4,
            }}
          >
            {screen.subtitle}
          </motion.p>
        )}
      </div>

      {/* Checklist items */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {screen.items?.map((item, i) => {
          const isDone = checked[item.id] || false;
          const isSpecial = item.special;

          return (
            <motion.div
              key={item.id}
              custom={i}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              onClick={() => onToggle(item.id)}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                padding: "13px 14px",
                borderRadius: "8px",
                background: isDone
                  ? "rgba(0,200,83,0.07)"
                  : isSpecial
                  ? "rgba(255,59,59,0.06)"
                  : "rgba(255,255,255,0.03)",
                border: `1px solid ${
                  isDone
                    ? "rgba(0,200,83,0.25)"
                    : isSpecial
                    ? "rgba(255,59,59,0.25)"
                    : "rgba(255,255,255,0.06)"
                }`,
                borderLeft: `3px solid ${
                  isDone ? "#00C853" : isSpecial ? "#FF3B3B" : "rgba(255,255,255,0.12)"
                }`,
                cursor: "pointer",
                transition: "all 0.2s ease",
                userSelect: "none",
              }}
            >
              {/* Checkbox */}
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "4px",
                  border: `2px solid ${isDone ? "#00C853" : isSpecial ? "rgba(255,59,59,0.5)" : "rgba(255,255,255,0.2)"}`,
                  background: isDone ? "#00C853" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: "1px",
                  transition: "all 0.18s ease",
                }}
              >
                {isDone && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    style={{ color: "#000", fontSize: "11px", fontWeight: 900, lineHeight: 1 }}
                  >
                    ✓
                  </motion.span>
                )}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <span
                  style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: "15px",
                    fontWeight: isSpecial ? 700 : 600,
                    color: isDone
                      ? "rgba(255,255,255,0.3)"
                      : isSpecial
                      ? "#FF3B3B"
                      : "#F5F5F5",
                    textDecoration: isDone ? "line-through" : "none",
                    letterSpacing: "0.3px",
                    lineHeight: 1.3,
                    display: "block",
                    transition: "all 0.2s ease",
                  }}
                >
                  {item.text}
                </span>
                {item.note && (
                  <span
                    style={{
                      fontFamily: "'Share Tech Mono', monospace",
                      fontSize: "9px",
                      letterSpacing: "1px",
                      color: isDone ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.3)",
                      display: "block",
                      marginTop: "3px",
                    }}
                  >
                    {item.note}
                  </span>
                )}
              </div>

              {/* Done badge */}
              {isDone && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: "8px",
                    letterSpacing: "1.5px",
                    color: "#00C853",
                    background: "rgba(0,200,83,0.1)",
                    border: "1px solid rgba(0,200,83,0.2)",
                    borderRadius: "3px",
                    padding: "2px 6px",
                    flexShrink: 0,
                    alignSelf: "center",
                  }}
                >
                  FEITO
                </motion.span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Bottom note */}
      {screen.note && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: "13px",
            fontWeight: 500,
            color: "rgba(255,255,255,0.3)",
            textAlign: "center",
            margin: "20px 0 8px",
            lineHeight: 1.5,
            fontStyle: "italic",
          }}
        >
          {screen.note}
        </motion.p>
      )}

      <div style={{ height: "8px", flexShrink: 0 }} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────────────────── */
export default function ProtocoloScreen({ 
  screen, 
  screenKey, 
  direction, 
  checked, 
  onToggle 
}: ProtocoloScreenProps) {
  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={screenKey}
        custom={direction}
        variants={cardVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={cardTransition}
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          overflow: "hidden",
        }}
      >
        {screen.type === "impact" ? (
          <ImpactContent screen={screen} />
        ) : (
          <ChecklistContent screen={screen} checked={checked} onToggle={onToggle} />
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export type { ScreenData, ChecklistItem, ScreenLine };
