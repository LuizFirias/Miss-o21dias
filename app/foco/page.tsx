'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout';
import Loading from '@/components/Loading';
import { useAuth } from '@/hooks/useAuth';

type TabKey = 'videos' | 'audios';

interface MidiaItem {
  id: string;
  titulo: string;
  /** Duração em formato livre (ex: "3 min", "1h 20"). */
  duracao: string;
  /** ID do vídeo no YouTube (ex: dQw4w9WgXcQ). Usado pelos vídeos. */
  youtubeId?: string;
  /** URL do arquivo de áudio (mp3/m4a/etc). Usado pelos áudios. */
  audioUrl?: string;
}

interface Categoria {
  id: string;
  label: string;
  uso: string;
  cor: string;
  itens: MidiaItem[];
  /**
   * Após X dias desde a compra (usuarios.created_at) todos os itens da
   * categoria são liberados. O primeiro item já vem livre desde o dia 1.
   */
  daysToUnlockAll?: number;
}

/* ─────────────────────────────────────────────
   LINKS — placeholders para preenchimento futuro
───────────────────────────────────────────── */

// TODO: link da playlist Spotify do TRAINING
const SPOTIFY_TRAINING_URL = '';

/* ─────────────────────────────────────────────
   VÍDEOS (YouTube) — preencher youtubeId quando os
   links chegarem. O resto do app já reage à mudança.
───────────────────────────────────────────── */

