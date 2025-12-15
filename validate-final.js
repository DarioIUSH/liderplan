// Script para validar que las 3 actividades estén guardadas
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function validateActivities() {
  try {
    await client.connect();
    console.log('\n✓ Conectado a MongoDB\n');
    
    const db = client.db('liderplan');
    
    // Obtener todos los planes
    const plans = await db.collection('plans').find({}).toArray();
    
    if (plans.length === 0) {
      console.log('⚠️  No hay planes en la base de datos');
      console.log('Por favor, crear un plan primero en la aplicación\n');
      return;
    }
    
    console.log(`📋 PLANES EN LA BASE DE DATOS: ${plans.length}\n`);
    
    for (const plan of plans) {
      console.log(`Plan: "${plan.name}"`);
      console.log(`  ID: ${plan._id}`);
      console.log(`  Actividades asociadas: ${plan.activities.length}`);
      console.log('');
    }
    
    // Obtener todas las actividades
    const activities = await db.collection('activities').find({}).toArray();
    console.log(`📝 ACTIVIDADES TOTALES EN BD: ${activities.length}\n`);
    
    // Para cada plan, mostrar sus actividades
    for (const plan of plans) {
      const planActivities = await db.collection('activities')
        .find({ planId: plan._id })
        .toArray();
      
      console.log(`\n═══════════════════════════════════════`);
      console.log(`Plan: "${plan.name}"`);
      console.log(`═══════════════════════════════════════`);
      
      if (planActivities.length === 0) {
        console.log('⚠️  Este plan no tiene actividades');
      } else {
        console.log(`✓ ${planActivities.length} actividades encontradas:\n`);
        planActivities.forEach((activity, idx) => {
          console.log(`  [${idx + 1}] ${activity.description}`);
          console.log(`      Responsable: ${activity.responsible}`);
          console.log(`      Área: ${activity.area}`);
          console.log(`      Estado: ${activity.status}`);
          console.log(`      Prioridad: ${activity.priority}`);
        });
      }
    }
    
    // Validación final
    const plansWithThree = plans.filter(p => p.activities.length === 3);
    
    if (plansWithThree.length > 0) {
      console.log(`\n\n✅ VALIDACIÓN EXITOSA ✅`);
      console.log(`Se encontró ${plansWithThree.length} plan(es) con 3 actividades`);
      plansWithThree.forEach(p => {
        console.log(`  - "${p.name}"`);
      });
    } else {
      console.log(`\n⚠️  No se encontraron planes con exactamente 3 actividades`);
    }
    console.log('');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

validateActivities();
