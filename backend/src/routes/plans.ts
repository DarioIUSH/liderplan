import { Router } from 'express';
import {
  createPlan,
  getUserPlans,
  getPlanById,
  updatePlan,
  deletePlan,
} from '../controllers/planController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/', createPlan);
router.get('/', getUserPlans);
router.get('/:planId', getPlanById);
router.put('/:planId', updatePlan);
router.delete('/:planId', deletePlan);

export default router;
