import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useUserStore } from '@/store/userStore';
import type { User } from '@/types';

export function useAuth() {
  const { user, setUser } = useUserStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        loadUser(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Escutar mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        loadUser(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadUser(userId: string) {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', userId)
      .single();

    if (data && !error) {
      setUser(data as User);
    }
    setLoading(false);
  }

  return { user, loading };
}

export function useProgressoDia(userId: string) {
  const [progressos, setProgressos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadProgressos();
    }
  }, [userId]);

  async function loadProgressos() {
    const { data, error } = await supabase
      .from('progresso_dia')
      .select('*')
      .eq('user_id', userId)
      .order('data', { ascending: false });

    if (data && !error) {
      setProgressos(data);
    }
    setLoading(false);
  }

  return { progressos, loading, reload: loadProgressos };
}
