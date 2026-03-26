/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { ShieldAlert, RefreshCw, FileText, FileWarning } from 'lucide-react';
import api from '@/lib/api';
import toast, { Toaster } from 'react-hot-toast';

export default function DisputesPage() {
    const [disputes, setDisputes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDisputes();
    }, []);

    const fetchDisputes = async () => {
        try {
            const response = await api.get('/disputes');
            setDisputes(response.data || []);
        } catch {
            toast.error('Failed to load disputes');
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'OPEN': return { color: '#f97316', bg: 'rgba(249, 115, 22, 0.1)' }; // Orange
            case 'UNDER_REVIEW': return { color: '#eab308', bg: 'rgba(234, 179, 8, 0.1)' }; // Yellow
            case 'RESOLVED_REFUND': return { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' }; // Red
            case 'RESOLVED_RELEASE': return { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' }; // Green
            default: return { color: 'var(--text-muted)', bg: 'rgba(255,255,255,0.05)' };
        }
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '6rem' }}>
                <ShieldAlert className="animate-pulse" size={40} color="#f97316" />
            </div>
        );
    }

    return (
        <div className="orders-container animate-fade-in" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
            <Toaster position="top-right" toastOptions={{ style: { background: '#1e2522', color: '#fff' } }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
                <div>
                    <h1 className="heading-2" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <ShieldAlert size={28} color="#f97316" />
                        Dispute Center
                    </h1>
                    <p className="text-muted" style={{ marginTop: '0.5rem' }}>Track and manage your escalated conflicts and refund requests.</p>
                </div>
                <button onClick={fetchDisputes} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px' }}>
                    <RefreshCw size={16} /> Refresh
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {disputes.map(dispute => {
                    const statusStyle = getStatusStyle(dispute.status);
                    return (
                        <div key={dispute.id} className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <FileWarning size={20} color="#f97316" /> Case #{dispute.id.slice(0, 8)}
                                    </h3>
                                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Raised {new Date(dispute.createdAt).toLocaleString()}</span>
                                </div>
                                <div style={{
                                    padding: '6px 16px',
                                    borderRadius: '20px',
                                    backgroundColor: statusStyle.bg,
                                    border: `1px solid ${statusStyle.color}`,
                                    color: statusStyle.color,
                                    fontWeight: 600,
                                    fontSize: '0.875rem',
                                }}>
                                    {dispute.status.replace('_', ' ')}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                                <div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Linked Order</p>
                                    <p style={{ fontWeight: 500 }}>#{dispute.order.id.slice(0, 8)} ({dispute.order.product?.name})</p>
                                </div>
                                <div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Raised By</p>
                                    <p style={{ fontWeight: 500 }}>{dispute.raisedBy.name}</p>
                                </div>
                                <div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Disputed Amount</p>
                                    <p style={{ fontWeight: 700, color: '#f97316' }}>${dispute.order.totalprice.toFixed(2)}</p>
                                </div>
                            </div>

                            <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Reason</p>
                                <p style={{ fontSize: '1rem', lineHeight: 1.5 }}>{dispute.reason}</p>
                                {dispute.evidenceUrl && (
                                    <div style={{ marginTop: '1rem' }}>
                                        <a href={dispute.evidenceUrl} target="_blank" rel="noreferrer" style={{ color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.875rem' }}>
                                            <FileText size={16} /> View Attached Evidence
                                        </a>
                                    </div>
                                )}
                            </div>

                            {dispute.adminNotes && (
                                <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.05)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                    <p style={{ color: '#10b981', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 600 }}>Admin Resolution Notes</p>
                                    <p style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>{dispute.adminNotes}</p>
                                </div>
                            )}
                        </div>
                    );
                })}

                {disputes.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px dashed var(--border-color)' }}>
                        <ShieldAlert size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                        <p>No disputes active.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
