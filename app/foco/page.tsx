'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout';
import Loading from '@/components/Loading';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

type TabKey = 'foco' | 'audio';

interface MidiaItem {
  id: string;
  titulo: string;
  /** Duração em formato livre (ex: "3 min", "lo-fi 2h"). */
  duracao: string;
}

interface Categoria {
  id: string;
  label: string;
  icone: string;
  uso: string;
  cor: string;
  itens: MidiaItem[];
}

const PLAYLISTS_FOCO: Categoria[] = [
  {
    id: 'execucao',
    label: 'EXECUÇÃO',
    icone: '🔥',
    uso: 'Antes de agir',
    cor: '#FF3B3B',
    itens: [
      { id: 'exec-1', titulo: 'Faça agora — 90 segundos', duracao: '1 min' },
      { id: 'exec-2', titulo: 'Sem desculpa. Sem pausa.', duracao: '3 min' },
      { id: 'exec-3', titulo: 'Levanta. Move.', duracao: '2 min' },
      { id: 'exec-4', titulo: 'Modo soldado', duracao: '5 min' },
    ],
  },
  {
    id: 'concentracao',
    label: 'CONCENTRAÇÃO',
    icone: '🧠',
    uso: 'Durante tarefas',
    cor: '#5B8CFF',
    itens: [
      { id: 'conc-1', titulo: 'Lo-fi monk — sessão profunda', duracao: '45 min' },
      { id: 'conc-2', titulo: 'Foco binaural 40Hz', duracao: '60 min' },
      { id: 'conc-3', titulo: 'Trilha de estudo silenciosa', duracao: '90 min' },
      { id: 'conc-4', titulo: 'Deep work loop', duracao: '2h' },
    ],
  },
  {
    id: 'pressao',
    label: 'PRESSÃO',
    icone: '🏋️',
    uso: 'Quando estiver cansado',
    cor: '#FF8C42',
    itens: [
      { id: 'press-1', titulo: 'Sai do chão — superação', duracao: '4 min' },
      { id: 'press-2', titulo: 'Treino sem desculpa', duracao: '6 min' },
      { id: 'press-3', titulo: 'Mais um round', duracao: '5 min' },
      { id: 'press-4', titulo: 'Modo guerreiro', duracao: '7 min' },
    ],
  },
  {
    id: 'reset',
    label: 'RESET',
    icone: '📖',
    uso: 'Quando estiver sobrecarregado',
    cor: '#00C853',
    itens: [
      { id: 'reset-1', titulo: 'Respira. Reorganiza.', duracao: '5 min' },
      { id: 'reset-2', titulo: 'Pausa consciente', duracao: '8 min' },
      { id: 'reset-3', titulo: 'Reflexão leve', duracao: '6 min' },
    ],
  },
];

const PLAYLISTS_AUDIO: Categoria[] = [
  {
    id: 'modo-foco',
    label: 'MODO FOCO',
    icone: '🔊',
    uso: 'Ruído branco · chuva · ambiente',
    cor: '#5B8CFF',
    itens: [
      { id: 'mf-1', titulo: 'Chuva fina contínua', duracao: '60 min' },
      { id: 'mf-2', titulo: 'Ruído branco neutro', duracao: '90 min' },
      { id: 'mf-3', titulo: 'Café silencioso', duracao: '2h' },
    ],
  },
  {
    id: 'modo-intenso',
    label: 'MODO INTENSO',
    icone: '🔊',
    uso: 'Batidas · som energético',
    cor: '#FF3B3B',
    itens: [
      { id: 'mi-1', titulo: 'Tambor de execução', duracao: '20 min' },
      { id: 'mi-2', titulo: 'Pulso 120 BPM', duracao: '35 min' },
      { id: 'mi-3', titulo: 'Batida de guerra', duracao: '40 min' },
    ],
  },
  {
    id: 'silencio-guiado',
    label: 'MODO SILÊNCIO GUIADO',
    icone: '🔊',
    uso: 'Quase nada — leve ambiência',
    cor: '#AAAAAA',
    itens: [
      { id: 'sg-1', titulo: 'Vento distante', duracao: '30 min' },
      { id: 'sg-2', titulo: 'Sala vazia', duracao: '60 min' },
      { id: 'sg-3', titulo: 'Quase silêncio', duracao: '45 min' },
    ],
  },
];

