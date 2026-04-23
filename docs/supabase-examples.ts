// Exemplos de uso da API do Supabase
// Este arquivo é apenas para referência - não precisa ser incluído no projeto

import { supabase } from '@/lib/supabase';

// ========================================
// AUTENTICAÇÃO
// ========================================

// Login com Magic Link
async function loginComMagicLink(email: string) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/onboarding`,
    },
  });
  
  return { data, error };
}

// Verificar sessão atual
async function verificarSessao() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

// Obter usuário atual
async function obterUsuarioAtual() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Logout
async function logout() {
  const { error } = await supabase.auth.signOut();
  return error;
}

// Escutar mudanças de autenticação
function escutarAuthChanges() {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      console.log('Auth event:', event);
      console.log('Session:', session);
    }
  );
  
  // Cancelar inscrição quando não for mais necessário
  // subscription.unsubscribe();
}

// ========================================
// USUÁRIOS
// ========================================

// Criar usuário após onboarding
async function criarUsuario(userData: any) {
  const { data, error } = await supabase
    .from('users')
    .insert({
      id: userData.id,
      email: userData.email,
      nome: userData.nome,
      nivel: userData.nivel,
      modo: userData.modo,
      limitacao: userData.limitacao,
      dia_atual: 1,
      streak: 0,
      nivel_progressao: 0,
    })
    .select()
    .single();
  
  return { data, error };
}

// Buscar usuário por ID
async function buscarUsuario(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  
  return { data, error };
}

// Atualizar progresso do usuário
async function atualizarProgresso(userId: string, updates: any) {
  const { data, error } = await supabase
    .from('users')
    .update({
      dia_atual: updates.dia_atual,
      streak: updates.streak,
      nivel_progressao: updates.nivel_progressao,
    })
    .eq('id', userId)
    .select()
    .single();
  
  return { data, error };
}

// Resetar usuário (voltar ao dia 1)
async function resetarUsuario(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .update({
      dia_atual: 1,
      streak: 0,
      nivel_progressao: 0,
    })
    .eq('id', userId);
  
  return { data, error };
}

// ========================================
// PROGRESSO DIÁRIO
// ========================================

// Salvar progresso do dia
async function salvarProgressoDia(userId: string, dia: number, status: 'feito' | 'falhou') {
  const { data, error } = await supabase
    .from('progresso_dia')
    .insert({
      user_id: userId,
      dia,
      status,
    })
    .select()
    .single();
  
  return { data, error };
}

// Buscar todo o progresso de um usuário
async function buscarTodoProgresso(userId: string) {
  const { data, error } = await supabase
    .from('progresso_dia')
    .select('*')
    .eq('user_id', userId)
    .order('data', { ascending: false });
  
  return { data, error };
}

// Buscar progresso dos últimos N dias
async function buscarProgressoRecente(userId: string, dias: number) {
  const { data, error } = await supabase
    .from('progresso_dia')
    .select('*')
    .eq('user_id', userId)
    .order('data', { ascending: false })
    .limit(dias);
  
  return { data, error };
}

// Verificar se dia já foi completado
async function verificarDiaCompletado(userId: string, dia: number) {
  const { data, error } = await supabase
    .from('progresso_dia')
    .select('*')
    .eq('user_id', userId)
    .eq('dia', dia)
    .single();
  
  return { data, error };
}

// Contar dias completos
async function contarDiasCompletos(userId: string) {
  const { count, error } = await supabase
    .from('progresso_dia')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'feito');
  
  return { count, error };
}

// ========================================
// QUERIES AVANÇADAS
// ========================================

// Buscar usuários que completaram o desafio
async function buscarUsuariosElite() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .gte('dia_atual', 21);
  
  return { data, error };
}

// Buscar usuários por nível
async function buscarUsuariosPorNivel(nivel: 'iniciante' | 'intermediario' | 'avancado') {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('nivel', nivel);
  
  return { data, error };
}

// Estatísticas gerais
async function buscarEstatisticas() {
  // Total de usuários
  const { count: totalUsuarios } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true });
  
  // Usuários ativos (dia > 1)
  const { count: usuariosAtivos } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .gt('dia_atual', 1);
  
  // Usuários que completaram
  const { count: usuariosCompletos } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .gte('dia_atual', 21);
  
  return {
    totalUsuarios,
    usuariosAtivos,
    usuariosCompletos,
    taxaConclusao: totalUsuarios ? (usuariosCompletos! / totalUsuarios) * 100 : 0,
  };
}

// ========================================
// REALTIME (OPCIONAL)
// ========================================

// Escutar mudanças em tempo real no progresso do usuário
function escutarProgressoRealtime(userId: string, callback: (payload: any) => void) {
  const channel = supabase
    .channel('progresso_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'progresso_dia',
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe();
  
  // Para cancelar: channel.unsubscribe()
  return channel;
}

// ========================================
// EXEMPLO DE USO COMPLETO
// ========================================

async function fluxoCompletoUsuario() {
  // 1. Login
  const { data: authData } = await loginComMagicLink('usuario@example.com');
  
  // 2. Após verificação do email, criar perfil
  const session = await verificarSessao();
  if (session) {
    const user = await obterUsuarioAtual();
    
    // 3. Criar usuário no banco
    await criarUsuario({
      id: user!.id,
      email: user!.email,
      nome: 'João',
      nivel: 'intermediario',
      modo: 'guerra',
      limitacao: 'nenhuma',
    });
    
    // 4. Salvar progresso do dia 1
    await salvarProgressoDia(user!.id, 1, 'feito');
    
    // 5. Atualizar para dia 2
    await atualizarProgresso(user!.id, {
      dia_atual: 2,
      streak: 1,
      nivel_progressao: 1,
    });
  }
}

// ========================================
// TRATAMENTO DE ERROS
// ========================================

async function exemploComTratamentoDeErros() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', 'some-id')
      .single();
    
    if (error) {
      // Tipos comuns de erro:
      // - PGRST116: Nenhum registro encontrado
      // - 23505: Violação de constraint único
      // - 42501: Permissão negada (RLS)
      console.error('Erro Supabase:', error);
      throw error;
    }
    
    return data;
  } catch (error: any) {
    console.error('Erro:', error.message);
    return null;
  }
}
