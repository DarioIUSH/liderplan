// Script para interceptar y ver qué se envía en el request
const originalFetch = window.fetch;

window.fetch = function(...args) {
  if (args[0].includes('/api/plans')) {
    console.log('🔴 INTERCEPTADO: POST /api/plans');
    console.log('Body:', args[1].body);
    try {
      const body = JSON.parse(args[1].body);
      console.log('📦 Parsed body:', body);
      console.log(`   - Actividades: ${body.activities.length}`);
      body.activities.forEach((act, i) => {
        console.log(`   [${i+1}] ${act.description} - ${act.responsible}`);
      });
    } catch (e) {
      console.error('Error parsing body:', e);
    }
  }
  return originalFetch.apply(this, args);
};

console.log('✅ Debug script cargado - Monitoreando POST /api/plans');
