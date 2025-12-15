import React from 'react';
import { FileText, BarChart3, Folder, ChevronRight } from 'lucide-react';
import { Plan } from '../types';

interface HomeViewProps {
  onNavigate: (section: 'PLANS' | 'RECORDS' | 'REPORTS') => void;
  userName: string;
  plans: Plan[];
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, userName, plans }) => {
  // Calcular métricas reales desde los planes
  const activePlans = plans.length;
  
  const totalActivities = plans.reduce((sum, plan) => {
    return sum + (plan.activities?.length || 0);
  }, 0);

  // Calcular progreso general (promedio de todas las actividades)
  let totalProgress = 0;
  let totalActivitiesCount = 0;
  plans.forEach(plan => {
    if (plan.activities && plan.activities.length > 0) {
      plan.activities.forEach(activity => {
        totalProgress += activity.completionPercentage || 0;
        totalActivitiesCount++;
      });
    }
  });
  const generalProgress = totalActivitiesCount > 0 
    ? Math.round(totalProgress / totalActivitiesCount) 
    : 0;

  // Contar próximos vencimientos (actividades que vencen en los próximos 7 días)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  let upcomingDeadlines = 0;
  plans.forEach(plan => {
    if (plan.activities) {
      plan.activities.forEach(activity => {
        if (activity.endDate) {
          const endDate = new Date(activity.endDate);
          endDate.setHours(0, 0, 0, 0);
          if (endDate >= today && endDate <= nextWeek && activity.status !== 'CLOSED') {
            upcomingDeadlines++;
          }
        }
      });
    }
  });

  const sections = [
    {
      id: 'PLANS',
      title: 'Planes',
      description: 'Crea y gestiona tus planes estratégicos y operativos',
      icon: <Folder className="w-12 h-12 text-blue-500" />,
      color: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-200',
      buttonColor: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      id: 'RECORDS',
      title: 'Registros',
      description: 'Mantén un registro detallado de todas las actividades y avances',
      icon: <FileText className="w-12 h-12 text-green-500" />,
      color: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-200',
      buttonColor: 'bg-green-500 hover:bg-green-600'
    },
    {
      id: 'REPORTS',
      title: 'Informes',
      description: 'Visualiza análisis, gráficos y reportes de tu progreso',
      icon: <BarChart3 className="w-12 h-12 text-purple-500" />,
      color: 'from-purple-50 to-pink-50',
      borderColor: 'border-purple-200',
      buttonColor: 'bg-purple-500 hover:bg-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Bienvenido a <span className="text-blue-600">Brújula</span>
          </h1>
          <p className="text-xl text-gray-600">
            Hola <span className="font-semibold">{userName}</span>, ¿qué deseas hacer hoy?
          </p>
          <p className="text-gray-500 mt-2">Gestión estratégica y operativa de tu organización</p>
        </div>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sections.map((section) => (
            <div
              key={section.id}
              className={`bg-gradient-to-br ${section.color} rounded-2xl border-2 ${section.borderColor} p-8 hover:shadow-xl transition-all duration-300 cursor-pointer group`}
              onClick={() => onNavigate(section.id as 'PLANS' | 'RECORDS' | 'REPORTS')}
            >
              {/* Icon */}
              <div className="mb-6 flex justify-center">
                {section.icon}
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                {section.title}
              </h2>

              {/* Description */}
              <p className="text-gray-600 text-center mb-8 leading-relaxed">
                {section.description}
              </p>

              {/* Button */}
              <button
                className={`w-full ${section.buttonColor} text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 group-hover:gap-3`}
              >
                Acceder
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Footer text */}
              <p className="text-xs text-gray-500 text-center mt-4">
                {section.id === 'PLANS' && `${activePlans} planes activos`}
                {section.id === 'RECORDS' && 'Último registro: hoy'}
                {section.id === 'REPORTS' && `Progreso general: ${generalProgress}%`}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-16 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Tu Resumen</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="text-2xl font-bold text-blue-600">{activePlans}</div>
              <p className="text-gray-600 text-sm mt-1">Planes activos</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <div className="text-2xl font-bold text-green-600">{totalActivities}</div>
              <p className="text-gray-600 text-sm mt-1">Actividades</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
              <div className="text-2xl font-bold text-yellow-600">{generalProgress}%</div>
              <p className="text-gray-600 text-sm mt-1">Progreso general</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
              <div className="text-2xl font-bold text-purple-600">{upcomingDeadlines}</div>
              <p className="text-gray-600 text-sm mt-1">Próximos vencimientos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
