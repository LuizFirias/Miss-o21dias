'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface MementoMoriProps {
  dataNascimento: string;
  idade: number;
}

export default function MementoMori({ dataNascimento, idade }: MementoMoriProps) {
  const mementoData = useMemo(() => {
    // Configuração: 80 anos de vida = 4160 semanas
    const YEARS_LIFETIME = 80;
    const WEEKS_PER_YEAR = 52;
    const TOTAL_WEEKS = YEARS_LIFETIME * WEEKS_PER_YEAR; // 4160 semanas
    
    // Calcular semanas vividas
    const birthDate = new Date(dataNascimento);
    const today = new Date();
    const timeDiff = today.getTime() - birthDate.getTime();
    const weeksLived = Math.floor(timeDiff / (7 * 24 * 60 * 60 * 1000));
    
    // Calcular porcentagem
    const percentLived = (weeksLived / TOTAL_WEEKS) * 100;
    
    // Semana da metade da vida
    const halfLifeWeek = TOTAL_WEEKS / 2;
    
    return {
      totalWeeks: TOTAL_WEEKS,
      weeksLived,
      percentLived: Math.min(percentLived, 100),
      halfLifeWeek,
      yearsRemaining: Math.max(0, YEARS_LIFETIME - idade),
      weeksRemaining: Math.max(0, TOTAL_WEEKS - weeksLived),
    };
  }, [dataNascimento, idade]);

  // Renderizar grid de semanas (52 semanas por linha, 80 anos = ~77 linhas)
  const weeks = Array.from({ length: mementoData.totalWeeks }, (_, i) => i + 1);
  const weeksPerRow = 52;
  
  return (
    <div className="w-full bg-cinza-escuro border border-cinza-borda rounded-lg p-4 mt-6 max-w-full mx-auto overflow-hidden">
      {/* Título */}
      <div className="text-center mb-4">
        <h2 className="font-display text-[20px] tracking-[3px] text-vermelho mb-1 uppercase">
          MEMENTO MORI
        </h2>
        <p className="font-body text-[11px] text-branco-dim italic tracking-wider">
          existe algo mais motivador que a morte?
        </p>
      </div>

      {/* Barra de Progresso */}
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="font-body text-[10px] text-branco-dim tracking-wider">
            JÁ SE FOI {mementoData.percentLived.toFixed(1)}% DA SUA VIDA
          </span>
          <span className="font-body text-[10px] text-branco-dim tracking-wider">
            {mementoData.weeksLived.toLocaleString()} SEMANAS
          </span>
        </div>
        <div className="w-full h-2 bg-cinza-medio rounded-full overflow-hidden border border-cinza-borda">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${mementoData.percentLived}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-vermelho via-laranja to-amarelo"
          />
        </div>
      </div>

      {/* Grid de Semanas */}
      <div className="pb-2 px-2 sm:px-1">
        <div className="w-full overflow-hidden">
          {Array.from({ length: Math.ceil(mementoData.totalWeeks / weeksPerRow) }).map((_, rowIdx) => {
            const startWeek = rowIdx * weeksPerRow;
            const endWeek = Math.min(startWeek + weeksPerRow, mementoData.totalWeeks);
            const rowWeeks = Array.from({ length: endWeek - startWeek }, (_, i) => startWeek + i + 1);
            
            // Verificar se esta é a linha da metade da vida
            const isHalfLifeRow = startWeek <= mementoData.halfLifeWeek && endWeek >= mementoData.halfLifeWeek;
            
            return (
              <div key={rowIdx} className="relative mb-0.5">
                {/* Bolinhas das semanas - grid responsivo */}
                <div 
                  className="w-full items-center"
                  style={{ 
                    display: 'grid',
                    gridTemplateColumns: `repeat(${weeksPerRow}, minmax(0, 1fr))`,
                    gap: '2px',
                  }}
                >
                  {rowWeeks.map((week) => {
                    const isLived = week <= mementoData.weeksLived;
                    const isHalfLife = Math.abs(week - mementoData.halfLifeWeek) < 2;
                    
                    return (
                      <motion.div
                        key={week}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: week * 0.0001 }}
                        className={`
                          w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full
                          ${isLived 
                            ? 'bg-vermelho' 
                            : isHalfLife
                            ? 'bg-cinza-borda border border-vermelho'
                            : 'bg-cinza-borda'
                          }
                        `}
                        title={`Semana ${week}${isLived ? ' (vivida)' : ''}`}
                      />
                    );
                  })}
                </div>
                
                {/* Linha marcadora da metade da vida */}
                {isHalfLifeRow && (
                  <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-px bg-vermelho/30 my-2">
                    <span className="absolute -top-3 left-0 font-body text-[8px] text-vermelho/60 tracking-wider uppercase">
                      METADE
                    </span>
                  </div>
                )}
                
                {/* Label do ano (a cada 4 linhas) */}
                {rowIdx % 4 === 0 && (
                  <span className="absolute -left-8 top-0 font-mono text-[8px] text-branco-dim">
                    {Math.floor((rowIdx * weeksPerRow) / 52)}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Informações Adicionais */}
      <div className="mt-4 pt-3 border-t border-cinza-borda grid grid-cols-2 gap-3">
        <div className="text-center">
          <div className="font-body text-[10px] text-branco-dim tracking-wider uppercase mb-1">
            SEMANAS VIVIDAS
          </div>
          <div className="font-display text-[16px] text-vermelho tracking-wider">
            {mementoData.weeksLived.toLocaleString()}
          </div>
        </div>
        <div className="text-center">
          <div className="font-body text-[10px] text-branco-dim tracking-wider uppercase mb-1">
            SEMANAS RESTANTES
          </div>
          <div className="font-display text-[16px] text-amarelo tracking-wider">
            {mementoData.weeksRemaining.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
