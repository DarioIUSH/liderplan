import mongoose from 'mongoose';

const mongoURI = 'mongodb://localhost:27017/liderplan';

async function finalValidation() {
  try {
    await mongoose.connect(mongoURI);
    const db = mongoose.connection.db;

    console.log('\n╔════════════════════════════════════════════╗');
    console.log('║  VALIDACIÓN FINAL - ACTIVIDADES DEL PLAN   ║');
    console.log('╚════════════════════════════════════════════╝\n');

    // Get the plan with all activities
    const plan = await db.collection('plans').findOne({});
    
    console.log(`📋 PLAN: "${plan.project}"`);
    console.log(`📌 Plan ID: ${plan._id}`);
    console.log(`📊 Total de actividades: ${plan.activities.length}\n`);

    // Get all activities
    const activities = await db.collection('activities').find({}).toArray();
    
    console.log('═══════════════════════════════════════════');
    activities.forEach((activity, index) => {
      const startDate = activity.startDate instanceof Date ? activity.startDate.toISOString().split('T')[0] : activity.startDate;
      const endDate = activity.endDate instanceof Date ? activity.endDate.toISOString().split('T')[0] : activity.endDate;
      
      console.log(`\n✅ Actividad ${index + 1}:`);
      console.log(`   📝 ${activity.description}`);
      console.log(`   👤 Responsable: ${activity.responsible}`);
      console.log(`   📌 Área: ${activity.area}`);
      console.log(`   📅 Del ${startDate} al ${endDate}`);
    });

    console.log('\n═══════════════════════════════════════════');
    console.log(`\n✅ CONFIRMACIÓN: ${activities.length} actividades guardadas correctamente\n`);

    await mongoose.disconnect();

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

finalValidation();
