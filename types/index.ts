export type Nivel = 'iniciante' | 'intermediario' | 'avancado';
export type Modo = 'normal' | 'guerra';
export type StatusDia = 'feito' | 'falhou';
export type Limitacao = 'nenhuma' | 'joelho' | 'lombar' | 'ombro';

export interface User {
  id: string;
  email: string;
  nome: string;
  nivel: Nivel;
  modo: Modo;
  dia_atual: number;
  streak: number;
  nivel_progressao: number;
  limitacao: Limitacao;
  onboarding_completo?: boolean;
  ultimo_acesso_dia?: string;
  pode_avancar_dia?: boolean;
  // Order bumps (produtos premium)
  modo_guerra_acesso?: boolean;
  continuidade_30dias?: boolean;
  disparo_rapido_acesso?: boolean;
  foco_acesso?: boolean;
  created_at: string;
}

export interface ProgressoDia {
  id: string;
  user_id: string;
  dia: number;
  status: StatusDia;
  data: string;
  created_at: string;
}

export interface MissaoCorpo {
  [key: string]: number;
}

export interface Missao {
  dia: number;
  nome: string;
  corpo: MissaoCorpo;
  mente: string;
  disciplina: string;
}

export interface NivelProgresso {
  nivel: string;
  min: number;
  max: number;
}

export const NIVEIS_PROGRESSAO: NivelProgresso[] = [
  { nivel: 'Recruta', min: 0, max: 3 },
  { nivel: 'Soldado', min: 4, max: 7 },
  { nivel: 'Cabo', min: 8, max: 14 },
  { nivel: 'Elite', min: 15, max: 21 },
];

export const MULTIPLICADORES: Record<Nivel, number> = {
  iniciante: 0.6,
  intermediario: 1.0,
  avancado: 1.4,
};
