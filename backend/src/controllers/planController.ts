import { Request, Response } from 'express';
import { Plan } from '../models/Plan.js';
import { Activity } from '../models/Activity.js';

export const createPlan = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { name, project, goal, origin, subOrigin, activities } = req.body;

    console.log('\n╔═══════════════════════════════════════╗');
    console.log('║ 📥 CREAR PLAN - Solicitud Recibida    ║');
    console.log('╚═══════════════════════════════════════╝');
    
    console.log('🔍 Body recibido completo:');
    console.log(JSON.stringify(req.body, null, 2));
    
    console.log(`📊 Resumen: ${activities?.length || 0} actividades`);
    if (activities && Array.isArray(activities)) {
      activities.forEach((act: any, i: number) => {
        console.log(`  [${i+1}] desc="${act.description}" | resp="${act.responsible}" | area="${act.area}"`);
      });
    }

    // Validar campos requeridos
    if (!name || !project || !goal || !origin) {
      return res.status(400).json({ 
        message: 'Los campos name, project, goal y origin son obligatorios.' 
      });
    }

    // Validar que haya al menos una actividad
    if (!activities || activities.length === 0) {
      return res.status(400).json({ 
        message: 'Debe incluir al menos una actividad.' 
      });
    }

    // Crear el plan sin actividades primero
    console.log('\n1️⃣  Creando plan...');
    const plan = new Plan({
      name,
      project,
      goal,
      origin,
      subOrigin: subOrigin || null,
      userId,
      activities: [],
    });

    // Guardar el plan
    await plan.save();
    console.log(`   ✅ Plan guardado con ID: ${plan._id}`);

    // Crear y guardar las actividades vinculadas al plan
    console.log(`\n2️⃣  Creando ${activities.length} actividades...`);
    const savedActivities = await Promise.all(
      activities.map(async (activity: any, index: number) => {
        console.log(`   ⏳ Guardando actividad ${index + 1}/${activities.length}...`);
        const newActivity = new Activity({
          description: activity.description,
          responsible: activity.responsible,
          area: activity.area,
          startDate: activity.startDate,
          endDate: activity.endDate,
          resources: activity.resources,
          priority: activity.priority || 'MEDIUM',
          status: activity.status || 'NOT_STARTED',
          completionPercentage: activity.completionPercentage || 0,
          comments: activity.comments || [],
          evidence: activity.evidence || [],
          planId: plan._id,
        });
        const saved = await newActivity.save();
        console.log(`      ✅ Actividad ${index + 1} guardada con ID: ${saved._id}`);
        return saved;
      })
    );

    // Actualizar el plan con las actividades guardadas
    console.log(`\n3️⃣  Actualizando plan con ${savedActivities.length} actividades...`);
    plan.activities = savedActivities.map(a => a._id);
    await plan.save();
    console.log(`   ✅ Plan actualizado\n`);

    // Poblar referencias antes de responder
    await plan.populate('activities');

    res.status(201).json({
      message: 'Plan y actividades creados exitosamente',
      plan,
    });
  } catch (error) {
    console.error('❌ Error creando plan:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message: 'Error al crear el plan: ' + errorMessage, error });
  }
};

export const getUserPlans = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const plans = await Plan.find({ userId }).populate('activities');

    res.status(200).json(plans);
  } catch (error) {
    console.error('Error obteniendo planes:', error);
    res.status(500).json({ message: 'Error al obtener planes', error });
  }
};

export const getPlanById = async (req: Request, res: Response) => {
  try {
    const { planId } = req.params;
    const userId = (req as any).userId;

    const plan = await Plan.findOne({
      _id: planId,
      userId,
    }).populate('activities');

    if (!plan) {
      return res.status(404).json({ message: 'Plan no encontrado' });
    }

    res.status(200).json(plan);
  } catch (error) {
    console.error('Error obteniendo plan:', error);
    res.status(500).json({ message: 'Error al obtener el plan', error });
  }
};

export const updatePlan = async (req: Request, res: Response) => {
  try {
    const { planId } = req.params;
    const userId = (req as any).userId;
    const { name, project, goal, origin, subOrigin, activities } = req.body;

    // Encontrar el plan
    const plan = await Plan.findOne({ _id: planId, userId });
    if (!plan) {
      return res.status(404).json({ message: 'Plan no encontrado' });
    }

    // Actualizar campos del plan
    if (name) plan.name = name;
    if (project) plan.project = project;
    if (goal) plan.goal = goal;
    if (origin) plan.origin = origin;
    if (subOrigin) plan.subOrigin = subOrigin;

    // Si se proporcionan actividades, actualizar
    if (activities && Array.isArray(activities)) {
      // Eliminar actividades antiguas
      if (plan.activities.length > 0) {
        await Activity.deleteMany({ _id: { $in: plan.activities } });
      }

      // Crear nuevas actividades
      const savedActivities = await Promise.all(
        activities.map(async (activity: any) => {
          const newActivity = new Activity({
            description: activity.description,
            responsible: activity.responsible,
            area: activity.area,
            startDate: activity.startDate,
            endDate: activity.endDate,
            resources: activity.resources,
            priority: activity.priority || 'MEDIUM',
            status: activity.status || 'NOT_STARTED',
            completionPercentage: activity.completionPercentage || 0,
            comments: activity.comments || [],
            evidence: activity.evidence || [],
            planId: plan._id,
          });
          return await newActivity.save();
        })
      );

      plan.activities = savedActivities.map(a => a._id);
    }

    await plan.save();
    await plan.populate('activities');

    res.status(200).json({
      message: 'Plan actualizado exitosamente',
      plan,
    });
  } catch (error) {
    console.error('Error actualizando plan:', error);
    res.status(500).json({ message: 'Error al actualizar el plan', error });
  }
};

export const deletePlan = async (req: Request, res: Response) => {
  try {
    const { planId } = req.params;
    const userId = (req as any).userId;

    const plan = await Plan.findOne({
      _id: planId,
      userId,
    });

    if (!plan) {
      return res.status(404).json({ message: 'Plan no encontrado' });
    }

    // Eliminar todas las actividades asociadas
    if (plan.activities.length > 0) {
      await Activity.deleteMany({ _id: { $in: plan.activities } });
    }

    // Eliminar el plan
    await Plan.findByIdAndDelete(planId);

    res.status(200).json({
      message: 'Plan eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando plan:', error);
    res.status(500).json({ message: 'Error al eliminar el plan', error });
  }
};
