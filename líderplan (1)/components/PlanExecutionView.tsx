import React, { useState } from 'react';
import { Plan, Activity, ActivityStatus, ActivityPriority, Comment, Evidence } from '../types';
import { Button } from './Button';
import { ConfirmDialog } from './ConfirmDialog';
import { ChevronLeft, Edit2, Upload, MessageSquare, X, FileText, Trash2, Plus } from 'lucide-react';
import { useToast } from '../hooks/useToast';

interface PlanExecutionViewProps {
  plan: Plan;
  onBack: () => void;
  onUpdatePlan: (plan: Plan) => void;
}

const AREAS = [
  "Admisiones y Registro", "Biblioteca", "CAD", "Compras", "Comunicaciones y RRPP", "Contabilidad",
  "Dec. Escuela de Ciencias Adtivas. Soc. y Hnas.", "Dec. Escuela de Ciencias Creativas",
  "Dirección de Bienestar Institucional", "Dirección de Pastoral", "Educación Virtual", "Egresados",
  "Extensión", "Facturación y cartera", "Infraestructura y Dlllo Tec", "Internacionalización",
  "Líder CIIDE", "Mercadeo y Ventas", "Permanencia", "Planta Física",
  "Programa de Administración de Empresas", "Programa de Animación", "Programa de Comunicación Organizacional",
  "Programa de Derecho", "Programa de Diseño de Modas", "Programa de Diseño Gráfico",
  "Programa de Especialización en Cultura y Clima Organizacional", "Programa de Especialización en Gerencia de Mercadeo Estratégico",
  "Programa de Ingeniería de Sistemas", "Programa de Ingeniería Electrónica",
  "Programa de Ingeniería en Inteligencia de Negocios", "Programa de Ingeniería Industrial",
  "Programa de Mercadeo", "Programa de Negocios Internacionales", "Programa de Realización y Producción Musical",
  "Programa de Tecnología en Gestión de Mercadeo y Ventas", "Programa de Tecnología en Gestión de Negocios Internacionales",
  "Programa de Tecnología en Gestión del Talento Humano", "Programa de Tecnología en Gestión Empresarial",
  "Programa de Tecnología en Sistemas", "Secretaria General", "SGI", "SST", "Talento Humano",
  "Tesorería", "Vicerectoría Adtiva. y Fin.", "Vicerrectoría Académico", "Vicerrectoría Dllo Organizacional"
];

