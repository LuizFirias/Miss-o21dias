# Script de teste local do webhook Cakto
# Execute com: .\test-webhook.ps1

Write-Host "`n🧪 TESTE DO WEBHOOK CAKTO`n" -ForegroundColor Cyan

# Verificar se app está rodando
Write-Host "📋 Passo 1: Verificando se app está rodando em http://localhost:3000..." -ForegroundColor Yellow
try {
    $health = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ App está rodando!`n" -ForegroundColor Green
} catch {
    Write-Host "❌ ERRO: App não está rodando!" -ForegroundColor Red
    Write-Host "Execute 'npm run dev' em outro terminal e tente novamente.`n" -ForegroundColor Red
    exit 1
}

# Teste 1: GET deve retornar 405
Write-Host "📋 Passo 2: Testando GET (deve retornar 405)..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri "http://localhost:3000/api/webhook-cakto" -Method GET -ErrorAction Stop
    Write-Host "❌ Erro: Deveria retornar 405!`n" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 405) {
        Write-Host "✅ GET retornou 405 (Method not allowed) corretamente!`n" -ForegroundColor Green
    } else {
        Write-Host "❌ Erro inesperado: $($_.Exception.Message)`n" -ForegroundColor Red
        Write-Host "Detalhes: $($_.Exception.Response.StatusCode)`n" -ForegroundColor Gray
    }
}

# Teste 2: POST com assinatura válida
Write-Host "📋 Passo 3: Testando POST com assinatura válida..." -ForegroundColor Yellow

$secret = "eaa8e41f-ad47-4f95-9edc-9eeec0d51461"
$randomNum = Get-Random
$email = "teste.$randomNum@exemplo.com"
$testId = "test_$randomNum"

# Criar payload JSON
$payloadObj = @{
    event = "sale.approved"
    data = @{
        id = $testId
        customer = @{
            email = $email
            name = "João Teste"
        }
        amount = 4700
        status = "approved"
        created_at = "2026-04-26T15:30:00Z"
        order_bumps = @(
            @{
                id = "1"
                name = "Modo Guerra (Acesso Oculto)"
                amount = 1700
            }
        )
    }
}

$payload = $payloadObj | ConvertTo-Json -Depth 10 -Compress

# Calcular assinatura HMAC SHA256
$hmac = [System.Security.Cryptography.HMACSHA256]::new([System.Text.Encoding]::UTF8.GetBytes($secret))
$hash = $hmac.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($payload))
$signature = [System.BitConverter]::ToString($hash).Replace('-','').ToLower()

Write-Host "Email de teste: $email" -ForegroundColor Gray
Write-Host "Assinatura: $signature`n" -ForegroundColor Gray

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/webhook-cakto" `
        -Method POST `
        -Headers @{
            "Content-Type" = "application/json"
            "x-cakto-signature" = $signature
        } `
        -Body $payload `
        -ErrorAction Stop

    $result = $response.Content | ConvertFrom-Json
    
    Write-Host "✅ Webhook processado com sucesso!`n" -ForegroundColor Green
    Write-Host "📊 Resposta:" -ForegroundColor Cyan
    Write-Host ($result | ConvertTo-Json -Depth 3) -ForegroundColor White
    Write-Host ""
    
    if ($result.success) {
        Write-Host "✅ Usuário criado: $($result.userId)" -ForegroundColor Green
        Write-Host "✅ Email: $($result.email)" -ForegroundColor Green
        Write-Host "✅ Order Bumps:" -ForegroundColor Green
        Write-Host "   - Modo Guerra: $($result.orderBumps.modo_guerra_acesso)" -ForegroundColor White
        Write-Host "   - Continuidade: $($result.orderBumps.continuidade_30dias)" -ForegroundColor White
        Write-Host "   - Disparo Rápido: $($result.orderBumps.disparo_rapido_acesso)" -ForegroundColor White
        Write-Host ""
    }
    
} catch {
    Write-Host "❌ Erro ao processar webhook:`n" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "`n📄 Corpo da resposta:" -ForegroundColor Yellow
        Write-Host $responseBody -ForegroundColor White
    }
    Write-Host ""
    exit 1
}

# Teste 3: POST sem assinatura (deve falhar)
Write-Host "📋 Passo 4: Testando POST sem assinatura (deve retornar 401)..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri "http://localhost:3000/api/webhook-cakto" `
        -Method POST `
        -Headers @{"Content-Type" = "application/json"} `
        -Body $payload `
        -ErrorAction Stop
    
    Write-Host "❌ Erro: Deveria retornar 401!`n" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ POST sem assinatura retornou 401 (Unauthorized) corretamente!`n" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Status inesperado: $($_.Exception.Response.StatusCode)`n" -ForegroundColor Yellow
    }
}

# Resumo
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🎉 TESTES CONCLUÍDOS" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Cyan

Write-Host "✅ Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Verificar se usuário foi criado no Supabase Auth" -ForegroundColor White
Write-Host "2. Verificar se perfil foi criado na tabela 'usuarios'" -ForegroundColor White
Write-Host "3. Verificar se email foi recebido ($email)" -ForegroundColor White
Write-Host "4. Testar login com as credenciais do email`n" -ForegroundColor White

Write-Host "🔍 Query SQL para verificar:" -ForegroundColor Cyan
Write-Host "SELECT * FROM usuarios WHERE email = '$email';`n" -ForegroundColor Gray
