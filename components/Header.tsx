import React from 'react';
import { getNivelProgressao } from '@/utils/helpers';

interface HeaderProps {
  diaAtual: number;
  streak: number;
  nome: string;
}

export default function Header({ diaAtual, streak, nome }: HeaderProps) {
  const nivel = getNivelProgressao(diaAtual);

  return (
    <header className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-vermelho">SALA DO TEMPO 21</h1>
        <div className="text-right">
          <p className="text-sm text-gray-400">{nome}</p>
          <p className="text-xs text-amarelo">{nivel}</p>
        </div>
      </div>
      
      <div className="flex gap-4">
        <div className="flex-1 bg-gray-900 p-3 rounded border border-gray-800">
          <p className="text-xs text-gray-400 mb-1">DIA</p>
          <p className="text-2xl font-bold text-vermelho">{diaAtual}/21</p>
        </div>
        
        <div className="flex-1 bg-gray-900 p-3 rounded border border-gray-800">
          <p className="text-xs text-gray-400 mb-1">STREAK</p>
          <p className="text-2xl font-bold text-verde">{streak}</p>
        </div>
      </div>
    </header>
  );
}
