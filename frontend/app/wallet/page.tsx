/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Wallet, ShieldCheck, ArrowRightLeft, CreditCard, Landmark, Clock, FileText, CheckCircle, RefreshCw } from 'lucide-react';
import api from '@/lib/api';
import toast, { Toaster } from 'react-hot-toast';

export default function BuyerWalletPage() {
    const { user, isAuthenticated, isLoading } = useAuthStore();
    const router = useRouter();
    const [wallet, setWallet] = useState<any>(null);
    const [transactions, setTransactions] = useState<any[]>([]);

    // Deposit State
    const [showDepositModal, setShowDepositModal] = useState(false);
    const [depositAmount, setDepositAmount] = useState('');
    const [fundingSource, setFundingSource] = useState('momo');
    const [isFunding, setIsFunding] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated || user?.role !== 'CUSTOMER') {
                router.push('/login');
            } else {
                fetchWalletData();
            }
        }
    }, [isAuthenticated, isLoading, user, router]);

    const fetchWalletData = async () => {
        try {
            const res = await api.get('/wallet');
            setWallet(res.data.wallet);
            setTransactions(res.data.transactions || []);
        } catch {
            toast.error('Failed to load wallet data');
        }
    };

    const handleSimulation = async (type: string) => {
        try {
            setIsFunding(true);

            if (type === 'deposit') {
                if (!depositAmount || parseFloat(depositAmount) <= 0) {
                    toast.error('Enter a valid amount');
                    return;
                }

                toast.success(`Simulating ${fundingSource.toUpperCase()} transfer...`);
                await new Promise(resolve => setTimeout(resolve, 1500));

                await api.post('/wallet/simulate', {
                    amount: parseFloat(depositAmount),
                    type: 'DEPOSIT',
                    reference: `${fundingSource.toUpperCase()}-${Math.floor(Math.random() * 90000) + 10000}`
                });

                toast.success('Funds successfully loaded!');
                setShowDepositModal(false);
                setDepositAmount('');
                fetchWalletData();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Simulation failed');
        } finally {
            setIsFunding(false);
        }
    };

    if (isLoading || !wallet) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '6rem' }}>
                <RefreshCw className="logo-icon animate-pulse" size={40} color="var(--primary-color)" />
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem clamp(2rem, 5vw, 8rem)', maxWidth: '1600px', margin: '0 auto', width: '100%' }}>
            <Toaster position="top-right" toastOptions={{ style: { background: '#1e2522', color: '#fff' } }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 className="heading-1" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <Wallet size={32} color="var(--primary-color)" />
                        FarmLink Enterprise Wallet
                    </h1>
                    <p className="text-muted">Manage your procurement funds and smart-contracts.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => setShowDepositModal(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Landmark size={18} /> Load Funds
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>

                {/* Main Balance Card */}
                <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(0, 0, 0, 0.4))', border: '1px solid rgba(16, 185, 129, 0.3)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.1 }}>
                        <Wallet size={120} />
                    </div>
                    <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        Available Balance
                    </h3>
                    <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'white', marginBottom: '1rem', lineHeight: 1 }}>
                        <span style={{ fontSize: '1.5rem', color: 'var(--primary-color)', verticalAlign: 'top', marginRight: '0.2rem' }}>GHS</span>
                        {wallet.balance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Available for immediate procurement.
                    </p>
                </div>

                {/* Escrow Locks Card */}
                <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(0, 0, 0, 0.4))', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                    <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ShieldCheck size={18} color="#3b82f6" /> Active Escrow Locks
                    </h3>
                    <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'white', marginBottom: '1rem', lineHeight: 1 }}>
                        <span style={{ fontSize: '1.5rem', color: '#60a5fa', verticalAlign: 'top', marginRight: '0.2rem' }}>GHS</span>
                        {wallet.escrowBalance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Funds held securely until delivery confirmation.
                    </p>
                </div>
            </div>

            {/* Transaction Ledger */}
            <div>
                <h2 className="heading-3" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <FileText size={24} color="var(--primary-color)" /> Procurement Ledger
                </h2>

                <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                    {transactions.length === 0 ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                            <Clock size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                            <p>No transactions found.</p>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto', width: '100%' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                                <thead>
                                    <tr style={{ backgroundColor: 'rgba(0,0,0,0.4)', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Date</th>
                                        <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Type</th>
                                        <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Reference</th>
                                        <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600, textAlign: 'right' }}>Amount</th>
                                        <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600, textAlign: 'center' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((tx: any) => (
                                        <tr key={tx.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <td style={{ padding: '1rem' }} suppressHydrationWarning>{new Date(tx.createdAt).toLocaleDateString()}</td>
                                            <td style={{ padding: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                {tx.type === 'DEPOSIT' && <ArrowRightLeft size={16} color="#10b981" />}
                                                {tx.type === 'WITHDRAWAL' && <CreditCard size={16} color="#ef4444" />}
                                                {tx.type.includes('ESCROW') && <ShieldCheck size={16} color="#3b82f6" />}
                                                {tx.type.replace('_', ' ')}
                                            </td>
                                            <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{tx.reference || 'N/A'}</td>
                                            <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 700, color: tx.type === 'DEPOSIT' ? '#10b981' : tx.type.includes('ESCROW') ? '#3b82f6' : 'var(--text-main)' }}>
                                                {tx.type === 'WITHDRAWAL' || tx.type === 'ESCROW_HOLD' ? '-' : '+'}
                                                {tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </td>
                                            <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                <span style={{
                                                    padding: '4px 10px',
                                                    borderRadius: '12px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    backgroundColor: tx.status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(251, 191, 36, 0.1)',
                                                    color: tx.status === 'COMPLETED' ? '#10b981' : '#fbbf24'
                                                }}>
                                                    {tx.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Deposit Modal */}
            {showDepositModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
                    <div className="glass-card" style={{ width: '100%', maxWidth: '500px', backgroundColor: '#1e2522' }}>
                        <h2 className="heading-2" style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Load Procurement Funds</h2>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label className="input-label">Funding Source</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
                                <button
                                    onClick={() => setFundingSource('momo')}
                                    style={{ padding: '1rem', borderRadius: '8px', border: `1px solid ${fundingSource === 'momo' ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)'}`, backgroundColor: fundingSource === 'momo' ? 'rgba(16, 185, 129, 0.1)' : 'transparent', color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer' }}
                                >
                                    <ArrowRightLeft size={18} /> MTN MoMo
                                </button>
                                <button
                                    onClick={() => setFundingSource('bank')}
                                    style={{ padding: '1rem', borderRadius: '8px', border: `1px solid ${fundingSource === 'bank' ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)'}`, backgroundColor: fundingSource === 'bank' ? 'rgba(16, 185, 129, 0.1)' : 'transparent', color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer' }}
                                >
                                    <Landmark size={18} /> Bank Wire
                                </button>
                            </div>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label className="input-label">Amount (GHS)</label>
                            <input
                                type="number"
                                className="input-field"
                                value={depositAmount}
                                onChange={(e) => setDepositAmount(e.target.value)}
                                placeholder="e.g. 50000"
                                style={{ fontSize: '1.5rem', padding: '1rem' }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={() => setShowDepositModal(false)} className="btn-outline" style={{ flex: 1, padding: '12px' }}>Cancel</button>
                            <button onClick={() => handleSimulation('deposit')} disabled={isFunding} className="btn-primary" style={{ flex: 1, padding: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                                {isFunding ? <RefreshCw size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                                {isFunding ? 'Processing...' : 'Confirm Deposit'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
