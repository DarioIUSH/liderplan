import React, { useState, useEffect } from 'react';
import { Plan, Activity, ActivityStatus, ActivityPriority } from '../types';
import { Button } from './Button';
import { Trash2, Plus, AlertCircle, ArrowLeft } from 'lucide-react';

interface CreatePlanFormProps {
  onSave: (plan: Plan) => void;
  onCancel: () => void;
  initialPlan?: Plan;
}

const SUB_ORIGIN_DEVELOPMENT = [
  "Ruta Calidad y Excelencia",
  "Ruta Sostenibilidad",
  "Ruta Comunidades Internacionales e Interculturales de Aprendizaje"
];

const DEVELOPMENT_GOALS: Record<string, string[]> = {
  "Ruta Calidad y Excelencia": [
    "Implementada la gestión por procesos desde el 2025.",
    "Integrar todos los planes de dllo y mejora desde el 2024, con cumplimiento mayor al 80%.",
    "Autoevaluar los programas con fines de acreditación desde el 2025 con planes de mejoramiento sustentables",
    "Acreditar el 30 % de los programas",
    "Tener un un indicador de 32 estudiantes por profesor de tiempo completo de manera sostenible",
    "El 100% de los profesores de tiempo completo con nivel de inglés de B1 o más",
    "Cumplir sosteniblemente en un 80% el plan de contratación de profesores",
    "Al menos dos grupos de investigación categorizado en B por Escuela",
    "Al menos el 1% de los egresados, desde la cohortes 2024-1 serán emprendedores con impacto social y creadores de empleo.",
    "El 100% de los programas son sustentables",
    "Satisfacción del 80% de los egresados respecto a la calidad de su programa",
    "Proramas activos con registro único virtual y presencial por Escuela"
  ],
  "Ruta Sostenibilidad": [
    "Margen neto de excedentes del 15%: (Excedentes)/(Ingresos), Endeudamiento máximo 20%: (Total de pasivos sin ingresos recibidos por anticipado)/(activo total).Razón corriente de 180%: ((activo corriente)/(pasivo corriente))*100",
    "Definir e implementar un modelo de sostenibilidad para los ODS",
    "Carbono neutro de la comunidad universitaria al 2030."
  ],
  "Ruta Comunidades Internacionales e Interculturales de Aprendizaje": [
    "Multiproductos de Internacionalización e Interculturalidad autosostenibles o con excedentes",
    "80% de ejecución de los planes de mejoramiento de internacionalización e interculturalidad de los programas y del Centro",
    "100% de programas de pregrado y posgrado con cursos con componentes o reconocimientos internacionales.",
    "100% de los grupos de investigación con producción científica de carácter internacional o intercultural.",
    "Porcentaje de estudiantes y profesores que participan en comunidades internacionales e interculturales de aprendizaje con intercambio de multiproductos.",
    "Porcentaje de estudiantes y profesores por Escuela con movilidad nacional e internacional.",
    "Porcentaje de estudiantes graduados con titulaciones conjuntas o dobles.",
    "Porcentaje de profesores y estudiantes que dominan un segundo idioma al menos en B2."
  ]
};

const SUB_ORIGIN_IMPROVEMENT = [
  "CI-Mecanismos de Seleccción y Evaluación de Estudiantes",
  "CI-Mecanismos de Seleccción y Evaluación de Profesores",
  "CI-Estructura Administrativa y Académica",
  "CI-Cultura de la Autoevaluación",
  "CI-Programa de Egresados",
  "CI-Modelo de Bienestar",
  "CI-Recursos Suficientes para el Cumplimiento de las Metas",
  "CP-Denominación del Programa",
  "CP-Justificación del Programa",
  "CP-Aspectos Curriculares",
  "CP-Organización de Actividades Académicas y Proceso Formativo",
  "CP-Investigación, Innovación y/o Creación Artística y Cultural",
  "CP-Relación con el Sector Externo",
  "CP-Profesores",
  "CP-Medios Educativos",
  "CP-Infraestructura Física y Tecnológica",
  "No aplica"
];

