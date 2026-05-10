'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface ModoGuerraButtonProps {
  temAcesso: boolean;
  estaAtivo: boolean;
  onClick: () => void;
}

export default function ModoGuerraButton({
  temAcesso,
  estaAtivo,
  onClick,
}: ModoGuerraButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (!temAcesso) {
      router.push('/arsenal');
      return;
    }
    onClick();
  };

  const baseClasses = 'px-4 py-2 rounded-lg font-bold text-sm transition-all';

  if (!temAcesso) {
    return (
      <motion.button
        onClick={handleClick}
        className={`${baseClasses} opacity-50 cursor-pointer text-cinza-borda bg-cinza-borda/10 hover:bg-cinza-borda/20`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Desbloqueie no Arsenal"
      >
        🔒 ATIVAR MODO GUERRA
      </motion.button>
    );
  }

  if (estaAtivo) {
    return (
      <motion.button
        onClick={handleClick}
        disabled
        className={`${baseClasses} bg-vermelho text-preto font-black shadow-lg drop-shadow-[0_0_8px_rgba(255,59,59,0.6)]`}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        title="Modo Guerra ativo até meia-noite"
      >
        ☢️ ATIVO
      </motion.button>
    );
  }

  return (
    <motion.button
      onClick={handleClick}
      className={`${baseClasses} text-amarelo bg-amarelo/10 hover:bg-amarelo/20 border border-amarelo/50`}
      whileHover={{ scale: 1.05, boxShadow: '0 0 12px rgba(255, 200, 87, 0.4)' }}
      whileTap={{ scale: 0.95 }}
    >
      ⚡ ATIVAR MODO GUERRA
    </motion.button>
  );
}
