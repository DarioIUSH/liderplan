# 👥 GESTOR DE USUARIOS CON ROLES - DOCUMENTACIÓN

## 📋 Descripción General

Se ha implementado un sistema completo de gestión de usuarios con roles y permisos basados en el siguiente modelo de autorización:

### Roles Disponibles

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| **ADMIN** | Administrador del sistema | Crear/editar/eliminar usuarios, cambiar roles, ver todos los usuarios |
| **LEADER** | Líder de proyecto | Crear y gestionar planes y actividades, ver equipo |
| **TEAM** | Miembro del equipo | Ver planes asignados, participar en actividades |

---

## 🔧 Nuevos Endpoints de Usuarios

### 1. **Crear Usuario con Rol** (ADMIN only)
```http
POST /api/users/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "contraseña123",
  "fullName": "Juan Pérez",
  "role": "LEADER"
}
```

**Response (201):**
```json
{
  "message": "Usuario creado exitosamente",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "usuario@example.com",
    "fullName": "Juan Pérez",
    "role": "LEADER",
    "createdAt": "2025-12-10T10:30:00Z"
  }
}
```

---

### 2. **Obtener Todos los Usuarios** (ADMIN only)
```http
GET /api/users/all
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "total": 5,
  "users": [
    {
      "id": "507f1f77bcf86cd799439011",
      "email": "admin@example.com",
      "fullName": "Admin User",
      "role": "ADMIN",
      "createdAt": "2025-12-10T09:00:00Z"
    },
    // ... más usuarios
  ]
}
```

---

### 3. **Obtener Usuarios por Rol** (ADMIN only)
```http
GET /api/users/role/:role
Authorization: Bearer <token>

# Ejemplos:
GET /api/users/role/ADMIN
GET /api/users/role/LEADER
GET /api/users/role/TEAM
```

**Response (200):**
```json
{
  "role": "LEADER",
  "total": 3,
  "users": [
    {
      "id": "507f1f77bcf86cd799439011",
      "email": "lider@example.com",
      "fullName": "Líder Proyecto",
      "role": "LEADER",
      "createdAt": "2025-12-10T09:15:00Z"
    }
  ]
}
```

---

### 4. **Obtener Usuario Actual**
```http
GET /api/users/me
Authorization: Bearer <token>
```

---

### 5. **Cambiar Contraseña**
```http
PUT /api/users/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "contraseña_actual",
  "newPassword": "nueva_contraseña",
  "confirmPassword": "nueva_contraseña"
}
```

---

### 6. **Actualizar Usuario**
```http
PUT /api/users/:userId
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullName": "Nuevo Nombre",
  "email": "nuevo@example.com"
}
```

**Nota:** Solo ADMIN puede cambiar el rol de un usuario a través de este endpoint.

---

### 7. **Cambiar Rol de Usuario** (ADMIN only)
```http
PATCH /api/users/:userId/role
Authorization: Bearer <token>
Content-Type: application/json

{
  "newRole": "LEADER"
}
```

**Response (200):**
```json
{
  "message": "Rol de usuario actualizado exitosamente",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "usuario@example.com",
    "fullName": "Juan Pérez",
    "previousRole": "TEAM",
    "newRole": "LEADER",
    "updatedAt": "2025-12-10T10:45:00Z"
  }
}
```

---

### 8. **Eliminar Usuario** (ADMIN only)
```http
DELETE /api/users/:userId
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Usuario eliminado exitosamente",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "usuario@example.com",
    "fullName": "Juan Pérez"
  }
}
```

---

## 🧪 Ejemplos de Prueba en PowerShell

