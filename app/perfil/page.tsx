'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { NIVEIS_PROGRESSAO } from '@/types';
import Layout from '@/components/Layout';
import Loading from '@/components/Loading';

export default function PerfilPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [missoesCompletadas, setMissoesCompletadas] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      carregarProgresso();
    }
  }, [user, authLoading, router]);

  async function carregarProgresso() {
    if (!user) return;

    try {
      // Buscar apenas registros de dias ANTERIORES ao dia atual (dias finalizados)
      // O dia atual em andamento não deve ser contado
      const { data: progressos } = await supabase
        .from('progresso_dia')
        .select('corpo_completo, mente_completo, disciplina_completo, dia')
        .eq('user_id', user.id)
        .lt('dia', user.dia_atual); // Apenas dias anteriores

      if (progressos) {
        let total = 0;
        progressos.forEach(p => {
          if (p.corpo_completo) total++;
          if (p.mente_completo) total++;
          if (p.disciplina_completo) total++;
        });
        setMissoesCompletadas(total);
      }
    } catch (error) {
      console.error('Erro ao carregar progresso:', error);
    } finally {
      setLoadingProgress(false);
    }
  }

  if (authLoading || !user) {
    return <Loading />;
  }

  const handleAtualizarSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    // Validações
    if (!novaSenha || !confirmarSenha) {
      setMessage('Preencha todos os campos');
      return;
    }

    if (novaSenha.length < 6) {
      setMessage('A nova senha deve ter no mínimo 6 caracteres');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setMessage('As senhas não coincidem');
      return;
    }

    setUpdating(true);

    try {
      // Atualizar senha no Supabase Auth
      const { error } = await supabase.auth.updateUser({
        password: novaSenha,
      });

      if (error) {
        throw error;
      }

      setMessage('✓ Senha atualizada com sucesso!');
      setNovaSenha('');
      setConfirmarSenha('');

      // Limpar mensagem após 3 segundos
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      console.error('Erro ao atualizar senha:', error);
      setMessage(error.message || 'Erro ao atualizar senha');
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    const confirmar = confirm('Tem certeza que deseja sair?');
    
    if (!confirmar) return;

    try {
      await supabase.auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      alert('Erro ao sair. Tente novamente.');
    }
  };

  // Mapear nível para texto
  const nivelTexto = {
    iniciante: 'Iniciante',
    intermediario: 'Intermediário',
    avancado: 'Avançado',
  };

  // Calcular nível de progressão baseado no dia atual
  const getNivelProgressao = () => {
    const diaAtual = user.dia_atual || 1;
    const nivelAtual = NIVEIS_PROGRESSAO.find(
      n => diaAtual >= n.min && diaAtual <= n.max
    );
    return nivelAtual?.nivel || 'Recruta';
  };

  // Calcular porcentagem de conclusão (63 missões no total = 21 dias × 3 missões)
  const totalMissoes = 63;
  const porcentagemConclusao = Math.round((missoesCompletadas / totalMissoes) * 100);

  return (
    <Layout>
      <div className="max-w-md mx-auto">
        {/* Header com botão voltar */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/home')}
            className="text-branco-dim hover:text-branco transition-colors font-mono text-xs tracking-wider mb-4"
          >
            ← VOLTAR
          </button>
          <h1 className="font-display text-3xl tracking-[3px] text-vermelho">
            PERFIL
          </h1>
        </div>

        {/* Card de Informações do Usuário */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-cinza-escuro border border-cinza-borda rounded-lg p-6 mb-6"
        >
          {/* Ícone de Perfil */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 bg-vermelho/10 border-2 border-vermelho rounded-full flex items-center justify-center mb-3">
              <svg
                className="w-10 h-10 text-vermelho"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            
            {/* Nível de Progressão em Dourado */}
            <div className="mb-2">
              <span className="font-display text-2xl tracking-[3px] text-amarelo drop-shadow-[0_0_8px_rgba(255,200,87,0.5)]">
                {getNivelProgressao().toUpperCase()}
              </span>
            </div>

            <h2 className="font-display text-xl tracking-[2px] text-branco mb-1">
              {user.nome}
            </h2>
            <p className="font-mono text-xs text-branco-dim tracking-wider">
              {user.email}
            </p>
          </div>

          {/* Informações do Perfil */}
          <div className="space-y-3 border-t border-cinza-borda pt-4">
            <div className="flex justify-between items-center">
              <span className="font-mono text-[10px] tracking-[2px] text-branco-dim uppercase">
                Nível
              </span>
              <span className="font-body text-sm text-branco">
                {nivelTexto[user.nivel]}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-mono text-[10px] tracking-[2px] text-branco-dim uppercase">
                Dia Atual
              </span>
              <span className="font-display text-lg text-vermelho">
                {user.dia_atual}/21
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-mono text-[10px] tracking-[2px] text-branco-dim uppercase">
                Streak
              </span>
              <span className="font-display text-lg text-verde">
                {user.streak} 🔥
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-mono text-[10px] tracking-[2px] text-branco-dim uppercase">
                Modo
              </span>
              <span className="font-body text-sm text-branco">
                {user.modo === 'normal' ? 'Normal' : 'Guerra'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Trilha de Progresso */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-cinza-escuro border border-cinza-borda rounded-lg p-6 mb-6"
        >
          <h3 className="font-display text-lg tracking-[2px] text-branco mb-4">
            TRILHA DE PROGRESSO
          </h3>

          {loadingProgress ? (
            <div className="text-center text-branco-dim py-4">
              Carregando...
            </div>
          ) : (
            <>
              {/* Estatísticas */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-cinza-medio border border-cinza-borda rounded p-4">
                  <div className="font-mono text-[10px] tracking-[2px] text-branco-dim uppercase mb-1">
                    Missões Completas
                  </div>
                  <div className="font-display text-3xl tracking-wider text-verde">
                    {missoesCompletadas}
                    <span className="text-lg text-branco-dim">/63</span>
                  </div>
                </div>

                <div className="bg-cinza-medio border border-cinza-borda rounded p-4">
                  <div className="font-mono text-[10px] tracking-[2px] text-branco-dim uppercase mb-1">
                    Conclusão
                  </div>
                  <div className="font-display text-3xl tracking-wider text-amarelo">
                    {porcentagemConclusao}
                    <span className="text-lg">%</span>
                  </div>
                </div>
              </div>

              {/* Barra de Progresso Visual */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[10px] tracking-[2px] text-branco-dim uppercase">
                    Progresso Total
                  </span>
                  <span className="font-body text-xs text-branco">
                    {missoesCompletadas} de 63 missões
                  </span>
                </div>
                
                <div className="w-full h-3 bg-cinza-medio rounded-full overflow-hidden border border-cinza-borda">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${porcentagemConclusao}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-amarelo via-verde to-amarelo"
                  />
                </div>

                {/* Indicadores de Níveis */}
                <div className="grid grid-cols-4 gap-2 pt-3">
                  {NIVEIS_PROGRESSAO.map((nivel, index) => {
                    const missoesNivel = nivel.max * 3;
                    const completouNivel = missoesCompletadas >= missoesNivel;
                    
                    return (
                      <div
                        key={index}
                        className={`text-center p-2 rounded border ${
                          completouNivel
                            ? 'bg-amarelo/10 border-amarelo'
                            : 'bg-cinza-medio border-cinza-borda'
                        }`}
                      >
                        <div className={`font-mono text-[8px] tracking-[2px] uppercase ${
                          completouNivel ? 'text-amarelo' : 'text-branco-dim'
                        }`}>
                          {nivel.nivel}
                        </div>
                        <div className={`font-display text-xs ${
                          completouNivel ? 'text-amarelo' : 'text-branco-dim'
                        }`}>
                          {completouNivel ? '✓' : `${nivel.min}-${nivel.max}`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </motion.div>

        {/* Formulário de Atualização de Senha */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-cinza-escuro border border-cinza-borda rounded-lg p-6 mb-6"
        >
          <h3 className="font-display text-lg tracking-[2px] text-branco mb-4">
            ALTERAR SENHA
          </h3>

          <form onSubmit={handleAtualizarSenha} className="space-y-4">
            <div>
              <label className="font-mono text-[10px] tracking-[2px] text-branco-dim uppercase block mb-2">
                Nova Senha
              </label>
              <input
                type="password"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                className="w-full bg-cinza-medio border border-cinza-borda rounded px-4 py-2.5 font-body text-sm text-branco placeholder-branco-dim/50 focus:outline-none focus:border-vermelho transition-colors"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div>
              <label className="font-mono text-[10px] tracking-[2px] text-branco-dim uppercase block mb-2">
                Confirmar Nova Senha
              </label>
              <input
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                className="w-full bg-cinza-medio border border-cinza-borda rounded px-4 py-2.5 font-body text-sm text-branco placeholder-branco-dim/50 focus:outline-none focus:border-vermelho transition-colors"
                placeholder="Digite novamente"
              />
            </div>

            {message && (
              <div
                className={`font-body text-xs text-center p-2 rounded ${
                  message.includes('✓')
                    ? 'bg-verde/10 text-verde border border-verde'
                    : 'bg-vermelho/10 text-vermelho border border-vermelho'
                }`}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={updating}
              className="w-full bg-vermelho hover:bg-vermelho/80 text-branco font-display text-sm tracking-[2px] py-3 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? 'ATUALIZANDO...' : 'ATUALIZAR SENHA'}
            </button>
          </form>
        </motion.div>

        {/* Botão de Logout */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full bg-cinza-medio border border-cinza-borda hover:border-vermelho text-branco-dim hover:text-vermelho font-mono text-xs tracking-[2px] py-3 rounded transition-all"
        >
          SAIR DA CONTA
        </motion.button>
      </div>
    </Layout>
  );
}
