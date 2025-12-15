#!/usr/bin/env pwsh
# Validar que nueva actividad se guarde en plan existente

$loginBody = @{
    email = "admin@liderplan.com"
    password = "Admin123!"
} | ConvertTo-Json

Write-Host "1. Autenticando..." -ForegroundColor Yellow
$loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody -ErrorAction SilentlyContinue

if ($loginResponse.token) {
    Write-Host "Checkmark Login exitoso" -ForegroundColor Green
    $token = $loginResponse.token
    
    Write-Host ""
    Write-Host "2. Obteniendo planes..." -ForegroundColor Yellow
    $plansResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/plans" -Method GET -Headers @{ Authorization = "Bearer $token" } -ErrorAction SilentlyContinue
    
    if ($plansResponse -is [array]) {
        $planList = $plansResponse
    } else {
        $planList = @($plansResponse)
    }
    
    Write-Host "Total de planes: $($planList.Count)" -ForegroundColor Gray
    
    # Encontrar plan con 2 actividades
    $targetPlan = $planList | Where-Object { $_.activities.Count -eq 2 } | Select-Object -First 1
    
    if ($targetPlan) {
        Write-Host "Checkmark Plan encontrado: $($targetPlan.name)" -ForegroundColor Green
        Write-Host "  Actividades: $($targetPlan.activities.Count)" -ForegroundColor Gray
        
        $planId = $targetPlan._id
        
        Write-Host ""
        Write-Host "3. Obteniendo detalles completos..." -ForegroundColor Yellow
        $planDetails = Invoke-RestMethod -Uri "http://localhost:5000/api/plans/$planId" -Method GET -Headers @{ Authorization = "Bearer $token" } -ErrorAction SilentlyContinue
        
        Write-Host "Actividades actuales:" -ForegroundColor Gray
        $planDetails.activities | ForEach-Object { 
            Write-Host "  - $($_.description)" -ForegroundColor Gray
        }
        
        Write-Host ""
        Write-Host "4. Agregando nueva actividad..." -ForegroundColor Yellow
        
        $newActivity = @{
            description = "NUEVA ACTIVIDAD - Test $(Get-Date -Format 'HH:mm:ss')"
            responsible = "Sistema"
            area = "SGI"
            startDate = "2025-12-25"
            endDate = "2025-12-31"
            resources = "Validacion"
            priority = "ALTA"
            status = "NO_INICIADA"
            completionPercentage = 0
            comments = @()
            evidence = @()
        }
        
        $newActivities = @($planDetails.activities) + @($newActivity)
        
        $updateBody = @{
            name = $planDetails.name
            project = $planDetails.project
            goal = $planDetails.goal
            origin = $planDetails.origin
            subOrigin = $planDetails.subOrigin
            activities = $newActivities
        } | ConvertTo-Json -Depth 10
        
        $updateResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/plans/$planId" -Method PUT -ContentType "application/json" -Headers @{ Authorization = "Bearer $token" } -Body $updateBody -ErrorAction SilentlyContinue
        
        if ($updateResponse.plan.activities.Count -eq 3) {
            Write-Host "Checkmark Actividad agregada" -ForegroundColor Green
            Write-Host "Checkmark Total ahora: $($updateResponse.plan.activities.Count)" -ForegroundColor Green
            
            Write-Host ""
            Write-Host "5. Verificando persistencia..." -ForegroundColor Yellow
            $verifyResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/plans/$planId" -Method GET -Headers @{ Authorization = "Bearer $token" } -ErrorAction SilentlyContinue
            
            Write-Host "Actividades guardadas en BD:" -ForegroundColor Gray
            $verifyResponse.activities | ForEach-Object { 
                Write-Host "  - [$($_.priority)] $($_.description)" -ForegroundColor Gray
            }
            
            if ($verifyResponse.activities.Count -eq 3) {
                Write-Host ""
                Write-Host "================================================================" -ForegroundColor Green
                Write-Host "Checkmark VALIDACION EXITOSA" -ForegroundColor Green
                Write-Host "  La nueva actividad esta guardada en MongoDB" -ForegroundColor Green
                Write-Host "================================================================" -ForegroundColor Green
            }
        } else {
            Write-Host "Error al agregar actividad" -ForegroundColor Red
        }
    } else {
        Write-Host "Error No se encontro plan con 2 actividades" -ForegroundColor Red
        Write-Host "Planes disponibles:" -ForegroundColor Yellow
        $planList | ForEach-Object { Write-Host "  - $($_.name): $($_.activities.Count) actividades" }
    }
} else {
    Write-Host "Error en login" -ForegroundColor Red
}
