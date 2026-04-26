// Utilitário para envio de emails via Resend
// Documentação: https://resend.com/docs

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Sala do Tempo <noreply@seudominio.com>';
const DOMAIN = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Envia um email usando Resend
 */
export async function sendEmail(options: EmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    if (error) {
      console.error('Erro ao enviar email:', error);
      throw error;
    }

    console.log('Email enviado com sucesso:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return { success: false, error };
  }
}

/**
 * Email de boas-vindas após compra
 */
export async function sendWelcomeEmail(to: string, nome: string, senhaTemporaria: string) {
  const subject = '🔥 Bem-vindo à Sala do Tempo - Seus 21 Dias Começam Agora';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bem-vindo à Sala do Tempo</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1a1a1a; border-radius: 8px; overflow: hidden;">
              
              <!-- Header com glow effect -->
              <tr>
                <td style="padding: 40px; text-align: center; position: relative;">
                  <div style="position: absolute; top: -20px; left: -20px; width: 100px; height: 100px; background: radial-gradient(circle, rgba(255,59,59,0.15) 0%, transparent 70%); pointer-events: none;"></div>
                  
                  <h1 style="margin: 0; font-size: 36px; font-weight: 700; letter-spacing: 4px; color: #f5f5f5; line-height: 1.2;">
                    SALA DO<br>
                    <span style="color: #ff3b3b;">TEMPO</span>
                  </h1>
                  <p style="margin: 10px 0 0; font-size: 9px; letter-spacing: 5px; color: #888; text-transform: uppercase;">
                    — 21 DIAS DE EXECUÇÃO —
                  </p>
                  <div style="width: 32px; height: 2px; background-color: #ff3b3b; margin: 24px auto;"></div>
                </td>
              </tr>
              
              <!-- Conteúdo -->
              <tr>
                <td style="padding: 0 40px 40px;">
                  <h2 style="margin: 0 0 20px; font-size: 20px; color: #f5f5f5; font-weight: 600;">
                    Olá, ${nome}!
                  </h2>
                  
                  <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.6; color: #d1d1d1;">
                    Você não entrou aqui por motivação.<br>
                    <strong style="color: #ff3b3b;">Entrou por decisão.</strong>
                  </p>
                  
                  <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.6; color: #d1d1d1;">
                    Seus próximos 21 dias começam agora. A Sala do Tempo está aberta e esperando por você.
                  </p>
                  
                  <!-- Credenciais de acesso -->
                  <div style="background-color: #0a0a0a; border: 1px solid #333; border-radius: 6px; padding: 20px; margin: 24px 0;">
                    <p style="margin: 0 0 12px; font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 2px;">
                      Suas credenciais de acesso:
                    </p>
                    <p style="margin: 0 0 8px; font-size: 14px; color: #f5f5f5;">
                      <strong>Email:</strong> ${to}
                    </p>
                    <p style="margin: 0 0 16px; font-size: 14px; color: #f5f5f5;">
                      <strong>Senha temporária:</strong> <code style="background: #1a1a1a; padding: 4px 8px; border-radius: 4px; color: #ff3b3b;">${senhaTemporaria}</code>
                    </p>
                    <p style="margin: 0; font-size: 12px; color: #888; line-height: 1.5;">
                      ⚠️ Recomendamos que você altere sua senha no primeiro acesso para uma senha pessoal e segura.
                    </p>
                  </div>
                  
                  <!-- CTA Button -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 32px 0;">
                    <tr>
                      <td align="center">
                        <a href="${DOMAIN}/login" style="display: inline-block; background-color: #ff3b3b; color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 4px; font-size: 14px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase;">
                          ENTRAR NA SALA
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin: 24px 0 0; font-size: 13px; line-height: 1.6; color: #888;">
                    O tempo não espera por ninguém.<br>
                    A sua jornada começa agora.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 24px 40px; background-color: #0a0a0a; border-top: 1px solid #222;">
                  <p style="margin: 0; font-size: 11px; color: #666; text-align: center; line-height: 1.5;">
                    Este é um email automático da <strong style="color: #ff3b3b;">Sala do Tempo</strong>.<br>
                    Não responda a este email.
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const text = `
Olá, ${nome}!

Você não entrou aqui por motivação. Entrou por decisão.

Seus próximos 21 dias começam agora. A Sala do Tempo está aberta e esperando por você.

SUAS CREDENCIAIS DE ACESSO:
Email: ${to}
Senha temporária: ${senhaTemporaria}

⚠️ Recomendamos que você altere sua senha no primeiro acesso.

Acesse agora: ${DOMAIN}/login

O tempo não espera por ninguém.
A sua jornada começa agora.

---
Sala do Tempo - 21 Dias de Execução
  `;

  return sendEmail({ to, subject, html, text });
}

