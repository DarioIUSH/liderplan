import React from 'react';
import { FileText, ArrowLeft } from 'lucide-react';
import { Button } from './Button';

interface RecordsViewProps {
  onBack: () => void;
}

export const RecordsView: React.FC<RecordsViewProps> = ({ onBack }) => {
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
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">📝 Registros</h1>
          <p className="text-gray-500 mt-1">Mantén un registro detallado de todas las actividades y avances.</p>
        </div>
      </div>

      {/* Placeholder Content */}
      <div className="bg-white rounded-xl shadow-sm border border-dashed border-gray-300 p-16 text-center">
        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Sección de Registros</h3>
        <p className="text-gray-500 mt-2">Esta sección está en desarrollo</p>
        <p className="text-sm text-gray-400 mt-4">Aquí podrás ver todos los registros de tus actividades</p>
      </div>
    </div>
  );
};
