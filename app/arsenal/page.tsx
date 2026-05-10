'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

type AcessoCampo = 'modo_guerra_acesso' | 'disparo_rapido_acesso';

interface ArsenalProduct {
  id: string;
  titulo: string;
  descricao: string;
  capa: string;
  corDestaque: string;
  rota: string;
  campo: AcessoCampo;
  /** Link de checkout do order bump — preencher depois. */
  checkoutUrl: string;
}

const ARSENAL_PRODUTOS: ArsenalProduct[] = [
  {
    id: 'modo-guerra',
    titulo: '',
    descricao:
      'Quer testar seus limites? potencialize os seus objetivos do dia com intensidade máxima.',
    capa: '/order-bumps/modo-guerra.png',
    corDestaque: '#FF3B3B',
    rota: '/arsenal/modo-guerra',
    campo: 'modo_guerra_acesso',
    checkoutUrl: 'https://pay.cakto.com.br/jf7hhvw_864215',
  },
  {
    id: 'disparo-rapido',
    titulo: '',
    descricao:
      'Travou? sem problemas, ative agora o disparo rápido e volte com tudo.',
    capa: '/order-bumps/disparo-rapido.png',
    corDestaque: '#FFC857',
    rota: '/arsenal/disparo-rapido',
    campo: 'disparo_rapido_acesso',
    checkoutUrl: 'https://pay.cakto.com.br/g87mkhc_864283',
  },
];

