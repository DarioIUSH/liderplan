import React from 'react';
import { Plan, ActivityStatus } from '../types';
import { Users, Target, Edit2, Trash2 } from 'lucide-react';

interface PlanCardProps {
  plan: Plan;
  onClick: (plan: Plan) => void;
  onEdit?: (plan: Plan) => void;
  onDelete?: (plan: Plan) => void;
}

// Función para obtener colores según el tipo de plan
const getColorByOrigin = (origin: string) => {
  const colors: Record<string, { bg: string; border: string; badge: string; badgeText: string }> = {
    'Plan de desarrollo': {
      bg: 'from-blue-50 to-indigo-50',
      border: 'border-blue-200 hover:border-blue-400',
      badge: 'bg-blue-100 text-blue-800',
      badgeText: 'text-blue-600'
    },
    'Plan de mejoramiento': {
      bg: 'from-green-50 to-emerald-50',
      border: 'border-green-200 hover:border-green-400',
      badge: 'bg-green-100 text-green-800',
      badgeText: 'text-green-600'
    },
    default: {
      bg: 'from-gray-50 to-gray-50',
      border: 'border-gray-200 hover:border-gray-400',
      badge: 'bg-gray-100 text-gray-800',
      badgeText: 'text-gray-600'
    }
  };

  return colors[origin] || colors.default;
};

export const PlanCard: React.FC<PlanCardProps> = ({ plan, onClick, onEdit, onDelete }) => {
  // Calculate progress based on completionPercentage average
  const totalCount = plan.activities.length;
  const totalPercentage = plan.activities.reduce((acc, curr) => acc + (curr.completionPercentage || 0), 0);
  const progress = totalCount === 0 ? 0 : Math.round(totalPercentage / totalCount);

  // Derive dates from activities if needed, or show count
  const distinctResponsibles = new Set(plan.activities.map(a => a.responsible)).size;

  // Obtener colores para este plan
  const colors = getColorByOrigin(plan.origin);

  return (
    <div 
      onClick={() => onClick(plan)}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer group hover:border-blue-300"
    >
      <div className="flex justify-between items-start mb-3">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${colors.badge} uppercase tracking-wide`}>
          {plan.origin}
        </span>
        {plan.subOrigin && (
           <span className="text-xs text-gray-400 font-medium truncate max-w-[120px] ml-2" title={plan.subOrigin}>{plan.subOrigin}</span>
        )}
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
        {plan.project}
      </h3>
      
      <div className="flex items-start mb-4">
        <Target className="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
        <p className="text-gray-600 text-sm line-clamp-2 italic">
          "{plan.goal}"
        </p>
      </div>

      <div className="border-t border-gray-100 pt-4 mt-2">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <div className="flex items-center" title="Actividades">
            <span className="font-medium text-gray-900 mr-1">{totalCount}</span> Actividades
          </div>
          <div className="flex items-center" title="Responsables únicos">
            <Users className="w-4 h-4 mr-1" />
            <span>{distinctResponsibles}</span>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-3">
          <div 
            className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[10px] uppercase text-gray-400 font-semibold">Progreso</span>
          <span className="text-xs font-bold text-blue-600">{progress}%</span>
        </div>
      </div>

      {/* Acciones */}
      <div className="border-t border-gray-100 mt-4 pt-4 flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick(plan);
          }}
          className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
        >
          Ver Plan
        </button>
        {onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(plan);
            }}
            className="px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200 flex items-center gap-1"
            title="Editar plan"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        )}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(plan);
            }}
            className="px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200 flex items-center gap-1"
            title="Eliminar plan"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};