const AREAS = [
  "Admisiones y Registro",
  "Biblioteca",
  "CAD",
  "Compras",
  "Comunicaciones y RRPP",
  "Contabilidad",
  "Dec. Escuela de Ciencias Adtivas. Soc. y Hnas.",
  "Dec. Escuela de Ciencias Creativas",
  "Dirección de Bienestar Institucional",
  "Dirección de Pastoral",
  "Educación Virtual",
  "Egresados",
  "Extensión",
  "Facturación y cartera",
  "Infraestructura y Dlllo Tec",
  "Internacionalización",
  "Líder CIIDE",
  "Mercadeo y Ventas",
  "Permanencia",
  "Planta Física",
  "Programa de Administración de Empresas",
  "Programa de Animación",
  "Programa de Comunicación Organizacional",
  "Programa de Derecho",
  "Programa de Diseño de Modas",
  "Programa de Diseño Gráfico",
  "Programa de Especialización en Cultura y Clima Organizacional",
  "Programa de Especialización en Gerencia de Mercadeo Estratégico",
  "Programa de Ingeniería de Sistemas",
  "Programa de Ingeniería Electrónica",
  "Programa de Ingeniería en Inteligencia de Negocios",
  "Programa de Ingeniería Industrial",
  "Programa de Mercadeo",
  "Programa de Negocios Internacionales",
  "Programa de Realización y Producción Musical",
  "Programa de Tecnología en Gestión de Mercadeo y Ventas",
  "Programa de Tecnología en Gestión de Negocios Internacionales",
  "Programa de Tecnología en Gestión del Talento Humano",
  "Programa de Tecnología en Gestión Empresarial",
  "Programa de Tecnología en Sistemas",
  "Secretaria General",
  "SGI",
  "SST",
  "Talento Humano",
  "Tesorería",
  "Vicerectoría Adtiva. y Fin.",
  "Vicerrectoría Académico",
  "Vicerrectoría Dllo Organizacional"
];

