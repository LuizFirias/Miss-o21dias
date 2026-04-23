import React, { useState } from 'react';
import { MissaoCorpo } from '@/types';

interface MissionCardProps {
  titulo: string;
  tipo: 'corpo' | 'mente' | 'disciplina';
  conteudo: MissaoCorpo | string;
  onComplete: () => void;
  onFail: () => void;
  completed: boolean;
  failed: boolean;
}

export default function MissionCard({
  titulo,
  tipo,
  conteudo,
  onComplete,
  onFail,
  completed,
  failed,
}: MissionCardProps) {
  const getBorderColor = () => {
    if (tipo === 'corpo') return 'border-vermelho';
    if (tipo === 'mente') return 'border-amarelo';
    return 'border-verde';
  };

  const renderConteudo = () => {
    if (typeof conteudo === 'string') {
      return <p className="text-gray-300 mb-4">{conteudo}</p>;
    }

    return (
      <ul className="space-y-2 mb-4">
        {Object.entries(conteudo).map(([exercicio, repeticoes]) => (
          <li key={exercicio} className="flex justify-between text-gray-300">
            <span className="capitalize">{exercicio.replace(/_/g, ' ')}</span>
            <span className="font-bold text-white">{repeticoes}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className={`bg-gray-900 border-2 ${getBorderColor()} rounded-lg p-5 mb-4`}>
      <h3 className="text-lg font-bold text-white mb-3 uppercase">{titulo}</h3>
      
      {renderConteudo()}
      
      <div className="flex gap-3">
        <button
          onClick={onComplete}
          disabled={completed || failed}
          className={`flex-1 py-3 px-4 rounded font-bold uppercase text-sm transition-colors ${
            completed
              ? 'bg-verde text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-verde hover:text-white'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {completed ? '✓ CONCLUÍDO' : 'CONCLUÍDO'}
        </button>
        
        <button
          onClick={onFail}
          disabled={completed || failed}
          className={`flex-1 py-3 px-4 rounded font-bold uppercase text-sm transition-colors ${
            failed
              ? 'bg-vermelho text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-vermelho hover:text-white'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {failed ? '✗ FALHEI' : 'FALHEI'}
        </button>
      </div>
    </div>
  );
}
