'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [lastAttempt, setLastAttempt] = useState(0);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    
    // Throttle: evita múltiplas tentativas rápidas
    const now = Date.now();
    if (now - lastAttempt < 5000) {
      setMessage('Aguarde 5 segundos entre tentativas.');
      return;
    }
    
    setLoading(true);
    setMessage('');
    setLastAttempt(now);

    // Validar senha (mínimo 6 caracteres)
    if (senha.length < 6) {
      setMessage('A senha deve ter no mínimo 6 caracteres.');
      setLoading(false);
      return;
    }

    try {
      // LOGIN: Entrar com email e senha
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      if (error) {
        // Se erro for "Invalid login credentials"
        if (error.message.includes('Invalid login') || error.message.includes('Email not confirmed')) {
          setMessage('Email ou senha incorretos. Apenas membros que compraram têm acesso.');
        } else {
          throw error;
        }
      } else if (data.session && data.user) {
        // Verificar se usuário tem perfil na tabela usuarios
        const { data: perfil } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (!perfil) {
          // Se não tem perfil, criar um básico e ir para onboarding
          const { error: insertError } = await supabase
            .from('usuarios')
            .insert([
              {
                id: data.user.id,
                email: data.user.email!,
                nome: data.user.email!.split('@')[0],
                nivel: 'iniciante',
                modo: 'normal',
                dia_atual: 1,
                streak: 0,
                onboarding_completo: false,
                senha_alterada: true, // cadastro manual já usa senha do próprio user
              },
            ]);

          if (insertError) {
            console.error('Erro ao criar perfil:', insertError);
          }

          setMessage('Login realizado! Redirecionando...');
          await new Promise(resolve => setTimeout(resolve, 500));
          router.push('/onboarding');
          return;
        }

        // Primeiro login com senha temporária (vinda do webhook Cakto)
        // → força a tela de troca de senha antes de qualquer outra coisa
        if (perfil.senha_alterada === false) {
          setMessage('Defina sua senha pessoal...');
          await new Promise(resolve => setTimeout(resolve, 400));
          router.push('/trocar-senha');
          return;
        }

        // Se tem perfil mas não completou onboarding, redirecionar
        if (!perfil.onboarding_completo) {
          setMessage('Complete seu perfil...');
          await new Promise(resolve => setTimeout(resolve, 500));
          router.push('/onboarding');
          return;
        }

        setMessage('Login realizado! Redirecionando...');
        await new Promise(resolve => setTimeout(resolve, 500));
        router.push('/home');
      }
    } catch (error: any) {
      console.error('Erro no login:', error);
      if (error.message.includes('rate limit')) {
        setMessage('Muitas tentativas. Aguarde alguns minutos e tente novamente.');
      } else {
        setMessage(error.message || 'Erro ao processar login.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleRecuperarSenha() {
    if (!email) {
      setMessage('Digite seu email para recuperar a senha.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/login`,
      });

      if (error) throw error;

      setMessage('Email de recuperação enviado! Verifique sua caixa de entrada.');
    } catch (error: any) {
      console.error('Erro ao recuperar senha:', error);
      setMessage(error.message || 'Erro ao enviar email de recuperação.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-preto flex items-center justify-center relative overflow-hidden">
      {/* Glow effect - canto superior esquerdo */}
      <div 
        className="absolute top-[-40px] left-[-40px] w-[180px] h-[180px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,59,59,0.12) 0%, transparent 70%)',
        }}
      />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm px-6 py-10"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-1"
        >
          <h1 className="font-display text-[36px] leading-none tracking-[4px] text-branco">
            SALA DO<br />
            <span className="text-vermelho">TEMPO</span>
          </h1>
        </motion.div>

        {/* Subtítulo */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="font-mono text-[9px] tracking-[5px] text-branco-dim text-center mb-9"
        >
          — 21 DIAS DE EXECUÇÃO —
        </motion.div>

        {/* Divider */}
        <div className="w-8 h-[2px] bg-vermelho mx-auto mb-7" />

        {/* Frase motivacional */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="font-body text-[13px] font-semibold leading-[1.6] text-center text-branco tracking-[0.5px] mb-8"
        >
          Você não entra aqui<br />
          por motivação.<br />
          <em className="text-branco-dim font-normal not-italic">Entra por decisão.</em>
        </motion.p>

        {/* Form */}
        <motion.form 
          onSubmit={handleLogin}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-2.5"
        >
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-cinza-medio border border-cinza-borda rounded px-3 py-2.5 text-branco font-body text-xs tracking-wider placeholder-branco-dim/50 focus:outline-none focus:border-vermelho transition-colors"
          />

          <input
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
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
            {loading ? 'PROCESSANDO...' : 'ENTRAR'}
          </motion.button>

          {/* Recuperar senha */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={handleRecuperarSenha}
              disabled={loading}
              className="font-body text-[11px] tracking-[1px] text-branco-dim hover:text-branco transition-colors disabled:opacity-50"
            >
              Recuperar senha
            </button>
          </div>

          {message && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-center text-xs font-mono pt-2 ${
                message.includes('enviado') || message.includes('realizado') ? 'text-verde' : 'text-vermelho'
              }`}
            >
              {message}
            </motion.p>
          )}
        </motion.form>
      </motion.div>
    </div>
  );
}
