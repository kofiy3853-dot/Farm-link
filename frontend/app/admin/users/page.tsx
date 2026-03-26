/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { Users, Search, Trash2} from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/admin/users');
            setUsers(response.data);
        } catch {
            console.error('Failed to fetch users');
            toast.error('Failed to load users');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            await api.put(`/admin/users/${userId}/role`, { role: newRole });
            toast.success('Role updated successfully');
            fetchUsers(); // Refresh the list
        } catch {
            toast.error('Failed to update role');
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm('Are you sure you want to permanently delete this user?')) return;

        try {
            await api.delete(`/admin/users/${userId}`);
            toast.success('User deleted successfully');
            fetchUsers();
        } catch {
            toast.error('Failed to delete user');
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate-fade-in mx-auto w-full max-w-6xl p-8">

            <div className="d-flex justify-between items-start mb-10 flex-wrap gap-4">
                <div className="d-flex items-center gap-4">
                    <Users size={36} color="var(--primary-color)" />
                    <div>
                        <h1 className="heading-2">User Management</h1>
                        <p className="text-muted mt-1">View, modify roles, and manage all accounts on FarmLink.</p>
                    </div>
                </div>

                <div className="input-wrapper">
                    <Search className="input-icon" size={18} />
                    <input
                        id="user-search"
                        type="text"
                        className="input-field with-icon"
                        placeholder="Search by name or email..."
                        style={{ width: '300px' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        title="Search Users"
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="d-flex justify-center" style={{ padding: '6rem' }}>
                    <div className="logo-icon animate-pulse" style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary-color)' }}></div>
                </div>
            ) : (
                <div className="glass-card p-6 overflow-x-auto">
                    <div className="overflow-x-auto w-full">
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                            <thead>
                                <tr className="border-b">
                                    <th className="p-4" style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Name</th>
                                    <th className="p-4" style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Email</th>
                                    <th className="p-4" style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Role</th>
                                    <th className="p-4" style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Date Joined</th>
                                    <th className="p-4" style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background-color 0.2s' }} className="hover:bg-white/5">
                                        <td className="p-4 font-medium text-main">{user.name}</td>
                                        <td className="p-4" style={{ color: 'var(--text-muted)' }}>{user.email}</td>
                                        <td className="p-4">
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                className="bg-transparent border-none cursor-pointer"
                                                title="Change User Role"
                                                style={{
                                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                                    border: '1px solid var(--border-color)',
                                                    color: user.role === 'ADMIN' ? '#ef4444' : user.role === 'FARMER' ? 'var(--primary-color)' : 'var(--text-main)',
                                                    padding: '6px 12px',
                                                    borderRadius: '6px',
                                                    fontWeight: 600,
                                                    fontSize: '0.8rem',
                                                    outline: 'none',
                                                }}
                                            >
                                                <option value="CUSTOMER">Customer</option>
                                                <option value="FARMER">Farmer</option>
                                                <option value="ADMIN">Admin</option>
                                            </select>
                                        </td>
                                        <td className="p-4" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }} suppressHydrationWarning>
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4" style={{ textAlign: 'right' }}>
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="bg-transparent border-none text-red cursor-pointer p-2 rounded-lg hover:bg-red-900/20"
                                                title="Delete User"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-12 text-center" style={{ color: 'var(--text-muted)' }}>
                                            No users found matching your search.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
