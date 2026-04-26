'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useUserStore } from '@/store/userStore';
import { MISSOES } from '@/data/missoes';
import { aplicarMultiplicador } from '@/utils/helpers';
import Layout from '@/components/Layout';
import MissionCard from '@/components/MissionCard';
import DayCompletionModal from '@/components/DayCompletionModal';
import Modal from '@/components/Modal';
import Loading from '@/components/Loading';

export default function MissaoPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { updateUser } = useUserStore();
  const [saving, setSaving] = useState(false);
  const [diaFinalizado, setDiaFinalizado] = useState(false);
  const [progressoId, setProgressoId] = useState<string | null>(null);
  
  const [missaoStatus, setMissaoStatus] = useState({
    corpo: { completed: false, failed: false },
    mente: { completed: false, failed: false },
    disciplina: { completed: false, failed: false },
  });

  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    onConfirm: () => {},
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/home');
    } else if (user) {
      carregarProgressoDia();
    }
  }, [user, authLoading, router]);

  async function carregarProgressoDia() {
    if (!user) return;

    // Verificar se é um novo dia e se pode avançar
    await verificarAvancoDia();

    // Verificar se já existe progresso salvo para o dia atual
    const { data: progressoExistente } = await supabase
      .from('progresso_dia')
      .select('*')
      .eq('user_id', user.id)
      .eq('dia', user.dia_atual)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (progressoExistente) {
      setProgressoId(progressoExistente.id);
      setDiaFinalizado(true);
      
      // Reconstruir estado baseado nas missões completadas
      setMissaoStatus({
        corpo: { 
          completed: progressoExistente.corpo_completo || false, 
          failed: !progressoExistente.corpo_completo 
        },
        mente: { 
          completed: progressoExistente.mente_completo || false, 
          failed: !progressoExistente.mente_completo 
        },
        disciplina: { 
          completed: progressoExistente.disciplina_completo || false, 
          failed: !progressoExistente.disciplina_completo 
        },
      });
    }
  }

  async function verificarAvancoDia() {
    if (!user) return;

    try {
      // Pegar data de hoje em horário de Brasília
      const hoje = new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' });
      const hojeBrasilia = new Date(hoje).toISOString().split('T')[0];

      // Pegar último acesso do usuário
      const { data: userData } = await supabase
        .from('usuarios')
        .select('ultimo_acesso_dia, dia_atual')
        .eq('id', user.id)
        .single();

      if (!userData || !userData.ultimo_acesso_dia) {
        // Primeira vez acessando, atualizar data
        await supabase
          .from('usuarios')
          .update({ ultimo_acesso_dia: hojeBrasilia })
          .eq('id', user.id);
        return;
      }

      const ultimoAcesso = userData.ultimo_acesso_dia;

      // Se ainda é o mesmo dia, não faz nada
      if (ultimoAcesso === hojeBrasilia) {
        return;
      }

      // É um novo dia! Verificar se completou pelo menos 2 missões ontem
      const { data: progressoOntem } = await supabase
        .from('progresso_dia')
        .select('corpo_completo, mente_completo, disciplina_completo')
        .eq('user_id', user.id)
        .eq('data', ultimoAcesso)
        .single();

      let missoesCompletas = 0;
      if (progressoOntem) {
        missoesCompletas = 
          (progressoOntem.corpo_completo ? 1 : 0) +
          (progressoOntem.mente_completo ? 1 : 0) +
          (progressoOntem.disciplina_completo ? 1 : 0);
      }

      let novoDia = userData.dia_atual;

      if (missoesCompletas >= 2) {
        // Avançar para o próximo dia
        novoDia = userData.dia_atual + 1;
      } else {
        // Não completou 2+ missões, volta para dia 1
        novoDia = 1;
      }

      // Atualizar usuário
      await supabase
        .from('usuarios')
        .update({
          dia_atual: novoDia,
          ultimo_acesso_dia: hojeBrasilia,
          nivel_progressao: novoDia,
        })
        .eq('id', user.id);

      // Atualizar store local
      updateUser({
        dia_atual: novoDia,
        nivel_progressao: novoDia,
      });

      // Recarregar página se mudou de dia
      if (novoDia !== userData.dia_atual) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Erro ao verificar avanço de dia:', error);
    }
  }

  const handleComplete = (tipo: 'corpo' | 'mente' | 'disciplina') => {
    setMissaoStatus(prev => ({
      ...prev,
      [tipo]: { completed: true, failed: false },
    }));
    
    // Auto-salvar progresso
    setTimeout(() => salvarProgressoAutomatico(), 100);
  };

  const handleFail = (tipo: 'corpo' | 'mente' | 'disciplina') => {
    setMissaoStatus(prev => ({
      ...prev,
      [tipo]: { completed: false, failed: true },
    }));
    
    // Auto-salvar progresso
    setTimeout(() => salvarProgressoAutomatico(), 100);
  };

  const salvarProgressoAutomatico = async () => {
    if (!user) return;

    const newCompletedCount = 
      (missaoStatus.corpo.completed ? 1 : 0) +
      (missaoStatus.mente.completed ? 1 : 0) +
      (missaoStatus.disciplina.completed ? 1 : 0);

    // Se tem progresso salvo, atualizar; senão criar novo
    if (progressoId) {
      const status = newCompletedCount === 3 ? 'feito' : 'falhou';
      await supabase
        .from('progresso_dia')
        .update({ 
          status,
          corpo_completo: missaoStatus.corpo.completed,
          mente_completo: missaoStatus.mente.completed,
          disciplina_completo: missaoStatus.disciplina.completed,
        })
        .eq('id', progressoId);
    } else {
      // Criar novo registro se não existe
      const status = newCompletedCount === 3 ? 'feito' : 'falhou';
      const { data } = await supabase
        .from('progresso_dia')
        .insert({
          user_id: user.id,
          dia: user.dia_atual,
          status,
          corpo_completo: missaoStatus.corpo.completed,
          mente_completo: missaoStatus.mente.completed,
          disciplina_completo: missaoStatus.disciplina.completed,
        })
        .select()
        .single();
      
      if (data) {
        setProgressoId(data.id);
      }
    }
  };

  const handleEditarDia = () => {
    setDiaFinalizado(false);
    setMissaoStatus({
      corpo: { completed: false, failed: false },
      mente: { completed: false, failed: false },
      disciplina: { completed: false, failed: false },
    });
    setProgressoId(null);
  };

  const finalizarDia = async () => {
    const completedCount = 
      (missaoStatus.corpo.completed ? 1 : 0) +
      (missaoStatus.mente.completed ? 1 : 0) +
      (missaoStatus.disciplina.completed ? 1 : 0);

    const algumaFalhou =
      missaoStatus.corpo.failed ||
      missaoStatus.mente.failed ||
      missaoStatus.disciplina.failed;

    const algumaRespondida = completedCount > 0 || algumaFalhou;

    if (!algumaRespondida) {
      alert('Marque pelo menos uma missão como feita ou falhou');
      return;
    }

    const todasConcluidas = completedCount === 3;

    // Se todas completadas, mostrar modal de parabéns direto
    if (todasConcluidas) {
      await salvarProgresso('feito');
      setShowCompletionModal(true);
      return;
    }

    // Se alguma falhou, pedir confirmação
    if (algumaFalhou) {
      setModalConfig({
        title: 'VOCÊ VOLTOU ATRÁS',
        message: 'Falhar significa reset de streak. Tem certeza?',
        onConfirm: () => {
          salvarProgresso('falhou');
          setShowConfirmModal(false);
          // Mostrar modal de incentivo
          setShowCompletionModal(true);
        },
      });
      setShowConfirmModal(true);
    } else {
      // Completou 1 ou 2, mostrar modal de reforço
      await salvarProgresso('feito');
      setShowCompletionModal(true);
    }
  };

  const salvarProgresso = async (status: 'feito' | 'falhou') => {
    if (!user) return;
    
    setSaving(true);

    try {
      const completedCount = 
        (missaoStatus.corpo.completed ? 1 : 0) +
        (missaoStatus.mente.completed ? 1 : 0) +
        (missaoStatus.disciplina.completed ? 1 : 0);

      // Se já existe progresso, atualizar; senão criar
      if (progressoId) {
        await supabase
          .from('progresso_dia')
          .update({ 
            status,
            corpo_completo: missaoStatus.corpo.completed,
            mente_completo: missaoStatus.mente.completed,
            disciplina_completo: missaoStatus.disciplina.completed,
          })
          .eq('id', progressoId);
      } else {
        const { data } = await supabase
          .from('progresso_dia')
          .insert({
            user_id: user.id,
            dia: user.dia_atual,
            status,
            corpo_completo: missaoStatus.corpo.completed,
            mente_completo: missaoStatus.mente.completed,
            disciplina_completo: missaoStatus.disciplina.completed,
          })
          .select()
          .single();
        
        if (data) {
          setProgressoId(data.id);
        }
      }

      // Atualizar último acesso
      await supabase
        .from('usuarios')
        .update({
          ultimo_acesso_dia: new Date().toISOString().split('T')[0],
        })
        .eq('id', user.id);

      // Atualizar streak apenas se completou 2 ou 3 missões
      let novoStreak = user.streak;
      
      if (completedCount >= 2) {
        novoStreak = user.streak + 1;
      } else {
        novoStreak = 0;
      }

      // Atualizar streak (NÃO avança dia aqui)
      await supabase
        .from('usuarios')
        .update({
          streak: novoStreak,
        })
        .eq('id', user.id);

      updateUser({
        streak: novoStreak,
      });

      setDiaFinalizado(true);
    } catch (error) {
      console.error('Erro ao salvar progresso:', error);
      alert('Erro ao salvar progresso. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleCloseCompletionModal = () => {
    setShowCompletionModal(false);
    
    // Redirecionar após fechar modal
    if (user && user.dia_atual > 21) {
      router.push('/conclusao');
    } else {
      router.push('/home');
    }
  };

  if (authLoading || !user) {
    return <Loading />;
  }

  const missaoAtual = MISSOES.find((m) => m.dia === user.dia_atual);
  
  if (!missaoAtual) {
    return (
      <Layout>
        <div className="text-center text-branco-dim">Missão não encontrada</div>
      </Layout>
    );
  }

  const corpoAjustado = aplicarMultiplicador(missaoAtual.corpo, user.nivel);
  
  // Formatar corpo como string
  const corpoTexto = Object.entries(corpoAjustado)
    .map(([exercicio, reps]) => {
      const nome = exercicio.replace(/_/g, ' ');
      return `${nome}: ${reps}x`;
    })
    .join(' • ');

  const completedCount = 
    (missaoStatus.corpo.completed ? 1 : 0) +
    (missaoStatus.mente.completed ? 1 : 0) +
    (missaoStatus.disciplina.completed ? 1 : 0);

  const algumaFalhou =
    missaoStatus.corpo.failed ||
    missaoStatus.mente.failed ||
    missaoStatus.disciplina.failed;
  
  const algumaRespondida = completedCount > 0 || algumaFalhou;

  return (
    <Layout>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <button
            onClick={() => router.push('/home')}
            className="text-branco-dim hover:text-branco transition-colors font-mono text-xs tracking-wider"
          >
            ← VOLTAR
          </button>
          <span className="text-branco-dim font-mono text-xs tracking-wider">
            DIA {user.dia_atual.toString().padStart(2, '0')}/21
          </span>
        </div>
        <h1 className="font-display text-3xl tracking-[3px] text-vermelho mb-2">
          {missaoAtual.nome}
        </h1>
        <p className="font-mono text-xs text-branco-dim tracking-wider">
          NÍVEL: {user.nivel.toUpperCase()}
        </p>
      </div>

      {diaFinalizado && (
        <div className="mb-4 p-3 bg-verde/10 border border-verde rounded">
          <div className="flex justify-between items-center">
            <p className="font-body text-sm text-verde">
              ✓ Dia finalizado! Você pode editar se precisar.
            </p>
            <button
              onClick={handleEditarDia}
              className="font-mono text-[10px] text-verde border border-verde px-3 py-1 rounded hover:bg-verde/20 transition-colors tracking-wider"
            >
              EDITAR
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4 mb-6">
        <MissionCard
          tipo="corpo"
          conteudo={corpoTexto}
          onComplete={() => handleComplete('corpo')}
          onFail={() => handleFail('corpo')}
          completed={missaoStatus.corpo.completed}
          failed={missaoStatus.corpo.failed}
          disabled={false}
        />

        <MissionCard
          tipo="mente"
          conteudo={missaoAtual.mente}
          onComplete={() => handleComplete('mente')}
          onFail={() => handleFail('mente')}
          completed={missaoStatus.mente.completed}
          failed={missaoStatus.mente.failed}
          disabled={false}
        />

        <MissionCard
          tipo="disciplina"
          conteudo={missaoAtual.disciplina}
          onComplete={() => handleComplete('disciplina')}
          onFail={() => handleFail('disciplina')}
          completed={missaoStatus.disciplina.completed}
          failed={missaoStatus.disciplina.failed}
          disabled={false}
        />
      </div>

      <button
        onClick={finalizarDia}
        disabled={saving || !algumaRespondida}
        className="w-full bg-vermelho hover:bg-vermelho/80 text-branco font-display text-sm tracking-[2px] py-4 rounded transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {saving ? 'SALVANDO...' : 'FINALIZAR DIA'}
      </button>

      {/* Modal de confirmação (falhas) */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
      />

      {/* Modal de conclusão do dia */}
      <DayCompletionModal
        isOpen={showCompletionModal}
        onClose={handleCloseCompletionModal}
        completedCount={completedCount as 0 | 1 | 2 | 3}
      />
    </Layout>
  );
}