const VIDEOS: Categoria[] = [
  {
    id: 'foco-produtividade',
    label: 'FOCO E PRODUTIVIDADE',
    uso: 'Vídeo 1 livre · resto após 7 dias da compra',
    cor: '#B452FF',
    daysToUnlockAll: 7,
    itens: [
      {
        id: 'prod-1',
        titulo: 'GESTÃO DO TEMPO — uma aula de 5 minutos que vai mudar sua produtividade',
        duracao: '5 min',
        youtubeId: 'imzy7Gld4qQ',
      },
      {
        id: 'prod-2',
        titulo: 'Como parar de PROCRASTINAR?',
        duracao: '—',
        youtubeId: 'WIS3PzNJEdU',
      },
      {
        id: 'prod-3',
        titulo: 'PRODUTIVIDADE: As técnicas poderosas que você não está usando',
        duracao: '—',
        youtubeId: 'CocYznzG7vc',
      },
      {
        id: 'prod-4',
        titulo: 'Como criar hábitos produtivos e saudáveis?',
        duracao: '—',
        youtubeId: 'smoFiKzFsqQ',
      },
      {
        id: 'prod-5',
        titulo: 'O jeito mais fácil para se organizar e ser produtivo',
        duracao: '—',
        youtubeId: 'DIg_lvsnvxE',
      },
      {
        id: 'prod-6',
        titulo: 'Como organizar tarefas por contexto para aumentar sua produtividade',
        duracao: '—',
        youtubeId: 'xW3aSkRfRxI',
      },
      {
        id: 'prod-7',
        titulo: 'Como eu organizo o meu dia para ser mais produtivo',
        duracao: '—',
        youtubeId: 'bTTY4D4sgKM',
      },
      {
        id: 'prod-8',
        titulo: 'Como ter mais FOCO e ser mais PRODUTIVO',
        duracao: '—',
        youtubeId: 'DEx6fevGXlM',
      },
      {
        id: 'prod-9',
        titulo: 'Técnica Pomodoro: o que é, como estudar e os benefícios',
        duracao: '—',
        youtubeId: 'PdRUpaheIhE',
      },
      {
        id: 'prod-10',
        titulo: 'Método GTD na prática: como tirar as ideias da cabeça',
        duracao: '—',
        youtubeId: 'slBrquJyKs8',
      },
    ],
  },
  {
    id: 'rotina',
    label: 'ROTINA',
    uso: 'Vídeo 1 livre · resto após 7 dias da compra',
    cor: '#FF8C42',
    daysToUnlockAll: 7,
    itens: [
      {
        id: 'rotina-1',
        titulo: 'Comece a acordar cedo e veja sua vida mudar',
        duracao: '—',
        youtubeId: '0Eg0n5XrdX0',
      },
      {
        id: 'rotina-2',
        titulo: 'Como fazer o Milagre da Manhã',
        duracao: '—',
        youtubeId: 'HDWWFVHd2Ow',
      },
      {
        id: 'rotina-3',
        titulo: '10 hábitos pequenos que mudam sua vida em silêncio',
        duracao: '—',
        youtubeId: '4ZIMZ-a-qAg',
      },
      {
        id: 'rotina-4',
        titulo: 'Como as primeiras horas do dia definem o seu sucesso',
        duracao: '—',
        youtubeId: '1qXbsHk5qb0',
      },
      {
        id: 'rotina-5',
        titulo: 'Saia do amadorismo: a rotina diária de sucesso',
        duracao: '—',
        youtubeId: '429t8Gkzv3U',
      },
      {
        id: 'rotina-6',
        titulo: 'Sem plano, sem mudança. Simples assim.',
        duracao: '—',
        youtubeId: 'bgd1nI7ZRHs',
      },
      {
        id: 'rotina-7',
        titulo: 'Rotina matinal, organizar a semana e hábitos',
        duracao: '—',
        youtubeId: '_DRgg-B6vQs',
      },
      {
        id: 'rotina-8',
        titulo: 'O que fazer com os imprevistos que afetam a agenda?',
        duracao: '—',
        youtubeId: 'y3UurqzGBDM',
      },
      {
        id: 'rotina-9',
        titulo: '3 dicas para melhorar a organização dos seus estudos',
        duracao: '—',
        youtubeId: 'HIYu29USi88',
      },
      {
        id: 'rotina-10',
        titulo: 'Dica de Bullet Journal: processar semanalmente',
        duracao: '—',
        youtubeId: 'ZXFIY8XPk1o',
      },
    ],
  },
  {
    id: 'leitura',
    label: 'LEITURA',
    uso: 'Vídeo 1 livre · resto após 7 dias da compra',
    cor: '#FFC857',
    daysToUnlockAll: 7,
    itens: [
      {
        id: 'leitura-1',
        titulo: 'Como ler mais rápido e entender melhor',
        duracao: '—',
        youtubeId: '3yWzP5nV7kU',
      },
      {
        id: 'leitura-2',
        titulo: 'Técnica Feynman: aprenda qualquer coisa mais rápido',
        duracao: '—',
        youtubeId: 'Rr1Sk5RkQfU',
      },
      {
        id: 'leitura-3',
        titulo: 'Como lembrar 90% do que você lê',
        duracao: '—',
        youtubeId: 'IlU-zDU6aQ0',
      },
      {
        id: 'leitura-4',
        titulo: '5 técnicas para ler mais livros e aprender mais',
        duracao: '—',
        youtubeId: '6c1eK6p5v6U',
      },
      {
        id: 'leitura-5',
        titulo: 'Como criar o hábito da leitura (mesmo sem tempo)',
        duracao: '—',
        youtubeId: 'Q9p7k1d7l1A',
      },
      {
        id: 'leitura-6',
        titulo: 'Como estudar melhor e absorver conteúdo de verdade',
        duracao: '—',
        youtubeId: 'Q0hKX1sYd4g',
      },
      {
        id: 'leitura-7',
        titulo: 'Como fazer anotações inteligentes durante a leitura',
        duracao: '—',
        youtubeId: 'Z4h1r6e9Qy0',
      },
      {
        id: 'leitura-8',
        titulo: 'Método Cornell: como estudar e organizar ideias',
        duracao: '—',
        youtubeId: 'WtW9IyE04OQ',
      },
      {
        id: 'leitura-9',
        titulo: 'Como manter foco na leitura e não se distrair',
        duracao: '—',
        youtubeId: 'G9Yy0sYq7wY',
      },
      {
        id: 'leitura-10',
        titulo: 'Como ler livros difíceis e realmente entender',
        duracao: '—',
        youtubeId: '0n3l9r6zH4E',
      },
    ],
  },
  {
    id: 'dinheiro',
    label: 'DINHEIRO',
    uso: 'Vídeo 1 livre · resto após 7 dias da compra',
    cor: '#00C853',
    daysToUnlockAll: 7,
    itens: [
      {
        id: 'dinheiro-1',
        titulo: 'Como se organizar com pouco dinheiro?',
        duracao: '—',
        youtubeId: '1vGVHGyqg0U',
      },
      {
        id: 'dinheiro-2',
        titulo: 'Finanças pessoais em 20 minutos (TEDx)',
        duracao: '20 min',
        youtubeId: 'UMxSHX712qo',
      },
      {
        id: 'dinheiro-3',
        titulo: 'Resolva sua vida financeira em menos de 10 minutos',
        duracao: '10 min',
        youtubeId: 'i5EgaL84Mo0',
      },
      {
        id: 'dinheiro-4',
        titulo: 'Como fazer um orçamento mensal simples',
        duracao: '—',
        youtubeId: 'NbD9f4ntR8s',
      },
      {
        id: 'dinheiro-5',
        titulo: 'O que fazer quando receber seu salário',
        duracao: '—',
        youtubeId: 'C67qPfI8_hg',
      },
      {
        id: 'dinheiro-6',
        titulo: 'Organize seu dinheiro sem planilha',
        duracao: '—',
        youtubeId: 'oBhh5stJ3rU',
      },
      {
        id: 'dinheiro-7',
        titulo: 'Como fazer o dinheiro sobrar todo mês',
        duracao: '—',
        youtubeId: '5XBtnZZOjmQ',
      },
      {
        id: 'dinheiro-8',
        titulo: 'Organize sua vida financeira em 10 minutos semanais',
        duracao: '10 min',
        youtubeId: '-JFUT8I7__k',
      },
      {
        id: 'dinheiro-9',
        titulo: 'Dicas práticas para guardar dinheiro (Serasa)',
        duracao: '—',
        youtubeId: 'dV-91_WzHas',
      },
      {
        id: 'dinheiro-10',
        titulo: 'Como controlar seu dinheiro com papel e caneta',
        duracao: '—',
        youtubeId: '8cPE9bOHXrw',
      },
    ],
  },
  {
    id: 'renda-extra',
    label: 'RENDA EXTRA',
    uso: 'Vídeo 1 livre · resto após 7 dias da compra',
    cor: '#FF3B3B',
    daysToUnlockAll: 7,
    itens: [
      {
        id: 'renda-1',
        titulo: '10 ideias de renda extra para começar hoje',
        duracao: '—',
        youtubeId: 'G0wY9v9h8cM',
      },
      {
        id: 'renda-2',
        titulo: 'Como fazer renda extra pela internet (passo a passo)',
        duracao: '—',
        youtubeId: '6yQ7xQvQ3kA',
      },
      {
        id: 'renda-3',
        titulo: '7 formas reais de ganhar dinheiro extra em casa',
        duracao: '—',
        youtubeId: '8VZ3yK0pY2Q',
      },
      {
        id: 'renda-4',
        titulo: 'Como ganhar dinheiro no tempo livre',
        duracao: '—',
        youtubeId: '2vQ9dVw4Y8M',
      },
      {
        id: 'renda-5',
        titulo: 'Renda extra com pouco investimento',
        duracao: '—',
        youtubeId: '9hF2Kx1QZ3A',
      },
      {
        id: 'renda-6',
        titulo: 'Ideias de renda extra para quem trabalha o dia inteiro',
        duracao: '—',
        youtubeId: '4xW8yYp6J1Q',
      },
      {
        id: 'renda-7',
        titulo: 'Como ganhar dinheiro com o celular',
        duracao: '—',
        youtubeId: '7kL3Qp9Z2VQ',
      },
      {
        id: 'renda-8',
        titulo: '5 formas simples de fazer renda extra online',
        duracao: '—',
        youtubeId: '3nV8kY2Qx5M',
      },
      {
        id: 'renda-9',
        titulo: 'Como começar uma renda extra do zero',
        duracao: '—',
        youtubeId: '5QkY1p8Zx2A',
      },
      {
        id: 'renda-10',
        titulo: 'Renda extra rápida: ideias práticas que funcionam',
        duracao: '—',
        youtubeId: '1xZ8Qk7Yp3M',
      },
    ],
  },
];

