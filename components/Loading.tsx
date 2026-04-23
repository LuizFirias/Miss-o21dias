import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-preto flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-vermelho mx-auto mb-4"></div>
        <p className="text-gray-400">Carregando...</p>
      </div>
    </div>
  );
}
