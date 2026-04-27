"use client";

import { useState, useReducer, useEffect } from "react";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const SECTIONS = {
  manha: {
    id: "manha",
    label: "MANHÃ",
    icon: "☀",
    accentColor: "#FF3B3B",
    items: [
      { id: "m1", text: "Levantar sem soneca", icon: "⚡" },
      { id: "m2", text: "Arrumar a cama", icon: "🛏" },
      { id: "m3", text: "Beber água (500ml)", icon: "💧" },
      { id: "m4", text: "Exposição à luz solar", icon: "🌅" },
      { id: "m5", text: "Movimento leve (10 min)", icon: "🏃" },
      { id: "m6", text: "Zero celular por 1h", icon: "📵" },
      { id: "m7", text: "Definir tarefa principal do dia", icon: "🎯" },
    ],
  },
  dia: {
    id: "dia",
    label: "DURANTE O DIA",
    icon: "⚔",
    accentColor: "#5B8CFF",
    items: [
      { id: "d1", text: "Tarefa principal primeiro", icon: "🔥" },
      { id: "d2", text: "Bloco de foco profundo", icon: "🧠" },
      { id: "d3", text: "Evitar redes sociais", icon: "🚫" },
      { id: "d4", text: "Alimentação controlada", icon: "🥩" },
      { id: "d5", text: "Hidratação contínua", icon: "💧" },
    ],
  },
  noite: {
    id: "noite",
    label: "NOITE",
    icon: "🌙",
    accentColor: "#FFC857",
    items: [
      { id: "n1", text: "Sem cafeína após 14h", icon: "☕" },
      { id: "n2", text: "Refeição leve", icon: "🥗" },
      { id: "n3", text: "Luz baixa após 20h", icon: "🕯" },
      { id: "n4", text: "Zero tela 1h antes de dormir", icon: "📵" },
      { id: "n5", text: "Revisar o dia (2 min)", icon: "📓" },
      { id: "n6", text: "Dormir no horário fixo", icon: "😴" },
    ],
  },
  suporte: {
    id: "suporte",
    label: "SUPORTE",
    icon: "💊",
    accentColor: "#00C853",
    items: [
      { id: "s1", text: "Creatina (5g)", icon: "⚗" },
      { id: "s2", text: "Magnésio (noite)", icon: "🧪" },
      { id: "s3", text: "Cafeína controlada (manhã)", icon: "☕" },
    ],
  },
};

const SCREENS = ["intro", "manha", "dia", "noite", "checklist"];

/* ─────────────────────────────────────────────
   REDUCER
───────────────────────────────────────────── */
function checklistReducer(state, action) {
  switch (action.type) {
    case "TOGGLE":
      return {
        ...state,
        [action.id]: !state[action.id],
      };
    case "RESET":
      return {};
    default:
      return state;
  }
}

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function getSectionProgress(sectionId, checked) {
  const section = SECTIONS[sectionId];
  if (!section) return 0;
  const done = section.items.filter((i) => checked[i.id]).length;
  return Math.round((done / section.items.length) * 100);
}

function getTotalProgress(checked) {
  const allItems = Object.values(SECTIONS).flatMap((s) => s.items);
  const done = allItems.filter((i) => checked[i.id]).length;
  return { done, total: allItems.length, pct: Math.round((done / allItems.length) * 100) };
}