// TODO: substituir pelo link real de checkout do acesso completo FOCO
const CHECKOUT_FOCO_COMPLETO = '';

export default function FocoPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [tab, setTab] = useState<TabKey>('foco');
  const [acessoCompleto, setAcessoCompleto] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }

    const carregar = async () => {
      try {
        const { data, error } = await supabase
          .from('usuarios')
          .select('foco_acesso')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setAcessoCompleto(Boolean(data?.foco_acesso));
      } catch (err) {
        // Campo pode ainda não existir no banco antes da migração rodar.
        // Tratar como sem acesso (libera só o item grátis por categoria).
        console.warn('foco_acesso indisponível:', err);
        setAcessoCompleto(false);
      } finally {
        setLoading(false);
      }
    };

    carregar();
  }, [user, authLoading, router]);

  if (authLoading || loading || !user) {
    return <Loading />;
  }

  const playlists = tab === 'foco' ? PLAYLISTS_FOCO : PLAYLISTS_AUDIO;
  const primeiraCategoria = playlists[0];
  const itemDestaque = primeiraCategoria?.itens[0];

  const handleLiberarAcesso = () => {
    if (!CHECKOUT_FOCO_COMPLETO) return;
    window.open(CHECKOUT_FOCO_COMPLETO, '_blank', 'noopener,noreferrer');
  };

  const handlePlay = (categoria: Categoria, item: MidiaItem) => {
    // TODO: integrar player real (vídeo/áudio)
    console.log('▶️ play', categoria.id, item.id);
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
          <h1 className="font-display text-4xl tracking-[3px] text-branco">
            FOCO
          </h1>
          <p className="font-body text-sm text-branco-dim/60 mt-2">
            Tira você da inércia. Sem pensar.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8 border-b border-cinza-borda">
          <TabButton
            active={tab === 'foco'}
            onClick={() => setTab('foco')}
            cor="#5B8CFF"
          >
            📲 FOCO
          </TabButton>
          <TabButton
            active={tab === 'audio'}
            onClick={() => setTab('audio')}
            cor="#FFC857"
          >
            ⚔️ ÁUDIO
          </TabButton>
        </div>

        {/* Botão prioridade — apenas na aba FOCO */}
        {tab === 'foco' && itemDestaque && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => handlePlay(primeiraCategoria, itemDestaque)}
            className="w-full mb-10 group relative overflow-hidden rounded-xl border-2 border-vermelho/40 bg-gradient-to-br from-vermelho/15 to-preto p-6 text-left hover:border-vermelho/80 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-vermelho flex items-center justify-center shrink-0 shadow-[0_0_24px_rgba(255,59,59,0.4)]">
                <PlayIcon size={22} />
              </div>
              <div className="flex-1">
                <div className="font-mono text-[9px] tracking-[3px] text-vermelho uppercase mb-1">
                  Prioridade
                </div>
                <div className="font-display text-3xl tracking-[3px] text-branco leading-none">
                  COMEÇAR AGORA
                </div>
                <div className="font-body text-xs text-branco-dim/70 mt-2">
                  Vídeo automático + som leve. Tira da inércia em segundos.
                </div>
              </div>
            </div>
          </motion.button>
        )}

        {/* Sub-título */}
        <div className="font-mono text-[9px] tracking-[3px] uppercase mb-5"
          style={{ color: tab === 'foco' ? '#5B8CFF' : '#FFC857' }}
        >
          {tab === 'foco' ? 'Playlists por estado' : 'Modos de áudio'}
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
            {playlists.map((cat) => (
              <Categoria
                key={cat.id}
                categoria={cat}
                acessoCompleto={acessoCompleto}
                onPlay={handlePlay}
                onLiberar={handleLiberarAcesso}
                checkoutDisponivel={Boolean(CHECKOUT_FOCO_COMPLETO)}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {!acessoCompleto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <div className="bg-cinza-escuro/40 border border-azul-mente/20 rounded-lg p-6 text-center">
              <div className="font-mono text-[9px] tracking-[3px] text-azul-mente uppercase mb-2">
                Acesso Limitado
              </div>
              <h3 className="font-display text-2xl tracking-[2px] text-branco mb-2">
                Biblioteca completa disponível
              </h3>
              <p className="font-body text-sm text-branco-dim/60 mb-5">
                Você está com 1 item liberado por categoria. Desbloqueie todos os vídeos e
                áudios para usar no momento certo.
              </p>
              <button
                type="button"
                onClick={handleLiberarAcesso}
                disabled={!CHECKOUT_FOCO_COMPLETO}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-display text-sm tracking-[3px] bg-azul-mente text-preto hover:brightness-110 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ boxShadow: '0 4px 14px rgba(91,140,255,0.4)' }}
              >
                <CartIcon />
                LIBERAR ACESSO COMPLETO
              </button>
              {!CHECKOUT_FOCO_COMPLETO && (
                <div className="font-mono text-[8px] tracking-[2px] text-branco-dim/40 uppercase mt-3">
                  Em breve
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
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

function Categoria({
  categoria,
  acessoCompleto,
  onPlay,
  onLiberar,
  checkoutDisponivel,
}: {
  categoria: Categoria;
  acessoCompleto: boolean;
  onPlay: (cat: Categoria, item: MidiaItem) => void;
  onLiberar: () => void;
  checkoutDisponivel: boolean;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-3">
        <div className="flex items-baseline gap-2">
          <span className="text-xl">{categoria.icone}</span>
          <h2
            className="font-display text-2xl tracking-[3px]"
            style={{ color: categoria.cor }}
          >
            {categoria.label}
          </h2>
        </div>
        <span className="font-mono text-[8px] tracking-[2px] text-branco-dim/50 uppercase">
          {categoria.uso}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {categoria.itens.map((item, idx) => {
          const liberado = acessoCompleto || idx === 0;
          return (
            <ItemCard
              key={item.id}
              item={item}
              liberado={liberado}
              cor={categoria.cor}
              onPlay={() => onPlay(categoria, item)}
              onLiberar={onLiberar}
              checkoutDisponivel={checkoutDisponivel}
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
  onPlay,
  onLiberar,
  checkoutDisponivel,
}: {
  item: MidiaItem;
  liberado: boolean;
  cor: string;
  onPlay: () => void;
  onLiberar: () => void;
  checkoutDisponivel: boolean;
}) {
  if (liberado) {
    return (
      <button
        type="button"
        onClick={onPlay}
        className="group relative flex items-center gap-3 p-4 rounded-lg border bg-cinza-escuro hover:bg-cinza-medio transition-all text-left"
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
          </div>
        </div>
      </button>
    );
  }

  return (
    <div
      className="relative flex items-center gap-3 p-4 rounded-lg border border-cinza-borda bg-cinza-escuro/40 overflow-hidden"
    >
      {/* Conteúdo borrado */}
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

      {/* Overlay de bloqueio */}
      <div className="absolute inset-0 flex items-center gap-3 px-4 bg-preto/65 backdrop-blur-[1px]">
        <div className="text-xl">🔒</div>
        <div className="flex-1 min-w-0">
          <div className="font-mono text-[9px] tracking-[2px] text-branco/85 uppercase truncate">
            Biblioteca completa disponível
          </div>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onLiberar();
          }}
          disabled={!checkoutDisponivel}
          className="shrink-0 font-mono text-[9px] tracking-[2px] uppercase px-3 py-1.5 rounded border transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            color: cor,
            borderColor: `${cor}66`,
          }}
        >
          Liberar
        </button>
      </div>
    </div>
  );
}

function PlayIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="#0D0D0D"
      aria-hidden
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
    </svg>
  );
}
