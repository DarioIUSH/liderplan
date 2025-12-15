import { Request, Response } from 'express';
import { Activity } from '../models/Activity.js';
import { Plan } from '../models/Plan.js';
import { User } from '../models/User.js';

export const createActivity = async (req: Request, res: Response) => {
  try {
    const { planId, description, responsible, responsibles, area, startDate, endDate, resources, priority } =
      req.body;

    console.log('═══════════════════════════════════════');
    console.log('📝 CREAR ACTIVIDAD - BACKEND RECIBIDO:');
    console.log('───────────────────────────────────────');
    console.log(`   Descripción: ${description}`);
    console.log(`   Responsable: ${responsible}`);
    console.log(`   Responsables (IDs): ${JSON.stringify(responsibles)}`);
    console.log(`   Inicio (raw): "${startDate}" (type: ${typeof startDate})`);
    console.log(`   Fin (raw): "${endDate}" (type: ${typeof endDate})`);
    console.log('───────────────────────────────────────');

    // Validar que las fechas sean strings en formato YYYY-MM-DD
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'startDate y endDate son obligatorios' });
    }

    const startDateTrimmed = startDate.trim();
    const endDateTrimmed = endDate.trim();

    console.log(`   Inicio (trimmed): "${startDateTrimmed}"`);
    console.log(`   Fin (trimmed): "${endDateTrimmed}"`);

    const activity = new Activity({
      planId,
      description,
      responsible,
      responsibles: responsibles || [],
      area,
      startDate: startDateTrimmed,
      endDate: endDateTrimmed,
      resources,
      priority,
      status: 'No iniciada',
      completionPercentage: 0,
      comments: [],
      evidence: [],
    });

    await activity.save();

    // Populate responsibles para retornar datos completos
    await activity.populate('responsibles', 'fullName email _id');

    console.log(`✅ GUARDADO EN BD:`);
    console.log(`   Inicio BD: "${activity.startDate}"`);
    console.log(`   Fin BD: "${activity.endDate}"`);
    console.log('═══════════════════════════════════════');

    // Add activity to plan
    await Plan.findByIdAndUpdate(planId, {
      $push: { activities: activity._id },
    });

    res.status(201).json({
      message: 'Activity created successfully',
      activity,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create activity', error });
  }
};

export const getActivityById = async (req: Request, res: Response) => {
  try {
    const { activityId } = req.params;

    const activity = await Activity.findById(activityId);

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.status(200).json(activity);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch activity', error });
  }
};

export const updateActivity = async (req: Request, res: Response) => {
  try {
    const { activityId } = req.params;
    const updateData = req.body;

    const activity = await Activity.findByIdAndUpdate(activityId, updateData, {
      new: true,
    });

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.status(200).json({
      message: 'Activity updated successfully',
      activity,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update activity', error });
  }
};

export const updateActivityStatus = async (req: Request, res: Response) => {
  try {
    const { activityId } = req.params;
    const { status, completionPercentage } = req.body;

    const activity = await Activity.findByIdAndUpdate(
      activityId,
      { status, completionPercentage },
      { new: true }
    );

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.status(200).json({
      message: 'Activity status updated successfully',
      activity,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update activity status', error });
  }
};

export const addComment = async (req: Request, res: Response) => {
  try {
    const { activityId } = req.params;
    const { text, author } = req.body;

    const activity = await Activity.findByIdAndUpdate(
      activityId,
      {
        $push: {
          comments: {
            text,
            author,
            date: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.status(200).json({
      message: 'Comment added successfully',
      activity,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add comment', error });
  }
};

export const addEvidence = async (req: Request, res: Response) => {
  try {
    const { activityId } = req.params;
    const { fileName, url } = req.body;

    const activity = await Activity.findByIdAndUpdate(
      activityId,
      {
        $push: {
          evidence: {
            fileName,
            url,
            date: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.status(200).json({
      message: 'Evidence added successfully',
      activity,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add evidence', error });
  }
};

export const deleteActivity = async (req: Request, res: Response) => {
  try {
    const { activityId } = req.params;

    const activity = await Activity.findByIdAndDelete(activityId);

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Remove activity from plan
    await Plan.findByIdAndUpdate(activity.planId, {
      $pull: { activities: activityId },
    });

    res.status(200).json({ message: 'Activity deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete activity', error });
  }
};
