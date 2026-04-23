'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useUserStore } from '@/store/userStore';
import { MISSOES } from '@/data/missoes';
import { aplicarMultiplicador } from '@/utils/helpers';
import Layout from '@/components/Layout';
import MissionCard from '@/components/MissionCard';
import Modal from '@/components/Modal';
import Loading from '@/components/Loading';

export default function MissaoPage() {
  const router = useRouter();
  const { user, updateUser } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [missaoStatus, setMissaoStatus] = useState({
    corpo: { completed: false, failed: false },
    mente: { completed: false, failed: false },
    disciplina: { completed: false, failed: false },
  });

  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    onConfirm: () => {},
  });

  useEffect(() => {
    if (!user) {
      router.push('/home');
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading || !user) return <Loading />;

  const missaoAtual = MISSOES.find((m) => m.dia === user.dia_atual);
  if (!missaoAtual) return <div>Missão não encontrada</div>;

  const corpoAjustado = aplicarMultiplicador(missaoAtual.corpo, user.nivel);

  const todasConcluidas =
    missaoStatus.corpo.completed &&
    missaoStatus.mente.completed &&
    missaoStatus.disciplina.completed;

  const algumaFalhou =
    missaoStatus.corpo.failed ||
    missaoStatus.mente.failed ||
    missaoStatus.disciplina.failed;

  function handleComplete(tipo: 'corpo' | 'mente' | 'disciplina') {
    setMissaoStatus({
      ...missaoStatus,
      [tipo]: { completed: true, failed: false },
    });
  }

  function handleFail(tipo: 'corpo' | 'mente' | 'disciplina') {
    setMissaoStatus({
      ...missaoStatus,
      [tipo]: { completed: false, failed: true },
    });
  }

  async function finalizarDia() {
    if (!todasConcluidas && !algumaFalhou) {
      alert('Complete ou marque como falha todas as missões');
      return;
    }

    if (algumaFalhou) {
      setModalConfig({
        title: 'VOCÊ VOLTOU ATRÁS',
        message: 'Falhar significa reset de streak. Tem certeza?',
        onConfirm: () => salvarProgresso('falhou'),
      });
      setShowModal(true);
    } else {
      setModalConfig({
        title: 'VOCÊ FEZ O QUE POUCOS FAZEM',
        message: 'Confirmar conclusão do dia?',
        onConfirm: () => salvarProgresso('feito'),
      });
      setShowModal(true);
    }
  }

  async function salvarProgresso(status: 'feito' | 'falhou') {
    setSaving(true);
    setShowModal(false);

    try {
      // Salvar progresso do dia
      await supabase.from('progresso_dia').insert({
        user_id: user.id,
        dia: user.dia_atual,
        status,
      });

      // Verificar falhas consecutivas
      const { data: progressos } = await supabase
        .from('progresso_dia')
        .select('status')
        .eq('user_id', user.id)
        .order('data', { ascending: false })
        .limit(2);

      const falhousConsecutivo =
        progressos &&
        progressos.length >= 2 &&
        progressos[0].status === 'falhou' &&
        progressos[1].status === 'falhou';

      let novoDia = user.dia_atual;
      let novoStreak = user.streak;

      if (status === 'feito') {
        novoDia = user.dia_atual + 1;
        novoStreak = user.streak + 1;
      } else {
        novoStreak = 0;
        if (falhousConsecutivo) {
          novoDia = 1;
        }
      }

      // Atualizar usuário
      await supabase
        .from('users')
        .update({
          dia_atual: novoDia,
          streak: novoStreak,
          nivel_progressao: novoDia,
        })
        .eq('id', user.id);

      updateUser({
        dia_atual: novoDia,
        streak: novoStreak,
        nivel_progressao: novoDia,
      });

      if (novoDia > 21) {
        router.push('/conclusao');
      } else {
        router.push('/home');
      }
    } catch (error) {
      console.error('Erro ao salvar progresso:', error);
      alert('Erro ao salvar progresso. Tente novamente.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Layout>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <button
            onClick={() => router.push('/home')}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Voltar
          </button>
          <span className="text-gray-400">
            DIA {user.dia_atual.toString().padStart(2, '0')}/21
          </span>
        </div>
        <h1 className="text-3xl font-bold text-vermelho mb-2">
          {missaoAtual.nome}
        </h1>
        <p className="text-sm text-gray-400">Nível: {user.nivel.toUpperCase()}</p>
      </div>

      <div className="space-y-4 mb-6">
        <MissionCard
          titulo="CORPO"
          tipo="corpo"
          conteudo={corpoAjustado}
          onComplete={() => handleComplete('corpo')}
          onFail={() => handleFail('corpo')}
          completed={missaoStatus.corpo.completed}
          failed={missaoStatus.corpo.failed}
        />

        <MissionCard
          titulo="MENTE"
          tipo="mente"
          conteudo={missaoAtual.mente}
          onComplete={() => handleComplete('mente')}
          onFail={() => handleFail('mente')}
          completed={missaoStatus.mente.completed}
          failed={missaoStatus.mente.failed}
        />

        <MissionCard
          titulo="DISCIPLINA"
          tipo="disciplina"
          conteudo={missaoAtual.disciplina}
          onComplete={() => handleComplete('disciplina')}
          onFail={() => handleFail('disciplina')}
          completed={missaoStatus.disciplina.completed}
          failed={missaoStatus.disciplina.failed}
        />
      </div>

      <button
        onClick={finalizarDia}
        disabled={saving || (!todasConcluidas && !algumaFalhou)}
        className="w-full bg-verde hover:bg-green-600 text-white font-bold py-4 rounded-lg uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {saving ? 'SALVANDO...' : 'FINALIZAR DIA'}
      </button>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
      />
    </Layout>
  );
}
