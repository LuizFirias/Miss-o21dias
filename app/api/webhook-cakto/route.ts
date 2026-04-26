import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/* ══════════════════════════════════════════════════
   TYPES — Cakto Webhook Payload
══════════════════════════════════════════════════ */
interface CaktoWebhookPayload {
  event: string; // "sale.approved"
  data: {
    id: string;
    customer: {
      email: string;
      name: string;
      phone?: string;
    };
    amount: number;
    status: string;
    created_at: string;
    order_bumps?: Array<{
      id: string;
      name: string;
      amount: number;
    }>;
    metadata?: Record<string, any>;
  };
}

/* ══════════════════════════════════════════════════
   CONFIG
══════════════════════════════════════════════════ */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const webhookSecret = process.env.CAKTO_WEBHOOK_SECRET!;
const resendApiKey = process.env.RESEND_API_KEY!;
const fromEmail = process.env.RESEND_FROM_EMAIL!;
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://saladotempo.site';

// Supabase Admin (Service Role)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const resend = new Resend(resendApiKey);

/* ══════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════ */
function verifyWebhookSignature(payload: string, signature: string | null): boolean {
  if (!signature) return false;

  const hmac = crypto.createHmac('sha256', webhookSecret);
  const digest = hmac.update(payload).digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
}

