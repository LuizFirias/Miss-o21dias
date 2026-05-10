'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInstallPWA } from '@/hooks/useInstallPWA';
import { useAuth } from '@/hooks/useAuth';

export default function PWAInstallModal() {
  const [showModal, setShowModal] = useState(false);
  const pwa = useInstallPWA();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading || !user) return;

    const lastDismissed = localStorage.getItem('pwa_install_dismissed');
    const today = new Date().toDateString();

    if (pwa.isMobile && !pwa.isInstalled && lastDismissed !== today) {
      const timer = setTimeout(() => setShowModal(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [pwa.isMobile, pwa.isInstalled, user, loading]);

  const handleDismiss = () => {
    setShowModal(false);
    localStorage.setItem('pwa_install_dismissed', new Date().toDateString());
  };

  const handleInstallAndroid = async () => {
    if (pwa.deferredPrompt) {
      pwa.deferredPrompt.prompt();
      const { outcome } = await pwa.deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowModal(false);
      }
    }
  };

  return (
    <AnimatePresence>
      {showModal && pwa.isMobile && !pwa.isInstalled && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-end justify-center z-50 safe-area-inset"
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full bg-preto border-t border-vermelho rounded-t-2xl p-5 pb-8 max-w-md"
          >
            {/* Fechar */}
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 text-branco-dim hover:text-branco text-xl"
            >
              ✕
            </button>

            {/* Título */}
            <h2 className="font-display text-lg tracking-[2px] text-branco mb-2">
              ADICIONE À TELA INICIAL
            </h2>
            <p className="font-body text-xs text-branco-dim mb-5 leading-relaxed">
              Acesso rápido. Sem publicidade. Experiência melhor.
            </p>

            {/* Instruções */}
            <div className="space-y-4 mb-6">
              {pwa.isIOS ? (
                // iOS Instructions
                <div className="bg-cinza-escuro border border-cinza-borda rounded-lg p-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-vermelho/20">
                        <span className="text-vermelho font-bold text-sm">1</span>
                      </div>
                    </div>
                    <div>
                      <p className="font-body font-semibold text-xs text-branco mb-1">
                        Clique no ícone de Compartilhar
                      </p>
                      <p className="font-body text-xs text-branco-dim">
                        No canto inferior direito do navegador Safari
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-3">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-vermelho/20">
                        <span className="text-vermelho font-bold text-sm">2</span>
                      </div>
                    </div>
                    <div>
                      <p className="font-body font-semibold text-xs text-branco mb-1">
                        Procure por "Adicionar à Tela Inicial"
                      </p>
                      <p className="font-body text-xs text-branco-dim">
                        Scroll para baixo se não aparecer no topo
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-3">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-vermelho/20">
                        <span className="text-vermelho font-bold text-sm">3</span>
                      </div>
                    </div>
                    <div>
                      <p className="font-body font-semibold text-xs text-branco mb-1">
                        Clique em "Adicionar"
                      </p>
                      <p className="font-body text-xs text-branco-dim">
                        Pronto! App adicionado à sua tela inicial
                      </p>
                    </div>
                  </div>
                </div>
              ) : pwa.isAndroid ? (
                // Android Instructions
                <div className="bg-cinza-escuro border border-cinza-borda rounded-lg p-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-amarelo/20">
                        <span className="text-amarelo font-bold text-sm">1</span>
                      </div>
                    </div>
                    <div>
                      <p className="font-body font-semibold text-xs text-branco mb-1">
                        Clique no menu (três pontos)
                      </p>
                      <p className="font-body text-xs text-branco-dim">
                        No canto superior direito do navegador
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-3">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-amarelo/20">
                        <span className="text-amarelo font-bold text-sm">2</span>
                      </div>
                    </div>
                    <div>
                      <p className="font-body font-semibold text-xs text-branco mb-1">
                        Procure por "Instalar app"
                      </p>
                      <p className="font-body text-xs text-branco-dim">
                        Ou "Adicionar à tela inicial"
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-3">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-amarelo/20">
                        <span className="text-amarelo font-bold text-sm">3</span>
                      </div>
                    </div>
                    <div>
                      <p className="font-body font-semibold text-xs text-branco mb-1">
                        Confirme a instalação
                      </p>
                      <p className="font-body text-xs text-branco-dim">
                        App pronto para usar offline
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Botões */}
            <div className="flex gap-3">
              {pwa.isAndroid && pwa.deferredPrompt ? (
                <motion.button
                  onClick={handleInstallAndroid}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-amarelo text-preto font-display text-sm tracking-[1px] py-2.5 rounded font-semibold"
                >
                  INSTALAR AGORA
                </motion.button>
              ) : null}

              <motion.button
                onClick={handleDismiss}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-transparent border border-cinza-borda text-branco-dim font-body text-xs tracking-wider py-2.5 rounded hover:border-branco hover:text-branco transition-colors"
              >
                AGORA NÃO
              </motion.button>
            </div>

            {/* Footer */}
            <p className="text-center text-[9px] text-branco-dim mt-4 leading-relaxed">
              Você verá isso novamente amanhã se não instalar
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
