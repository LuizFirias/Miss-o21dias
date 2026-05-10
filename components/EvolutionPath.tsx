'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MISSOES } from '@/data/missoes';

const ROW_HEIGHT = 90;
const PADDING_TOP = 24;
const PADDING_BOTTOM = 60;

// X center as fraction of container width for each day (index = dia - 1)
const X_FRACS = [
  0.50, // 1
  0.78, // 2
  0.78, // 3
  0.50, // 4
  0.22, // 5
  0.22, // 6
  0.50, // 7 ★ CHECKPOINT
  0.78, // 8
  0.78, // 9
  0.50, // 10
  0.22, // 11
  0.22, // 12
  0.50, // 13
  0.50, // 14 ★ CHECKPOINT
  0.78, // 15
  0.78, // 16
  0.50, // 17
  0.22, // 18
  0.22, // 19
  0.50, // 20
  0.50, // 21 🎖️ FINAL
];

const CHECKPOINTS = new Set([7, 14]);

type NodeStatus = 'completed' | 'current' | 'locked';

function getStatus(dia: number, diaAtual: number): NodeStatus {
  if (dia < diaAtual) return 'completed';
  if (dia === diaAtual) return 'current';
  return 'locked';
}

interface EvolutionPathProps {
  diaAtual: number;
  onDiaClick: (dia: number) => void;
}

export default function EvolutionPath({ diaAtual, onDiaClick }: EvolutionPathProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentNodeRef = useRef<HTMLDivElement>(null);
  const [cw, setCw] = useState(320); // container width in px

  const totalH = PADDING_TOP + 21 * ROW_HEIGHT + PADDING_BOTTOM;

  useEffect(() => {
    const update = () => {
      if (containerRef.current) setCw(containerRef.current.offsetWidth);
    };
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Scroll to current node after render
  useEffect(() => {
    const t = setTimeout(() => {
      currentNodeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 600);
    return () => clearTimeout(t);
  }, [diaAtual, cw]);

  const getX = (dia: number) => cw * X_FRACS[dia - 1];
  const getY = (dia: number) => PADDING_TOP + (dia - 1) * ROW_HEIGHT + ROW_HEIGHT / 2;

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: totalH }}>
      {/* SVG layer: path lines between nodes */}
      <svg
        className="absolute inset-0 pointer-events-none"
        width={cw}
        height={totalH}
        viewBox={`0 0 ${cw} ${totalH}`}
      >
        {Array.from({ length: 20 }, (_, i) => {
          const dia = i + 1;
          const status = getStatus(dia, diaAtual);
          const nextStatus = getStatus(dia + 1, diaAtual);

          const x1 = getX(dia);
          const y1 = getY(dia);
          const x2 = getX(dia + 1);
          const y2 = getY(dia + 1);
          const cy = (y1 + y2) / 2;

          const completed = status === 'completed';
          const active = status === 'current' || nextStatus === 'current';

          return (
            <path
              key={dia}
              d={`M ${x1} ${y1} C ${x1} ${cy}, ${x2} ${cy}, ${x2} ${y2}`}
              fill="none"
              stroke={completed ? '#FF3B3B' : active ? '#FF8C42' : '#2A2A2A'}
              strokeWidth={completed ? 2.5 : 2}
              strokeDasharray={completed ? undefined : '6 4'}
              opacity={completed ? 0.75 : 0.5}
            />
          );
        })}
      </svg>

      {/* HTML Nodes */}
      {MISSOES.map((missao) => {
        const dia = missao.dia;
        const status = getStatus(dia, diaAtual);
        const isCheckpoint = CHECKPOINTS.has(dia);
        const isFinal = dia === 21;
        const isCurrent = status === 'current';
        const isCompleted = status === 'completed';
        const isLocked = status === 'locked';

        const nodeSize = isCurrent ? 68 : isCompleted ? 54 : 44;
        const x = getX(dia);
        const y = getY(dia);

        return (
          <div
            key={dia}
            ref={isCurrent ? currentNodeRef : null}
            className="absolute"
            style={{
              left: x,
              top: y,
              transform: 'translate(-50%, -50%)',
              zIndex: isCurrent ? 10 : 1,
            }}
          >
            {/* Pulse ring for current day */}
            {isCurrent && (
              <motion.div
                className="absolute rounded-full border-2 border-vermelho"
                style={{
                  width: nodeSize + 16,
                  height: nodeSize + 16,
                  top: -(16 / 2),
                  left: -(16 / 2),
                }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}

            {/* Node circle */}
            <motion.button
              onClick={() => !isLocked && onDiaClick(dia)}
              disabled={isLocked}
              whileHover={!isLocked ? { scale: 1.1 } : {}}
              whileTap={!isLocked ? { scale: 0.93 } : {}}
              className={`
                rounded-full flex flex-col items-center justify-center relative overflow-hidden
                transition-all duration-300 select-none
                ${isCurrent
                  ? 'bg-gradient-to-br from-vermelho to-laranja shadow-[0_0_28px_rgba(255,59,59,0.65)] border-2 border-vermelho/80 cursor-pointer'
                  : isCompleted
                  ? 'bg-cinza-escuro border-2 border-vermelho/50 shadow-[0_0_14px_rgba(255,59,59,0.25)] cursor-pointer'
                  : 'bg-[#111] border-2 border-cinza-borda cursor-default opacity-40'
                }
              `}
              style={{ width: nodeSize, height: nodeSize }}
            >
              {isCompleted && (
                <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
                  <path d="M2 8L8 14L20 2" stroke="#FF3B3B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {isLocked && (
                <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
                  <rect x="2" y="8" width="12" height="9" rx="2" stroke="#444" strokeWidth="1.5" />
                  <path d="M5 8V5.5a3 3 0 016 0V8" stroke="#444" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              )}
              {isCurrent && (
                <span className="font-display text-[11px] text-branco tracking-[1px] font-bold leading-none">
                  {isCheckpoint ? '⚔' : isFinal ? '🎖' : String(dia).padStart(2, '0')}
                </span>
              )}
            </motion.button>

            {/* Labels below node */}
            <div
              className="absolute text-center"
              style={{
                top: nodeSize + 4,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 80,
              }}
            >
              {isCurrent && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-mono text-[7px] tracking-[2.5px] text-vermelho uppercase mb-0.5"
                >
                  ▶ HOJE
                </motion.div>
              )}
              <div
                className={`font-mono text-[8px] tracking-wider uppercase leading-tight ${
                  isCurrent
                    ? 'text-branco'
                    : isCompleted
                    ? 'text-branco-dim/70'
                    : 'text-cinza-borda/50'
                }`}
              >
                {isCheckpoint ? `★ DIA ${dia}` : isFinal ? `🎖 DIA ${dia}` : `DIA ${dia}`}
              </div>
              {(isCurrent || isCheckpoint || isFinal) && (
                <div
                  className={`font-body text-[7px] mt-0.5 leading-tight truncate ${
                    isCurrent ? 'text-laranja' : 'text-branco-dim/40'
                  }`}
                >
                  {missao.nome.length > 13 ? missao.nome.slice(0, 12) + '…' : missao.nome}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
