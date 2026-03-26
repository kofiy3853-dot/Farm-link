/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { ShieldAlert, Fingerprint, AlertOctagon, Activity, FileWarning, Eye } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminCompliancePage() {
    const [complianceData, setComplianceData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchComplianceData();
    }, []);

    const fetchComplianceData = async () => {
        try {
            const response = await api.get('/admin/compliance');
            setComplianceData(response.data);
        } catch {
            console.error('Failed to fetch compliance stats');
            toast.error('Failed to load compliance radar');
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

    if (!complianceData) return null;

    const { stats, flaggedUsers, flaggedListings } = complianceData;

    return (
        <div className="animate-fade-in" style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
                <ShieldAlert size={36} color="#ef4444" />
                <div>
                    <h1 className="heading-2">Compliance & Security Radar</h1>
                    <p className="text-muted" style={{ marginTop: '0.25rem' }}>Monitor KYC verification, fraud detection, and platform integrity.</p>
                </div>
            </div>

            {/* Security KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                <div className="glass-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: '4px solid #ef4444' }}>
                    <div style={{ padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', color: '#ef4444' }}>
                        <AlertOctagon size={28} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Platform Threat Level</p>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ef4444', textTransform: 'uppercase' }}>{stats.securityLevel}</h3>
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: '4px solid #f59e0b' }}>
                    <div style={{ padding: '1rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px', color: '#f59e0b' }}>
                        <Fingerprint size={28} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Pending KYC Checks</p>
                        <h3 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)' }}>{stats.pendingKYC}</h3>
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: '4px solid #8b5cf6' }}>
                    <div style={{ padding: '1rem', backgroundColor: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px', color: '#8b5cf6' }}>
                        <Activity size={28} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Anomalous Findings</p>
                        <h3 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)' }}>{stats.activeFlags}</h3>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '2rem' }}>
                {/* KYC Issues */}
                <div className="glass-card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Fingerprint size={20} color="#f59e0b" /> User Identity Exceptions
                    </h3>

                    <div style={{ overflowX: 'auto', width: '100%' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Account</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Detected Issue</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem', textAlign: 'right' }}>Review</th>
                                </tr>
                            </thead>
                            <tbody>
                                {flaggedUsers.map((user: any) => (
                                    <tr key={user.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background-color 0.2s' }} className="hover:bg-white/5">
                                        <td style={{ padding: '1rem', color: 'var(--text-main)' }}>
                                            <div style={{ fontWeight: 500 }}>{user.name || 'Anonymous User'}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{user.email}</div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '4px 12px',
                                                borderRadius: '6px',
                                                fontSize: '0.75rem',
                                                fontWeight: 600,
                                                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                                                color: '#f59e0b',
                                            }}>
                                                {user.issue}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <button
                                                style={{
                                                    background: 'var(--primary-color)',
                                                    border: 'none',
                                                    color: '#fff',
                                                    cursor: 'pointer',
                                                    padding: '6px 12px',
                                                    borderRadius: '6px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: 600
                                                }}
                                                className="hover:opacity-90 transition-opacity"
                                            >
                                                Audit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {flaggedUsers.length === 0 && (
                                    <tr>
                                        <td colSpan={3} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                            No KYC Identity issues found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Listing Anomalies */}
                <div className="glass-card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FileWarning size={20} color="#ef4444" /> AI Marketplace Radar
                    </h3>

                    <div style={{ overflowX: 'auto', width: '100%' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Listing</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Trigger Reason</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Date</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem', textAlign: 'right' }}>Review</th>
                                </tr>
                            </thead>
                            <tbody>
                                {flaggedListings.map((listing: any) => (
                                    <tr key={listing.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background-color 0.2s' }} className="hover:bg-white/5">
                                        <td style={{ padding: '1rem', color: 'var(--text-main)' }}>
                                            <div style={{ fontWeight: 500 }}>{listing.name}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>${listing.price.toFixed(2)} Target</div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '4px 12px',
                                                borderRadius: '6px',
                                                fontSize: '0.75rem',
                                                fontWeight: 600,
                                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                                color: '#ef4444',
                                            }}>
                                                {listing.issue}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <button
                                                style={{
                                                    background: 'transparent',
                                                    border: '1px solid var(--border-color)',
                                                    color: 'var(--text-main)',
                                                    cursor: 'pointer',
                                                    padding: '6px',
                                                    borderRadius: '6px',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                                className="hover:bg-white/10 transition-colors"
                                                title="Inspect Listing"
                                            >
                                                <Eye size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {flaggedListings.length === 0 && (
                                    <tr>
                                        <td colSpan={3} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                            No marketplace anomalies detected.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    );
}
