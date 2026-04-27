'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

export default function TrocarSenhaPage() {
  const router = useRouter();
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [message, setMessage] = useState('');
  const [destinoApos, setDestinoApos] = useState<'/onboarding' | '/home'>('/onboarding');

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/login');
        return;
      }

      const { data: perfil } = await supabase
        .from('usuarios')
        .select('onboarding_completo, senha_alterada')
        .eq('id', session.user.id)
        .single();

      // Se já trocou a senha, não faz sentido voltar aqui — manda para o destino correto
      if (perfil?.senha_alterada) {
        router.replace(perfil.onboarding_completo ? '/home' : '/onboarding');
        return;
      }

      setDestinoApos(perfil?.onboarding_completo ? '/home' : '/onboarding');
      setChecking(false);
    })();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');

    if (novaSenha.length < 6) {
      setMessage('A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }
    if (novaSenha !== confirmarSenha) {
      setMessage('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password: novaSenha });
      if (updateError) throw updateError;

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error: flagError } = await supabase
          .from('usuarios')
          .update({ senha_alterada: true })
          .eq('id', user.id);
        if (flagError) {
          console.error('Erro ao marcar senha_alterada:', flagError);
        }
      }

      setMessage('✓ Senha atualizada. Redirecionando...');
      await new Promise(r => setTimeout(r, 600));
      router.replace(destinoApos);
    } catch (err: any) {
      console.error('Erro ao trocar senha:', err);
      setMessage(err?.message || 'Erro ao atualizar senha.');
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-preto flex items-center justify-center">
        <div className="font-mono text-branco-dim text-xs tracking-widest">CARREGANDO...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-preto flex items-center justify-center relative overflow-hidden">
      <div
        className="absolute top-[-40px] left-[-40px] w-[180px] h-[180px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,59,59,0.12) 0%, transparent 70%)' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm px-6 py-10"
      >
        <div className="text-center mb-1">
          <h1 className="font-display text-[36px] leading-none tracking-[4px] text-branco">
            SALA DO<br /><span className="text-vermelho">TEMPO</span>
          </h1>
        </div>

        <div className="font-mono text-[9px] tracking-[5px] text-branco-dim text-center mb-9">
          — DEFINA SUA SENHA —
        </div>

        <div className="w-8 h-[2px] bg-vermelho mx-auto mb-7" />

        <p className="font-body text-[13px] font-semibold leading-[1.6] text-center text-branco tracking-[0.5px] mb-8">
          Você está usando uma <em className="not-italic text-vermelho">senha temporária</em>.<br />
          <span className="text-branco-dim font-normal">Crie sua senha pessoal para continuar.</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-2.5">
          <input
            type="password"
            name="new-password"
            autoComplete="new-password"
            placeholder="nova senha (mín. 6 caracteres)"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            required
            className="w-full bg-cinza-medio border border-cinza-borda rounded px-3 py-2.5 text-branco font-body text-xs tracking-wider placeholder-branco-dim/50 focus:outline-none focus:border-vermelho transition-colors"
          />

          <input
            type="password"
            name="confirm-new-password"
            autoComplete="new-password"
            placeholder="confirme a nova senha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            required
            className="w-full bg-cinza-medio border border-cinza-borda rounded px-3 py-2.5 text-branco font-body text-xs tracking-wider placeholder-branco-dim/50 focus:outline-none focus:border-vermelho transition-colors"
          />

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-vermelho border-none rounded py-3 text-white font-display text-base tracking-[3px] disabled:opacity-50 disabled:cursor-not-allowed mt-2.5"
          >
            {loading ? 'SALVANDO...' : 'DEFINIR SENHA'}
          </motion.button>

          {message && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-center text-xs font-mono pt-2 ${
                message.startsWith('✓') ? 'text-verde' : 'text-vermelho'
              }`}
            >
              {message}
            </motion.p>
          )}
        </form>
      </motion.div>
    </div>
  );
}
