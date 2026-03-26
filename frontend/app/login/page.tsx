/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, LogIn } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import toast, { Toaster } from 'react-hot-toast';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const login = useAuthStore(state => state.login);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { data } = await api.post('/auth/login', { email, password });
            login(data.user, data.token);
            toast.success('Welcome back!');
            router.push(data.user.role === 'FARMER' ? '/dashboard' : '/marketplace');
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Login failed. Please check credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container animate-fade-in">
            <Toaster position="top-right" toastOptions={{ style: { background: '#1e2522', color: '#fff' } }} />
            <div className="glass-card auth-card">
                <div className="auth-header">
                    <h1 className="heading-2">Welcome Back</h1>
                    <p className="text-muted">Enter your credentials to access your account.</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <label>Email</label>
                        <div className="input-wrapper">
                            <Mail className="input-icon" size={20} />
                            <input
                                type="email"
                                className="input-field with-icon"
                                placeholder="you@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
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
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary w-full" disabled={isLoading}>
                        {isLoading ? 'Signing In...' : (
                            <>
                                <LogIn size={20} />
                                <span>Sign In</span>
                            </>
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Don't have an account? <Link href="/register" className="auth-link">Sign up</Link></p>
                </div>
            </div>
        </div>
    );
}
