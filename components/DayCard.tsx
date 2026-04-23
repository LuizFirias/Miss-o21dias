import React from 'react';
import { calcularProgresso } from '@/utils/helpers';

interface DayCardProps {
  dia: number;
  nome: string;
  onClick: () => void;
}

export default function DayCard({ dia, nome, onClick }: DayCardProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
      <div className="text-center mb-4">
        <p className="text-sm text-gray-400 mb-2">DIA {dia.toString().padStart(2, '0')}</p>
        <h2 className="text-xl font-bold text-vermelho mb-4">{nome}</h2>
      </div>
      
      <p className="text-center text-gray-300 mb-6">
        Você vai executar ou vai falhar hoje?
      </p>
      
      <button
        onClick={onClick}
        className="w-full bg-vermelho hover:bg-red-600 text-white font-bold py-4 px-6 rounded-lg transition-colors uppercase tracking-wider"
      >
        INICIAR MISSÃO
      </button>
    </div>
  );
}
