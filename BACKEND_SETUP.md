# ✅ Backend Completado - LíderPlan

## 📦 ¿Qué se creó?

Se desarrolló un **backend completo** para la aplicación LíderPlan usando:
- **Express.js** - Framework web
- **MongoDB** - Base de datos
- **TypeScript** - Tipado estático
- **JWT** - Autenticación segura
- **Google Gemini API** - IA integrada

## 📂 Estructura Creada

```
backend/
├── src/
│   ├── config/database.ts          ← Conexión MongoDB
│   ├── controllers/                ← Lógica de negocio
│   │   ├── authController.ts
│   │   ├── planController.ts
│   │   └── activityController.ts
│   ├── middleware/authMiddleware.ts ← Validación JWT
│   ├── models/                     ← Esquemas MongoDB
│   │   ├── User.ts
│   │   ├── Plan.ts
│   │   └── Activity.ts
│   ├── routes/                     ← Endpoints API
│   │   ├── auth.ts
│   │   ├── plans.ts
│   │   ├── activities.ts
│   │   └── ai.ts
│   ├── services/geminiService.ts   ← Integración IA
│   ├── types/index.ts              ← Interfaces TypeScript
│   └── server.ts                   ← Servidor principal
├── .env                            ← Configuración
├── .env.example                    ← Template
├── package.json
├── tsconfig.json
└── README.md                       ← Documentación completa
```

## 🚀 Cómo Ejecutar

### Paso 1: Instalar MongoDB

**Opción A - Local (Windows):**
```powershell
# Descargar de: https://www.mongodb.com/try/download/community
# O instalar con Chocolatey:
choco install mongodb-community

# Iniciar servicio:
mongod
```

**Opción B - Cloud (MongoDB Atlas):**
1. Ir a https://www.mongodb.com/cloud/atlas
2. Crear cuenta y cluster gratuito
3. Copiar URL de conexión
4. Actualizar `MONGODB_URI` en `.env`

### Paso 2: Configurar Backend

```bash
# 1. Navegar a carpeta backend
cd "c:\Users\Administrador\OneDrive - Institucion Universitaria Salazar y Herrera\desarrollo\Plan_trabajo\backend"

# 2. Instalar dependencias (ya hecho)
npm install

# 3. Configurar .env
# Editar el archivo .env con:
MONGODB_URI=mongodb://localhost:27017/liderplan
JWT_SECRET=tu_jwt_secret_aqui
GEMINI_API_KEY=tu_gemini_key_aqui (opcional)
PORT=5000
NODE_ENV=development
```

### Paso 3: Ejecutar Backend

```bash
npm run dev
```

**Resultado esperado:**
```
✓ MongoDB connected successfully
✓ Server running on http://localhost:5000
✓ Health check: http://localhost:5000/health
```

## 🔗 Endpoints Disponibles

### Autenticación
| Método | URL | Descripción |
|--------|-----|-------------|
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/auth/me` | Obtener usuario actual |

### Planes
| Método | URL | Descripción |
|--------|-----|-------------|
| POST | `/api/plans` | Crear plan |
| GET | `/api/plans` | Listar mis planes |
| GET | `/api/plans/:planId` | Obtener plan específico |
| PUT | `/api/plans/:planId` | Actualizar plan |
| DELETE | `/api/plans/:planId` | Eliminar plan |

### Actividades
| Método | URL | Descripción |
|--------|-----|-------------|
| POST | `/api/activities` | Crear actividad |
| GET | `/api/activities/:activityId` | Obtener actividad |
| PUT | `/api/activities/:activityId` | Actualizar actividad |
| PATCH | `/api/activities/:activityId/status` | Cambiar estado |
| POST | `/api/activities/:activityId/comments` | Agregar comentario |
| POST | `/api/activities/:activityId/evidence` | Agregar evidencia |
| DELETE | `/api/activities/:activityId` | Eliminar actividad |

### IA
| Método | URL | Descripción |
|--------|-----|-------------|
| POST | `/api/ai/generate-activities` | Generar actividades con Gemini |

## 🧪 Ejemplos de Uso

### 1. Registrar Usuario

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juanperez@company.com",
    "password": "MiPassword123!",
    "fullName": "Juan Pérez García"
  }'
```

**Respuesta:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "juanperez@company.com",
    "fullName": "Juan Pérez García",
    "role": "LEADER"
  }
}
```

### 2. Iniciar Sesión

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juanperez@company.com",
    "password": "MiPassword123!"
  }'
```

