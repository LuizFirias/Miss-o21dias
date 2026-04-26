import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Persistir sessão no localStorage para login persistente
    persistSession: true,
    // Detectar mudanças de sessão automaticamente
    autoRefreshToken: true,
    // Storage onde a sessão será salva (localStorage por padrão)
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
});
