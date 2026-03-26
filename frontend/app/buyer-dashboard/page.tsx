/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building, FileCheck, ShieldCheck, CheckCircle, Clock } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import toast, { Toaster } from 'react-hot-toast';
import AnalyticsPanel from './AnalyticsPanel';

export default function BuyerDashboardPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [profileData, setProfileData] = useState({
        businessName: '', industryType: 'Retailer', district: '', businessLicense: ''
    });
    const [isSavingProfile, setIsSavingProfile] = useState(false);

    // We'll add active tabs later for Orders, Finance, etc.
    const [activeTab, setActiveTab] = useState('PROFILE');

    const { user, isAuthenticated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        } else if (user?.role !== 'CUSTOMER') {
            // Wait, our backend schema sets Role=CUSTOMER by default for buyers
            // Let's assume anyone who isn't a FARMER or ADMIN accessing this is acting as a BUYER.
            if (user?.role === 'FARMER') router.push('/dashboard');
            if (user?.role === 'ADMIN') router.push('/admin');
        } else {
            if (user) {
                setProfileData({
                    businessName: user.businessName || '',
                    industryType: user.industryType || 'Retailer',
                    district: user.district || '',
                    businessLicense: user.businessLicense || ''
                });
            }
            setIsLoading(false);
        }
    }, [isAuthenticated, user, router]);

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingProfile(true);
        try {
            const res = await api.put('/users/profile', profileData);
            toast.success("Buyer Profile updated successfully!");
            useAuthStore.getState().login(res.data, localStorage.getItem('token') || '');

            // Auto mock verification if they upload a license URL
            if (profileData.businessLicense.length > 5 && !user?.isVerified) {
                toast.success("Business License submitted for KYC review!");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to update profile');
        } finally {
            setIsSavingProfile(false);
        }
    };

    if (isLoading) {
        return (
            <div className="d-flex justify-center p-24">
                <div className="animate-pulse" style={{ color: 'var(--primary-color)' }}>Loading Buyer Portal...</div>
            </div>
        );
    }

    return (
        <div className="dashboard-container animate-fade-in mx-auto w-full max-w-6xl p-8">
            <Toaster position="top-right" toastOptions={{ style: { background: '#1e2522', color: '#fff' } }} />

            <div className="d-flex justify-between items-start mb-12 flex-wrap gap-4">
                <div>
                    <h1 className="heading-2 d-flex items-center gap-3">
                        Buyer Procurement Portal
                        {user?.isVerified && (
                            <span className="rounded-full border d-flex items-center p-1 px-4" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontSize: '0.65rem', fontWeight: 700, border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                                <CheckCircle size={10} style={{ marginRight: '4px' }} />
                                VERIFIED BUYER
                            </span>
                        )}
                    </h1>
                    <p className="text-muted mt-2">Manage your sourcing orders, supply chain analytics, and business reputation.</p>
                </div>
            </div>

            <div className="d-flex gap-4 mb-8 border-b pb-4">
                <button
                    onClick={() => setActiveTab('PROFILE')}
                    className="bg-transparent border-none cursor-pointer"
                    style={{ 
                        fontSize: '1.1rem', 
                        fontWeight: activeTab === 'PROFILE' ? 700 : 500, 
                        color: activeTab === 'PROFILE' ? 'var(--primary-color)' : 'var(--text-muted)' 
                    }}
                    title="View Business Profile"
                >
                    Business Profile & KYC
                </button>
                <button
                    onClick={() => setActiveTab('ANALYTICS')}
                    className="bg-transparent border-none cursor-pointer"
                    style={{ 
                        fontSize: '1.1rem', 
                        fontWeight: activeTab === 'ANALYTICS' ? 700 : 500, 
                        color: activeTab === 'ANALYTICS' ? 'var(--primary-color)' : 'var(--text-muted)' 
                    }}
                    title="View Analytics"
                >
                    Analytics Insights
                </button>
            </div>

            {activeTab === 'PROFILE' && (
                <div className="animate-fade-in grid" style={{ gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
                    <div className="glass-card p-8">
                        <h3 className="heading-2 d-flex items-center gap-3" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
                            <Building size={24} color="var(--primary-color)" /> Company Verification Details
                        </h3>

                        {!user?.isVerified && (
                            <div className="p-4 rounded-lg d-flex items-center gap-3 mb-8" style={{ background: 'rgba(245, 158, 11, 0.1)', borderLeft: '4px solid #f59e0b' }}>
                                <ShieldCheck color="#f59e0b" size={24} />
                                <div>
                                    <h4 className="font-bold" style={{ color: '#f59e0b', margin: 0 }}>Verification Pending</h4>
                                    <p className="text-sm text-muted" style={{ margin: 0 }}>Please fill out your business details and provide a license URL to receive the Verified Buyer badge. Verified buyers unlock Escrow payments and credit limits.</p>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSaveProfile} className="d-flex flex-col gap-6">
                            <div className="input-group">
                                <label htmlFor="businessName">Registered Business Name</label>
                                <input 
                                    id="businessName"
                                    type="text" 
                                    className="input-field" 
                                    value={profileData.businessName} 
                                    onChange={e => setProfileData({ ...profileData, businessName: e.target.value })} 
                                    placeholder="e.g. Fresh Foods Supermarket" 
                                    required 
                                    title="Business Name"
                                />
                            </div>

                            <div className="grid grid-auto-fit gap-4">
                                <div className="input-group">
                                    <label htmlFor="industryType">Industry / Buyer Type</label>
                                    <select 
                                        id="industryType"
                                        className="input-field" 
                                        value={profileData.industryType} 
                                        onChange={e => setProfileData({ ...profileData, industryType: e.target.value })}
                                        title="Industry Type"
                                    >
                                        <option value="Retailer">Supermarket / Retailer</option>
                                        <option value="Restaurant">Restaurant / Hospitality</option>
                                        <option value="Processor">Agro-Processor</option>
                                        <option value="Exporter">Exporter</option>
                                        <option value="Wholesaler">Wholesaler / Distributor</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label htmlFor="district">Operating District</label>
                                    <input 
                                        id="district"
                                        type="text" 
                                        className="input-field" 
                                        value={profileData.district} 
                                        onChange={e => setProfileData({ ...profileData, district: e.target.value })} 
                                        placeholder="e.g. Accra Central" 
                                        required 
                                        title="District"
                                    />
                                </div>
                            </div>

                            <div className="input-group mt-2">
                                <label htmlFor="businessLicense" className="d-flex items-center gap-2">
                                    <FileCheck size={16} color="var(--primary-color)" /> Document Upload (Business License / Incorporation URL)
                                </label>
                                <input 
                                    id="businessLicense"
                                    type="url" 
                                    className="input-field" 
                                    value={profileData.businessLicense} 
                                    onChange={e => setProfileData({ ...profileData, businessLicense: e.target.value })} 
                                    placeholder="https://drive.google.com/..." 
                                    title="Business License URL"
                                />
                                <p className="text-xs text-muted mt-1">Provide a secure link to your registration documents for KYC auditing.</p>
                            </div>

                            <button type="submit" className="btn-primary" disabled={isSavingProfile} style={{ alignSelf: 'flex-start' }}>
                                {isSavingProfile ? 'Submitting...' : 'Save & Request Verification'}
                            </button>
                        </form>
                    </div>

                    <div className="d-flex flex-col gap-6">
                        <div className="glass-card p-6">
                            <h4 className="font-bold text-main mb-4 border-b pb-2">Buyer Trust Metrics</h4>

                            <div className="mb-4">
                                <p className="text-xs text-muted mb-1" style={{ textTransform: 'uppercase' }}>On-Time Payment Rate</p>
                                <div className="d-flex items-center gap-2">
                                    <h2 className="text-main" style={{ fontSize: '2rem', margin: 0, lineHeight: 1, color: '#10b981' }}>{user?.onTimePaymentRate || 100}%</h2>
                                </div>
                            </div>

                            <div className="mb-4">
                                <p className="text-xs text-muted mb-1" style={{ textTransform: 'uppercase' }}>Farmer Rating</p>
                                <div className="d-flex items-center gap-2">
                                    <h2 className="text-main" style={{ fontSize: '2rem', margin: 0, lineHeight: 1, color: '#f59e0b' }}>{user?.rating || '5.0'}</h2>
                                    <span style={{ color: '#f59e0b', fontSize: '1.2rem' }}>★</span>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-6" style={{ background: 'rgba(59, 130, 246, 0.05)' }}>
                            <div className="d-flex items-center gap-2 font-bold mb-2" style={{ color: '#3b82f6' }}>
                                <Clock size={18} /> Escrow Analytics
                            </div>
                            <p className="text-sm text-muted" style={{ lineHeight: 1.5 }}>
                                Your trust metrics dictate your platform credit limit. Maintain a 95%+ on-time payment rate and verified status to unlock Zero-Deposit Escrow routing next quarter.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'ANALYTICS' && (
                <AnalyticsPanel />
            )}
        </div>
    );
}
