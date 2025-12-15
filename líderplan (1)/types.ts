export enum ActivityStatus {
  NOT_STARTED = 'No iniciada',
  IN_PROGRESS = 'En ejecución',
  CLOSED = 'Cerrada'
}

export enum ActivityPriority {
  LOW = 'BAJA',
  MEDIUM = 'MEDIA',
  HIGH = 'ALTA'
}

export interface Comment {
  id: string;
  text: string;
  date: string;
  author: string; // e.g., 'Líder'
}

export interface Evidence {
  id: string;
  fileName: string;
  url: string;
  date: string;
}

export interface Activity {
  id: string;          // UUID para uso en frontend
  _id?: string;        // MongoDB ID para operaciones en backend
  description: string; // ACTIVIDADES
  responsible: string; // RESPONSABLE
  area: string;        // ÁREA (New field)
  startDate: string;   // INICIO (dd/mm/aaaa)
  endDate: string;     // FIN (dd/mm/aaaa)
  resources: string;   // RECURSOS
  status: ActivityStatus;
  priority: ActivityPriority;
  
  // New fields for Execution phase
  completionPercentage: number; // 0-100
  comments: Comment[];
  evidence: Evidence[];
}

export interface Plan {
  id: string;
  name: string;        // Nombre del plan
  origin: string;      // ORIGEN
  subOrigin: string;   // SUBORIGEN
  goal: string;        // META
  project: string;     // PROYECTO
  activities: Activity[];
  createdAt?: string;
}

export type ViewState = 'HOME' | 'PLANS' | 'CREATE_PLAN' | 'VIEW_PLAN' | 'RECORDS' | 'REPORTS' | 'USERS';