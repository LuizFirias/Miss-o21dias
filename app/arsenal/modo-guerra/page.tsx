'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { getMultiplicadorDoPercentual } from '@/utils/helpers';
import LockedOverlay from '@/components/botao-acao/LockedOverlay';

function getHojeBrasilia(): string {
  const hoje = new Date().toLocaleString('en-US', {
    timeZone: 'America/Sao_Paulo',
  });
  return new Date(hoje).toISOString().split('T')[0];
}

const INTENSIDADES: Array<{
  value: 30 | 50 | 100;
  label: string;
  cor: string;
  descricao: string;
  emoji: string;
}> = [
  {
    value: 30,
    label: '+30%',
    cor: '#FFC857',
    descricao: 'Moderado',
    emoji: '⚡',
  },
  {
    value: 50,
    label: '+50%',
    cor: '#FF8C42',
    descricao: 'Agressivo',
    emoji: '⚡⚡',
  },
  {
    value: 100,
    label: '+100%',
    cor: '#FF3B3B',
    descricao: 'EXTREMO',
    emoji: '⚡⚡⚡',
  },
];

export default function ModoGuerraPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [selectedIntensidade, setSelectedIntensidade] = useState<30 | 50 | 100 | null>(
    null
  );
  const [ativando, setAtivando] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState<{ percentual: number } | null>(null);

  const isUnlocked = user?.modo_guerra_acesso || false;

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleUnlock = useCallback(() => {
    alert(
      'Função de desbloqueio em desenvolvimento.\n\nEm produção, isso redirecionará para o checkout.'
    );
  }, []);

  const handleAtivar = useCallback(async () => {
    if (!user || !selectedIntensidade) return;

    setAtivando(true);
    try {
      const multiplicador = getMultiplicadorDoPercentual(selectedIntensidade);
      const hojeBrasilia = getHojeBrasilia();

      // Salvar no Supabase
      await supabase
        .from('usuarios')
        .update({
          modo_guerra_ativo: true,
          modo_guerra_multiplicador: multiplicador,
          modo_guerra_data_ativacao: hojeBrasilia,
        })
        .eq('id', user.id);

      // Mostrar sucesso
      setShowSuccess(true);
      setTimeout(() => {
        setSuccessMessage({ percentual: selectedIntensidade });
        setShowSuccess(false);
      }, 1500);
    } catch (error) {
      console.error('Erro ao ativar:', error);
      setAtivando(false);
      alert('Erro ao ativar Modo Guerra');
      setAtivando(false);
    }
  }, [user, selectedIntensidade, router]);

  const handleClose = useCallback(() => {
    router.push('/arsenal');
  }, [router]);

  const handleSuccessOk = useCallback(() => {
    setSuccessMessage(null);
    router.push('/arsenal');
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-preto">
        <div className="font-mono text-sm text-branco-dim">Carregando...</div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@400;500;600;700&family=Share+Tech+Mono&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; overflow: hidden; background: #0D0D0D; -webkit-tap-highlight-color: transparent; }
        button { -webkit-appearance: none; appearance: none; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .page-in { animation: fadeIn 0.3s ease forwards; }
      `}</style>

      <div
        className="page-in"
        style={{
          position: 'fixed',
          inset: 0,
          background: '#0D0D0D',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          padding: '20px',
        }}
      >
        {/* Ambient glow */}
        <motion.div
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: '-80px',
            right: '-80px',
            width: '260px',
            height: '260px',
            background: 'radial-gradient(circle, rgba(255,59,59,0.07) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '390px',
            zIndex: 10,
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '32px',
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: '7px',
                  letterSpacing: '3px',
                  color: 'rgba(255,255,255,0.2)',
                  textTransform: 'uppercase',
                  marginBottom: '4px',
                }}
              >
                SALA DO TEMPO 21
              </div>
              <div
                style={{
                  fontFamily: "'Bebas Neue', cursive",
                  fontSize: '20px',
                  letterSpacing: '2px',
                  color: '#FF3B3B',
                }}
              >
                ☢️ MODO GUERRA
              </div>
            </div>
            <button
              onClick={handleClose}
              style={{
                background: 'none',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                padding: '5px 9px',
                cursor: 'pointer',
                color: 'rgba(255,255,255,0.3)',
              }}
            >
              ✕
            </button>
          </div>

          {showSuccess ? (
            // Success state
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                textAlign: 'center',
                padding: '40px 20px',
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                style={{ fontSize: '64px', marginBottom: '20px' }}
              >
                ☢️
              </motion.div>
              <div
                style={{
                  fontFamily: "'Bebas Neue', cursive",
                  fontSize: '24px',
                  letterSpacing: '2px',
                  color: '#00C853',
                  marginBottom: '8px',
                }}
              >
                ATIVADO
              </div>
              <div
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.4)',
                }}
              >
                Exercícios potencializados
              </div>
            </motion.div>
          ) : (
            // Selection state
            <>
              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{
                  marginBottom: '32px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: '9px',
                    letterSpacing: '2px',
                    color: '#FF3B3B',
                    textTransform: 'uppercase',
                    marginBottom: '12px',
                  }}
                >
                  ⚡ Escolha sua Intensidade
                </div>
                <div
                  style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: '14px',
                    color: 'rgba(255,255,255,0.5)',
                    lineHeight: '1.6',
                  }}
                >
                  Todos os exercícios de hoje<br />
                  serão multiplicados pela intensidade escolhida.
                </div>
              </motion.div>

              {/* Intensity Cards */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  gap: '12px',
                  marginBottom: '24px',
                }}
              >
                {INTENSIDADES.map((int, idx) => (
                  <motion.button
                    key={int.value}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                    onClick={() => setSelectedIntensidade(int.value as 30 | 50 | 100)}
                    onDoubleClick={handleAtivar}
                    disabled={ativando}
                    style={{
                      background:
                        selectedIntensidade === int.value
                          ? int.cor
                          : 'rgba(255,59,59,0.08)',
                      border:
                        selectedIntensidade === int.value
                          ? `2px solid ${int.cor}`
                          : '1px solid rgba(255,59,59,0.2)',
                      borderRadius: '8px',
                      padding: '16px',
                      cursor: ativando ? 'not-allowed' : 'pointer',
                      opacity: ativando ? 0.6 : 1,
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ textAlign: 'left' }}>
                        <div
                          style={{
                            fontFamily: "'Bebas Neue', cursive",
                            fontSize: '22px',
                            letterSpacing: '2px',
                            color: '#FFF',
                            marginBottom: '4px',
                            fontWeight: 'bold',
                            textShadow: '0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.5)',
                          }}
                        >
                          {int.label}
                        </div>
                        <div
                          style={{
                            fontFamily: "'Share Tech Mono', monospace",
                            fontSize: '12px',
                            letterSpacing: '1px',
                            color: '#FFF',
                            textTransform: 'uppercase',
                            fontWeight: '600',
                            textShadow: '0 0 8px rgba(255,255,255,0.7)',
                          }}
                        >
                          {int.descricao}
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: '32px',
                        }}
                      >
                        {int.emoji}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Warning */}
              {selectedIntensidade && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: 'rgba(255,59,59,0.1)',
                    border: '1px solid rgba(255,59,59,0.3)',
                    borderRadius: '6px',
                    padding: '12px',
                    marginBottom: '24px',
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: '12px',
                    color: '#FF3B3B',
                    textAlign: 'center',
                    lineHeight: '1.5',
                  }}
                >
                  ⚠️ Essa decisão é <strong>IRREVERSÍVEL</strong> hoje
                </motion.div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClose}
                  disabled={ativando}
                  style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '6px',
                    padding: '12px',
                    cursor: ativando ? 'not-allowed' : 'pointer',
                    opacity: ativando ? 0.5 : 1,
                    fontFamily: "'Bebas Neue', cursive",
                    fontSize: '14px',
                    letterSpacing: '2px',
                    color: 'rgba(255,255,255,0.5)',
                    textTransform: 'uppercase',
                  }}
                >
                  Voltar
                </motion.button>
                <motion.button
                  whileHover={selectedIntensidade ? { scale: 1.02 } : {}}
                  whileTap={selectedIntensidade ? { scale: 0.98 } : {}}
                  onClick={handleAtivar}
                  disabled={!selectedIntensidade || ativando}
                  style={{
                    flex: 1,
                    background: selectedIntensidade ? '#FF3B3B' : 'rgba(255,255,255,0.04)',
                    border:
                      selectedIntensidade
                        ? '1px solid #FF3B3B'
                        : '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '6px',
                    padding: '12px',
                    cursor:
                      selectedIntensidade && !ativando
                        ? 'pointer'
                        : 'not-allowed',
                    opacity: selectedIntensidade && !ativando ? 1 : 0.5,
                    fontFamily: "'Bebas Neue', cursive",
                    fontSize: '14px',
                    letterSpacing: '2px',
                    color: selectedIntensidade ? '#FFF' : 'rgba(255,255,255,0.3)',
                    textTransform: 'uppercase',
                  }}
                >
                  {ativando ? 'Ativando...' : 'Confirmar'}
                </motion.button>
              </div>
            </>
          )}
        </motion.div>

        {/* Success Modal */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 100,
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                style={{
                  background: '#0D0D0D',
                  border: '2px solid #00C853',
                  borderRadius: '12px',
                  padding: '32px',
                  maxWidth: '340px',
                  textAlign: 'center',
                }}
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  style={{
                    fontSize: '48px',
                    marginBottom: '24px',
                  }}
                >
                  ☢️
                </motion.div>
                <div
                  style={{
                    fontFamily: "'Bebas Neue', cursive",
                    fontSize: '24px',
                    letterSpacing: '2px',
                    color: '#00C853',
                    marginBottom: '16px',
                  }}
                >
                  MODO GUERRA ATIVADO
                </div>
                <div
                  style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: '16px',
                    color: '#FFF',
                    marginBottom: '8px',
                    fontWeight: '500',
                  }}
                >
                  +{successMessage.percentual}% de intensidade
                </div>
                <div
                  style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: '13px',
                    color: 'rgba(255,255,255,0.6)',
                    marginBottom: '24px',
                    lineHeight: '1.6',
                  }}
                >
                  Essa decisão é IRREVERSÍVEL hoje.
                  <br />
                  Amanhã você poderá ativar novamente.
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSuccessOk}
                  style={{
                    background: '#00C853',
                    color: '#000',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '12px 32px',
                    fontFamily: "'Bebas Neue', cursive",
                    fontSize: '16px',
                    letterSpacing: '2px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                >
                  OK
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Locked Overlay */}
        <AnimatePresence>
          {!isUnlocked && (
            <LockedOverlay onUnlock={handleUnlock} />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
