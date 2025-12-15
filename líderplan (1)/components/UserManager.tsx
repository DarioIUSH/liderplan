import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2, Edit, Shield, Lock, LogOut } from 'lucide-react';
import { ConfirmDialog } from './ConfirmDialog';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'LEADER' | 'TEAM';
  createdAt?: string;
  updatedAt?: string;
}

interface CreateUserFormData {
  email: string;
  password: string;
  fullName: string;
  role: 'ADMIN' | 'LEADER' | 'TEAM';
}

const UserManager: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [formData, setFormData] = useState<CreateUserFormData>({
    email: '',
    password: '',
    fullName: '',
    role: 'LEADER',
  });
  const [editFormData, setEditFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    isDangerous: false
  });

  const API_URL = 'http://localhost:5000/api';

  // Obtener usuario actual y datos
  useEffect(() => {
    const initializeData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No hay sesión activa');
          setLoading(false);
          return;
        }

        // Obtener usuario actual
        const userResponse = await fetch(`${API_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (userResponse.ok) {
          const user = await userResponse.json();
          const mappedUser = {
            ...user,
            id: user._id || user.id,
          };
          setCurrentUser(mappedUser);

          // Si es ADMIN, obtener todos los usuarios
          if (user.role === 'ADMIN') {
            const usersResponse = await fetch(`${API_URL}/users/all`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (usersResponse.ok) {
              const data = await usersResponse.json();
              const mappedUsers = data.users.map((u: any) => ({
                ...u,
                id: u._id || u.id,
              }));
              setUsers(mappedUsers);
            } else {
              setError('Error al cargar los usuarios');
            }
          }
        } else {
          setError('Error al obtener datos del usuario');
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Error de conexión con el servidor');
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.email || !formData.password || !formData.fullName || !formData.role) {
      setError('Todos los campos son requeridos');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/users/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newUserData = await response.json();
        const mappedUser = {
          ...newUserData.user,
          id: newUserData.user._id || newUserData.user.id,
        };
        setUsers([...users, mappedUser]);
        setFormData({ email: '', password: '', fullName: '', role: 'LEADER' });
        setShowCreateForm(false);
        setSuccess('Usuario creado exitosamente');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error al crear el usuario');
      }
    } catch (err) {
      setError('Error al crear el usuario');
      console.error(err);
    }
  };

  const handleChangeRole = async (userId: string, newRole: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newRole }),
      });

      if (response.ok) {
        setUsers(
          users.map((user) =>
            user.id === userId ? { ...user, role: newRole as any } : user
          )
        );
        setSuccess('Rol actualizado exitosamente');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Error al cambiar el rol');
      }
    } catch (err) {
      setError('Error al cambiar el rol');
      console.error(err);
    }
  };

  const handleDeleteUser = (userId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Eliminar Usuario',
      message: '¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer.',
      isDangerous: true,
      onConfirm: async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${API_URL}/users/${userId}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            setUsers(users.filter((user) => user.id !== userId));
            setSuccess('Usuario eliminado exitosamente');
            setTimeout(() => setSuccess(''), 3000);
          } else {
            setError('Error al eliminar el usuario');
          }
        } catch (err) {
          setError('Error al eliminar el usuario');
          console.error(err);
        } finally {
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const startEditUser = (user: User) => {
    setEditingUserId(user.id);
    setEditFormData({
      fullName: user.fullName,
      email: user.email,
      password: '',
    });
    setError('');
    setSuccess('');
  };

  const cancelEdit = () => {
    setEditingUserId(null);
    setEditFormData({
      fullName: '',
      email: '',
      password: '',
    });
  };

  const handleUpdateUser = async (userId: string) => {
    if (!editFormData.fullName || !editFormData.email) {
      setError('El nombre completo y email son requeridos');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const updateData: any = {
        fullName: editFormData.fullName,
        email: editFormData.email,
      };

      // Solo incluir password si se proporciona uno nuevo
      if (editFormData.password) {
        updateData.password = editFormData.password;
      }

      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const updatedUserData = await response.json();
        const mappedUser = {
          ...updatedUserData.user,
          id: updatedUserData.user._id || updatedUserData.user.id,
        };
        setUsers(
          users.map((user) =>
            user.id === userId ? mappedUser : user
          )
        );
        setEditingUserId(null);
        setSuccess('Usuario actualizado exitosamente');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error al actualizar el usuario');
      }
    } catch (err) {
      setError('Error al actualizar el usuario');
      console.error(err);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800';
      case 'LEADER':
        return 'bg-blue-100 text-blue-800';
      case 'TEAM':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-500">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Gestor de Usuarios</h1>
          </div>
          <p className="text-gray-600">Administra usuarios y roles del sistema</p>
        </div>

        {/* Current User Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{currentUser.fullName}</h2>
              <p className="text-sm text-gray-500">{currentUser.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRoleColor(currentUser.role)}`}>
                {currentUser.role}
              </span>
              <Shield className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-800 rounded-lg border border-red-200">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50 text-green-800 rounded-lg border border-green-200">
            {success}
          </div>
        )}

        {/* Admin Section */}
        {currentUser.role === 'ADMIN' && (
          <>
            {/* Create User Button */}
            <div className="mb-8">
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Plus className="w-4 h-4" />
                Crear Nuevo Usuario
              </button>
            </div>

            {/* Create User Form */}
            {showCreateForm && (
              <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Crear Nuevo Usuario</h2>
                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre Completo
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Juan Pérez"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="juan@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contraseña
                      </label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="••••••"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rol
                      </label>
                      <select
                        value={formData.role}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            role: e.target.value as 'ADMIN' | 'LEADER' | 'TEAM',
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="LEADER">Líder</option>
                        <option value="TEAM">Equipo</option>
                        <option value="ADMIN">Administrador</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Crear Usuario
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Users List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Todos los Usuarios ({users.length})
                </h2>
              </div>

              {loading ? (
                <div className="p-6 text-center text-gray-500">
                  Cargando usuarios...
                </div>
              ) : users.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No hay usuarios disponibles
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                          Usuario
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                          Rol
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                          Creado
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {users.map((user) => (
                        <React.Fragment key={user.id}>
                          <tr className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {user.fullName}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {user.email}
                            </td>
                            <td className="px-6 py-4">
                              <select
                                value={user.role}
                                onChange={(e) =>
                                  handleChangeRole(user.id, e.target.value)
                                }
                                className={`px-3 py-1 rounded-full text-sm font-semibold border-0 cursor-pointer ${getRoleColor(user.role)}`}
                              >
                                <option value="LEADER">Líder</option>
                                <option value="TEAM">Equipo</option>
                                <option value="ADMIN">Administrador</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {user.createdAt
                                ? new Date(user.createdAt).toLocaleDateString()
                                : '-'}
                            </td>
                            <td className="px-6 py-4 text-sm flex gap-2">
                              <button
                                onClick={() => startEditUser(user)}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition"
                              >
                                <Edit className="w-4 h-4" />
                                Editar
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
                              >
                                <Trash2 className="w-4 h-4" />
                                Eliminar
                              </button>
                            </td>
                          </tr>
                          {editingUserId === user.id && (
                            <tr className="bg-blue-50 border-b-2 border-blue-200">
                              <td colSpan={5} className="px-6 py-4">
                                <div className="space-y-4">
                                  <h3 className="font-semibold text-gray-900">
                                    Editar Usuario: {user.fullName}
                                  </h3>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nombre Completo
                                      </label>
                                      <input
                                        type="text"
                                        value={editFormData.fullName}
                                        onChange={(e) =>
                                          setEditFormData({
                                            ...editFormData,
                                            fullName: e.target.value,
                                          })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Nombre completo"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                      </label>
                                      <input
                                        type="email"
                                        value={editFormData.email}
                                        onChange={(e) =>
                                          setEditFormData({
                                            ...editFormData,
                                            email: e.target.value,
                                          })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="email@example.com"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nueva Contraseña (opcional)
                                      </label>
                                      <input
                                        type="password"
                                        value={editFormData.password}
                                        onChange={(e) =>
                                          setEditFormData({
                                            ...editFormData,
                                            password: e.target.value,
                                          })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Dejar en blanco para no cambiar"
                                      />
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleUpdateUser(user.id)}
                                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                    >
                                      Guardar Cambios
                                    </button>
                                    <button
                                      onClick={cancelEdit}
                                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                                    >
                                      Cancelar
                                    </button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* Non-Admin Message */}
        {currentUser.role !== 'ADMIN' && (
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <p className="text-blue-800">
              Solo los administradores pueden ver y gestionar otros usuarios. Tu rol actual es: <strong>{currentUser.role}</strong>
            </p>
          </div>
        )}
      </div>
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        isDangerous={confirmDialog.isDangerous}
        onConfirm={() => {
          confirmDialog.onConfirm();
        }}
        onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
      />    </div>
  );
};

export default UserManager;