'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-preto text-white">
      {/* Header com navegação e perfil */}
      <div className="border-b border-cinza-borda">
        <div className="container mx-auto px-4 py-3 max-w-2xl">
          <div className="flex justify-between items-center">
            {/* Navegação Principal */}
            <div className="flex items-center gap-6">
              <button
                onClick={() => router.push('/home')}
                className="font-display text-xl tracking-[3px] text-vermelho hover:text-vermelho/80 transition-colors"
              >
                SALA DO TEMPO
              </button>
              <button
                onClick={() => router.push('/foco')}
                className="font-display text-xl tracking-[3px] text-azul-mente hover:text-azul-mente/80 transition-colors"
              >
                FOCO
              </button>
              <button
                onClick={() => router.push('/bonus')}
                className="font-display text-xl tracking-[3px] text-amarelo hover:text-amarelo/80 transition-colors"
              >
                BÔNUS
              </button>
              <button
                onClick={() => router.push('/arsenal')}
                className="font-display text-xl tracking-[3px] text-laranja hover:text-laranja/80 transition-colors"
              >
                ARSENAL AVANÇADO
              </button>
            </div>

            {/* Ícone de Perfil */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/perfil')}
              className="w-10 h-10 bg-cinza-escuro border border-cinza-borda hover:border-vermelho rounded-full flex items-center justify-center transition-all group"
              aria-label="Perfil"
            >
              <svg
                className="w-5 h-5 text-branco-dim group-hover:text-vermelho transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {children}
      </main>
    </div>
  );
}
