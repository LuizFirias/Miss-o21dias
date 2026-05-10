'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModoGuerraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (percentual: 30 | 50 | 100) => Promise<void>;
}

export default function ModoGuerraModal({
  isOpen,
  onClose,
  onConfirm,
}: ModoGuerraModalProps) {
  const [selectedPercentual, setSelectedPercentual] = useState<
    30 | 50 | 100 | null
  >(null);
  const [loading, setLoading] = useState(false);

  const options = [
    {
      value: 30 as const,
      label: '+30%',
      color: 'bg-amarelo',
      intensity: 'Moderado',
    },
    {
      value: 50 as const,
      label: '+50%',
      color: 'bg-laranja',
      intensity: 'Agressivo',
    },
    {
      value: 100 as const,
      label: '+100%',
      color: 'bg-vermelho',
      intensity: 'EXTREMO',
    },
  ];

  const handleConfirm = async () => {
    if (!selectedPercentual) return;

    setLoading(true);
    try {
      await onConfirm(selectedPercentual);
    } finally {
      setLoading(false);
      setSelectedPercentual(null);
    }
  };

  const handleClose = () => {
    setSelectedPercentual(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-sm bg-preto border-2 border-vermelho rounded-2xl p-6 shadow-2xl">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="text-5xl mb-3">☢️</div>
                <h2 className="text-2xl font-black text-vermelho">
                  MODO GUERRA
                </h2>
                <p className="text-branco text-sm mt-2">
                  Escolha sua intensidade para HOJE
                </p>
              </div>

              {/* Warning Box */}
              <div className="bg-vermelho/15 border border-vermelho/50 rounded-lg p-4 mb-6">
                <p className="text-vermelho text-sm font-semibold">
                  ⚠️ ATENÇÃO: Essa decisão é{' '}
                  <span className="text-vermelho font-black">IRREVERSÍVEL</span>{' '}
                  hoje.
                </p>
                <p className="text-branco text-xs mt-2">
                  Todos os exercícios serão multiplicados. Não há volta atrás até
                  amanhã.
                </p>
              </div>

              {/* Intensity Options */}
              <div className="space-y-3 mb-6">
                {options.map((option) => (
                  <motion.button
                    key={option.value}
                    onClick={() => setSelectedPercentual(option.value)}
                    className={`w-full py-3 px-4 rounded-lg font-bold transition-all ${
                      selectedPercentual === option.value
                        ? `${option.color} text-preto scale-105 shadow-lg`
                        : `bg-cinza-borda/20 text-branco hover:bg-cinza-borda/40`
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg">{option.label}</span>
                      <span className="text-xs opacity-75">{option.intensity}</span>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Selected Info */}
              {selectedPercentual && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-amarelo/15 border border-amarelo/50 rounded-lg p-3 mb-6 text-center"
                >
                  <p className="text-branco text-sm font-semibold">
                    Multiplicador: 1.{selectedPercentual === 30 ? '3x' : selectedPercentual === 50 ? '5x' : '2.0x'}
                  </p>
                </motion.div>
              )}

              {/* Buttons */}
              <div className="flex gap-3">
                <motion.button
                  onClick={handleClose}
                  className="flex-1 py-3 px-4 bg-cinza-borda/20 text-branco rounded-lg font-bold hover:bg-cinza-borda/40 transition-all disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                >
                  Cancelar
                </motion.button>
                <motion.button
                  onClick={handleConfirm}
                  disabled={!selectedPercentual || loading}
                  className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all ${
                    selectedPercentual
                      ? 'bg-vermelho text-preto hover:bg-vermelho/90 shadow-lg'
                      : 'bg-cinza-borda/20 text-cinza-borda opacity-50 cursor-not-allowed'
                  }`}
                  whileHover={selectedPercentual ? { scale: 1.02 } : {}}
                  whileTap={selectedPercentual ? { scale: 0.98 } : {}}
                >
                  {loading ? 'Ativando...' : 'CONFIRMAR'}
                </motion.button>
              </div>

              {/* Footer */}
              <p className="text-center text-xs text-branco/70 mt-4">
                Amanhã você poderá ativar novamente
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
