'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Layout from '@/components/Layout';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/onboarding`,
        },
      });

      if (error) throw error;

      setMessage('Link de acesso enviado! Verifique seu e-mail.');
    } catch (error: any) {
      setMessage(error.message || 'Erro ao enviar link de acesso.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center -mt-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-vermelho mb-4">
              SALA DO TEMPO 21
            </h1>
            <p className="text-gray-300 text-lg">
              Você não entra aqui por motivação.<br />
              Entra por decisão.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-vermelho transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-vermelho hover:bg-red-600 text-white font-bold py-4 px-6 rounded-lg transition-colors uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'ENVIANDO...' : 'ENTRAR'}
            </button>

            {message && (
              <p className={`text-center text-sm ${message.includes('enviado') ? 'text-verde' : 'text-vermelho'}`}>
                {message}
              </p>
            )}
          </form>
        </div>
      </div>
    </Layout>
  );
}
