import mongoose from 'mongoose';

async function checkDatabase() {
  try {
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║         VALIDACIÓN DE BASE DE DATOS MONGODB             ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    // Conectar a MongoDB
    await mongoose.connect('mongodb://localhost:27017/liderplan');
    console.log('✅ Conectado a MongoDB\n');

    const db = mongoose.connection.db;

    // Contar documentos
    const plansCount = await db.collection('plans').countDocuments();
    const activitiesCount = await db.collection('activities').countDocuments();
    const usersCount = await db.collection('users').countDocuments();

    console.log('📊 RESUMEN DE COLECCIONES:');
    console.log(`   • Plans: ${plansCount}`);
    console.log(`   • Activities: ${activitiesCount}`);
    console.log(`   • Users: ${usersCount}\n`);

    // Mostrar planes
    console.log('═══════════════════════════════════════════════════════');
    console.log('📋 PLANES:');
    console.log('═══════════════════════════════════════════════════════');
    const plans = await db.collection('plans').find({}).toArray();
    
    if (plans.length === 0) {
      console.log('   ❌ No hay planes registrados\n');
    } else {
      plans.forEach((plan, idx) => {
        console.log(`\n   Plan ${idx + 1}:`);
        console.log(`   ├─ ID: ${plan._id}`);
        console.log(`   ├─ Nombre: ${plan.name}`);
        console.log(`   ├─ Proyecto: ${plan.project}`);
        console.log(`   ├─ Objetivo: ${plan.goal}`);
        console.log(`   ├─ Origen: ${plan.origin}`);
        console.log(`   ├─ SubOrigen: ${plan.subOrigin || 'N/A'}`);
        console.log(`   ├─ Usuario: ${plan.userId}`);
        console.log(`   ├─ Actividades (IDs): ${Array.isArray(plan.activities) ? plan.activities.length : 0}`);
        if (Array.isArray(plan.activities) && plan.activities.length > 0) {
          plan.activities.forEach((actId, i) => {
            console.log(`   │  └─ [${i + 1}] ${actId}`);
          });
        }
        console.log(`   ├─ Creado: ${plan.createdAt}`);
        console.log(`   └─ Actualizado: ${plan.updatedAt}`);
      });
    }

    // Mostrar actividades
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('✅ ACTIVIDADES:');
    console.log('═══════════════════════════════════════════════════════');
    const activities = await db.collection('activities').find({}).toArray();
    
    if (activities.length === 0) {
      console.log('   ❌ No hay actividades registradas\n');
    } else {
      activities.forEach((act, idx) => {
        console.log(`\n   Actividad ${idx + 1}:`);
        console.log(`   ├─ ID: ${act._id}`);
        console.log(`   ├─ Descripción: ${act.description}`);
        console.log(`   ├─ Responsable: ${act.responsible}`);
        console.log(`   ├─ Área: ${act.area}`);
        console.log(`   ├─ Inicio: ${act.startDate}`);
        console.log(`   ├─ Fin: ${act.endDate}`);
        console.log(`   ├─ Prioridad: ${act.priority}`);
        console.log(`   ├─ Estado: ${act.status}`);
        console.log(`   ├─ Plan ID: ${act.planId}`);
        console.log(`   ├─ Creado: ${act.createdAt}`);
        console.log(`   └─ Actualizado: ${act.updatedAt}`);
      });
    }

    // Análisis de relación
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('🔗 ANÁLISIS DE RELACIONES:');
    console.log('═══════════════════════════════════════════════════════');
    
    if (plans.length > 0) {
      const lastPlan = plans[plans.length - 1];
      console.log(`\nÚltimo plan creado: "${lastPlan.name}"`);
      console.log(`   ├─ Dice tener ${Array.isArray(lastPlan.activities) ? lastPlan.activities.length : 0} actividades en el array`);
      
      // Buscar actividades de este plan
      const planActivities = await db.collection('activities')
        .find({ planId: lastPlan._id }).toArray();
      
      console.log(`   ├─ Actividades encontradas en DB: ${planActivities.length}`);
      
      if (planActivities.length > 0) {
        console.log(`   └─ Actividades:`);
        planActivities.forEach((act, i) => {
          console.log(`      [${i + 1}] ${act.description}`);
        });
      }
    }

    console.log('\n═══════════════════════════════════════════════════════\n');
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkDatabase();
