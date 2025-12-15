# 🚀 QUICK START - GESTOR DE USUARIOS

## ⚡ 5 Minutos para Empezar

### 1. El proyecto ya está corriendo ✅
```
Backend:  http://localhost:5000
Frontend: http://localhost:3000
MongoDB:  Conectado localmente
```

### 2. Crear primer usuario (ADMIN)
```powershell
# PowerShell
$body = @{
    email = "admin@empresa.com"
    password = "admin123"
    fullName = "Administrador"
    role = "ADMIN"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/auth/register" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

**Respuesta:**
```json
{
  "message": "Usuario registrado exitosamente",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "admin@empresa.com",
    "fullName": "Administrador",
    "role": "ADMIN"
  }
}
```

### 3. Guardar el token
```powershell
$token = "eyJhbGciOiJIUzI1NiIs..." # El token de arriba
```

### 4. Crear usuario LEADER como ADMIN
```powershell
$body = @{
    email = "lider@empresa.com"
    password = "leader123"
    fullName = "Líder Proyecto"
    role = "LEADER"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/users/create" `
  -Method POST `
  -Headers @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $token"
  } `
  -Body $body
```

### 5. Ver todos los usuarios
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/users/all" `
  -Method GET `
  -Headers @{"Authorization" = "Bearer $token"} | Select-Object -ExpandProperty Content | ConvertFrom-Json | Format-Table
```

### 6. Cambiar rol de usuario
```powershell
$userId = "id_del_usuario"
$body = @{ newRole = "ADMIN" } | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/users/$userId/role" `
  -Method PATCH `
  -Headers @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $token"
  } `
  -Body $body
```

---

## 📚 Documentación Completa

- **USER_MANAGEMENT.md** - Guía técnica detallada
- **IMPLEMENTACION_USUARIOS.md** - Resumen de implementación
- **API_REFERENCE.md** - Referencia de API

---

## 🧪 Pruebas Automatizadas

```powershell
# Ejecutar todas las pruebas
.\test-user-management.ps1
```

---

## 🎯 Casos de Uso Comunes

### Crear 5 usuarios diferentes
```powershell
$usuarios = @(
    @{email="user1@company.com"; fullName="Usuario 1"; role="ADMIN"},
    @{email="user2@company.com"; fullName="Usuario 2"; role="LEADER"},
    @{email="user3@company.com"; fullName="Usuario 3"; role="LEADER"},
    @{email="user4@company.com"; fullName="Usuario 4"; role="TEAM"},
    @{email="user5@company.com"; fullName="Usuario 5"; role="TEAM"}
)

foreach ($u in $usuarios) {
    $body = @{
        email = $u.email
        password = "Pass123!"
        fullName = $u.fullName
        role = $u.role
    } | ConvertTo-Json
    
    Invoke-WebRequest -Uri "http://localhost:5000/api/users/create" `
      -Method POST `
      -Headers @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $token"
      } `
      -Body $body | Out-Null
    
    Write-Host "✓ Creado: $($u.fullName) ($($u.role))"
}
```

### Listar usuarios por rol
```powershell
$role = "LEADER" # o "ADMIN", "TEAM"

Invoke-WebRequest -Uri "http://localhost:5000/api/users/role/$role" `
  -Method GET `
  -Headers @{"Authorization" = "Bearer $token"} | Select-Object -ExpandProperty Content | ConvertFrom-Json
```

### Cambiar contraseña
```powershell
$body = @{
    currentPassword = "admin123"
    newPassword = "admin456"
    confirmPassword = "admin456"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/users/change-password" `
  -Method PUT `
  -Headers @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $token"
  } `
  -Body $body
```

---

## 🔐 Permisos por Rol

| Acción | ADMIN | LEADER | TEAM |
|--------|-------|--------|------|
| Ver todos los usuarios | ✅ | ❌ | ❌ |
| Crear usuarios | ✅ | ❌ | ❌ |
| Cambiar roles | ✅ | ❌ | ❌ |
| Eliminar usuarios | ✅ | ❌ | ❌ |
| Ver perfil propio | ✅ | ✅ | ✅ |
| Editar perfil propio | ✅ | ✅ | ✅ |
| Cambiar propia contraseña | ✅ | ✅ | ✅ |

---

## 🆘 Troubleshooting

### Error: "Authorization token missing"
→ Asegúrate de pasar el header: `Authorization: Bearer <token>`

### Error: "Access denied"
→ Tu rol no tiene permisos. Solo ADMIN puede crear/eliminar usuarios.

### Error: "User already exists"
→ El email ya está registrado. Usa otro email.

### Error: "Invalid credentials"
→ Email o contraseña incorrectos al hacer login.

---

## 💡 Tips

- Los tokens expiran en 7 días
- Las contraseñas deben tener mínimo 6 caracteres
- Los emails son únicos en la base de datos
- Usa `$token` para todas las solicitudes autenticadas

---

**¡Listo para usar! Comienza a crear usuarios.** 🎉
