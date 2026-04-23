import React from 'react';

interface ProgressBarProps {
  progresso: number;
}

export default function ProgressBar({ progresso }: ProgressBarProps) {
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        <span className="text-xs text-gray-400">PROGRESSO</span>
        <span className="text-xs text-amarelo font-bold">{progresso}%</span>
      </div>
      <div className="w-full bg-gray-900 rounded-full h-2 border border-gray-800">
        <div
          className="bg-gradient-to-r from-vermelho to-amarelo h-full rounded-full transition-all duration-500"
          style={{ width: `${progresso}%` }}
        />
      </div>
    </div>
  );
}
