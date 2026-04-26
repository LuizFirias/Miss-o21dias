'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';

export default function ContinuidadePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    
    // Verificar se tem acesso
    if (!user.continuidade_30dias) {
      router.push('/arsenal');
    }
  }, [user, loading, router]);

  if (loading || !user || !user.continuidade_30dias) {
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
      <div className="min-h-screen bg-preto flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-6xl mb-6">⏰</div>
          
          <div className="font-mono text-[9px] tracking-[3px] text-verde uppercase mb-2">
            Arsenal Avançado
          </div>
          
          <h1 className="font-display text-4xl tracking-wider text-branco mb-4">
            CONTINUIDADE
            <br />
            <span className="text-verde">(30 DIAS EXTRAS)</span>
          </h1>

          <p className="font-mono text-[10px] tracking-[2px] text-branco-dim uppercase mb-8">
            Consolidação Total
          </p>

          <div className="max-w-md mx-auto mb-8">
            <p className="font-body text-base text-branco-dim/60 leading-relaxed">
              Estenda sua jornada com 30 dias adicionais de missões exclusivas para consolidação total dos hábitos.
            </p>
          </div>

          <div className="bg-cinza-escuro border border-verde/30 rounded-lg p-6 mb-8 max-w-md mx-auto">
            <div className="font-mono text-[9px] tracking-[3px] text-verde uppercase mb-3">
              ✓ Acesso Liberado
            </div>
            <p className="font-body text-sm text-branco-dim leading-relaxed">
              Conteúdo exclusivo em desenvolvimento.
              <br /><br />
              Em breve você terá acesso aos 30 dias extras de missões para consolidar 
              definitivamente seus novos hábitos e alcançar resultados extraordinários.
            </p>
          </div>

          <button
            onClick={() => router.push('/arsenal')}
            className="bg-transparent border border-verde/40 hover:border-verde hover:bg-verde/10 text-verde font-display text-base tracking-[3px] py-3 px-8 rounded transition-all"
          >
            VOLTAR PARA ARSENAL
          </button>
        </motion.div>
      </div>
    </Layout>
  );
}
