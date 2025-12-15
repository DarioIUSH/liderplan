# 🎯 CREDENCIALES DE PRUEBA - MÓDULO DE USUARIOS

## ✅ Usuarios Creados en el Sistema

### 👨‍💼 ADMINISTRADOR
```
Email:      admin@liderplan.com
Contraseña: Admin123!
Rol:        ADMIN
Permisos:   • Ver todos los usuarios
            • Crear nuevos usuarios
            • Cambiar roles
            • Eliminar usuarios
            • Editar cualquier usuario
```

### 👤 LÍDERES DE PROYECTO

#### Líder 1
```
Email:      lider1@liderplan.com
Contraseña: Password123!
Rol:        LEADER
Nombre:     Juan Pérez
Permisos:   • Ver su perfil
            • Editar su información
            • Cambiar su contraseña
```

#### Líder 2
```
Email:      lider2@liderplan.com
Contraseña: Password123!
Rol:        LEADER
Nombre:     María García
Permisos:   • Ver su perfil
            • Editar su información
            • Cambiar su contraseña
```

### 👥 EQUIPO

#### Equipo 1
```
Email:      equipo1@liderplan.com
Contraseña: Password123!
Rol:        TEAM
Nombre:     Carlos López
Permisos:   • Ver su perfil
            • Editar su información
            • Cambiar su contraseña
```

#### Equipo 2
```
Email:      equipo2@liderplan.com
Contraseña: Password123!
Rol:        TEAM
Nombre:     Ana Martínez
Permisos:   • Ver su perfil
            • Editar su información
            • Cambiar su contraseña
```

---

## 🔐 Acceso al Sistema

### 1. **Acceder como ADMIN** (Gestionar todos los usuarios)
- Ve a http://localhost:3000
- Usa credenciales ADMIN
- Verás el módulo completo de gestión de usuarios
- Podrás:
  - Ver todos los usuarios en una tabla
  - Crear nuevos usuarios
  - Cambiar roles de usuarios
  - Eliminar usuarios

### 2. **Acceder como LEADER** (Ver solo su perfil)
- Ve a http://localhost:3000
- Usa credenciales de un LÍDER
- Verás solo información de tu perfil
- No podrás ver otros usuarios

### 3. **Acceder como TEAM** (Ver solo su perfil)
- Ve a http://localhost:3000
- Usa credenciales de EQUIPO
- Verás solo información de tu perfil
- No podrás ver otros usuarios

---

## 🧪 Pruebas Rápidas

### Cambiar rol de usuario como ADMIN
```powershell
# Obtener ID del usuario (desde la lista anterior)
# Ejemplo: cambiar Juan Pérez de LEADER a ADMIN

$token = "tu_token_admin"
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

### Crear nuevo usuario como ADMIN
```powershell
$token = "tu_token_admin"

$body = @{
    email = "nuevouser@liderplan.com"
    password = "Pass123!"
    fullName = "Nuevo Usuario"
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

---

## 📊 Resumen del Sistema

| Característica | Estado |
|---|---|
| Backend API | ✅ http://localhost:5000 |
| Frontend Web | ✅ http://localhost:3000 |
| MongoDB | ✅ Conectado |
| Usuarios | ✅ 5 usuarios creados |
| Roles | ✅ ADMIN, LEADER, TEAM |
| Autenticación | ✅ JWT funcionando |

---

## 🎮 Próximos Pasos

1. **Accede como ADMIN** a http://localhost:3000
2. **Inicia sesión** con admin@liderplan.com
3. **Explora el módulo** de gestión de usuarios
4. **Prueba** crear, editar y cambiar roles
5. **Cambia de usuario** para ver las limitaciones de cada rol

---

**Fecha de creación:** 10 Diciembre 2025
**Proyecto:** LíderPlan - Gestor de Usuarios
