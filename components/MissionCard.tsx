'use client';

import { motion } from 'framer-motion';

interface MissionCardProps {
  tipo: 'corpo' | 'mente' | 'disciplina';
  conteudo: string;
  onComplete: () => void;
  onFail: () => void;
  completed?: boolean;
  failed?: boolean;
  disabled?: boolean;
}

export default function MissionCard({
  tipo,
  conteudo,
  onComplete,
  onFail,
  completed = false,
  failed = false,
  disabled = false,
}: MissionCardProps) {
  const config = {
    corpo: {
      cor: 'vermelho',
      label: 'CORPO',
      borderClass: 'border-l-vermelho',
      bgClass: 'bg-vermelho/5',
    },
    mente: {
      cor: 'azul-mente',
      label: 'MENTE',
      borderClass: 'border-l-azul-mente',
      bgClass: 'bg-azul-mente/5',
    },
    disciplina: {
      cor: 'amarelo',
      label: 'DISCIPLINA',
      borderClass: 'border-l-amarelo',
      bgClass: 'bg-amarelo/5',
    },
  };

  const { label, borderClass, bgClass } = config[tipo];

  // Determinar cor do contorno neon
  const getBorderGlow = () => {
    if (disabled) return '';
    if (completed) return 'shadow-[0_0_10px_rgba(0,200,83,0.3)] border-verde/50';
    return 'shadow-[0_0_10px_rgba(255,59,59,0.2)] border-vermelho/30';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`
        bg-cinza-escuro border ${borderClass} border-l-[3px] rounded
        ${bgClass}
        ${disabled ? 'opacity-40' : getBorderGlow()}
        transition-all duration-300
      `}
    >
      <div className="p-4">
        {/* Tag da categoria */}
        <div className="mb-3">
          <span className="font-mono text-[8px] tracking-[3px] text-branco-dim uppercase border border-cinza-borda rounded-sm px-2 py-0.5">
            {label}
          </span>
        </div>

        {/* Conteúdo da missão */}
        <div className="mb-4 font-body text-sm leading-relaxed text-branco tracking-wide">
          {conteudo}
        </div>

        {/* Botões - sempre visíveis, mas com opacidade */}
        <div className="flex gap-2">
          <motion.button
            onClick={onComplete}
            disabled={disabled}
            whileHover={!disabled ? { scale: 1.02 } : {}}
            whileTap={!disabled ? { scale: 0.95 } : {}}
            animate={{
              opacity: completed ? 1 : 0.4,
              scale: completed ? [1, 1.05, 1] : 1,
            }}
            transition={{
              scale: { duration: 0.3 },
            }}
            className={`
              flex-1 border-none rounded py-2.5 font-display text-sm tracking-[2px] text-white
              transition-all duration-200
              ${completed 
                ? 'bg-verde shadow-lg shadow-verde/20' 
                : 'bg-verde/50 hover:bg-verde/70'
              }
              ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {completed && <span className="mr-1">✓</span>}
            FEITO
          </motion.button>
          
          <motion.button
            onClick={onFail}
            disabled={disabled}
            whileHover={!disabled ? { scale: 1.02 } : {}}
            whileTap={!disabled ? { scale: 0.95 } : {}}
            animate={{
              opacity: failed ? 1 : 0.4,
              scale: failed ? [1, 1.05, 1] : 1,
            }}
            transition={{
              scale: { duration: 0.3 },
            }}
            className={`
              flex-1 border-none rounded py-2.5 font-body text-xs tracking-wider text-white
              transition-all duration-200
              ${failed 
                ? 'bg-vermelho shadow-lg shadow-vermelho/20' 
                : 'bg-vermelho/50 hover:bg-vermelho/70'
              }
              ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {failed && <span className="mr-1">✕</span>}
            FALHOU
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