### 1. Registrar usuario (rol por defecto: LEADER)
```powershell
$body = @{
    email = "juan@example.com"
    password = "password123"
    fullName = "Juan Pérez"
    role = "LEADER"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/auth/register" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

### 2. Login
```powershell
$body = @{
    email = "juan@example.com"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body

$token = ($response.Content | ConvertFrom-Json).token
Write-Host "Token: $token"
```

### 3. Crear usuario como ADMIN
```powershell
$token = "tu_token_aqui"

$body = @{
    email = "equipo@example.com"
    password = "password123"
    fullName = "Miembro del Equipo"
    role = "TEAM"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/users/create" `
  -Method POST `
  -Headers @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $token"
  } `
  -Body $body
```

### 4. Obtener todos los usuarios
```powershell
$token = "tu_token_aqui"

Invoke-WebRequest -Uri "http://localhost:5000/api/users/all" `
  -Method GET `
  -Headers @{"Authorization" = "Bearer $token"}
```

### 5. Cambiar rol de usuario
```powershell
$token = "tu_token_aqui"
$userId = "usuario_id_aqui"

$body = @{
    newRole = "LEADER"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/users/$userId/role" `
  -Method PATCH `
  -Headers @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $token"
  } `
  -Body $body
```

### 6. Eliminar usuario
```powershell
$token = "tu_token_aqui"
$userId = "usuario_id_aqui"

Invoke-WebRequest -Uri "http://localhost:5000/api/users/$userId" `
  -Method DELETE `
  -Headers @{"Authorization" = "Bearer $token"}
```

---

## 🛡️ Middleware de Roles

Se ha creado el archivo `roleMiddleware.ts` que valida automáticamente:
- Que el usuario esté autenticado
- Que el usuario tenga los roles requeridos
- Devuelve errores 403 si no tiene permisos

### Uso en rutas:
```typescript
// Solo ADMIN
router.post('/create', authMiddleware, roleMiddleware(['ADMIN']), createUserWithRole);

// ADMIN o LEADER
router.put('/:userId', authMiddleware, roleMiddleware(['ADMIN', 'LEADER']), updateUser);
```

---

## 🎨 Componente Frontend (React)

Se ha creado el componente `UserManager.tsx` que incluye:

### Funcionalidades:
✅ Mostrar usuario actual y su rol
✅ Listar todos los usuarios (solo ADMIN)
✅ Crear nuevos usuarios con rol específico (solo ADMIN)
✅ Cambiar rol de usuarios (solo ADMIN)
✅ Eliminar usuarios (solo ADMIN)
✅ Interfaz responsiva con Tailwind CSS
✅ Manejo de errores y mensajes de éxito

### Uso:
```typescript
import UserManager from './components/UserManager';

function App() {
  return <UserManager />;
}
```

---

## 📋 Modelos de Datos Actualizados

### User Model (MongoDB)
```typescript
interface IUser {
  _id?: string;
  email: string;                    // Único, requerido
  password: string;                 // Hash, requerido
  fullName: string;                 // Requerido
  role: 'ADMIN' | 'LEADER' | 'TEAM'; // Enum, default: 'LEADER'
  createdAt?: Date;
  updatedAt?: Date;
}
```

---

## 🔐 Validaciones y Seguridad

✅ Contraseñas hasheadas con bcryptjs (salt 10)
✅ Validación de email único
✅ Validación de roles enum
✅ Tokens JWT con expiración 7 días
✅ Middleware de autenticación en todas las rutas protegidas
✅ Middleware de autorización por rol
✅ Validación de longitud de contraseña (mínimo 6 caracteres)

---

## 📁 Archivos Nuevos/Modificados

### Nuevos:
- `backend/src/middleware/roleMiddleware.ts` - Validación de roles
- `backend/src/controllers/userController.ts` - Lógica de usuarios
- `backend/src/routes/users.ts` - Rutas de usuarios
- `frontend/components/UserManager.tsx` - Interfaz de gestión

### Modificados:
- `backend/src/server.ts` - Importar rutas de usuarios
- `backend/src/controllers/authController.ts` - Permitir role en registro

---

## 🚀 Próximos Pasos Sugeridos

1. Implementar auditoría de cambios de usuarios
2. Agregar recuperación de contraseña por email
3. Implementar autenticación con OAuth2
4. Agregar historial de actividad por usuario
5. Implementar permisos granulares por acción

