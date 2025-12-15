// User Types
export interface IUser {
  _id?: string;
  email: string;
  password: string;
  fullName: string;
  role: 'ADMIN' | 'LEADER' | 'TEAM';
  createdAt?: Date;
  updatedAt?: Date;
}

// Activity Types
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

export interface IComment {
  _id?: string;
  text: string;
  date: Date;
  author: string;
}

export interface IEvidence {
  _id?: string;
  fileName: string;
  url: string;
  date: Date;
}

export interface IActivity {
  _id?: string;
  description: string;
  responsible: string;
  area: string;
  startDate: string;
  endDate: string;
  resources: string;
  status: ActivityStatus;
  priority: ActivityPriority;
  completionPercentage: number;
  comments: IComment[];
  evidence: IEvidence[];
  planId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Plan Types
export interface IPlan {
  _id?: string;
  name: string;
  description?: string;
  project: string;
  goal: string;
  origin: string;
  subOrigin?: string;
  activities: string[];
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}
