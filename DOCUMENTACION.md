# 📋 LíderPlan - Documentación del Proyecto

## Estructura del Proyecto

```
Plan_trabajo/
├── líderplan (1)/           # Frontend - React + Vite
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── CreatePlanForm.tsx
│   │   ├── LoginForm.tsx
│   │   ├── PlanCard.tsx
│   │   └── PlanExecutionView.tsx
│   ├── services/
│   │   └── geminiService.ts
│   ├── App.tsx
│   ├── index.html
│   ├── index.tsx
│   ├── types.ts
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── metadata.json
│
└── backend/                 # Backend - Express + MongoDB
    ├── src/
    │   ├── config/
    │   │   └── database.ts
    │   ├── controllers/
    │   │   ├── authController.ts
    │   │   ├── planController.ts
    │   │   └── activityController.ts
    │   ├── middleware/
    │   │   └── authMiddleware.ts
    │   ├── models/
    │   │   ├── User.ts
    │   │   ├── Plan.ts
    │   │   └── Activity.ts
    │   ├── routes/
    │   │   ├── auth.ts
    │   │   ├── plans.ts
    │   │   ├── activities.ts
    │   │   └── ai.ts
    │   ├── services/
    │   │   └── geminiService.ts
    │   ├── types/
    │   │   └── index.ts
    │   └── server.ts
    ├── .env
    ├── .env.example
    ├── package.json
    ├── tsconfig.json
    └── README.md
```

## 🚀 Guía de Ejecución

### Frontend (Puerto 3000)

```bash
cd "líderplan (1)"
npm install          # Si no está instalado
npm run dev
```

**Acceder en:** http://localhost:3000

### Backend (Puerto 5000)

#### Requisito: MongoDB

**Opción 1: MongoDB Local (Windows)**
```bash
# Descargar MongoDB Community: https://www.mongodb.com/try/download/community
# O usar Chocolatey:
choco install mongodb-community

# Iniciar servicio:
mongod
```

**Opción 2: MongoDB Atlas (Cloud)**
- Registrarse en https://www.mongodb.com/cloud/atlas
- Crear un cluster gratuito
- Copiar la URL de conexión en `.env`

#### Iniciar Backend

```bash
cd backend
npm install          # Si no está instalado
npm run dev
```

**Acceder en:** http://localhost:5000/health

## 📝 Configuración del Backend

1. **Crear archivo `.env`** en la carpeta `backend/`:

```env
MONGODB_URI=mongodb://localhost:27017/liderplan
JWT_SECRET=tu_jwt_secret_muy_seguro_cambiar_en_produccion
GEMINI_API_KEY=tu_api_key_de_gemini
PORT=5000
NODE_ENV=development
```

2. **Obtener API Key de Gemini:**
   - Ir a https://ai.google.dev
   - Crear un proyecto
   - Generar API Key
   - Copiar en `.env`

## 🔗 Endpoints Principales

### Autenticación
```
POST   /api/auth/register       - Registrar usuario
POST   /api/auth/login          - Iniciar sesión
GET    /api/auth/me             - Obtener usuario actual
```

### Planes
```
POST   /api/plans               - Crear plan
GET    /api/plans               - Obtener mis planes
GET    /api/plans/:planId       - Obtener plan específico
PUT    /api/plans/:planId       - Actualizar plan
DELETE /api/plans/:planId       - Eliminar plan
```

### Actividades
```
POST   /api/activities                        - Crear actividad
GET    /api/activities/:activityId            - Obtener actividad
PUT    /api/activities/:activityId            - Actualizar actividad
PATCH  /api/activities/:activityId/status     - Cambiar estado
POST   /api/activities/:activityId/comments   - Agregar comentario
POST   /api/activities/:activityId/evidence   - Agregar evidencia
DELETE /api/activities/:activityId            - Eliminar actividad
```

### IA
```
POST   /api/ai/generate-activities    - Generar actividades con Gemini
```

## 🧪 Testing con cURL

### Registrar Usuario
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "password123",
    "fullName": "Juan Pérez"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "password123"
  }'
```

### Crear Plan
```bash
curl -X POST http://localhost:5000/api/plans \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token_del_login>" \
  -d '{
    "name": "Plan 2025",
    "description": "Plan anual",
    "projectName": "Proyecto X",
    "goal": "Aumentar eficiencia",
    "origin": "Junta directiva"
  }'
```

### Generar Actividades con IA
```bash
curl -X POST http://localhost:5000/api/ai/generate-activities \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "project": "Transformación Digital",
    "goal": "Implementar ERP",
    "origin": "Auditoría interna"
  }'
```

## 🔐 Autenticación

El sistema utiliza **JWT (JSON Web Tokens)**:

1. Usuario se registra o inicia sesión
2. Backend retorna un token JWT válido por 7 días
3. Token se incluye en header: `Authorization: Bearer <token>`
4. Backend valida el token en cada solicitud protegida

## 📊 Modelo de Datos

### User
- email (único)
- password (hasheada con bcryptjs)
- fullName
- role (ADMIN, LEADER, TEAM)

### Plan
- name
- description
- projectName
- goal
- origin
- activities[] (referencias a actividades)
- userId (referencias a usuario)

### Activity
- description
- responsible
- area
- startDate / endDate
- resources
- status (No iniciada, En ejecución, Cerrada)
- priority (ALTA, MEDIA, BAJA)
- completionPercentage (0-100)
- comments[] (con autor y fecha)
- evidence[] (referencias a archivos)
- planId (referencia al plan)

## 🛠️ Próximos Pasos

### Fase 1: MVP
- ✅ Backend con CRUD completo
- ✅ Autenticación JWT
- ✅ Generación de actividades con IA
- ⏳ Conectar frontend con backend
- ⏳ Testing

### Fase 2: Mejoras
- Subida de evidencias a S3
- Notificaciones en tiempo real (WebSockets)
- Reportes y dashboards
- Export a PDF/Excel

### Fase 3: Escalabilidad
- Autenticación OAuth (Google, Microsoft)
- Búsqueda avanzada
- Integración con más proveedores de IA
- Caching con Redis

## 📚 Tecnologías Utilizadas

### Frontend
- React 19
- Vite
- TypeScript
- Lucide React (iconos)
- Google Gemini API

### Backend
- Node.js
- Express
- MongoDB
- Mongoose (ODM)
- JWT
- bcryptjs
- Google Gemini API

## 🤝 Contribuciones

Para agregar features:

1. Crear rama: `git checkout -b feature/nueva-feature`
2. Hacer cambios
3. Commit: `git commit -m "feat: descripción"`
4. Push: `git push origin feature/nueva-feature`
5. PR

## 📞 Soporte

Para reportar issues o hacer sugerencias, contactar al equipo de desarrollo.

---

**Última actualización:** 10 de Diciembre de 2025
**Estado:** MVP en desarrollo
