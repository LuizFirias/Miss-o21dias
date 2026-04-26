'use client';

import { useEffect, useRef, useState } from 'react';
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
    <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', height: '100%', background: '#0D0D0D' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div>
          <div className="font-mono-t" style={{ fontSize: '6px', letterSpacing: '2px', color: '#888' }}>SALA DO TEMPO</div>
          <div className="font-display" style={{ fontSize: '14px', letterSpacing: '2px', color: '#FF3B3B' }}>DIA 8/21</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="font-mono-t" style={{ fontSize: '6px', letterSpacing: '1px', color: '#888' }}>STREAK</div>
          <div className="font-display" style={{ fontSize: '18px', color: '#FFC857' }}>8🔥</div>
        </div>
      </div>
      {/* Progress */}
      <div style={{ marginBottom: '10px' }}>
        <div style={{ height: '2px', background: '#1a1a1a', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ width: '38%', height: '100%', background: 'linear-gradient(to right, #FF3B3B, #FFC857)' }} />
        </div>
        <div className="font-mono-t" style={{ fontSize: '7px', color: '#555', marginTop: '3px', letterSpacing: '1px' }}>38% CONCLUÍDO</div>
      </div>
      {/* Frase */}
      <div style={{ padding: '8px 10px', marginBottom: '8px', borderLeft: '2px solid #FF3B3B' }}>
        <div className="font-mono-t" style={{ fontSize: '7.5px', color: '#FF3B3B', letterSpacing: '0.5px', lineHeight: 1.5 }}>
          "Enquanto você pensa,<br />alguém já fez."
        </div>
      </div>
      {/* Mission cards */}
      {[
        { label: 'CORPO', text: 'Flexões 45 · Burpees 20', color: '#FF3B3B', done: true },
        { label: 'MENTE', text: '20 min de foco total', color: '#5B8CFF', done: false },
        { label: 'DISCIPLINA', text: 'Sem celular antes das 9h', color: '#FFC857', done: false },
      ].map((m) => (
        <div
          key={m.label}
          style={{
            padding: '7px 10px',
            marginBottom: '5px',
            background: '#111',
            borderLeft: `2px solid ${m.done ? '#00C853' : m.color}`,
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div className="font-mono-t" style={{ fontSize: '6px', color: m.done ? '#00C853' : m.color, letterSpacing: '2px' }}>{m.label}</div>
            <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '9px', color: m.done ? '#555' : '#ccc', textDecoration: m.done ? 'line-through' : 'none' }}>{m.text}</div>
          </div>
          <span style={{ fontSize: '12px' }}>{m.done ? '✓' : '○'}</span>
        </div>
      ))}
      {/* CTA */}
      <div style={{ marginTop: 'auto', padding: '8px 0', background: '#FF3B3B', borderRadius: '4px', textAlign: 'center' }}>
        <span className="font-display" style={{ fontSize: '12px', letterSpacing: '3px', color: '#fff' }}>INICIAR MISSÃO</span>
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
              gap: '16px',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ marginTop: '40px' }}>
              <PhoneMockup screen={<HomeScreen />} />
            </div>
            <div style={{ marginTop: '-40px' }}>
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
    'ELITE NO DIA 21',
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
      title: 'EXECUTA AS 3 MISSÕES',
      desc: 'Todo dia 3 missões: Corpo, Mente e Disciplina. Você marca concluído — ou declara falha. Sem meio-termo. Sem "vou compensar amanhã".',
      screen: <MissionScreen />,
    },
    {
      num: '03',
      title: 'ACUMULA O STREAK',
      desc: 'Cada dia executado aumenta seu streak e sua progressão de nível. Recruta → Soldado → Cabo → Elite. Falhar reseta. A consequência é real.',
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
    { dia: 21, nome: 'ELITE — MISSÃO FINAL', exercicios: 'Flexões 105 · Agachamentos 125 · Prancha 120s' },
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
function BonusSection() {
  const bonuses = [
    {
      num: '01',
      dia: 1,
      titulo: 'Plano Diário',
      sub: 'Protocolo Diário de Alta Performance',
      desc: 'Checklist interativa com 18 itens divididos em Manhã, Dia e Noite. Plug and play. Você executa, o sistema registra.',
      color: '#FF3B3B',
      icon: '🔥',
    },
    {
      num: '02',
      dia: 7,
      titulo: 'Protocolo Anti-Vício',
      sub: 'Corte de Estímulo e Recuperação de Controle',
      desc: 'Sistema de ação imediata para parar com pornografia, apostas e redes sociais. Bloquear acesso, mudar ambiente, substituir comportamento.',
      color: '#5B8CFF',
      icon: '🧊',
    },
    {
      num: '03',
      dia: 14,
      titulo: 'Código da Disciplina Militar',
      sub: 'Fundamentos de Execução',
      desc: 'Flow de 12 telas com princípios militares de execução. Leitura em 3 minutos. Impacto que fica.',
      color: '#00C853',
      icon: '⚔',
    },
    {
      num: '04',
      dia: 21,
      titulo: 'Grupo WhatsApp Exclusivo',
      sub: 'Comunidade de Guerreiros',
      desc: 'Acesso ao grupo exclusivo de quem completou os 21 dias. Accountability real. Sem fraqueza.',
      color: '#FFC857',
      icon: '👑',
    },
  ];

  return (
    <section style={{ padding: '80px 24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(255,200,87,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative' }}>
        <Reveal>
          <Tag color="yellow">BÔNUS INCLUSOS</Tag>
          <h2
            className="font-display"
            style={{ fontSize: 'clamp(34px, 6vw, 60px)', letterSpacing: '4px', color: '#F5F5F5', margin: '16px 0 12px' }}
          >
            4 BÔNUS QUE<br />
            <span style={{ color: '#FFC857' }}>VOCÊ DESBLOQUEIA</span>
          </h2>
          <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '17px', fontWeight: 500, color: '#888', marginBottom: '48px', maxWidth: '520px', lineHeight: 1.6 }}>
            Não são brindes. São ferramentas desbloqueadas conforme você avança — porque você precisa merecer.
          </p>
        </Reveal>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {bonuses.map((b, i) => (
            <Reveal key={b.num} delay={i * 0.08}>
              <div
                style={{
                  padding: '24px',
                  background: '#0f0f0f',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderLeft: `4px solid ${b.color}`,
                  borderRadius: '8px',
                  display: 'flex',
                  gap: '20px',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ flexShrink: 0 }}>
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '8px',
                      background: `${b.color}15`,
                      border: `1px solid ${b.color}30`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                    }}
                  >
                    {b.icon}
                  </div>
                </div>

                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <span className="font-mono-t" style={{ fontSize: '8px', letterSpacing: '2px', color: b.color }}>BÔNUS {b.num}</span>
                    <span
                      style={{
                        fontFamily: 'Share Tech Mono, monospace',
                        fontSize: '8px',
                        letterSpacing: '2px',
                        color: '#444',
                        background: '#1a1a1a',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '3px',
                        padding: '2px 8px',
                      }}
                    >
                      LIBERA DIA {b.dia}
                    </span>
                  </div>
                  <h3 className="font-display" style={{ fontSize: '22px', letterSpacing: '2px', color: '#F5F5F5', marginBottom: '4px' }}>{b.titulo}</h3>
                  <div className="font-mono-t" style={{ fontSize: '8px', letterSpacing: '2px', color: '#555', marginBottom: '10px', textTransform: 'uppercase' }}>{b.sub}</div>
                  <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '14px', fontWeight: 500, color: '#777', lineHeight: 1.6 }}>{b.desc}</p>
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
   SECTION: ORDER BUMPS (Premium Upgrades)
