@echo off
echo ========================================
echo  SALA DO TEMPO 21 - INSTALACAO RAPIDA
echo ========================================
echo.

echo [1/4] Instalando dependencias...
call npm install
if errorlevel 1 (
    echo ERRO: Falha ao instalar dependencias
    pause
    exit /b 1
)
echo.

echo [2/4] Verificando arquivo .env.local...
if not exist .env.local (
    echo AVISO: Arquivo .env.local nao encontrado
    echo Copiando .env.local.example para .env.local...
    copy .env.local.example .env.local
    echo.
    echo IMPORTANTE: Edite o arquivo .env.local e adicione suas credenciais do Supabase
    echo Pressione qualquer tecla para abrir o arquivo...
    pause >nul
    start notepad .env.local
    echo.
)
echo.

echo [3/4] Verificando estrutura de pastas...
if not exist "public\icon-192.png" (
    echo AVISO: Icones do PWA nao encontrados
    echo Leia o arquivo ICONES.md para instrucoes
    echo.
)
echo.

echo [4/4] Instalacao concluida!
echo.
echo ========================================
echo  PROXIMOS PASSOS:
echo ========================================
echo 1. Configure o Supabase (leia DEPLOY.md)
echo 2. Edite .env.local com suas credenciais
echo 3. Crie os icones do PWA (leia ICONES.md)
echo 4. Execute: npm run dev
echo 5. Acesse: http://localhost:3000
echo.
echo Leia PROXIMOS_PASSOS.md para mais detalhes
echo ========================================
echo.
pause
