/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Lock, UserPlus, Sprout, Truck } from 'lucide-react';
import api from '@/lib/api';
import toast, { Toaster } from 'react-hot-toast';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'CUSTOMER'
    });
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.post('/auth/register', formData);
            toast.success('Registration successful! Please login.');
            setTimeout(() => router.push('/login'), 1500);
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Registration failed.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container animate-fade-in">
            <Toaster position="top-right" toastOptions={{ style: { background: '#1e2522', color: '#fff' } }} />
            <div className="glass-card auth-card">
                <div className="auth-header">
                    <h1 className="heading-2">Create Account</h1>
                    <p className="text-muted">Join FarmLink to connect with local agriculture.</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="role-selector">
                        <button
                            type="button"
                            className={`role-btn ${formData.role === 'CUSTOMER' ? 'active' : ''}`}
                            onClick={() => setFormData({ ...formData, role: 'CUSTOMER' })}
                        >
                            <User size={24} />
                            <span>Customer</span>
                        </button>
                        <button
                            type="button"
                            className={`role-btn ${formData.role === 'FARMER' ? 'active' : ''}`}
                            onClick={() => setFormData({ ...formData, role: 'FARMER' })}
                        >
                            <Sprout size={24} />
                            <span>Farmer</span>
                        </button>
                        <button
                            type="button"
                            className={`role-btn ${formData.role === 'LOGISTICS' ? 'active' : ''}`}
                            onClick={() => setFormData({ ...formData, role: 'LOGISTICS' })}
                        >
                            <Truck size={24} />
                            <span>Logistics</span>
                        </button>
                    </div>

                    <div className="input-group">
                        <label>Name</label>
                        <div className="input-wrapper">
                            <User className="input-icon" size={20} />
                            <input
                                type="text"
                                className="input-field with-icon"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Email</label>
                        <div className="input-wrapper">
                            <Mail className="input-icon" size={20} />
                            <input
                                type="email"
                                className="input-field with-icon"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <div className="input-wrapper">
                            <Lock className="input-icon" size={20} />
                            <input
                                type="password"
                                className="input-field with-icon"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary w-full" disabled={isLoading}>
                        {isLoading ? 'Creating Account...' : (
                            <>
                                <UserPlus size={20} />
                                <span>Sign Up</span>
                            </>
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Already have an account? <Link href="/login" className="auth-link">Log in</Link></p>
                </div>
            </div>
        </div>
    );
}
