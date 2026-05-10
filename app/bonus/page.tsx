'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import Loading from '@/components/Loading';

interface Bonus {
  id: string;
  titulo: string;
  subtitulo: string;
  rota: string;
  diaDesbloqueio: number;
  /** Caminho da capa (9:16 — formato stories). As capas serão adicionadas depois. */
  capa: string;
  corDestaque: string;
}

const BONUS_DATA: Bonus[] = [
  {
    id: 'rotina-blindada',
    titulo: '',
    subtitulo: 'Protocolo Diário de Alta Performance',
    rota: '/bonus/rotina-blindada',
    diaDesbloqueio: 1,
    capa: '/bonus-covers/plano-diario.png',
    corDestaque: '#FF3B3B',
  },
  {
    id: 'protocolo-anti-vicio',
    titulo: '',
    subtitulo: 'Recuperação de Controle',
    rota: '/bonus/protocolo-anti-vicio',
    diaDesbloqueio: 7,
    capa: '/bonus-covers/protocolo-anti-vicio.png',
    corDestaque: '#FFC857',
  },
  {
    id: 'codigo-disciplina',
    titulo: '',
    subtitulo: 'Fundamentos de Execução',
    rota: '/bonus/codigo-disciplina',
    diaDesbloqueio: 14,
    capa: '/bonus-covers/codigo-disciplina.png',
    corDestaque: '#5B8CFF',
  },
  {
    id: 'grupo-whatsapp',
    titulo: 'Grupo WhatsApp Exclusivo',
    subtitulo: 'Comunidade de Guerreiros',
    rota: '/bonus/grupo-whatsapp',
    diaDesbloqueio: 21,
    capa: '/bonus-covers/grupo-whatsapp.png',
    corDestaque: '#00C853',
  },
];

