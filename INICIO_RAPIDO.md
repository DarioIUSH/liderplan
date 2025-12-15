## 🚀 INICIO RÁPIDO - LíderPlan Backend

### ✅ Estado Actual

- **Frontend:** ✅ Ejecutándose en http://localhost:3000
- **Backend:** ✅ Creado y listo en carpeta `backend/`
- **Dependencias:** ✅ Instaladas

---

## 📋 Para Ejecutar el Backend

### 1️⃣ Asegúrate que MongoDB está corriendo

```powershell
# Si está instalado localmente
mongod
```

O usa MongoDB Atlas (cloud) y actualiza `backend/.env`

### 2️⃣ Ejecuta el backend

```powershell
cd "c:\Users\Administrador\OneDrive - Institucion Universitaria Salazar y Herrera\desarrollo\Plan_trabajo\backend"

npm run dev
```

**Resultado esperado:**
```
✓ MongoDB connected successfully
✓ Server running on http://localhost:5000
```

---

## 🔗 URLs Principales

| Componente | URL | Estado |
|-----------|-----|--------|
| Frontend | http://localhost:3000 | ✅ Activo |
| Backend API | http://localhost:5000 | ⏳ Listo (inicia con `npm run dev`) |
| Health Check | http://localhost:5000/health | 🔍 Verificar cuando backend esté corriendo |

---

## 📝 Primeras Pruebas

Después de iniciar el backend, abre **PowerShell** y prueba:

```powershell
# 1. Verificar que está vivo
Invoke-WebRequest -Uri "http://localhost:5000/health" -Method GET

# 2. Registrar usuario
Invoke-WebRequest -Uri "http://localhost:5000/api/auth/register" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"email":"test@example.com","password":"test123","fullName":"Test User"}'

# 3. Login
Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"email":"test@example.com","password":"test123"}'
```

---

## 🗂️ Estructura Backend Creada

```
backend/
├── src/
│   ├── config/database.ts
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── planController.ts
│   │   └── activityController.ts
│   ├── middleware/authMiddleware.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── Plan.ts
│   │   └── Activity.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── plans.ts
│   │   ├── activities.ts
│   │   └── ai.ts
│   ├── services/geminiService.ts
│   ├── types/index.ts
│   └── server.ts
├── .env
├── package.json
└── README.md
```

---

## 🔧 Configuración Backend (.env)

Editar `backend/.env`:

```env
MONGODB_URI=mongodb://localhost:27017/liderplan
JWT_SECRET=tu_jwt_secret_aqui
GEMINI_API_KEY=tu_api_key_aqui (opcional)
PORT=5000
NODE_ENV=development
```

---

## 📚 Documentación Completa

- **backend/README.md** - Documentación técnica del backend
- **DOCUMENTACION.md** - Documentación general del proyecto
- **BACKEND_SETUP.md** - Guía completa de instalación y uso

---

## 🎯 Próximo Paso

Conectar el **Frontend** con el **Backend** actualizando los servicios.

Ver archivo: `BACKEND_SETUP.md` sección "Para Conectar Frontend y Backend"

---

**✨ Backend completado y listo para usar**
