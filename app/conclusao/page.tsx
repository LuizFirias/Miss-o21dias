'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';

export default function ConclusaoPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/home');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-preto flex items-center justify-center">
        <div className="font-mono text-branco-dim text-sm tracking-wider">
          CARREGANDO...
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center -mt-8">
        <div className="text-center max-w-2xl">
          <div className="text-8xl mb-6">🏆</div>
          
          <h1 className="text-4xl font-bold text-amarelo mb-4">
            MISSÃO COMPLETA
          </h1>
          
          <p className="text-2xl text-gray-300 mb-8">
            Você completou os 21 dias.<br />
            Agora você é Sargento.
          </p>

          <div className="bg-gray-900 border border-amarelo rounded-lg p-6 mb-8">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-gray-400 text-sm mb-2">DIAS COMPLETOS</p>
                <p className="text-3xl font-bold text-verde">21</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-2">STREAK FINAL</p>
                <p className="text-3xl font-bold text-vermelho">{user.streak}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-gray-400">
              A maioria desiste. Você não desistiu.<br />
              Agora carregue isso para o resto da vida.
            </p>
            
            <button
              onClick={() => router.push('/home')}
              className="bg-vermelho hover:bg-red-600 text-white font-bold py-4 px-8 rounded-lg uppercase transition-colors"
            >
              VOLTAR AO INÍCIO
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