### 3. Crear un Plan

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X POST http://localhost:5000/api/plans \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Plan Estratégico 2025",
    "description": "Plan anual de objetivos estratégicos",
    "projectName": "Transformación Digital",
    "goal": "Mejorar eficiencia operacional en 40%",
    "origin": "Junta Directiva - Sesión Oct 2025"
  }'
```

### 4. Generar Actividades con IA

```bash
curl -X POST http://localhost:5000/api/ai/generate-activities \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "project": "Transformación Digital",
    "goal": "Implementar sistema ERP integrado",
    "origin": "Necesidad identificada en auditoría"
  }'
```

**Respuesta (IA generada):**
```json
{
  "message": "Activities generated successfully",
  "activities": [
    {
      "description": "Evaluar soluciones ERP disponibles en el mercado",
      "responsible": "Gerente de TI",
      "resources": "Presupuesto $5000, equipo de 2 personas",
      "priority": "ALTA"
    },
    {
      "description": "Realizar capacitación inicial a usuarios clave",
      "responsible": "Especialista en Implementación",
      "resources": "Plataforma de capacitación, 40 horas",
      "priority": "ALTA"
    },
    ...
  ]
}
```

## 🔐 Sistema de Autenticación

- **JWT (JSON Web Tokens)** - Tokens válidos por 7 días
- **Bcrypt** - Contraseñas hasheadas con salt 10
- **Roles** - ADMIN, LEADER, TEAM
- **Middleware** - Validación automática en rutas protegidas

## 📊 Modelo de Datos

### Colecciones MongoDB

**users** (Usuarios)
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "juanperez@company.com",
  "password": "$2a$10$...",
  "fullName": "Juan Pérez",
  "role": "LEADER",
  "createdAt": "2025-12-10T18:30:00Z"
}
```

**plans** (Planes)
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "Plan 2025",
  "projectName": "Transformación",
  "goal": "Mejorar eficiencia",
  "userId": "507f1f77bcf86cd799439011",
  "activities": ["507f1f77bcf86cd799439013"],
  "createdAt": "2025-12-10T18:30:00Z"
}
```

**activities** (Actividades)
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "description": "Implementar sistema",
  "responsible": "Gerente de TI",
  "status": "No iniciada",
  "priority": "ALTA",
  "completionPercentage": 0,
  "comments": [],
  "evidence": [],
  "planId": "507f1f77bcf86cd799439012"
}
```

## 🔧 Variables de Entorno

Editar `.env`:

```env
# Base de datos
MONGODB_URI=mongodb://localhost:27017/liderplan

# Autenticación
JWT_SECRET=tu_clave_super_secreta_aqui_cambiar_en_produccion

# IA Gemini (opcional, si quieres usar)
GEMINI_API_KEY=tu_api_key_de_google_aqui

# Servidor
PORT=5000
NODE_ENV=development
```

## 🎯 Próximas Acciones

### Para Conectar Frontend y Backend

1. **Actualizar servicios en frontend** para hacer llamadas al backend
2. **Guardar token JWT** en localStorage después del login
3. **Usar token en headers** de todas las solicitudes

### En `frontend/services/`

```typescript
// Ejemplo de cómo conectar
const API_BASE = 'http://localhost:5000/api';

export const loginUser = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return response.json();
};
```

## 💡 Funcionalidades Incluidas

✅ Autenticación JWT completa
✅ CRUD de Planes (Create, Read, Update, Delete)
✅ CRUD de Actividades
✅ Comentarios en actividades
✅ Evidencias/archivos en actividades
✅ Seguimiento de estado y progreso
✅ Generación de actividades con IA
✅ Middleware de autenticación
✅ Validación de datos
✅ Error handling
✅ Documentación completa
✅ TypeScript tipado

## 🚧 No Incluido (Fase 2)

- [ ] Subida de archivos a S3
- [ ] Notificaciones en tiempo real
- [ ] Reportes y dashboards
- [ ] Autenticación OAuth
- [ ] Testing automatizado
- [ ] Docker containerization
- [ ] CI/CD pipeline

## 📞 Contacto & Soporte

Si hay errores o necesitas ajustes, revisar:
1. Logs en consola del terminal
2. Verificar MongoDB está running: `mongod`
3. Verificar archivo `.env` está configurado
4. Verificar puertos 3000 (frontend) y 5000 (backend) están libres

## ✨ Resumen

**Frontend:** ✅ Funcionando en http://localhost:3000
**Backend:** ✅ Listo para ejecutar en http://localhost:5000
**Documentación:** ✅ Completa en `backend/README.md`

**Status:** MVP Lista para integración y testing

---

**Creado:** 10 de Diciembre de 2025
**Versión:** 1.0.0 Beta