/**
 * Email de recuperação de senha
 */
export async function sendPasswordResetEmail(to: string, nome: string, resetLink: string) {
  const subject = '🔐 Recuperação de Senha - Sala do Tempo';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Recuperação de Senha</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1a1a1a; border-radius: 8px; overflow: hidden;">
              
              <!-- Header -->
              <tr>
                <td style="padding: 40px; text-align: center;">
                  <h1 style="margin: 0; font-size: 36px; font-weight: 700; letter-spacing: 4px; color: #f5f5f5; line-height: 1.2;">
                    SALA DO<br>
                    <span style="color: #ff3b3b;">TEMPO</span>
                  </h1>
                  <div style="width: 32px; height: 2px; background-color: #ff3b3b; margin: 24px auto;"></div>
                </td>
              </tr>
              
              <!-- Conteúdo -->
              <tr>
                <td style="padding: 0 40px 40px;">
                  <h2 style="margin: 0 0 20px; font-size: 20px; color: #f5f5f5; font-weight: 600;">
                    Recuperação de Senha
                  </h2>
                  
                  <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.6; color: #d1d1d1;">
                    Olá, ${nome}!
                  </p>
                  
                  <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.6; color: #d1d1d1;">
                    Recebemos uma solicitação para redefinir a senha da sua conta na Sala do Tempo.
                  </p>
                  
                  <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.6; color: #d1d1d1;">
                    Clique no botão abaixo para criar uma nova senha:
                  </p>
                  
                  <!-- CTA Button -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 32px 0;">
                    <tr>
                      <td align="center">
                        <a href="${resetLink}" style="display: inline-block; background-color: #ff3b3b; color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 4px; font-size: 14px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase;">
                          REDEFINIR SENHA
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin: 24px 0 0; font-size: 12px; line-height: 1.6; color: #888;">
                    ⚠️ Se você não solicitou esta recuperação, ignore este email. Sua senha permanecerá inalterada.
                  </p>
                  
                  <p style="margin: 16px 0 0; font-size: 12px; line-height: 1.6; color: #666;">
                    Este link expira em 24 horas.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 24px 40px; background-color: #0a0a0a; border-top: 1px solid #222;">
                  <p style="margin: 0; font-size: 11px; color: #666; text-align: center; line-height: 1.5;">
                    Este é um email automático da <strong style="color: #ff3b3b;">Sala do Tempo</strong>.<br>
                    Não responda a este email.
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const text = `
Recuperação de Senha - Sala do Tempo

Olá, ${nome}!

Recebemos uma solicitação para redefinir a senha da sua conta na Sala do Tempo.

Clique no link abaixo para criar uma nova senha:
${resetLink}

⚠️ Se você não solicitou esta recuperação, ignore este email. Sua senha permanecerá inalterada.

Este link expira em 24 horas.

---
Sala do Tempo - 21 Dias de Execução
  `;

  return sendEmail({ to, subject, html, text });
}

/**
 * Email de marco de 7 dias
 */
