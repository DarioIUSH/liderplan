import mongoose from 'mongoose';

const mongoURI = 'mongodb://localhost:27017/liderplan';

async function fixActivityRelation() {
  try {
    await mongoose.connect(mongoURI);
    const db = mongoose.connection.db;
    
    // Update the third activity to link it to the plan
    const activityId = new mongoose.Types.ObjectId('693b164db7fb679ea924336a');
    const planId = new mongoose.Types.ObjectId('693b14fa15d411eb825a3bcb');
    
    const result = await db.collection('activities').findOneAndUpdate(
      { _id: activityId },
      { $set: { planId: planId } },
      { returnDocument: 'after' }
    );
    
    if (result.value) {
      console.log('✅ Actividad actualizada correctamente:');
      console.log(`  Descripción: ${result.value.description}`);
      console.log(`  Plan ID: ${result.value.planId}`);
    } else {
      console.log('❌ No se encontró la actividad');
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixActivityRelation();