══════════════════════════════════════════════════ */
function OrderBumpsSection() {
  const bumps = [
    {
      icon: '⚔',
      titulo: 'MODO GUERRA',
      sub: 'Protocolo de Execução Sem Falha',
      preco: 'R$ 27',
      color: '#FF3B3B',
      features: [
        'Missões não podem ser puladas',
        'Falha = reset para o dia 1',
        'Sem negociação. Sem adaptação',
        'Mapa de 21 dias com rastreamento',
        'Para quem quer resultado real',
      ],
      badge: 'MAIS POPULAR',
    },
    {
      icon: '📅',
      titulo: 'CONTINUIDADE 30 DIAS',
      sub: '30 Dias Extras Após o Desafio',
      preco: 'R$ 37',
      color: '#FFC857',
      features: [
        'Missões extras após o dia 21',
        'Manutenção do streak conquistado',
        'Novas frases e desafios',
        'Sem interrupção do ritmo',
        'Para quem não quer parar',
      ],
      badge: null,
    },
    {
      icon: '⚡',
      titulo: 'DISPARO RÁPIDO',
      sub: 'Ferramenta Anti-Procrastinação',
      preco: 'R$ 17',
      color: '#00C853',
      features: [
        'Botão de ação: travou? Desbloqueie em 60s',
        'Contagem regressiva anti-paralisia',
        'Força ação física imediata',
        'Foco em 1 tarefa só',
        'Para momentos críticos de inércia',
      ],
      badge: null,
    },
  ];

  return (
    <section style={{ padding: '80px 24px', background: '#080808' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <Reveal>
          <Tag color="dim">ARSENAL AVANÇADO</Tag>
          <h2
            className="font-display"
            style={{ fontSize: 'clamp(32px, 5vw, 56px)', letterSpacing: '4px', color: '#F5F5F5', margin: '16px 0 12px' }}
          >
            POTENCIALIZE<br />
            <span style={{ color: '#888' }}>A SUA JORNADA</span>
          </h2>
          <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '16px', fontWeight: 500, color: '#666', marginBottom: '48px', maxWidth: '500px', lineHeight: 1.6 }}>
            Recursos premium desbloqueados individualmente. Adicione ao seu pedido com um clique.
          </p>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {bumps.map((b, i) => (
            <Reveal key={b.titulo} delay={i * 0.1}>
              <div
                style={{
                  padding: '28px',
                  background: '#0f0f0f',
                  border: `1px solid ${b.color}25`,
                  borderTop: `3px solid ${b.color}`,
                  borderRadius: '8px',
                  position: 'relative',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {b.badge && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-1px',
                      right: '20px',
                      background: b.color,
                      color: '#000',
                      fontFamily: 'Bebas Neue, cursive',
                      fontSize: '9px',
                      letterSpacing: '2px',
                      padding: '3px 10px',
                      borderRadius: '0 0 4px 4px',
                    }}
                  >
                    {b.badge}
                  </div>
                )}

                <div style={{ fontSize: '28px', marginBottom: '14px' }}>{b.icon}</div>
                <div className="font-display" style={{ fontSize: '22px', letterSpacing: '2px', color: '#F5F5F5', marginBottom: '4px' }}>{b.titulo}</div>
                <div className="font-mono-t" style={{ fontSize: '8px', letterSpacing: '2px', color: '#555', marginBottom: '20px', textTransform: 'uppercase' }}>{b.sub}</div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                  {b.features.map((f) => (
                    <div key={f} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                      <span style={{ color: b.color, fontSize: '12px', flexShrink: 0, marginTop: '2px' }}>→</span>
                      <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '13px', fontWeight: 600, color: '#888', lineHeight: 1.4 }}>{f}</span>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="font-display" style={{ fontSize: '28px', letterSpacing: '2px', color: b.color }}>{b.preco}</span>
                  <button
                    style={{
                      background: `${b.color}15`,
                      border: `1px solid ${b.color}40`,
                      borderRadius: '4px',
                      padding: '8px 16px',
                      cursor: 'pointer',
                      color: b.color,
                      fontFamily: 'Bebas Neue, cursive',
                      fontSize: '13px',
                      letterSpacing: '3px',
                    }}
                  >
                    ADICIONAR
                  </button>
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
   SECTION: TESTIMONIALS
══════════════════════════════════════════════════ */
function TestimonialsSection() {
  const testimonials = [
    {
      nome: 'Lucas M.',
      cargo: 'Dia 21 concluído',
      texto: 'Não tem papo de motivação aqui. É missão, é streak, é consequência. Finalizei os 21 dias e minha rotina mudou de verdade.',
      stars: 5,
      nivel: 'ELITE',
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
      nivel: 'ELITE',
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
      nivel: 'ELITE',
    },
  ];

  const levelColors: Record<string, string> = {
    'RECRUTA': '#888',
    'SOLDADO': '#5B8CFF',
    'CABO': '#FFC857',
    'GUERREIRO': '#FF3B3B',
    'ELITE': '#00C853',
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
    { nivel: 'ELITE', range: 'Dias 15–21', color: '#FF3B3B', desc: 'Missão final. Apenas quem não desistiu chega aqui.' },
  ];

  return (
    <section style={{ padding: '80px 24px', background: '#0a0a0a' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Reveal>
          <Tag color="red">PROGRESSÃO</Tag>
          <h2 className="font-display" style={{ fontSize: 'clamp(32px, 5vw, 54px)', letterSpacing: '4px', color: '#F5F5F5', margin: '16px 0 40px' }}>
            DA RECRUTA<br />
            <span style={{ color: '#FF3B3B' }}>AO ELITE</span>
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
            <div className="font-display" style={{ fontSize: '56px', letterSpacing: '4px', color: '#FF3B3B', lineHeight: 1, marginBottom: '4px' }}>R$ 47</div>
            <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '13px', color: '#555', marginBottom: '28px' }}>
              Acesso vitalício · Sem mensalidade
            </div>

            {/* Inclusions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px', textAlign: 'left' }}>
              {[
                ['✓', '21 missões completas (Corpo, Mente e Disciplina)', '#00C853'],
                ['✓', '4 bônus desbloqueados por progressão', '#00C853'],
                ['✓', 'PWA — abre no celular sem instalar', '#00C853'],
                ['✓', 'Sistema de streak e níveis (Recruta → Elite)', '#00C853'],
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
      a: 'Você entra na tela de conclusão com suas estatísticas e pode reiniciar o desafio. Se adquiriu o Continuidade 30 Dias, tem missões extras para manter o ritmo.',
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
  const ctaRef = useRef<HTMLElement>(null);

  const scrollToCTA = () => {
    document.getElementById('comprar')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Fonts />
      <StickyHeader onCTA={scrollToCTA} />

      <main style={{ background: '#0D0D0D' }}>
        <HeroSection onCTA={scrollToCTA} />
        <TickerBar />
        <SocialProofBar />
        <ProblemSection />
        <SolutionSection />
        <HowItWorksSection />
        <MissionsSection />
        <BonusSection />
        <OrderBumpsSection />
        <TestimonialsSection />
        <ProgressionSection />
        <GuaranteeSection />
        <FinalCTASection onCTA={scrollToCTA} />
        <FAQSection />
        <Footer />
      </main>
    </>
  );
}