// Función para formatear fechas strings sin conversión a Date (evita problemas de zona horaria)
const formatDateString = (dateString: string): string => {
  if (!dateString) return '-';
  // dateString viene como "YYYY-MM-DD"
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

export const PlanExecutionView: React.FC<PlanExecutionViewProps> = ({ plan, onBack, onUpdatePlan }) => {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const { showSuccess, showError, showInfo } = useToast();
  
  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    isDangerous: false
  });
  
  // State for Managing Existing Activity
  const [tempStatus, setTempStatus] = useState<ActivityStatus>(ActivityStatus.NOT_STARTED);
  const [tempProgress, setTempProgress] = useState<number>(0);
  const [tempArea, setTempArea] = useState<string>('');
  const [newComment, setNewComment] = useState('');

  // State for Adding New Activity
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [newActivityData, setNewActivityData] = useState({
    description: '',
    responsible: '',
    area: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    resources: ''
  });

  // --- Manage Existing Activity Logic ---

  const openActivityModal = (activity: Activity) => {
    setSelectedActivity(activity);
    setTempStatus(activity.status);
    setTempProgress(activity.completionPercentage);
    setTempArea(activity.area || '');
    setNewComment('');
  };

  const closeActivityModal = () => {
    setSelectedActivity(null);
  };

  const handleSaveChanges = async () => {
    if (!selectedActivity) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      // Determinar el nuevo estado basado en el progreso
      let newStatus = tempStatus;
      if (tempProgress === 100) {
        newStatus = ActivityStatus.CLOSED;
      } else if (tempProgress > 0 && tempProgress < 100) {
        newStatus = ActivityStatus.IN_PROGRESS;
      }

      console.log('💾 Guardando cambios de actividad:', {
        id: selectedActivity._id,
        status: newStatus,
        completionPercentage: tempProgress,
        area: tempArea
      });

      // Guardar en el backend
      const updateResponse = await fetch(
        `http://localhost:5000/api/activities/${selectedActivity._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
            completionPercentage: tempProgress,
            area: tempArea
          }),
        }
      );

      if (!updateResponse.ok) {
        const error = await updateResponse.json();
        throw new Error(error.message || 'Failed to update activity');
      }

      const responseData = await updateResponse.json();
      console.log('✅ Cambios guardados en backend:', responseData);

      // Actualizar el estado local con los cambios confirmados
      const updatedActivities = plan.activities.map(a => {
        if (a.id === selectedActivity.id) {
          return {
            ...a,
            status: newStatus,
            completionPercentage: tempProgress,
            area: tempArea
          };
        }
        return a;
      });

      onUpdatePlan({ ...plan, activities: updatedActivities });
      showSuccess('Cambios guardados exitosamente');
      closeActivityModal();
    } catch (error) {
      console.error('Error saving changes:', error);
      showError('Error al guardar cambios: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleDeleteActivity = (activityId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Eliminar Actividad',
      message: '¿Estás seguro de que deseas eliminar esta actividad? Esta acción no se puede deshacer.',
      isDangerous: true,
      onConfirm: async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('No token found');
          }

          console.log('🗑️  Eliminando actividad:', activityId);

          const activityToDelete = plan.activities.find(a => a.id === activityId);
          if (!activityToDelete) {
            throw new Error('Actividad no encontrada');
          }

          const mongoId = activityToDelete._id;
          if (!mongoId) {
            throw new Error('MongoDB ID no encontrado para la actividad');
          }

          console.log('   📦 ID de MongoDB:', mongoId);

          const deleteResponse = await fetch(`http://localhost:5000/api/activities/${mongoId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!deleteResponse.ok) {
            const error = await deleteResponse.json();
            throw new Error(error.message || 'Failed to delete activity');
          }

          console.log('✅ Actividad eliminada del backend');

          const updatedActivities = plan.activities.filter(a => a.id !== activityId);
          onUpdatePlan({ ...plan, activities: updatedActivities });
          
          if (selectedActivity && selectedActivity.id === activityId) {
            closeActivityModal();
          }

          showSuccess('Actividad eliminada exitosamente');
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        } catch (error) {
          console.error('Error deleting activity:', error);
          showError('Error al eliminar la actividad: ' + (error instanceof Error ? error.message : 'Unknown error'));
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedActivity) return;

    const comment: Comment = {
      id: crypto.randomUUID(),
      text: newComment,
      date: new Date().toISOString(),
      author: 'Líder de Área'
    };

    const updatedActivities = plan.activities.map(a => {
      if (a.id === selectedActivity.id) {
        return { ...a, comments: [...a.comments, comment] };
      }
      return a;
    });

    const updatedActivity = { ...selectedActivity, comments: [...selectedActivity.comments, comment] };
    setSelectedActivity(updatedActivity);
    setNewComment('');
    
    onUpdatePlan({ ...plan, activities: updatedActivities });
  };

  const handleUploadEvidence = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && selectedActivity) {
      const file = e.target.files[0];
      
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        console.log(`📁 Cargando archivo: ${file.name} (${file.size} bytes)`);

        // Crear FormData para enviar el archivo
        const formData = new FormData();
        formData.append('file', file);

        // Subir el archivo al servidor
        const uploadResponse = await fetch('http://localhost:5000/api/files/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (!uploadResponse.ok) {
          const error = await uploadResponse.json();
          throw new Error(error.message || 'Failed to upload file');
        }

        const uploadedFile = await uploadResponse.json();
        console.log(`✅ Archivo subido exitosamente:`, uploadedFile);

        // Crear objeto de evidencia con la URL del archivo
        const evidence: Evidence = {
          id: crypto.randomUUID(),
          fileName: uploadedFile.fileName,
          url: uploadedFile.url,
          date: new Date().toISOString()
        };

        // Actualizar la actividad con la evidencia en el backend
        const evidenceResponse = await fetch(
          `http://localhost:5000/api/activities/${selectedActivity._id || selectedActivity.id}/evidence`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              fileName: evidence.fileName,
              url: evidence.url,
            }),
          }
        );

        if (!evidenceResponse.ok) {
          const error = await evidenceResponse.json();
          throw new Error(error.message || 'Failed to add evidence');
        }

        console.log(`✅ Evidencia guardada en la base de datos`);

        // Actualizar el estado local
        const updatedActivities = plan.activities.map(a => {
          if (a.id === selectedActivity.id) {
            return { ...a, evidence: [...a.evidence, evidence] };
          }
          return a;
        });

        const updatedActivity = { ...selectedActivity, evidence: [...selectedActivity.evidence, evidence] };
        setSelectedActivity(updatedActivity);
        onUpdatePlan({ ...plan, activities: updatedActivities });

        showSuccess('✅ Evidencia cargada exitosamente');
      } catch (error) {
        console.error('❌ Error al cargar evidencia:', error);
        showError('Error al cargar la evidencia: ' + (error instanceof Error ? error.message : 'Unknown error'));
      }
    }
  };

  // --- Add New Activity Logic ---

  const handleOpenAddModal = () => {
    // Obtener fecha local sin conversión a UTC
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayString = `${year}-${month}-${day}`;
    
    setNewActivityData({
        description: '',
        responsible: '',
        area: '',
        startDate: todayString,
        endDate: todayString,
        resources: ''
    });
    setIsAddingActivity(true);
    console.log('📅 Modal abierto - Fecha inicial:', todayString);
  };

  const handleSaveNewActivity = async () => {
    if (!newActivityData.description.trim()) {
        showError("La descripción es obligatoria");
        return;
    }

    // Validar fechas
    if (!newActivityData.startDate || !newActivityData.endDate) {
        showError("Las fechas de inicio y fin son obligatorias");
        return;
    }

    // Validar que la fecha de fin sea posterior o igual a la de inicio
    // Comparar como strings para evitar problemas de zona horaria
    if (newActivityData.endDate < newActivityData.startDate) {
        showError("La fecha de fin debe ser posterior o igual a la fecha de inicio");
        return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      console.log('═══════════════════════════════════════');
      console.log('📝 CREAR ACTIVIDAD - FRONTEND ENVIANDO:');
      console.log('───────────────────────────────────────');
      console.log(`   Descripción: ${newActivityData.description}`);
      console.log(`   Inicio: "${newActivityData.startDate}" (type: ${typeof newActivityData.startDate})`);
      console.log(`   Fin: "${newActivityData.endDate}" (type: ${typeof newActivityData.endDate})`);
      console.log('───────────────────────────────────────');

      // Crear la nueva actividad
      const newActivity: Activity = {
          id: crypto.randomUUID(),
          description: newActivityData.description,
          responsible: newActivityData.responsible,
          area: newActivityData.area,
          startDate: newActivityData.startDate,
          endDate: newActivityData.endDate,
          resources: newActivityData.resources,
          status: ActivityStatus.NOT_STARTED,
          priority: ActivityPriority.MEDIUM,
          completionPercentage: 0,
          comments: [],
          evidence: []
      };

      // Eliminar el ID antes de enviar al servidor
      const { id, ...activityWithoutId } = newActivity;

      // Guardar la actividad en el backend
      const activityResponse = await fetch('http://localhost:5000/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...activityWithoutId,
          planId: plan.id,
          // Enviar fechas como strings YYYY-MM-DD sin conversión
          startDate: newActivityData.startDate,
          endDate: newActivityData.endDate
        }),
      });

      if (!activityResponse.ok) {
        const error = await activityResponse.json();
        throw new Error(error.message || 'Failed to save activity');
      }

      const savedActivity = await activityResponse.json();
      console.log(`✅ RESPUESTA DEL BACKEND:`);
      console.log(`   Inicio confirmado: "${savedActivity.activity?.startDate || savedActivity.startDate}"`);
      console.log(`   Fin confirmado: "${savedActivity.activity?.endDate || savedActivity.endDate}"`);
      console.log('═══════════════════════════════════════');

      // Crear la actividad con el ID de MongoDB
      const activityWithMongoId: Activity = {
        ...newActivity,
        _id: savedActivity.activity?._id || savedActivity._id
      };

      // Actualizar el plan en memoria
      const updatedActivities = [...plan.activities, activityWithMongoId];
      onUpdatePlan({ ...plan, activities: updatedActivities });
      setIsAddingActivity(false);
      
      // Mostrar confirmación
      showSuccess(`✅ Actividad guardada\nFecha Inicio: ${newActivityData.startDate}\nFecha Fin: ${newActivityData.endDate}`);
    } catch (error) {
      console.error('❌ Error saving activity:', error);
      showError('Error al guardar la actividad: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const getStatusColor = (status: ActivityStatus) => {
    switch(status) {
      case ActivityStatus.CLOSED: return 'text-green-600 bg-green-100';
      case ActivityStatus.IN_PROGRESS: return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-full mx-auto space-y-4 relative">
      <datalist id="area-options-exec">
        {AREAS.map(area => (
            <option key={area} value={area} />
        ))}
      </datalist>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" onClick={onBack} icon={<ChevronLeft className="w-4 h-4" />}>
            Volver
          </Button>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">{plan.project}</h1>
            <span className="text-sm text-gray-500">{plan.origin} {plan.subOrigin ? `— ${plan.subOrigin}` : ''}</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-gray-500 uppercase">Meta</div>
                <div className="text-sm font-medium text-gray-800 max-w-xs truncate" title={plan.goal}>{plan.goal}</div>
            </div>
            <Button onClick={handleOpenAddModal} icon={<Plus className="w-4 h-4" />}>
                Nueva Actividad
            </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
         <div className="overflow-x-auto">
           <table className="min-w-full divide-y divide-gray-300">
             <thead>
               <tr className="bg-[#B8CCE4]">
                 <th className="px-3 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider border-r border-gray-400/30 w-1/4">Actividad</th>
                 <th className="px-3 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider border-r border-gray-400/30">Responsable</th>
                 <th className="px-3 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider border-r border-gray-400/30">Área</th>
                 <th className="px-3 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider border-r border-gray-400/30">Fechas</th>
                 <th className="px-3 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider border-r border-gray-400/30 w-1/6">Progreso</th>
                 <th className="px-3 py-3 text-center text-xs font-bold text-gray-900 uppercase tracking-wider w-32">Acciones</th>
               </tr>
             </thead>
             <tbody className="bg-white divide-y divide-gray-200">
               {plan.activities.length === 0 ? (
                 <tr>
                   <td colSpan={6} className="px-6 py-10 text-center text-gray-400 text-sm">
                     No hay actividades registradas en este plan.
                   </td>
                 </tr>
               ) : (
                plan.activities.map((act) => (
                 <tr key={act.id} className="hover:bg-blue-50/30 transition-colors">
                   <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-200 font-medium">
                     {act.description}
                     <div className="mt-1 flex gap-2">
                       <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${getStatusColor(act.status)}`}>
                         {act.status}
                       </span>
                       {act.evidence.length > 0 && (
                         <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-medium flex items-center">
                           <FileText className="w-3 h-3 mr-1" /> {act.evidence.length} Evidencia
                         </span>
                       )}
                       {act.comments.length > 0 && (
                         <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-medium flex items-center">
                           <MessageSquare className="w-3 h-3 mr-1" /> {act.comments.length}
                         </span>
                       )}
                     </div>
                   </td>
                   <td className="px-3 py-3 text-xs text-gray-700 border-r border-gray-200 align-top">{act.responsible}</td>
                   <td className="px-3 py-3 text-xs text-gray-600 border-r border-gray-200 align-top">{act.area || '-'}</td>
                   <td className="px-3 py-3 text-xs text-gray-500 border-r border-gray-200 whitespace-nowrap align-top">
                      <div>Del: {formatDateString(act.startDate)}</div>
                      <div>Al: {formatDateString(act.endDate)}</div>
                   </td>
                   <td className="px-3 py-3 border-r border-gray-200 align-middle">
                     <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                          <div className={`h-2 rounded-full ${act.status === ActivityStatus.CLOSED ? 'bg-green-500' : 'bg-blue-600'}`} style={{ width: `${act.completionPercentage}%` }}></div>
                        </div>
                        <span className="text-xs font-bold text-gray-700">{act.completionPercentage}%</span>
                     </div>
                   </td>
                   <td className="px-2 py-3 text-center align-middle whitespace-nowrap">
                     <div className="flex items-center justify-center space-x-1">
                        <Button variant="secondary" onClick={() => openActivityModal(act)} className="text-xs px-2 py-1 h-8">
                          <Edit2 className="w-3 h-3 mr-1" /> Gestionar
                        </Button>
                        <button 
                            onClick={() => handleDeleteActivity(act.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Eliminar actividad"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                     </div>
                   </td>
                 </tr>
               )))}
             </tbody>
           </table>
         </div>
      </div>

      {/* Modal for Adding New Activity */}
      {isAddingActivity && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <h3 className="text-lg font-bold text-gray-900">Agregar Nueva Actividad</h3>
                    <button onClick={() => setIsAddingActivity(false)} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Actividad *</label>
                        <textarea 
                            value={newActivityData.description}
                            onChange={(e) => setNewActivityData({...newActivityData, description: e.target.value})}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                            rows={3}
                            placeholder="Descripción de la actividad..."
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Responsable</label>
                            <input 
                                type="text"
                                value={newActivityData.responsible}
                                onChange={(e) => setNewActivityData({...newActivityData, responsible: e.target.value})}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Área</label>
                            <input 
                                list="area-options-exec"
                                type="text"
                                value={newActivityData.area}
                                onChange={(e) => setNewActivityData({...newActivityData, area: e.target.value})}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                placeholder="Buscar área..."
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Fecha Inicio</label>
                            <input 
                                type="date"
                                value={newActivityData.startDate}
                                onChange={(e) => setNewActivityData({...newActivityData, startDate: e.target.value})}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm text-gray-600"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Fecha Fin</label>
                            <input 
                                type="date"
                                value={newActivityData.endDate}
                                onChange={(e) => setNewActivityData({...newActivityData, endDate: e.target.value})}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm text-gray-600"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Recursos</label>
                        <textarea 
                            value={newActivityData.resources}
                            onChange={(e) => setNewActivityData({...newActivityData, resources: e.target.value})}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                            rows={2}
                            placeholder="Recursos necesarios..."
                        />
                    </div>
                </div>
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
                    <Button variant="ghost" onClick={() => setIsAddingActivity(false)}>Cancelar</Button>
                    <Button onClick={handleSaveNewActivity} variant="primary">Guardar Actividad</Button>
                </div>
            </div>
         </div>
      )}

      {/* Modal for Managing Existing Activity */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">Gestionar Actividad</h3>
              <button onClick={closeActivityModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <p className="text-gray-800 font-medium mb-6 bg-blue-50 p-3 rounded border border-blue-100">
                {selectedActivity.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Status & Progress Column */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Estado</label>
                    <select 
                      value={tempStatus} 
                      onChange={(e) => setTempStatus(e.target.value as ActivityStatus)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value={ActivityStatus.NOT_STARTED}>{ActivityStatus.NOT_STARTED}</option>
                      <option value={ActivityStatus.IN_PROGRESS}>{ActivityStatus.IN_PROGRESS}</option>
                      <option value={ActivityStatus.CLOSED}>{ActivityStatus.CLOSED}</option>
                    </select>
                  </div>

                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                       Porcentaje de Cumplimiento: {tempProgress}%
                     </label>
                     <input 
                       type="range" 
                       min="0" 
                       max="100" 
                       value={tempProgress} 
                       onChange={(e) => setTempProgress(parseInt(e.target.value))}
                       className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                     />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Área Responsable</label>
                    <input
                      list="area-options-exec"
                      value={tempArea}
                      onChange={(e) => setTempArea(e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                      placeholder="Buscar área..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Recursos Asignados</label>
                    <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded border border-gray-200">
                      {selectedActivity.resources || 'Ninguno'}
                    </div>
                  </div>
                </div>

                {/* Evidence & Comments Column */}
                <div className="space-y-6">
                   {/* Evidence Section */}
                   <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Evidencia</label>
                        <label className="cursor-pointer text-blue-600 hover:text-blue-700 text-xs font-medium flex items-center">
                          <Upload className="w-3 h-3 mr-1" /> Cargar
                          <input type="file" className="hidden" onChange={handleUploadEvidence} />
                        </label>
                      </div>
                      <div className="bg-gray-50 rounded-md border border-gray-200 min-h-[100px] p-2 space-y-2">
                        {selectedActivity.evidence.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center text-gray-400 text-xs pt-4">
                            <FileText className="w-6 h-6 mb-1 opacity-20" />
                            Sin archivos cargados
                          </div>
                        ) : (
                          selectedActivity.evidence.map(ev => (
                            <div key={ev.id} className="flex items-center text-xs bg-white p-2 rounded border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                              <FileText className="w-4 h-4 text-blue-400 mr-2" />
                              <span className="flex-1 truncate">{ev.fileName}</span>
                              <span className="text-gray-400 text-[10px] mr-2">{new Date(ev.date).toLocaleDateString()}</span>
                              <a 
                                href={`http://localhost:5000${ev.url}`} 
                                download 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:text-blue-700 underline text-[10px] mr-2"
                              >
                                Descargar
                              </a>
                            </div>
                          ))
                        )}
                      </div>
                   </div>

                   {/* Comments Section */}
                   <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Comentarios</label>
                      <div className="space-y-3 mb-3 max-h-40 overflow-y-auto pr-1">
                        {selectedActivity.comments.map(c => (
                          <div key={c.id} className="bg-gray-50 p-2 rounded text-xs border border-gray-100">
                            <div className="flex justify-between text-gray-400 mb-1">
                              <span className="font-bold text-gray-600">{c.author}</span>
                              <span>{new Date(c.date).toLocaleDateString()}</span>
                            </div>
                            <p className="text-gray-700">{c.text}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Escribir comentario..."
                          className="flex-1 text-xs rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                        />
                        <Button onClick={handleAddComment} disabled={!newComment.trim()} className="px-3 py-1 text-xs">
                          <MessageSquare className="w-3 h-3" />
                        </Button>
                      </div>
                   </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
              <Button variant="ghost" onClick={closeActivityModal}>Cancelar</Button>
              <Button onClick={handleSaveChanges} variant="primary">Guardar Cambios</Button>
            </div>
          </div>
        </div>
      )}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        isDangerous={confirmDialog.isDangerous}
        onConfirm={() => {
          confirmDialog.onConfirm();
        }}
        onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
      />
    </div>
  );
};