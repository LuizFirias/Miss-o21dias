'use client';

import { motion } from 'framer-motion';

interface DayCardProps {
  dia: number;
  nome: string;
  status: 'bloqueado' | 'disponivel' | 'completo' | 'falhou';
  onClick?: () => void;
}

export default function DayCard({ dia, nome, status, onClick }: DayCardProps) {
  const isClickable = status === 'disponivel';
  const isCurrent = status === 'disponivel';

  const statusConfig = {
    bloqueado: {
      bg: 'bg-cinza-escuro',
      border: 'border-cinza-borda',
      textColor: 'text-branco-dim',
      icon: '🔒',
    },
    disponivel: {
      bg: 'bg-cinza-medio',
      border: 'border-vermelho',
      textColor: 'text-branco',
      icon: '▶',
    },
    completo: {
      bg: 'bg-cinza-escuro',
      border: 'border-verde',
      textColor: 'text-verde',
      icon: '✓',
    },
    falhou: {
      bg: 'bg-cinza-escuro',
      border: 'border-vermelho/30',
      textColor: 'text-vermelho/50',
      icon: '✕',
    },
  };

  const config = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={isClickable ? { scale: 1.02 } : {}}
      whileTap={isClickable ? { scale: 0.98 } : {}}
      onClick={isClickable ? onClick : undefined}
      className={`
        ${config.bg} border ${config.border} rounded p-3
        ${isClickable ? 'cursor-pointer' : 'cursor-default'}
        ${isCurrent ? 'ring-1 ring-vermelho/30' : ''}
        transition-all
      `}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="font-mono text-[9px] tracking-[3px] text-branco-dim uppercase">
          DIA {dia}
        </div>
        <span className={`text-xs ${config.textColor}`}>
          {config.icon}
        </span>
      </div>

      <div className={`font-display text-sm tracking-wider ${config.textColor}`}>
        {nome}
      </div>

      {status === 'disponivel' && (
        <div className="mt-2 pt-2 border-t border-cinza-borda">
          <div className="font-body text-[10px] tracking-wider text-branco-dim uppercase">
            Toque para iniciar
          </div>
        </div>
      )}
    </motion.div>
  );
}
