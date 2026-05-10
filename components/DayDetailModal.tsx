'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRef } from 'react';
import type { Missao, User } from '@/types';
import DayCompletionShare from '@/components/DayCompletionShare';
import MementoMori from '@/components/MementoMori';
import { aplicarMultiplicadorModoGuerra } from '@/utils/helpers';

interface MissionStatus {
  corpo: { completed: boolean; failed: boolean };
  mente: { completed: boolean; failed: boolean };
  disciplina: { completed: boolean; failed: boolean };
}

interface DayDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  dia: number;
  missao: Missao | undefined;
  isCurrentDay: boolean;
  missionStatus: MissionStatus;
  onComplete: (tipo: 'corpo' | 'mente' | 'disciplina') => void;
  onFailed: (tipo: 'corpo' | 'mente' | 'disciplina') => void;
  salvando: boolean;
  modoGuerraAtivo: boolean;
  modoGuerraMultiplicador: number;
  user: User;
}

type MissionTipo = 'corpo' | 'mente' | 'disciplina';

const MISSION_COLORS: Record<MissionTipo, {
  text: string; bg: string; borderLeft: string; borderFull: string; shadow: string; hoverFeit: string;
}> = {
  corpo: {
    text: 'text-verde',
    bg: 'bg-verde',
    borderLeft: 'border-l-verde',
    borderFull: 'border-verde/40',
    shadow: 'shadow-[0_0_14px_rgba(0,200,83,0.35)]',
    hoverFeit: 'hover:bg-verde/20',
  },
  mente: {
    text: 'text-azul-mente',
    bg: 'bg-azul-mente',
    borderLeft: 'border-l-azul-mente',
    borderFull: 'border-azul-mente/40',
    shadow: 'shadow-[0_0_14px_rgba(91,140,255,0.35)]',
    hoverFeit: 'hover:bg-azul-mente/20',
  },
  disciplina: {
    text: 'text-amarelo',
    bg: 'bg-amarelo',
    borderLeft: 'border-l-amarelo',
    borderFull: 'border-amarelo/40',
    shadow: 'shadow-[0_0_14px_rgba(255,200,87,0.35)]',
    hoverFeit: 'hover:bg-amarelo/20',
  },
};

interface MissionCardProps {
  tipo: MissionTipo;
  label: string;
  icon: string;
  content: string;
  status: { completed: boolean; failed: boolean };
  isCurrentDay: boolean;
  onComplete: () => void;
  onFailed: () => void;
  salvando: boolean;
}

function MissionCard({
  tipo, label, icon, content, status, isCurrentDay, onComplete, onFailed, salvando,
}: MissionCardProps) {
  const c = MISSION_COLORS[tipo];
  const borderClass = status.completed
    ? `border-l-[3px] ${c.borderLeft} ${c.borderFull} ${c.shadow}`
    : status.failed
    ? 'border-l-[3px] border-l-vermelho border-vermelho/40 shadow-[0_0_14px_rgba(255,59,59,0.35)]'
    : 'border-l-[3px] border-l-cinza-borda border-cinza-borda';

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      className={`bg-cinza-escuro border rounded px-3 py-3 mt-3 transition-all duration-300 ${borderClass}`}
    >
      <div className="flex items-start justify-between mb-2.5">
        <div className="flex-1">
          <div className="font-mono text-[7px] tracking-[2px] text-branco-dim uppercase mb-0.5">
            {label}
          </div>
          <div className="font-body text-xs text-branco tracking-wide leading-relaxed">
            {content}
          </div>
        </div>
        <div
          className={`text-lg ml-2 flex-shrink-0 ${
            status.completed ? `${c.text} font-display` :
            status.failed ? 'text-vermelho' : 'text-branco-dim'
          }`}
        >
          {status.completed ? '✓' : status.failed ? '✗' : icon}
        </div>
      </div>

      {isCurrentDay && (
        <div className="flex gap-2">
          <motion.button
            onClick={onComplete}
            disabled={salvando}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className={`flex-1 py-2 rounded text-xs font-display tracking-[2px] transition-all ${
              status.completed
                ? `${c.bg} text-preto`
                : `bg-cinza-medio border border-cinza-borda text-branco ${c.hoverFeit}`
            }`}
          >
            FEITO
          </motion.button>
          <motion.button
            onClick={onFailed}
            disabled={salvando}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className={`flex-1 py-2 rounded text-xs font-display tracking-[2px] transition-all ${
              status.failed
                ? 'bg-vermelho text-branco'
                : 'bg-cinza-medio border border-cinza-borda text-branco hover:bg-vermelho/20'
            }`}
          >
            FALHOU
          </motion.button>
        </div>
      )}

      {!isCurrentDay && (
        <div className={`text-center py-1 font-mono text-[8px] tracking-[2px] uppercase ${
          status.completed ? c.text : 'text-branco-dim/50'
        }`}>
          {status.completed ? '✓ CONCLUÍDO' : status.failed ? '✗ FALHOU' : '— SEM REGISTRO'}
        </div>
      )}
    </motion.div>
  );
}

