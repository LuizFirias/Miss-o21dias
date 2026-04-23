'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Loading from '@/components/Loading';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const { data } = await supabase.auth.getSession();
    
    if (data.session) {
      // Verificar se usuário completou onboarding
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.session.user.id)
        .single();

      if (userData) {
        router.push('/home');
      } else {
        router.push('/onboarding');
      }
    } else {
      router.push('/login');
    }
  }

  return <Loading />;
}
