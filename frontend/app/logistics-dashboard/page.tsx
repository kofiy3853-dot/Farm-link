'use client';

import { useAuthStore } from '@/lib/store';
import { Truck, MapPin, Clock, BarChart, Navigation, User } from 'lucide-react';
import Link from 'next/link';

export default function LogisticsDashboardHome() {
    const { user } = useAuthStore();

    return (
        <div className="p-8 animate-fade-in max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Welcome back, {user?.name || 'Driver'}</h1>
                <p className="text-slate-500 mt-2">Here is an overview of your fleet operations and network deliveries.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Stat Cards */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                            <Truck size={24} />
                        </div>
                    </div>
                    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Fleet Size</h3>
                    <p className="text-2xl font-bold mt-1 text-slate-800 dark:text-white">{user?.fleetSize || 0}</p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <MapPin size={24} />
                        </div>
                    </div>
                    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Regions</h3>
                    <p className="text-2xl font-bold mt-1 text-slate-800 dark:text-white">{user?.serviceRegions?.length || 0}</p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                            <Clock size={24} />
                        </div>
                    </div>
                    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Delivery Success</h3>
                    <p className="text-2xl font-bold mt-1 text-slate-800 dark:text-white">{user?.deliverySuccessRate || 100}%</p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                            <BarChart size={24} />
                        </div>
                    </div>
                    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Earnings</h3>
                    <p className="text-2xl font-bold mt-1 text-slate-800 dark:text-white">GHS 0.00</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center text-center">
                    <Navigation size={48} className="text-emerald-500 mb-4" />
                    <h2 className="text-xl font-bold mb-2 text-slate-800 dark:text-white">Active Delivery Routes</h2>
                    <p className="text-slate-500 mb-6">Manage your ongoing deliveries, update statuses, and view the live tracking map.</p>
                    <Link href="/logistics-dashboard/routes" className="btn-primary">
                        View Dispatch Routes
                    </Link>
                </div>

                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center text-center">
                    <User size={48} className="text-blue-500 mb-4" />
                    <h2 className="text-xl font-bold mb-2 text-slate-800 dark:text-white">Company Profile</h2>
                    <p className="text-slate-500 mb-6">Update your vehicle types, insurance details, and operational regions to get more jobs.</p>
                    <Link href="/logistics-dashboard/profile" className="btn-secondary">
                        Manage Profile
                    </Link>
                </div>
            </div>
        </div>
    );
}
