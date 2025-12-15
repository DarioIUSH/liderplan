# 📋 GUÍA DE VALIDACIÓN MANUAL - Agregar Actividad a Plan Existente

## Estado del Sistema
- ✅ Backend: http://localhost:5000 (corriendo)
- ✅ Frontend: http://localhost:3000 (corriendo)
- ✅ MongoDB: Conectada y funcionando

---

## 🔍 Pasos para Validar

### 1. Ingresar a la Aplicación
1. Abre http://localhost:3000 en tu navegador
2. Inicia sesión con:
   - **Email**: `admin@liderplan.com`
   - **Contraseña**: `Admin123!`

### 2. Buscar Plan con 2 Actividades
1. En el dashboard, localiza el plan que tiene **exactamente 2 actividades**
   - Desde la imagen adjunta, vimos el plan: **"Mejor la infraestructura Tecnológica"**
   - Este plan tiene 2 actividades actualmente

2. Haz click en el plan para abrirlo

### 3. Agregar Nueva Actividad
1. Verás el plan con sus 2 actividades
2. Busca el botón **"Agregar Nueva Actividad"** (como se ve en la imagen)
3. Completa el formulario con:
   - **Actividad**: "Validación de Persistencia en BD - [Tu fecha/hora]"
   - **Responsable**: Tu nombre o "Sistema"
   - **Área**: "SGI"
   - **Fecha Inicio**: 2025-12-25
   - **Fecha Fin**: 2025-12-31
   - **Recursos**: "Sistema de Testing"

4. Haz click en **"Guardar Actividad"**

### 4. Verificar en la UI
- El plan debe mostrar ahora **3 actividades** (2 anteriores + 1 nueva)
- La nueva actividad debe aparecer en la tabla

### 5. Verificar Persistencia en MongoDB

#### Opción A: MongoDB Compass
1. Abre **MongoDB Compass**
2. Conecta a: `mongodb://localhost:27017`
3. Navega a:
   ```
   Database: liderplan
   Collection: plans
   ```
4. Busca el plan por nombre (desde el filtro)
5. Verifica que `activities` array tenga 3 elementos
6. Ahora navega a:
   ```
   Collection: activities
   ```
7. Busca actividades por `planId` (filtra por el ID del plan)
8. Deberías ver 3 documentos de actividades

#### Opción B: mongosh (Terminal)
```bash
# Conectar a MongoDB
mongosh

# Seleccionar base de datos
use liderplan

# Ver planes
db.plans.find({}, {name: 1, activities: 1}).pretty()

# Copiar el _id del plan y buscar sus actividades
db.activities.find({planId: ObjectId("PASTE_PLAN_ID_HERE")}).pretty()

# Contar actividades del plan
db.activities.find({planId: ObjectId("PASTE_PLAN_ID_HERE")}).count()
```

### 6. Cerrar y Reabrirla Sesión (Validar Persistencia Completa)
1. Haz click en tu perfil → **Logout**
2. Vuelve a ingresar con las mismas credenciales
3. Abre el mismo plan
4. Verifica que siga mostrando las **3 actividades**
5. Incluida la nueva que acabas de crear

---

## ✅ Criterios de Validación Exitosa

| Aspecto | Esperado | Estado |
|---------|----------|--------|
| Actividad se muestra en UI | Sí, como tercera fila | [ ] |
| Plan muestra 3 actividades | Sí | [ ] |
| En MongoDB plans.activities | Array con 3 _id | [ ] |
| En MongoDB activities | 3 documentos | [ ] |
| Persiste tras cerrar sesión | Sí, sigue visible | [ ] |
| Datos en BD coinciden con UI | Sí | [ ] |

---

## 📸 Evidencia a Tomar

Cuando hayas completado la validación, toma screenshots de:

1. **UI del Plan con 3 actividades**
   - Mostrando la nueva actividad agregada

2. **MongoDB Compass**
   - Documento del plan con array de 3 actividades
   - Lista de 3 documentos de activities

3. **Tras logout/login**
   - Plan sigue mostrando las 3 actividades

---

## 🔧 Solución de Problemas

### Si la actividad no se guarda:
- Verifica que el token sea válido (revisa console del navegador)
- Comprueba que el backend esté respondiendo: http://localhost:5000/health
- Mira la consola del servidor backend para mensajes de error

### Si MongoDB no tiene los datos:
- Verifica la conexión: `mongosh --eval "db.adminCommand('ping')"`
- Confirma que la BD `liderplan` existe: `mongosh liderplan --eval "db.plans.count()"`

### Si el plan no persiste tras cerrar sesión:
- Vacía el cache del navegador (Ctrl+Shift+Delete)
- Verifica que localStorage no tenga datos locales conflictivos

---

## 📋 Resumen de Cambios de Código

Los siguientes archivos fueron modificados para soportar esto:

### Backend
- ✅ `planController.ts`: Método `updatePlan()` maneja agregar/actualizar actividades
- ✅ `models/Plan.ts`: Relación con activities colección
- ✅ `models/Activity.ts`: Campo `planId` vincula a plan

### Frontend
- ✅ `App.tsx`: Función `handleUpdatePlan()` envía cambios a API
- ✅ `CreatePlanForm.tsx`: Modal para agregar actividades

### API Endpoints
```
PUT /api/plans/:planId
- Actualiza plan y sus actividades
- Elimina actividades antiguas y crea nuevas
- Retorna plan con activities pobladas
```

---

**Fecha**: 11 de Diciembre 2025  
**Estado**: 🟢 Listo para validar
