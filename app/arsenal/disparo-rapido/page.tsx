'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';

export default function DisparoRapidoPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    
    // Verificar se tem acesso
    if (!user.disparo_rapido_acesso) {
      router.push('/arsenal');
    }
  }, [user, loading, router]);

  if (loading || !user || !user.disparo_rapido_acesso) {
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
          <div className="text-6xl mb-6">⚡</div>
          
          <div className="font-mono text-[9px] tracking-[3px] text-amarelo uppercase mb-2">
            Arsenal Avançado
          </div>
          
          <h1 className="font-display text-4xl tracking-wider text-branco mb-4">
            DISPARO RÁPIDO
            <br />
            <span className="text-amarelo">SISTEMA DE EXECUÇÃO IMEDIATA</span>
          </h1>

          <p className="font-mono text-[10px] tracking-[2px] text-branco-dim uppercase mb-8">
            Zero Procrastinação
          </p>

          <div className="max-w-md mx-auto mb-8">
            <p className="font-body text-base text-branco-dim/60 leading-relaxed">
              Framework completo para transformar qualquer ideia em ação em menos de 24 horas.
            </p>
          </div>

          <div className="bg-cinza-escuro border border-amarelo/30 rounded-lg p-6 mb-8 max-w-md mx-auto">
            <div className="font-mono text-[9px] tracking-[3px] text-amarelo uppercase mb-3">
              ⚡ Acesso Liberado
            </div>
            <p className="font-body text-sm text-branco-dim leading-relaxed">
              Conteúdo exclusivo em desenvolvimento.
              <br /><br />
              Em breve você terá acesso ao framework completo do Disparo Rápido: 
              protocolos de execução imediata, templates de ação instantânea e 
              sistema anti-procrastinação definitivo.
            </p>
          </div>

          <button
            onClick={() => router.push('/arsenal')}
            className="bg-transparent border border-amarelo/40 hover:border-amarelo hover:bg-amarelo/10 text-amarelo font-display text-base tracking-[3px] py-3 px-8 rounded transition-all"
          >
            VOLTAR PARA ARSENAL
          </button>
        </motion.div>
      </div>
    </Layout>
  );
}
