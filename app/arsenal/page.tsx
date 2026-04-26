'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

interface ArsenalProduct {
  id: string;
  titulo: string;
  descricao: string;
  icone: string;
  corDestaque: string;
  rota: string;
  campo: 'modo_guerra_acesso' | 'continuidade_30dias' | 'disparo_rapido_acesso';
}

const ARSENAL_PRODUTOS: ArsenalProduct[] = [
  {
    id: 'modo-guerra',
    titulo: 'MODO GUERRA (ACESSO OCULTO)',
    descricao: 'Missões secretas de elite. Treinos intensificados. Protocolo avançado para quem quer ir além do limite.',
    icone: '🔥',
    corDestaque: '#FF3B3B',
    rota: '/arsenal/modo-guerra',
    campo: 'modo_guerra_acesso',
  },
  {
    id: 'continuidade',
    titulo: 'Continuidade (30 dias extras)',
    descricao: 'Estenda sua jornada com 30 dias adicionais de missões exclusivas para consolidação total dos hábitos.',
    icone: '⏰',
    corDestaque: '#00C853',
    rota: '/arsenal/continuidade',
    campo: 'continuidade_30dias',
  },
  {
    id: 'disparo-rapido',
    titulo: 'Disparo Rápido: Sistema de execução imediata',
    descricao: 'Framework completo para transformar qualquer ideia em ação em menos de 24 horas. Zero procrastinação.',
    icone: '⚡',
    corDestaque: '#FFC857',
    rota: '/arsenal/disparo-rapido',
    campo: 'disparo_rapido_acesso',
  },
];

export default function ArsenalPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [acessos, setAcessos] = useState<Record<string, boolean>>({
    modo_guerra_acesso: false,
    continuidade_30dias: false,
    disparo_rapido_acesso: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }

    // Carregar status de acesso
    const carregarAcessos = async () => {
      try {
        const { data, error } = await supabase
          .from('usuarios')
          .select('modo_guerra_acesso, continuidade_30dias, disparo_rapido_acesso')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        setAcessos({
          modo_guerra_acesso: data.modo_guerra_acesso || false,
          continuidade_30dias: data.continuidade_30dias || false,
          disparo_rapido_acesso: data.disparo_rapido_acesso || false,
        });
      } catch (error) {
        console.error('Erro ao carregar acessos:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarAcessos();
  }, [user, authLoading, router]);

  const handleProductClick = (produto: ArsenalProduct) => {
    const temAcesso = acessos[produto.campo];
    if (temAcesso) {
      router.push(produto.rota);
    }
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="font-mono text-sm text-branco-dim">Carregando...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-preto py-8 px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="font-mono text-[9px] tracking-[3px] text-laranja uppercase mb-2">
            Acesso Premium
          </div>
          <h1 className="font-display text-5xl tracking-wider text-branco mb-4">
            ARSENAL
            <br />
            <span className="text-laranja">AVANÇADO</span>
          </h1>
          <p className="font-body text-base text-branco-dim/60 max-w-md mx-auto">
            Recursos exclusivos para quem adquiriu os order bumps no checkout
          </p>
        </motion.div>

        {/* Lista de Produtos */}
        <div className="max-w-2xl mx-auto space-y-6">
          {ARSENAL_PRODUTOS.map((produto, index) => {
            const temAcesso = acessos[produto.campo];
            const isLocked = !temAcesso;

            return (
              <motion.div
                key={produto.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div
                  onClick={() => handleProductClick(produto)}
                  className={`
                    relative overflow-hidden rounded-lg border-2 p-6
                    ${isLocked 
                      ? 'border-cinza-borda bg-cinza-escuro/30 cursor-not-allowed' 
                      : 'border-transparent bg-cinza-escuro cursor-pointer hover:scale-[1.02] transition-transform'
                    }
                  `}
                  style={{
                    borderColor: isLocked ? undefined : `${produto.corDestaque}40`,
                  }}
                >
                  {/* Glow effect se desbloqueado */}
                  {!isLocked && (
                    <div
                      className="absolute inset-0 opacity-5"
                      style={{
                        background: `radial-gradient(circle at top right, ${produto.corDestaque}, transparent)`,
                      }}
                    />
                  )}

                  <div className="relative z-10 flex items-start gap-4">
                    {/* Ícone */}
                    <div 
                      className={`text-4xl ${isLocked ? 'grayscale opacity-30' : ''}`}
                    >
                      {isLocked ? '🔒' : produto.icone}
                    </div>

                    {/* Conteúdo */}
                    <div className="flex-1">
                      <h3 
                        className="font-display text-2xl tracking-wider mb-2"
                        style={{
                          color: isLocked ? '#555' : produto.corDestaque,
                        }}
                      >
                        {produto.titulo}
                      </h3>
                      <p className={`font-body text-sm leading-relaxed mb-4 ${isLocked ? 'text-branco-dim/30' : 'text-branco-dim/70'}`}>
                        {produto.descricao}
                      </p>

                      {/* Status */}
                      {isLocked ? (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-cinza-borda" />
                          <span className="font-mono text-[10px] tracking-[2px] text-branco-dim/40 uppercase">
                            Bloqueado • Requer Order Bump
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: produto.corDestaque }}
                          />
                          <span 
                            className="font-mono text-[10px] tracking-[2px] uppercase font-semibold"
                            style={{ color: produto.corDestaque }}
                          >
                            Acessar →
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Info sobre como desbloquear */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 max-w-lg mx-auto"
        >
          <div className="bg-cinza-escuro/40 border border-cinza-borda rounded-lg p-6">
            <div className="font-mono text-[9px] tracking-[3px] text-amarelo uppercase mb-3">
              ℹ️ Como Desbloquear
            </div>
            <p className="font-body text-sm text-branco-dim/60 leading-relaxed">
              Os produtos do Arsenal Avançado são desbloqueados através da aquisição dos 
              <span className="text-branco font-semibold"> order bumps </span>
              durante o processo de checkout da Missão 21 Dias.
              <br /><br />
              Caso você adquiriu algum produto e não está vendo aqui, entre em contato 
              com o suporte através de 
              <span className="text-branco font-semibold"> contato@saladotempo.site</span>.
            </p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
