/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { CreditCard, DollarSign, Wallet, TrendingUp} from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminFinancePage() {
    const [financeData, setFinanceData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchFinanceData();
    }, []);

    const fetchFinanceData = async () => {
        try {
            const response = await api.get('/admin/finance');
            setFinanceData(response.data);
        } catch {
            console.error('Failed to fetch finance stats');
            toast.error('Failed to load financial data');
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

    if (!financeData) return null;

    const { stats, recentTransactions } = financeData;

    return (
        <div className="animate-fade-in" style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
                <CreditCard size={36} color="var(--primary-color)" />
                <div>
                    <h1 className="heading-2">Finance & Payments</h1>
                    <p className="text-muted" style={{ marginTop: '0.25rem' }}>Track platform revenue, commissions, and transaction history.</p>
                </div>
            </div>

            {/* Financial KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                <div className="glass-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: '4px solid #3b82f6' }}>
                    <div style={{ padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', color: '#3b82f6' }}>
                        <Wallet size={28} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Total Platform Volume</p>
                        <h3 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)' }}>${stats.totalPlatformVolume.toFixed(2)}</h3>
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: '4px solid var(--primary-color)' }}>
                    <div style={{ padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: 'var(--primary-color)' }}>
                        <DollarSign size={28} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Platform Earnings (5%)</p>
                        <h3 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)' }}>${stats.totalCommission.toFixed(2)}</h3>
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: '4px solid #f59e0b' }}>
                    <div style={{ padding: '1rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px', color: '#f59e0b' }}>
                        <TrendingUp size={28} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Farmer Earnings</p>
                        <h3 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)' }}>${stats.farmerEarnings.toFixed(2)}</h3>
                    </div>
                </div>
            </div>

            {/* Transaction History */}
            <div className="glass-card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>Global Transaction Ledger</h3>

                <div style={{ overflowX: 'auto', width: '100%' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Order ID</th>
                                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Product</th>
                                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Buyer</th>
                                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Seller</th>
                                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Amount</th>
                                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem', textAlign: 'right' }}>Platform Fee (5%)</th>
                                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem', textAlign: 'center' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentTransactions.map((tx: any) => (
                                <tr key={tx.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background-color 0.2s' }} className="hover:bg-white/5">
                                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }} suppressHydrationWarning>{new Date(tx.createdAt).toLocaleDateString()}</td>
                                    <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                                        {tx.id.substring(0, 8)}...
                                    </td>
                                    <td style={{ padding: '1rem', color: 'var(--text-main)', fontWeight: 500 }}>
                                        {tx.product?.name || 'Deleted Product'}
                                    </td>
                                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                                        {tx.customer?.name || 'Unknown'}
                                    </td>
                                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                                        {tx.product?.farmer?.name || 'Unknown'}
                                    </td>
                                    <td style={{ padding: '1rem', color: 'var(--text-main)', fontWeight: 700 }}>
                                        ${tx.totalprice.toFixed(2)}
                                    </td>
                                    <td style={{ padding: '1rem', color: 'var(--primary-color)', fontWeight: 600, textAlign: 'right' }}>
                                        + ${(tx.totalprice * 0.05).toFixed(2)}
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '6px',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            backgroundColor: tx.status === 'delivered' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                            color: tx.status === 'delivered' ? 'var(--primary-color)' : '#f59e0b',
                                            textTransform: 'uppercase'
                                        }}>
                                            {tx.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {recentTransactions.length === 0 && (
                                <tr>
                                    <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        No transactions found.
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
