// Ejemplo de cómo actualizar los servicios del Frontend para conectar con el Backend

// ============================================
// ARCHIVO: frontend/services/apiService.ts
// ============================================

const API_BASE = 'http://localhost:5000/api';

// Guardar token en localStorage
const setAuthToken = (token: string) => {
  localStorage.setItem('lider_token', token);
};

const getAuthToken = () => {
  return localStorage.getItem('lider_token');
};

// Headers comunes con autenticación
const getHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// ============================================
// AUTH SERVICES
// ============================================

export const authService = {
  register: async (email: string, password: string, fullName: string) => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, fullName })
    });
    if (response.ok) {
      const data = await response.json();
      setAuthToken(data.token);
      return data;
    }
    throw new Error(await response.text());
  },

  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (response.ok) {
      const data = await response.json();
      setAuthToken(data.token);
      return data;
    }
    throw new Error(await response.text());
  },

  logout: () => {
    localStorage.removeItem('lider_token');
  },

  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE}/auth/me`, {
      method: 'GET',
      headers: getHeaders()
    });
    if (response.ok) {
      return response.json();
    }
    throw new Error('Failed to fetch user');
  }
};

// ============================================
// PLANS SERVICES
// ============================================

export const planService = {
  createPlan: async (planData: {
    name: string;
    description: string;
    projectName: string;
    goal: string;
    origin: string;
  }) => {
    const response = await fetch(`${API_BASE}/plans`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(planData)
    });
    if (response.ok) {
      return response.json();
    }
    throw new Error('Failed to create plan');
  },

  getPlans: async () => {
    const response = await fetch(`${API_BASE}/plans`, {
      method: 'GET',
      headers: getHeaders()
    });
    if (response.ok) {
      return response.json();
    }
    throw new Error('Failed to fetch plans');
  },

  getPlanById: async (planId: string) => {
    const response = await fetch(`${API_BASE}/plans/${planId}`, {
      method: 'GET',
      headers: getHeaders()
    });
    if (response.ok) {
      return response.json();
    }
    throw new Error('Failed to fetch plan');
  },

  updatePlan: async (planId: string, planData: any) => {
    const response = await fetch(`${API_BASE}/plans/${planId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(planData)
    });
    if (response.ok) {
      return response.json();
    }
    throw new Error('Failed to update plan');
  },

  deletePlan: async (planId: string) => {
    const response = await fetch(`${API_BASE}/plans/${planId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (response.ok) {
      return response.json();
    }
    throw new Error('Failed to delete plan');
  }
};

// ============================================
// ACTIVITIES SERVICES
// ============================================

export const activityService = {
  createActivity: async (activityData: any) => {
    const response = await fetch(`${API_BASE}/activities`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(activityData)
    });
    if (response.ok) {
      return response.json();
    }
    throw new Error('Failed to create activity');
  },

  getActivityById: async (activityId: string) => {
    const response = await fetch(`${API_BASE}/activities/${activityId}`, {
      method: 'GET',
      headers: getHeaders()
    });
    if (response.ok) {
      return response.json();
    }
    throw new Error('Failed to fetch activity');
  },

  updateActivity: async (activityId: string, activityData: any) => {
    const response = await fetch(`${API_BASE}/activities/${activityId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(activityData)
    });
    if (response.ok) {
      return response.json();
    }
    throw new Error('Failed to update activity');
  },

  updateActivityStatus: async (activityId: string, status: string, completionPercentage: number) => {
    const response = await fetch(`${API_BASE}/activities/${activityId}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status, completionPercentage })
    });
    if (response.ok) {
      return response.json();
    }
    throw new Error('Failed to update activity status');
  },

  addComment: async (activityId: string, text: string, author: string) => {
    const response = await fetch(`${API_BASE}/activities/${activityId}/comments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ text, author })
    });
    if (response.ok) {
      return response.json();
    }
    throw new Error('Failed to add comment');
  },

  addEvidence: async (activityId: string, fileName: string, url: string) => {
    const response = await fetch(`${API_BASE}/activities/${activityId}/evidence`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ fileName, url })
    });
    if (response.ok) {
      return response.json();
    }
    throw new Error('Failed to add evidence');
  },

  deleteActivity: async (activityId: string) => {
    const response = await fetch(`${API_BASE}/activities/${activityId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (response.ok) {
      return response.json();
    }
    throw new Error('Failed to delete activity');
  }
};

// ============================================
// AI SERVICES
// ============================================

export const aiService = {
  generateActivities: async (project: string, goal: string, origin: string) => {
    const response = await fetch(`${API_BASE}/ai/generate-activities`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ project, goal, origin })
    });
    if (response.ok) {
      return response.json();
    }
    throw new Error('Failed to generate activities');
  }
};

// ============================================
// EJEMPLO DE USO EN COMPONENTE
// ============================================

/*
import React, { useState } from 'react';
import { authService, planService, aiService } from './services/apiService';

export const ExampleComponent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login(email, password);
      console.log('Login exitoso:', response);
      // Guardar datos del usuario en state/context
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = async (planData: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await planService.createPlan(planData);
      console.log('Plan creado:', response);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateActivities = async (project: string, goal: string, origin: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await aiService.generateActivities(project, goal, origin);
      console.log('Actividades generadas:', response.activities);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <p style={{color: 'red'}}>{error}</p>}
      {loading && <p>Cargando...</p>}
      {/* Componentes del formulario aquí */}
    </div>
  );
};
*/