export default function DayDetailModal({
  isOpen, onClose, dia, missao, isCurrentDay,
  missionStatus, onComplete, onFailed, salvando,
  modoGuerraAtivo, modoGuerraMultiplicador, user,
}: DayDetailModalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const isCheckpoint = dia === 7 || dia === 14;
  const isFinal = dia === 21;

  const formatarCorpo = () => {
    if (!missao) return '';
    let corpo = missao.corpo;
    if (modoGuerraAtivo && modoGuerraMultiplicador > 1 && isCurrentDay) {
      corpo = aplicarMultiplicadorModoGuerra(corpo, modoGuerraMultiplicador);
    }
    return Object.entries(corpo)
      .map(([ex, val]) => {
        const nome = ex.replace(/_/g, ' ');
        if (ex === 'prancha') {
          if (val >= 60) {
            const m = Math.floor(val / 60);
            const s = val % 60;
            return s > 0 ? `${nome}: ${m}m ${s}s` : `${nome}: ${m}m`;
          }
          return `${nome}: ${val}s`;
        }
        return `${nome}: ${val}x`;
      })
      .join(' • ');
  };

  const allDone =
    missionStatus.corpo.completed &&
    missionStatus.mente.completed &&
    missionStatus.disciplina.completed;

  const badgeLabel = isCheckpoint
    ? '★ CHECKPOINT'
    : isFinal
    ? '🎖 MISSÃO FINAL'
    : isCurrentDay
    ? 'MISSÃO DE HOJE'
    : `DIA ${dia} — CONCLUÍDO`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 z-40"
            onClick={onClose}
          />

          {/* Bottom sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 320 }}
            className="fixed inset-x-0 bottom-0 z-50 bg-preto rounded-t-2xl max-h-[92vh] flex flex-col border-t border-cinza-borda shadow-2xl"
          >
            {/* Drag handle */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-cinza-borda rounded-full" />

            {/* Header */}
            <div className="flex items-start justify-between px-4 pt-7 pb-3 border-b border-cinza-borda flex-shrink-0">
              <div className="flex-1 min-w-0">
                <div className="font-mono text-[7px] tracking-[3px] text-vermelho uppercase mb-1">
                  {badgeLabel}
                </div>
                <h2 className="font-display text-xl tracking-wider text-branco leading-tight">
                  DIA {String(dia).padStart(2, '0')} — {missao?.nome}
                </h2>
                {isCurrentDay && modoGuerraAtivo && (
                  <div className="mt-1 inline-flex items-center gap-1 bg-vermelho/10 border border-vermelho/30 rounded px-2 py-0.5">
                    <span className="text-[9px] text-vermelho font-mono tracking-[2px] uppercase">
                      ☢ MODO GUERRA +{Math.round((modoGuerraMultiplicador - 1) * 100)}%
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={onClose}
                className="ml-3 mt-0.5 w-8 h-8 rounded-full bg-cinza-medio border border-cinza-borda flex items-center justify-center text-branco-dim hover:text-branco transition-colors flex-shrink-0 text-sm"
              >
                ✕
              </button>
            </div>

            {/* Scrollable content */}
            <div ref={scrollRef} className="overflow-y-auto flex-1 px-4 pb-10">
              {/* Mission cards */}
              <MissionCard
                tipo="corpo"
                label="CORPO"
                icon="💪"
                content={formatarCorpo()}
                status={missionStatus.corpo}
                isCurrentDay={isCurrentDay}
                onComplete={() => onComplete('corpo')}
                onFailed={() => onFailed('corpo')}
                salvando={salvando}
              />

              <MissionCard
                tipo="mente"
                label="MENTE"
                icon="🧠"
                content={missao?.mente || ''}
                status={missionStatus.mente}
                isCurrentDay={isCurrentDay}
                onComplete={() => onComplete('mente')}
                onFailed={() => onFailed('mente')}
                salvando={salvando}
              />

              <MissionCard
                tipo="disciplina"
                label="DISCIPLINA"
                icon="⚡"
                content={missao?.disciplina || ''}
                status={missionStatus.disciplina}
                isCurrentDay={isCurrentDay}
                onComplete={() => onComplete('disciplina')}
                onFailed={() => onFailed('disciplina')}
                salvando={salvando}
              />

              {/* Completion share — current day only when all done */}
              {isCurrentDay && <DayCompletionShare isVisible={allDone} />}

              {/* Memento Mori — always show if user has birthday data */}
              {user?.data_nascimento && user?.idade && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <MementoMori
                    dataNascimento={user.data_nascimento}
                    idade={user.idade}
                  />
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
