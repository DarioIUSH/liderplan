// Script para limpiar la base de datos y validar
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function cleanAndValidate() {
  try {
    await client.connect();
    console.log('\n✓ Conectado a MongoDB');
    
    const db = client.db('liderplan');
    
    // Limpiar colecciones
    console.log('\nLimpiando base de datos...');
    await db.collection('activities').deleteMany({});
    console.log('✓ Actividades eliminadas');
    
    await db.collection('plans').deleteMany({});
    console.log('✓ Planes eliminados');
    
    // Verificar que estén vacías
    const plansCount = await db.collection('plans').countDocuments();
    const activitiesCount = await db.collection('activities').countDocuments();
    
    console.log('\n═══════════════════════════════════════');
    console.log(`✓ Base de datos limpia`);
    console.log(`  Planes: ${plansCount}`);
    console.log(`  Actividades: ${activitiesCount}`);
    console.log('═══════════════════════════════════════\n');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

cleanAndValidate();
