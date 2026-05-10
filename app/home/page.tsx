'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout';
import ModoGuerraModal from '@/components/ModoGuerraModal';
import ModoGuerraButton from '@/components/ModoGuerraButton';
import EvolutionPath from '@/components/EvolutionPath';
import DayDetailModal from '@/components/DayDetailModal';
import { useAuth } from '@/hooks/useAuth';
import { useUserStore } from '@/store/userStore';
import { MISSOES } from '@/data/missoes';
import { supabase } from '@/lib/supabase';
import {
  getNivelProgressao,
  aplicarMultiplicadorModoGuerra,
  getMultiplicadorDoPercentual,
} from '@/utils/helpers';

function getHojeBrasilia(): string {
  const hoje = new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' });
  return new Date(hoje).toISOString().split('T')[0];
}

const FRASES_DO_DIA = [
  'É… tem gente na sua frente só porque fez o básico que você evita.',
  'Enquanto você pensa, alguém já fez.',
  'Você não está cansado… só está acostumado a fugir.',
  'Ninguém te segura mais do que você mesmo.',
  'Você sabe o que fazer — só não tem coragem de fazer.',
  'Tem gente vencendo com menos que você e sem reclamar.',
  'Você não precisa de mais tempo… precisa parar de desperdiçar.',
  'O problema não é sua vida — é sua falta de atitude.',
  'Você quer resultado… mas vive como quem não quer nada.',
  'Sua rotina é o reflexo da sua fraqueza atual.',
  'Não é falta de motivação — é excesso de desculpa.',
  'Cada dia que você adia… alguém te ultrapassa.',
  'Você não está perdido — está acomodado.',
  'Se continuar assim, nada muda. Simples.',
  'Você já sabe o que precisa mudar… só está ignorando.',
  'Seu potencial não vale nada sem ação.',
  'Você quer respeito, mas não se respeita.',
  'O desconforto que você evita é o que te faria crescer.',
  'Você está treinando todo dia… só que para continuar o mesmo.',
  'Se fosse importante pra você, já teria feito.',
  'Ou você muda agora… ou aceita quem está se tornando.',
];

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { updateUser } = useUserStore();
  const [progressoPercentual, setProgressoPercentual] = useState(0);
  const [progressoId, setProgressoId] = useState<string | null>(null);
  const [missionStatus, setMissionStatus] = useState({
    corpo: { completed: false, failed: false },
    mente: { completed: false, failed: false },
    disciplina: { completed: false, failed: false },
  });
  const [salvando, setSalvando] = useState(false);
  const [showModoGuerraModal, setShowModoGuerraModal] = useState(false);
  const [modoGuerraAtivo, setModoGuerraAtivo] = useState(false);
  const [modoGuerraMultiplicador, setModoGuerraMultiplicador] = useState(1.0);
  const [showSuccessMessage, setShowSuccessMessage] = useState<{ percentual: number } | null>(null);

  // Trail / day modal state
  const [selectedDia, setSelectedDia] = useState<number>(1);
  const [showDayModal, setShowDayModal] = useState(false);

  // Verificar e resetar Modo Guerra (quando data muda)
  async function verificarResetModoGuerra() {
    if (!user) return;
    try {
      const hojeBrasilia = getHojeBrasilia();
      const { data: userData } = await supabase
        .from('usuarios')
        .select('modo_guerra_ativo, modo_guerra_data_ativacao, modo_guerra_multiplicador')
        .eq('id', user.id)
        .maybeSingle();

      if (userData?.modo_guerra_ativo && userData?.modo_guerra_data_ativacao !== hojeBrasilia) {
        await supabase
          .from('usuarios')
          .update({ modo_guerra_ativo: false, modo_guerra_multiplicador: 1.0, modo_guerra_data_ativacao: null })
          .eq('id', user.id);
        setModoGuerraAtivo(false);
        setModoGuerraMultiplicador(1.0);
      } else if (userData?.modo_guerra_ativo) {
        setModoGuerraAtivo(true);
        setModoGuerraMultiplicador(userData.modo_guerra_multiplicador || 1.0);
      }
    } catch (error) {
      console.error('Erro ao verificar reset de Modo Guerra:', error);
    }
  }

  // Verificar avanço de dia (respeita checkpoints)
  async function verificarAvancoDia() {
    if (!user) return;
    try {
      const hojeBrasilia = getHojeBrasilia();
      const { data: userData } = await supabase
        .from('usuarios')
        .select('ultimo_acesso_dia, dia_atual')
        .eq('id', user.id)
        .maybeSingle();

      if (!userData?.ultimo_acesso_dia) {
        await supabase
          .from('usuarios')
          .update({ ultimo_acesso_dia: hojeBrasilia })
          .eq('id', user.id);
        return;
      }

      const ultimoAcesso = userData.ultimo_acesso_dia;
      if (ultimoAcesso === hojeBrasilia) return;

      // Novo dia — verificar se completou 2+ missões ontem
      const { data: progressoOntem } = await supabase
        .from('progresso_dia')
        .select('corpo_completo, mente_completo, disciplina_completo')
        .eq('user_id', user.id)
        .eq('data', ultimoAcesso)
        .maybeSingle();

      let missoesCompletas = 0;
      if (progressoOntem) {
        missoesCompletas =
          (progressoOntem.corpo_completo ? 1 : 0) +
          (progressoOntem.mente_completo ? 1 : 0) +
          (progressoOntem.disciplina_completo ? 1 : 0);
      }

      let novoDia: number;
      if (missoesCompletas >= 2) {
        novoDia = Math.min(userData.dia_atual + 1, 21);
      } else {
        // Reset to last reached checkpoint — protect progress already earned
        const d = userData.dia_atual;
        if (d > 14) novoDia = 14;
        else if (d > 7) novoDia = 7;
        else novoDia = 1;
      }

      await supabase
        .from('usuarios')
        .update({ dia_atual: novoDia, ultimo_acesso_dia: hojeBrasilia, nivel_progressao: novoDia })
        .eq('id', user.id);

      updateUser({ dia_atual: novoDia, nivel_progressao: novoDia });

      if (novoDia !== userData.dia_atual) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Erro ao verificar avanço de dia:', error);
    }
  }

  // Ativar Modo Guerra
  const handleAtivarModoGuerra = async (percentual: 30 | 50 | 100) => {
    if (!user) return;
    const multiplicador = getMultiplicadorDoPercentual(percentual);
    const hojeBrasilia = getHojeBrasilia();
    try {
      await supabase
        .from('usuarios')
        .update({ modo_guerra_ativo: true, modo_guerra_multiplicador: multiplicador, modo_guerra_data_ativacao: hojeBrasilia })
        .eq('id', user.id);
      setModoGuerraAtivo(true);
      setModoGuerraMultiplicador(multiplicador);
      setShowModoGuerraModal(false);
      setShowSuccessMessage({ percentual });
    } catch (error) {
      console.error('Erro ao ativar Modo Guerra:', error);
    }
  };

  // Carregar progresso do dia atual
  async function carregarProgressoDia() {
    if (!user) return;
    try {
      await verificarAvancoDia();
      const hojeBrasilia = getHojeBrasilia();
      const { data: progressoExistente } = await supabase
        .from('progresso_dia')
        .select('*')
        .eq('user_id', user.id)
        .eq('dia', user.dia_atual)
        .eq('data', hojeBrasilia)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (progressoExistente) {
        setProgressoId(progressoExistente.id);
        setMissionStatus({
          corpo: { completed: progressoExistente.corpo_completo || false, failed: !progressoExistente.corpo_completo },
          mente: { completed: progressoExistente.mente_completo || false, failed: !progressoExistente.mente_completo },
          disciplina: { completed: progressoExistente.disciplina_completo || false, failed: !progressoExistente.disciplina_completo },
        });
      }

      await verificarResetModoGuerra();
    } catch {
      // Nenhum progresso hoje ainda — estado inicial (tudo false)
    }
  }

  // Salvar progresso automaticamente
  async function salvarProgressoAutomatico(novoStatus: typeof missionStatus) {
    if (!user || salvando) return;
    setSalvando(true);
    try {
      const hojeBrasilia = getHojeBrasilia();
      const completedCount =
        (novoStatus.corpo.completed ? 1 : 0) +
        (novoStatus.mente.completed ? 1 : 0) +
        (novoStatus.disciplina.completed ? 1 : 0);

      if (progressoId) {
        await supabase
          .from('progresso_dia')
          .update({
            corpo_completo: novoStatus.corpo.completed,
            mente_completo: novoStatus.mente.completed,
            disciplina_completo: novoStatus.disciplina.completed,
            status: completedCount >= 2 ? 'feito' : 'falhou',
          })
          .eq('id', progressoId);
      } else {
        const { data } = await supabase
          .from('progresso_dia')
          .insert({
            user_id: user.id,
            dia: user.dia_atual,
            data: hojeBrasilia,
            corpo_completo: novoStatus.corpo.completed,
            mente_completo: novoStatus.mente.completed,
            disciplina_completo: novoStatus.disciplina.completed,
            status: completedCount >= 2 ? 'feito' : 'falhou',
          })
          .select()
          .single();
        if (data) setProgressoId(data.id);
      }
    } catch (error) {
      console.error('Erro ao salvar progresso:', error);
    } finally {
      setSalvando(false);
    }
  }

  const handleMissionComplete = (tipo: 'corpo' | 'mente' | 'disciplina') => {
    const novoStatus = { ...missionStatus, [tipo]: { completed: true, failed: false } };
    setMissionStatus(novoStatus);
    salvarProgressoAutomatico(novoStatus);
  };

  const handleMissionFailed = (tipo: 'corpo' | 'mente' | 'disciplina') => {
    const novoStatus = { ...missionStatus, [tipo]: { completed: false, failed: true } };
    setMissionStatus(novoStatus);
    salvarProgressoAutomatico(novoStatus);
  };

  const handleDiaClick = (dia: number) => {
    setSelectedDia(dia);
    setShowDayModal(true);
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user && !user.onboarding_completo) {
      router.push('/onboarding');
    } else if (user) {
      carregarProgressoDia();
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const percentual = ((user.dia_atual - 1) / 21) * 100;
      setProgressoPercentual(Math.min(percentual, 100));
      setSelectedDia(user.dia_atual);
    }
  }, [user]);

  if (loading || !user) {
    return (
      <Layout>
        <div className="min-h-screen bg-preto flex items-center justify-center">
          <div className="font-mono text-branco-dim text-sm tracking-wider">CARREGANDO...</div>
        </div>
      </Layout>
    );
  }

  const diaAtual = user.dia_atual || 1;
  const missaoSelecionada = MISSOES.find((m) => m.dia === selectedDia);
  const fraseHoje = FRASES_DO_DIA[diaAtual - 1] || FRASES_DO_DIA[0];
  const nivelAtual = getNivelProgressao(diaAtual);
  const percentualInteiro = Math.round(progressoPercentual);

  // Status summary for quick visual in header
  const missionsDone =
    (missionStatus.corpo.completed ? 1 : 0) +
    (missionStatus.mente.completed ? 1 : 0) +
    (missionStatus.disciplina.completed ? 1 : 0);

  return (
    <Layout>
      <div className="min-h-screen bg-preto pb-20">
        {/* ── Header: frase + Modo Guerra ── */}
        <div className="px-4 pt-4 pb-3 max-w-md mx-auto">
          <div className="flex items-start justify-between gap-3">
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex-1 font-body text-sm text-vermelho font-semibold leading-relaxed tracking-wide text-center"
            >
              "{fraseHoje}"
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="flex-shrink-0"
            >
              <ModoGuerraButton
                temAcesso={user?.modo_guerra_acesso || false}
                estaAtivo={modoGuerraAtivo}
                onClick={() => setShowModoGuerraModal(true)}
              />
            </motion.div>
          </div>
        </div>

        {/* ── Progress bar + stats ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-cinza-escuro border-b border-cinza-borda px-4 py-3"
        >
          <div className="max-w-md mx-auto">
            {/* Stats row */}
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="font-mono text-[7px] tracking-[2px] text-branco-dim uppercase">Dias completos</div>
                <div className="font-display text-lg text-vermelho leading-none">{diaAtual - 1}/21</div>
              </div>
              <div className="text-center">
                <div className="font-mono text-[7px] tracking-[2px] text-branco-dim uppercase">Progresso</div>
                <div className="font-display text-lg text-laranja leading-none">{percentualInteiro}%</div>
              </div>
              <div className="text-right">
                <div className="font-mono text-[7px] tracking-[2px] text-branco-dim uppercase">Nível</div>
                <div className="font-display text-sm text-amarelo leading-none">{nivelAtual.toUpperCase()}</div>
              </div>
            </div>

            {/* Barra de progresso */}
            <div className="w-full h-1.5 bg-cinza-medio rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressoPercentual}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-vermelho to-amarelo"
              />
            </div>

            {/* Hoje: missões feitas */}
            {missionsDone > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 flex items-center justify-center gap-1"
              >
                <span className="font-mono text-[7px] tracking-[2px] text-branco-dim uppercase">Hoje:</span>
                {['💪', '🧠', '⚡'].map((icon, i) => {
                  const keys = ['corpo', 'mente', 'disciplina'] as const;
                  const s = missionStatus[keys[i]];
                  return (
                    <span
                      key={icon}
                      className={`text-sm ${s.completed ? '' : s.failed ? 'opacity-30' : 'opacity-20'}`}
                    >
                      {icon}
                    </span>
                  );
                })}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* ── Trail header ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="px-4 pt-5 pb-1 max-w-md mx-auto"
        >
          <div className="flex items-center justify-between mb-1">
            <div>
              <h1 className="font-display text-lg tracking-[3px] text-branco uppercase">
                TRILHA DE EVOLUÇÃO
              </h1>
              <p className="font-mono text-[7px] tracking-[2px] text-branco-dim uppercase mt-0.5">
                Toque no dia atual para iniciar a missão
              </p>
            </div>
            <div className="text-right">
              <div className="font-mono text-[7px] tracking-[2px] text-branco-dim uppercase">DIA ATUAL</div>
              <div className="font-display text-2xl text-vermelho leading-none">
                {String(diaAtual).padStart(2, '0')}
              </div>
            </div>
          </div>

          {/* Decorative line */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-vermelho/40 to-transparent mt-2" />
        </motion.div>

        {/* ── Evolution Trail ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="px-4 max-w-xs mx-auto"
        >
          <EvolutionPath diaAtual={diaAtual} onDiaClick={handleDiaClick} />
        </motion.div>

        {/* ── Day Detail Modal ── */}
        <DayDetailModal
          isOpen={showDayModal}
          onClose={() => setShowDayModal(false)}
          dia={selectedDia}
          missao={missaoSelecionada}
          isCurrentDay={selectedDia === diaAtual}
          missionStatus={missionStatus}
          onComplete={handleMissionComplete}
          onFailed={handleMissionFailed}
          salvando={salvando}
          modoGuerraAtivo={modoGuerraAtivo}
          modoGuerraMultiplicador={modoGuerraMultiplicador}
          user={user}
        />

        {/* ── Modo Guerra Success Modal ── */}
        <AnimatePresence>
          {showSuccessMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-sm bg-preto border-2 border-verde rounded-2xl p-8 shadow-2xl text-center"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="text-5xl mb-6"
                >
                  ☢️
                </motion.div>
                <h2 className="text-2xl font-black text-verde mb-4">MODO GUERRA ATIVADO</h2>
                <p className="text-branco text-lg font-semibold mb-2">
                  +{showSuccessMessage.percentual}% de intensidade
                </p>
                <p className="text-branco/70 text-sm mb-6 leading-relaxed">
                  Essa decisão é IRREVERSÍVEL hoje.
                  <br />
                  Amanhã você poderá ativar novamente.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowSuccessMessage(null)}
                  className="bg-verde text-preto font-black px-8 py-3 rounded-lg text-base tracking-wider hover:bg-verde/90 transition-all"
                >
                  OK
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Modo Guerra Modal ── */}
        <ModoGuerraModal
          isOpen={showModoGuerraModal}
          onClose={() => setShowModoGuerraModal(false)}
          onConfirm={handleAtivarModoGuerra}
        />
      </div>
    </Layout>
  );
}
