# 📡 API Reference - LíderPlan Backend

## Base URL
```
http://localhost:5000/api
```

## Authentication Header
```
Authorization: Bearer <JWT_TOKEN>
```

---

## 🔐 Auth Endpoints

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "password123",
  "fullName": "Nombre Completo"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "usuario@example.com",
    "fullName": "Nombre Completo",
    "role": "LEADER"
  }
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "usuario@example.com",
    "fullName": "Nombre Completo",
    "role": "LEADER"
  }
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "usuario@example.com",
  "fullName": "Nombre Completo",
  "role": "LEADER",
  "createdAt": "2025-12-10T18:30:00Z",
  "updatedAt": "2025-12-10T18:30:00Z"
}
```

---

## 📋 Plans Endpoints

### Create Plan
```http
POST /plans
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Plan 2025",
  "description": "Descripción del plan",
  "projectName": "Nombre del Proyecto",
  "goal": "Objetivo principal",
  "origin": "Fuente del plan"
}
```

**Response (201):**
```json
{
  "message": "Plan created successfully",
  "plan": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Plan 2025",
    "description": "Descripción del plan",
    "projectName": "Nombre del Proyecto",
    "goal": "Objetivo principal",
    "origin": "Fuente del plan",
    "activities": [],
    "userId": "507f1f77bcf86cd799439011",
    "createdAt": "2025-12-10T18:30:00Z",
    "updatedAt": "2025-12-10T18:30:00Z"
  }
}
```

### Get All Plans
```http
GET /plans
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Plan 2025",
    "description": "Descripción del plan",
    "projectName": "Nombre del Proyecto",
    "goal": "Objetivo principal",
    "origin": "Fuente del plan",
    "activities": ["507f1f77bcf86cd799439013"],
    "userId": "507f1f77bcf86cd799439011",
    "createdAt": "2025-12-10T18:30:00Z"
  }
]
```

### Get Specific Plan
```http
GET /plans/:planId
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "Plan 2025",
  "description": "Descripción del plan",
  "projectName": "Nombre del Proyecto",
  "goal": "Objetivo principal",
  "origin": "Fuente del plan",
  "activities": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "description": "Actividad 1",
      "responsible": "Gerente",
      "status": "No iniciada",
      ...
    }
  ],
  "userId": "507f1f77bcf86cd799439011"
}
```

### Update Plan
```http
PUT /plans/:planId
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Plan 2025 Actualizado",
  "description": "Nueva descripción"
}
```

**Response (200):**
```json
{
  "message": "Plan updated successfully",
  "plan": { ... }
}
```

### Delete Plan
```http
DELETE /plans/:planId
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Plan deleted successfully"
}
```

---

## 🎯 Activities Endpoints

### Create Activity
```http
POST /activities
Authorization: Bearer <token>
Content-Type: application/json

{
  "planId": "507f1f77bcf86cd799439012",
  "description": "Descripción de la actividad",
  "responsible": "Nombre del responsable",
  "area": "Área/Departamento",
  "startDate": "01/01/2025",
  "endDate": "31/01/2025",
  "resources": "Recursos necesarios",
  "priority": "ALTA"
}
```

**Response (201):**
```json
{
  "message": "Activity created successfully",
  "activity": {
    "_id": "507f1f77bcf86cd799439013",
    "description": "Descripción de la actividad",
    "responsible": "Nombre del responsable",
    "area": "Área/Departamento",
    "startDate": "01/01/2025",
    "endDate": "31/01/2025",
    "resources": "Recursos necesarios",
    "status": "No iniciada",
    "priority": "ALTA",
    "completionPercentage": 0,
    "comments": [],
    "evidence": [],
    "planId": "507f1f77bcf86cd799439012",
    "createdAt": "2025-12-10T18:30:00Z"
  }
}
```

### Get Activity
```http
GET /activities/:activityId
Authorization: Bearer <token>
```

**Response (200):** Activity object

### Update Activity
```http
PUT /activities/:activityId
Authorization: Bearer <token>
Content-Type: application/json

{
  "description": "Nueva descripción",
  "priority": "MEDIA"
}
```

**Response (200):**
```json
{
  "message": "Activity updated successfully",
  "activity": { ... }
}
```

### Update Activity Status
```http
PATCH /activities/:activityId/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "En ejecución",
  "completionPercentage": 50
}
```

**Response (200):**
```json
{
  "message": "Activity status updated successfully",
  "activity": { ... }
}
```

### Add Comment
```http
POST /activities/:activityId/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "Comentario importante",
  "author": "Juan Pérez"
}
```

**Response (200):**
```json
{
  "message": "Comment added successfully",
  "activity": {
    "comments": [
      {
        "_id": "507f1f77bcf86cd799439014",
        "text": "Comentario importante",
        "date": "2025-12-10T18:30:00Z",
        "author": "Juan Pérez"
      }
    ]
  }
}
```

### Add Evidence
```http
POST /activities/:activityId/evidence
Authorization: Bearer <token>
Content-Type: application/json

{
  "fileName": "reporte-diciembre.pdf",
  "url": "https://storage.example.com/file.pdf"
}
```

**Response (200):**
```json
{
  "message": "Evidence added successfully",
  "activity": {
    "evidence": [
      {
        "_id": "507f1f77bcf86cd799439015",
        "fileName": "reporte-diciembre.pdf",
        "url": "https://storage.example.com/file.pdf",
        "date": "2025-12-10T18:30:00Z"
      }
    ]
  }
}
```

### Delete Activity
```http
DELETE /activities/:activityId
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Activity deleted successfully"
}
```

---

## 🤖 AI Endpoints

### Generate Activities with AI
```http
POST /ai/generate-activities
Authorization: Bearer <token>
Content-Type: application/json

{
  "project": "Transformación Digital",
  "goal": "Implementar ERP integrado",
  "origin": "Auditoría interna"
}
```

**Response (200):**
```json
{
  "message": "Activities generated successfully",
  "activities": [
    {
      "description": "Evaluar soluciones ERP disponibles",
      "responsible": "Gerente de TI",
      "resources": "Presupuesto $5000, equipo 2 personas",
      "priority": "ALTA"
    },
    {
      "description": "Realizar capacitación de usuarios",
      "responsible": "Especialista en Implementación",
      "resources": "Plataforma de capacitación, 40 horas",
      "priority": "ALTA"
    },
    ...
  ]
}
```

---

## 🏥 Health Check

### Server Status
```http
GET /health
```

**Response (200):**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

---

## ❌ Error Responses

### 400 - Bad Request
```json
{
  "message": "Missing required fields: project, goal, origin"
}
```

### 401 - Unauthorized
```json
{
  "message": "Authorization token missing"
}
```

### 404 - Not Found
```json
{
  "message": "Plan not found"
}
```

### 500 - Server Error
```json
{
  "message": "Failed to create plan",
  "error": "Error details here"
}
```

---

## 🔐 Status Codes

| Code | Significado |
|------|-------------|
| 200 | OK - Solicitud exitosa |
| 201 | Created - Recurso creado |
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - Sin autenticación |
| 404 | Not Found - Recurso no encontrado |
| 500 | Server Error - Error interno |

---

## 📊 Priority Values

- `ALTA` - Alta prioridad
- `MEDIA` - Prioridad media
- `BAJA` - Baja prioridad

## 📌 Status Values

- `No iniciada` - Actividad no ha empezado
- `En ejecución` - Actividad en proceso
- `Cerrada` - Actividad completada

---

**Última actualización:** 10 de Diciembre de 2025
**Versión API:** 1.0.0
