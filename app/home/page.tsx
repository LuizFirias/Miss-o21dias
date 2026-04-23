'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useUserStore } from '@/store/userStore';
import { MISSOES } from '@/data/missoes';
import { aplicarMultiplicador, calcularProgresso, isCheckpoint } from '@/utils/helpers';
import Layout from '@/components/Layout';
import Header from '@/components/Header';
import ProgressBar from '@/components/ProgressBar';
import DayCard from '@/components/DayCard';
import CheckpointScreen from '@/components/CheckpointScreen';
import Loading from '@/components/Loading';
import type { User } from '@/types';

export default function HomePage() {
  const router = useRouter();
  const { user, setUser } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [showCheckpoint, setShowCheckpoint] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }

      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error || !userData) {
        router.push('/onboarding');
        return;
      }

      setUser(userData as User);
      
      // Verificar se é checkpoint
      if (isCheckpoint(userData.dia_atual)) {
        setShowCheckpoint(true);
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/login');
  }

  function handleIniciarMissao() {
    router.push('/missao');
  }

  if (loading) return <Loading />;
  if (!user) return null;

  const missaoAtual = MISSOES.find((m) => m.dia === user.dia_atual);
  if (!missaoAtual) return <div>Missão não encontrada</div>;

  const progresso = calcularProgresso(user.dia_atual);

  if (showCheckpoint) {
    return (
      <CheckpointScreen
        dia={user.dia_atual}
        onContinue={() => setShowCheckpoint(false)}
      />
    );
  }

  return (
    <Layout>
      <Header
        diaAtual={user.dia_atual}
        streak={user.streak}
        nome={user.nome}
      />

      <ProgressBar progresso={progresso} />

      <DayCard
        dia={user.dia_atual}
        nome={missaoAtual.nome}
        onClick={handleIniciarMissao}
      />

      {user.dia_atual === 21 && (
        <div className="bg-amarelo text-preto p-4 rounded-lg text-center font-bold mb-4">
          🏆 ÚLTIMA MISSÃO! TERMINE COM TUDO!
        </div>
      )}

      <div className="text-center">
        <button
          onClick={handleLogout}
          className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
        >
          Sair
        </button>
      </div>
    </Layout>
  );
}
