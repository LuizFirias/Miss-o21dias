'use client';

import { useState, useReducer, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const STORAGE_KEY = 'rotina-blindada-state';

function getHojeBrasilia(): string {
  const hoje = new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' });
  return new Date(hoje).toISOString().split('T')[0];
}

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
interface Item {
  id: string;
  text: string;
  icon: string;
}

interface Section {
  id: string;
  label: string;
  icon: string;
  accentColor: string;
  items: Item[];
}

const SECTIONS: Record<string, Section> = {
  manha: {
    id: 'manha',
    label: 'MANHÃ',
    icon: '☀',
    accentColor: '#FF3B3B',
    items: [
      { id: 'm1', text: 'Levantar sem soneca', icon: '⚡' },
      { id: 'm2', text: 'Arrumar a cama', icon: '🛏' },
      { id: 'm3', text: 'Beber água (500ml)', icon: '💧' },
      { id: 'm4', text: 'Exposição à luz solar', icon: '🌅' },
      { id: 'm5', text: 'Movimento leve (10 min)', icon: '🏃' },
      { id: 'm6', text: 'Zero celular por 1h', icon: '📵' },
      { id: 'm7', text: 'Definir tarefa principal do dia', icon: '🎯' },
    ],
  },
  dia: {
    id: 'dia',
    label: 'DURANTE O DIA',
    icon: '⚔',
    accentColor: '#5B8CFF',
    items: [
      { id: 'd1', text: 'Tarefa principal primeiro', icon: '🔥' },
      { id: 'd2', text: 'Bloco de foco profundo', icon: '🧠' },
      { id: 'd3', text: 'Evitar redes sociais', icon: '🚫' },
      { id: 'd4', text: 'Alimentação controlada', icon: '🥩' },
      { id: 'd5', text: 'Hidratação contínua', icon: '💧' },
    ],
  },
  noite: {
    id: 'noite',
    label: 'NOITE',
    icon: '🌙',
    accentColor: '#FFC857',
    items: [
      { id: 'n1', text: 'Sem cafeína após 14h', icon: '☕' },
      { id: 'n2', text: 'Refeição leve', icon: '🥗' },
      { id: 'n3', text: 'Luz baixa após 20h', icon: '🕯' },
      { id: 'n4', text: 'Zero tela 1h antes de dormir', icon: '📵' },
      { id: 'n5', text: 'Revisar o dia (2 min)', icon: '📓' },
      { id: 'n6', text: 'Dormir no horário fixo', icon: '😴' },
    ],
  },
};

const SCREENS = ['intro', 'manha', 'dia', 'noite', 'checklist'];

/* ─────────────────────────────────────────────
   REDUCER
───────────────────────────────────────────── */
type CheckedState = Record<string, boolean>;
type ChecklistAction =
  | { type: 'TOGGLE'; id: string }
  | { type: 'RESET' }
  | { type: 'HYDRATE'; payload: CheckedState };

function checklistReducer(state: CheckedState, action: ChecklistAction): CheckedState {
  switch (action.type) {
    case 'TOGGLE':
      return { ...state, [action.id]: !state[action.id] };
    case 'RESET':
      return {};
    case 'HYDRATE':
      return action.payload;
    default:
      return state;
  }
}

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function getSectionProgress(sectionId: string, checked: CheckedState) {
  const section = SECTIONS[sectionId];
  if (!section) return 0;
  const done = section.items.filter((i) => checked[i.id]).length;
  return Math.round((done / section.items.length) * 100);
}

function getTotalProgress(checked: CheckedState) {
  const allItems = Object.values(SECTIONS).flatMap((s) => s.items);
  const done = allItems.filter((i) => checked[i.id]).length;
  return { done, total: allItems.length, pct: Math.round((done / allItems.length) * 100) };
}

/* ─────────────────────────────────────────────
   CHECKBOX ITEM
───────────────────────────────────────────── */
function CheckItem({ 
  item, 
  checked, 
  onToggle, 
  accentColor, 
  delay = 0 
}: { 
  item: Item; 
  checked: CheckedState; 
  onToggle: (id: string) => void; 
  accentColor: string; 
  delay?: number;
}) {
  const isDone = checked[item.id] || false;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000 }}
      onClick={() => onToggle(item.id)}
      className="mb-3 cursor-pointer select-none"
    >
      <div
        className={`
          flex items-center gap-4 p-4 rounded-lg border-l-[3px] transition-all
          ${isDone 
            ? 'bg-verde/10 border-verde border-verde/30' 
            : 'bg-branco/5 border-branco-dim/10'}
        `}
        style={{ borderLeftColor: isDone ? '#00C853' : accentColor }}
      >
        {/* Checkbox */}
        <div
          className={`
            w-6 h-6 rounded border-2 flex items-center justify-center transition-all
            ${isDone ? 'border-verde bg-verde' : 'border-branco-dim/20 bg-transparent'}
          `}
        >
          {isDone && <span className="text-preto text-sm font-black">✓</span>}
        </div>

        <span className="text-lg">{item.icon}</span>

        <span
          className={`
            flex-1 font-body text-base font-semibold transition-all
            ${isDone ? 'text-branco-dim/40 line-through' : 'text-branco'}
          `}
        >
          {item.text}
        </span>

        {isDone && (
          <span className="font-mono text-[8px] tracking-wider text-verde bg-verde/10 border border-verde/25 rounded px-2 py-1">
            FEITO
          </span>
        )}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   PROGRESS BAR
