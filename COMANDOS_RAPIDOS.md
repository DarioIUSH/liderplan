# 🚀 COMANDOS RÁPIDOS - LíderPlan

## ⚡ Quick Start

```bash
# 1. Navegar a backend
cd backend

# 2. Instalar dependencias (ya hecho)
npm install

# 3. Configurar variables (.env ya existe)
# Editar: backend/.env
# MONGODB_URI=mongodb://localhost:27017/liderplan
# JWT_SECRET=tu_clave_secreta
# GEMINI_API_KEY=tu_gemini_key (opcional)

# 4. Iniciar MongoDB (en otra terminal)
mongod

# 5. Ejecutar backend
npm run dev

# ✅ Backend listo en http://localhost:5000
```

---

## 📡 Testing con PowerShell

```powershell
# Health Check
Invoke-WebRequest -Uri "http://localhost:5000/health" -Method GET

# Registrar usuario
$body = @{
    email = "test@example.com"
    password = "test123"
    fullName = "Test User"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/auth/register" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body

# Login
$loginBody = @{
    email = "test@example.com"
    password = "test123"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $loginBody

# Guardar token
$token = ($response.Content | ConvertFrom-Json).token
Write-Host "Token: $token"

# Crear Plan (con token)
$planBody = @{
    name = "Plan 2025"
    description = "Plan anual"
    projectName = "Proyecto X"
    goal = "Objetivo"
    origin = "Origen"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/plans" `
  -Method POST `
  -Headers @{
    "Content-Type"="application/json"
    "Authorization"="Bearer $token"
  } `
  -Body $planBody
```

---

## 🔧 Comandos Útiles

```bash
# Compilar TypeScript
npm run build

# Ver versión de Node
node --version

# Ver versión de npm
npm --version

# Instalar dependencias
npm install

# Actualizar dependencias
npm update

# Limpiar cache npm
npm cache clean --force
```

---

## 📁 Navegación Rápida

```powershell
# Ir a carpeta del proyecto
cd "c:\Users\Administrador\OneDrive - Institucion Universitaria Salazar y Herrera\desarrollo\Plan_trabajo"

# Ir a backend
cd backend

# Ir a frontend
cd "líderplan (1)"

# Listar contenido
ls

# Ver estructura
Get-ChildItem -Recurse src
```

---

## 🔐 Autenticación

```bash
# Token válido por: 7 días
# Tipo: JWT (JSON Web Token)
# Header: Authorization: Bearer <token>
# Secret: Configurado en .env (JWT_SECRET)
```

---

## 🗄️ MongoDB

```bash
# Iniciar MongoDB (Windows)
mongod

# Conectarse a MongoDB local
mongo

# Listar bases de datos
show dbs

# Usar BD liderplan
use liderplan

# Ver colecciones
show collections

# Ver documentos
db.users.find()
db.plans.find()
db.activities.find()
```

---

## 📊 Puertos Utilizados

| Servicio | Puerto | URL |
|----------|--------|-----|
| Frontend | 3000 | http://localhost:3000 |
| Backend | 5000 | http://localhost:5000 |
| MongoDB | 27017 | mongodb://localhost:27017 |

---

## 🆘 Troubleshooting Rápido

```powershell
# Ver procesos en puerto
Get-NetTCPConnection -LocalPort 5000

# Matar proceso en puerto
Stop-Process -Id <PID> -Force

# Ver variables de entorno
Get-Content backend\.env

# Verificar conexión MongoDB
Invoke-WebRequest -Uri "http://localhost:5000/health"

# Ver logs del servidor
# Revisar output en terminal donde se ejecutó npm run dev
```

---

## 📚 Archivos Importantes

```
backend/
├── .env                    ← EDITAR: variables de entorno
├── src/server.ts          ← Archivo principal
├── src/config/database.ts ← Conexión MongoDB
├── src/models/            ← Esquemas MongoDB
├── src/controllers/       ← Lógica de negocio
├── src/routes/           ← Endpoints API
├── src/middleware/       ← Validaciones
└── README.md             ← Documentación técnica
```

---

## 🎯 Endpoints Más Usados

```bash
# Registro
POST /api/auth/register
Body: {email, password, fullName}

# Login  
POST /api/auth/login
Body: {email, password}
Response: {token, user}

# Crear Plan
POST /api/plans
Headers: Authorization: Bearer <token>
Body: {name, description, projectName, goal, origin}

# Generar Actividades con IA
POST /api/ai/generate-activities
Headers: Authorization: Bearer <token>
Body: {project, goal, origin}
```

---

## 💡 Tips Productivos

1. **Mantén MongoDB corriendo** en una terminal
2. **Usa otra terminal para backend** con `npm run dev`
3. **Abre otra terminal** para testing con cURL/PowerShell
4. **Guarda el token** después de login para testing
5. **Revisa logs** si hay errores 500
6. **Verifica .env** si hay problemas de conexión

---

## 📱 Integración Frontend

Usar servicios en `FRONTEND_INTEGRATION.md`:

```typescript
import { authService, planService, aiService } from './services/apiService';

// Login
const { token, user } = await authService.login(email, password);

// Crear plan
const plan = await planService.createPlan(planData);

// Generar actividades
const activities = await aiService.generateActivities(project, goal, origin);
```

---

## ✨ Próximas Acciones

```bash
# 1. Iniciar MongoDB
mongod

# 2. Iniciar Backend
cd backend
npm run dev

# 3. Probar Health Check
curl http://localhost:5000/health

# 4. Registrar usuario
# Usar comando PowerShell de arriba

# 5. Crear plan
# Usar comando PowerShell con token

# 6. Generar actividades
# Usar comando PowerShell con IA
```

---

**Versión:** 1.0.0
**Actualizado:** 10/12/2025
**Status:** ✅ Listo para usar
