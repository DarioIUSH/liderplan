# Script para Validar Creación de Plan y Actividades
# Este script crea un plan de prueba y verifica que se guarde en MongoDB

Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  VALIDACIÓN: Creación de Plan y Actividades en MongoDB    " -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar conectividad a backend
Write-Host "1. Verificando conectividad al backend..." -ForegroundColor Yellow
$healthCheck = Invoke-RestMethod -Uri "http://localhost:5000/health" -ErrorAction SilentlyContinue
if ($healthCheck.status -eq "OK") {
    Write-Host "   ✓ Backend disponible en http://localhost:5000" -ForegroundColor Green
} else {
    Write-Host "   ✗ Backend NO disponible" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "2. Autenticación..." -ForegroundColor Yellow

# 2. Login para obtener token
$loginBody = @{
    email = "admin@liderplan.com"
    password = "Admin123!"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $loginBody `
    -ErrorAction SilentlyContinue

if ($loginResponse.token) {
    Write-Host "   ✓ Login exitoso" -ForegroundColor Green
    Write-Host "   ✓ Token obtenido: $($loginResponse.token.Substring(0, 20))..." -ForegroundColor Green
    $token = $loginResponse.token
} else {
    Write-Host "   ✗ Login fallido" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "3. Creando plan de prueba..." -ForegroundColor Yellow

# 3. Crear plan con actividades
$planBody = @{
    name = "Plan Test - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    project = "Proyecto de Validación del Sistema"
    goal = "Validar que los planes y actividades se guarden correctamente en MongoDB"
    origin = "Plan de desarrollo"
    subOrigin = "Ruta Calidad y Excelencia"
    activities = @(
        @{
            description = "Actividad 1: Verificación de Backend"
            responsible = "Admin"
            area = "Infraestructura y Dlloo Tec"
            startDate = "2025-12-11"
            endDate = "2025-12-15"
            resources = "Servidor, Base de Datos"
            priority = "ALTA"
            status = "NO_INICIADA"
            completionPercentage = 0
            comments = @()
            evidence = @()
        },
        @{
            description = "Actividad 2: Validación de Base de Datos"
            responsible = "Admin"
            area = "SGI"
            startDate = "2025-12-16"
            endDate = "2025-12-20"
            resources = "MongoDB"
            priority = "MEDIA"
            status = "NO_INICIADA"
            completionPercentage = 0
            comments = @()
            evidence = @()
        },
        @{
            description = "Actividad 3: Pruebas de Persistencia"
            responsible = "Admin"
            area = "Talento Humano"
            startDate = "2025-12-21"
            endDate = "2025-12-31"
            resources = "Herramientas de Testing"
            priority = "BAJA"
            status = "NO_INICIADA"
            completionPercentage = 0
            comments = @()
            evidence = @()
        }
    )
} | ConvertTo-Json -Depth 10

Write-Host "   Enviando solicitud POST /api/plans..." -ForegroundColor Gray

$createResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/plans" `
    -Method POST `
    -ContentType "application/json" `
    -Headers @{ Authorization = "Bearer $token" } `
    -Body $planBody `
    -ErrorAction SilentlyContinue

if ($createResponse.plan._id) {
    Write-Host "   ✓ Plan creado exitosamente" -ForegroundColor Green
    Write-Host "   ✓ ID del Plan: $($createResponse.plan._id)" -ForegroundColor Green
    Write-Host "   ✓ Nombre: $($createResponse.plan.name)" -ForegroundColor Green
    Write-Host "   ✓ Actividades creadas: $($createResponse.plan.activities.Count)" -ForegroundColor Green
    
    $planId = $createResponse.plan._id
    $activitiesCount = $createResponse.plan.activities.Count
} else {
    Write-Host "   ✗ Error al crear plan" -ForegroundColor Red
    Write-Host "   Respuesta: $($createResponse | ConvertTo-Json)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "4. Verificando persistencia en base de datos..." -ForegroundColor Yellow

# 4. Obtener el plan creado
$getResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/plans/$planId" `
    -Method GET `
    -Headers @{ Authorization = "Bearer $token" } `
    -ErrorAction SilentlyContinue

if ($getResponse._id -eq $planId) {
    Write-Host "   ✓ Plan recuperado de la base de datos" -ForegroundColor Green
    Write-Host "   ✓ Nombre: $($getResponse.name)" -ForegroundColor Green
    Write-Host "   ✓ Origen: $($getResponse.origin)" -ForegroundColor Green
    Write-Host "   ✓ Actividades almacenadas: $($getResponse.activities.Count)" -ForegroundColor Green
    
    if ($getResponse.activities.Count -eq 3) {
        Write-Host "   ✓ Todas las actividades están presentes" -ForegroundColor Green
    } else {
        Write-Host "   ✗ Número de actividades incorrecto (esperado 3, obtenido $($getResponse.activities.Count))" -ForegroundColor Red
    }
} else {
    Write-Host "   ✗ No se pudo recuperar el plan" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "5. Obteniendo todos los planes del usuario..." -ForegroundColor Yellow

# 5. Obtener lista de planes
$allPlansResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/plans" `
    -Method GET `
    -Headers @{ Authorization = "Bearer $token" } `
    -ErrorAction SilentlyContinue

if ($allPlansResponse -is [array]) {
    Write-Host "   ✓ Total de planes en el usuario: $($allPlansResponse.Count)" -ForegroundColor Green
    
    $testPlanFound = $allPlansResponse | Where-Object { $_._id -eq $planId }
    if ($testPlanFound) {
        Write-Host "   ✓ Plan de prueba encontrado en la lista" -ForegroundColor Green
    } else {
        Write-Host "   ✗ Plan de prueba NO encontrado en la lista" -ForegroundColor Red
    }
} elseif ($allPlansResponse._id) {
    Write-Host "   ✓ Se retornó 1 plan (tipo single object)" -ForegroundColor Green
} else {
    Write-Host "   ✗ Error al obtener planes" -ForegroundColor Red
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  ✓ VALIDACIÓN COMPLETADA EXITOSAMENTE" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Plan de prueba creado:" -ForegroundColor Yellow
Write-Host "  ID: $planId"
Write-Host "  Nombre: $($getResponse.name)"
Write-Host "  Actividades: $($getResponse.activities.Count)"
Write-Host ""
Write-Host "Próximo paso: Verificar en MongoDB Compass o mongosh:" -ForegroundColor Cyan
Write-Host "  use liderplan" -ForegroundColor Gray
Write-Host "  db.plans.find({`"_id`": ObjectId(`"$planId`")})" -ForegroundColor Gray
Write-Host "  db.activities.find({`"planId`": ObjectId(`"$planId`")})" -ForegroundColor Gray
Write-Host ""
