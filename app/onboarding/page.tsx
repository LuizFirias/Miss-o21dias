'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useUserStore } from '@/store/userStore';
import type { Nivel, Modo } from '@/types';

export default function OnboardingPage() {
  const router = useRouter();
  const { setUser } = useUserStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Estado do onboarding
  const [modo, setModo] = useState<Modo>('normal');
  const [nivel, setNivel] = useState<Nivel>('iniciante');

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/login');
      return;
    }

    // Verificar se já fez onboarding → ir direto para home
    const { data: usuario } = await supabase
      .from('usuarios')
      .select('dia_atual')
      .eq('id', session.user.id)
      .single();

    if (usuario) {
      router.replace('/home');
    }
  }

  async function handleContinue() {
    if (step === 1) {
      setStep(2);
      return;
    }

    // Step 2 - Finalizar onboarding
    setLoading(true);
    
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error('Usuário não autenticado');

      // Criar ou atualizar usuário no banco
      const { data, error } = await supabase
        .from('usuarios')
        .upsert({
          id: authUser.id,
          email: authUser.email!,
          nome: authUser.email!.split('@')[0],
          nivel,
          modo,
          dia_atual: 1,
          streak: 0,
          nivel_progressao: 0,
          limitacao: 'nenhuma',
          onboarding_completo: true,
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar usuário:', error);
        throw new Error(`Falha ao salvar dados: ${error.message}`);
      }

      setUser(data);
      router.push('/home');
    } catch (error: any) {
      console.error('Erro no onboarding:', error);
      const errorMsg = error?.message || 'Erro desconhecido ao finalizar cadastro';
      alert(`Erro: ${errorMsg}\n\nVerifique se você executou o SQL no Supabase.`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-preto flex flex-col px-5 py-12">
      {/* Step Indicator */}
      <div className="flex gap-1 mb-8 max-w-sm mx-auto w-full">
        <div className={`h-[2px] flex-1 rounded-full ${step >= 1 ? 'bg-vermelho' : 'bg-cinza-borda'}`} />
        <div className={`h-[2px] flex-1 rounded-full ${step >= 2 ? 'bg-vermelho' : 'bg-cinza-borda'}`} />
      </div>

      <div className="max-w-sm mx-auto w-full flex-1 flex flex-col">
        {step === 1 ? (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 flex flex-col"
          >
            {/* Título */}
            <h1 className="font-display text-[22px] tracking-[2px] text-branco mb-1">
              VOCÊ QUER IR<br />ATÉ ONDE?
            </h1>
            <p className="text-[11px] text-branco-dim tracking-wider mb-6">
              escolha com honestidade
            </p>

            {/* Opções de Modo */}
            <div className="space-y-2 mb-auto">
              <motion.div
                whileTap={{ scale: 0.98 }}
                onClick={() => setModo('normal')}
                className={`
                  bg-cinza-medio border rounded-md p-3 flex items-center gap-2.5 cursor-pointer transition-all
                  ${modo === 'normal' 
                    ? 'border-vermelho bg-vermelho/5' 
                    : 'border-cinza-borda'
                  }
                `}
              >
                <div className={`
                  w-3.5 h-3.5 rounded-full border-2 flex-shrink-0
                  ${modo === 'normal' 
                    ? 'border-vermelho bg-vermelho' 
                    : 'border-cinza-borda'
                  }
                `} />
                <div className="flex-1">
                  <div className="font-body font-semibold text-[13px] tracking-wider text-branco">
                    NORMAL
                  </div>
                </div>
                <div className="font-mono text-[10px] text-branco-dim">
                  adaptado
                </div>
              </motion.div>

              <motion.div
                whileTap={{ scale: 0.98 }}
                onClick={() => setModo('guerra')}
                className={`
                  bg-cinza-medio border rounded-md p-3 flex items-center gap-2.5 cursor-pointer transition-all
                  ${modo === 'guerra' 
                    ? 'border-vermelho bg-vermelho/5' 
                    : 'border-cinza-borda'
                  }
                `}
              >
                <div className={`
                  w-3.5 h-3.5 rounded-full border-2 flex-shrink-0
                  ${modo === 'guerra' 
                    ? 'border-vermelho bg-vermelho' 
                    : 'border-cinza-borda'
                  }
                `} />
                <div className="flex-1">
                  <div className="font-body font-semibold text-[13px] tracking-wider text-vermelho flex items-center gap-1">
                    <span className="text-base">●</span> GUERRA
                  </div>
                </div>
                <div className="font-mono text-[10px] text-branco-dim">
                  máximo
                </div>
              </motion.div>

              {modo === 'guerra' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-cinza-escuro border border-cinza-borda rounded-md p-3"
                >
                  <div className="font-body text-[11px] text-amarelo mb-1 tracking-wider uppercase font-semibold">
                    MODO GUERRA
                  </div>
                  <div className="font-body text-[10px] text-branco-dim leading-relaxed">
                    Sem pausas. Missões dobradas. Pressão máxima. Sem desculpa.
                  </div>
                </motion.div>
              )}
            </div>

            <motion.button
              onClick={handleContinue}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-vermelho border-none rounded py-3 text-white font-display text-base tracking-[3px] mt-6"
            >
              CONFIRMAR
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 flex flex-col"
          >
            {/* Título */}
            <h1 className="font-display text-[22px] tracking-[2px] text-branco mb-1">
              QUAL SEU NÍVEL<br />ATUAL?
            </h1>
            <p className="text-[11px] text-branco-dim tracking-wider mb-6">
              seja honesto consigo mesmo
            </p>

            {/* Opções de Nível */}
            <div className="space-y-2 mb-auto">
              <motion.div
                whileTap={{ scale: 0.98 }}
                onClick={() => setNivel('iniciante')}
                className={`
                  bg-cinza-medio border rounded-md p-3 flex items-center gap-2.5 cursor-pointer transition-all
                  ${nivel === 'iniciante' 
                    ? 'border-verde bg-verde/5' 
                    : 'border-cinza-borda'
                  }
                `}
              >
                <div className={`
                  w-3.5 h-3.5 rounded-full border-2 flex-shrink-0
                  ${nivel === 'iniciante' 
                    ? 'border-verde bg-verde' 
                    : 'border-cinza-borda'
                  }
                `} />
                <div className="flex-1">
                  <div className="font-body font-semibold text-[13px] tracking-wider text-branco">
                    INICIANTE
                  </div>
                </div>
                <div className="font-mono text-[10px] text-branco-dim">
                  0-5 dias
                </div>
              </motion.div>

              <motion.div
                whileTap={{ scale: 0.98 }}
                onClick={() => setNivel('intermediario')}
                className={`
                  bg-cinza-medio border rounded-md p-3 flex items-center gap-2.5 cursor-pointer transition-all
                  ${nivel === 'intermediario' 
                    ? 'border-amarelo bg-amarelo/5' 
                    : 'border-cinza-borda'
                  }
                `}
              >
                <div className={`
                  w-3.5 h-3.5 rounded-full border-2 flex-shrink-0
                  ${nivel === 'intermediario' 
                    ? 'border-amarelo bg-amarelo' 
                    : 'border-cinza-borda'
                  }
                `} />
                <div className="flex-1">
                  <div className="font-body font-semibold text-[13px] tracking-wider text-branco">
                    INTERMEDIÁRIO
                  </div>
                </div>
                <div className="font-mono text-[10px] text-branco-dim">
                  6-14 dias
                </div>
              </motion.div>

              <motion.div
                whileTap={{ scale: 0.98 }}
                onClick={() => setNivel('avancado')}
                className={`
                  bg-cinza-medio border rounded-md p-3 flex items-center gap-2.5 cursor-pointer transition-all
                  ${nivel === 'avancado' 
                    ? 'border-vermelho bg-vermelho/5' 
                    : 'border-cinza-borda'
                  }
                `}
              >
                <div className={`
                  w-3.5 h-3.5 rounded-full border-2 flex-shrink-0
                  ${nivel === 'avancado' 
                    ? 'border-vermelho bg-vermelho' 
                    : 'border-cinza-borda'
                  }
                `} />
                <div className="flex-1">
                  <div className="font-body font-semibold text-[13px] tracking-wider text-branco">
                    AVANÇADO
                  </div>
                </div>
                <div className="font-mono text-[10px] text-branco-dim">
                  15-21 dias
                </div>
              </motion.div>
            </div>

            <motion.button
              onClick={handleContinue}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-vermelho border-none rounded py-3 text-white font-display text-base tracking-[3px] mt-6 disabled:opacity-50"
            >
              {loading ? 'CARREGANDO...' : 'COMEÇAR'}
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
