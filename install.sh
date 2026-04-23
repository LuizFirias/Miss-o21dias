#!/bin/bash

echo "========================================"
echo " SALA DO TEMPO 21 - INSTALAÇÃO RÁPIDA"
echo "========================================"
echo ""

echo "[1/4] Instalando dependências..."
npm install
if [ $? -ne 0 ]; then
    echo "ERRO: Falha ao instalar dependências"
    exit 1
fi
echo ""

echo "[2/4] Verificando arquivo .env.local..."
if [ ! -f .env.local ]; then
    echo "AVISO: Arquivo .env.local não encontrado"
    echo "Copiando .env.local.example para .env.local..."
    cp .env.local.example .env.local
    echo ""
    echo "IMPORTANTE: Edite o arquivo .env.local e adicione suas credenciais do Supabase"
    echo ""
fi
echo ""

echo "[3/4] Verificando estrutura de pastas..."
if [ ! -f "public/icon-192.png" ]; then
    echo "AVISO: Ícones do PWA não encontrados"
    echo "Leia o arquivo ICONES.md para instruções"
    echo ""
fi
echo ""

echo "[4/4] Instalação concluída!"
echo ""
echo "========================================"
echo " PRÓXIMOS PASSOS:"
echo "========================================"
echo "1. Configure o Supabase (leia DEPLOY.md)"
echo "2. Edite .env.local com suas credenciais"
echo "3. Crie os ícones do PWA (leia ICONES.md)"
echo "4. Execute: npm run dev"
echo "5. Acesse: http://localhost:3000"
echo ""
echo "Leia PROXIMOS_PASSOS.md para mais detalhes"
echo "========================================"
echo ""