export async function send7DayMilestoneEmail(to: string, nome: string) {
  const subject = '🎯 7 Dias Completos - Você Está no Caminho Certo';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>7 Dias Completos</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1a1a1a; border-radius: 8px; overflow: hidden;">
              
              <!-- Header -->
              <tr>
                <td style="padding: 40px; text-align: center;">
                  <h1 style="margin: 0; font-size: 36px; font-weight: 700; letter-spacing: 4px; color: #f5f5f5; line-height: 1.2;">
                    SALA DO<br>
                    <span style="color: #ff3b3b;">TEMPO</span>
                  </h1>
                  <div style="width: 32px; height: 2px; background-color: #ff3b3b; margin: 24px auto;"></div>
                </td>
              </tr>
              
              <!-- Conteúdo -->
              <tr>
                <td style="padding: 0 40px 40px;">
                  <div style="text-align: center; margin-bottom: 32px;">
                    <div style="font-size: 48px; font-weight: 700; color: #ff3b3b; margin-bottom: 8px;">7 DIAS</div>
                    <p style="margin: 0; font-size: 14px; color: #888; letter-spacing: 2px; text-transform: uppercase;">Marco alcançado</p>
                  </div>
                  
                  <h2 style="margin: 0 0 20px; font-size: 20px; color: #f5f5f5; font-weight: 600;">
                    Parabéns, ${nome}!
                  </h2>
                  
                  <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.6; color: #d1d1d1;">
                    Você completou 7 dias na Sala do Tempo. Uma semana inteira de execução consistente.
                  </p>
                  
                  <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.6; color: #d1d1d1;">
                    <strong style="color: #ff3b3b;">Muitos começam. Poucos persistem.</strong>
                  </p>
                  
                  <div style="background-color: #0a0a0a; border-left: 3px solid #ff3b3b; padding: 20px; margin: 24px 0;">
                    <p style="margin: 0; font-size: 15px; line-height: 1.8; color: #f5f5f5; font-style: italic;">
                      "A diferença entre quem sonha e quem realiza está nos 7 dias seguintes aos primeiros 7."
                    </p>
                  </div>
                  
                  <p style="margin: 24px 0 0; font-size: 14px; line-height: 1.6; color: #d1d1d1;">
                    Você já provou que é capaz. Agora, é hora de provar que é imparável.
                  </p>
                  
                  <p style="margin: 16px 0 0; font-size: 14px; line-height: 1.6; color: #d1d1d1;">
                    Restam 14 dias. Continue.
                  </p>
                  
                  <!-- CTA Button -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 32px 0;">
                    <tr>
                      <td align="center">
                        <a href="${DOMAIN}" style="display: inline-block; background-color: #ff3b3b; color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 4px; font-size: 14px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase;">
                          CONTINUAR JORNADA
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 24px 40px; background-color: #0a0a0a; border-top: 1px solid #222;">
                  <p style="margin: 0; font-size: 11px; color: #666; text-align: center; line-height: 1.5;">
                    Este é um email automático da <strong style="color: #ff3b3b;">Sala do Tempo</strong>.<br>
                    Não responda a este email.
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const text = `
7 DIAS COMPLETOS - Você Está no Caminho Certo

Parabéns, ${nome}!

Você completou 7 dias na Sala do Tempo. Uma semana inteira de execução consistente.

Muitos começam. Poucos persistem.

"A diferença entre quem sonha e quem realiza está nos 7 dias seguintes aos primeiros 7."

Você já provou que é capaz. Agora, é hora de provar que é imparável.

Restam 14 dias. Continue.

Acesse: ${DOMAIN}

---
Sala do Tempo - 21 Dias de Execução
  `;

  return sendEmail({ to, subject, html, text });
}

/**
 * Email de conclusão dos 21 dias
 */
