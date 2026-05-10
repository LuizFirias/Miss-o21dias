'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';

/* ══════════════════════════════════════════════════
   FONTS — injected once
══════════════════════════════════════════════════ */
function Fonts() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@400;500;600;700&family=Share+Tech+Mono&display=swap');

      :root {
        --preto: #0D0D0D;
        --vermelho: #FF3B3B;
        --verde: #00C853;
        --amarelo: #FFC857;
        --cinza-esc: #111111;
        --cinza-card: #161616;
        --cinza-borda: #242424;
        --branco: #F5F5F5;
        --branco-dim: #888888;
      }

      * { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; }
      body { background: var(--preto); color: var(--branco); font-family: 'Rajdhani', sans-serif; overflow-x: hidden; }
      button { -webkit-appearance: none; cursor: pointer; }
      ::-webkit-scrollbar { width: 3px; }
      ::-webkit-scrollbar-track { background: var(--preto); }
      ::-webkit-scrollbar-thumb { background: var(--vermelho); border-radius: 3px; }

      .font-display { font-family: 'Bebas Neue', cursive; }
      .font-mono-t  { font-family: 'Share Tech Mono', monospace; }

      @keyframes pulse-red {
        0%, 100% { box-shadow: 0 0 0 0 rgba(255,59,59,0.4); }
        50%       { box-shadow: 0 0 0 12px rgba(255,59,59,0); }
      }
      @keyframes flicker { 0%,100%{opacity:1} 50%{opacity:0.85} }
      @keyframes scan {
        0%   { transform: translateY(-100%); }
        100% { transform: translateY(100vh); }
      }
      @keyframes ticker {
        0%   { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      @keyframes counter {
        from { opacity: 0; transform: translateY(8px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      .pulse-red    { animation: pulse-red 2s infinite; }
      .flicker      { animation: flicker 3s ease-in-out infinite; }
      .scan-line::after {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0;
        height: 2px;
        background: linear-gradient(to right, transparent, rgba(255,59,59,0.3), transparent);
        animation: scan 4s linear infinite;
        pointer-events: none;
      }
      .ticker-wrap { overflow: hidden; white-space: nowrap; }
      .ticker-inner { display: inline-flex; animation: ticker 30s linear infinite; }
      .noise {
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
        background-repeat: repeat;
        background-size: 128px;
        pointer-events: none;
      }
      .glow-red  { filter: drop-shadow(0 0 16px rgba(255,59,59,0.5)); }
      .glow-grn  { filter: drop-shadow(0 0 12px rgba(0,200,83,0.5)); }
    `}</style>
  );
}

/* ══════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════ */
function Reveal({
  children,
  delay = 0,
  className = '',
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.32, 0.72, 0, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

function Tag({ children, color = 'red' }: { children: React.ReactNode; color?: 'red' | 'yellow' | 'green' | 'dim' }) {
  const colors = {
    red:    { c: '#FF3B3B', bg: 'rgba(255,59,59,0.08)',    border: 'rgba(255,59,59,0.25)' },
    yellow: { c: '#FFC857', bg: 'rgba(255,200,87,0.08)',   border: 'rgba(255,200,87,0.25)' },
    green:  { c: '#00C853', bg: 'rgba(0,200,83,0.08)',     border: 'rgba(0,200,83,0.25)'  },
    dim:    { c: '#888888', bg: 'rgba(255,255,255,0.04)',  border: 'rgba(255,255,255,0.1)' },
  };
  const t = colors[color];
  return (
    <span
      className="font-mono-t"
      style={{
        fontSize: '9px',
        letterSpacing: '4px',
        color: t.c,
        background: t.bg,
        border: `1px solid ${t.border}`,
        borderRadius: '3px',
        padding: '4px 10px',
        textTransform: 'uppercase',
        display: 'inline-block',
      }}
    >
      {children}
    </span>
  );
}

function Divider() {
  return (
    <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.06)', margin: 0 }} />
  );
}

/* ══════════════════════════════════════════════════
   PHONE MOCKUP
══════════════════════════════════════════════════ */
function PhoneMockup({ screen }: { screen: React.ReactNode }) {
  return (
    <div
      style={{
        width: '220px',
        height: '440px',
        borderRadius: '32px',
        border: '2px solid rgba(255,255,255,0.12)',
        background: '#0a0a0a',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 32px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)',
        flexShrink: 0,
      }}
      className="scan-line"
    >
      {/* Notch */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '70px',
          height: '18px',
          background: '#0a0a0a',
          borderRadius: '0 0 12px 12px',
          zIndex: 10,
        }}
      />
      {/* Noise overlay */}
      <div className="noise" style={{ position: 'absolute', inset: 0, zIndex: 5 }} />
      {/* Screen content */}
      <div style={{ paddingTop: '24px', height: '100%', overflow: 'hidden' }}>
        {screen}
      </div>
    </div>
  );
}

/* Phone screen variants */
function HomeScreen() {
  return (
    <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', height: '100%', background: '#0D0D0D' }}>
      {/* Frase */}
      <div style={{ padding: '6px 8px', marginBottom: '8px', borderLeft: '2px solid #FF3B3B' }}>
        <div className="font-mono-t" style={{ fontSize: '7px', color: '#FF3B3B', letterSpacing: '0.5px', lineHeight: 1.5 }}>
          "Enquanto você pensa,<br />alguém já fez."
        </div>
      </div>

      {/* Stats row */}
      <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '4px', padding: '6px 8px', marginBottom: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="font-mono-t" style={{ fontSize: '5px', letterSpacing: '1px', color: '#555' }}>DIAS</div>
            <div className="font-display" style={{ fontSize: '13px', color: '#FF3B3B', lineHeight: 1 }}>5/21</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div className="font-mono-t" style={{ fontSize: '5px', letterSpacing: '1px', color: '#555' }}>PROGRESSO</div>
            <div className="font-display" style={{ fontSize: '13px', color: '#FF8C42', lineHeight: 1 }}>24%</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div className="font-mono-t" style={{ fontSize: '5px', letterSpacing: '1px', color: '#555' }}>NÍVEL</div>
            <div className="font-display" style={{ fontSize: '11px', color: '#FFC857', lineHeight: 1 }}>SOLDADO</div>
          </div>
        </div>
        <div style={{ height: '2px', background: '#1a1a1a', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ width: '24%', height: '100%', background: 'linear-gradient(to right, #FF3B3B, #FFC857)' }} />
        </div>
      </div>

      {/* Trail header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', paddingBottom: '4px', borderBottom: '1px solid rgba(255,59,59,0.15)' }}>
        <div>
          <div className="font-display" style={{ fontSize: '11px', letterSpacing: '2px', color: '#F5F5F5' }}>TRILHA DE EVOLUÇÃO</div>
          <div className="font-mono-t" style={{ fontSize: '5px', letterSpacing: '1px', color: '#555' }}>Toque no dia atual</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="font-mono-t" style={{ fontSize: '5px', color: '#555', letterSpacing: '1px' }}>DIA ATUAL</div>
          <div className="font-display" style={{ fontSize: '20px', color: '#FF3B3B', lineHeight: 1 }}>06</div>
        </div>
      </div>

      {/* Mini trail preview (3 nodes) */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {/* Paths */}
        <svg style={{ position: 'absolute', inset: 0, overflow: 'visible' }} width="200" height="300">
          <path d="M 100 22 C 100 42, 155 42, 155 62" fill="none" stroke="#FF3B3B" strokeWidth="1.5" opacity="0.6" />
          <path d="M 155 62 C 155 82, 100 82, 100 102" fill="none" stroke="#FF3B3B" strokeWidth="1.5" opacity="0.6" />
          <path d="M 100 102 C 100 122, 45 122, 45 142" fill="none" stroke="#FF8C42" strokeWidth="1.5" opacity="0.5" />
          <path d="M 45 142 C 45 162, 100 162, 100 182" fill="none" stroke="#2A2A2A" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.5" />
        </svg>
        {/* Completed nodes */}
        {[
          { x: 100, y: 22, label: '04', done: true },
          { x: 155, y: 62, label: '05', done: true },
          { x: 100, y: 102, label: '06', current: true },
          { x: 45, y: 142, label: '07', checkpoint: true },
          { x: 100, y: 182, label: '08', locked: true },
        ].map((n) => (
          <div
            key={n.label}
            style={{
              position: 'absolute',
              left: n.x,
              top: n.y,
              transform: 'translate(-50%, -50%)',
              width: n.current ? 32 : n.done ? 24 : 20,
              height: n.current ? 32 : n.done ? 24 : 20,
              borderRadius: '50%',
              background: n.current ? 'linear-gradient(135deg, #FF3B3B, #FF8C42)' : n.done ? '#161616' : '#0f0f0f',
              border: `2px solid ${n.current ? '#FF3B3B' : n.done ? 'rgba(255,59,59,0.45)' : '#1e1e1e'}`,
              boxShadow: n.current ? '0 0 14px rgba(255,59,59,0.55)' : n.done ? '0 0 6px rgba(255,59,59,0.18)' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: n.locked ? 0.35 : 1,
              zIndex: n.current ? 5 : 1,
            }}
          >
            {n.done && <span style={{ color: '#FF3B3B', fontSize: '9px', fontWeight: 700 }}>✓</span>}
            {n.current && <span className="font-display" style={{ fontSize: '9px', color: '#fff', letterSpacing: '1px' }}>06</span>}
            {(n.checkpoint || n.locked) && <span style={{ fontSize: '8px' }}>🔒</span>}
          </div>
        ))}
        {/* HOJE label */}
        <div style={{ position: 'absolute', left: 100, top: 119, transform: 'translateX(-50%)', fontFamily: "'Share Tech Mono', monospace", fontSize: '5px', letterSpacing: '2px', color: '#FF3B3B', whiteSpace: 'nowrap' }}>
          ▶ HOJE
        </div>
        {/* DIA 7 ★ label */}
        <div style={{ position: 'absolute', left: 45, top: 155, transform: 'translateX(-50%)', fontFamily: "'Share Tech Mono', monospace", fontSize: '5px', letterSpacing: '1px', color: 'rgba(255,200,87,0.6)', whiteSpace: 'nowrap' }}>
          ★ DIA 7
        </div>
      </div>
    </div>
  );
}

function TrailScreen() {
  // Full trail view — shows days 1–8, day 6 = current
  const W_USE = 200; // usable width (220 - 10px padding each side)
  const PAD_X = 10;
  const XC = PAD_X + W_USE * 0.50; // 110
  const XL = PAD_X + W_USE * 0.22; // 54
  const XR = PAD_X + W_USE * 0.78; // 166

  const Y0 = 0; // first node relative to trail container
  const SP = 43; // spacing between node centers

  const nodes = [
    { dia: 1,  x: XC, status: 'completed' },
    { dia: 2,  x: XR, status: 'completed' },
    { dia: 3,  x: XR, status: 'completed' },
    { dia: 4,  x: XC, status: 'completed' },
    { dia: 5,  x: XL, status: 'completed' },
    { dia: 6,  x: XL, status: 'current'   },
    { dia: 7,  x: XC, status: 'checkpoint-locked' },
    { dia: 8,  x: XR, status: 'locked'    },
  ];

  const getY = (i: number) => Y0 + i * SP;
  const trailH = getY(nodes.length - 1) + 24;

  return (
    <div style={{ padding: '10px', background: '#0D0D0D', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '5px' }}>
        <div>
          <div className="font-display" style={{ fontSize: '12px', letterSpacing: '2px', color: '#F5F5F5' }}>TRILHA</div>
          <div className="font-mono-t" style={{ fontSize: '5px', letterSpacing: '1px', color: '#555' }}>DE EVOLUÇÃO</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="font-mono-t" style={{ fontSize: '5px', letterSpacing: '1px', color: '#555' }}>DIA ATUAL</div>
          <div className="font-display" style={{ fontSize: '22px', letterSpacing: '2px', color: '#FF3B3B', lineHeight: 1 }}>06</div>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 8px', background: '#111', border: '1px solid #1a1a1a', borderRadius: '4px', marginBottom: '8px' }}>
        {[['5/21', 'DIAS', '#FF3B3B'], ['24%', 'PROGRESSO', '#FF8C42'], ['SOLDADO', 'NÍVEL', '#FFC857']].map(([val, label, color]) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div className="font-mono-t" style={{ fontSize: '5px', letterSpacing: '1px', color: '#555' }}>{label}</div>
            <div className="font-display" style={{ fontSize: val === 'SOLDADO' ? '9px' : '12px', color, lineHeight: 1 }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(255,59,59,0.3), transparent)', marginBottom: '8px' }} />

      {/* Trail */}
      <div style={{ position: 'relative', width: '200px', height: `${trailH}px`, flexShrink: 0 }}>
        {/* SVG paths */}
        <svg style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible' }} width="220" height={trailH + 20}>
          {nodes.slice(0, -1).map((node, i) => {
            const x1 = node.x, y1 = getY(i);
            const x2 = nodes[i + 1].x, y2 = getY(i + 1);
            const cy = (y1 + y2) / 2;
            const comp = node.status === 'completed';
            const active = node.status === 'current' || nodes[i + 1].status === 'current';
            return (
              <path
                key={i}
                d={`M ${x1} ${y1} C ${x1} ${cy}, ${x2} ${cy}, ${x2} ${y2}`}
                fill="none"
                stroke={comp ? '#FF3B3B' : active ? '#FF8C42' : '#222'}
                strokeWidth={comp ? 2 : 1.5}
                strokeDasharray={comp ? undefined : '4 3'}
                opacity={comp ? 0.72 : 0.45}
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {nodes.map((node, i) => {
          const isCurrent = node.status === 'current';
          const isDone = node.status === 'completed';
          const isCPLocked = node.status === 'checkpoint-locked';
          const isLocked = node.status === 'locked';
          const size = isCurrent ? 34 : isDone ? 26 : 22;

          return (
            <div key={node.dia}>
              {/* Pulse ring for current */}
              {isCurrent && (
                <div style={{
                  position: 'absolute',
                  left: node.x, top: getY(i),
                  transform: 'translate(-50%, -50%)',
                  width: size + 12, height: size + 12,
                  borderRadius: '50%',
                  border: '1.5px solid rgba(255,59,59,0.4)',
                  animation: 'pulse-red 2s infinite',
                }} />
              )}
              <div style={{
                position: 'absolute',
                left: node.x, top: getY(i),
                transform: 'translate(-50%, -50%)',
                width: size, height: size,
                borderRadius: '50%',
                background: isCurrent
                  ? 'linear-gradient(135deg, #FF3B3B, #FF8C42)'
                  : isDone ? '#161616' : '#0f0f0f',
                border: `2px solid ${isCurrent ? '#FF3B3B' : isDone ? 'rgba(255,59,59,0.5)' : '#1e1e1e'}`,
                boxShadow: isCurrent
                  ? '0 0 18px rgba(255,59,59,0.6)'
                  : isDone ? '0 0 8px rgba(255,59,59,0.2)' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: isLocked ? 0.35 : isCPLocked ? 0.65 : 1,
                zIndex: isCurrent ? 5 : 1,
              }}>
                {isDone && <span style={{ color: '#FF3B3B', fontSize: '10px', fontWeight: 700 }}>✓</span>}
                {isCurrent && <span className="font-display" style={{ fontSize: '10px', color: '#fff', letterSpacing: '1px' }}>06</span>}
                {(isLocked || isCPLocked) && <span style={{ fontSize: '9px' }}>🔒</span>}
              </div>

              {/* Labels */}
              {isCurrent && (
                <div style={{ position: 'absolute', left: node.x, top: getY(i) + size / 2 + 3, transform: 'translateX(-50%)', fontFamily: "'Share Tech Mono', monospace", fontSize: '5px', letterSpacing: '2px', color: '#FF3B3B', whiteSpace: 'nowrap' }}>
                  ▶ HOJE
                </div>
              )}
              {isCPLocked && (
                <div style={{ position: 'absolute', left: node.x, top: getY(i) + 14, transform: 'translateX(-50%)', fontFamily: "'Share Tech Mono', monospace", fontSize: '5px', letterSpacing: '1px', color: 'rgba(255,200,87,0.65)', whiteSpace: 'nowrap' }}>
                  ★ DIA 7
                </div>
              )}
              {isDone && (
                <div style={{ position: 'absolute', left: node.x, top: getY(i) + 15, transform: 'translateX(-50%)', fontFamily: "'Share Tech Mono', monospace", fontSize: '5px', letterSpacing: '1px', color: 'rgba(255,255,255,0.2)', whiteSpace: 'nowrap' }}>
                  {String(node.dia).padStart(2, '0')}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MissionScreen() {
  return (
    <div style={{ padding: '12px', background: '#0D0D0D', height: '100%', overflowY: 'hidden' }}>
      <div className="font-mono-t" style={{ fontSize: '7px', color: '#FF3B3B', letterSpacing: '3px', marginBottom: '4px' }}>DIA 12 · SEMANA 2</div>
      <div className="font-display" style={{ fontSize: '18px', letterSpacing: '2px', color: '#F5F5F5', marginBottom: '10px', lineHeight: 1 }}>
        DETERMINAÇÃO<br />DO NETERO
      </div>
      {[
        { tag: 'CORPO', content: '60 flex · 80 agach · 75s prancha', color: '#FF3B3B', done: true },
        { tag: 'MENTE', content: 'Praticar gratidão — 3 coisas boas', color: '#5B8CFF', done: true },
        { tag: 'DISCIPLINA', content: '1 hora sem celular', color: '#FFC857', done: false },
      ].map((m) => (
        <div
          key={m.tag}
          style={{
            padding: '8px 10px',
            marginBottom: '6px',
            background: m.done ? 'rgba(0,200,83,0.05)' : '#111',
            border: `1px solid ${m.done ? 'rgba(0,200,83,0.2)' : 'rgba(255,255,255,0.06)'}`,
            borderLeft: `3px solid ${m.done ? '#00C853' : m.color}`,
            borderRadius: '4px',
          }}
        >
          <div className="font-mono-t" style={{ fontSize: '6px', color: m.done ? '#00C853' : m.color, letterSpacing: '2px', marginBottom: '2px' }}>{m.tag}</div>
          <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '9px', color: m.done ? '#555' : '#bbb' }}>{m.content}</div>
          {m.done && <div style={{ fontSize: '8px', color: '#00C853', marginTop: '4px' }}>✓ CONCLUÍDO</div>}
        </div>
      ))}
    </div>
  );
}

function CheckpointScreen() {
  return (
    <div style={{ background: '#0D0D0D', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center' }}>
      <div style={{ fontSize: '40px', marginBottom: '10px' }}>🔥</div>
      <div className="font-mono-t" style={{ fontSize: '8px', letterSpacing: '4px', color: '#FFC857', marginBottom: '10px' }}>CHECKPOINT</div>
      <div className="font-display" style={{ fontSize: '28px', letterSpacing: '3px', color: '#F5F5F5', lineHeight: 1, marginBottom: '10px' }}>DIA 7<br />CONCLUÍDO</div>
      <div style={{ width: '30px', height: '1px', background: '#FF3B3B', margin: '10px auto' }} />
      <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '11px', color: '#888', lineHeight: 1.5, marginBottom: '16px' }}>
        A maioria já<br />desistiu. Você não.
      </div>
      <div style={{ background: '#FF3B3B', padding: '8px 20px', borderRadius: '4px', width: '100%' }}>
        <span className="font-display" style={{ fontSize: '12px', letterSpacing: '3px', color: '#fff' }}>CONTINUAR</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   SECTION: STICKY HEADER
══════════════════════════════════════════════════ */
function StickyHeader({ onCTA }: { onCTA: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const goToLogin = () => {
    if (typeof window !== 'undefined') window.location.href = '/login';
  };

  return (
    <motion.header
      animate={{ background: scrolled ? 'rgba(13,13,13,0.95)' : 'transparent' }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 100,
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      <div>
        <span className="font-display" style={{ fontSize: '20px', letterSpacing: '3px', color: '#F5F5F5' }}>
          SALA DO <span style={{ color: '#FF3B3B' }}>TEMPO</span>
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button
          onClick={goToLogin}
          aria-label="Já tenho conta"
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.18)',
            borderRadius: '4px',
            padding: '7px 14px',
            color: '#F5F5F5',
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '10px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Já tenho conta
        </button>

        {scrolled && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onCTA}
            style={{
              background: '#FF3B3B',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 20px',
              color: '#fff',
              fontFamily: "'Bebas Neue', cursive",
              fontSize: '14px',
              letterSpacing: '3px',
            }}
          >
            GARANTIR ACESSO
          </motion.button>
        )}
      </div>
    </motion.header>
  );
}

/* ══════════════════════════════════════════════════
   SECTION 1: HERO
══════════════════════════════════════════════════ */
function HeroSection({ onCTA }: { onCTA: () => void }) {
  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '80px 24px 60px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glows */}
      <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(255,59,59,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-100px', right: '-100px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(255,200,87,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div className="noise" style={{ position: 'absolute', inset: 0 }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 0 }}>
        {/* Mobile: stacked | Desktop: side by side */}
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: '48px' }}>

          {/* Left — Copy */}
          <div style={{ flex: '1 1 320px', minWidth: '280px' }}>
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              style={{ marginBottom: '20px' }}
            >
              <Tag color="red">⚔ 21 DIAS · EXECUÇÃO REAL · SEM DESCULPA</Tag>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display"
              style={{ fontSize: 'clamp(52px, 10vw, 96px)', letterSpacing: '4px', lineHeight: 0.9, color: '#F5F5F5', marginBottom: '16px' }}
            >
              SALA DO<br />
              <span style={{ color: '#FF3B3B' }}>TEMPO</span><br />
              <span style={{ fontSize: 'clamp(28px, 5vw, 48px)', color: '#888', letterSpacing: '6px' }}>21 DIAS</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{ width: '48px', height: '2px', background: '#FF3B3B', marginBottom: '24px' }}
            />

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '18px', fontWeight: 600, color: '#888', lineHeight: 1.6, marginBottom: '32px', maxWidth: '460px' }}
            >
              Não é mais um aplicativo de hábitos.<br />
              É o sistema que <span style={{ color: '#F5F5F5', fontWeight: 700 }}>força você a agir</span> mesmo quando não quer.
            </motion.p>

            {/* Value props */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '36px' }}
            >
              {[
                '21 missões diárias de Corpo, Mente e Disciplina',
                'Progressão real com consequência por falha',
                'Bônus desbloqueados conforme você avança',
                'Modo Guerra para quem quer pressão máxima',
              ].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ color: '#00C853', fontSize: '14px', flexShrink: 0, marginTop: '2px' }}>→</span>
                  <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '15px', fontWeight: 600, color: '#ccc', letterSpacing: '0.3px' }}>{item}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                onClick={onCTA}
                whileTap={{ scale: 0.97 }}
                className="pulse-red"
                style={{
                  width: '100%',
                  maxWidth: '400px',
                  background: '#FF3B3B',
                  border: 'none',
                  borderRadius: '5px',
                  padding: '18px',
                  cursor: 'pointer',
                  marginBottom: '12px',
                  display: 'block',
                }}
              >
                <span className="font-display" style={{ fontSize: '22px', letterSpacing: '5px', color: '#fff' }}>
                  QUERO COMEÇAR AGORA
                </span>
              </motion.button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', opacity: 0.5 }}>
                {['✓ Acesso imediato', '✓ 7 dias de garantia', '✓ PWA — sem instalar app'].map((t) => (
                  <span key={t} className="font-mono-t" style={{ fontSize: '8px', letterSpacing: '1px', color: '#888' }}>{t}</span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right — Phone mockups */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{
              flex: '0 0 auto',
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ marginTop: '50px' }}>
              <PhoneMockup screen={<HomeScreen />} />
            </div>
            <div style={{ marginTop: '-20px' }}>
              <PhoneMockup screen={<TrailScreen />} />
            </div>
            <div style={{ marginTop: '30px' }}>
              <PhoneMockup screen={<MissionScreen />} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════
   SECTION: TICKER BAR
══════════════════════════════════════════════════ */
function TickerBar() {
  const items = [
    '21 DIAS DE EXECUÇÃO',
    'SEM DESCULPA',
    'CORPO · MENTE · DISCIPLINA',
    'MISSÕES DIÁRIAS',
    'MODO GUERRA',
    'CHECKPOINT DIA 7',
    'CHECKPOINT DIA 14',
    'STREAK SEM FALHA',
    'SARGENTO NO DIA 21',
  ];

  return (
    <div style={{ borderTop: '1px solid rgba(255,59,59,0.2)', borderBottom: '1px solid rgba(255,59,59,0.2)', background: 'rgba(255,59,59,0.04)', padding: '10px 0', overflow: 'hidden' }}>
      <div className="ticker-wrap">
        <div className="ticker-inner">
          {[...items, ...items].map((item, i) => (
            <span key={i} className="font-mono-t" style={{ fontSize: '10px', letterSpacing: '4px', color: 'rgba(255,59,59,0.7)', padding: '0 32px', whiteSpace: 'nowrap' }}>
              ⚔ {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   SECTION: SOCIAL PROOF NUMBERS
══════════════════════════════════════════════════ */
function SocialProofBar() {
  const stats = [
    { val: '2.400+', label: 'ALUNOS ATIVOS', color: '#FF3B3B' },
    { val: '18.000+', label: 'DIAS EXECUTADOS', color: '#FFC857' },
    { val: '89%', label: 'COMPLETAM A SEMANA 1', color: '#00C853' },
    { val: '4.8★', label: 'AVALIAÇÃO MÉDIA', color: '#FFC857' },
  ];

  return (
    <section style={{ padding: '60px 24px', background: '#0a0a0a', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '24px' }}>
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div style={{ textAlign: 'center', padding: '24px', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', background: '#111' }}>
                <div className="font-display" style={{ fontSize: '44px', letterSpacing: '2px', color: s.color, lineHeight: 1, marginBottom: '8px' }}>
                  {s.val}
                </div>
                <div className="font-mono-t" style={{ fontSize: '8px', letterSpacing: '3px', color: '#555', textTransform: 'uppercase' }}>
                  {s.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════
   SECTION: PROBLEM
══════════════════════════════════════════════════ */
function ProblemSection() {
  const problems = [
    { icon: '📱', text: 'Abre o celular às 8h e acorda às 23h que não fez nada.' },
    { icon: '🔁', text: 'Começa toda semana segunda, para na quinta.' },
    { icon: '💤', text: 'Sabe exatamente o que precisa fazer — e não faz.' },
    { icon: '😤', text: 'Fica motivado por 3 dias e perde o ritmo no quarto.' },
    { icon: '⏳', text: 'Diz que vai mudar "quando tiver mais tempo".' },
  ];

  return (
    <section style={{ padding: '80px 24px', position: 'relative', overflow: 'hidden' }}>
      <div className="noise" style={{ position: 'absolute', inset: 0 }} />
      <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
        <Reveal>
          <Tag color="red">O PROBLEMA</Tag>
          <h2
            className="font-display"
            style={{ fontSize: 'clamp(36px, 6vw, 60px)', letterSpacing: '3px', color: '#F5F5F5', lineHeight: 1, margin: '16px 0 12px' }}
          >
            VOCÊ SABE O QUE<br />FAZER.
          </h2>
          <h2
            className="font-display"
            style={{ fontSize: 'clamp(36px, 6vw, 60px)', letterSpacing: '3px', color: '#FF3B3B', lineHeight: 1, marginBottom: '32px' }}
          >
            SÓ NÃO FAZ.
          </h2>
          <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '17px', fontWeight: 500, color: '#888', lineHeight: 1.7, marginBottom: '40px', maxWidth: '560px' }}>
            Não é falta de informação. Não é falta de motivação.
            É ausência de <span style={{ color: '#F5F5F5', fontWeight: 700 }}>estrutura e consequência real</span>.
            Sem isso, você fica no mesmo ciclo para sempre.
          </p>
        </Reveal>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {problems.map((p, i) => (
            <Reveal key={p.text} delay={i * 0.07}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px 20px',
                  background: '#0f0f0f',
                  border: '1px solid rgba(255,59,59,0.15)',
                  borderLeft: '3px solid rgba(255,59,59,0.4)',
                  borderRadius: '6px',
                }}
              >
                <span style={{ fontSize: '20px', flexShrink: 0 }}>{p.icon}</span>
                <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '16px', fontWeight: 600, color: '#bbb', letterSpacing: '0.3px' }}>
                  {p.text}
                </span>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.4}>
          <div
            style={{
              marginTop: '40px',
              padding: '24px',
              background: 'rgba(255,59,59,0.05)',
              border: '1px solid rgba(255,59,59,0.2)',
              borderRadius: '8px',
            }}
          >
            <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '20px', fontWeight: 700, color: '#F5F5F5', lineHeight: 1.5, textAlign: 'center' }}>
              A verdade é simples:{' '}
              <span style={{ color: '#FF3B3B' }}>você precisa de um sistema que não te deixe sair do caminho.</span>
              <br />Não de mais informação.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════
   SECTION: SOLUTION
══════════════════════════════════════════════════ */
function SolutionSection() {
  return (
    <section style={{ padding: '80px 24px', background: '#0a0a0a' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Reveal>
          <Tag color="yellow">A SOLUÇÃO</Tag>
          <h2
            className="font-display"
            style={{ fontSize: 'clamp(38px, 7vw, 72px)', letterSpacing: '4px', color: '#F5F5F5', lineHeight: 0.95, margin: '16px 0 24px' }}
          >
            21 DIAS.<br />
            3 MISSÕES.<br />
            <span style={{ color: '#FFC857' }}>UM PADRÃO.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '18px', fontWeight: 500, color: '#888', lineHeight: 1.7, marginBottom: '48px', maxWidth: '580px' }}>
            Sala do Tempo 21 é um PWA — funciona no celular como app, sem instalar nada.
            Cada dia você recebe <span style={{ color: '#F5F5F5', fontWeight: 700 }}>3 missões</span> calibradas ao seu nível.
            Você executa. O sistema registra. O streak constrói identidade.
          </p>
        </Reveal>

        {/* Three pillars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '48px' }}>
          {[
            { label: 'CORPO', color: '#FF3B3B', icon: '💪', desc: 'Exercícios progressivos adaptados ao seu nível. De 20 flexões no dia 1 a 105 no dia 21.' },
            { label: 'MENTE', color: '#5B8CFF', icon: '🧠', desc: 'Foco, leitura, meditação e definição de objetivos. A parte que todo mundo ignora.' },
            { label: 'DISCIPLINA', color: '#FFC857', icon: '⚡', desc: 'Hábitos de identidade. Arrumar cama, banho frio, sem celular. O que você faz quando ninguém vê.' },
          ].map((p, i) => (
            <Reveal key={p.label} delay={i * 0.1}>
              <div
                style={{
                  padding: '24px',
                  background: '#111',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderTop: `3px solid ${p.color}`,
                  borderRadius: '6px',
                }}
              >
                <div style={{ fontSize: '28px', marginBottom: '12px' }}>{p.icon}</div>
                <div className="font-mono-t" style={{ fontSize: '9px', letterSpacing: '4px', color: p.color, marginBottom: '10px' }}>{p.label}</div>
                <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '14px', fontWeight: 500, color: '#888', lineHeight: 1.6 }}>{p.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════
   SECTION: MEMENTO MORI
══════════════════════════════════════════════════ */
function MementoMoriSection() {
  // 4160 semanas = 80 anos (vida média)
  // Para visualização: mostrar 52 semanas x 10 anos = 520 semanas (amostra)
  const WEEKS_PREVIEW = 520; // 52 semanas x 10 anos
  const WEEKS_PER_ROW = 52;
  const rows = Math.ceil(WEEKS_PREVIEW / WEEKS_PER_ROW);
  const weeks = Array.from({ length: WEEKS_PREVIEW }, (_, i) => i + 1);

  return (
    <section style={{ padding: '80px 24px', background: '#0a0a0a', borderTop: '1px solid rgba(255,59,59,0.1)', borderBottom: '1px solid rgba(255,59,59,0.1)' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <Reveal>
          <Tag color="red">MEMENTO MORI</Tag>
          <h2
            className="font-display"
            style={{ fontSize: 'clamp(36px, 6vw, 64px)', letterSpacing: '4px', color: '#F5F5F5', margin: '16px 0 12px' }}
          >
            4.160 SEMANAS.<br />
            <span style={{ color: '#FF3B3B' }}>QUANTAS JÁ SE FORAM?</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '17px', fontWeight: 500, color: '#888', marginBottom: '40px', maxWidth: '700px', lineHeight: 1.7 }}>
            Cada <span style={{ color: '#F5F5F5', fontWeight: 700 }}>quadrado é uma semana</span>. Cores vermelhas = semanas que já se foram. Cores cinzas = semanas que você ainda tem. Isso aqui é uma amostra de 10 anos. 4.160 total.
          </p>
        </Reveal>

        {/* Visual grid */}
        <Reveal delay={0.2}>
          <div style={{ marginBottom: '48px', padding: '32px', background: '#0D0D0D', border: '1px solid rgba(255,59,59,0.2)', borderRadius: '8px', overflow: 'auto' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${WEEKS_PER_ROW}, 1fr)`,
              gap: '2px',
              minWidth: '100%',
            }}>
              {weeks.map((week, idx) => (
                <div
                  key={week}
                  style={{
                    width: '8px',
                    height: '8px',
                    background: idx < 260 ? 'rgba(255, 59, 59, 0.3)' : 'rgba(136, 136, 136, 0.4)',
                    borderRadius: '1px',
                  }}
                />
              ))}
            </div>
            <div style={{ marginTop: '16px', display: 'flex', gap: '24px', fontSize: '12px', fontFamily: "'Share Tech Mono', monospace" }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', background: 'rgba(255, 59, 59, 0.3)', borderRadius: '2px' }} />
                <span style={{ color: '#FF3B3B' }}>SEMANAS PASSADAS</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', background: 'rgba(136, 136, 136, 0.4)', borderRadius: '2px' }} />
                <span style={{ color: '#888' }}>SEMANAS RESTANTES</span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Impactful message */}
        <Reveal delay={0.3}>
          <div style={{ padding: '32px', background: 'rgba(255,59,59,0.08)', border: '2px solid rgba(255,59,59,0.3)', borderRadius: '8px', textAlign: 'center' }}>
            <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(16px, 4vw, 24px)', fontWeight: 700, color: '#F5F5F5', lineHeight: 1.6, marginBottom: '16px' }}>
              Você não é imortal. Seus 80 anos<br />
              <span style={{ color: '#FF3B3B' }}>não são infinitos.</span>
            </p>
            <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '15px', fontWeight: 500, color: '#888', lineHeight: 1.6 }}>
              Mas os próximos 21 dias? Esses você controla. Esses você pode transformar em ação real. Esses você pode usar para construir quem você quer ser.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════
   SECTION: HOW IT WORKS
══════════════════════════════════════════════════ */
function HowItWorksSection() {
  const steps = [
    {
      num: '01',
      title: 'VOCÊ ENTRA POR DECISÃO',
      desc: 'Acessa o PWA, define seu nível (iniciante, intermediário, avançado) e escolhe seu modo. Normal ou Guerra. Sem terceira opção.',
      screen: <HomeScreen />,
    },
    {
      num: '02',
      title: 'PERCORRE A TRILHA DE 21 DIAS',
      desc: 'A Trilha de Evolução mostra seu caminho completo. Cada nó é um dia. Concluídos brilham em vermelho. O dia atual pulsa. Bloqueados te lembram do que ainda falta conquistar.',
      screen: <TrailScreen />,
    },
    {
      num: '03',
      title: 'EXECUTA AS 3 MISSÕES',
      desc: 'Todo dia 3 missões: Corpo, Mente e Disciplina. Você marca concluído — ou declara falha. Sem meio-termo. Sem "vou compensar amanhã".',
      screen: <MissionScreen />,
    },
    {
      num: '04',
      title: 'ACUMULA O STREAK',
      desc: 'Cada dia executado avança seu nível. Recruta → Soldado → Cabo → Sargento. Falhar reseta — mas checkpoints nos dias 7 e 14 protegem o progresso que você já conquistou.',
      screen: <CheckpointScreen />,
    },
  ];

  return (
    <section style={{ padding: '80px 24px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <Reveal style={{ textAlign: 'center', marginBottom: '60px' }}>
          <Tag color="red">COMO FUNCIONA</Tag>
          <h2
            className="font-display"
            style={{ fontSize: 'clamp(36px, 6vw, 64px)', letterSpacing: '4px', color: '#F5F5F5', margin: '16px 0' }}
          >
            SIMPLES. DIRETO.<br />
            <span style={{ color: '#FF3B3B' }}>SEM COMPLICAÇÃO.</span>
          </h2>
        </Reveal>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
          {steps.map((step, i) => (
            <Reveal key={step.num} delay={0.1}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: i % 2 === 0 ? 'row' : 'row-reverse',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: '48px',
                }}
              >
                {/* Text */}
                <div style={{ flex: '1 1 300px' }}>
                  <div
                    className="font-display"
                    style={{ fontSize: '80px', letterSpacing: '4px', color: 'rgba(255,59,59,0.08)', lineHeight: 1, marginBottom: '-10px' }}
                  >
                    {step.num}
                  </div>
                  <h3
                    className="font-display"
                    style={{ fontSize: 'clamp(22px, 4vw, 36px)', letterSpacing: '3px', color: '#F5F5F5', lineHeight: 1.1, marginBottom: '16px' }}
                  >
                    {step.title}
                  </h3>
                  <div style={{ width: '32px', height: '2px', background: '#FF3B3B', marginBottom: '16px' }} />
                  <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '17px', fontWeight: 500, color: '#888', lineHeight: 1.7 }}>
                    {step.desc}
                  </p>
                </div>

                {/* Phone */}
                <div style={{ flex: '0 0 auto', display: 'flex', justifyContent: 'center' }}>
                  <motion.div
                    whileHover={{ y: -8, rotate: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <PhoneMockup screen={step.screen} />
                  </motion.div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════
   SECTION: MISSIONS PREVIEW
══════════════════════════════════════════════════ */
function MissionsSection() {
  const missions = [
    { dia: 1, nome: 'FORÇA DO GOKU', exercicios: 'Flexões 20 · Agachamentos 30 · Prancha 30s' },
    { dia: 7, nome: 'CHECKPOINT — SOBREVIVENTE', exercicios: 'Flexões 45 · Agachamentos 55 · Burpees 20' },
    { dia: 14, nome: 'CHECKPOINT — GUERREIRO', exercicios: 'Flexões 70 · Agachamentos 90 · Mountain Climbers 50' },
    { dia: 21, nome: 'SARGENTO — MISSÃO FINAL', exercicios: 'Flexões 105 · Agachamentos 125 · Prancha 120s' },
  ];

  return (
    <section style={{ padding: '80px 24px', background: '#080808' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Reveal>
          <Tag color="yellow">AS MISSÕES</Tag>
          <h2
            className="font-display"
            style={{ fontSize: 'clamp(34px, 6vw, 60px)', letterSpacing: '4px', color: '#F5F5F5', margin: '16px 0 12px' }}
          >
            21 DIAS DE<br />
            <span style={{ color: '#FFC857' }}>PROGRESSÃO REAL</span>
          </h2>
          <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '17px', fontWeight: 500, color: '#888', marginBottom: '40px', maxWidth: '560px', lineHeight: 1.6 }}>
            Cada dia tem nome, missão e dificuldade crescente. O sistema escala com você — sem pular etapa.
          </p>
        </Reveal>

        {/* Timeline preview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '40px' }}>
          {missions.map((m, i) => (
            <Reveal key={m.dia} delay={i * 0.08}>
              <div
                style={{
                  padding: '20px',
                  background: '#111',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderTop: `3px solid ${i === 3 ? '#FFC857' : i === 0 ? '#00C853' : '#FF3B3B'}`,
                  borderRadius: '6px',
                }}
              >
                <div className="font-mono-t" style={{ fontSize: '8px', letterSpacing: '3px', color: '#555', marginBottom: '6px' }}>DIA {m.dia}</div>
                <div className="font-display" style={{ fontSize: '15px', letterSpacing: '1px', color: '#F5F5F5', lineHeight: 1.2, marginBottom: '8px' }}>{m.nome}</div>
                <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '11px', color: '#666' }}>{m.exercicios}</div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Full 21-day grid */}
        <Reveal>
          <div
            style={{
              padding: '24px',
              background: '#0f0f0f',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '8px',
            }}
          >
            <div className="font-mono-t" style={{ fontSize: '8px', letterSpacing: '3px', color: '#555', marginBottom: '16px' }}>PROGRESSÃO COMPLETA — 21 DIAS</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {Array.from({ length: 21 }, (_, i) => {
                const dia = i + 1;
                const isCheckpoint = dia === 7 || dia === 14 || dia === 21;
                return (
                  <div
                    key={dia}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '4px',
                      background: isCheckpoint ? 'rgba(255,200,87,0.1)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${isCheckpoint ? 'rgba(255,200,87,0.35)' : 'rgba(255,255,255,0.07)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <span
                      className="font-mono-t"
                      style={{ fontSize: '9px', color: isCheckpoint ? '#FFC857' : '#555' }}
                    >
                      {dia}
                    </span>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: '12px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <span className="font-mono-t" style={{ fontSize: '8px', color: '#FFC857', letterSpacing: '2px' }}>🏆 = CHECKPOINT (DIA 7, 14, 21)</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════
   SECTION: BONUS
══════════════════════════════════════════════════ */
function BonusPhoneMockup({ capa, label, color }: { capa?: string; label?: string; color: string }) {
  return (
    <div
      style={{
        width: '210px',
        height: '420px',
        borderRadius: '32px',
        border: '2px solid rgba(255,255,255,0.12)',
        background: '#0a0a0a',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: `0 32px 64px rgba(0,0,0,0.6), 0 0 24px ${color}26, 0 0 0 1px rgba(255,255,255,0.04)`,
        flexShrink: 0,
      }}
      className="scan-line"
    >
      {/* Notch */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '70px',
          height: '18px',
          background: '#0a0a0a',
          borderRadius: '0 0 12px 12px',
          zIndex: 10,
        }}
      />
      {/* Capa do bônus em proporção 9:16 ocupando a tela inteira do mockup */}
      {capa && (
        <Image
          src={capa}
          alt={label ?? 'Capa do bônus'}
          fill
          sizes="220px"
          style={{ objectFit: 'cover' }}
          priority={false}
        />
      )}
      {/* Noise overlay sutil */}
      <div className="noise" style={{ position: 'absolute', inset: 0, zIndex: 5, opacity: 0.4 }} />
      {/* Glow inferior na cor do bônus */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(to top, ${color}30 0%, transparent 35%)`,
          zIndex: 6,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

function FocoMockup() {
  // Mini representação da página /foco — dá noção visual do volume sem
  // depender de uma capa única.
  const blocos: Array<{ label: string; color: string }> = [
    { label: 'FOCO E PRODUTIVIDADE', color: '#B452FF' },
    { label: 'ROTINA', color: '#FF8C42' },
    { label: 'LEITURA', color: '#FFC857' },
    { label: 'DINHEIRO', color: '#00C853' },
    { label: 'RENDA EXTRA', color: '#FF3B3B' },
  ];

  return (
    <div
      style={{
        width: '210px',
        height: '420px',
        borderRadius: '32px',
        border: '2px solid rgba(91,140,255,0.35)',
        background: '#0a0a0a',
        overflow: 'hidden',
        position: 'relative',
        boxShadow:
          '0 32px 64px rgba(0,0,0,0.6), 0 0 28px rgba(91,140,255,0.25), 0 0 0 1px rgba(91,140,255,0.08)',
        flexShrink: 0,
      }}
      className="scan-line"
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '70px',
          height: '18px',
          background: '#0a0a0a',
          borderRadius: '0 0 12px 12px',
          zIndex: 10,
        }}
      />
      <div className="noise" style={{ position: 'absolute', inset: 0, zIndex: 5, opacity: 0.3 }} />

      <div style={{ padding: '28px 14px 14px', height: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div className="font-mono-t" style={{ fontSize: '6px', letterSpacing: '2px', color: '#5B8CFF' }}>
            ESTADO MENTAL
          </div>
          <div className="font-display" style={{ fontSize: '11px', letterSpacing: '2px', color: '#F5F5F5' }}>
            FOCO
          </div>
        </div>

        {/* TRAINING card */}
        <div
          style={{
            border: '1px solid rgba(91,140,255,0.4)',
            borderRadius: '8px',
            padding: '8px 10px',
            background: 'linear-gradient(135deg, rgba(91,140,255,0.18), transparent)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <div
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: '#5B8CFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
            }}
          >
            ▶
          </div>
          <div style={{ flex: 1 }}>
            <div className="font-mono-t" style={{ fontSize: '5px', letterSpacing: '2px', color: '#5B8CFF' }}>
              SPOTIFY · PRIORIDADE
            </div>
            <div className="font-display" style={{ fontSize: '11px', letterSpacing: '2px', color: '#F5F5F5' }}>
              TRAINING
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '4px' }}>
          <span className="font-display" style={{ fontSize: '8px', letterSpacing: '2px', color: '#5B8CFF', borderBottom: '1px solid #5B8CFF', paddingBottom: '2px' }}>
            🎬 VÍDEOS
          </span>
          <span className="font-display" style={{ fontSize: '8px', letterSpacing: '2px', color: 'rgba(255,255,255,0.35)' }}>
            🎧 ÁUDIOS
          </span>
        </div>

        {/* Categorias */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          {blocos.map((b) => (
            <div
              key={b.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 6px',
                borderRadius: '4px',
                background: 'rgba(255,255,255,0.03)',
                borderLeft: `2px solid ${b.color}`,
              }}
            >
              <div
                style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: '3px',
                  background: `${b.color}30`,
                  border: `1px solid ${b.color}55`,
                }}
              />
              <span className="font-display" style={{ fontSize: '7px', letterSpacing: '2px', color: '#ccc' }}>
                {b.label}
              </span>
              <span className="font-mono-t" style={{ marginLeft: 'auto', fontSize: '6px', color: 'rgba(255,255,255,0.35)' }}>
                10
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            borderTop: '1px solid rgba(91,140,255,0.15)',
            paddingTop: '6px',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div className="font-mono-t" style={{ fontSize: '5px', letterSpacing: '2px', color: 'rgba(255,255,255,0.35)' }}>
              VÍDEOS
            </div>
            <div className="font-display" style={{ fontSize: '14px', letterSpacing: '1px', color: '#5B8CFF' }}>
              50+
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="font-mono-t" style={{ fontSize: '5px', letterSpacing: '2px', color: 'rgba(255,255,255,0.35)' }}>
              ÁUDIOS
            </div>
            <div className="font-display" style={{ fontSize: '14px', letterSpacing: '1px', color: '#FFC857' }}>
              MODOS
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MangaMockup() {
  const series = [
    { label: 'BLACK CLOVER', color: '#FF3B3B', vols: 20 },
    { label: 'TEPPU', color: '#FFC857', vols: 8 },
    { label: 'ROOSTER FIGHTER', color: '#FF8C42', vols: 5 },
    { label: 'SHINGEKI BTF', color: '#5B8CFF', vols: 6 },
    { label: 'INAZUMA ELEVEN', color: '#00C853', vols: 7 },
  ];

  return (
    <div
      style={{
        width: '210px',
        height: '420px',
        borderRadius: '32px',
        border: '2px solid rgba(255,59,59,0.35)',
        background: '#0a0a0a',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 32px 64px rgba(0,0,0,0.6), 0 0 28px rgba(255,59,59,0.2), 0 0 0 1px rgba(255,59,59,0.08)',
        flexShrink: 0,
      }}
      className="scan-line"
    >
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '70px', height: '18px', background: '#0a0a0a', borderRadius: '0 0 12px 12px', zIndex: 10 }} />
      <div className="noise" style={{ position: 'absolute', inset: 0, zIndex: 5, opacity: 0.3 }} />

      <div style={{ padding: '28px 14px 14px', height: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div className="font-mono-t" style={{ fontSize: '6px', letterSpacing: '2px', color: '#FF3B3B' }}>BÔNUS EXCLUSIVO</div>
          <div className="font-display" style={{ fontSize: '11px', letterSpacing: '2px', color: '#F5F5F5' }}>MANGÁ</div>
        </div>

        {/* Progress bar */}
        <div style={{ height: '3px', background: '#1a1a1a', borderRadius: '2px', overflow: 'hidden', marginBottom: '2px' }}>
          <div style={{ width: '14%', height: '100%', background: 'linear-gradient(to right, #FF3B3B, #FFC857)' }} />
        </div>
        <div className="font-mono-t" style={{ fontSize: '6px', letterSpacing: '1px', color: '#555' }}>3 / 46 VOLUMES DESBLOQUEADOS</div>

        {/* Séries */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1, marginTop: '4px' }}>
          {series.map((s) => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 7px', borderRadius: '4px', background: 'rgba(255,255,255,0.02)', borderLeft: `2px solid ${s.color}` }}>
              <div style={{ flex: 1 }}>
                <div className="font-display" style={{ fontSize: '8px', letterSpacing: '1.5px', color: '#ccc' }}>{s.label}</div>
                <div className="font-mono-t" style={{ fontSize: '5px', letterSpacing: '1px', color: '#444' }}>{s.vols} VOLUMES</div>
              </div>
              <div style={{ display: 'flex', gap: '1px' }}>
                {Array.from({ length: Math.min(s.vols, 6) }).map((_, i) => (
                  <div key={i} style={{ width: '5px', height: '8px', borderRadius: '1px', background: i < 2 ? s.color : 'rgba(255,255,255,0.08)' }} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid rgba(255,59,59,0.15)', paddingTop: '6px', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <div className="font-mono-t" style={{ fontSize: '5px', letterSpacing: '1px', color: 'rgba(255,255,255,0.25)' }}>VOLUMES</div>
            <div className="font-display" style={{ fontSize: '14px', letterSpacing: '1px', color: '#FF3B3B' }}>46+</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="font-mono-t" style={{ fontSize: '5px', letterSpacing: '1px', color: 'rgba(255,255,255,0.25)' }}>SÉRIES</div>
            <div className="font-display" style={{ fontSize: '14px', letterSpacing: '1px', color: '#FFC857' }}>5</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BonusSection() {
  const bonuses: Array<{
    num: string;
    dia: string;
    titulo: string;
    sub: string;
    desc: string;
    bullets: string[];
    valor: string;
    color: string;
    capa?: string;
    custom?: 'foco' | 'manga';
  }> = [
    {
      num: '01',
      dia: 'DIA 1',
      titulo: 'Plano Diário',
      sub: 'Protocolo Diário de Alta Performance',
      desc:
        'A checklist que substitui a sua "vontade" por um sistema. Você abre, marca, executa. Sem decidir nada.',
      bullets: [
        '18 itens em Manhã, Dia e Noite',
        'Auto-save a cada toque — zero atrito',
        'Reset automático na virada do dia',
      ],
      valor: 'R$ 97',
      color: '#FF3B3B',
      capa: '/bonus-covers/plano-diario.png',
    },
    {
      num: '02',
      dia: 'DIA 7',
      titulo: 'Protocolo Anti-Vício',
      sub: 'Corte de Estímulo e Recuperação de Controle',
      desc:
        'Para quem perdeu controle com pornografia, apostas, redes sociais ou qualquer dopamina barata. Não é palestra. É plano de bloqueio.',
      bullets: [
        'Bloqueio técnico (apps, redes, CPF em apostas)',
        'Mudança de ambiente — onde você cai mais',
        'Plano de substituição em vez de força de vontade',
      ],
      valor: 'R$ 147',
      color: '#FFC857',
      capa: '/bonus-covers/protocolo-anti-vicio.png',
    },
    {
      num: '03',
      dia: 'DIA 14',
      titulo: 'Código da Disciplina Militar',
      sub: 'Fundamentos de Execução',
      desc:
        'Os princípios que separam quem executa de quem só fala. 12 telas em formato story. Lê em 3 minutos. Carrega para a vida toda.',
      bullets: [
        '12 telas em formato story (3 min)',
        'Princípios extraídos de doutrinas militares',
        'Pronto para reler em momentos de fraqueza',
      ],
      valor: 'R$ 67',
      color: '#5B8CFF',
      capa: '/bonus-covers/codigo-disciplina.png',
    },
    {
      num: '04',
      dia: 'DIA 21',
      titulo: 'Grupo WhatsApp Exclusivo',
      sub: 'Comunidade de quem completou',
      desc:
        'O grupo só recebe quem fechou 21 dias. Accountability real entre quem provou execução. Não é grupo de "motivação".',
      bullets: [
        'Entrada apenas pós-conclusão dos 21 dias',
        'Cobrança real entre quem provou consistência',
        'Networking com perfil filtrado',
      ],
      valor: 'R$ 197',
      color: '#00C853',
      capa: '/bonus-covers/grupo-whatsapp.png',
    },
    {
      num: '05',
      dia: 'IMEDIATO',
      titulo: 'FOCO — Biblioteca Completa',
      sub: 'Vídeos curados + Áudios para concentração',
      desc:
        'Mais de 50 vídeos selecionados em 5 categorias estratégicas e biblioteca de áudios para 3 modos de execução. O recurso que você abre antes de agir.',
      bullets: [
        '50+ vídeos: Foco e Produtividade, Rotina, Leitura, Dinheiro, Renda Extra',
        'Áudios para Modo Foco, Modo Reset e Modo Profundo',
        'Player nativo: continua tocando com a tela bloqueada',
        'TRAINING: playlist Spotify pra entrar em estado em 1 toque',
      ],
      valor: 'R$ 297',
      color: '#5B8CFF',
      custom: 'foco',
    },
    {
      num: '06',
      dia: 'IMEDIATO',
      titulo: 'Biblioteca Mangá',
      sub: '46+ volumes de 5 séries — liberados conforme você avança',
      desc:
        'Mais de 46 volumes de mangá curados para quem executa. Black Clover, Teppu, Rooster Fighter, Shingeki no Kyojin BTF e Inazuma Eleven. Bônus que você desbloqueia dia a dia.',
      bullets: [
        '46+ volumes em 5 séries selecionadas a dedo',
        'Leitura direto no PWA — sem app extra',
        'Volumes liberados conforme você avança na trilha',
      ],
      valor: 'R$ 147',
      color: '#FF3B3B',
      custom: 'manga',
    },
  ];

  const totalBonus = 'R$ 952';

  return (
    <section style={{ padding: '80px 24px', position: 'relative', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(255,200,87,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '1080px', margin: '0 auto', position: 'relative' }}>
        <Reveal style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Tag color="yellow">BÔNUS INCLUSOS · NÃO SÃO BRINDES</Tag>
          <h2
            className="font-display"
            style={{
              fontSize: 'clamp(34px, 6vw, 60px)',
              letterSpacing: '4px',
              color: '#F5F5F5',
              margin: '16px auto 12px',
              maxWidth: '760px',
              lineHeight: 1,
            }}
          >
            6 BÔNUS QUE<br />
            <span style={{ color: '#FFC857' }}>VOCÊ DESBLOQUEIA EXECUTANDO</span>
          </h2>
          <p
            style={{
              fontFamily: 'Rajdhani, sans-serif',
              fontSize: '17px',
              fontWeight: 500,
              color: '#888',
              maxWidth: '620px',
              margin: '0 auto 12px',
              lineHeight: 1.6,
            }}
          >
            Não vão para o seu e-mail no primeiro dia. Você recebe à medida que prova execução —
            porque conteúdo dado não vira ação.
          </p>
          <div
            className="font-mono-t"
            style={{
              fontSize: '10px',
              letterSpacing: '3px',
              color: '#FFC857',
              textTransform: 'uppercase',
              marginBottom: '48px',
            }}
          >
            VALOR SE FOSSE VENDIDO SEPARADO · {totalBonus}
          </div>
        </Reveal>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {bonuses.map((b, i) => {
            const reverso = i % 2 === 1;
            return (
              <Reveal key={b.num} delay={i * 0.05}>
                <div
                  style={{
                    padding: '24px',
                    background: '#0f0f0f',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: reverso ? 'row-reverse' : 'row',
                    flexWrap: 'wrap',
                    gap: '32px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Glow lateral na cor do bônus */}
                  <div
                    style={{
                      position: 'absolute',
                      [reverso ? 'right' : 'left']: '-80px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '220px',
                      height: '220px',
                      background: `radial-gradient(circle, ${b.color}18 0%, transparent 70%)`,
                      pointerEvents: 'none',
                    }}
                  />

                  {/* Mockup */}
                  <div style={{ flexShrink: 0, position: 'relative' }}>
                    {b.custom === 'foco' ? (
                      <FocoMockup />
                    ) : b.custom === 'manga' ? (
                      <MangaMockup />
                    ) : (
                      <BonusPhoneMockup capa={b.capa} label={b.titulo} color={b.color} />
                    )}
                  </div>

                  {/* Conteúdo */}
                  <div style={{ flex: '1 1 280px', minWidth: '260px', maxWidth: '480px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <span
                        className="font-mono-t"
                        style={{ fontSize: '9px', letterSpacing: '3px', color: b.color }}
                      >
                        BÔNUS {b.num}
                      </span>
                      <span
                        style={{
                          fontFamily: 'Share Tech Mono, monospace',
                          fontSize: '8px',
                          letterSpacing: '2px',
                          color: '#888',
                          background: '#1a1a1a',
                          border: `1px solid ${b.color}40`,
                          borderRadius: '3px',
                          padding: '3px 8px',
                          textTransform: 'uppercase',
                        }}
                      >
                        LIBERAÇÃO · {b.dia}
                      </span>
                    </div>

                    <h3
                      className="font-display"
                      style={{
                        fontSize: 'clamp(24px, 3.4vw, 30px)',
                        letterSpacing: '2px',
                        color: '#F5F5F5',
                        marginBottom: '4px',
                        lineHeight: 1.05,
                      }}
                    >
                      {b.titulo}
                    </h3>
                    <div
                      className="font-mono-t"
                      style={{
                        fontSize: '9px',
                        letterSpacing: '2px',
                        color: '#666',
                        marginBottom: '14px',
                        textTransform: 'uppercase',
                      }}
                    >
                      {b.sub}
                    </div>

                    <p
                      style={{
                        fontFamily: 'Rajdhani, sans-serif',
                        fontSize: '15px',
                        fontWeight: 500,
                        color: '#aaa',
                        lineHeight: 1.55,
                        marginBottom: '14px',
                      }}
                    >
                      {b.desc}
                    </p>

                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {b.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '10px',
                            fontFamily: 'Rajdhani, sans-serif',
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#cfcfcf',
                            lineHeight: 1.5,
                          }}
                        >
                          <span style={{ color: b.color, flexShrink: 0, marginTop: '2px', fontSize: '12px' }}>▸</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>

                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'baseline',
                        gap: '8px',
                        padding: '8px 14px',
                        borderRadius: '6px',
                        background: `${b.color}10`,
                        border: `1px solid ${b.color}30`,
                      }}
                    >
                      <span
                        className="font-mono-t"
                        style={{ fontSize: '8px', letterSpacing: '2px', color: '#777', textTransform: 'uppercase' }}
                      >
                        Valor avulso
                      </span>
                      <span
                        className="font-display"
                        style={{ fontSize: '20px', letterSpacing: '2px', color: b.color }}
                      >
                        {b.valor}
                      </span>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Stack final de valor */}
        <Reveal delay={0.1}>
          <div
            style={{
              marginTop: '48px',
              padding: '28px 24px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(255,200,87,0.06), rgba(255,59,59,0.04))',
              border: '1px solid rgba(255,200,87,0.18)',
              textAlign: 'center',
            }}
          >
            <div
              className="font-mono-t"
              style={{
                fontSize: '10px',
                letterSpacing: '3px',
                color: '#FFC857',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}
            >
              Stack de bônus
            </div>
            <div
              className="font-display"
              style={{
                fontSize: 'clamp(26px, 4.2vw, 38px)',
                letterSpacing: '2px',
                color: '#F5F5F5',
                lineHeight: 1.15,
              }}
            >
              Se cada bônus fosse vendido separado:{' '}
              <span style={{ color: '#FFC857' }}>{totalBonus}</span>
            </div>
            <p
              style={{
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: '15px',
                fontWeight: 500,
                color: '#888',
                marginTop: '10px',
                maxWidth: '560px',
                margin: '10px auto 0',
                lineHeight: 1.5,
              }}
            >
              Você não compra os bônus. Você compra a Sala do Tempo. Os bônus vêm porque você
              precisa deles para sustentar o que conquistou nos 21 dias.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════
   SECTION: TESTIMONIALS
══════════════════════════════════════════════════ */
function TestimonialsSection() {
  const testimonials = [
    {
      nome: 'Lucas M.',
      cargo: 'Dia 21 concluído',
      texto: 'Não tem papo de motivação aqui. É missão, é streak, é consequência. Finalizei os 21 dias e minha rotina mudou de verdade.',
      stars: 5,
      nivel: 'SARGENTO',
    },
    {
      nome: 'Rafael S.',
      cargo: 'Dia 14 — Modo Guerra',
      texto: 'O Modo Guerra é brabo. Falha = dia 1. Isso muda a mentalidade. Você para de tentar e começa a executar porque sabe o custo.',
      stars: 5,
      nivel: 'GUERREIRO',
    },
    {
      nome: 'Thiago C.',
      cargo: 'Semana 2',
      texto: 'Nunca tinha chegado no dia 10 em nenhum desafio. Com esse app cheguei no dia 14 e percebi que o streak virou identidade.',
      stars: 5,
      nivel: 'CABO',
    },
    {
      nome: 'Pedro A.',
      cargo: 'Completou 2x',
      texto: 'Fiz o desafio duas vezes. A segunda com Modo Guerra. Diferente de tudo que já tentei. O app não te deixa fugir.',
      stars: 5,
      nivel: 'SARGENTO',
    },
    {
      nome: 'Bruno R.',
      cargo: 'Semana 1',
      texto: 'A frase do dia acerta na ferida toda vez. "Você não está cansado… só está acostumado a fugir." Sem papo de coach motivacional.',
      stars: 5,
      nivel: 'SOLDADO',
    },
    {
      nome: 'Caio F.',
      cargo: 'Dia 21 concluído',
      texto: 'O que diferencia é a consequência real. Outros apps você ignora. Aqui você sente o peso de zerar o streak. Isso funciona.',
      stars: 5,
      nivel: 'SARGENTO',
    },
  ];

  const levelColors: Record<string, string> = {
    'RECRUTA': '#888',
    'SOLDADO': '#5B8CFF',
    'CABO': '#FFC857',
    'GUERREIRO': '#FF3B3B',
    'SARGENTO': '#00C853',
  };

  return (
    <section style={{ padding: '80px 24px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <Reveal>
          <Tag color="green">RESULTADOS REAIS</Tag>
          <h2
            className="font-display"
            style={{ fontSize: 'clamp(34px, 6vw, 60px)', letterSpacing: '4px', color: '#F5F5F5', margin: '16px 0 12px' }}
          >
            QUEM EXECUTOU<br />
            <span style={{ color: '#00C853' }}>TRANSFORMOU.</span>
          </h2>
          <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '17px', fontWeight: 500, color: '#888', marginBottom: '48px', maxWidth: '520px', lineHeight: 1.6 }}>
            Sem print de antes e depois. Sem foto de balança. Só relatos de quem executou o protocolo do começo ao fim.
          </p>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {testimonials.map((t, i) => (
            <Reveal key={t.nome} delay={i * 0.06}>
              <div
                style={{
                  padding: '24px',
                  background: '#0f0f0f',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  height: '100%',
                }}
              >
                {/* Stars */}
                <div style={{ display: 'flex', gap: '2px' }}>
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <span key={i} style={{ color: '#FFC857', fontSize: '12px' }}>★</span>
                  ))}
                </div>

                {/* Quote */}
                <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '15px', fontWeight: 600, color: '#ccc', lineHeight: 1.65, flex: 1 }}>
                  "{t.texto}"
                </p>

                {/* Author */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '14px' }}>
                  <div>
                    <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '15px', fontWeight: 700, color: '#F5F5F5' }}>{t.nome}</div>
                    <div className="font-mono-t" style={{ fontSize: '8px', letterSpacing: '2px', color: '#555' }}>{t.cargo}</div>
                  </div>
                  <span
                    className="font-mono-t"
                    style={{
                      fontSize: '8px',
                      letterSpacing: '2px',
                      color: levelColors[t.nivel] || '#888',
                      background: `${levelColors[t.nivel] || '#888'}15`,
                      border: `1px solid ${levelColors[t.nivel] || '#888'}30`,
                      borderRadius: '3px',
                      padding: '2px 8px',
                    }}
                  >
                    {t.nivel}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════
   SECTION: PROGRESSION SYSTEM
══════════════════════════════════════════════════ */
function ProgressionSection() {
  const levels = [
    { nivel: 'RECRUTA', range: 'Dias 0–3', color: '#888', desc: 'Você está começando. O sistema te coloca nos trilhos.' },
    { nivel: 'SOLDADO', range: 'Dias 4–7', color: '#5B8CFF', desc: 'Primeiro checkpoint. A maioria já desistiu aqui.' },
    { nivel: 'CABO', range: 'Dias 8–14', color: '#FFC857', desc: 'Segundo checkpoint. Você virou rotina.' },
    { nivel: 'SARGENTO', range: 'Dias 15–21', color: '#FF3B3B', desc: 'Missão final. Apenas quem não desistiu chega aqui.' },
  ];

  return (
    <section style={{ padding: '80px 24px', background: '#0a0a0a' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Reveal>
          <Tag color="red">PROGRESSÃO</Tag>
          <h2 className="font-display" style={{ fontSize: 'clamp(32px, 5vw, 54px)', letterSpacing: '4px', color: '#F5F5F5', margin: '16px 0 40px' }}>
            DA RECRUTA<br />
            <span style={{ color: '#FF3B3B' }}>AO SARGENTO</span>
          </h2>
        </Reveal>

        <div style={{ position: 'relative' }}>
          {/* Vertical line */}
          <div style={{ position: 'absolute', left: '20px', top: 0, bottom: 0, width: '2px', background: 'rgba(255,255,255,0.05)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {levels.map((l, i) => (
              <Reveal key={l.nivel} delay={i * 0.1}>
                <div style={{ display: 'flex', gap: '24px', paddingBottom: '32px', position: 'relative' }}>
                  {/* Dot */}
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      border: `2px solid ${l.color}`,
                      background: `${l.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      zIndex: 1,
                    }}
                  >
                    <span className="font-display" style={{ fontSize: '12px', color: l.color }}>{i + 1}</span>
                  </div>

                  <div style={{ paddingTop: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <span className="font-display" style={{ fontSize: '22px', letterSpacing: '2px', color: l.color }}>{l.nivel}</span>
                      <span className="font-mono-t" style={{ fontSize: '8px', letterSpacing: '2px', color: '#444' }}>{l.range}</span>
                    </div>
                    <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '15px', fontWeight: 500, color: '#777', lineHeight: 1.5 }}>{l.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════
   SECTION: GUARANTEE
══════════════════════════════════════════════════ */
function GuaranteeSection() {
  return (
    <section style={{ padding: '80px 24px', background: '#080808', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
        <Reveal>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              border: '2px solid #00C853',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: '0 0 28px rgba(0,200,83,0.15)',
            }}
          >
            <span style={{ fontSize: '28px' }}>🛡</span>
          </div>

          <Tag color="green">GARANTIA</Tag>
          <h2 className="font-display" style={{ fontSize: 'clamp(32px, 5vw, 54px)', letterSpacing: '4px', color: '#F5F5F5', margin: '16px 0 16px' }}>
            7 DIAS DE<br />
            <span style={{ color: '#00C853' }}>GARANTIA TOTAL</span>
          </h2>

          <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '17px', fontWeight: 500, color: '#888', lineHeight: 1.7, marginBottom: '24px' }}>
            Se em 7 dias você achar que o produto não é o que esperava,
            devolvo 100% do seu dinheiro. Sem burocracia. Sem pergunta.
          </p>

          <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '15px', fontWeight: 600, color: '#555', lineHeight: 1.6 }}>
            Mas se você executar os primeiros 7 dias de verdade,
            vai querer ir até o final por conta própria.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════
   SECTION: FINAL CTA / PRICING
══════════════════════════════════════════════════ */
function FinalCTASection({ onCTA }: { onCTA: () => void }) {
  return (
    <section
      id="comprar"
      style={{
        padding: '80px 24px 100px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(255,59,59,0.07) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div className="noise" style={{ position: 'absolute', inset: 0 }} />

      <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
        <Reveal>
          <Tag color="red">ACESSO AGORA</Tag>
          <h2 className="font-display" style={{ fontSize: 'clamp(40px, 8vw, 80px)', letterSpacing: '4px', color: '#F5F5F5', margin: '16px 0 8px', lineHeight: 0.95 }}>
            VOCÊ NÃO PRECISA<br />
            <span style={{ color: '#FF3B3B' }}>DE MAIS TEMPO.</span>
          </h2>
          <p className="font-display" style={{ fontSize: 'clamp(18px, 3vw, 28px)', letterSpacing: '3px', color: '#888', marginBottom: '40px' }}>
            PRECISA COMEÇAR HOJE.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          {/* Price card */}
          <div
            style={{
              padding: '36px',
              background: '#0f0f0f',
              border: '1px solid rgba(255,59,59,0.2)',
              borderRadius: '12px',
              marginBottom: '24px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Top accent */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(to right, #FF3B3B, #FFC857)' }} />

            <div className="font-mono-t" style={{ fontSize: '9px', letterSpacing: '4px', color: '#555', marginBottom: '8px' }}>SALA DO TEMPO 21</div>
            {/* Anchor de valor — bônus avulsos somam R$ 952 */}
            <div className="font-mono-t" style={{ fontSize: '10px', letterSpacing: '3px', color: '#888', marginBottom: '4px' }}>
              <s style={{ color: '#555' }}>VALOR DOS BÔNUS · R$ 952</s>
            </div>
            <div className="font-display" style={{ fontSize: '56px', letterSpacing: '4px', color: '#FF3B3B', lineHeight: 1, marginBottom: '4px' }}>R$ 47</div>
            <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '13px', color: '#555', marginBottom: '28px' }}>
              Acesso vitalício · Sem mensalidade · Pagamento único
            </div>

            {/* Inclusions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px', textAlign: 'left' }}>
              {[
                ['✓', '21 missões completas (Corpo, Mente e Disciplina)', '#00C853'],
                ['✓', '6 bônus desbloqueados por progressão (R$ 952 em valor)', '#00C853'],
                ['✓', 'FOCO: 50+ vídeos curados + áudios para 3 modos de execução', '#00C853'],
                ['✓', 'PWA — abre no celular sem instalar', '#00C853'],
                ['✓', 'Sistema de streak e níveis (Recruta → Sargento)', '#00C853'],
                ['✓', 'Modo Normal e Modo Guerra disponíveis', '#00C853'],
                ['✓', '7 dias de garantia total', '#00C853'],
              ].map(([check, text, color]) => (
                <div key={text as string} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ color: color as string, flexShrink: 0, fontSize: '14px' }}>{check}</span>
                  <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '15px', fontWeight: 600, color: '#ccc', lineHeight: 1.4 }}>{text as string}</span>
                </div>
              ))}
            </div>

            <motion.button
              onClick={onCTA}
              whileTap={{ scale: 0.97 }}
              className="pulse-red"
              style={{
                width: '100%',
                background: '#FF3B3B',
                border: 'none',
                borderRadius: '5px',
                padding: '18px',
                cursor: 'pointer',
                marginBottom: '12px',
              }}
            >
              <span className="font-display" style={{ fontSize: '22px', letterSpacing: '5px', color: '#fff' }}>
                QUERO COMEÇAR AGORA
              </span>
            </motion.button>

            <div className="font-mono-t" style={{ fontSize: '8px', letterSpacing: '2px', color: '#444', textAlign: 'center' }}>
              PAGAMENTO SEGURO · ACESSO IMEDIATO · GARANTIA DE 7 DIAS
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════
   SECTION: FAQ
══════════════════════════════════════════════════ */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        cursor: 'pointer',
      }}
      onClick={() => setOpen(!open)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 0', gap: '16px' }}>
        <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '16px', fontWeight: 700, color: '#ddd', lineHeight: 1.4 }}>{q}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ color: '#FF3B3B', fontSize: '20px', flexShrink: 0 }}
        >
          +
        </motion.span>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '15px', fontWeight: 500, color: '#777', lineHeight: 1.7, paddingBottom: '18px' }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FAQSection() {
  const faqs = [
    {
      q: 'Precisa instalar algum app?',
      a: 'Não. É um PWA — você acessa pelo navegador do celular e pode "instalar" na tela inicial como qualquer app. Funciona em Android e iOS.',
    },
    {
      q: 'Qual a diferença entre Modo Normal e Modo Guerra?',
      a: 'No Modo Normal você pode falhar em missões sem perder todo o progresso. No Modo Guerra, qualquer falha reseta você para o dia 1. Sem exceção. Sem negociação.',
    },
    {
      q: 'Preciso ter condicionamento físico?',
      a: 'Não. Você define seu nível no início (iniciante, intermediário ou avançado) e as missões são calibradas. Iniciante começa com 20 flexões no dia 1.',
    },
    {
      q: 'O que acontece depois do dia 21?',
      a: 'Você entra na tela de conclusão com suas estatísticas e pode reiniciar o desafio quantas vezes quiser.',
    },
    {
      q: 'Os bônus são entregues de uma vez?',
      a: 'Não. Cada bônus é desbloqueado conforme você avança: Dia 1, Dia 7, Dia 14 e Dia 21. Você precisa merecer.',
    },
    {
      q: 'Como funciona a garantia?',
      a: 'Se em 7 dias você achar que o produto não é para você, envie um email e devolvo 100% do valor. Sem pergunta e sem burocracia.',
    },
    {
      q: 'Posso usar no computador?',
      a: 'Sim. O PWA funciona em qualquer navegador. Mas foi projetado para mobile — a experiência no celular é superior.',
    },
  ];

  return (
    <section style={{ padding: '80px 24px', background: '#0a0a0a' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <Reveal>
          <Tag color="dim">FAQ</Tag>
          <h2 className="font-display" style={{ fontSize: 'clamp(30px, 5vw, 52px)', letterSpacing: '4px', color: '#F5F5F5', margin: '16px 0 40px' }}>
            PERGUNTAS<br />
            <span style={{ color: '#888' }}>FREQUENTES</span>
          </h2>
        </Reveal>

        <div>
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.04}>
              <FAQItem q={f.q} a={f.a} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════
   SECTION: FOOTER
══════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer style={{ padding: '40px 24px', borderTop: '1px solid rgba(255,255,255,0.04)', textAlign: 'center' }}>
      <div className="font-display" style={{ fontSize: '20px', letterSpacing: '3px', color: '#333', marginBottom: '8px' }}>
        SALA DO <span style={{ color: '#FF3B3B' }}>TEMPO</span> 21
      </div>
      <div className="font-mono-t" style={{ fontSize: '8px', letterSpacing: '3px', color: '#333' }}>
        © {new Date().getFullYear()} · TODOS OS DIREITOS RESERVADOS
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════════════════
   ROOT PAGE
══════════════════════════════════════════════════ */
export default function VendasPage() {
  const CHECKOUT_URL = 'https://pay.cakto.com.br/97n7exq_861235';

  const goToCheckout = () => {
    window.open(CHECKOUT_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <Fonts />
      <StickyHeader onCTA={goToCheckout} />

      <main style={{ background: '#0D0D0D' }}>
        <HeroSection onCTA={goToCheckout} />
        <TickerBar />
        <SocialProofBar />
        <ProblemSection />
        <SolutionSection />
        <MementoMoriSection />
        <HowItWorksSection />
        <MissionsSection />
        <BonusSection />
        <TestimonialsSection />
        <ProgressionSection />
        <GuaranteeSection />
        <FinalCTASection onCTA={goToCheckout} />
        <FAQSection />
        <Footer />
      </main>
    </>
  );
}