/* ─────────────────────────────────────────────
   FONT LOADER (injected once)
───────────────────────────────────────────── */
function FontLoader() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@400;500;600;700&family=Share+Tech+Mono&display=swap');
      .font-bebas { font-family: 'Bebas Neue', cursive; }
      .font-rajdhani { font-family: 'Rajdhani', sans-serif; }
      .font-mono-tech { font-family: 'Share Tech Mono', monospace; }
      * { box-sizing: border-box; }
      ::-webkit-scrollbar { width: 0px; }
      @keyframes fadeSlideIn {
        from { opacity: 0; transform: translateY(16px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes checkPop {
        0%   { transform: scale(0.5); opacity: 0; }
        60%  { transform: scale(1.2); }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes shimmer {
        0%   { background-position: -200% center; }
        100% { background-position: 200% center; }
      }
      @keyframes pulseRed {
        0%, 100% { box-shadow: 0 0 0 0 rgba(255,59,59,0.4); }
        50%       { box-shadow: 0 0 0 8px rgba(255,59,59,0); }
      }
      .animate-fade-slide { animation: fadeSlideIn 0.4s ease forwards; }
      .animate-check-pop  { animation: checkPop 0.3s cubic-bezier(.36,.07,.19,.97) forwards; }
      .pulse-red          { animation: pulseRed 2s infinite; }
      .progress-shimmer {
        background: linear-gradient(90deg, #FF3B3B 0%, #ff6b6b 50%, #FF3B3B 100%);
        background-size: 200% auto;
        animation: shimmer 2s linear infinite;
      }
    `}</style>
  );
}

/* ─────────────────────────────────────────────
   CHECKBOX ITEM
───────────────────────────────────────────── */
function CheckItem({ item, checked, onToggle, accentColor, delay = 0 }) {
  const isDone = checked[item.id] || false;
  return (
    <div
      className="animate-fade-slide"
      style={{ animationDelay: `${delay}ms` }}
      onClick={() => onToggle(item.id)}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          padding: "14px 16px",
          borderRadius: "8px",
          background: isDone ? "rgba(0,200,83,0.08)" : "rgba(255,255,255,0.03)",
          border: `1px solid ${isDone ? "rgba(0,200,83,0.3)" : "rgba(255,255,255,0.07)"}`,
          borderLeft: `3px solid ${isDone ? "#00C853" : accentColor}`,
          cursor: "pointer",
          transition: "all 0.2s ease",
          marginBottom: "10px",
          userSelect: "none",
        }}
      >
        {/* Checkbox */}
        <div
          style={{
            width: "22px",
            height: "22px",
            borderRadius: "4px",
            border: `2px solid ${isDone ? "#00C853" : "rgba(255,255,255,0.2)"}`,
            background: isDone ? "#00C853" : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "all 0.2s ease",
          }}
        >
          {isDone && (
            <span className="animate-check-pop" style={{ color: "#000", fontSize: "13px", lineHeight: 1, fontWeight: 900 }}>
              ✓
            </span>
          )}
        </div>

        {/* Icon */}
        <span style={{ fontSize: "18px", flexShrink: 0 }}>{item.icon}</span>

        {/* Text */}
        <span
          className="font-rajdhani"
          style={{
            flex: 1,
            fontSize: "15px",
            fontWeight: 600,
            color: isDone ? "rgba(255,255,255,0.4)" : "#F5F5F5",
            textDecoration: isDone ? "line-through" : "none",
            letterSpacing: "0.5px",
            transition: "all 0.2s ease",
          }}
        >
          {item.text}
        </span>

        {/* Done badge */}
        {isDone && (
          <span
            className="font-mono-tech"
            style={{
              fontSize: "9px",
              letterSpacing: "2px",
              color: "#00C853",
              background: "rgba(0,200,83,0.12)",
              border: "1px solid rgba(0,200,83,0.25)",
              borderRadius: "3px",
              padding: "2px 7px",
              flexShrink: 0,
            }}
          >
            FEITO
          </span>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PROGRESS BAR
───────────────────────────────────────────── */
function ProgressBar({ pct, color = "#FF3B3B", height = 3, animate = false }) {
  return (
    <div style={{ width: "100%", height, background: "rgba(255,255,255,0.08)", borderRadius: height }}>
      <div
        style={{
          height: "100%",
          width: `${pct}%`,
          borderRadius: height,
          background: pct === 100 ? "#00C853" : color,
          transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)",
        }}
        className={animate && pct > 0 && pct < 100 ? "progress-shimmer" : ""}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   SECTION HEADER
───────────────────────────────────────────── */
function SectionHeader({ section, progress }) {
  const done = section.items.filter((_, i) => i < (section.items.length * progress) / 100).length;
  const total = section.items.length;
  return (
    <div style={{ marginBottom: "28px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "12px" }}>
        <div>
          <span
            className="font-mono-tech"
            style={{ fontSize: "9px", letterSpacing: "4px", color: section.accentColor, display: "block", marginBottom: "4px", textTransform: "uppercase" }}
          >
            PROTOCOLO · {section.label}
          </span>
          <h2
            className="font-bebas"
            style={{ fontSize: "36px", letterSpacing: "3px", color: "#F5F5F5", lineHeight: 1 }}
          >
            {section.label}
          </h2>
        </div>
        <div style={{ textAlign: "right" }}>
          <span
            className="font-bebas"
            style={{ fontSize: "32px", letterSpacing: "2px", color: progress === 100 ? "#00C853" : "#F5F5F5", lineHeight: 1, display: "block" }}
          >
            {progress}
            <span style={{ fontSize: "16px", color: "rgba(255,255,255,0.3)" }}>%</span>
          </span>
          <span className="font-mono-tech" style={{ fontSize: "8px", letterSpacing: "2px", color: "rgba(255,255,255,0.3)" }}>
            CONCLUÍDO
          </span>
        </div>
      </div>
      <ProgressBar pct={progress} color={section.accentColor} height={4} animate />
    </div>
  );
}

/* ─────────────────────────────────────────────
   SCREEN: INTRO
───────────────────────────────────────────── */
function ScreenIntro({ onStart }) {
  return (
    <div className="animate-fade-slide" style={{ display: "flex", flexDirection: "column", minHeight: "100%", padding: "48px 24px 40px" }}>
      {/* Top tag */}
      <div style={{ marginBottom: "auto" }}>
        <span
          className="font-mono-tech"
          style={{ fontSize: "9px", letterSpacing: "5px", color: "#FF3B3B", textTransform: "uppercase", display: "block", marginBottom: "32px" }}
        >
          ● SISTEMA ATIVO
        </span>

        {/* Main title */}
        <h1
          className="font-bebas"
          style={{ fontSize: "54px", letterSpacing: "4px", lineHeight: 1, color: "#F5F5F5", marginBottom: "8px" }}
        >
          ROTINA
          <br />
          <span style={{ color: "#FF3B3B" }}>BLINDADA</span>
        </h1>

        <p
          className="font-mono-tech"
          style={{ fontSize: "10px", letterSpacing: "3px", color: "rgba(255,255,255,0.4)", marginBottom: "36px", textTransform: "uppercase" }}
        >
          PROTOCOLO DIÁRIO DE ALTA PERFORMANCE
        </p>

        {/* Divider */}
        <div style={{ width: "40px", height: "2px", background: "#FF3B3B", marginBottom: "28px" }} />

        {/* Description */}
        <p
          className="font-rajdhani"
          style={{ fontSize: "16px", fontWeight: 500, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: "40px" }}
        >
          Disciplina não é motivação.<br />
          É <span style={{ color: "#F5F5F5", fontWeight: 700 }}>estrutura executada todos os dias</span>, sem exceção.
          <br /><br />
          Este protocolo cobre manhã, dia, noite e suporte — uma checklist que você vai marcar, dia após dia.
        </p>

        {/* Stats */}
        <div style={{ display: "flex", gap: "24px", marginBottom: "48px" }}>
          {[
            { val: "21", lbl: "ITENS" },
            { val: "4", lbl: "BLOCOS" },
            { val: "∞", lbl: "DIAS" },
          ].map((s) => (
            <div key={s.lbl} style={{ textAlign: "center" }}>
              <span className="font-bebas" style={{ fontSize: "32px", color: "#F5F5F5", display: "block", lineHeight: 1 }}>{s.val}</span>
              <span className="font-mono-tech" style={{ fontSize: "8px", letterSpacing: "2px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>{s.lbl}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={onStart}
        className="pulse-red"
        style={{
          width: "100%",
          background: "#FF3B3B",
          border: "none",
          borderRadius: "6px",
          padding: "16px",
          cursor: "pointer",
          marginBottom: "12px",
        }}
      >
        <span className="font-bebas" style={{ fontSize: "22px", letterSpacing: "5px", color: "#fff" }}>
          INICIAR PROTOCOLO
        </span>
      </button>

      <p
        className="font-mono-tech"
        style={{ fontSize: "9px", letterSpacing: "2px", color: "rgba(255,255,255,0.2)", textAlign: "center", textTransform: "uppercase" }}
      >
        SEM DESCULPA. SEM PAUSA.
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SCREEN: CHECKLIST SECTION
───────────────────────────────────────────── */
function ScreenSection({ sectionId, checked, onToggle, onNext, onBack, isLast, totalProgress }) {
  const section = SECTIONS[sectionId];
  const progress = getSectionProgress(sectionId, checked);
  const allDone = progress === 100;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
      {/* Fixed header area */}
      <div style={{ padding: "32px 24px 0", flexShrink: 0 }}>
        {/* Back + global progress */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <button
            onClick={onBack}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", padding: 0 }}
          >
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "18px" }}>←</span>
            <span className="font-mono-tech" style={{ fontSize: "9px", letterSpacing: "2px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>VOLTAR</span>
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="font-mono-tech" style={{ fontSize: "9px", letterSpacing: "2px", color: "rgba(255,255,255,0.3)" }}>
              {totalProgress.done}/{totalProgress.total}
            </span>
            <div style={{ width: "60px", height: "3px", background: "rgba(255,255,255,0.1)", borderRadius: 3 }}>
              <div style={{ height: "100%", width: `${totalProgress.pct}%`, background: "#FF3B3B", borderRadius: 3, transition: "width 0.3s ease" }} />
            </div>
          </div>
        </div>

        <SectionHeader section={section} progress={progress} />
      </div>

      {/* Scrollable checklist */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 24px" }}>
        {section.items.map((item, i) => (
          <CheckItem
            key={item.id}
            item={item}
            checked={checked}
            onToggle={onToggle}
            accentColor={section.accentColor}
            delay={i * 50}
          />
        ))}

        <div style={{ height: "100px" }} />
      </div>

      {/* Fixed bottom CTA */}
      <div
        style={{
          position: "sticky",
          bottom: 0,
          padding: "16px 24px 28px",
          background: "linear-gradient(to top, #0D0D0D 70%, transparent)",
          flexShrink: 0,
        }}
      >
        <button
          onClick={onNext}
          style={{
            width: "100%",
            background: allDone ? "#00C853" : "#FF3B3B",
            border: "none",
            borderRadius: "6px",
            padding: "15px",
            cursor: "pointer",
            opacity: 1,
            transition: "all 0.3s ease",
          }}
        >
          <span className="font-bebas" style={{ fontSize: "20px", letterSpacing: "4px", color: allDone ? "#000" : "#fff" }}>
            {isLast
              ? allDone
                ? "✓ VER RESUMO"
                : "VER RESUMO →"
              : allDone
              ? `✓ PRÓXIMO BLOCO`
              : "PRÓXIMO BLOCO →"}
          </span>
        </button>

        {!allDone && (
          <p className="font-mono-tech" style={{ fontSize: "8px", letterSpacing: "2px", color: "rgba(255,255,255,0.2)", textAlign: "center", marginTop: "8px", textTransform: "uppercase" }}>
            {section.items.length - section.items.filter((i) => checked[i.id]).length} ITEM(S) PENDENTE(S)
          </p>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SCREEN: FINAL CHECKLIST
───────────────────────────────────────────── */
function ScreenFinal({ checked, onToggle, onReset, onBack }) {
  const totalProgress = getTotalProgress(checked);
  const isComplete = totalProgress.pct === 100;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
      {/* Header */}
      <div style={{ padding: "32px 24px 24px", flexShrink: 0 }}>
        <button
          onClick={onBack}
          style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", padding: 0, marginBottom: "28px" }}
        >
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "18px" }}>←</span>
          <span className="font-mono-tech" style={{ fontSize: "9px", letterSpacing: "2px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>VOLTAR</span>
        </button>

        <span className="font-mono-tech" style={{ fontSize: "9px", letterSpacing: "4px", color: isComplete ? "#00C853" : "#FF3B3B", display: "block", marginBottom: "4px", textTransform: "uppercase" }}>
          {isComplete ? "✓ PROTOCOLO CONCLUÍDO" : "RESUMO DO DIA"}
        </span>

        <h2 className="font-bebas" style={{ fontSize: "38px", letterSpacing: "3px", color: "#F5F5F5", lineHeight: 1, marginBottom: "20px" }}>
          CHECKLIST
          <br />
          <span style={{ color: isComplete ? "#00C853" : "#FF3B3B" }}>FINAL</span>
        </h2>

        {/* Big progress ring (visual) */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "24px", padding: "20px", background: "rgba(255,255,255,0.03)", border: `1px solid ${isComplete ? "rgba(0,200,83,0.2)" : "rgba(255,59,59,0.15)"}`, borderRadius: "10px" }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              border: `3px solid ${isComplete ? "#00C853" : "#FF3B3B"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: isComplete ? "0 0 16px rgba(0,200,83,0.2)" : "0 0 16px rgba(255,59,59,0.15)",
            }}
          >
            <div>
              <span className="font-bebas" style={{ fontSize: "26px", color: isComplete ? "#00C853" : "#F5F5F5", display: "block", lineHeight: 1, textAlign: "center" }}>
                {totalProgress.pct}
                <span style={{ fontSize: "14px" }}>%</span>
              </span>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <span className="font-rajdhani" style={{ fontSize: "20px", fontWeight: 700, color: "#F5F5F5", display: "block", lineHeight: 1.2, marginBottom: "4px" }}>
              {isComplete ? "Protocolo Executado." : `${totalProgress.done} de ${totalProgress.total} concluídos`}
            </span>
            <ProgressBar pct={totalProgress.pct} color={isComplete ? "#00C853" : "#FF3B3B"} height={4} />
            {isComplete && (
              <span className="font-mono-tech" style={{ fontSize: "8px", letterSpacing: "2px", color: "#00C853", display: "block", marginTop: "6px" }}>
                VOCÊ FEZ O QUE POUCOS FAZEM.
              </span>
            )}
          </div>
        </div>

        {/* Per-section mini progress */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "4px" }}>
          {Object.values(SECTIONS).map((section) => {
            const pct = getSectionProgress(section.id, checked);
            return (
              <div
                key={section.id}
                style={{
                  padding: "12px 14px",
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${pct === 100 ? "rgba(0,200,83,0.2)" : "rgba(255,255,255,0.07)"}`,
                  borderRadius: "8px",
                  borderLeft: `3px solid ${pct === 100 ? "#00C853" : section.accentColor}`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span className="font-mono-tech" style={{ fontSize: "8px", letterSpacing: "2px", color: pct === 100 ? "#00C853" : section.accentColor, textTransform: "uppercase" }}>
                    {section.icon} {section.label}
                  </span>
                  <span className="font-mono-tech" style={{ fontSize: "8px", color: pct === 100 ? "#00C853" : "rgba(255,255,255,0.4)" }}>
                    {pct}%
                  </span>
                </div>
                <ProgressBar pct={pct} color={section.accentColor} height={3} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Full items list by section */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 24px" }}>
        {Object.values(SECTIONS).map((section) => (
          <div key={section.id} style={{ marginBottom: "24px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "12px",
                paddingBottom: "8px",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <span style={{ fontSize: "14px" }}>{section.icon}</span>
              <span className="font-mono-tech" style={{ fontSize: "9px", letterSpacing: "3px", color: section.accentColor, textTransform: "uppercase" }}>
                {section.label}
              </span>
            </div>
            {section.items.map((item) => (
              <CheckItem
                key={item.id}
                item={item}
                checked={checked}
                onToggle={onToggle}
                accentColor={section.accentColor}
              />
            ))}
          </div>
        ))}
        <div style={{ height: "120px" }} />
      </div>

      {/* Bottom */}
      <div style={{ position: "sticky", bottom: 0, padding: "16px 24px 28px", background: "linear-gradient(to top, #0D0D0D 70%, transparent)", flexShrink: 0 }}>
        {isComplete ? (
          <button
            onClick={onReset}
            style={{
              width: "100%",
              background: "transparent",
              border: "1px solid #00C853",
              borderRadius: "6px",
              padding: "14px",
              cursor: "pointer",
            }}
          >
            <span className="font-bebas" style={{ fontSize: "18px", letterSpacing: "4px", color: "#00C853" }}>
              ↺ REINICIAR PARA AMANHÃ
            </span>
          </button>
        ) : (
          <button
            onClick={onReset}
            style={{
              width: "100%",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "6px",
              padding: "14px",
              cursor: "pointer",
            }}
          >
            <span className="font-bebas" style={{ fontSize: "18px", letterSpacing: "4px", color: "rgba(255,255,255,0.3)" }}>
              ↺ REINICIAR DIA
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   NAV DOTS
───────────────────────────────────────────── */
function NavDots({ screens, current }) {
  const steps = screens.filter((s) => s !== "intro" && s !== "checklist");
  if (current === "intro") return null;
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "6px", padding: "12px 0 0", flexShrink: 0 }}>
      {steps.map((s) => {
        const idx = steps.indexOf(s);
        const curIdx = steps.indexOf(current);
        const active = s === current;
        const done = curIdx > idx || current === "checklist";
        return (
          <div
            key={s}
            style={{
              height: "3px",
              width: active ? "24px" : "14px",
              borderRadius: "3px",
              background: done ? "#00C853" : active ? "#FF3B3B" : "rgba(255,255,255,0.15)",
              transition: "all 0.3s ease",
            }}
          />
        );
      })}
      <div style={{ height: "3px", width: current === "checklist" ? "24px" : "14px", borderRadius: "3px", background: current === "checklist" ? "#FF3B3B" : "rgba(255,255,255,0.15)", transition: "all 0.3s ease" }} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   ROOT COMPONENT
───────────────────────────────────────────── */
export default function RotinaBlinada() {
  const [screen, setScreen] = useState("intro");
  const [checked, dispatch] = useReducer(checklistReducer, {});

  const sectionScreens = ["manha", "dia", "noite"];
  const totalProgress = getTotalProgress(checked);

  const handleToggle = (id) => dispatch({ type: "TOGGLE", id });
  const handleReset = () => {
    dispatch({ type: "RESET" });
    setScreen("intro");
  };

  const goNext = (current) => {
    if (current === "intro") { setScreen("manha"); return; }
    const idx = sectionScreens.indexOf(current);
    if (idx < sectionScreens.length - 1) {
      setScreen(sectionScreens[idx + 1]);
    } else {
      setScreen("checklist");
    }
  };

  const goBack = (current) => {
    if (current === "checklist") { setScreen("noite"); return; }
    const idx = sectionScreens.indexOf(current);
    if (idx <= 0) {
      setScreen("intro");
    } else {
      setScreen(sectionScreens[idx - 1]);
    }
  };

  return (
    <>
      <FontLoader />
      <div
        style={{
          background: "#0D0D0D",
          minHeight: "100dvh",
          maxWidth: "430px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          fontFamily: "'Rajdhani', sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ambient glow */}
        <div
          style={{
            position: "fixed",
            top: "-80px",
            left: "-80px",
            width: "280px",
            height: "280px",
            background: "radial-gradient(circle, rgba(255,59,59,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Nav dots */}
        <NavDots screens={SCREENS} current={screen} />

        {/* Screen content */}
        <div style={{ flex: 1, position: "relative", zIndex: 1, display: "flex", flexDirection: "column" }} key={screen}>
          {screen === "intro" && (
            <ScreenIntro onStart={() => goNext("intro")} />
          )}

          {sectionScreens.map((s, i) =>
            screen === s ? (
              <ScreenSection
                key={s}
                sectionId={s}
                checked={checked}
                onToggle={handleToggle}
                onNext={() => goNext(s)}
                onBack={() => goBack(s)}
                isLast={i === sectionScreens.length - 1}
                totalProgress={totalProgress}
              />
            ) : null
          )}

          {screen === "checklist" && (
            <ScreenFinal
              checked={checked}
              onToggle={handleToggle}
              onReset={handleReset}
              onBack={() => goBack("checklist")}
            />
          )}
        </div>
      </div>
    </>
  );
}