export async function sendCompletionEmail(to: string, nome: string) {
  const subject = '🏆 21 DIAS COMPLETOS - Você Venceu a Sala do Tempo';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>21 Dias Completos</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1a1a1a; border-radius: 8px; overflow: hidden;">
              
              <!-- Header -->
              <tr>
                <td style="padding: 40px; text-align: center;">
                  <h1 style="margin: 0; font-size: 36px; font-weight: 700; letter-spacing: 4px; color: #f5f5f5; line-height: 1.2;">
                    SALA DO<br>
                    <span style="color: #ff3b3b;">TEMPO</span>
                  </h1>
                  <div style="width: 32px; height: 2px; background-color: #ff3b3b; margin: 24px auto;"></div>
                </td>
              </tr>
              
              <!-- Conteúdo -->
              <tr>
                <td style="padding: 0 40px 40px;">
                  <div style="text-align: center; margin-bottom: 32px;">
                    <div style="font-size: 72px; margin-bottom: 16px;">🏆</div>
                    <div style="font-size: 48px; font-weight: 700; color: #ff3b3b; margin-bottom: 8px;">21 DIAS</div>
                    <p style="margin: 0; font-size: 14px; color: #888; letter-spacing: 2px; text-transform: uppercase;">Desafio Completo</p>
                  </div>
                  
                  <h2 style="margin: 0 0 20px; font-size: 24px; color: #f5f5f5; font-weight: 700; text-align: center;">
                    PARABÉNS, ${nome.toUpperCase()}!
                  </h2>
                  
                  <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.6; color: #d1d1d1; text-align: center;">
                    Você não apenas entrou na Sala do Tempo.<br>
                    <strong style="color: #ff3b3b; font-size: 16px;">Você venceu.</strong>
                  </p>
                  
                  <div style="background-color: #0a0a0a; border: 2px solid #ff3b3b; border-radius: 6px; padding: 24px; margin: 32px 0;">
                    <p style="margin: 0 0 16px; font-size: 13px; color: #888; text-transform: uppercase; letter-spacing: 2px; text-align: center;">
                      O que você conquistou:
                    </p>
                    <ul style="margin: 0; padding: 0; list-style: none;">
                      <li style="margin: 0 0 12px; font-size: 14px; color: #f5f5f5; padding-left: 24px; position: relative;">
                        <span style="position: absolute; left: 0; color: #ff3b3b;">✓</span>
                        21 dias de execução consistente
                      </li>
                      <li style="margin: 0 0 12px; font-size: 14px; color: #f5f5f5; padding-left: 24px; position: relative;">
                        <span style="position: absolute; left: 0; color: #ff3b3b;">✓</span>
                        Disciplina forjada na prática
                      </li>
                      <li style="margin: 0 0 12px; font-size: 14px; color: #f5f5f5; padding-left: 24px; position: relative;">
                        <span style="position: absolute; left: 0; color: #ff3b3b;">✓</span>
                        Controle total do seu tempo
                      </li>
                      <li style="margin: 0; font-size: 14px; color: #f5f5f5; padding-left: 24px; position: relative;">
                        <span style="position: absolute; left: 0; color: #ff3b3b;">✓</span>
                        Prova de que você é capaz
                      </li>
                    </ul>
                  </div>
                  
                  <div style="background-color: #0a0a0a; border-left: 3px solid #ff3b3b; padding: 20px; margin: 24px 0;">
                    <p style="margin: 0; font-size: 15px; line-height: 1.8; color: #f5f5f5; font-style: italic;">
                      "A Sala do Tempo não transforma pessoas.<br>
                      Ela revela quem você sempre foi capaz de ser."
                    </p>
                  </div>
                  
                  <p style="margin: 24px 0 0; font-size: 14px; line-height: 1.6; color: #d1d1d1;">
                    Estes 21 dias foram apenas o começo. Você construiu o hábito, forjou a disciplina e provou seu valor.
                  </p>
                  
                  <p style="margin: 16px 0 0; font-size: 14px; line-height: 1.6; color: #d1d1d1;">
                    <strong style="color: #ff3b3b;">O que você faz com isso agora?</strong><br>
                    Essa é a pergunta que separa os que completam dos que transformam.
                  </p>
                  
                  <!-- CTA Button -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 32px 0;">
                    <tr>
                      <td align="center">
                        <a href="${DOMAIN}" style="display: inline-block; background-color: #ff3b3b; color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 4px; font-size: 14px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase;">
                          VER MEU PROGRESSO
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin: 32px 0 0; font-size: 13px; line-height: 1.6; color: #888; text-align: center;">
                    A guerra nunca termina.<br>
                    Mas hoje, você venceu uma batalha decisiva.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 24px 40px; background-color: #0a0a0a; border-top: 1px solid #222;">
                  <p style="margin: 0; font-size: 11px; color: #666; text-align: center; line-height: 1.5;">
                    Este é um email automático da <strong style="color: #ff3b3b;">Sala do Tempo</strong>.<br>
                    Não responda a este email.
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const text = `
🏆 21 DIAS COMPLETOS - Você Venceu a Sala do Tempo

PARABÉNS, ${nome.toUpperCase()}!

Você não apenas entrou na Sala do Tempo.
Você venceu.

O QUE VOCÊ CONQUISTOU:
✓ 21 dias de execução consistente
✓ Disciplina forjada na prática
✓ Controle total do seu tempo
✓ Prova de que você é capaz

"A Sala do Tempo não transforma pessoas.
Ela revela quem você sempre foi capaz de ser."

Estes 21 dias foram apenas o começo. Você construiu o hábito, forjou a disciplina e provou seu valor.

O que você faz com isso agora?
Essa é a pergunta que separa os que completam dos que transformam.

Acesse: ${DOMAIN}

A guerra nunca termina.
Mas hoje, você venceu uma batalha decisiva.

---
Sala do Tempo - 21 Dias de Execução
  `;

  return sendEmail({ to, subject, html, text });
}
