# 🔐 Sistema de Autenticação - Sala do Tempo 21

## ⚠️ ATUALIZAÇÃO: Senha de Acesso Removida

A senha de acesso compartilhada (`SALA21GUERRA`) foi **removida** do sistema.

## 🆕 Novo Sistema de Autenticação

Agora o app usa **apenas senha pessoal** para cada usuário:

### Login de Usuários:
- **Email**: O email cadastrado após a compra
- **Senha**: Senha pessoal criada pelo próprio usuário
- **Recuperar senha**: Disponível caso o usuário esqueça

### Como Funciona:

1. **Após a compra**, o cliente recebe um link para criar sua conta
2. O usuário cria sua senha pessoal (mínimo 6 caracteres)
3. O usuário recebe email de confirmação do Supabase
4. Após confirmar, pode fazer login normalmente

## 📝 Para Cadastrar Novos Usuários

Consulte o arquivo [CADASTRO_USUARIOS.md](./CADASTRO_USUARIOS.md) para detalhes completos sobre:
- Como cadastrar usuários após a compra
- Integração com plataformas de venda
- Configuração de APIs no Vercel
- Templates de email

## Fluxo Completo

```
Compra → Cadastro (email + senha) → Confirmação por Email → Login → Onboarding → Home
```

## Segurança

✅ **Vantagens do novo sistema:**
- Cada usuário tem senha única e pessoal
- Não existe senha compartilhada que pode vazar
- Recuperação de senha disponível
- Apenas quem comprou pode criar conta
- Sistema padrão do Supabase Auth

## Design da Tela de Login

✅ **Tela de Login simplificada**:
- Campo de email
- Campo de senha pessoal
- Botão "ENTRAR"
- Link "Recuperar senha"
- Glow vermelho no canto superior esquerdo
- Logo "SALA DO TEMPO" (Bebas Neue, 36px, tracking 4px)
- Subtítulo "— 21 DIAS DE EXECUÇÃO —" (Share Tech Mono, 9px)
- Divider vermelho horizontal (32px)
- Frase motivacional com destaque em cinza dim
- Input de email + senha
- Botão "ENTRAR" vermelho
- Info "ACESSO EXCLUSIVO PARA MEMBROS"

✅ **Tela de Onboarding** - 2 steps com design correto:
- **Step 1:** Escolha de modo (Normal/Guerra)
- **Step 2:** Escolha de nível (Iniciante/Intermediário/Avançado)
- Step indicator com dots vermelhos
- Radio buttons customizados
- Animações suaves

## Próximos Passos Recomendados

Para implementação profissional:

1. **Backend Validation:**
   - Criar Supabase Edge Function
   - Validar senha no servidor
   - Gerar tokens únicos por cliente

2. **Integração com Pagamento:**
   - Hotmart webhook
   - Gerar código único após compra
   - Enviar por email automaticamente

3. **Dashboard Admin:**
   - Ver usuários ativos
   - Gerenciar códigos de acesso
   - Estatísticas de uso
