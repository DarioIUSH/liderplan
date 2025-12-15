// Script para validar actividades en MongoDB
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function validateActivities() {
  try {
    await client.connect();
    console.log('\n✓ Conectado a MongoDB');
    
    const db = client.db('liderplan');
    
    // Obtener todos los planes
    const plans = await db.collection('plans').find({}).toArray();
    console.log(`\n═══════════════════════════════════════`);
    console.log(`PLANES EN LA BASE DE DATOS: ${plans.length}`);
    console.log(`═══════════════════════════════════════`);
    
    plans.forEach((plan, idx) => {
      console.log(`\n[${idx + 1}] ${plan.name}`);
      console.log(`    ID: ${plan._id}`);
      console.log(`    Actividades asociadas: ${plan.activities.length}`);
    });
    
    // Obtener todas las actividades
    const activities = await db.collection('activities').find({}).toArray();
    console.log(`\n═══════════════════════════════════════`);
    console.log(`ACTIVIDADES EN LA BASE DE DATOS: ${activities.length}`);
    console.log(`═══════════════════════════════════════`);
    
    activities.forEach((activity, idx) => {
      console.log(`\n[${idx + 1}] ${activity.description}`);
      console.log(`    Responsable: ${activity.responsible}`);
      console.log(`    Área: ${activity.area}`);
      console.log(`    Plan ID: ${activity.planId}`);
    });
    
    // Buscar plan con 3 actividades
    const planWith3 = plans.find(p => p.activities.length === 3);
    
    if (planWith3) {
      console.log(`\n═══════════════════════════════════════`);
      console.log(`✓ VALIDACION: PLAN CON 3 ACTIVIDADES`);
      console.log(`═══════════════════════════════════════`);
      console.log(`\n✓ Plan: ${planWith3.name}`);
      console.log(`✓ ID: ${planWith3._id}`);
      console.log(`✓ Actividades en el array: ${planWith3.activities.length}`);
      
      // Contar actividades de este plan en la colección
      const planActivitiesCount = await db.collection('activities')
        .countDocuments({ planId: planWith3._id });
      
      console.log(`✓ Documentos en colección activities: ${planActivitiesCount}`);
      
      // Obtener las actividades del plan
      const planActivities = await db.collection('activities')
        .find({ planId: planWith3._id })
        .toArray();
      
      console.log(`\nActividades guardadas:`);
      planActivities.forEach((act, idx) => {
        console.log(`  [${idx + 1}] ${act.description}`);
        console.log(`      Responsable: ${act.responsible}`);
        console.log(`      Área: ${act.area}`);
      });
      
      if (planActivitiesCount === 3) {
        console.log(`\n═══════════════════════════════════════`);
        console.log(`✓✓✓ ¡VALIDACION EXITOSA! ✓✓✓`);
        console.log(`═══════════════════════════════════════`);
        console.log(`Las 3 actividades están guardadas en MongoDB`);
        console.log(`═══════════════════════════════════════\n`);
      }
    } else {
      console.log(`\n⚠ No se encontró plan con exactamente 3 actividades`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

validateActivities();
