# 📑 ÍNDICE DE DOCUMENTACIÓN - LíderPlan

## 🎯 Comienza Aquí

Si es tu primera vez, lee en este orden:

1. **[INICIO_RAPIDO.md](./INICIO_RAPIDO.md)** ⭐ START HERE
   - Guía de 5 minutos para iniciar
   - Comandos esenciales
   - Verificación rápida del setup

2. **[BACKEND_SETUP.md](./BACKEND_SETUP.md)** 📚
   - Instalación completa paso a paso
   - Ejemplos de uso con cURL
   - Modelo de datos explicado

3. **[API_REFERENCE.md](./API_REFERENCE.md)** 🔗
   - Referencia detallada de todos los 16 endpoints
   - Ejemplos de request/response
   - Status codes y errores

---

## 📖 Documentación Detallada

### General del Proyecto
- **[DOCUMENTACION.md](./DOCUMENTACION.md)**
  - Estructura completa del proyecto
  - Stack tecnológico
  - Tecnologías utilizadas
  - Modelo de datos
  - Próximos pasos

- **[RESUMEN_EJECUTIVO.md](./RESUMEN_EJECUTIVO.md)**
  - Trabajo completado
  - Estadísticas del proyecto
  - Checklist de funcionalidades
  - Métricas de éxito
  - Timeline del proyecto

### Backend
- **[backend/README.md](./backend/README.md)**
  - Documentación técnica del backend
  - Estructura de carpetas
  - Scripts disponibles
  - Variables de entorno

### Integración con Frontend
- **[FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md)**
  - Código TypeScript para conectar frontend
  - Ejemplos de uso en componentes
  - Funciones auxiliares (JWT, headers, etc.)
  - Plantilla de componente React

---

## 🚀 Scripts Disponibles

### Iniciar Todo
```bash
# Windows
.\start.bat

# Linux/Mac
./start.sh
```

### Iniciar por Separado

**Frontend:**
```bash
cd "líderplan (1)"
npm run dev
# http://localhost:3000
```

**Backend:**
```bash
cd backend
npm run dev
# http://localhost:5000
```

---

## 📁 Estructura del Proyecto

```
Plan_trabajo/
├── 📄 INICIO_RAPIDO.md              ← 👈 EMPIEZA AQUÍ
├── 📄 BACKEND_SETUP.md              ← Setup completo
├── 📄 API_REFERENCE.md              ← Referencia API
├── 📄 FRONTEND_INTEGRATION.md        ← Código para conectar
├── 📄 DOCUMENTACION.md              ← Documentación general
├── 📄 RESUMEN_EJECUTIVO.md          ← Resumen ejecutivo
├── 📄 README.md                     ← Este índice
│
├── 📁 líderplan (1)/                ← Frontend React
│   ├── components/
│   ├── services/
│   ├── App.tsx
│   ├── package.json
│   └── README.md
│
└── 📁 backend/                      ← Backend Express
    ├── src/
    │   ├── config/
    │   ├── controllers/
    │   ├── middleware/
    │   ├── models/
    │   ├── routes/
    │   ├── services/
    │   ├── types/
    │   └── server.ts
    ├── .env
    ├── .env.example
    ├── package.json
    ├── tsconfig.json
    └── README.md
```

---

## 🔗 Endpoints Principales

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/auth/register` | POST | Registrar usuario |
| `/api/auth/login` | POST | Iniciar sesión |
| `/api/auth/me` | GET | Obtener usuario actual |
| `/api/plans` | GET/POST | Listar/Crear planes |
| `/api/plans/:id` | GET/PUT/DELETE | Plan específico |
| `/api/activities` | POST | Crear actividad |
| `/api/activities/:id` | GET/PUT/DELETE | Actividad específica |
| `/api/ai/generate-activities` | POST | Generar con IA |

**Base URL:** `http://localhost:5000/api`
**Auth Header:** `Authorization: Bearer <token>`

---

## ⚙️ Variables de Entorno

**En `backend/.env`:**

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/liderplan

# Autenticación
JWT_SECRET=tu_clave_secreta_aqui

# IA (opcional)
GEMINI_API_KEY=tu_api_key_aqui