───────────────────────────────────────────── */
function ProgressBar({ pct, color = '#FF3B3B' }: { pct: number; color?: string }) {
  return (
    <div className="w-full h-1 bg-branco-dim/10 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="h-full rounded-full"
        style={{ background: pct === 100 ? '#00C853' : color }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   SCREEN: INTRO
───────────────────────────────────────────── */
function ScreenIntro({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col min-h-screen px-6 py-12">
      <div className="flex-1">
        <div className="font-mono text-[9px] tracking-[5px] text-vermelho uppercase mb-8">
          ● SISTEMA ATIVO
        </div>

        <h1 className="font-display text-5xl tracking-wider leading-none text-branco mb-2">
          PLANO
          <br />
          <span className="text-vermelho">DIÁRIO</span>
        </h1>

        <p className="font-mono text-[10px] tracking-[3px] text-branco-dim uppercase mb-8">
          PROTOCOLO DIÁRIO DE ALTA PERFORMANCE
        </p>

        <div className="w-10 h-[2px] bg-vermelho mb-7" />

        <p className="font-body text-base text-branco-dim/70 leading-relaxed mb-10">
          Disciplina não é motivação.<br />
          É <span className="text-branco font-bold">estrutura executada todos os dias</span>, sem exceção.
          <br /><br />
          Este protocolo cobre manhã, dia e noite — uma checklist que você vai marcar, dia após dia.
        </p>

        <div className="flex gap-6 mb-12">
          {[
            { val: '18', lbl: 'ITENS' },
            { val: '3', lbl: 'BLOCOS' },
            { val: '∞', lbl: 'DIAS' },
          ].map((s) => (
            <div key={s.lbl} className="text-center">
              <div className="font-display text-3xl text-branco leading-none">{s.val}</div>
              <div className="font-mono text-[8px] tracking-wider text-branco-dim/30 uppercase">{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onStart}
        className="w-full bg-vermelho hover:bg-vermelho/80 rounded-lg p-4 mb-3 transition-all"
      >
        <span className="font-display text-2xl tracking-[5px] text-branco">
          INICIAR PROTOCOLO
        </span>
      </button>

      <p className="font-mono text-[9px] tracking-wider text-branco-dim/20 text-center uppercase">
        SEM DESCULPA. SEM PAUSA.
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SCREEN: SECTION
───────────────────────────────────────────── */
function ScreenSection({ 
  sectionId, 
  checked, 
  onToggle, 
  onNext, 
  onBack, 
  isLast, 
  totalProgress 
}: { 
  sectionId: string; 
  checked: CheckedState; 
  onToggle: (id: string) => void; 
  onNext: () => void; 
  onBack: () => void; 
  isLast: boolean; 
  totalProgress: { done: number; total: number; pct: number };
}) {
  const section = SECTIONS[sectionId];
  const progress = getSectionProgress(sectionId, checked);
  const allDone = progress === 100;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="px-6 pt-8 pb-4">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="flex items-center gap-2">
            <span className="text-branco-dim/30 text-lg">←</span>
            <span className="font-mono text-[9px] tracking-wider text-branco-dim/30 uppercase">VOLTAR</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] tracking-wider text-branco-dim/30">
              {totalProgress.done}/{totalProgress.total}
            </span>
            <div className="w-16 h-[3px] bg-branco-dim/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-vermelho rounded-full transition-all" 
                style={{ width: `${totalProgress.pct}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mb-7">
          <div className="flex justify-between items-end mb-3">
            <div>
              <div className="font-mono text-[9px] tracking-[4px] uppercase mb-1" style={{ color: section.accentColor }}>
                PROTOCOLO · {section.label}
              </div>
              <h2 className="font-display text-4xl tracking-wider text-branco leading-none">
                {section.label}
              </h2>
            </div>
            <div className="text-right">
              <div className={`font-display text-3xl leading-none ${progress === 100 ? 'text-verde' : 'text-branco'}`}>
                {progress}<span className="text-base text-branco-dim/30">%</span>
              </div>
              <div className="font-mono text-[8px] tracking-wider text-branco-dim/30 uppercase">CONCLUÍDO</div>
            </div>
          </div>
          <ProgressBar pct={progress} color={section.accentColor} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-32">
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
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-preto via-preto/95 to-transparent p-6 pt-8">
        <button
          onClick={onNext}
          className={`
            w-full rounded-lg p-4 transition-all
            ${allDone ? 'bg-verde hover:bg-verde/80' : 'bg-vermelho hover:bg-vermelho/80'}
          `}
        >
          <span className={`font-display text-xl tracking-[4px] ${allDone ? 'text-preto' : 'text-branco'}`}>
            {isLast
              ? allDone ? '✓ VER RESUMO' : 'VER RESUMO →'
              : allDone ? '✓ PRÓXIMO BLOCO' : 'PRÓXIMO BLOCO →'}
          </span>
        </button>

        {!allDone && (
          <p className="font-mono text-[8px] tracking-wider text-branco-dim/20 text-center mt-2 uppercase">
            {section.items.length - section.items.filter((i) => checked[i.id]).length} ITEM(S) PENDENTE(S)
          </p>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SCREEN: FINAL
───────────────────────────────────────────── */
function ScreenFinal({ 
  checked, 
  onToggle, 
  onReset, 
  onBack 
}: { 
  checked: CheckedState; 
  onToggle: (id: string) => void; 
  onReset: () => void; 
  onBack: () => void;
}) {
  const totalProgress = getTotalProgress(checked);
  const isComplete = totalProgress.pct === 100;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="px-6 pt-8 pb-6">
        <button onClick={onBack} className="flex items-center gap-2 mb-7">
          <span className="text-branco-dim/30 text-lg">←</span>
          <span className="font-mono text-[9px] tracking-wider text-branco-dim/30 uppercase">VOLTAR</span>
        </button>

        <div className={`font-mono text-[9px] tracking-[4px] uppercase mb-1 ${isComplete ? 'text-verde' : 'text-vermelho'}`}>
          {isComplete ? '✓ PROTOCOLO CONCLUÍDO' : 'RESUMO DO DIA'}
        </div>

        <h2 className="font-display text-4xl tracking-wider text-branco leading-none mb-5">
          CHECKLIST
          <br />
          <span className={isComplete ? 'text-verde' : 'text-vermelho'}>FINAL</span>
        </h2>

        {/* Progress card */}
        <div 
          className={`
            flex items-center gap-5 p-5 rounded-xl mb-6 border
            ${isComplete ? 'bg-verde/5 border-verde/20' : 'bg-vermelho/5 border-vermelho/15'}
          `}
        >
          <div
            className={`
              w-20 h-20 rounded-full border-[3px] flex items-center justify-center
              ${isComplete ? 'border-verde shadow-[0_0_16px_rgba(0,200,83,0.2)]' : 'border-vermelho shadow-[0_0_16px_rgba(255,59,59,0.15)]'}
            `}
          >
            <div className={`font-display text-3xl leading-none ${isComplete ? 'text-verde' : 'text-branco'}`}>
              {totalProgress.pct}<span className="text-sm">%</span>
            </div>
          </div>

          <div className="flex-1">
            <div className="font-body text-xl font-bold text-branco leading-tight mb-1">
              {isComplete ? 'Protocolo Executado.' : `${totalProgress.done} de ${totalProgress.total} concluídos`}
            </div>
            <ProgressBar pct={totalProgress.pct} color={isComplete ? '#00C853' : '#FF3B3B'} />
            {isComplete && (
              <div className="font-mono text-[8px] tracking-wider text-verde mt-1.5">
                VOCÊ FEZ O QUE POUCOS FAZEM.
              </div>
            )}
          </div>
        </div>

        {/* Per-section mini progress */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          {Object.values(SECTIONS).map((section) => {
            const pct = getSectionProgress(section.id, checked);
            return (
              <div
                key={section.id}
                className={`
                  p-3.5 rounded-lg border-l-[3px] border
                  ${pct === 100 ? 'bg-verde/5 border-verde/20' : 'bg-branco/5 border-branco-dim/10'}
                `}
                style={{ borderLeftColor: pct === 100 ? '#00C853' : section.accentColor }}
              >
                <div className="flex justify-between mb-2">
                  <span 
                    className="font-mono text-[8px] tracking-wider uppercase" 
                    style={{ color: pct === 100 ? '#00C853' : section.accentColor }}
                  >
                    {section.icon} {section.label}
                  </span>
                  <span className={`font-mono text-[8px] ${pct === 100 ? 'text-verde' : 'text-branco-dim/40'}`}>
                    {pct}%
                  </span>
                </div>
                <ProgressBar pct={pct} color={section.accentColor} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-32">
        {Object.values(SECTIONS).map((section) => (
          <div key={section.id} className="mb-6">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-branco-dim/10">
              <span className="text-sm">{section.icon}</span>
              <span 
                className="font-mono text-[9px] tracking-[3px] uppercase" 
                style={{ color: section.accentColor }}
              >
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
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-preto via-preto/95 to-transparent p-6 pt-8">
        <button
          onClick={onReset}
          className={`
            w-full rounded-lg p-4 border transition-all
            ${isComplete 
              ? 'bg-transparent border-verde hover:bg-verde/10' 
              : 'bg-transparent border-branco-dim/20 hover:border-branco-dim/40'}
          `}
        >
          <span className={`font-display text-lg tracking-[4px] ${isComplete ? 'text-verde' : 'text-branco-dim/30'}`}>
            ↺ {isComplete ? 'REINICIAR PARA AMANHÃ' : 'REINICIAR DIA'}
          </span>
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   NAV DOTS
───────────────────────────────────────────── */
function NavDots({ screens, current }: { screens: string[]; current: string }) {
  const steps = screens.filter((s) => s !== 'intro' && s !== 'checklist');
  if (current === 'intro') return null;
  
  const curIdx = steps.indexOf(current);
  
  return (
    <div className="flex justify-center gap-1.5 py-3">
      {steps.map((s, idx) => {
        const active = s === current;
        const done = curIdx > idx || current === 'checklist';
        
        return (
          <div
            key={s}
            className="h-[3px] rounded-full transition-all"
            style={{
              width: active ? '24px' : '14px',
              background: done ? '#00C853' : active ? '#FF3B3B' : 'rgba(255,255,255,0.15)',
            }}
          />
        );
      })}
      <div
        className="h-[3px] rounded-full transition-all"
        style={{
          width: current === 'checklist' ? '24px' : '14px',
          background: current === 'checklist' ? '#FF3B3B' : 'rgba(255,255,255,0.15)',
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   ROOT COMPONENT
───────────────────────────────────────────── */
export default function RotinaBlinada() {
  const router = useRouter();
  const [screen, setScreen] = useState('intro');
  const [checked, dispatch] = useReducer(checklistReducer, {});
  const hydrated = useRef(false);

  const sectionScreens = ['manha', 'dia', 'noite'];
  const totalProgress = getTotalProgress(checked);

  // Carrega estado do dia ao montar. Se a data salva não for a de hoje
  // (Brasília), começa zerado — reset diário automático.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { date: string; checked: CheckedState };
        if (parsed && parsed.date === getHojeBrasilia() && parsed.checked) {
          dispatch({ type: 'HYDRATE', payload: parsed.checked });
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch {
      // ignore parse/storage errors
    } finally {
      hydrated.current = true;
    }
  }, []);

  // Persiste a cada mudança (apenas após hidratação para não sobrescrever
  // o storage com {} antes de ler).
  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ date: getHojeBrasilia(), checked }),
      );
    } catch {
      // ignore quota/security errors
    }
  }, [checked]);

  const handleToggle = (id: string) => dispatch({ type: 'TOGGLE', id });

  const handleReset = () => {
    dispatch({ type: 'RESET' });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setScreen('intro');
  };

  const goNext = (current: string) => {
    if (current === 'intro') { 
      setScreen('manha'); 
      return; 
    }
    const idx = sectionScreens.indexOf(current);
    if (idx < sectionScreens.length - 1) {
      setScreen(sectionScreens[idx + 1]);
    } else {
      setScreen('checklist');
    }
  };

  const goBack = (current: string) => {
    if (current === 'checklist') { 
      setScreen('noite'); 
      return; 
    }
    const idx = sectionScreens.indexOf(current);
    if (idx <= 0) {
      setScreen('intro');
    } else {
      setScreen(sectionScreens[idx - 1]);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@400;500;600;700&family=Share+Tech+Mono&display=swap');
      `}</style>
      
      <div className="bg-preto min-h-screen max-w-[430px] mx-auto relative overflow-hidden">
        {/* Ambient glow */}
        <div
          className="fixed -top-20 -left-20 w-72 h-72 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(255,59,59,0.06) 0%, transparent 70%)',
            zIndex: 0,
          }}
        />

        {/* Sair → /bonus */}
        <button
          onClick={() => router.push('/bonus')}
          aria-label="Sair para bônus"
          className="fixed top-4 right-4 z-50 flex items-center gap-1.5 bg-preto/70 backdrop-blur-sm border border-branco-dim/15 hover:border-vermelho/60 rounded-full px-3 py-1.5 transition-all"
        >
          <span className="font-mono text-[9px] tracking-[2px] text-branco-dim uppercase">SAIR</span>
          <span className="text-branco-dim text-sm leading-none">✕</span>
        </button>

        <NavDots screens={SCREENS} current={screen} />

        <div className="relative z-10" key={screen}>
          {screen === 'intro' && (
            <ScreenIntro onStart={() => goNext('intro')} />
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

          {screen === 'checklist' && (
            <ScreenFinal
              checked={checked}
              onToggle={handleToggle}
              onReset={handleReset}
              onBack={() => goBack('checklist')}
            />
          )}
        </div>
      </div>
    </>
  );
}
