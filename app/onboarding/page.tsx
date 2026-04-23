'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Layout from '@/components/Layout';
import type { Nivel, Modo, Limitacao } from '@/types';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    nome: '',
    nivel: '' as Nivel,
    limitacao: 'nenhuma' as Limitacao,
    modo: '' as Modo,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      router.push('/login');
    }
  }

  async function handleSubmit() {
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Usuário não encontrado');

      const { error } = await supabase.from('users').insert({
        id: user.id,
        email: user.email!,
        nome: formData.nome,
        nivel: formData.nivel,
        modo: formData.modo,
        limitacao: formData.limitacao,
        dia_atual: 1,
        streak: 0,
        nivel_progressao: 0,
      });

      if (error) throw error;

      router.push('/home');
    } catch (error: any) {
      alert('Erro ao salvar dados: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-2">
              Como você quer ser chamado aqui dentro?
            </h2>
            <input
              type="text"
              placeholder="Seu nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-vermelho"
            />
            <button
              onClick={() => formData.nome && setStep(2)}
              disabled={!formData.nome}
              className="w-full bg-vermelho hover:bg-red-600 text-white font-bold py-4 rounded-lg uppercase disabled:opacity-50"
            >
              CONTINUAR
            </button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-2">
              Seja honesto. Onde você está hoje?
            </h2>
            <div className="space-y-3">
              {(['iniciante', 'intermediario', 'avancado'] as Nivel[]).map((nivel) => (
                <button
                  key={nivel}
                  onClick={() => {
                    setFormData({ ...formData, nivel });
                    setStep(3);
                  }}
                  className="w-full bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-vermelho text-white py-4 rounded-lg uppercase transition-all"
                >
                  {nivel === 'intermediario' ? 'INTERMEDIÁRIO' : nivel.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-2">
              Alguma limitação física?
            </h2>
            <div className="space-y-3">
              {(['nenhuma', 'joelho', 'lombar', 'ombro'] as Limitacao[]).map((lim) => (
                <button
                  key={lim}
                  onClick={() => {
                    setFormData({ ...formData, limitacao: lim });
                    setStep(4);
                  }}
                  className="w-full bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-vermelho text-white py-4 rounded-lg uppercase transition-all"
                >
                  {lim.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-2">
              Você quer ir até onde?
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => setFormData({ ...formData, modo: 'normal' })}
                className={`w-full border-2 py-6 rounded-lg uppercase transition-all ${
                  formData.modo === 'normal'
                    ? 'bg-amarelo border-amarelo text-preto'
                    : 'bg-gray-900 border-gray-800 hover:border-amarelo text-white'
                }`}
              >
                <div className="font-bold text-xl mb-2">MODO NORMAL</div>
                <div className="text-sm">Disciplina e evolução consistente</div>
              </button>
              
              <button
                onClick={() => setFormData({ ...formData, modo: 'guerra' })}
                className={`w-full border-2 py-6 rounded-lg uppercase transition-all ${
                  formData.modo === 'guerra'
                    ? 'bg-vermelho border-vermelho text-white'
                    : 'bg-gray-900 border-gray-800 hover:border-vermelho text-white'
                }`}
              >
                <div className="font-bold text-xl mb-2">MODO GUERRA</div>
                <div className="text-sm">Pressão máxima. Sem piedade.</div>
              </button>
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={!formData.modo || loading}
              className="w-full bg-verde hover:bg-green-600 text-white font-bold py-4 rounded-lg uppercase disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'SALVANDO...' : 'COMEÇAR AGORA'}
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center -mt-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-full ${
                    i <= step ? 'bg-vermelho' : 'bg-gray-800'
                  }`}
                />
              ))}
            </div>
          </div>

          {renderStep()}
        </div>
      </div>
    </Layout>
  );
}
