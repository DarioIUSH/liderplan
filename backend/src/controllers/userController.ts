import { Request, Response } from 'express';
import { User, type IUserDocument } from '../models/User.js';
import jwt from 'jsonwebtoken';

// Crear usuario con rol específico (solo ADMIN)
export const createUserWithRole = async (req: Request, res: Response) => {
  try {
    const { email, password, fullName, role } = req.body;

    // Validar datos
    if (!email || !password || !fullName || !role) {
      return res.status(400).json({
        message: 'Email, password, fullName y role son requeridos',
      });
    }

    // Validar rol
    const validRoles = ['ADMIN', 'LEADER', 'TEAM'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        message: `Rol inválido. Roles válidos: ${validRoles.join(', ')}`,
      });
    }

    // Validar contraseña
    if (password.length < 6) {
      return res.status(400).json({
        message: 'La contraseña debe tener al menos 6 caracteres',
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Crear nuevo usuario
    const user = new User({
      email,
      password,
      fullName,
      role,
    });

    await user.save();

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear usuario', error });
  }
};

// Obtener todos los usuarios (solo ADMIN)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password');

    res.status(200).json({
      total: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios', error });
  }
};

// Obtener usuario actual (desde el token)
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuario', error });
  }
};

// Obtener usuario por ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuario', error });
  }
};

// Obtener usuarios por rol
export const getUsersByRole = async (req: Request, res: Response) => {
  try {
    const { role } = req.params;

    const validRoles = ['ADMIN', 'LEADER', 'TEAM'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        message: `Rol inválido. Roles válidos: ${validRoles.join(', ')}`,
      });
    }

    const users = await User.find({ role }).select('-password');

    res.status(200).json({
      role,
      total: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios por rol', error });
  }
};

// Actualizar usuario (perfil propio o por ADMIN)
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { fullName, email, password, role } = req.body;
    const authenticatedUserId = (req as any).userId;
    const authenticatedUserRole = (req as any).userRole;

    // Validar que el usuario solo pueda editar su propio perfil o sea ADMIN
    if (authenticatedUserId !== userId && authenticatedUserRole !== 'ADMIN') {
      return res.status(403).json({
        message: 'No tienes permiso para actualizar este usuario',
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Actualizar campos
    if (fullName) user.fullName = fullName;
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email ya está en uso' });
      }
      user.email = email;
    }

    // Actualizar contraseña si se proporciona
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          message: 'La contraseña debe tener al menos 6 caracteres',
        });
      }
      user.password = password;
    }

    // Solo ADMIN puede cambiar roles
    if (role && authenticatedUserRole === 'ADMIN') {
      const validRoles = ['ADMIN', 'LEADER', 'TEAM'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          message: `Rol inválido. Roles válidos: ${validRoles.join(', ')}`,
        });
      }
      user.role = role;
    }

    await user.save();

    res.status(200).json({
      message: 'Usuario actualizado exitosamente',
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar usuario', error });
  }
};

// Cambiar contraseña
export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validaciones
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: 'currentPassword, newPassword y confirmPassword son requeridos',
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: 'Las contraseñas no coinciden',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: 'La nueva contraseña debe tener al menos 6 caracteres',
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar contraseña actual
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Contraseña actual incorrecta',
      });
    }

    // Cambiar contraseña
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      message: 'Contraseña cambiada exitosamente',
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al cambiar contraseña', error });
  }
};

// Eliminar usuario (solo ADMIN)
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({
      message: 'Usuario eliminado exitosamente',
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar usuario', error });
  }
};

// Cambiar rol de usuario (solo ADMIN)
export const changeUserRole = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { newRole } = req.body;

    if (!newRole) {
      return res.status(400).json({
        message: 'newRole es requerido',
      });
    }

    const validRoles = ['ADMIN', 'LEADER', 'TEAM'];
    if (!validRoles.includes(newRole)) {
      return res.status(400).json({
        message: `Rol inválido. Roles válidos: ${validRoles.join(', ')}`,
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const oldRole = user.role;
    user.role = newRole;
    await user.save();

    res.status(200).json({
      message: 'Rol de usuario actualizado exitosamente',
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        previousRole: oldRole,
        newRole: user.role,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al cambiar rol', error });
  }
};
