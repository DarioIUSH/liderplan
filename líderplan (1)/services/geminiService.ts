import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ActivityPriority, ActivityStatus, Activity } from "../types";

// Define the schema for the AI response matching the new table structure
const activitySchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      description: {
        type: Type.STRING,
        description: "Descripción de la actividad (columna ACTIVIDADES)",
      },
      responsible: {
        type: Type.STRING,
        description: "Rol o cargo responsable (columna RESPONSABLE)",
      },
      resources: {
        type: Type.STRING,
        description: "Recursos necesarios (columna RECURSOS)",
      },
      priority: {
        type: Type.STRING,
        enum: ["ALTA", "MEDIA", "BAJA"],
        description: "Prioridad sugerida",
      }
    },
    required: ["description", "responsible", "resources", "priority"],
  },
};

export const generateActivitiesWithAI = async (
  project: string,
  goal: string,
  origin: string
): Promise<Partial<Activity>[]> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API Key not found");
      return [];
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      Actúa como un experto en planificación estratégica.
      Necesito desglosar un plan en actividades operativas para el siguiente contexto:
      
      Proyecto: "${project}"
      Meta: "${goal}"
      Origen/Área: "${origin}"
      
      Genera 5 actividades clave en formato de tabla.
      Para cada actividad, especifica:
      1. La descripción de la actividad.
      2. El rol responsable.
      3. Los recursos necesarios (humanos, técnicos, financieros).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: activitySchema,
        systemInstruction: "Eres un asistente de planificación. Responde en JSON estricto.",
      },
    });

    const rawActivities = JSON.parse(response.text || "[]");

    // Map response to our internal structure
    return rawActivities.map((act: any) => ({
      id: crypto.randomUUID(),
      description: act.description,
      responsible: act.responsible || "Por asignar",
      area: "",
      resources: act.resources || "No especificado",
      priority: act.priority as ActivityPriority || ActivityPriority.MEDIUM,
      status: ActivityStatus.NOT_STARTED,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      completionPercentage: 0,
      comments: [],
      evidence: []
    }));

  } catch (error) {
    console.error("Error generating activities:", error);
    throw error;
  }
};