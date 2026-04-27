'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

interface DayCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  completedCount: 0 | 1 | 2 | 3;
}

export default function DayCompletionModal({
  isOpen,
  onClose,
  completedCount,
}: DayCompletionModalProps) {
  
  useEffect(() => {
    if (isOpen) {
      // Fechar automaticamente após 4 segundos
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  const config = {
    1: {
      title: 'UM PASSO DE CADA VEZ',
      message: 'Você completou 1 missão hoje. Não é o ideal, mas é melhor que zero. Amanhã você consegue mais.',
      emoji: '💪',
      color: 'text-amarelo',
      borderColor: 'border-amarelo',
    },
    2: {
      title: 'QUASE LÁ!',
      message: 'Você completou 2 missões hoje. Está no caminho certo. Amanhã complete as 3 e prove seu valor.',
      emoji: '🔥',
      color: 'text-laranja',
      borderColor: 'border-laranja',
    },
    3: {
      title: 'DIA PERFEITO!',
      message: 'Você completou todas as 3 missões. Poucos têm essa disciplina. Continue assim e você será SARGENTO.',
      emoji: '⚡',
      color: 'text-verde',
      borderColor: 'border-verde',
    },
  };

  const selectedConfig = config[completedCount as 1 | 2 | 3] || config[1];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-preto/95 backdrop-blur-sm flex items-center justify-center z-50 p-5"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className={`bg-cinza-escuro border-2 ${selectedConfig.borderColor} rounded-lg p-8 max-w-md w-full relative`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Título */}
          <motion.h2
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className={`font-display text-2xl tracking-[3px] ${selectedConfig.color} mb-6 text-center`}
          >
            {selectedConfig.title}
          </motion.h2>

          {/* Área para PNG do personagem */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', damping: 15 }}
            className="w-40 h-40 mx-auto mb-6 flex items-center justify-center"
          >
            {/* Placeholder - usuário adicionará PNG aqui */}
            <div className="text-8xl select-none">
              {selectedConfig.emoji}
            </div>
          </motion.div>

          {/* Mensagem */}
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-body text-branco text-center leading-relaxed tracking-wide mb-6"
          >
            {selectedConfig.message}
          </motion.p>

          {/* Botão fechar */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className={`w-full bg-vermelho hover:bg-vermelho/80 text-branco font-display text-sm tracking-[2px] py-3 rounded transition-all`}
          >
            CONTINUAR
          </motion.button>

          {/* Indicador de auto-close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-3 text-center"
          >
            <p className="font-mono text-[10px] text-branco-dim tracking-wider">
              FECHAR AUTOMATICAMENTE EM 4s
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