export const CreatePlanForm: React.FC<CreatePlanFormProps> = ({ onSave, onCancel, initialPlan }) => {
  // Plan Header Fields
  const [planName, setPlanName] = useState(initialPlan?.name || '');
  const [origin, setOrigin] = useState(initialPlan?.origin || '');
  const [subOrigin, setSubOrigin] = useState(initialPlan?.subOrigin || '');
  const [goal, setGoal] = useState(initialPlan?.goal || '');
  const [project, setProject] = useState(initialPlan?.project || '');
  const [isEditMode] = useState(!!initialPlan);
  
  const [error, setError] = useState<string | null>(null);

  // Activity Grid State - Inicializar con actividades del plan si está en edición
  const getInitialActivities = (): Activity[] => {
    if (initialPlan && initialPlan.activities && initialPlan.activities.length > 0) {
      return initialPlan.activities;
    }
    return [
      {
        id: crypto.randomUUID(),
        description: '',
        responsible: '',
        area: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        resources: '',
        priority: ActivityPriority.MEDIUM,
        status: ActivityStatus.NOT_STARTED,
        completionPercentage: 0,
        comments: [],
        evidence: []
      }
    ];
  };

  const [activities, setActivities] = useState<Activity[]>(getInitialActivities());

  const handleOriginChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOrigin(e.target.value);
    setSubOrigin(''); // Reset subOrigin when origin changes
    setGoal(''); // Reset goal when origin changes
  };
  
  const handleSubOriginChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSubOrigin(e.target.value);
    setGoal(''); // Reset goal when subOrigin changes to ensure valid selection
  };

  const handleAddActivityRow = () => {
    const newActivity = {
      id: crypto.randomUUID(),
      description: '',
      responsible: '',
      area: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      resources: '',
      priority: ActivityPriority.MEDIUM,
      status: ActivityStatus.NOT_STARTED,
      completionPercentage: 0,
      comments: [],
      evidence: []
    };
    setActivities([...activities, newActivity]);
    console.log('➕ Actividad agregada. Total:', activities.length + 1);
  };

  const handleRemoveActivityRow = (id: string) => {
    if (activities.length > 1) {
      setActivities(activities.filter(a => a.id !== id));
    }
  };

  const updateActivity = (id: string, field: keyof Activity, value: any) => {
    console.log(`📝 Actualizando actividad [${id}] campo "${field}" con valor "${value}"`);
    const updated = activities.map(a => a.id === id ? { ...a, [field]: value } : a);
    setActivities(updated);
    console.log(`   ✅ Estado de actividades ahora:`, updated.length, 'actividades');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║ SUBMIT DEL FORMULARIO INICIADO          ║');
    console.log('╚════════════════════════════════════════╝');
    
    if (!planName || !origin || !project || !goal) {
      setError("Los campos Nombre, Origen, Proyecto y Meta son obligatorios.");
      console.log('❌ Error: Campos obligatorios faltantes');
      return;
    }

    console.log('📋 TODAS las actividades en el formulario:', activities.length);
    console.log('📄 Estado completo de actividades:');
    console.log(JSON.stringify(activities, null, 2));
    
    activities.forEach((act, idx) => {
      console.log(`  [${idx+1}] desc="${act.description}" | resp="${act.responsible}" | area="${act.area}"`);
    });

    // Filtrar actividades que tengan al menos descripción y responsable
    const validActivities = activities.filter(a => {
      const isValid = a.description.trim() !== '' && a.responsible.trim() !== '';
      console.log(`  Actividad [${a.id}]: description="${a.description}" (trim="${a.description.trim()}") responsible="${a.responsible}" (trim="${a.responsible.trim()}") -> ${isValid ? '✅ VÁLIDA' : '❌ INVÁLIDA'}`);
      return isValid;
    });
    
    console.log('\n✓ Actividades válidas (con descripción y responsable):', validActivities.length);
    validActivities.forEach((act, idx) => {
      console.log(`  [${idx+1}] ${act.description} - ${act.responsible}`);
    });
    
    if (validActivities.length === 0) {
      setError("Debes agregar al menos una actividad con descripción y responsable.");
      console.log('❌ Error: Sin actividades válidas');
      return;
    }

    console.log('\n✅ Validación exitosa. Creando objeto Plan...');
    const newPlan: Plan = {
      id: initialPlan?.id || crypto.randomUUID(),
      name: planName,
      origin,
      subOrigin,
      goal,
      project,
      activities: validActivities,
      createdAt: new Date().toISOString()
    };

    console.log('📦 Plan a guardar:', JSON.stringify(newPlan, null, 2));
    console.log('📤 Llamando onSave con el plan...');
    onSave(newPlan);
  };

  const getSubOriginOptions = () => {
    if (origin === 'Plan de desarrollo') return SUB_ORIGIN_DEVELOPMENT;
    if (origin === 'Plan de mejoramiento') return SUB_ORIGIN_IMPROVEMENT;
    return [];
  };

  const isDevelopmentPlan = origin === 'Plan de desarrollo';
  const availableGoals = (isDevelopmentPlan && subOrigin) ? DEVELOPMENT_GOALS[subOrigin] || [] : [];

  return (
    <div className="bg-white rounded-xl shadow-xl border border-gray-300 overflow-hidden flex flex-col h-full">
      {/* Header Bar */}
      <div className="bg-gray-100 border-b border-gray-300 px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">
          {isEditMode ? 'Editar Plan' : 'Registrar Nuevo Plan'}
        </h2>
        <div className="flex space-x-3">
            <Button variant="ghost" onClick={onCancel} icon={<ArrowLeft className="w-5 h-5" />}>Volver</Button>
            <Button onClick={handleSubmit} variant="primary">
              {isEditMode ? 'Guardar Cambios' : 'Guardar Plan'}
            </Button>
        </div>
      </div>

      <div className="p-6 overflow-auto">
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 flex items-start">
            <AlertCircle className="text-red-500 w-5 h-5 mr-2 mt-0.5" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Plan Header Form (Context) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-blue-50 p-6 rounded-lg border border-blue-100">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Nombre del Plan *</label>
            <input
              type="text"
              value={planName}
              onChange={e => setPlanName(e.target.value)}
              className="w-full text-sm rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white py-2 border"
              placeholder="Ej. Plan Calidad 2025"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Origen *</label>
            <select
              value={origin}
              onChange={handleOriginChange}
              className="w-full text-sm rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white py-2"
            >
              <option value="">Seleccione una opción</option>
              <option value="Plan de desarrollo">Plan de desarrollo</option>
              <option value="Plan de mejoramiento">Plan de mejoramiento</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Suborigen</label>
            <select
              value={subOrigin}
              onChange={handleSubOriginChange}
              disabled={!origin}
              className="w-full text-sm rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white disabled:bg-gray-100 disabled:text-gray-400 py-2"
            >
              <option value="">{origin ? "Seleccione suborigen" : "Seleccione origen primero"}</option>
              {getSubOriginOptions().map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          
          {/* Conditional Rendering for Goal (Meta) */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Meta *</label>
            {isDevelopmentPlan ? (
              <select
                value={goal}
                onChange={e => setGoal(e.target.value)}
                disabled={!subOrigin}
                className="w-full text-sm rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white disabled:bg-gray-100 disabled:text-gray-400 py-2"
              >
                <option value="">{subOrigin ? "Seleccione una meta" : "Seleccione suborigen primero"}</option>
                {availableGoals.map((g, idx) => (
                  <option key={idx} value={g} title={g}>{g.length > 100 ? g.substring(0, 100) + '...' : g}</option>
                ))}
              </select>
            ) : (
              <textarea
                value={goal}
                onChange={e => setGoal(e.target.value)}
                className="w-full text-sm rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 resize-none"
                rows={3}
                placeholder="Ej. Aumentar ventas 10% mediante estrategias..."
              />
            )}
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Proyecto *</label>
            <textarea
              value={project}
              onChange={e => setProject(e.target.value)}
              className="w-full text-sm rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 resize-none"
              rows={3}
              placeholder="Ej. Campaña de Marketing Q3 para..."
            />
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
           <div>
             <h3 className="text-lg font-bold text-gray-700">Detalle de Actividades</h3>
             <p className="text-xs text-gray-500 mt-1">Total: {activities.length} {activities.length === 1 ? 'actividad' : 'actividades'}</p>
           </div>
           <div className="flex space-x-2">
              <Button 
                type="button" 
                variant="secondary" 
                onClick={handleAddActivityRow}
                className="text-sm font-semibold"
                icon={<Plus className="w-4 h-4" />}
              >
                + Agregar Actividad
              </Button>
           </div>
        </div>

        {/* The Grid / Table */}
        <div className="overflow-x-auto border border-gray-300 rounded-lg shadow-sm">
          {/* Datalist for Areas */}
          <datalist id="area-options">
            {AREAS.map(area => (
              <option key={area} value={area} />
            ))}
          </datalist>

          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr className="bg-[#B8CCE4]">
                <th className="px-3 py-2 text-left text-xs font-bold text-gray-800 uppercase tracking-wider border-r border-gray-300 w-1/4">Actividades</th>
                <th className="px-3 py-2 text-left text-xs font-bold text-gray-800 uppercase tracking-wider border-r border-gray-300">Responsable</th>
                <th className="px-3 py-2 text-left text-xs font-bold text-gray-800 uppercase tracking-wider border-r border-gray-300">Área</th>
                <th className="px-3 py-2 text-left text-xs font-bold text-gray-800 uppercase tracking-wider border-r border-gray-300">Inicio</th>
                <th className="px-3 py-2 text-left text-xs font-bold text-gray-800 uppercase tracking-wider border-r border-gray-300">Fin</th>
                <th className="px-3 py-2 text-left text-xs font-bold text-gray-800 uppercase tracking-wider border-r border-gray-300">Recursos</th>
                <th className="px-3 py-2 text-center text-xs font-bold text-gray-800 uppercase tracking-wider w-10"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activities.map((act) => (
                <tr key={act.id} className="group hover:bg-gray-50">
                  <td className="p-2 border-r border-gray-200">
                    <textarea
                      value={act.description}
                      onChange={e => updateActivity(act.id, 'description', e.target.value)}
                      className="w-full text-sm border-0 bg-transparent focus:ring-0 p-0 resize-none"
                      rows={2}
                      placeholder="Descripción..."
                    />
                  </td>
                  <td className="p-2 border-r border-gray-200 align-top">
                    <input
                      type="text"
                      value={act.responsible}
                      onChange={e => updateActivity(act.id, 'responsible', e.target.value)}
                      className="w-full text-sm border-0 bg-transparent focus:ring-0 p-0"
                      placeholder="Nombre/Rol"
                    />
                  </td>
                  <td className="p-2 border-r border-gray-200 align-top">
                    <select
                      value={act.area}
                      onChange={e => updateActivity(act.id, 'area', e.target.value)}
                      className="w-full text-sm border-0 bg-transparent focus:ring-0 p-0"
                    >
                      <option value="">Seleccionar área...</option>
                      {AREAS.map((area, idx) => (
                        <option key={idx} value={area}>{area}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2 border-r border-gray-200 align-top">
                    <input
                      type="date"
                      value={act.startDate}
                      onChange={e => updateActivity(act.id, 'startDate', e.target.value)}
                      className="w-full text-xs border-0 bg-transparent focus:ring-0 p-0 text-gray-600"
                    />
                  </td>
                  <td className="p-2 border-r border-gray-200 align-top">
                    <input
                      type="date"
                      value={act.endDate}
                      onChange={e => updateActivity(act.id, 'endDate', e.target.value)}
                      className="w-full text-xs border-0 bg-transparent focus:ring-0 p-0 text-gray-600"
                    />
                  </td>
                  <td className="p-2 border-r border-gray-200 align-top">
                     <textarea
                      value={act.resources}
                      onChange={e => updateActivity(act.id, 'resources', e.target.value)}
                      className="w-full text-sm border-0 bg-transparent focus:ring-0 p-0 resize-none"
                      rows={2}
                      placeholder="Recursos..."
                    />
                  </td>
                  <td className="p-2 text-center align-middle">
                    <button
                      type="button"
                      onClick={() => handleRemoveActivityRow(act.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                      disabled={activities.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