function generatePassword(): string {
  // Gera senha aleatória forte: 12 caracteres com letras, números e símbolos
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

function detectOrderBumps(orderBumps: Array<{ name: string }> = []) {
  const bumps = {
    modo_guerra_acesso: false,
    continuidade_30dias: false,
    disparo_rapido_acesso: false,
  };

  orderBumps.forEach((bump) => {
    const name = bump.name.toLowerCase();
    
    if (name.includes('modo guerra') || name.includes('acesso oculto')) {
      bumps.modo_guerra_acesso = true;
    }
    if (name.includes('continuidade') || name.includes('30 dias')) {
      bumps.continuidade_30dias = true;
    }
    if (name.includes('disparo rápido') || name.includes('execução imediata')) {
      bumps.disparo_rapido_acesso = true;
    }
  });

  return bumps;
}

async function sendWelcomeEmail(
  email: string,
  name: string,
  password: string,
  orderBumps: { modo_guerra_acesso: boolean; continuidade_30dias: boolean; disparo_rapido_acesso: boolean }
) {
  const premiumFeatures = [];
  if (orderBumps.modo_guerra_acesso) premiumFeatures.push('✓ Modo Guerra (Acesso Oculto)');
  if (orderBumps.continuidade_30dias) premiumFeatures.push('✓ Continuidade (30 dias extras)');
  if (orderBumps.disparo_rapido_acesso) premiumFeatures.push('✓ Disparo Rápido');

  const premiumSection = premiumFeatures.length > 0
    ? `
    <div style="margin-top: 24px; padding: 16px; background: rgba(255,200,87,0.05); border-left: 3px solid #FFC857; border-radius: 4px;">
      <p style="margin: 0 0 8px; font-family: 'Share Tech Mono', monospace; font-size: 11px; color: #FFC857; letter-spacing: 2px;">ARSENAL AVANÇADO DESBLOQUEADO</p>
      ${premiumFeatures.map(f => `<p style="margin: 4px 0; font-size: 14px; color: #ccc;">${f}</p>`).join('')}
    </div>
    `
    : '';

  try {
    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: '🎯 Acesso Confirmado — SALA DO TEMPO 21 DIAS',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@400;600;700&family=Share+Tech+Mono&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; background: #0D0D0D; font-family: 'Rajdhani', sans-serif; color: #F5F5F5;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <h1 style="margin: 0; font-family: 'Bebas Neue', cursive; font-size: 48px; letter-spacing: 4px; color: #F5F5F5;">
        SALA DO <span style="color: #FF3B3B;">TEMPO</span>
      </h1>
      <p style="margin: 8px 0 0; font-family: 'Share Tech Mono', monospace; font-size: 10px; letter-spacing: 4px; color: #888;">21 DIAS · EXECUÇÃO REAL</p>
    </div>

    <div style="height: 2px; background: linear-gradient(to right, #FF3B3B, #FFC857); margin: 32px 0;"></div>

    <!-- Welcome -->
    <div style="background: #111; padding: 24px; border-radius: 8px; border-left: 3px solid #FF3B3B; margin-bottom: 24px;">
      <p style="margin: 0 0 12px; font-family: 'Share Tech Mono', monospace; font-size: 11px; color: #FF3B3B; letter-spacing: 2px;">BEM-VINDO(A), ${name.toUpperCase()}</p>
      <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #ccc;">
        Sua compra foi aprovada. Você agora tem acesso completo ao <strong style="color: #F5F5F5;">SALA DO TEMPO 21 DIAS</strong>.
      </p>
    </div>

    <!-- Credentials -->
    <div style="background: #0f0f0f; padding: 24px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06); margin-bottom: 24px;">
      <p style="margin: 0 0 16px; font-family: 'Share Tech Mono', monospace; font-size: 11px; color: #888; letter-spacing: 2px;">CREDENCIAIS DE ACESSO</p>
      
      <div style="margin-bottom: 12px;">
        <p style="margin: 0 0 4px; font-size: 12px; color: #888;">Email:</p>
        <p style="margin: 0; font-family: 'Share Tech Mono', monospace; font-size: 15px; color: #F5F5F5; background: #0a0a0a; padding: 10px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.08);">${email}</p>
      </div>

      <div>
        <p style="margin: 0 0 4px; font-size: 12px; color: #888;">Senha temporária:</p>
        <p style="margin: 0; font-family: 'Share Tech Mono', monospace; font-size: 15px; color: #00C853; background: #0a0a0a; padding: 10px; border-radius: 4px; border: 1px solid rgba(0,200,83,0.2);">${password}</p>
      </div>

      <p style="margin: 16px 0 0; font-size: 13px; color: #666;">
        ⚠️ Guarde essa senha em local seguro. Você poderá alterá-la dentro do app.
      </p>
    </div>

    ${premiumSection}

    <!-- CTA -->
    <div style="text-align: center; margin-top: 32px;">
      <a href="${appUrl}/login" style="display: inline-block; background: #FF3B3B; color: #fff; text-decoration: none; padding: 16px 40px; border-radius: 5px; font-family: 'Bebas Neue', cursive; font-size: 20px; letter-spacing: 3px; box-shadow: 0 4px 12px rgba(255,59,59,0.3);">
        FAZER LOGIN AGORA
      </a>
      <p style="margin: 12px 0 0; font-size: 12px; color: #555;">
        Ou acesse: ${appUrl}/login
      </p>
    </div>

    <div style="height: 1px; background: rgba(255,255,255,0.06); margin: 40px 0;"></div>

    <!-- Instructions -->
    <div style="background: #0a0a0a; padding: 20px; border-radius: 8px;">
      <p style="margin: 0 0 12px; font-family: 'Share Tech Mono', monospace; font-size: 11px; color: #FFC857; letter-spacing: 2px;">PRIMEIROS PASSOS</p>
      
      <ol style="margin: 0; padding-left: 20px; color: #aaa; font-size: 14px; line-height: 1.8;">
        <li>Faça login com suas credenciais acima</li>
        <li>Complete seu perfil (nome, nível, modo)</li>
        <li>Comece sua primeira missão do dia 1</li>
        <li>Desbloqueie bônus ao completar checkpoints</li>
      </ol>

      <p style="margin: 16px 0 0; font-size: 13px; color: #666;">
        <strong style="color: #FF3B3B;">Lembre-se:</strong> Você tem 7 dias de garantia total. Se não gostar, devolvemos 100% do seu dinheiro.
      </p>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 40px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.06);">
      <p style="margin: 0; font-size: 12px; color: #555;">
        Sala do Tempo © 2026 · <a href="${appUrl}" style="color: #FF3B3B; text-decoration: none;">saladotempo.site</a>
      </p>
      <p style="margin: 8px 0 0; font-size: 11px; color: #444;">
        Alguma dúvida? Responda este email.
      </p>
    </div>

  </div>
</body>
</html>
      `,
    });
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    // Não falha o webhook se email falhar
  }
}

/* ══════════════════════════════════════════════════
   WEBHOOK HANDLER
══════════════════════════════════════════════════ */
export async function POST(request: NextRequest) {
  try {
    // 1. Ler payload
    const rawBody = await request.text();
    const signature = request.headers.get('x-cakto-signature');

    console.log('📨 Webhook recebido:', {
      hasSignature: !!signature,
      bodyLength: rawBody.length,
    });

    // 2. Verificar assinatura
    if (!verifyWebhookSignature(rawBody, signature)) {
      console.error('⚠️ Assinatura inválida');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // 3. Parse payload
    const payload: CaktoWebhookPayload = JSON.parse(rawBody);

    console.log('📦 Payload:', {
      event: payload.event,
      email: payload.data.customer.email,
      orderBumps: payload.data.order_bumps?.length || 0,
    });

    // 4. Processar apenas evento de compra aprovada
    if (payload.event !== 'sale.approved') {
      console.log('ℹ️ Evento ignorado:', payload.event);
      return NextResponse.json({ message: 'Event ignored' });
    }

    const { customer, order_bumps } = payload.data;
    const email = customer.email.toLowerCase().trim();
    const name = customer.name || email.split('@')[0];

    // 5. Detectar order bumps
    const bumps = detectOrderBumps(order_bumps);

    console.log('🎯 Order Bumps detectados:', bumps);

    // 6. Verificar se usuário já existe
    const { data: existingUser } = await supabaseAdmin
      .from('usuarios')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      console.log('⚠️ Usuário já existe:', email);
      
      // Atualizar campos de acesso se comprou order bumps
      if (bumps.modo_guerra_acesso || bumps.continuidade_30dias || bumps.disparo_rapido_acesso) {
        await supabaseAdmin
          .from('usuarios')
          .update(bumps)
          .eq('id', existingUser.id);
        
        console.log('✅ Campos de acesso atualizados');
      }

      return NextResponse.json({
        message: 'User already exists, access updated',
        userId: existingUser.id,
      });
    }

    // 7. Gerar senha temporária
    const password = generatePassword();

    // 8. Criar usuário no Supabase Auth
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirma email
      user_metadata: {
        name,
        created_via: 'cakto_webhook',
        purchase_id: payload.data.id,
      },
    });

    if (authError || !authUser.user) {
      console.error('❌ Erro ao criar usuário no Auth:', authError);
      return NextResponse.json(
        { error: 'Failed to create auth user', details: authError },
        { status: 500 }
      );
    }

    console.log('✅ Usuário criado no Auth:', authUser.user.id);

    // 9. Criar perfil na tabela usuarios
    const { error: profileError } = await supabaseAdmin.from('usuarios').insert([
      {
        id: authUser.user.id,
        email,
        nome: name,
        nivel: 'iniciante',
        modo: 'normal',
        dia_atual: 1,
        streak: 0,
        onboarding_completo: false,
        ...bumps, // Adiciona campos de order bumps
      },
    ]);

    if (profileError) {
      console.error('❌ Erro ao criar perfil:', profileError);
      
      // Rollback: deletar usuário do Auth
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      
      return NextResponse.json(
        { error: 'Failed to create user profile', details: profileError },
        { status: 500 }
      );
    }

    console.log('✅ Perfil criado na tabela usuarios');

    // 10. Enviar email de boas-vindas
    await sendWelcomeEmail(email, name, password, bumps);

    console.log('✅ Email enviado');

    // 11. Retornar sucesso
    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      userId: authUser.user.id,
      email,
      orderBumps: bumps,
    });
  } catch (error: any) {
    console.error('❌ Erro no webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

// Métodos não permitidos
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
