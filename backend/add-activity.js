import mongoose from 'mongoose';

const mongoURI = 'mongodb://localhost:27017/liderplan';

async function addActivityToExistingPlan() {
  try {
    console.log('\n🔗 Conectando a MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('✅ Conectado a MongoDB');

    const db = mongoose.connection.db;

    // 1. Get the existing plan
    console.log('\n📋 Buscando plan existente...');
    const plan = await db.collection('plans').findOne({});
    
    if (!plan) {
      console.log('❌ No hay planes disponibles');
      await mongoose.disconnect();
      return;
    }

    console.log(`✅ Plan encontrado: "${plan.project}"`);
    console.log(`📌 Plan ID: ${plan._id}`);
    console.log(`📊 Actividades actuales: ${plan.activities.length}`);

    // 2. Create a new activity
    console.log('\n✏️  Creando tercera actividad...');
    const newActivity = {
      description: 'Tercera actividad de prueba - Evaluación final',
      responsible: 'Carlos López',
      area: 'Gestión',
      duration: 5,
      startDate: new Date('2025-12-28'),
      endDate: new Date('2026-01-02'),
      resources: 'Materiales de evaluación',
      priority: 'MEDIA',
      status: 'No iniciada',
      planId: plan._id,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const activityResult = await db.collection('activities').insertOne(newActivity);
    const activityId = activityResult.insertedId;

    console.log('✅ Actividad creada exitosamente');
    console.log(`📌 Activity ID: ${activityId}`);
    console.log(`📝 Descripción: ${newActivity.description}`);
    console.log(`👤 Responsable: ${newActivity.responsible}`);

    // 3. Add activity to plan's activities array
    console.log('\n🔗 Asociando actividad al plan...');
    const updatedPlan = await db.collection('plans').findOneAndUpdate(
      { _id: plan._id },
      {
        $push: { activities: activityId },
        $set: { updatedAt: new Date() }
      },
      { returnDocument: 'after' }
    );

    console.log('✅ Plan actualizado exitosamente');
    console.log(`📊 Total de actividades: ${updatedPlan.value.activities.length}`);
    console.log(`\n📋 Actividades del plan:`);
    updatedPlan.value.activities.forEach((id, index) => {
      console.log(`  ${index + 1}. ${id}`);
    });

    console.log('\n✅ ¡Operación completada exitosamente!');
    await mongoose.disconnect();

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

addActivityToExistingPlan();
