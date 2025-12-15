import fetch from 'node-fetch';

const API_URL = 'http://localhost:5000';
const credentials = {
  email: 'dario.ocampo@salazaryherrera.edu.co',
  password: 'Dalompo@2022'
};

async function testDeleteActivity() {
  try {
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║  🧪 TEST: Eliminar Actividad           ║');
    console.log('╚════════════════════════════════════════╝\n');

    // 1. Login
    console.log('1️⃣  Autenticándose...');
    const loginRes = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    if (!loginRes.ok) {
      throw new Error('Login failed: ' + await loginRes.text());
    }

    const { token } = await loginRes.json();
    console.log('   ✅ Autenticación exitosa\n');

    // 2. Get existing plans
    console.log('2️⃣  Obteniendo planes...');
    const plansRes = await fetch(`${API_URL}/api/plans`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!plansRes.ok) {
      throw new Error('Failed to get plans');
    }

    const plans = await plansRes.json();
    if (plans.length === 0) {
      throw new Error('No plans found. Please create one first.');
    }

    const plan = plans[0];
    console.log(`   ✅ Plan encontrado: ${plan.project}`);
    console.log(`   📊 Actividades antes: ${plan.activities.length}\n`);

    if (plan.activities.length === 0) {
      throw new Error('Plan has no activities to delete');
    }

    // 3. Delete first activity
    const activityToDelete = plan.activities[0];
    console.log(`3️⃣  Eliminando actividad: ${activityToDelete._id}`);
    
    const deleteRes = await fetch(`${API_URL}/api/activities/${activityToDelete._id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!deleteRes.ok) {
      const errorText = await deleteRes.text();
      throw new Error('Delete failed: ' + errorText);
    }

    console.log('   ✅ Actividad eliminada del backend\n');

    // 4. Verify deletion
    console.log('4️⃣  Verificando eliminación...');
    const updatedPlanRes = await fetch(`${API_URL}/api/plans/${plan._id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!updatedPlanRes.ok) {
      throw new Error('Failed to fetch updated plan');
    }

    const updatedPlan = await updatedPlanRes.json();
    console.log(`   ✅ Actividades después: ${updatedPlan.activities.length}`);
    
    if (updatedPlan.activities.length === plan.activities.length - 1) {
      console.log('\n✨ TEST EXITOSO: La actividad fue eliminada correctamente de la base de datos\n');
    } else {
      throw new Error('Activity was not properly removed from plan');
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message, '\n');
    process.exit(1);
  }
}

testDeleteActivity();