const AUDIOS: Categoria[] = [
  {
    id: 'modo-foco',
    label: 'MODO FOCO',
    uso: 'Durante tarefas',
    cor: '#5B8CFF',
    daysToUnlockAll: 7,
    itens: [
      { id: 'mfoco-1', titulo: 'Áudio 1', duracao: '—', audioUrl: '' },
      { id: 'mfoco-2', titulo: 'Áudio 2', duracao: '—', audioUrl: '' },
      { id: 'mfoco-3', titulo: 'Áudio 3', duracao: '—', audioUrl: '' },
    ],
  },
  {
    id: 'modo-reset',
    label: 'MODO RESET',
    uso: 'Quando estiver sobrecarregado',
    cor: '#00C853',
    daysToUnlockAll: 7,
    itens: [
      { id: 'mreset-1', titulo: 'Áudio 1', duracao: '—', audioUrl: '' },
      { id: 'mreset-2', titulo: 'Áudio 2', duracao: '—', audioUrl: '' },
      { id: 'mreset-3', titulo: 'Áudio 3', duracao: '—', audioUrl: '' },
    ],
  },
  {
    id: 'modo-profundo',
    label: 'MODO PROFUNDO',
    uso: 'Sessão de trabalho longa',
    cor: '#B452FF',
    daysToUnlockAll: 7,
    itens: [
      { id: 'mprof-1', titulo: 'Áudio 1', duracao: '—', audioUrl: '' },
      { id: 'mprof-2', titulo: 'Áudio 2', duracao: '—', audioUrl: '' },
      { id: 'mprof-3', titulo: 'Áudio 3', duracao: '—', audioUrl: '' },
    ],
  },
];

