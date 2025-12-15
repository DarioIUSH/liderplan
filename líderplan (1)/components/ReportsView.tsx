import React from 'react';
import { BarChart3, ArrowLeft } from 'lucide-react';
import { Button } from './Button';

interface ReportsViewProps {
  onBack: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ onBack }) => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center mb-8">
        <Button 
          onClick={onBack} 
          variant="ghost"
          icon={<ArrowLeft className="w-5 h-5" />}
          className="mr-4"
        >
          Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">📊 Informes</h1>
          <p className="text-gray-500 mt-1">Visualiza análisis, gráficos y reportes de tu progreso.</p>
        </div>
      </div>

      {/* Placeholder Content */}
      <div className="bg-white rounded-xl shadow-sm border border-dashed border-gray-300 p-16 text-center">
        <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Sección de Informes</h3>
        <p className="text-gray-500 mt-2">Esta sección está en desarrollo</p>
        <p className="text-sm text-gray-400 mt-4">Aquí podrás visualizar gráficos y reportes de tu progreso</p>
      </div>
    </div>
  );
};
