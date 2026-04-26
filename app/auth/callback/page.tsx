'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Supabase v2 PKCE: troca o code por sessão automaticamente ao chamar getSession
    // quando há um code na URL; depois verificamos se já fez onboarding
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Verificar se o usuário já completou o onboarding
        const { data } = await supabase
          .from('usuarios')
          .select('dia_atual')
          .eq('id', session.user.id)
          .single();

        if (data) {
          router.replace('/home');
        } else {
          router.replace('/onboarding');
        }
      }
    });

    // Iniciar a troca de código (PKCE) ou processar hash (implicit)
    supabase.auth.getSession();
  }, [router]);

  return (
    <div className="min-h-screen bg-preto flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-vermelho border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="font-mono text-branco-dim text-xs tracking-widest">VERIFICANDO ACESSO...</p>
      </div>
    </div>
  );
}