# Servidor
PORT=5000
NODE_ENV=development
```

---

## 🆘 Troubleshooting

### MongoDB no conecta
```bash
# Verificar que está corriendo
mongod

# O usar MongoDB Atlas
# https://www.mongodb.com/cloud/atlas
```

### Puerto 5000 en uso
```bash
# Cambiar en .env
PORT=5001
```

### Token expirado
```bash
# Hacer login nuevamente para obtener nuevo token
POST /api/auth/login
```

### Dependencias no instaladas
```bash
cd backend
npm install
```

---

## 📞 ¿Necesitas Ayuda?

1. **Revisá la documentación** - Tienes 7 guías diferentes
2. **Chequea los logs** - Ver qué error específico ocurre
3. **Verifica .env** - Asegúrate que esté bien configurado
4. **Health check** - `curl http://localhost:5000/health`

---

## 📚 Recursos Externos

### MongoDB
- [Documentación MongoDB](https://docs.mongodb.com/)
- [MongoDB Atlas (Cloud)](https://www.mongodb.com/cloud/atlas)
- [Mongoose ODM](https://mongoosejs.com/)

### Express
- [Express.js Docs](https://expressjs.com/)
- [Express Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

### JWT
- [JWT.io](https://jwt.io/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)

### Google Gemini
- [Google AI Studio](https://ai.google.dev)
- [Gemini API Docs](https://ai.google.dev/docs)

---

## ✅ Checklist de Configuración

- [ ] MongoDB instalado o Atlas configurado
- [ ] Archivo `.env` en carpeta `backend/` completado
- [ ] Dependencias instaladas (`npm install`)
- [ ] Frontend ejecutándose en puerto 3000
- [ ] Backend en puerto 5000
- [ ] Health check respondiendo
- [ ] API Rest accesible
- [ ] JWT funcionando
- [ ] BD guardando datos

---

## 📊 Estadísticas

| Métrica | Valor |
|---------|-------|
| **Endpoints** | 16 |
| **Modelos** | 3 |
| **Documentos** | 7 |
| **Líneas de Código** | ~1,500 |
| **Archivos TypeScript** | 13 |
| **Versión** | 1.0.0 Beta |
| **Status** | ✅ Completo |

---

## 🎯 Próximos Pasos

### Corto Plazo (Esta Semana)
1. Revisar toda la documentación
2. Instalar MongoDB
3. Ejecutar backend
4. Probar endpoints con cURL
5. Conectar frontend

### Mediano Plazo (Este Mes)
1. Testing completo
2. Mejoras de UX
3. Optimización de performance
4. Deploy a servidor

### Largo Plazo (Este Año)
1. Nuevas features
2. Escalabilidad
3. CI/CD
4. Docker

---

## 📝 Notas Importantes

⚠️ **Para Producción:**
- Cambiar `JWT_SECRET` con valor seguro
- Usar MongoDB Atlas o instancia dedicada
- Configurar HTTPS
- Agregar rate limiting
- Configurar logs y monitoring

💡 **Best Practices:**
- Mantener `.env` seguro (no versionarlo)
- Usar variables de entorno para secretos
- Revisar logs regularmente
- Hacer backups de BD
- Documentar cambios

---

## 📄 Versión & Historial

**Versión Actual:** 1.0.0 Beta
**Fecha:** 10 de Diciembre de 2025
**Último Actualizado:** 10/12/2025

**Cambios Incluidos:**
- ✅ Backend completo con Express
- ✅ MongoDB integrado
- ✅ Autenticación JWT
- ✅ 16 Endpoints API
- ✅ Google Gemini Integration
- ✅ Documentación exhaustiva

---

## 🙏 Gracias

Gracias por usar **LíderPlan**. 

Este proyecto fue creado con el objetivo de facilitar la planificación estratégica usando tecnologías modernas y mejores prácticas de desarrollo.

**¡Esperamos que sea de mucha utilidad!** 🚀

---

**Realizado por:** GitHub Copilot
**Stack:** Node.js + Express + MongoDB + TypeScript
**Licencia:** MIT (Puedes usar libremente)

