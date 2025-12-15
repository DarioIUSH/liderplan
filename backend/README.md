# LíderPlan Backend

API Backend para la aplicación de planificación estratégica LíderPlan.

## Tecnologías

- **Node.js** + **Express** - Framework web
- **MongoDB** - Base de datos NoSQL
- **TypeScript** - Tipado estático
- **JWT** - Autenticación
- **Google Gemini AI** - Generación de actividades con IA

## Requisitos

- Node.js 18+
- MongoDB 5.0+
- npm o yarn

## Instalación

1. **Instalar dependencias:**

```bash
npm install
```

2. **Configurar variables de entorno:**

Copiar `.env.example` a `.env` y configurar:

```bash
MONGODB_URI=mongodb://localhost:27017/liderplan
JWT_SECRET=tu_jwt_secret_muy_seguro
GEMINI_API_KEY=tu_api_key_de_gemini
PORT=5000
NODE_ENV=development
```

3. **Iniciar MongoDB:**

```bash
# En Windows con MongoDB instalado
mongod

# O usar MongoDB Atlas (cloud)
```

## Ejecución

**Modo desarrollo:**

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:5000`

**Modo producción:**

```bash
npm run build
npm start
```

## Endpoints

### Autenticación

- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual (requiere token)

### Planes

- `POST /api/plans` - Crear plan
- `GET /api/plans` - Obtener planes del usuario
- `GET /api/plans/:planId` - Obtener plan específico
- `PUT /api/plans/:planId` - Actualizar plan
- `DELETE /api/plans/:planId` - Eliminar plan

### Actividades

- `POST /api/activities` - Crear actividad
- `GET /api/activities/:activityId` - Obtener actividad
- `PUT /api/activities/:activityId` - Actualizar actividad
- `PATCH /api/activities/:activityId/status` - Actualizar estado
- `POST /api/activities/:activityId/comments` - Agregar comentario
- `POST /api/activities/:activityId/evidence` - Agregar evidencia
- `DELETE /api/activities/:activityId` - Eliminar actividad

### IA

- `POST /api/ai/generate-activities` - Generar actividades con Gemini AI

## Estructura del Proyecto

```
backend/
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
└── tsconfig.json
```

## API Example

### Registro

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
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "Plan Estratégico 2025",
    "description": "Plan anual de la empresa",
    "projectName": "Transformación Digital",
    "goal": "Mejorar eficiencia operacional",
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
    "goal": "Implementar sistema de gestión integrado",
    "origin": "Necesidad identificada en auditoría"
  }'
```

## Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| MONGODB_URI | URL de conexión a MongoDB | mongodb://localhost:27017/liderplan |
| JWT_SECRET | Clave secreta para JWT | tu_clave_secreta_aqui |
| GEMINI_API_KEY | API Key de Google Gemini | sk-... |
| PORT | Puerto del servidor | 5000 |
| NODE_ENV | Ambiente | development/production |

## Notas de Desarrollo

- Los tokens JWT expiran en 7 días
- Las contraseñas se hashean con bcryptjs
- MongoDB debe estar ejecutándose localmente o en Atlas
- La API usa CORS habilitado para el frontend

## Próximas Mejoras

- [ ] Autenticación OAuth
- [ ] Subida de evidencias a S3
- [ ] Notificaciones en tiempo real
- [ ] Reportes y dashboards
- [ ] Integración con más proveedores de IA
