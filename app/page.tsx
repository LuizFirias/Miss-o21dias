'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (data.session) {
        // Usuário já logado - verificar se completou onboarding
        const { data: userData, error: userError } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', data.session.user.id)
          .single();

        if (userData?.onboarding_completo) {
          router.replace('/home');
        } else {
          router.replace('/onboarding');
        }
      } else {
        // Sem sessão - redirecionar para página de vendas
        router.replace('/sales');
      }
    } catch (error) {
      console.error('Erro ao verificar auth:', error);
      router.replace('/sales');
    }
  }

  return (
    <div className="min-h-screen bg-preto flex items-center justify-center">
      <div className="text-center">
        <div className="font-mono text-xs text-branco-dim tracking-widest mb-2">
          SALA DO TEMPO
        </div>
        <div className="w-8 h-8 border-2 border-vermelho border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    </div>
  );
}
