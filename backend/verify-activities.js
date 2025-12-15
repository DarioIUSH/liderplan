import mongoose from 'mongoose';

const mongoURI = 'mongodb://localhost:27017/liderplan';

async function verifyAndAddActivity() {
  try {
    await mongoose.connect(mongoURI);
    const db = mongoose.connection.db;

    console.log('\n📊 VERIFICANDO ACTIVIDADES EXISTENTES...\n');

    // Get all plans
    const plans = await db.collection('plans').find({}).toArray();
    
    if (plans.length === 0) {
      console.log('❌ No hay planes');
      await mongoose.disconnect();
      return;
    }

    const plan = plans[0];
    console.log(`✅ Plan encontrado: "${plan.project}"`);
    console.log(`📌 Plan ID: ${plan._id}`);
    console.log(`📊 Actividades en el array del plan: ${plan.activities.length}`);

    // Get all activities
    const activities = await db.collection('activities').find({}).toArray();
    console.log(`\n📋 Actividades totales en BD: ${activities.length}`);
    
    activities.forEach((activity, index) => {
      console.log(`  ${index + 1}. ${activity.description} - ${activity.responsible}`);
    });

    // Now create the 4th activity
    console.log('\n✏️  Creando CUARTA actividad...\n');
    
    const newActivity = {
      description: 'Cuarta actividad - Seguimiento y control',
      responsible: 'Ana Martínez',
      area: 'Seguimiento',
      duration: 4,
      startDate: new Date('2026-01-03'),
      endDate: new Date('2026-01-07'),
      resources: 'Herramientas de control',
      priority: 'MEDIA',
      status: 'No iniciada',
      planId: plan._id,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const activityResult = await db.collection('activities').insertOne(newActivity);
    const activityId = activityResult.insertedId;

    console.log('✅ Cuarta actividad creada');
    console.log(`📌 ID: ${activityId}`);
    console.log(`📝 ${newActivity.description}`);
    console.log(`👤 ${newActivity.responsible}`);

    // Add to plan
    const updatedPlan = await db.collection('plans').findOneAndUpdate(
      { _id: plan._id },
      {
        $push: { activities: activityId },
        $set: { updatedAt: new Date() }
      },
      { returnDocument: 'after' }
    );

    console.log('\n🔗 Asociada al plan');
    console.log(`📊 Total de actividades ahora: ${updatedPlan.value.activities.length}`);

    // Final count
    console.log('\n✅ RESUMEN FINAL:');
    const finalActivities = await db.collection('activities').find({}).toArray();
    console.log(`   Actividades totales en BD: ${finalActivities.length}`);
    console.log(`   Actividades en el plan: ${updatedPlan.value.activities.length}`);

    await mongoose.disconnect();

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verifyAndAddActivity();
