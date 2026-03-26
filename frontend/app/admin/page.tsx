/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Sprout, ShoppingCart, Activity, ShieldAlert, ArrowUpRight } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { user, isAuthenticated } = useAuthStore();
    const router = useRouter();

    // Mock data for the activity graph
    const activityData = [
        { name: 'Mon', transactions: 4000, revenue: 2400 },
        { name: 'Tue', transactions: 3000, revenue: 1398 },
        { name: 'Wed', transactions: 2000, revenue: 9800 },
        { name: 'Thu', transactions: 2780, revenue: 3908 },
        { name: 'Fri', transactions: 1890, revenue: 4800 },
        { name: 'Sat', transactions: 2390, revenue: 3800 },
        { name: 'Sun', transactions: 3490, revenue: 4300 },
    ];

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        } else if (user?.role !== 'ADMIN') {
            router.push('/');
        } else {
            fetchStats();
        }
    }, [isAuthenticated, user, router]);

    const fetchStats = async () => {
        try {
            const response = await api.get('/admin/stats');
            setStats(response.data);
        } catch {
            console.error('Failed to fetch admin stats');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '6rem' }}>
                <div className="logo-icon animate-pulse" style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary-color)' }}></div>
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="admin-dashboard animate-fade-in" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
                <ShieldAlert size={36} color="#ef4444" />
                <div>
                    <h1 className="heading-2">Executive Overview</h1>
                    <p className="text-muted" style={{ marginTop: '0.25rem' }}>Platform operations, ecosystem health, and financial metrics.</p>
                </div>
            </div>

            {/* KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                <div className="glass-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: '4px solid #3b82f6' }}>
                    <div style={{ padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', color: '#3b82f6' }}>
                        <Users size={28} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Total Users</p>
                        <h3 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)' }}>{stats.stats.totalUsers}</h3>
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: '4px solid var(--primary-color)' }}>
                    <div style={{ padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: 'var(--primary-color)' }}>
                        <Sprout size={28} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Farmers</p>
                        <h3 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)' }}>{stats.stats.totalFarmers}</h3>
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: '4px solid #f59e0b' }}>
                    <div style={{ padding: '1rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px', color: '#f59e0b' }}>
                        <ShoppingCart size={28} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Total Orders</p>
                        <h3 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)' }}>{stats.stats.totalOrders}</h3>
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: '4px solid #8b5cf6' }}>
                    <div style={{ padding: '1rem', backgroundColor: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px', color: '#8b5cf6' }}>
                        <Activity size={28} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Listed Products</p>
                        <h3 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)' }}>{stats.stats.totalProducts}</h3>
                    </div>
                </div>
            </div>

            {/* Real-time Graph */}
            <div className="glass-card" style={{ padding: '2rem', marginBottom: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)' }}>Weekly Market Activity</h3>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary-color)', fontSize: '0.875rem', fontWeight: 600 }}>
                        <ArrowUpRight size={16} /> +14.2% Growth
                    </span>
                </div>
                <div style={{ width: '100%', height: 350 }}>
                    <ResponsiveContainer>
                        <AreaChart data={activityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--primary-color)" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="var(--primary-color)" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorTransactions" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
                                itemStyle={{ color: 'var(--text-main)' }}
                            />
                            <Area type="monotone" dataKey="transactions" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTransactions)" />
                            <Area type="monotone" dataKey="revenue" stroke="var(--primary-color)" fillOpacity={1} fill="url(#colorRevenue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                {/* Recent Users */}
                <div className="glass-card" style={{ padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>Latest Registrations</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {stats.recentUsers.map((user: any) => (
                            <div key={user.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                                <div>
                                    <p style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem' }}>{user.name}</p>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{user.email}</p>
                                </div>
                                <span style={{
                                    padding: '4px 10px',
                                    borderRadius: '12px',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    backgroundColor: user.role === 'FARMER' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                                    color: user.role === 'FARMER' ? 'var(--primary-color)' : '#3b82f6'
                                }}>
                                    {user.role}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="glass-card" style={{ padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>Recent Transactions</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {stats.recentOrders.map((order: any) => (
                            <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                                <div>
                                    <p style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem' }}>{order.product.name}</p>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Buyer: {order.customer.name}</p>
                                </div>
                                <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                                    ${order.product.price.toFixed(2)}
                                </span>
                            </div>
                        ))}
                        {stats.recentOrders.length === 0 && (
                            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1rem 0' }}>No recent transactions.</p>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}
