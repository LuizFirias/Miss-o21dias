'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import Loading from '@/components/Loading';

interface Bonus {
  id: number;
  titulo: string;
  subtitulo: string;
  rota: string;
  diaDesbloqueio: number;
}

const BONUS_DATA: Bonus[] = [
  {
    id: 1,
    titulo: 'Rotina Blindada',
    subtitulo: 'Protocolo Diário de Alta Performance',
    rota: '/bonus/rotina-blindada',
    diaDesbloqueio: 1,
  },
  {
    id: 2,
    titulo: 'Protocolo Anti-Vício',
    subtitulo: 'Recuperação de Controle',
    rota: '/bonus/protocolo-anti-vicio',
    diaDesbloqueio: 7,
  },
  {
    id: 3,
    titulo: 'Código da Disciplina Militar',
    subtitulo: 'Fundamentos de Execução',
    rota: '/bonus/codigo-disciplina',
    diaDesbloqueio: 14,
  },
  {
    id: 4,
    titulo: 'Grupo WhatsApp Exclusivo',
    subtitulo: 'Comunidade de Guerreiros',
    rota: '/bonus/grupo-whatsapp',
    diaDesbloqueio: 21,
  },
];

export default function BonusPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <Loading />;
  }

  const isBonusUnlocked = (bonus: Bonus) => {
    return user.dia_atual >= bonus.diaDesbloqueio;
  };

  const getBonusesDesbloqueados = () => {
    return BONUS_DATA.filter(b => isBonusUnlocked(b)).length;
  };

  const handleBonusClick = (bonus: Bonus) => {
    if (isBonusUnlocked(bonus)) {
      router.push(bonus.rota);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-preto pb-8">
        {/* Header da seção */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-end mb-4">
            <div>
              <div className="font-mono text-[9px] tracking-[3px] text-amarelo uppercase mb-1">
                Recompensas
              </div>
              <h1 className="font-display text-4xl tracking-[3px] text-branco">
                BÔNUS
              </h1>
            </div>
            <div className="text-right">
              <div className="font-display text-3xl text-branco">
                <span className="text-amarelo">{getBonusesDesbloqueados()}</span>/{BONUS_DATA.length}
              </div>
              <div className="font-mono text-[7px] tracking-[2px] text-branco-dim uppercase">
                Desbloqueados
              </div>
            </div>
          </div>

          {/* Barra de progresso */}
          <div className="w-full h-2 bg-cinza-medio rounded-full overflow-hidden mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ 
                width: `${(getBonusesDesbloqueados() / BONUS_DATA.length) * 100}%` 
              }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-amarelo to-laranja"
            />
          </div>
          <div className="flex justify-between">
            <span className="font-mono text-[7px] tracking-[2px] text-amarelo uppercase">
              Progresso de Bônus
            </span>
            <span className="font-mono text-[7px] tracking-[2px] text-branco-dim uppercase">
              Continue avançando para desbloquear mais
            </span>
          </div>
        </motion.div>

        {/* Lista de bônus */}
        <div className="space-y-4">
          {BONUS_DATA.map((bonus, index) => {
            const unlocked = isBonusUnlocked(bonus);
            
            return (
              <motion.div
                key={bonus.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleBonusClick(bonus)}
                className={`
                  relative bg-cinza-escuro border rounded-lg p-5
                  transition-all duration-300
                  ${unlocked 
                    ? 'border-amarelo/40 cursor-pointer hover:border-amarelo hover:shadow-[0_0_20px_rgba(255,200,87,0.15)]' 
                    : 'border-cinza-borda opacity-50 cursor-not-allowed'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-display text-lg tracking-wider text-branco mb-1">
                      {bonus.titulo}
                    </h3>
                    <p className="font-mono text-[9px] tracking-[2px] text-branco-dim uppercase">
                      {bonus.subtitulo}
                    </p>
                  </div>

                  <div className="ml-4">
                    {unlocked ? (
                      <div className="flex items-center gap-2">
                        {user.dia_atual === bonus.diaDesbloqueio && (
                          <span className="bg-amarelo text-preto font-display text-[8px] tracking-[1px] px-2 py-1 rounded">
                            NEW
                          </span>
                        )}
                        <div className="text-3xl">✓</div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <div className="text-3xl opacity-30">🔒</div>
                        <div className="font-mono text-[8px] tracking-[2px] text-branco-dim uppercase bg-cinza-medio border border-cinza-borda rounded px-3 py-1">
                          Dia {bonus.diaDesbloqueio}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
