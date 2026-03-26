/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store';
import { Save, Truck, MapPin, ShieldCheck, CheckCircle2 } from 'lucide-react';
import api from '@/lib/api';
import toast, { Toaster } from 'react-hot-toast';

export default function LogisticsProfile() {
    const { user, login } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);

    // User Form State
    const [businessName, setBusinessName] = useState('');
    const [fleetSize, setFleetSize] = useState(1);

    // Vehicle Types State (Array of strings)
    const [vehicleTypes, setVehicleTypes] = useState<string[]>([]);
    const availableVehicleTypes = ['Motorcycle', 'Pickup Truck', '10-Ton Truck', 'Cold Storage Van', 'Trailer'];

    // Service Regions State (Array of strings)
    const [serviceRegions, setServiceRegions] = useState<string[]>([]);
    const availableRegions = ['Greater Accra', 'Ashanti', 'Northern', 'Western', 'Eastern', 'Volta', 'Central', 'Ahafo'];

    useEffect(() => {
        if (user) {
            setBusinessName(user.businessName || user.name);
            setFleetSize(user.fleetSize || 1);
            setVehicleTypes(user.vehicleTypes || []);
            setServiceRegions(user.serviceRegions || []);
        }
    }, [user]);

    const toggleArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
        setter(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
    };

    const handleSaveProfile = async () => {
        setIsLoading(true);
        try {
            const res = await api.put('/users/profile/logistics', {
                businessName,
                fleetSize,
                vehicleTypes,
                serviceRegions
            });

            // Update auth store with new user data
            const token = localStorage.getItem('token');
            if (token) {
                login(res.data, token);
            }

            toast.success("Profile updated successfully!");
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto animate-fade-in">
            <Toaster position="top-right" />
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white d-flex items-center gap-3">
                    Company Profile
                </h1>
                <p className="text-slate-500 mt-2">Manage your logistical capabilities to receive accurate dispatch orders.</p>
            </div>

            <div className="d-flex flex-col gap-6">
                {/* General Information */}
                <div className="glass-card p-6 border border-white-5 shadow-sm">
                    <h2 className="text-lg font-semibold mb-4 d-flex items-center gap-2">
                        <Truck className="text-emerald-500" size={20} />
                        Fleet Overview
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="d-flex flex-col gap-2">
                            <label htmlFor="business-name" className="text-sm font-medium text-slate-700 dark:text-slate-300">Company / Driver Name</label>
                            <input
                                id="business-name"
                                type="text"
                                value={businessName}
                                onChange={(e) => setBusinessName(e.target.value)}
                                className="input-field"
                                title="Business Name"
                                placeholder="e.g. Reliable Logistics"
                            />
                        </div>
                        <div className="d-flex flex-col gap-2">
                            <label htmlFor="fleet-size" className="text-sm font-medium text-slate-700 dark:text-slate-300">Active Fleet Size</label>
                            <input
                                id="fleet-size"
                                type="number"
                                min={1}
                                value={fleetSize}
                                onChange={(e) => setFleetSize(parseInt(e.target.value) || 1)}
                                className="input-field"
                                title="Active Fleet Size"
                            />
                        </div>
                    </div>
                </div>

                {/* Capabilities */}
                <div className="glass-card p-6 border border-white-5 shadow-sm">
                    <h2 className="text-lg font-semibold mb-4 d-flex items-center gap-2">
                        <ShieldCheck className="text-emerald-500" size={20} />
                        Vehicle Capabilities
                    </h2>
                    <p className="text-sm text-slate-500 mb-4">Select all types of vehicles in your active fleet.</p>

                    <div className="d-flex flex-wrap gap-3">
                        {availableVehicleTypes.map(type => (
                            <button
                                key={type}
                                onClick={() => toggleArrayItem(setVehicleTypes, type)}
                                className={`px-4 py-2 rounded-full border text-sm font-medium d-flex items-center gap-2 transition-colors cursor-pointer ${
                                    vehicleTypes.includes(type)
                                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                                        : 'bg-white border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-white-10 dark:text-slate-300 hover:border-emerald-300'
                                }`}
                                title={`Toggle ${type}`}
                            >
                                {vehicleTypes.includes(type) && <CheckCircle2 size={16} />}
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Service Regions */}
                <div className="glass-card p-6 border border-white-5 shadow-sm">
                    <h2 className="text-lg font-semibold mb-4 d-flex items-center gap-2">
                        <MapPin className="text-emerald-500" size={20} />
                        Operating Regions
                    </h2>
                    <p className="text-sm text-slate-500 mb-4">Select the regions where you can accept pickup or delivery dispatch orders.</p>

                    <div className="d-flex flex-wrap gap-3">
                        {availableRegions.map(region => (
                            <button
                                key={region}
                                onClick={() => toggleArrayItem(setServiceRegions, region)}
                                className={`px-4 py-2 rounded-full border text-sm font-medium d-flex items-center gap-2 transition-colors cursor-pointer ${
                                    serviceRegions.includes(region)
                                        ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'
                                        : 'bg-white border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-white-10 dark:text-slate-300 hover:border-blue-300'
                                }`}
                                title={`Toggle Operating Region: ${region}`}
                            >
                                {serviceRegions.includes(region) && <CheckCircle2 size={16} />}
                                {region}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="d-flex justify-end pt-4">
                    <button
                        onClick={handleSaveProfile}
                        disabled={isLoading}
                        className="btn-primary d-flex items-center gap-2 px-8 py-3"
                        title="Save Profile Settings"
                    >
                        <Save size={20} />
                        {isLoading ? 'Saving...' : 'Save Profile Settings'}
                    </button>
                </div>
            </div>
        </div>
    );
}
