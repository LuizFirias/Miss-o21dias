'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';

export default function GrupoWhatsAppPage() {
  const router = useRouter();

  return (
    <Layout>
      <div className="min-h-screen bg-preto flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-6xl mb-6">💬</div>
          
          <div className="font-mono text-[9px] tracking-[3px] text-verde uppercase mb-2">
            Bônus Exclusivo
          </div>
          
          <h1 className="font-display text-4xl tracking-wider text-branco mb-4">
            GRUPO WHATSAPP
            <br />
            <span className="text-verde">EXCLUSIVO</span>
          </h1>

          <p className="font-mono text-[10px] tracking-[2px] text-branco-dim uppercase mb-8">
            Comunidade de Guerreiros
          </p>

          <div className="max-w-md mx-auto mb-8">
            <p className="font-body text-base text-branco-dim/60 leading-relaxed">
              Acesso ao grupo privado com outros membros em jornada.
              <br />
              Suporte e accountability diário.
            </p>
          </div>

          <div className="bg-cinza-escuro border border-verde/30 rounded-lg p-6 mb-8 max-w-md mx-auto">
            <div className="font-mono text-[9px] tracking-[3px] text-verde uppercase mb-3">
              ✓ Desbloqueado no Dia 21
            </div>
            <p className="font-body text-sm text-branco-dim leading-relaxed mb-6">
              Parabéns por completar a jornada de 21 dias!
              <br /><br />
              Você agora tem acesso à comunidade exclusiva de guerreiros que, assim como você, estão comprometidos com a transformação.
            </p>

            <div className="bg-preto border border-verde/20 rounded-lg p-4 mb-4">
              <div className="font-mono text-[8px] tracking-[2px] text-verde uppercase mb-2">
                Link do Grupo
              </div>
              <p className="font-mono text-xs text-branco-dim/50 break-all">
                https://chat.whatsapp.com/XXXXXXXXXXXXXXX
              </p>
            </div>

            <p className="font-mono text-[8px] tracking-wider text-branco-dim/40 uppercase">
              O link será enviado por e-mail ao completar o dia 21
            </p>
          </div>

          <button
            onClick={() => router.push('/bonus')}
            className="bg-transparent border border-verde/40 hover:border-verde hover:bg-verde/10 text-verde font-display text-base tracking-[3px] py-3 px-8 rounded transition-all"
          >
            VOLTAR PARA BÔNUS
          </button>
        </motion.div>
      </div>
    </Layout>
  );
}
