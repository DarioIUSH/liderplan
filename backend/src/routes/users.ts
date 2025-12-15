import { Router } from 'express';
import {
  createUserWithRole,
  getCurrentUser,
  getAllUsers,
  getUserById,
  getUsersByRole,
  updateUser,
  changePassword,
  deleteUser,
  changeUserRole,
} from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = Router();

// Rutas públicas
// (ninguna en este caso, todas requieren autenticación)

// Rutas protegidas (requieren autenticación)
router.get('/me', authMiddleware, getCurrentUser);
router.put('/change-password', authMiddleware, changePassword);

// Rutas solo para ADMIN
router.post('/create', authMiddleware, roleMiddleware(['ADMIN']), createUserWithRole);
router.get('/all', authMiddleware, roleMiddleware(['ADMIN']), getAllUsers);
router.get('/role/:role', authMiddleware, roleMiddleware(['ADMIN']), getUsersByRole);
router.delete('/:userId', authMiddleware, roleMiddleware(['ADMIN']), deleteUser);
router.patch('/:userId/role', authMiddleware, roleMiddleware(['ADMIN']), changeUserRole);

// Actualizar usuario (protegido - usuario propio o ADMIN)
router.put('/:userId', authMiddleware, updateUser);

export default router;
