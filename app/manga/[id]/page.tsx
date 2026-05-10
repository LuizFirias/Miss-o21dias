'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import MANGAS from '@/data/mangas';

type AccessState = 'disponivel' | 'bloqueado-dia';

function getAccessState(
  diaLiberacao: number,
  diaAtual: number,
): AccessState {
  if (diaLiberacao > diaAtual) return 'bloqueado-dia';
  return 'disponivel';
}

function isEpub(arquivo: string) {
  return arquivo.toLowerCase().endsWith('.epub');
}

// ─── EPUB Reader — image-by-image, no iframe/sandbox issues ─────────────────

interface EpubReaderProps {
  // e.g. /api/manga/epubs/black-clover-vol-01.epub
  url: string;
  onProgress?: (pct: number) => void;
}

function EpubReader({ url, onProgress }: EpubReaderProps) {
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [loadingManifest, setLoadingManifest] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const initDone = useRef(false);

  // Convert /api/manga/epubs/foo.epub → /api/manga/manifest/epubs/foo.epub
  const manifestUrl = url.replace('/api/manga/', '/api/manga/manifest/');
  const pageImgUrl = (idx: number) =>
    url.replace('/api/manga/', '/api/manga/page/') + `?idx=${idx}`;

  useEffect(() => {
    // Guard against React StrictMode double-invoke in dev
    if (initDone.current) return;
    initDone.current = true;

    fetch(manifestUrl)
      .then(r => r.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setPageCount(data.count);
        setLoadingManifest(false);
      })
      .catch(e => {
        setError(e.message ?? 'Erro ao carregar mangá');
        setLoadingManifest(false);
      });
  }, [manifestUrl]);

  useEffect(() => {
    if (pageCount > 0) onProgress?.(Math.round((currentPage / (pageCount - 1)) * 100));
  }, [currentPage, pageCount, onProgress]);

  const prevPage = useCallback(() => {
    setCurrentPage(p => Math.max(0, p - 1));
    setImgLoaded(false);
  }, []);

  const nextPage = useCallback(() => {
    setCurrentPage(p => Math.min(pageCount - 1, p + 1));
    setImgLoaded(false);
  }, [pageCount]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextPage();
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prevPage();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [nextPage, prevPage]);

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 text-center bg-[#0d0d0d]">
        <div>
          <p className="text-vermelho font-display tracking-wider mb-2">ERRO AO CARREGAR</p>
          <p className="text-branco-dim text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (loadingManifest) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0d0d0d]">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="font-mono text-xs tracking-[3px] text-vermelho uppercase"
        >
          CARREGANDO...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-[#0d0d0d]">
      {/* Page image */}
      <div className="flex-1 relative flex items-center justify-center min-h-0 overflow-hidden">
        {!imgLoaded && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="font-mono text-[10px] tracking-[3px] text-vermelho/60 uppercase"
            >
              {currentPage + 1} / {pageCount}
            </motion.div>
          </div>
        )}
        {/* Preload next page */}
        {currentPage + 1 < pageCount && (
          <link rel="prefetch" href={pageImgUrl(currentPage + 1)} />
        )}
        <img
          key={currentPage}
          src={pageImgUrl(currentPage)}
          alt={`Página ${currentPage + 1}`}
          onLoad={() => setImgLoaded(true)}
          className={`max-h-full max-w-full object-contain transition-opacity duration-200 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Tap zones for navigation */}
        <button
          onClick={prevPage}
          className="absolute left-0 top-0 h-full w-1/3 z-20"
          aria-label="Página anterior"
        />
        <button
          onClick={nextPage}
          className="absolute right-0 top-0 h-full w-1/3 z-20"
          aria-label="Próxima página"
        />
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0a0a0a] border-t border-cinza-borda/30 flex-shrink-0">
        <motion.button onClick={prevPage} disabled={currentPage === 0} whileTap={{ scale: 0.92 }}
          className="w-11 h-11 rounded-full bg-cinza-escuro border border-cinza-borda flex items-center justify-center text-branco-dim hover:text-branco hover:border-vermelho/50 transition-all text-lg disabled:opacity-30">
          ←
        </motion.button>

        <div className="text-center">
          <div className="font-mono text-[8px] tracking-[2px] text-branco-dim/50 uppercase">Página</div>
          <div className="font-display text-sm text-branco">
            {currentPage + 1} <span className="text-branco-dim/40 text-xs">/ {pageCount}</span>
          </div>
        </div>

        <motion.button onClick={nextPage} disabled={currentPage === pageCount - 1} whileTap={{ scale: 0.92 }}
          className="w-11 h-11 rounded-full bg-cinza-escuro border border-cinza-borda flex items-center justify-center text-branco-dim hover:text-branco hover:border-vermelho/50 transition-all text-lg disabled:opacity-30">
          →
        </motion.button>
      </div>
    </div>
  );
}

// ─── PDF Reader ──────────────────────────────────────────────────────────────

function PdfReader({ url }: { url: string }) {
  return (
    <iframe
      src={`${url}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
      className="flex-1 w-full border-none"
      style={{ minHeight: 'calc(100vh - 56px)' }}
      title="Leitor PDF"
    />
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function MangaReaderPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading } = useAuth();
  const [showControls, setShowControls] = useState(true);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [readProgress, setReadProgress] = useState(0);

  const mangaId = params?.id as string;
  const manga = MANGAS.find((m) => m.id === mangaId);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
  }, []);

  useEffect(() => {
    resetHideTimer();
    return () => { if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current); };
  }, [resetHideTimer]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-preto flex items-center justify-center">
        <div className="font-mono text-branco-dim text-sm tracking-wider">CARREGANDO...</div>
      </div>
    );
  }

  if (!manga) {
    return (
      <div className="min-h-screen bg-preto flex flex-col items-center justify-center gap-4 px-4">
        <div className="font-display text-2xl text-vermelho tracking-wider">MANGÁ NÃO ENCONTRADO</div>
        <button
          onClick={() => router.push('/manga')}
          className="font-mono text-sm text-branco-dim underline tracking-wider"
        >
          Voltar à biblioteca
        </button>
      </div>
    );
  }

  const diaAtual = user.dia_atual || 1;
  const access = getAccessState(manga.diaLiberacao, diaAtual);

  if (access !== 'disponivel') {
    return (
      <div className="min-h-screen bg-preto flex flex-col items-center justify-center gap-6 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm bg-cinza-escuro border border-cinza-borda rounded-2xl p-8 text-center"
        >
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="font-display text-xl tracking-wider text-branco mb-2">
            CONTEÚDO BLOQUEADO
          </h2>
          <p className="font-body text-sm text-branco-dim leading-relaxed mb-6">
            {`Este volume será liberado quando você completar o Dia ${manga.diaLiberacao}.`}
          </p>
          <button
            onClick={() => router.push('/manga')}
            className="w-full bg-vermelho text-branco font-display text-sm tracking-[2px] py-3 rounded-lg"
          >
            VOLTAR À BIBLIOTECA
          </button>
        </motion.div>
      </div>
    );
  }

  const fileUrl = `/api/manga/${isEpub(manga.arquivo) ? 'epubs' : 'pdfs'}/${manga.arquivo}`;
  const epub = isEpub(manga.arquivo);

  return (
    <div
      className="h-screen bg-[#0a0a0a] flex flex-col overflow-hidden"
      onClick={resetHideTimer}
      onTouchStart={resetHideTimer}
    >
      {/* Header overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-0 inset-x-0 z-50 bg-gradient-to-b from-black/95 to-transparent px-4 pt-safe-top pt-4 pb-10 pointer-events-none"
          >
            <div className="max-w-md mx-auto flex items-center gap-3 pointer-events-auto">
              <button
                onClick={(e) => { e.stopPropagation(); router.push('/manga'); }}
                className="w-9 h-9 rounded-full bg-cinza-escuro/90 border border-cinza-borda flex items-center justify-center text-branco-dim hover:text-branco transition-colors flex-shrink-0"
              >
                ←
              </button>

              <div className="flex-1 min-w-0">
                <div className="font-mono text-[7px] tracking-[2px] text-vermelho uppercase">
                  Dia {manga.diaLiberacao} • {manga.subtitulo} • {epub ? 'EPUB' : 'PDF'}
                </div>
                <h1 className="font-display text-base tracking-wide text-branco truncate">
                  {manga.titulo}
                </h1>
              </div>

              {/* Progress pill */}
              {epub && readProgress > 0 && (
                <div className="bg-vermelho/20 border border-vermelho/40 rounded-full px-2 py-0.5 flex-shrink-0">
                  <span className="font-mono text-[8px] tracking-[1px] text-vermelho">{readProgress}%</span>
                </div>
              )}

              {/* Open externally */}
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-9 h-9 rounded-full bg-cinza-escuro/90 border border-cinza-borda flex items-center justify-center text-branco-dim hover:text-branco transition-colors flex-shrink-0 text-xs"
                title="Abrir em nova aba"
              >
                ↗
              </a>
            </div>

            {/* Progress bar */}
            {epub && readProgress > 0 && (
              <div className="max-w-md mx-auto mt-2 h-0.5 bg-cinza-borda/30 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${readProgress}%` }}
                  className="h-full bg-vermelho"
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reader */}
      <div className="flex-1 flex flex-col min-h-0 pt-14">
        {epub ? (
          <EpubReader url={fileUrl} onProgress={setReadProgress} />
        ) : (
          <PdfReader url={fileUrl} />
        )}
      </div>
    </div>
  );
}
