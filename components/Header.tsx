'use client';

import { motion } from 'framer-motion';
import { useUserStore } from '@/store/userStore';

export default function Header() {
  const { user } = useUserStore();

  if (!user) return null;

  // Calcula nível baseado no dia atual
  const nivel = Math.floor(user.dia_atual / 7) + 1;
  const nivelMax = 3;
  
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-cinza-escuro border-b border-cinza-borda px-4 py-3"
    >
      <div className="flex items-center justify-between max-w-md mx-auto">
        {/* Dia Atual */}
        <div>
          <div className="font-mono text-[9px] tracking-[3px] text-branco-dim uppercase">
            Dia Atual
          </div>
          <div className="font-display text-2xl tracking-wider text-branco">
            {user.dia_atual || 1}
          </div>
        </div>

        {/* Level Badge */}
        <div className="flex items-center gap-2 bg-cinza-medio border border-cinza-borda rounded-full px-3 py-1.5">
          <div className="font-mono text-[8px] tracking-[2px] text-branco-dim uppercase">
            Nível
          </div>
          <div className="flex items-center gap-0.5">
            {[...Array(nivelMax)].map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full ${
                  i < nivel ? 'bg-amarelo' : 'bg-cinza-borda'
                }`}
              />
            ))}
          </div>
          <div className="font-display text-sm tracking-wide text-amarelo">
            {nivel}
          </div>
        </div>

        {/* Streak */}
        <div className="text-right">
          <div className="font-mono text-[9px] tracking-[3px] text-branco-dim uppercase">
            Streak
          </div>
          <div className="font-display text-2xl tracking-wider text-verde">
            {user.streak || 0}
            <span className="text-[10px] ml-0.5">🔥</span>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
