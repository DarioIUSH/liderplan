# 🚀 VALIDACIÓN MANUAL - Estado Actual

**Fecha**: 11 de Diciembre 2025  
**Hora de Inicio**: Acabamos de reiniciar los servidores

---

## ✅ Servidores en Línea

| Servicio | Puerto | Estado | URL |
|----------|--------|--------|-----|
| Backend (Express) | 5000 | 🟢 Corriendo | http://localhost:5000 |
| Frontend (Vite) | 3000 | 🟢 Corriendo | http://localhost:3000 |
| MongoDB | 27017 | 🟢 Corriendo | mongodb://localhost:27017 |

---

## 📋 PASOS PARA VALIDAR

### PASO 1: Acceder a la Aplicación
1. Abre en tu navegador: **http://localhost:3000**
2. Deberías ver la pantalla de login

### PASO 2: Iniciar Sesión
- **Email**: `admin@liderplan.com`
- **Contraseña**: `Admin123!`
- Click en **Ingresar**

### PASO 3: Localizar Plan con 2 Actividades
1. Una vez en el dashboard, busca el plan **"Mejor la infraestructura Tecnológica"** (como vimos en la imagen)
2. Deberías ver que tiene **2 actividades**:
   - "Levantamiento del la infraestructura actual" - Responsable: Dario Ocampo
   - (+ otra actividad)
3. Click en el plan para abrirlo

### PASO 4: Agregar Nueva Actividad
1. Dentro del plan, busca el botón **"Agregar Nueva Actividad"** (modal que vimos en tu screenshot)
2. Completa el formulario con estos datos:
   ```
   ACTIVIDAD: Validación de Persistencia en Base de Datos
   RESPONSABLE: Tu nombre o "Test Admin"
   ÁREA: SGI
   FECHA INICIO: 11/12/2025 (o cualquier fecha)
   FECHA FIN: 15/12/2025
   RECURSOS: Sistema de Testing
   ```
3. Click en **"Guardar Actividad"**

### PASO 5: Verificar en la UI
- ✅ El plan debe mostrar ahora **3 actividades** en lugar de 2
- ✅ La nueva actividad debe ser visible en la tabla
- ✅ Todos los campos deben coincidir con lo que ingresaste

### PASO 6: Verificar Persistencia (Cerrar Sesión)
1. Scroll hasta abajo o top derecha
2. Busca botón **Logout** / **Cerrar Sesión**
3. Click en él
4. Vuelve a hacer login con las mismas credenciales
5. Abre el mismo plan nuevamente
6. ✅ Verifica que **siga mostrando 3 actividades**
   - Si las sigue mostrando = **GUARDADAS EN BD** ✅

### PASO 7: Verificar en MongoDB (Opcional pero Recomendado)

#### Si tienes MongoDB Compass instalado:
1. Abre MongoDB Compass
2. Conecta a: `mongodb://localhost:27017`
3. Navega a: **liderplan → plans**
4. Busca el plan por nombre (usa Search)
5. En el documento, verifica que `activities` tenga **3 elementos**
6. Copia el `_id` del plan
7. Ve a colección **activities**
8. Filtra por: `{planId: ObjectId("PEGA_EL_ID_AQUI")}`
9. Deberías ver **3 documentos de actividades**

#### Si prefieres terminal (mongosh):
```bash
# Abre PowerShell y ejecuta:
mongosh

# En la consola de mongosh:
use liderplan
db.plans.findOne({name: /infraestructura/i})  # Buscar el plan

# Copiar el _id y buscar actividades
db.activities.find({planId: ObjectId("PEGA_EL_ID_AQUI")}).pretty()

# O contar directamente
db.activities.find({planId: ObjectId("PEGA_EL_ID_AQUI")}).count()
```

---

## 📸 QUÉ SCREENSHOT TOMAR COMO EVIDENCIA

1. **Dashboard después del login**
   - Mostrando el plan "Mejor la infraestructura Tecnológica"

2. **Plan abierto con 3 actividades**
   - Mostrando la nueva actividad agregada

3. **Después de logout/login**
   - Mismo plan aún con 3 actividades

4. **MongoDB Compass** (si lo usas)
   - Documento del plan con 3 activities en el array
   - Colección activities mostrando 3 documentos

---

## 🔍 COSAS IMPORTANTES A VERIFICAR

| Item | ¿Se Cumple? | Notas |
|------|------------|-------|
| Nueva actividad aparece en UI | [ ] | Debe ser tercera fila de la tabla |
| Plan muestra 3 en lugar de 2 | [ ] | Visible en el contador |
| Actividad persiste tras logout | [ ] | Sigue mostrando tras relogin |
| MongoDB contiene 3 actividades | [ ] | Verificar en Compass o mongosh |
| Datos coinciden UI ↔ BD | [ ] | Descripción, responsable, etc. |

---

## ❌ SI ALGO FALLA

### La actividad no se guarda:
1. Abre la consola del navegador (**F12 → Console**)
2. Busca mensajes de error rojo
3. Copia el error y comparte

### El backend no responde:
1. Verifica que vea: `✓ Server running on http://localhost:5000`
2. Prueba: http://localhost:5000/health en el navegador
3. Deberías ver: `{"status":"OK","message":"Server is running"}`

### MongoDB no contiene los datos:
1. Ejecuta en mongosh: `db.plans.count()` y `db.activities.count()`
2. Si son 0, hay problema de conexión
3. Verifica que MongoDB esté corriendo

---

## 🎯 RESULTADO ESPERADO

**Si todo funciona correctamente:**
- ✅ Agregas 1 actividad → Ves 3 en total
- ✅ Cierras sesión → Reabre y sigue siendo 3
- ✅ MongoDB tiene 3 documentos de actividades

**Esto significa:**
- ✅ Frontend envía datos correctamente a la API
- ✅ Backend guarda en MongoDB
- ✅ Datos persisten en la base de datos
- ✅ **LA VALIDACIÓN ES EXITOSA** 🎉

---

## 📞 ESTADO ACTUAL

```
🟢 Backend:  http://localhost:5000/health
🟢 Frontend: http://localhost:3000
🟢 MongoDB: Conectada
🟢 Listo para validar
```

**Adelante con la validación manual!**
