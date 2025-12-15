import React, { useState, useEffect } from 'react';
import { Plan, ViewState } from './types';
import { CreatePlanForm } from './components/CreatePlanForm';
import { PlanCard } from './components/PlanCard';
import { PlanExecutionView } from './components/PlanExecutionView';
import { LoginForm } from './components/LoginForm';
import { HomeView } from './components/HomeView';
import { RecordsView } from './components/RecordsView';
import { ReportsView } from './components/ReportsView';
import { ToastContainer } from './components/Toast';
import { ConfirmDialog } from './components/ConfirmDialog';
import UserManager from './components/UserManager';
import { Button } from './components/Button';
import { useToast } from './hooks/useToast';
import { Plus, Compass, LogOut, LayoutDashboard, Users, Search, X } from 'lucide-react';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [view, setView] = useState<ViewState>('HOME');
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOrigin, setFilterOrigin] = useState<string>('');
  const { toasts, removeToast, showSuccess, showError, showInfo } = useToast();
  
  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    isDangerous: false
  });

  useEffect(() => {
    // Check session
    const session = localStorage.getItem('brujula_session');
    if (session === 'active') {
      // Obtener datos del usuario autenticado
      const userData = localStorage.getItem('user');
      if (userData) {
        setCurrentUser(JSON.parse(userData));
      }

      setIsAuthenticated(true);
      // Establecer vista inicial a HOME cuando se restaura sesión
      setView('HOME');
      // Cargar planes desde API
      loadPlans();
    }
  }, []);

  const loadPlans = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:5000/api/plans', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const plansData = await response.json();
        // Convertir datos de MongoDB a formato Plan
        const convertedPlans: Plan[] = plansData.map((p: any) => {
          // Las actividades vienen del backend, convertir a formato frontend
          const activitiesConverted = (p.activities || []).map((act: any) => {
            // Determinar el estado automático basado en fechas
            let statusAuto = act.status || 'NOT_STARTED';
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (act.startDate) {
              // Comparar como strings para evitar problemas de zona horaria
              const todayString = today.toISOString().split('T')[0];
              
              // Si la fecha de inicio ha llegado o pasado, cambiar a IN_PROGRESS
              if (todayString >= act.startDate && statusAuto === 'NOT_STARTED') {
                statusAuto = 'IN_PROGRESS';
              }
            }
            
            return {
              id: crypto.randomUUID(), // Generar ID único para frontend
              _id: act._id, // Guardar ID de MongoDB para operaciones en backend
              description: act.description || '',
              responsible: act.responsible || '',
              area: act.area || '',
              // Guardar las fechas como strings sin conversión a Date
              startDate: act.startDate || '',
              endDate: act.endDate || '',
              resources: act.resources || '',
              priority: act.priority || 'MEDIUM',
              status: statusAuto,
              completionPercentage: act.completionPercentage || 0,
              comments: act.comments || [],
              evidence: act.evidence || [],
            };
          });
          
          return {
            id: p._id,
            name: p.name,
            origin: p.origin,
            subOrigin: p.subOrigin,
            goal: p.goal,
            project: p.project,
            activities: activitiesConverted,
            createdAt: p.createdAt,
          };
        });
        setPlans(convertedPlans);
      }
    } catch (error) {
      console.error('Error loading plans:', error);
    }
  };



  const handleLogin = (token: string, user: any) => {
    localStorage.setItem('brujula_session', 'active');
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setCurrentUser(user);
    setIsAuthenticated(true);
    // Establecer vista inicial a HOME después del login
    setView('HOME');
    // Cargar planes tras login exitoso
    loadPlans();
  };

  const handleLogout = () => {
    localStorage.removeItem('brujula_session');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setIsAuthenticated(false);
    setView('DASHBOARD');
    setSelectedPlan(null);
  };

  const handleSavePlan = async (plan: Plan) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      // Limpiar actividades: eliminar el campo 'id' que es solo para frontend
      const cleanActivities = plan.activities.map(({ id, ...rest }) => rest);

      console.log('📋 Plan a guardar:', {
        name: plan.name,
        project: plan.project,
        goal: plan.goal,
        origin: plan.origin,
        subOrigin: plan.subOrigin,
        activitiesCount: cleanActivities.length,
      });

      console.log('📝 Actividades a enviar:');
      cleanActivities.forEach((act, i) => {
        console.log(`  [${i+1}] desc="${act.description}" | resp="${act.responsible}" | area="${act.area}"`);
      });

      const payloadToSend = {
        name: plan.name,
        project: plan.project,
        goal: plan.goal,
        origin: plan.origin,
        subOrigin: plan.subOrigin,
        activities: cleanActivities,
      };

      console.log('📤 JSON Completo a enviar:', JSON.stringify(payloadToSend, null, 2));

      // Detectar si es modo edición
      const isEditMode = !!selectedPlan;
      const url = isEditMode 
        ? `http://localhost:5000/api/plans/${plan.id}`
        : 'http://localhost:5000/api/plans';
      const method = isEditMode ? 'PUT' : 'POST';

      console.log(`🔄 Operación: ${method} ${url}`);

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payloadToSend),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save plan');
      }

      const data = await response.json();
      console.log(`✅ Plan ${isEditMode ? 'actualizado' : 'creado'} exitosamente`);
      console.log('📊 Respuesta del servidor:', data);
      
      // Convertir el plan devuelto al formato frontend
      const savedPlan = data.plan;
      const convertedPlan: Plan = {
        id: savedPlan._id,
        name: savedPlan.name,
        origin: savedPlan.origin,
        subOrigin: savedPlan.subOrigin,
        goal: savedPlan.goal,
        project: savedPlan.project,
        activities: (savedPlan.activities || []).map((act: any) => ({
          id: crypto.randomUUID(),
          _id: act._id, // Guardar ID de MongoDB para operaciones en backend
          description: act.description || '',
          responsible: act.responsible || '',
          area: act.area || '',
          startDate: act.startDate ? new Date(act.startDate).toISOString().split('T')[0] : '',
          endDate: act.endDate ? new Date(act.endDate).toISOString().split('T')[0] : '',
          resources: act.resources || '',
          priority: act.priority || 'MEDIUM',
          status: act.status || 'NOT_STARTED',
          completionPercentage: act.completionPercentage || 0,
          comments: act.comments || [],
          evidence: act.evidence || [],
        })),
        createdAt: savedPlan.createdAt,
      };
      
      // Actualizar planes con el plan guardado
      if (isEditMode) {
        // En modo edición, reemplazar el plan existente
        const updatedPlans = plans.map(p => p.id === convertedPlan.id ? convertedPlan : p);
        setPlans(updatedPlans);
      } else {
        // En modo creación, agregar al inicio
        setPlans([convertedPlan, ...plans]);
      }
      
      setSelectedPlan(null);
      setView('DASHBOARD');
    } catch (error) {
      console.error('Error saving plan:', error);
      showError('Error al guardar el plan: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleUpdatePlan = (updatedPlan: Plan) => {
    const updatedPlans = plans.map(p => p.id === updatedPlan.id ? updatedPlan : p);
    setPlans(updatedPlans);
    setSelectedPlan(updatedPlan); // Keep selected updated
  };

  const handleDeletePlan = (planToDelete: Plan) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Eliminar Plan',
      message: `¿Estás seguro de que deseas eliminar el plan "${planToDelete.project}"? Esta acción no se puede deshacer.`,
      isDangerous: true,
      onConfirm: async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('No token found');
          }

          console.log('🗑️  Eliminando plan:', planToDelete.id);

          const response = await fetch(`http://localhost:5000/api/plans/${planToDelete.id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete plan');
          }

          console.log('✅ Plan eliminado del backend');

          const updatedPlans = plans.filter(p => p.id !== planToDelete.id);
          setPlans(updatedPlans);

          if (selectedPlan?.id === planToDelete.id) {
            setSelectedPlan(null);
          }

          showSuccess('Plan eliminado exitosamente');
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        } catch (error) {
          console.error('Error deleting plan:', error);
          showError('Error al eliminar el plan: ' + (error instanceof Error ? error.message : 'Unknown error'));
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const handleCreateNewPlan = () => {
    setSelectedPlan(null); // Limpiar cualquier plan seleccionado anteriormente
    setView('CREATE_PLAN');
  };

  const handleEditPlan = (planToEdit: Plan) => {
    setSelectedPlan(planToEdit);
    setView('CREATE_PLAN');
  };

  const handlePlanClick = (plan: Plan) => {
    setSelectedPlan(plan);
    setView('VIEW_PLAN');
  };

  const getFilteredPlans = () => {
    return plans.filter(plan => {
      // Búsqueda por texto
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        plan.name.toLowerCase().includes(searchLower) ||
        plan.project.toLowerCase().includes(searchLower) ||
        plan.goal.toLowerCase().includes(searchLower) ||
        plan.origin.toLowerCase().includes(searchLower);

      // Filtro por origen
      const matchesOrigin = !filterOrigin || plan.origin === filterOrigin;

      return matchesSearch && matchesOrigin;
    });
  };

  const renderfilteredPlans = getFilteredPlans();

  const renderContent = () => {
    // Home View
    if (view === 'HOME') {
      return (
        <HomeView 
          onNavigate={(section) => {
            if (section === 'PLANS') setView('PLANS');
            else if (section === 'RECORDS') setView('RECORDS');
            else if (section === 'REPORTS') setView('REPORTS');
          }}
          userName={currentUser?.fullName || 'Usuario'}
          plans={plans}
        />
      );
    }

    if (view === 'RECORDS') {
      return <RecordsView onBack={() => setView('HOME')} />;
    }

    if (view === 'REPORTS') {
      return <ReportsView onBack={() => setView('HOME')} />;
    }

    if (view === 'USERS') {
      return <UserManager />;
    }

    if (view === 'CREATE_PLAN') {
      return (
        <div className="max-w-7xl mx-auto h-[calc(100vh-100px)]">
          <CreatePlanForm 
            onSave={handleSavePlan}
            onCancel={() => setView('PLANS')}
            initialPlan={selectedPlan || undefined}
          />
        </div>
      );
    }

    if (view === 'VIEW_PLAN' && selectedPlan) {
      return (
        <div className="max-w-full mx-auto">
          <PlanExecutionView 
            plan={selectedPlan}
            onBack={() => setView('PLANS')}
            onUpdatePlan={handleUpdatePlan}
          />
        </div>
      );
    }

    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">📋 Mis Planes</h1>
            <p className="text-gray-500 mt-1">Crea y gestiona tus planes estratégicos y operativos.</p>
          </div>
          <Button 
            onClick={handleCreateNewPlan} 
            icon={<Plus className="w-5 h-5" />}
            className="shadow-md"
          >
            Nuevo Plan
          </Button>
        </div>

        {/* Barra de Búsqueda y Filtros */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex gap-4 flex-col md:flex-row">
            {/* Campo de Búsqueda */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, proyecto o meta..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Filtro por Origen */}
            <select
              value={filterOrigin}
              onChange={(e) => setFilterOrigin(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="">Todos los orígenes</option>
              <option value="Plan de desarrollo">Plan de desarrollo</option>
              <option value="Plan de mejoramiento">Plan de mejoramiento</option>
            </select>
          </div>

          {/* Resultados */}
          {(searchQuery || filterOrigin) && (
            <div className="mt-3 text-sm text-gray-600">
              Se encontraron <span className="font-bold text-blue-600">{renderfilteredPlans.length}</span> plan(es)
            </div>
          )}
        </div>

        {renderfilteredPlans.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
            <Compass className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              {searchQuery || filterOrigin ? 'No se encontraron planes' : 'Sin planes registrados'}
            </h3>
            {searchQuery || filterOrigin ? (
              <p className="text-gray-500 mt-2">Intenta con otros términos de búsqueda o filtros</p>
            ) : null}
            <div className="mb-6"></div>
            <Button onClick={handleCreateNewPlan} variant="secondary">
              Crear Plan
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderfilteredPlans.map(plan => (
              <PlanCard 
                key={plan.id} 
                plan={plan} 
                onClick={handlePlanClick}
                onEdit={handleEditPlan}
                onDelete={handleDeletePlan}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => setView('HOME')}>
              <div className="bg-blue-600 p-1.5 rounded mr-2">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">Brújula</span>
            </div>
            <div className="flex items-center space-x-4">
               <button
                 onClick={() => setView('USERS')}
                 className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                   view === 'USERS' 
                     ? 'bg-blue-100 text-blue-600' 
                     : 'text-gray-600 hover:bg-gray-100'
                 }`}
                 title="Gestión de Usuarios"
               >
                 <Users className="w-5 h-5" />
                 <span className="hidden sm:inline text-sm font-medium">Usuarios</span>
               </button>
               <div className="hidden md:flex flex-col items-end mr-2">
                  <span className="text-sm font-medium text-gray-900">{currentUser?.fullName || 'Usuario'}</span>
                  <span className="text-xs text-gray-500">Sesión activa</span>
               </div>
               <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm border border-blue-200">
                {currentUser?.fullName 
                  ? currentUser.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2)
                  : 'U'}
               </div>
               <button 
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-600 transition-colors p-1"
                title="Cerrar Sesión"
               >
                 <LogOut className="w-5 h-5" />
               </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        {renderContent()}
      </main>
      <ToastContainer toasts={toasts} onClose={removeToast} />
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

export default App;