/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid} from 'recharts';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { TrendingUp, PackageSearch, Activity, DollarSign, Clock } from 'lucide-react';

export default function AnalyticsPanel() {
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const res = await api.get('/users/analytics/buyer');
            setStats(res.data);
        } catch {
            toast.error('Failed to load procurement analytics');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem', opacity: 0.5 }}>
                Loading Analytics Engine...
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="animate-fade-in">
            <h2 className="heading-3" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Activity size={24} color="var(--primary-color)" /> Procurement Insights
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="glass-card">
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <DollarSign size={16} color="#10b981" /> 30-Day Spend
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'white' }}>
                        GHS {stats.totalSpent.toLocaleString()}
                    </div>
                </div>

                <div className="glass-card">
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <PackageSearch size={16} color="#3b82f6" /> Completed Orders
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'white' }}>
                        {stats.completedOrders}
                    </div>
                </div>

                <div className="glass-card">
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock size={16} color="#f59e0b" /> Active/Pending
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'white' }}>
                        {stats.activeOrders + stats.pendingOrders}
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                <div className="glass-card" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
                    <h4 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Daily Procurement Spend (30 Days)</h4>
                    <div style={{ flex: 1, minHeight: 0 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats.spendingTrend}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                                <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickMargin={10} minTickGap={30} />
                                <YAxis stroke="var(--text-muted)" fontSize={12} tickFormatter={(val) => `₵${val}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e2522', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                    formatter={(value: any) => [`GHS ${value}`, 'Spent']}
                                />
                                <Line type="monotone" dataKey="spent" stroke="#10b981" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#10b981' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card" style={{ height: '350px', display: 'flex', flexDirection: 'column' }}>
                    <h4 style={{ marginBottom: '1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <TrendingUp size={18} /> Top Sourced Commodities
                    </h4>
                    <div style={{ flex: 1, minHeight: 0 }}>
                        {stats.topCrops.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.topCrops} layout="vertical" margin={{ left: 40, right: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={true} vertical={false} />
                                    <XAxis type="number" stroke="var(--text-muted)" fontSize={12} />
                                    <YAxis type="category" dataKey="name" stroke="var(--text-muted)" fontSize={12} width={100} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        contentStyle={{ backgroundColor: '#1e2522', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                        formatter={(value: any) => [value, 'Orders']}
                                    />
                                    <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                                No commodity data available for the selected period.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
