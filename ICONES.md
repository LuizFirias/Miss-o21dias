# INSTRUÇÕES PARA ÍCONES DO PWA

Para completar a configuração do PWA, você precisa criar os ícones do aplicativo:

## Opção 1: Criar manualmente

Crie duas imagens PNG com as seguintes especificações:

1. **icon-192.png** (192x192 pixels)
   - Fundo preto (#0D0D0D)
   - Logo/símbolo vermelho (#FF3B3B)
   - Design minimalista, estilo militar/anime

2. **icon-512.png** (512x512 pixels)
   - Mesmas especificações do 192px
   - Maior resolução

Coloque os arquivos na pasta `public/`.

## Opção 2: Usar gerador online

1. Acesse: https://realfavicongenerator.net/
2. Faça upload de uma imagem base (recomendo 512x512)
3. Configure:
   - iOS: Fundo preto
   - Android: Fundo preto
4. Baixe o pacote
5. Copie os arquivos para `public/`

## Opção 3: Usar ferramenta CLI

```bash
npm install -g pwa-asset-generator
pwa-asset-generator logo.svg public -i ./public/index.html -m ./public/manifest.json
```

## Design sugerido

O ícone deve ter uma estética:
- **Dark**: fundo preto absoluto
- **Vermelho**: elemento principal em vermelho (#FF3B3B)
- **Minimalista**: número 21 estilizado OU símbolo de força/disciplina
- **Anime/Militar**: inspiração visual conforme especificação

## Favicon

Além dos ícones PWA, crie também:
- **favicon.ico** (32x32) na pasta `public/`
- **apple-touch-icon.png** (180x180) na pasta `public/`

## Depois de criar

Teste o PWA:
1. Build: `npm run build`
2. Start: `npm start`
3. Abra Chrome DevTools > Application > Manifest
4. Verifique se todos os ícones aparecem corretamente
