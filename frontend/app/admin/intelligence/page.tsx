/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { Loader2, Activity, ShieldAlert, LineChart as LineChartIcon, Users, Package } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import api from '@/lib/api';

// MOCK DATA: Growth Forecast (Real model would be Phase 2)
const GROWTH_FORECAST = [
    { month: 'Jan', revenue: 4000, projected: 4100 },
    { month: 'Feb', revenue: 3000, projected: 3500 },
    { month: 'Mar', revenue: 5000, projected: 5500 },
    { month: 'Apr', revenue: null, projected: 6500 },
    { month: 'May', revenue: null, projected: 7200 },
    { month: 'Jun', revenue: null, projected: 8500 },
];

// MOCK DATA: Fraud/Risk Radar
const RISK_PATTERNS = [
    { subject: 'Fake Listings', A: 120, fullMark: 150 },
    { subject: 'Escrow Disputes', A: 98, fullMark: 150 },
    { subject: 'Logistics Delays', A: 86, fullMark: 150 },
    { subject: 'Payment Fraud', A: 40, fullMark: 150 },
    { subject: 'Account Takeovers', A: 25, fullMark: 150 },
];

export default function AdminIntelligenceDashboard() {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAdminStatus = async () => {
            try {
                // Ensure the user testing this has an admin token or we just display data.
                // For the sake of this phase, we assume the token is valid.
                const res = await api.get('/insights/admin-status');
                setData(res.data);
            } catch (error) {
                console.error('Failed to fetch admin intelligence', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAdminStatus();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-24">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            </div>
        );
    }

    if (!data) return <div className="p-8 text-center text-red-500">Failed to load Admin Intelligence Dashboard. Ensure you have admin access.</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in bg-slate-50 dark:bg-slate-900 min-h-screen">
            <header className="mb-8 border-b border-border pb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <Activity className="text-blue-600" size={32} /> FarmLink Ecosystem Health
                    </h1>
                    <p className="text-muted mt-2">Overall administrative intelligence and forecasted growth patterns.</p>
                </div>
                <div className="text-right">
                    <span className="text-sm font-medium text-slate-500 block mb-1">Ecosystem Health Score</span>
                    <span className={`text-3xl font-black ${data.ecosystemHealthScore > 80 ? 'text-green-500' : 'text-orange-500'}`}>
                        {data.ecosystemHealthScore} / 100
                    </span>
                </div>
            </header>

            {/* Top Level KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card flex items-center p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-border">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-xl mr-6">
                        <Users className="text-blue-600" size={24} />
                    </div>
                    <div>
                        <div className="text-sm font-medium text-slate-500 mb-1">Total Network Users</div>
                        <div className="text-2xl font-bold">{data.userCount} Active</div>
                    </div>
                </div>

                <div className="glass-card flex items-center p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-border">
                    <div className="bg-emerald-100 dark:bg-emerald-900/30 p-4 rounded-xl mr-6">
                        <Package className="text-emerald-600" size={24} />
                    </div>
                    <div>
                        <div className="text-sm font-medium text-slate-500 mb-1">Total Lifetime Orders</div>
                        <div className="text-2xl font-bold">{data.orderCount} Processed</div>
                    </div>
                </div>

                <div className="glass-card flex items-center p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-border">
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-xl mr-6">
                        <LineChartIcon className="text-purple-600" size={24} />
                    </div>
                    <div>
                        <div className="text-sm font-medium text-slate-500 mb-1">Total Escrow Processed</div>
                        <div className="text-2xl font-bold">₵ {(data.totalRevenue || 0).toLocaleString()}</div>
                    </div>
                </div>
            </div >

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Growth Forecasting Area Chart */}
                <div className="glass-card bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-border">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-white">
                        <LineChartIcon size={20} className="text-blue-500" /> Platform Growth Forecast
                    </h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={GROWTH_FORECAST} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Area type="monotone" dataKey="projected" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorProjected)" strokeDasharray="5 5" />
                                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 text-sm text-slate-500 flex justify-center gap-6">
                        <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Actual Revenue</span>
                        <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-purple-500"></div> AI Projected</span>
                    </div>
                </div>

                {/* Fraud Risk Spider/Radar Chart */}
                <div className="glass-card bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-border flex flex-col items-center">
                    <h3 className="text-lg font-bold mb-2 flex items-center gap-2 self-start text-slate-800 dark:text-white">
                        <ShieldAlert size={20} className="text-orange-500" /> Fraud & Risk Patterns
                    </h3>
                    <p className="text-sm text-slate-500 mb-6 self-start">AI Analysis of anomaly events across the marketplace.</p>

                    <div className="h-64 w-full max-w-sm">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={RISK_PATTERNS}>
                                <PolarGrid stroke="#e2e8f0" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                                <Radar name="Incidents" dataKey="A" stroke="#f97316" fill="#fb923c" fillOpacity={0.6} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div >
    );
}
