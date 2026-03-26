'use client';

import { useState } from 'react';
import { Settings, Save, Server, Shield, Globe, Database} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
    const [isSaving, setIsSaving] = useState(false);

    // Mock settings state (in production this would be pulled from a global DB config table)
    const [settings, setSettings] = useState({
        platformFee: 5.0,
        maintenanceMode: false,
        autoApproveProducts: false,
        maxFileSize: 5,
        defaultCurrency: 'USD',
        apiRateLimit: 100,
        requireKyc: true,
        enableAI: true,
    });

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        // Simulating API call latency
        setTimeout(() => {
            toast.success('Platform configuration saved successfully!');
            setIsSaving(false);
        }, 800);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;

        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
                type === 'number' ? parseFloat(value) : value
        }));
    };

    return (
        <div className="animate-fade-in mx-auto w-full max-w-6xl p-8">

            <div className="d-flex items-center justify-between mb-12">
                <div className="d-flex items-center gap-4">
                    <Settings size={36} color="var(--primary-color)" />
                    <div>
                        <h1 className="heading-2">System Configuration</h1>
                        <p className="text-muted mt-1">Manage global platform parameters, fee structures, and feature flags.</p>
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    title="Save Configuration"
                    aria-label="Save Configuration"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1.5rem',
                        backgroundColor: 'var(--primary-color)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 600,
                        cursor: isSaving ? 'not-allowed' : 'pointer',
                        opacity: isSaving ? 0.7 : 1,
                        transition: 'all 0.2s',
                    }}
                    className="hover:shadow-md"
                >
                    {isSaving ? (
                        <div className="animate-spin rounded-full border-2" style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white' }} />
                    ) : (
                        <Save size={18} />
                    )}
                    {isSaving ? 'Saving...' : 'Save Configuration'}
                </button>
            </div>

            <div className="grid grid-cols-1 gap-8">

                {/* Global Financial Control */}
                <div className="glass-card p-8">
                    <h3 className="text-lg font-bold text-main mb-6 border-b pb-4 d-flex items-center gap-3">
                        <Globe size={20} color="#10b981" /> Financial Infrastructure
                    </h3>

                    <div className="grid grid-auto-fit gap-6">
                        <div className="form-group">
                            <label htmlFor="platformFee" className="form-label d-flex justify-between">
                                <span>Platform Commission Fee (%)</span>
                                <span style={{ color: 'var(--primary-color)', fontWeight: 600 }}>{settings.platformFee}%</span>
                            </label>
                            <input
                                id="platformFee"
                                type="number"
                                name="platformFee"
                                value={settings.platformFee}
                                onChange={handleChange}
                                className="form-input"
                                min="0" max="100" step="0.5"
                                title="Platform Commission Fee Percentage"
                                placeholder="e.g. 5.0"
                            />
                            <p className="text-sm mt-2 text-muted">Base percentage automatically deducted from all completed transactions.</p>
                        </div>

                        <div className="form-group">
                            <label htmlFor="defaultCurrency" className="form-label">Default Operating Currency</label>
                            <select
                                id="defaultCurrency"
                                name="defaultCurrency"
                                value={settings.defaultCurrency}
                                onChange={handleChange}
                                className="form-input bg-transparent text-main"
                                title="Default Operating Currency"
                            >
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="GHS">GHS (₵)</option>
                                <option value="NGN">NGN (₦)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Security & Access */}
                <div className="glass-card p-8">
                    <h3 className="text-lg font-bold text-main mb-6 border-b pb-4 d-flex items-center gap-3">
                        <Shield size={20} color="#3b82f6" /> Security & Access Controls
                    </h3>

                    <div className="d-flex flex-col gap-6">

                        <label htmlFor="requireKyc" className="d-flex items-center justify-between p-4 bg-subtle rounded-lg cursor-pointer" style={{ border: `1px solid ${settings.requireKyc ? '#3b82f6' : 'rgba(255,255,255,0.05)'}`, transition: 'all 0.2s' }}>
                            <div>
                                <h4 className="font-bold text-main mb-1">Strict KYC Enforcement</h4>
                                <p className="text-sm text-muted">Require all new buyers and farmers to pass identity verification before participating in the marketplace.</p>
                            </div>
                            <div className="relative inline-block" style={{ width: '40px', height: '24px' }}>
                                <input id="requireKyc" type="checkbox" name="requireKyc" checked={settings.requireKyc} onChange={handleChange} className="opacity-0 w-0 h-0" title="Require KYC" />
                                <span className="absolute inset-0 cursor-pointer rounded-full" style={{ backgroundColor: settings.requireKyc ? '#3b82f6' : 'rgba(255,255,255,0.1)', transition: '.4s' }}>
                                    <span className="absolute rounded-full bg-white" style={{ height: '16px', width: '16px', left: settings.requireKyc ? '20px' : '4px', bottom: '4px', transition: '.4s' }} />
                                </span>
                            </div>
                        </label>

                        <label htmlFor="autoApproveProducts" className="d-flex items-center justify-between p-4 bg-subtle rounded-lg cursor-pointer" style={{ border: `1px solid ${settings.autoApproveProducts ? '#3b82f6' : 'rgba(255,255,255,0.05)'}`, transition: 'all 0.2s' }}>
                            <div>
                                <h4 className="font-bold text-main mb-1">Auto-Approve Listings</h4>
                                <p className="text-sm text-muted">Automatically bypass manual review for all incoming product commodities.</p>
                            </div>
                            <div className="relative inline-block" style={{ width: '40px', height: '24px' }}>
                                <input id="autoApproveProducts" type="checkbox" name="autoApproveProducts" checked={settings.autoApproveProducts} onChange={handleChange} className="opacity-0 w-0 h-0" title="Auto-Approve Listings" />
                                <span className="absolute inset-0 cursor-pointer rounded-full" style={{ backgroundColor: settings.autoApproveProducts ? '#3b82f6' : 'rgba(255,255,255,0.1)', transition: '.4s' }}>
                                    <span className="absolute rounded-full bg-white" style={{ height: '16px', width: '16px', left: settings.autoApproveProducts ? '20px' : '4px', bottom: '4px', transition: '.4s' }} />
                                </span>
                            </div>
                        </label>

                        <label htmlFor="enableAI" className="d-flex items-center justify-between p-4 bg-subtle rounded-lg cursor-pointer" style={{ border: `1px solid ${settings.enableAI ? '#3b82f6' : 'rgba(255,255,255,0.05)'}`, transition: 'all 0.2s' }}>
                            <div>
                                <h4 className="font-bold text-main mb-1 d-flex items-center gap-2">
                                    AI Sub-systems
                                    <span className="text-xs border-blue bg-blue rounded p-1" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>Experimental</span>
                                </h4>
                                <p className="text-sm text-muted">Enable AI analytics for price anomalies, crop yield predictions, and automated risk scoring.</p>
                            </div>
                            <div className="relative inline-block" style={{ width: '40px', height: '24px' }}>
                                <input id="enableAI" type="checkbox" name="enableAI" checked={settings.enableAI} onChange={handleChange} className="opacity-0 w-0 h-0" title="Enable AI" />
                                <span className="absolute inset-0 cursor-pointer rounded-full" style={{ backgroundColor: settings.enableAI ? '#3b82f6' : 'rgba(255,255,255,0.1)', transition: '.4s' }}>
                                    <span className="absolute rounded-full bg-white" style={{ height: '16px', width: '16px', left: settings.enableAI ? '20px' : '4px', bottom: '4px', transition: '.4s' }} />
                                </span>
                            </div>
                        </label>

                    </div>
                </div>

                {/* Infrastructure */}
                <div className="glass-card p-8">
                    <h3 className="text-lg font-bold text-main mb-6 border-b pb-4 d-flex items-center gap-3">
                        <Server size={20} color="#8b5cf6" /> Server Infrastructure
                    </h3>

                    <div className="grid grid-auto-fit gap-6 mb-6">
                        <div className="form-group">
                            <label htmlFor="apiRateLimit" className="form-label d-flex justify-between">
                                <span>API Rate Limit (Req/Min)</span>
                            </label>
                            <input
                                id="apiRateLimit"
                                type="number"
                                name="apiRateLimit"
                                value={settings.apiRateLimit}
                                onChange={handleChange}
                                className="form-input"
                                min="10" max="10000" step="10"
                                title="API Rate Limit per Minute"
                                placeholder="e.g. 100"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="maxFileSize" className="form-label">Max File Upload Size (MB)</label>
                            <input
                                id="maxFileSize"
                                type="number"
                                name="maxFileSize"
                                value={settings.maxFileSize}
                                onChange={handleChange}
                                className="form-input"
                                min="1" max="100" step="1"
                                title="Maximum File Upload Size in Megabytes"
                                placeholder="e.g. 5"
                            />
                        </div>
                    </div>

                    <div className="mt-8 p-6 bg-red-light rounded-lg border-red-light">
                        <h4 className="font-bold text-red mb-2 d-flex items-center gap-2">
                            <Database size={18} /> Danger Zone
                        </h4>
                        <p className="text-sm text-muted mb-4">Initiating maintenance mode restricts all non-admin traffic and takes the marketplace completely offline.</p>

                        <label htmlFor="maintenanceMode" className="d-flex items-center gap-4 cursor-pointer">
                            <div className="relative inline-block" style={{ width: '40px', height: '24px' }}>
                                <input id="maintenanceMode" type="checkbox" name="maintenanceMode" checked={settings.maintenanceMode} onChange={handleChange} className="opacity-0 w-0 h-0" title="Maintenance Mode" />
                                <span className="absolute inset-0 cursor-pointer rounded-full" style={{ backgroundColor: settings.maintenanceMode ? '#ef4444' : 'rgba(255,255,255,0.1)', transition: '.4s' }}>
                                    <span className="absolute rounded-full bg-white" style={{ height: '16px', width: '16px', left: settings.maintenanceMode ? '20px' : '4px', bottom: '4px', transition: '.4s' }} />
                                </span>
                            </div>
                            <span className="font-bold" style={{ color: settings.maintenanceMode ? '#ef4444' : 'var(--text-main)' }}>Enable Global Maintenance Mode</span>
                        </label>
                    </div>

                </div>

            </div>

        </div>
    );
}
