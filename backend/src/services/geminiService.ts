import { IActivity } from '../types/index.js';

export const generateActivitiesWithAI = async (
  project: string,
  goal: string,
  origin: string
): Promise<Partial<IActivity>[]> => {
  try {
    // TODO: Implementar integración con Gemini API cuando sea necesario
    // Por ahora retorna array vacío para evitar errores de compilación
    console.log('AI generation requested for:', { project, goal, origin });
    return [];
  } catch (error) {
    console.error('Error generating activities with AI:', error);
    return [];
  }
};

