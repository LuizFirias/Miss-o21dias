'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { MISSOES } from '@/data/missoes';
import { supabase } from '@/lib/supabase';

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [progressoPercentual, setProgressoPercentual] = useState(0);
  const [statusMissoes, setStatusMissoes] = useState({
    corpo: false,
    mente: false,
    disciplina: false,
  });

  useEffect(() => {
    if (!loading && !user) {
      console.log('🏠 HomePage: Sem usuário, redirecionando para /login');
      router.push('/login');
    } else if (user) {
      carregarProgressoDia();
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const percentual = ((user.dia_atual - 1) / 21) * 100;
      setProgressoPercentual(Math.min(percentual, 100));
    }
  }, [user]);

  async function carregarProgressoDia() {
    if (!user) return;

    try {
      // Buscar progresso do dia atual
      const { data: progresso } = await supabase
        .from('progresso_dia')
        .select('corpo_completo, mente_completo, disciplina_completo')
        .eq('user_id', user.id)
        .eq('dia', user.dia_atual)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (progresso) {
        setStatusMissoes({
          corpo: progresso.corpo_completo || false,
          mente: progresso.mente_completo || false,
          disciplina: progresso.disciplina_completo || false,
        });
      }
    } catch (error) {
      // Se não houver progresso ainda, mantém todos como false
      console.log('Nenhum progresso encontrado para hoje');
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-preto flex items-center justify-center">
        <div className="font-mono text-branco-dim text-sm tracking-wider">
          CARREGANDO...
        </div>
      </div>
    );
  }

  const diaAtual = user.dia_atual || 1;
  const missaoHoje = MISSOES.find((m) => m.dia === diaAtual);

  // Frases do dia
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

  const fraseHoje = FRASES_DO_DIA[diaAtual - 1] || FRASES_DO_DIA[0];

  // Formatar corpo para exibição
  const formatarCorpo = () => {
    if (!missaoHoje) return '';
    const exercicios = Object.entries(missaoHoje.corpo)
      .map(([exercicio, reps]) => {
        const nome = exercicio.replace(/_/g, ' ');
        return `${nome}: ${reps}x`;
      })
      .join(' • ');
    return exercicios;
  };

  function iniciarMissao() {
    router.push('/missao');
  }

  return (
    <Layout>
      <div className="min-h-screen bg-preto pb-8">
        {/* Frase do dia - FORA da caixa */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="px-4 pt-4 pb-3 max-w-md mx-auto text-center"
        >
          <p className="font-body text-sm text-vermelho font-semibold leading-relaxed tracking-wide">
            "{fraseHoje}"
          </p>
        </motion.div>

        {/* Progresso geral - REDUZIDO */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-cinza-escuro border-b border-cinza-borda px-4 py-2"
        >
          <div className="max-w-md mx-auto">
            <div className="flex items-baseline justify-between mb-1.5">
              <div className="font-mono text-[8px] tracking-[3px] text-branco-dim uppercase">
                Progresso Total
              </div>
              <div className="font-display text-base tracking-wider text-branco">
                {diaAtual - 1}/21
              </div>
            </div>

            {/* Barra de progresso */}
            <div className="w-full h-1.5 bg-cinza-medio rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressoPercentual}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-vermelho to-amarelo"
              />
            </div>
          </div>
        </motion.div>

        {/* Missão de hoje */}
        <div className="px-4 pt-6 max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="mb-4">
              <div className="font-mono text-[9px] tracking-[3px] text-branco-dim uppercase mb-1">
                Missão de Hoje
              </div>
              <h2 className="font-display text-2xl tracking-wider text-branco mb-1">
                DIA {diaAtual} — {missaoHoje?.nome}
              </h2>
            </div>

            {/* Mini preview das 3 missões */}
            <div className="space-y-2 mb-5">
              {/* Corpo */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className={`bg-cinza-escuro border border-l-[3px] rounded px-3 py-2.5 flex items-center justify-between transition-all duration-300 ${
                  statusMissoes.corpo
                    ? 'border-l-verde border-verde/50 shadow-[0_0_15px_rgba(0,200,83,0.4)]'
                    : 'border-l-vermelho border-vermelho/50 shadow-[0_0_15px_rgba(255,59,59,0.4)]'
                }`}
              >
                <div className="flex-1">
                  <div className="font-mono text-[7px] tracking-[2px] text-branco-dim uppercase mb-0.5">
                    CORPO
                  </div>
                  <div className="font-body text-xs text-branco tracking-wide">
                    {formatarCorpo()}
                  </div>
                </div>
                <div className={`font-display text-lg ml-2 ${
                  statusMissoes.corpo ? 'text-verde' : 'text-vermelho'
                }`}>
                  {statusMissoes.corpo ? '✓' : '💪'}
                </div>
              </motion.div>

              {/* Mente */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className={`bg-cinza-escuro border border-l-[3px] rounded px-3 py-2.5 flex items-center justify-between transition-all duration-300 ${
                  statusMissoes.mente
                    ? 'border-l-verde border-verde/50 shadow-[0_0_15px_rgba(0,200,83,0.4)]'
                    : 'border-l-vermelho border-vermelho/50 shadow-[0_0_15px_rgba(255,59,59,0.4)]'
                }`}
              >
                <div className="flex-1">
                  <div className="font-mono text-[7px] tracking-[2px] text-branco-dim uppercase mb-0.5">
                    MENTE
                  </div>
                  <div className="font-body text-xs text-branco tracking-wide">
                    {missaoHoje?.mente}
                  </div>
                </div>
                <div className={`text-lg ml-2 ${
                  statusMissoes.mente ? 'text-verde font-display' : 'text-vermelho'
                }`}>
                  {statusMissoes.mente ? '✓' : '🧠'}
                </div>
              </motion.div>

              {/* Disciplina */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className={`bg-cinza-escuro border border-l-[3px] rounded px-3 py-2.5 flex items-center justify-between transition-all duration-300 ${
                  statusMissoes.disciplina
                    ? 'border-l-verde border-verde/50 shadow-[0_0_15px_rgba(0,200,83,0.4)]'
                    : 'border-l-vermelho border-vermelho/50 shadow-[0_0_15px_rgba(255,59,59,0.4)]'
                }`}
              >
                <div className="flex-1">
                  <div className="font-mono text-[7px] tracking-[2px] text-branco-dim uppercase mb-0.5">
                    DISCIPLINA
                  </div>
                  <div className="font-body text-xs text-branco tracking-wide">
                    {missaoHoje?.disciplina}
                  </div>
                </div>
                <div className={`text-lg ml-2 ${
                  statusMissoes.disciplina ? 'text-verde font-display' : 'text-vermelho'
                }`}>
                  {statusMissoes.disciplina ? '✓' : '⚡'}
                </div>
              </motion.div>
            </div>

            {/* CTA Iniciar */}
            <motion.button
              onClick={iniciarMissao}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="w-full bg-vermelho border-none rounded py-4 font-display text-lg tracking-[4px] text-white shadow-lg shadow-vermelho/20"
            >
              INICIAR MISSÃO
            </motion.button>

            {/* Frase motivacional */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-6 text-center"
            >
              <div className="w-12 h-[1px] bg-cinza-borda mx-auto mb-3" />
              <p className="font-body text-xs text-branco-dim tracking-wide leading-relaxed">
                A única coisa que importa<br />
                é o que você faz hoje.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
