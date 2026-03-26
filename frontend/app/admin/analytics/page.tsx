/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, PieChart } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#64748b'];

export default function AdminAnalyticsPage() {
    const [analyticsData, setAnalyticsData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchAnalyticsData();
    }, []);

    const fetchAnalyticsData = async () => {
        try {
            const response = await api.get('/admin/analytics');
            setAnalyticsData(response.data);
        } catch {
            console.error('Failed to fetch analytics stats');
            toast.error('Failed to load analytics platform');
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

    if (!analyticsData) return null;

    const { revenueTrend, productCategories, totalOrdersLast30Days } = analyticsData;

    return (
        <div className="animate-fade-in" style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
                <BarChart3 size={36} color="var(--primary-color)" />
                <div>
                    <h1 className="heading-2">Platform Analytics</h1>
                    <p className="text-muted" style={{ marginTop: '0.25rem' }}>Deep-dive into historic trends and market distributions.</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '1rem', backgroundColor: 'var(--primary-light)', borderRadius: '12px', color: 'var(--primary-color)' }}>
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>30-Day Orders</p>
                        <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)' }}>{totalOrdersLast30Days}</h3>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '2rem' }}>
                {/* Revenue Trend Chart */}
                <div className="glass-card" style={{ padding: '1.5rem', height: '400px', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <TrendingUp size={18} /> Revesue History (Past 30 Days)
                    </h3>
                    <div style={{ flex: 1, minHeight: 0 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis
                                    dataKey="date"
                                    stroke="var(--text-muted)"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(val) => {
                                        const d = new Date(val);
                                        return `${d.getMonth() + 1}/${d.getDate()}`;
                                    }}
                                />
                                <YAxis stroke="var(--text-muted)" fontSize={12} tickFormatter={(val) => `GH₵${val / 1000}k`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--bg-dark)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                    formatter={(value: any) => [`$${parseFloat(value).toFixed(2)}`, 'Revenue']}
                                    labelFormatter={(label) => <span suppressHydrationWarning>{new Date(label).toLocaleDateString()}</span>}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="var(--primary-color)" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Distribution Chart */}
                <div className="glass-card" style={{ padding: '1.5rem', height: '400px', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <PieChart size={18} /> Marketplace Sector Distribution
                    </h3>
                    <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {productCategories && productCategories.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <RechartsPieChart>
                                    <Pie
                                        data={productCategories}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={120}
                                        paddingAngle={5}
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                    >
                                        {productCategories.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                </RechartsPieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-muted" style={{ textAlign: 'center' }}>No category data available</div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}
