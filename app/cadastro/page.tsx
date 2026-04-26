'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function CadastroPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleCadastro(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Validações
    if (senha.length < 6) {
      setMessage('A senha deve ter no mínimo 6 caracteres.');
      setLoading(false);
      return;
    }

    if (senha !== confirmarSenha) {
      setMessage('As senhas não coincidem.');
      setLoading(false);
      return;
    }

    try {
      // Criar conta no Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password: senha,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            nome: nome,
          },
        },
      });

      if (error) {
        if (error.message.includes('already registered')) {
          setMessage('Este email já está cadastrado. Tente fazer login.');
        } else {
          throw error;
        }
        setLoading(false);
        return;
      }

      if (data.user && !data.session) {
        setMessage('Confirmação enviada! Verifique seu e-mail para ativar a conta.');
      } else {
        // Se o email não requer confirmação, criar perfil e redirecionar
        if (data.user) {
          // Criar registro na tabela usuarios
          const { error: profileError } = await supabase
            .from('usuarios')
            .insert([
              {
                id: data.user.id,
                email: email,
                nome: nome,
                nivel: 'iniciante', // Será atualizado no onboarding
                modo: 'normal', // Será atualizado no onboarding
                dia_atual: 1,
                onboarding_completo: false, // Forçar onboarding
              },
            ]);

          if (profileError) {
            console.error('Erro ao criar perfil:', profileError);
          }
        }

        setMessage('Conta criada! Redirecionando para configuração inicial...');
        setTimeout(() => window.location.href = '/onboarding', 1500);
      }
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      setMessage(error.message || 'Erro ao criar conta.');
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
          Bem-vindo à Sala do Tempo.<br />
          <em className="text-branco-dim font-normal not-italic">Crie sua conta para começar.</em>
        </motion.p>

        {/* Form */}
        <motion.form 
          onSubmit={handleCadastro}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-2.5"
        >
          <input
            type="text"
            name="nome"
            autoComplete="name"
            placeholder="seu nome completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className="w-full bg-cinza-medio border border-cinza-borda rounded px-3 py-2.5 text-branco font-body text-xs tracking-wider placeholder-branco-dim/50 focus:outline-none focus:border-vermelho transition-colors"
          />

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
            autoComplete="new-password"
            placeholder="crie sua senha (mín. 6 caracteres)"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            className="w-full bg-cinza-medio border border-cinza-borda rounded px-3 py-2.5 text-branco font-body text-xs tracking-wider placeholder-branco-dim/50 focus:outline-none focus:border-vermelho transition-colors"
          />

          <input
            type="password"
            name="confirm-password"
            autoComplete="new-password"
            placeholder="confirme sua senha"
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
            {loading ? 'PROCESSANDO...' : 'CRIAR CONTA'}
          </motion.button>

          {/* Link para login */}
          <div className="text-center pt-2">
            <Link
              href="/login"
              className="font-body text-[11px] tracking-[1px] text-branco-dim hover:text-branco transition-colors"
            >
              Já tem conta? Fazer login
            </Link>
          </div>

          {message && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-center text-xs font-mono pt-2 ${
                message.includes('enviado') || message.includes('criada') ? 'text-verde' : 'text-vermelho'
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
