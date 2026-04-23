import React from 'react';
import { getMensagemCheckpoint } from '@/utils/helpers';

interface CheckpointScreenProps {
  dia: number;
  onContinue: () => void;
}

export default function CheckpointScreen({ dia, onContinue }: CheckpointScreenProps) {
  const mensagem = getMensagemCheckpoint(dia);

  return (
    <div className="fixed inset-0 bg-preto flex items-center justify-center z-50 p-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="text-6xl mb-4">🔥</div>
          <h2 className="text-3xl font-bold text-amarelo mb-4">
            CHECKPOINT - DIA {dia}
          </h2>
          <p className="text-xl text-gray-300 mb-2">{mensagem}</p>
        </div>
        
        <button
          onClick={onContinue}
          className="bg-vermelho hover:bg-red-600 text-white font-bold py-4 px-8 rounded-lg transition-colors uppercase tracking-wider"
        >
          CONTINUAR
        </button>
      </div>
    </div>
  );
}
