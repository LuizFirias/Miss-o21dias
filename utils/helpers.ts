import { NIVEIS_PROGRESSAO, MULTIPLICADORES } from '@/types';
import type { Nivel, MissaoCorpo } from '@/types';

export function getNivelProgressao(diaAtual: number): string {
  const nivel = NIVEIS_PROGRESSAO.find(
    (n) => diaAtual >= n.min && diaAtual <= n.max
  );
  return nivel?.nivel || 'Recruta';
}

export function aplicarMultiplicador(
  missaoCorpo: MissaoCorpo,
  nivel: Nivel
): MissaoCorpo {
  const multiplicador = MULTIPLICADORES[nivel];
  const novoCorpo: MissaoCorpo = {};

  for (const [exercicio, repeticoes] of Object.entries(missaoCorpo)) {
    novoCorpo[exercicio] = Math.round(repeticoes * multiplicador);
  }

  return novoCorpo;
}

export function formatarDia(dia: number): string {
  return dia.toString().padStart(2, '0');
}

export function calcularProgresso(diaAtual: number): number {
  return Math.round((diaAtual / 21) * 100);
}

export function isCheckpoint(dia: number): boolean {
  return dia === 7 || dia === 14;
}

export function getMensagemCheckpoint(dia: number): string {
  if (dia === 7) {
    return 'A maioria já desistiu. Você não.';
  }
  if (dia === 14) {
    return 'Agora você já não é mais comum.';
  }
  return '';
}