export default function BonusPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <Loading />;
  }

  const isBonusUnlocked = (bonus: Bonus) => user.dia_atual >= bonus.diaDesbloqueio;
  const desbloqueados = BONUS_DATA.filter(isBonusUnlocked).length;

  const handleBonusClick = (bonus: Bonus) => {
    if (isBonusUnlocked(bonus)) {
      router.push(bonus.rota);
    }
  };

  const scrollToIndex = (index: number) => {
    const el = carouselRef.current;
    if (!el) return;
    const card = el.children[index] as HTMLElement | undefined;
    if (card) {
      el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    const el = carouselRef.current;
    if (!el) return;
    const cardWidth = (el.firstChild as HTMLElement)?.offsetWidth || 1;
    const idx = Math.round(el.scrollLeft / cardWidth);
    if (idx !== activeIndex) setActiveIndex(idx);
  };

  const goPrev = () => scrollToIndex(Math.max(0, activeIndex - 1));
  const goNext = () =>
    scrollToIndex(Math.min(BONUS_DATA.length - 1, activeIndex + 1));

  return (
    <Layout>
      <div className="min-h-screen bg-preto pb-8">
        {/* Header da seção */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-end mb-4">
            <div>
              <div className="font-mono text-[9px] tracking-[3px] text-amarelo uppercase mb-1">
                Recompensas
              </div>
              <h1 className="font-display text-4xl tracking-[3px] text-branco">BÔNUS</h1>
            </div>
            <div className="text-right">
              <div className="font-display text-3xl text-branco">
                <span className="text-amarelo">{desbloqueados}</span>/{BONUS_DATA.length}
              </div>
              <div className="font-mono text-[7px] tracking-[2px] text-branco-dim uppercase">
                Desbloqueados
              </div>
            </div>
          </div>

          {/* Barra de progresso */}
          <div className="w-full h-2 bg-cinza-medio rounded-full overflow-hidden mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(desbloqueados / BONUS_DATA.length) * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-amarelo to-laranja"
            />
          </div>
          <div className="flex justify-between">
            <span className="font-mono text-[7px] tracking-[2px] text-amarelo uppercase">
              Progresso de Bônus
            </span>
            <span className="font-mono text-[7px] tracking-[2px] text-branco-dim uppercase">
              Continue avançando para desbloquear mais
            </span>
          </div>
        </motion.div>

        {/* Carrossel de capas */}
        <div className="relative">
          <CarouselArrow
            direction="prev"
            onClick={goPrev}
            disabled={activeIndex === 0}
          />
          <CarouselArrow
            direction="next"
            onClick={goNext}
            disabled={activeIndex >= BONUS_DATA.length - 1}
          />

          <div
            ref={carouselRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4 scrollbar-hide"
            style={{ scrollbarWidth: 'none' }}
          >
            {BONUS_DATA.map((bonus, index) => {
              const unlocked = isBonusUnlocked(bonus);
              const isNew = unlocked && user.dia_atual === bonus.diaDesbloqueio;

              return (
                <motion.div
                  key={bonus.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="snap-center shrink-0 w-[78%] sm:w-[58%] md:w-[48%]"
                >
                  <button
                    type="button"
                    onClick={() => handleBonusClick(bonus)}
                    disabled={!unlocked}
                    aria-label={
                      unlocked ? `Acessar ${bonus.titulo}` : `${bonus.titulo} bloqueado`
                    }
                    className="relative block w-full aspect-[9/16] rounded-2xl overflow-hidden border-2 bg-cinza-escuro text-left disabled:cursor-not-allowed"
                    style={{
                      borderColor: unlocked
                        ? `${bonus.corDestaque}60`
                        : 'rgba(255,255,255,0.06)',
                      boxShadow: unlocked ? `0 0 24px ${bonus.corDestaque}22` : 'none',
                    }}
                  >
                    {/* Fundo gradiente (placeholder até a capa ser carregada) */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(160deg, ${bonus.corDestaque}25 0%, #0D0D0D 70%)`,
                      }}
                    />

                    {/* Capa */}
                    <Image
                      src={bonus.capa}
                      alt={bonus.titulo}
                      fill
                      sizes="(max-width: 640px) 78vw, 480px"
                      className={`object-cover transition-all ${
                        unlocked ? 'opacity-100' : 'opacity-50 grayscale'
                      }`}
                      priority={index === 0}
                    />

                    {/* Badge NEW */}
                    {isNew && (
                      <div className="absolute top-3 left-3 z-10 bg-amarelo text-preto font-display text-[9px] tracking-[2px] px-2 py-1 rounded">
                        NEW
                      </div>
                    )}

                    {/* Overlay de bloqueio */}
                    {!unlocked && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-preto/60 backdrop-blur-[2px]">
                        <div className="text-5xl mb-2">🔒</div>
                        <div className="font-mono text-[10px] tracking-[3px] text-branco/80 uppercase mb-1">
                          Bloqueado
                        </div>
                        <div className="font-mono text-[9px] tracking-[2px] text-branco-dim uppercase bg-cinza-medio/80 border border-branco-dim/20 rounded px-3 py-1">
                          Dia {bonus.diaDesbloqueio}
                        </div>
                      </div>
                    )}

                    {/* Gradiente inferior + título */}
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-preto via-preto/80 to-transparent">
                      <h3
                        className="font-display text-2xl tracking-[3px] leading-tight"
                        style={{ color: unlocked ? bonus.corDestaque : '#888' }}
                      >
                        {bonus.titulo}
                      </h3>
                      <p className="font-body text-xs text-branco-dim/70 mt-1">
                        {bonus.subtitulo}
                      </p>
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Indicadores */}
          <div className="flex justify-center gap-2 mt-4">
            {BONUS_DATA.map((bonus, idx) => (
              <button
                key={bonus.id}
                type="button"
                onClick={() => scrollToIndex(idx)}
                aria-label={`Ir para ${bonus.titulo}`}
                className="h-[3px] rounded-full transition-all"
                style={{
                  width: idx === activeIndex ? '24px' : '12px',
                  background:
                    idx === activeIndex ? bonus.corDestaque : 'rgba(255,255,255,0.15)',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

function CarouselArrow({
  direction,
  onClick,
  disabled,
}: {
  direction: 'prev' | 'next';
  onClick: () => void;
  disabled?: boolean;
}) {
  const isPrev = direction === 'prev';
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isPrev ? 'Anterior' : 'Próximo'}
      className={`hidden md:flex absolute top-1/2 -translate-y-1/2 z-20 items-center justify-center w-11 h-11 rounded-full bg-preto/80 backdrop-blur-sm border border-branco-dim/15 hover:border-amarelo/60 hover:bg-preto disabled:opacity-30 disabled:cursor-not-allowed transition-all ${
        isPrev ? '-left-5' : '-right-5'
      }`}
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
        {isPrev ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
      </svg>
    </button>
  );
}
