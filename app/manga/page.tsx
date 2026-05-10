'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import MANGAS, { type Manga } from '@/data/mangas';

type AccessState = 'disponivel' | 'bloqueado-dia' | 'bloqueado-premium';

const BOSS_DAYS = [7, 14, 21];

function getAccessState(manga: Manga, diaAtual: number, mangaAcesso: boolean): AccessState {
  if (manga.diaLiberacao > diaAtual) return 'bloqueado-dia';
  if (manga.plano === 'premium' && !mangaAcesso) return 'bloqueado-premium';
  return 'disponivel';
}

function MangaCard({ manga, diaAtual, mangaAcesso, onClick }: {
  manga: Manga;
  diaAtual: number;
  mangaAcesso: boolean;
  onClick: () => void;
}) {
  const access = getAccessState(manga, diaAtual, mangaAcesso);
  const isBossDay = BOSS_DAYS.includes(manga.diaLiberacao);
  const isFinal = manga.diaLiberacao === 21;
  const isAvailable = access === 'disponivel';
  const isPremiumLocked = access === 'bloqueado-premium';

  return (
    <motion.button
      onClick={isAvailable ? onClick : undefined}
      disabled={!isAvailable}
      whileHover={isAvailable ? { scale: 1.02 } : {}}
      whileTap={isAvailable ? { scale: 0.97 } : {}}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative w-full text-left rounded-xl overflow-hidden border transition-all duration-300 ${
        isAvailable
          ? 'bg-cinza-escuro border-cinza-borda hover:border-vermelho/60 cursor-pointer'
          : 'bg-[#0d0d0d] border-cinza-borda/30 cursor-default'
      } ${isBossDay ? 'border-amarelo/40' : ''}`}
    >
      {/* Capa */}
      <div className={`w-full aspect-[2/3] relative overflow-hidden ${isAvailable ? 'bg-cinza-medio' : 'bg-[#0a0a0a]'}`}>
        {/* Imagem real da capa */}
        <img
          src={`/api/manga/capas/${manga.capa}`}
          alt={`${manga.titulo} ${manga.subtitulo}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isAvailable ? 'opacity-100' : 'opacity-15'}`}
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />

        {/* Overlay de bloqueio */}
        {!isAvailable && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 z-10">
            {isPremiumLocked ? (
              <>
                <span className="text-2xl">🔒</span>
                <span className="font-mono text-[8px] tracking-[2px] text-amarelo uppercase">Premium</span>
              </>
            ) : (
              <>
                <svg width="20" height="22" viewBox="0 0 16 18" fill="none">
                  <rect x="2" y="8" width="12" height="9" rx="2" stroke="#444" strokeWidth="1.5" />
                  <path d="M5 8V5.5a3 3 0 016 0V8" stroke="#444" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span className="font-mono text-[8px] tracking-[2px] text-branco-dim/50 uppercase">
                  Dia {manga.diaLiberacao}
                </span>
              </>
            )}
          </div>
        )}

        {/* Badge boss day */}
        {isBossDay && isAvailable && (
          <div className="absolute top-2 right-2 bg-amarelo/20 border border-amarelo/60 rounded px-1.5 py-0.5">
            <span className="font-mono text-[7px] tracking-[1.5px] text-amarelo uppercase">
              {isFinal ? '🎖 FINAL' : '🔥 BOSS'}
            </span>
          </div>
        )}

        {/* Badge disponível */}
        {isAvailable && (
          <div className="absolute bottom-2 left-2 bg-verde/20 border border-verde/60 rounded px-1.5 py-0.5">
            <span className="font-mono text-[7px] tracking-[1.5px] text-verde uppercase">DISPONÍVEL</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <div className="font-mono text-[7px] tracking-[2px] text-branco-dim/60 uppercase mb-0.5">
          Dia {manga.diaLiberacao} • {manga.subtitulo}
        </div>
        <h3 className={`font-display text-sm tracking-wide leading-tight mb-1 ${
          isAvailable ? 'text-branco' : 'text-branco/30'
        }`}>
          {manga.titulo}
        </h3>
        <p className={`font-body text-[10px] leading-snug ${
          isAvailable ? 'text-branco-dim/70' : 'text-branco/15'
        }`}>
          {manga.descricao}
        </p>

        {isPremiumLocked && (
          <div className="mt-2 text-center py-1.5 rounded bg-amarelo/10 border border-amarelo/30">
            <span className="font-mono text-[8px] tracking-[2px] text-amarelo uppercase">Desbloquear →</span>
          </div>
        )}
      </div>
    </motion.button>
  );
}

export default function MangaPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [filtro, setFiltro] = useState<'todos' | 'disponiveis' | 'premium'>('todos');

  useEffect(() => {
    if (!loading && !user) router.push('/login');
    else if (!loading && user && !user.onboarding_completo) router.push('/onboarding');
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <Layout>
        <div className="min-h-screen bg-preto flex items-center justify-center">
          <div className="font-mono text-branco-dim text-sm tracking-wider">CARREGANDO...</div>
        </div>
      </Layout>
    );
  }

  const diaAtual = user.dia_atual || 1;
  const mangaAcesso = user.manga_acesso || false;
  const totalDisponiveis = MANGAS.filter(m => getAccessState(m, diaAtual, mangaAcesso) === 'disponivel').length;

  const mangasFiltrados = MANGAS.filter(m => {
    if (filtro === 'disponiveis') return getAccessState(m, diaAtual, mangaAcesso) === 'disponivel';
    if (filtro === 'premium') return m.plano === 'premium';
    return true;
  });

  return (
    <Layout>
      <div className="min-h-screen bg-preto pb-24">
        {/* Header */}
        <div className="px-4 pt-5 pb-4 max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="font-mono text-[7px] tracking-[3px] text-vermelho uppercase mb-1">
              BÔNUS EXCLUSIVO
            </div>
            <h1 className="font-display text-2xl tracking-[3px] text-branco uppercase mb-1">
              BIBLIOTECA MANGÁ
            </h1>
            <p className="font-body text-xs text-branco-dim leading-relaxed">
              {totalDisponiveis} de {MANGAS.length} volumes disponíveis • Desbloqueie completando os dias
            </p>
          </motion.div>

          {/* Barra de progresso de desbloqueio */}
          <div className="mt-3">
            <div className="w-full h-1.5 bg-cinza-medio rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(totalDisponiveis / MANGAS.length) * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-vermelho to-amarelo"
              />
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="px-4 max-w-md mx-auto mb-4">
          <div className="flex gap-2">
            {([['todos', 'TODOS'], ['disponiveis', 'DISPONÍVEIS'], ['premium', 'PREMIUM']] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFiltro(key)}
                className={`flex-1 py-2 rounded font-mono text-[8px] tracking-[1.5px] uppercase transition-all ${
                  filtro === key
                    ? 'bg-vermelho text-branco border border-vermelho'
                    : 'bg-cinza-escuro text-branco-dim border border-cinza-borda hover:border-vermelho/40'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de mangás */}
        <div className="px-4 max-w-md mx-auto">
          <div className="grid grid-cols-2 gap-3">
            {mangasFiltrados.map((manga, idx) => (
              <motion.div
                key={manga.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
              >
                <MangaCard
                  manga={manga}
                  diaAtual={diaAtual}
                  mangaAcesso={mangaAcesso}
                  onClick={() => router.push(`/manga/${manga.id}`)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
