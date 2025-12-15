import { Router } from 'express';
import {
  createActivity,
  getActivityById,
  updateActivity,
  updateActivityStatus,
  addComment,
  addEvidence,
  deleteActivity,
} from '../controllers/activityController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/', createActivity);
router.get('/:activityId', getActivityById);
router.put('/:activityId', updateActivity);
router.patch('/:activityId/status', updateActivityStatus);
router.post('/:activityId/comments', addComment);
router.post('/:activityId/evidence', addEvidence);
router.delete('/:activityId', deleteActivity);

export default router;
