'use client';

import { motion } from 'framer-motion';

interface DayCompletionShareProps {
  isVisible: boolean;
}

export default function DayCompletionShare({ isVisible }: DayCompletionShareProps) {
  if (!isVisible) return null;

  const handleCopyUsername = () => {
    navigator.clipboard.writeText('@caosotaku');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className="my-8 mx-4 p-5 bg-gradient-to-r from-laranja/10 to-amarelo/10 border-2 border-laranja rounded-xl"
    >
      {/* Emoji Header */}
      <div className="text-center mb-3">
        <motion.div
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-4xl"
        >
          📸
        </motion.div>
      </div>

      {/* Título */}
      <h3 className="font-display text-lg tracking-[2px] text-laranja text-center mb-2">
        MISSÃO DO DIA CUMPRIDA!
      </h3>

      {/* Descrição */}
      <p className="font-body text-xs text-branco text-center leading-relaxed mb-4">
        Você completou os 3 desafios de hoje (corpo, mente e disciplina).
      </p>

      {/* CTA Principal */}
      <div className="bg-laranja/20 border border-laranja rounded-lg p-4 mb-4">
        <p className="font-body text-sm text-branco font-semibold text-center mb-2">
          Tire um print e mostre sua disciplina:
        </p>
        <p className="font-display text-lg tracking-[2px] text-laranja text-center">
          Envie para @caosotaku
        </p>
      </div>

      {/* Botão Copy Username */}
      <motion.button
        onClick={handleCopyUsername}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-laranja text-preto font-display text-sm tracking-[1.5px] py-2.5 rounded font-bold mb-2 transition-all"
      >
        COPIAR @caosotaku
      </motion.button>

      {/* Motivational Text */}
      <p className="font-body text-[11px] text-branco-dim text-center leading-relaxed">
        Compartilhar sua vitória te mantém accountable e inspira outros. Vamos!
      </p>
    </motion.div>
  );
}
