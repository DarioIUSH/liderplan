#!/usr/bin/env pwsh

# Script de prueba del Gestor de Usuarios
# Ejecutar: .\test-user-management.ps1

$API = "http://localhost:5000/api"
$adminEmail = "admin@test.com"
$adminPassword = "admin123"
$leaderEmail = "leader@test.com"
$leaderPassword = "leader123"

Write-Host "🚀 Iniciando pruebas del Gestor de Usuarios..." -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

# 1. Registrar usuario ADMIN
Write-Host "`n1️⃣  Registrando usuario ADMIN..." -ForegroundColor Yellow
$registerBody = @{
    email = $adminEmail
    password = $adminPassword
    fullName = "Administrador Test"
    role = "ADMIN"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-WebRequest -Uri "$API/auth/register" `
        -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body $registerBody
    
    $adminData = $registerResponse.Content | ConvertFrom-Json
    $adminToken = $adminData.token
    
    Write-Host "✅ ADMIN creado exitosamente" -ForegroundColor Green
    Write-Host "   Token: $($adminToken.Substring(0,20))..." -ForegroundColor Gray
} catch {
    Write-Host "❌ Error registrando ADMIN: $_" -ForegroundColor Red
    exit 1
}

# 2. Registrar usuario LEADER
Write-Host "`n2️⃣  Registrando usuario LEADER..." -ForegroundColor Yellow
$registerBody = @{
    email = $leaderEmail
    password = $leaderPassword
    fullName = "Líder Test"
    role = "LEADER"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-WebRequest -Uri "$API/auth/register" `
        -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body $registerBody
    
    $leaderData = $registerResponse.Content | ConvertFrom-Json
    $leaderToken = $leaderData.token
    
    Write-Host "✅ LEADER creado exitosamente" -ForegroundColor Green
    Write-Host "   Email: $leaderEmail" -ForegroundColor Gray
} catch {
    Write-Host "❌ Error registrando LEADER: $_" -ForegroundColor Red
    exit 1
}

# 3. Crear usuario TEAM como ADMIN
Write-Host "`n3️⃣  Creando usuario TEAM como ADMIN..." -ForegroundColor Yellow
$createBody = @{
    email = "team@test.com"
    password = "team123"
    fullName = "Miembro del Equipo Test"
    role = "TEAM"
} | ConvertTo-Json

try {
    $createResponse = Invoke-WebRequest -Uri "$API/users/create" `
        -Method POST `
        -Headers @{
            "Content-Type" = "application/json"
            "Authorization" = "Bearer $adminToken"
        } `
        -Body $createBody
    
    $teamData = $createResponse.Content | ConvertFrom-Json
    $teamUserId = $teamData.user.id
    
    Write-Host "✅ Usuario TEAM creado exitosamente" -ForegroundColor Green
    Write-Host "   ID: $teamUserId" -ForegroundColor Gray
} catch {
    Write-Host "❌ Error creando usuario TEAM: $_" -ForegroundColor Red
}

# 4. Obtener todos los usuarios (solo ADMIN)
Write-Host "`n4️⃣  Obteniendo lista de todos los usuarios (como ADMIN)..." -ForegroundColor Yellow
try {
    $allUsersResponse = Invoke-WebRequest -Uri "$API/users/all" `
        -Method GET `
        -Headers @{"Authorization" = "Bearer $adminToken"}
    
    $allUsersData = $allUsersResponse.Content | ConvertFrom-Json
    
    Write-Host "✅ Se obtuvieron $($allUsersData.total) usuarios" -ForegroundColor Green
    foreach ($user in $allUsersData.users) {
        Write-Host "   - $($user.fullName) ($($user.role)) - $($user.email)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Error obteniendo usuarios: $_" -ForegroundColor Red
}

# 5. Obtener usuarios por rol
Write-Host "`n5️⃣  Obteniendo usuarios por rol (LEADER)..." -ForegroundColor Yellow
try {
    $leaderResponse = Invoke-WebRequest -Uri "$API/users/role/LEADER" `
        -Method GET `
        -Headers @{"Authorization" = "Bearer $adminToken"}
    
    $leaderData = $leaderResponse.Content | ConvertFrom-Json
    
    Write-Host "✅ Se encontraron $($leaderData.total) usuarios con rol LEADER" -ForegroundColor Green
} catch {
    Write-Host "❌ Error obteniendo usuarios por rol: $_" -ForegroundColor Red
}

# 6. Cambiar rol de usuario
Write-Host "`n6️⃣  Cambiando rol de usuario TEAM a LEADER..." -ForegroundColor Yellow
$changeRoleBody = @{
    newRole = "LEADER"
} | ConvertTo-Json

try {
    $changeResponse = Invoke-WebRequest -Uri "$API/users/$teamUserId/role" `
        -Method PATCH `
        -Headers @{
            "Content-Type" = "application/json"
            "Authorization" = "Bearer $adminToken"
        } `
        -Body $changeRoleBody
    
    $changeData = $changeResponse.Content | ConvertFrom-Json
    
    Write-Host "✅ Rol actualizado de $($changeData.user.previousRole) a $($changeData.user.newRole)" -ForegroundColor Green
} catch {
    Write-Host "❌ Error cambiando rol: $_" -ForegroundColor Red
}

# 7. Obtener usuario actual
Write-Host "`n7️⃣  Obteniendo usuario actual (como LEADER)..." -ForegroundColor Yellow
try {
    $meResponse = Invoke-WebRequest -Uri "$API/users/me" `
        -Method GET `
        -Headers @{"Authorization" = "Bearer $leaderToken"}
    
    $meData = $meResponse.Content | ConvertFrom-Json
    
    Write-Host "✅ Usuario actual obtenido" -ForegroundColor Green
    Write-Host "   Nombre: $($meData.fullName)" -ForegroundColor Gray
    Write-Host "   Email: $($meData.email)" -ForegroundColor Gray
    Write-Host "   Rol: $($meData.role)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Error obteniendo usuario actual: $_" -ForegroundColor Red
}

# 8. Intentar crear usuario como LEADER (debe fallar)
Write-Host "`n8️⃣  Intentando crear usuario como LEADER (debe ser rechazado)..." -ForegroundColor Yellow
$createBody = @{
    email = "test@test.com"
    password = "test123"
    fullName = "Usuario Test"
    role = "TEAM"
} | ConvertTo-Json

try {
    $createResponse = Invoke-WebRequest -Uri "$API/users/create" `
        -Method POST `
        -Headers @{
            "Content-Type" = "application/json"
            "Authorization" = "Bearer $leaderToken"
        } `
        -Body $createBody -ErrorAction Stop
    
    Write-Host "❌ ERROR: Un LEADER no debería poder crear usuarios" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 403) {
        Write-Host "✅ Acceso denegado (esperado)" -ForegroundColor Green
        Write-Host "   Mensaje: $(($_.ErrorDetails.Message | ConvertFrom-Json).message)" -ForegroundColor Gray
    } else {
        Write-Host "❌ Error inesperado: $_" -ForegroundColor Red
    }
}

Write-Host "`n================================================" -ForegroundColor Cyan
Write-Host "✅ Pruebas completadas!" -ForegroundColor Cyan
Write-Host "`n📊 Resumen:" -ForegroundColor Green
Write-Host "✓ Registro de usuarios con roles" -ForegroundColor Green
Write-Host "✓ Creación de usuarios como ADMIN" -ForegroundColor Green
Write-Host "✓ Listar todos los usuarios" -ForegroundColor Green
Write-Host "✓ Filtrar por rol" -ForegroundColor Green
Write-Host "✓ Cambiar roles de usuarios" -ForegroundColor Green
Write-Host "✓ Validación de permisos" -ForegroundColor Green
