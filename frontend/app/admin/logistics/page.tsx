/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { Truck, PackageSearch, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminLogisticsPage() {
    const [logisticsData, setLogisticsData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchLogisticsData();
    }, []);

    const fetchLogisticsData = async () => {
        try {
            const response = await api.get('/admin/logistics');
            setLogisticsData(response.data);
        } catch {
            console.error('Failed to fetch logistics stats');
            toast.error('Failed to load logistics data');
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

    if (!logisticsData) return null;

    const { stats, activeDeliveries } = logisticsData;

    return (
        <div className="animate-fade-in" style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
                <Truck size={36} color="var(--primary-color)" />
                <div>
                    <h1 className="heading-2">Logistics Oversight</h1>
                    <p className="text-muted" style={{ marginTop: '0.25rem' }}>Monitor active deliveries, warehouse status, and order fulfillment.</p>
                </div>
            </div>

            {/* Logistics KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                <div className="glass-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: '4px solid #f59e0b' }}>
                    <div style={{ padding: '1rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px', color: '#f59e0b' }}>
                        <Clock size={28} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Pending</p>
                        <h3 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)' }}>{stats.pending}</h3>
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: '4px solid #3b82f6' }}>
                    <div style={{ padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', color: '#3b82f6' }}>
                        <PackageSearch size={28} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Processing</p>
                        <h3 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)' }}>{stats.processing}</h3>
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: '4px solid #8b5cf6' }}>
                    <div style={{ padding: '1rem', backgroundColor: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px', color: '#8b5cf6' }}>
                        <MapPin size={28} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>In Transit</p>
                        <h3 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)' }}>{stats.shipped}</h3>
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: '4px solid var(--primary-color)' }}>
                    <div style={{ padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: 'var(--primary-color)' }}>
                        <CheckCircle2 size={28} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Delivered</p>
                        <h3 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)' }}>{stats.delivered}</h3>
                    </div>
                </div>
            </div>

            {/* Active Deliveries */}
            <div className="glass-card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>Active Fleet & Deliveries</h3>

                <div style={{ overflowX: 'auto', width: '100%' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Tracking ID</th>
                                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Date</th>
                                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Origin (Farmer)</th>
                                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Destination (Buyer)</th>
                                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Cargo</th>
                                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem', textAlign: 'center' }}>Live Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activeDeliveries.map((delivery: any) => (
                                <tr key={delivery.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background-color 0.2s' }} className="hover:bg-white/5">
                                    <td style={{ padding: '1rem', color: 'var(--text-main)', fontSize: '0.85rem', fontFamily: 'monospace', fontWeight: 600 }}>
                                        TRK-{delivery.id.substring(0, 8).toUpperCase()}
                                    </td>
                                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                                        <div style={{ color: 'var(--text-main)', fontWeight: 500 }}>{delivery.product?.farmer?.name || 'Unknown'}</div>
                                    </td>
                                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                                        <div style={{ color: 'var(--text-main)', fontWeight: 500 }}>{delivery.customer?.name || 'Unknown'}</div>
                                    </td>
                                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                                        <div style={{ fontWeight: 600 }}>{delivery.product?.name || 'Unknown Cargo'}</div>
                                        <div style={{ fontSize: '0.8rem' }}>Qty: {delivery.quantity}</div>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            backgroundColor: delivery.status === 'shipped' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                                            color: delivery.status === 'shipped' ? '#8b5cf6' : '#3b82f6',
                                            textTransform: 'uppercase',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}>
                                            {delivery.status === 'shipped' ? <MapPin size={12} /> : <PackageSearch size={12} />}
                                            {delivery.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {activeDeliveries.length === 0 && (
                                <tr>
                                    <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        No active deliveries found in the network.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
