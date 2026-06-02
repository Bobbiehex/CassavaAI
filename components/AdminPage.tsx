import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Shield, Search, UserCheck, ShieldAlert, User as UserIcon } from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const data = await ApiService.getUsers();
        setUsers(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setError('Failed to load users. You might not have permission.');
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser?.role === 'ADMIN' || currentUser?.role === 'SUPER_ADMIN') {
      fetchUsers();
    } else {
      setIsLoading(false);
      setError('Access denied. Admin privileges required.');
    }
  }, [currentUser]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await ApiService.updateUserRole(userId, newRole);
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      console.error('Failed to update role:', err);
      alert('Failed to update user role.');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <ShieldAlert size={48} className="mx-auto text-rose-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Access Denied</h2>
        <p className="text-slate-600 dark:text-slate-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="text-emerald-600" />
            User Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400">Manage user roles and permissions</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                <th className="p-4 font-medium text-slate-600 dark:text-slate-300">User</th>
                <th className="p-4 font-medium text-slate-600 dark:text-slate-300">Email</th>
                <th className="p-4 font-medium text-slate-600 dark:text-slate-300">Current Role</th>
                <th className="p-4 font-medium text-slate-600 dark:text-slate-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500 dark:text-slate-400">
                    No users found matching "{searchQuery}"
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                            <UserIcon size={20} />
                          </div>
                        )}
                        <span className="font-medium text-slate-900 dark:text-white">{user.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{user.email}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                        user.role === 'ADMIN' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        {user.role !== 'SUPER_ADMIN' && currentUser?.id !== user.id && (
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            disabled={user.role === 'SUPER_ADMIN'}
                            className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none disabled:opacity-50"
                          >
                            <option value="FARMER">Farmer</option>
                            <option value="ADMIN">Admin</option>
                            {currentUser?.role === 'SUPER_ADMIN' && (
                              <option value="SUPER_ADMIN">Super Admin</option>
                            )}
                          </select>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