export default function ArsenalPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [acessos, setAcessos] = useState<Record<AcessoCampo, boolean>>({
    modo_guerra_acesso: false,
    disparo_rapido_acesso: false,
  });
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }

    const carregarAcessos = async () => {
      try {
        const { data, error } = await supabase
          .from('usuarios')
          .select('modo_guerra_acesso, disparo_rapido_acesso')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        setAcessos({
          modo_guerra_acesso: data.modo_guerra_acesso || false,
          disparo_rapido_acesso: data.disparo_rapido_acesso || false,
        });
      } catch (error) {
        console.error('Erro ao carregar acessos:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarAcessos();
  }, [user, authLoading, router]);

  const handleAcessar = (produto: ArsenalProduct) => {
    if (acessos[produto.campo]) {
      router.push(produto.rota);
    }
  };

  const handleComprar = (produto: ArsenalProduct) => {
    if (!produto.checkoutUrl) return;
    window.open(produto.checkoutUrl, '_blank', 'noopener,noreferrer');
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
    scrollToIndex(Math.min(ARSENAL_PRODUTOS.length - 1, activeIndex + 1));

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="font-mono text-sm text-branco-dim">Carregando...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-preto py-8 px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="font-mono text-[9px] tracking-[3px] text-laranja uppercase mb-2">
            Acesso Premium
          </div>
          <h1 className="font-display text-5xl tracking-wider text-branco mb-4">
            ARSENAL
            <br />
            <span className="text-laranja">AVANÇADO</span>
          </h1>
          <p className="font-body text-base text-branco-dim/60 max-w-md mx-auto">
            Recursos exclusivos para quem adquiriu os order bumps no checkout
          </p>
        </motion.div>

        {/* Carrossel */}
        <div className="max-w-2xl mx-auto relative">
          {/* Setas (apenas desktop) */}
          <CarouselArrow
            direction="prev"
            onClick={goPrev}
            disabled={activeIndex === 0}
          />
          <CarouselArrow
            direction="next"
            onClick={goNext}
            disabled={activeIndex >= ARSENAL_PRODUTOS.length - 1}
          />

          <div
            ref={carouselRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4 scrollbar-hide"
            style={{ scrollbarWidth: 'none' }}
          >
            {ARSENAL_PRODUTOS.map((produto, index) => {
              const desbloqueado = acessos[produto.campo];

              return (
                <motion.div
                  key={produto.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="snap-center shrink-0 w-[78%] sm:w-[58%] md:w-[48%]"
                >
                  <div
                    className="relative rounded-2xl overflow-hidden border-2 bg-cinza-escuro"
                    style={{
                      borderColor: desbloqueado ? `${produto.corDestaque}60` : 'rgba(255,255,255,0.06)',
                      boxShadow: desbloqueado
                        ? `0 0 24px ${produto.corDestaque}22`
                        : 'none',
                    }}
                  >
                    {/* Capa */}
                    <button
                      type="button"
                      onClick={() => handleAcessar(produto)}
                      disabled={!desbloqueado}
                      aria-label={
                        desbloqueado ? `Acessar ${produto.titulo}` : `${produto.titulo} bloqueado`
                      }
                      className="relative block w-full aspect-[9/16] overflow-hidden"
                    >
                      <Image
                        src={produto.capa}
                        alt={produto.titulo}
                        fill
                        sizes="(max-width: 640px) 88vw, 480px"
                        className={`object-cover transition-all ${
                          desbloqueado ? 'opacity-100' : 'opacity-50 grayscale'
                        }`}
                        priority={index === 0}
                      />

                      {/* Overlay de bloqueio */}
                      {!desbloqueado && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-preto/55 backdrop-blur-[2px]">
                          <div className="text-5xl mb-2">🔒</div>
                          <span className="font-mono text-[10px] tracking-[3px] text-branco/80 uppercase">
                            Bloqueado
                          </span>
                        </div>
                      )}

                      {/* Gradiente inferior + título */}
                      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-preto via-preto/70 to-transparent">
                        <h3
                          className="font-display text-2xl tracking-[3px] leading-tight"
                          style={{
                            color: desbloqueado ? produto.corDestaque : '#888',
                          }}
                        >
                          {produto.titulo}
                        </h3>
                        <p className="font-body text-xs text-branco-dim/70 mt-1 line-clamp-2">
                          {produto.descricao}
                        </p>
                      </div>
                    </button>

                    {/* Rodapé: status + botão de carrinho */}
                    <div className="flex items-center gap-3 p-4 border-t border-branco/5 bg-preto/40">
                      <div className="flex-1 flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: desbloqueado ? produto.corDestaque : '#444',
                          }}
                        />
                        <span
                          className="font-mono text-[10px] tracking-[2px] uppercase"
                          style={{
                            color: desbloqueado ? produto.corDestaque : 'rgba(255,255,255,0.4)',
                          }}
                        >
                          {desbloqueado ? 'Desbloqueado' : 'Requer compra'}
                        </span>
                      </div>

                      {!desbloqueado && produto.checkoutUrl && (
                        <button
                          type="button"
                          onClick={() => handleComprar(produto)}
                          aria-label={`Comprar ${produto.titulo}`}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg font-display text-sm tracking-[2px] transition-all hover:brightness-110 active:scale-95"
                          style={{
                            background: produto.corDestaque,
                            color: '#0D0D0D',
                            boxShadow: `0 4px 14px ${produto.corDestaque}40`,
                          }}
                        >
                          <CartIcon />
                          <span>COMPRAR</span>
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Indicadores */}
          <div className="flex justify-center gap-2 mt-4">
            {ARSENAL_PRODUTOS.map((produto, idx) => (
              <button
                key={produto.id}
                type="button"
                onClick={() => scrollToIndex(idx)}
                aria-label={`Ir para ${produto.titulo}`}
                className="h-[3px] rounded-full transition-all"
                style={{
                  width: idx === activeIndex ? '24px' : '12px',
                  background:
                    idx === activeIndex ? produto.corDestaque : 'rgba(255,255,255,0.15)',
                }}
              />
            ))}
          </div>
        </div>

        {/* Info sobre como desbloquear */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 max-w-lg mx-auto"
        >
          <div className="bg-cinza-escuro/40 border border-cinza-borda rounded-lg p-6">
            <div className="font-mono text-[9px] tracking-[3px] text-amarelo uppercase mb-3">
              ℹ️ Como Desbloquear
            </div>
            <p className="font-body text-sm text-branco-dim/60 leading-relaxed">
              Os produtos do Arsenal Avançado são desbloqueados através da aquisição dos
              <span className="text-branco font-semibold"> order bumps </span>
              durante o processo de checkout da Missão 21 Dias.
              <br />
              <br />
              Caso você adquiriu algum produto e não está vendo aqui, entre em contato com o
              suporte através de
              <span className="text-branco font-semibold"> suporte.saladotempo21@gmail.com</span>.
            </p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}

function CartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
    </svg>
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
      className={`hidden md:flex absolute top-1/2 -translate-y-1/2 z-20 items-center justify-center w-11 h-11 rounded-full bg-preto/80 backdrop-blur-sm border border-branco-dim/15 hover:border-laranja/60 hover:bg-preto disabled:opacity-30 disabled:cursor-not-allowed transition-all ${
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