/* ─────────────────────────────────────────────
   PÁGINA
───────────────────────────────────────────── */

export default function FocoPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [tab, setTab] = useState<TabKey>('videos');
  const [playingVideo, setPlayingVideo] = useState<MidiaItem | null>(null);
  const [playingAudio, setPlayingAudio] = useState<MidiaItem | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return <Loading />;
  }

  const categorias = tab === 'videos' ? VIDEOS : AUDIOS;
  const daysSincePurchase = user.created_at
    ? Math.floor((Date.now() - new Date(user.created_at).getTime()) / 86400000)
    : 0;

  const handleAbrirSpotify = () => {
    if (!SPOTIFY_TRAINING_URL) return;
    window.open(SPOTIFY_TRAINING_URL, '_blank', 'noopener,noreferrer');
  };

  const handlePlay = (item: MidiaItem) => {
    if (tab === 'videos') {
      if (!item.youtubeId) return;
      setPlayingVideo(item);
    } else {
      if (!item.audioUrl) return;
      setPlayingAudio(item);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-preto pb-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="font-mono text-[9px] tracking-[3px] text-azul-mente uppercase mb-1">
            Estado mental
          </div>
          <h1 className="font-display text-4xl tracking-[3px] text-branco">FOCO</h1>
          <p className="font-body text-sm text-branco-dim/60 mt-2">
            Tira você da inércia. Sem pensar.
          </p>
        </motion.div>

        {/* TRAINING — hero card que leva para o Spotify */}
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleAbrirSpotify}
          disabled={!SPOTIFY_TRAINING_URL}
          className="w-full mb-10 group relative overflow-hidden rounded-xl border-2 border-azul-mente/40 bg-gradient-to-br from-azul-mente/15 to-preto p-6 text-left hover:border-azul-mente/80 transition-all disabled:cursor-not-allowed"
          style={{ boxShadow: '0 0 18px rgba(91,140,255,0.18)' }}
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-azul-mente flex items-center justify-center shrink-0 shadow-[0_0_24px_rgba(91,140,255,0.45)]">
              <SpotifyIcon size={26} />
            </div>
            <div className="flex-1">
              <div className="font-mono text-[9px] tracking-[3px] text-azul-mente uppercase mb-1">
                Prioridade · Spotify
              </div>
              <div className="font-display text-3xl tracking-[3px] text-branco leading-none">
                TRAINING
              </div>
              <div className="font-body text-xs text-branco-dim/70 mt-2">
                Playlist contínua para entrar em estado. Abre direto no Spotify.
              </div>
            </div>
            <ExternalLinkIcon />
          </div>
          {!SPOTIFY_TRAINING_URL && (
            <div className="absolute top-3 right-3 font-mono text-[8px] tracking-[2px] text-branco-dim/50 uppercase">
              Em breve
            </div>
          )}
        </motion.button>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8 border-b border-cinza-borda">
          <TabButton active={tab === 'videos'} onClick={() => setTab('videos')} cor="#5B8CFF">
            🎬 VÍDEOS
          </TabButton>
          <TabButton active={tab === 'audios'} onClick={() => setTab('audios')} cor="#FFC857">
            🎧 ÁUDIOS
          </TabButton>
        </div>

        {/* Categorias */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-10"
          >
            {categorias.map((cat) => (
              <CategoriaBlock
                key={cat.id}
                categoria={cat}
                daysSincePurchase={daysSincePurchase}
                onPlay={handlePlay}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Player YouTube — para a aba VÍDEOS */}
      <YouTubePlayerModal item={playingVideo} onClose={() => setPlayingVideo(null)} />

      {/* Player Áudio — para a aba ÁUDIOS (HTML5 audio + Media Session) */}
      <AudioPlayerModal item={playingAudio} onClose={() => setPlayingAudio(null)} />
    </Layout>
  );
}

/* ─────────────────────────────────────────────
   YOUTUBE PLAYER (modal embutido no app)
───────────────────────────────────────────── */

function YouTubePlayerModal({
  item,
  onClose,
}: {
  item: MidiaItem | null;
  onClose: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Fecha com ESC
  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [item, onClose]);

  // Trava o scroll do body enquanto o player está aberto
  useEffect(() => {
    if (!item) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [item]);

  const handleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    const doc = document as Document & {
      webkitFullscreenElement?: Element;
      webkitExitFullscreen?: () => Promise<void>;
    };
    const fsEl = el as HTMLDivElement & {
      webkitRequestFullscreen?: () => Promise<void>;
    };
    const isFullscreen = Boolean(document.fullscreenElement || doc.webkitFullscreenElement);
    if (isFullscreen) {
      (document.exitFullscreen?.() ?? doc.webkitExitFullscreen?.())?.catch(() => {});
    } else {
      (fsEl.requestFullscreen?.() ?? fsEl.webkitRequestFullscreen?.())?.catch(() => {});
    }
  };

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-preto/90 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            ref={containerRef}
            initial={{ scale: 0.96 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.96 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl"
            style={{
              border: '1px solid rgba(91,140,255,0.45)',
              borderRadius: '12px',
              boxShadow:
                '0 0 14px rgba(91,140,255,0.25), 0 0 38px rgba(91,140,255,0.15), inset 0 0 0 1px rgba(91,140,255,0.06)',
              background: '#0D0D0D',
            }}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between p-3 border-b border-azul-mente/20">
              <button
                type="button"
                onClick={onClose}
                aria-label="Voltar"
                className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-azul-mente/10 transition-colors"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-branco"
                  aria-hidden
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                <span className="font-mono text-[10px] tracking-[2px] text-branco-dim uppercase">
                  Voltar
                </span>
              </button>

              <div className="flex-1 mx-3 truncate text-center">
                <span className="font-display text-sm tracking-[2px] text-branco">
                  {item.titulo}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleFullscreen}
                  aria-label="Tela cheia"
                  className="p-2 rounded-md hover:bg-azul-mente/10 transition-colors"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-branco"
                    aria-hidden
                  >
                    <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                    <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
                    <path d="M3 16v3a2 2 0 0 0 2 2h3" />
                    <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Sair"
                  className="p-2 rounded-md hover:bg-azul-mente/10 transition-colors"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-branco"
                    aria-hidden
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Iframe */}
            <div className="aspect-video w-full bg-preto">
              <iframe
                key={item.id}
                src={`https://www.youtube.com/embed/${item.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                title={item.titulo}
                className="w-full h-full"
                frameBorder={0}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                allowFullScreen
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────
   SUB-COMPONENTES
───────────────────────────────────────────── */

function TabButton({
  active,
  onClick,
  cor,
  children,
}: {
  active: boolean;
  onClick: () => void;
  cor: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative px-4 py-3 font-display text-sm tracking-[3px] transition-colors"
      style={{ color: active ? cor : 'rgba(255,255,255,0.4)' }}
    >
      {children}
      {active && (
        <motion.div
          layoutId="foco-tab-underline"
          className="absolute -bottom-px left-0 right-0 h-[2px]"
          style={{ background: cor }}
        />
      )}
    </button>
  );
}

function CategoriaBlock({
  categoria,
  daysSincePurchase,
  onPlay,
}: {
  categoria: Categoria;
  daysSincePurchase: number;
  onPlay: (item: MidiaItem) => void;
}) {
  const restoLiberado =
    typeof categoria.daysToUnlockAll === 'number' &&
    daysSincePurchase >= categoria.daysToUnlockAll;

  const faltam =
    typeof categoria.daysToUnlockAll === 'number'
      ? Math.max(0, categoria.daysToUnlockAll - daysSincePurchase)
      : 0;
  const lockReason =
    faltam > 0
      ? `Disponível em ${faltam} dia${faltam > 1 ? 's' : ''}`
      : 'Liberando em instantes';

  return (
    <div>
      <div className="flex items-baseline justify-between mb-3">
        <h2
          className="font-display text-2xl tracking-[3px]"
          style={{ color: categoria.cor }}
        >
          {categoria.label}
        </h2>
        <span className="font-mono text-[8px] tracking-[2px] text-branco-dim/50 uppercase">
          {categoria.uso}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {categoria.itens.map((item, idx) => {
          const liberado = idx === 0 || restoLiberado;
          return (
            <ItemCard
              key={item.id}
              item={item}
              liberado={liberado}
              cor={categoria.cor}
              lockReason={lockReason}
              onPlay={() => onPlay(item)}
            />
          );
        })}
      </div>
    </div>
  );
}

function ItemCard({
  item,
  liberado,
  cor,
  lockReason,
  onPlay,
}: {
  item: MidiaItem;
  liberado: boolean;
  cor: string;
  lockReason: string;
  onPlay: () => void;
}) {
  if (liberado) {
    const sem_link = !item.youtubeId && !item.audioUrl;
    return (
      <button
        type="button"
        onClick={onPlay}
        disabled={sem_link}
        className="group relative flex items-center gap-3 p-4 rounded-lg border bg-cinza-escuro hover:bg-cinza-medio transition-all text-left disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ borderColor: `${cor}33` }}
      >
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
          style={{ background: cor }}
        >
          <PlayIcon size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-body text-sm font-semibold text-branco truncate">
            {item.titulo}
          </div>
          <div className="font-mono text-[9px] tracking-[2px] text-branco-dim/50 uppercase mt-0.5">
            {item.duracao}
            {sem_link && ' · em breve'}
          </div>
        </div>
      </button>
    );
  }

  return (
    <div
      className="relative flex items-center gap-3 p-4 rounded-lg border border-cinza-borda bg-cinza-escuro/40 overflow-hidden"
    >
      <div className="flex items-center gap-3 flex-1 opacity-30 blur-[1px] pointer-events-none">
        <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 bg-cinza-borda">
          <PlayIcon size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-body text-sm font-semibold text-branco truncate">
            {item.titulo}
          </div>
          <div className="font-mono text-[9px] tracking-[2px] text-branco-dim/50 uppercase mt-0.5">
            {item.duracao}
          </div>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center gap-3 px-4 bg-preto/65 backdrop-blur-[1px]">
        <div className="text-xl">🔒</div>
        <div className="flex-1 min-w-0">
          <div className="font-mono text-[9px] tracking-[2px] uppercase truncate" style={{ color: cor }}>
            {lockReason}
          </div>
        </div>
      </div>
    </div>
  );
}

function PlayIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#0D0D0D" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   AUDIO PLAYER (HTML5 audio + Media Session)

   Player simples com tag <audio> nativa, que continua tocando
   quando a tela é bloqueada / o app sai de foco. Usa Media Session
   API para registrar metadata e atalhos no painel de mídia do SO.
───────────────────────────────────────────── */

function AudioPlayerModal({
  item,
  onClose,
}: {
  item: MidiaItem | null;
  onClose: () => void;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);

  // ESC fecha o modal
  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [item, onClose]);

  // Trava scroll do body enquanto aberto
  useEffect(() => {
    if (!item) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [item]);

  // Media Session — controles no lock screen / notificação
  useEffect(() => {
    if (!item) return;
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: item.titulo,
      artist: 'Sala do Tempo · FOCO',
      album: 'Biblioteca de áudio',
      artwork: [
        { src: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
      ],
    });

    const audio = audioRef.current;
    const safe = (fn: () => void) => () => {
      try {
        fn();
      } catch {
        // ignore
      }
    };

    navigator.mediaSession.setActionHandler('play', safe(() => audio?.play()));
    navigator.mediaSession.setActionHandler('pause', safe(() => audio?.pause()));
    navigator.mediaSession.setActionHandler(
      'seekbackward',
      safe(() => {
        if (audio) audio.currentTime = Math.max(0, audio.currentTime - 10);
      }),
    );
    navigator.mediaSession.setActionHandler(
      'seekforward',
      safe(() => {
        if (audio) audio.currentTime = audio.currentTime + 10;
      }),
    );

    return () => {
      try {
        navigator.mediaSession.setActionHandler('play', null);
        navigator.mediaSession.setActionHandler('pause', null);
        navigator.mediaSession.setActionHandler('seekbackward', null);
        navigator.mediaSession.setActionHandler('seekforward', null);
      } catch {
        // ignore
      }
    };
  }, [item]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-preto/90 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 24, scale: 0.96 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 24, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md"
            style={{
              border: '1px solid rgba(91,140,255,0.45)',
              borderRadius: '16px',
              boxShadow:
                '0 0 14px rgba(91,140,255,0.25), 0 0 38px rgba(91,140,255,0.15), inset 0 0 0 1px rgba(91,140,255,0.06)',
              background: '#0D0D0D',
            }}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between p-3 border-b border-azul-mente/20">
              <button
                type="button"
                onClick={onClose}
                aria-label="Voltar"
                className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-azul-mente/10 transition-colors"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-branco"
                  aria-hidden
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                <span className="font-mono text-[10px] tracking-[2px] text-branco-dim uppercase">
                  Voltar
                </span>
              </button>

              <button
                type="button"
                onClick={onClose}
                aria-label="Sair"
                className="p-2 rounded-md hover:bg-azul-mente/10 transition-colors"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-branco"
                  aria-hidden
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Capa decorativa + título */}
            <div className="px-6 pt-8 pb-4 flex flex-col items-center text-center">
              <div
                className="w-32 h-32 rounded-full flex items-center justify-center mb-5"
                style={{
                  background:
                    'radial-gradient(circle, rgba(91,140,255,0.25) 0%, rgba(91,140,255,0.04) 70%)',
                  border: '1px solid rgba(91,140,255,0.25)',
                  boxShadow: '0 0 24px rgba(91,140,255,0.25)',
                }}
              >
                <span className="text-5xl">🎧</span>
              </div>
              <div className="font-mono text-[9px] tracking-[3px] text-azul-mente uppercase mb-1">
                Tocando agora
              </div>
              <div className="font-display text-xl tracking-[2px] text-branco leading-tight">
                {item.titulo}
              </div>
              {item.duracao && item.duracao !== '—' && (
                <div className="font-mono text-[10px] tracking-[2px] text-branco-dim/50 uppercase mt-1">
                  {item.duracao}
                </div>
              )}
            </div>

            {/* HTML5 audio nativo — controles e seek pelo browser.
                Continua tocando com tela bloqueada, integrado ao
                Media Session API acima. */}
            <div className="px-6 pb-6">
              <audio
                key={item.id}
                ref={audioRef}
                src={item.audioUrl}
                controls
                autoPlay
                preload="auto"
                className="w-full"
                style={{ outline: 'none' }}
              >
                Seu navegador não suporta áudio HTML5.
              </audio>

              <p className="font-mono text-[8px] tracking-[2px] text-branco-dim/40 uppercase text-center mt-3">
                ▸ Continua tocando com a tela bloqueada
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SpotifyIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#0D0D0D" aria-hidden>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.59 14.41c-.2.31-.6.41-.91.21-2.49-1.52-5.62-1.86-9.31-1.02-.36.08-.72-.14-.8-.5-.08-.36.14-.72.5-.8 4.04-.92 7.51-.53 10.31 1.18.31.2.41.61.21.93zm1.22-2.71c-.25.39-.76.51-1.15.26-2.85-1.75-7.19-2.26-10.56-1.24-.43.13-.89-.11-1.02-.55-.13-.43.11-.89.55-1.02 3.85-1.17 8.65-.6 11.92 1.4.39.25.51.76.26 1.15zm.11-2.83C14.55 8.84 8.7 8.62 5.43 9.62c-.51.16-1.06-.13-1.22-.65-.16-.51.13-1.06.65-1.22 3.78-1.15 10.25-.93 14.27 1.46.46.27.61.86.34 1.32-.27.46-.86.61-1.32.34z" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-azul-mente shrink-0"
      aria-hidden
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}
