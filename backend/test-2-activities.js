import fetch from 'node-fetch';

async function testPlanCreation() {
  try {
    console.log('\n╔══════════════════════════════════════════════════╗');
    console.log('║  STEP 1: Login para obtener token                ║');
    console.log('╚══════════════════════════════════════════════════╝\n');

    // Hacer login
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'dario.ocampo@salazaryherrera.edu.co',
        password: 'Dalompo@2022'
      }),
    });

    if (!loginResponse.ok) {
      console.log('❌ Error en login:', await loginResponse.json());
      process.exit(1);
    }

    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✅ Login exitoso');
    console.log('📋 Token obtenido:', token.substring(0, 50) + '...');

    console.log('\n╔══════════════════════════════════════════════════╗');
    console.log('║  STEP 2: Crear Plan con 2 Actividades            ║');
    console.log('╚══════════════════════════════════════════════════╝\n');

    const planData = {
      name: "Plan Test 2 Actividades",
      project: "Proyecto de Prueba",
      goal: "Validar que se guarden 2 actividades",
      origin: "Plan de mejoramiento",
      subOrigin: "CP-Infraestructura Física y Tecnológica",
      activities: [
        {
          description: "Primera actividad de prueba",
          responsible: "Juan Pérez",
          area: "Infraestructura y Dlllo Tec",
          startDate: "2025-12-15",
          endDate: "2025-12-20",
          resources: "Equipos de cómputo",
          priority: "MEDIA",
          status: "No iniciada",
          completionPercentage: 0,
          comments: [],
          evidence: []
        },
        {
          description: "Segunda actividad de prueba",
          responsible: "María García",
          area: "Infraestructura y Dlllo Tec",
          startDate: "2025-12-21",
          endDate: "2025-12-27",
          resources: "Personal técnico",
          priority: "ALTA",
          status: "No iniciada",
          completionPercentage: 0,
          comments: [],
          evidence: []
        }
      ]
    };

    console.log('📤 Enviando solicitud al servidor...');
    console.log('📋 Actividades a enviar: ' + planData.activities.length);
    planData.activities.forEach((act, i) => {
      console.log(`  [${i+1}] "${act.description}" - Responsable: "${act.responsible}"`);
    });

    const response = await fetch('http://localhost:5000/api/plans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(planData),
    });

    console.log(`\n📊 Response Status: ${response.status}`);

    if (!response.ok) {
      const errorData = await response.json();
      console.log('❌ Error:', errorData);
      process.exit(1);
    }

    const result = await response.json();
    console.log('✅ Plan guardado exitosamente');
    console.log('📋 Plan ID:', result.plan._id);
    console.log('📊 Actividades guardadas:', result.plan.activities.length);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testPlanCreation();
