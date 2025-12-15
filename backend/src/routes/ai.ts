import { Router, Request, Response } from 'express';
import { generateActivitiesWithAI } from '../services/geminiService.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/generate-activities', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { project, goal, origin } = req.body;

    if (!project || !goal || !origin) {
      return res.status(400).json({
        message: 'Missing required fields: project, goal, origin',
      });
    }

    const activities = await generateActivitiesWithAI(project, goal, origin);

    res.status(200).json({
      message: 'Activities generated successfully',
      activities,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to generate activities',
      error,
    });
  }
});

export default router;
