/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { Warehouse, Plus, LayoutDashboard, Anchor, Store } from 'lucide-react';
import api from '@/lib/api';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';

interface WarehouseData {
    id: string;
    name: string;
    location: string;
    totalCapacityMT: number;
    usedCapacityMT: number;
    hasColdStorage: boolean;
    pricingPerMT: number;
    inventories: any[];
}

export default function WarehouseDashboardPage() {
    const [warehouses, setWarehouses] = useState<WarehouseData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [totalCapacityMT, setTotalCapacityMT] = useState('');
    const [pricingPerMT, setPricingPerMT] = useState('');
    const [hasColdStorage, setHasColdStorage] = useState(false);

    useEffect(() => {
        fetchWarehouses();
    }, []);

    const fetchWarehouses = async () => {
        try {
            const res = await api.get('/warehouses/me');
            setWarehouses(res.data);
        } catch {
            toast.error("Failed to load warehouse data");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddWarehouse = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/warehouses', {
                name,
                location,
                totalCapacityMT: parseFloat(totalCapacityMT),
                pricingPerMT: parseFloat(pricingPerMT),
                hasColdStorage
            });
            toast.success("Warehouse registered!");
            setIsAddModalOpen(false);

            // Reset form
            setName('');
            setLocation('');
            setTotalCapacityMT('');
            setPricingPerMT('');
            setHasColdStorage(false);

            fetchWarehouses();
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to register warehouse");
        }
    };

    if (isLoading) return <div className="p-8 text-center"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div></div>;

    const absoluteCapacity = warehouses.reduce((sum, w) => sum + w.totalCapacityMT, 0);
    const absoluteUsed = warehouses.reduce((sum, w) => sum + w.usedCapacityMT, 0);

    return (
        <div className="container mx-auto px-8 py-8 animate-fade-in max-w-7xl">
            <Toaster position="top-right" />

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">StorageOS Capacity</h1>
                    <p className="text-muted mt-2">Manage your hubs, storage silos, and cold rooms.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="btn-primary flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                    <Plus size={18} /> Register Hub
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass-card flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                        <Store size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-muted font-medium">Active Hubs</p>
                        <p className="text-2xl font-bold">{warehouses.length}</p>
                    </div>
                </div>
                <div className="glass-card flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                        <Anchor size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-muted font-medium">Total Network Capacity</p>
                        <p className="text-2xl font-bold">{absoluteCapacity.toFixed(1)} MT</p>
                    </div>
                </div>
                <div className="glass-card flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">
                        <LayoutDashboard size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-muted font-medium">Utilized Space</p>
                        <p className="text-2xl font-bold">{absoluteUsed.toFixed(1)} MT</p>
                    </div>
                </div>
            </div>

            {/* Warehouse List */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {warehouses.length === 0 ? (
                    <div className="col-span-full glass-card py-12 text-center text-muted">
                        <Warehouse className="mx-auto h-12 w-12 opacity-50 mb-4" />
                        <p>No storage hubs registered. Create one to start storing inventory.</p>
                    </div>
                ) : (
                    warehouses.map(warehouse => {
                        const usagePercentage = warehouse.totalCapacityMT > 0
                            ? (warehouse.usedCapacityMT / warehouse.totalCapacityMT) * 100
                            : 0;

                        return (
                            <div key={warehouse.id} className="glass-card flex flex-col hover:-translate-y-1 transition-transform">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{warehouse.name}</h3>
                                        <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                                            {warehouse.location}
                                        </p>
                                    </div>
                                    {warehouse.hasColdStorage && (
                                        <span className="px-2 py-1 bg-cyan-100 text-cyan-700 text-xs font-bold rounded">
                                            COLD
                                        </span>
                                    )}
                                </div>

                                <div className="my-6">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-medium text-slate-700 dark:text-slate-300">Space Used</span>
                                        <span className="font-bold text-blue-600">{usagePercentage.toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3">
                                        <div
                                            className={`h-3 rounded-full ${usagePercentage > 90 ? 'bg-red-500' : 'bg-blue-500'}`}
                                            style={{ width: `${usagePercentage}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-muted mt-2">
                                        <span>{warehouse.usedCapacityMT.toFixed(1)} MT used</span>
                                        <span>{warehouse.totalCapacityMT.toFixed(1)} MT total</span>
                                    </div>
                                </div>

                                <div className="mt-auto space-y-4 pt-4 border-t border-border mt-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted">Storage Fee per Day</span>
                                        <span className="font-bold text-slate-900 dark:text-white">₵ {warehouse.pricingPerMT.toFixed(2)}/MT</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted">Active Inventories</span>
                                        <span className="font-bold text-slate-900 dark:text-white">{warehouse.inventories.filter(i => i.status === 'STORED').length} Logs</span>
                                    </div>

                                    <Link href={`/warehouse-dashboard/inventory?hub=${warehouse.id}`} className="w-full btn-outline border-blue-200 text-blue-700 hover:bg-blue-50 block text-center py-2 mt-2">
                                        View Inventory
                                    </Link>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>

            {/* Add Modal */}
            {
                isAddModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in p-4">
                        <div className="glass-card w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl">
                            <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Register Storage Hub</h2>

                            <form onSubmit={handleAddWarehouse} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Hub Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="input-field"
                                        placeholder="e.g. Tema Terminal 1"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Location / Address</label>
                                    <input
                                        type="text"
                                        required
                                        className="input-field"
                                        placeholder="e.g. Block A, Industrial Area, Tema"
                                        value={location}
                                        onChange={e => setLocation(e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Total Capacity (MT)</label>
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            step="0.5"
                                            className="input-field"
                                            placeholder="e.g. 500"
                                            value={totalCapacityMT}
                                            onChange={e => setTotalCapacityMT(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price per MT / Day</label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            step="0.01"
                                            className="input-field"
                                            placeholder="e.g. 25.50"
                                            value={pricingPerMT}
                                            onChange={e => setPricingPerMT(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50 pt-4 mt-2">
                                    <input
                                        type="checkbox"
                                        id="coldStorage"
                                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        checked={hasColdStorage}
                                        onChange={e => setHasColdStorage(e.target.checked)}
                                    />
                                    <label htmlFor="coldStorage" className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                                        Include Cold Storage Capability
                                    </label>
                                </div>

                                <div className="flex gap-3 mt-8 pt-4 border-t border-border">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="btn-outline flex-1 py-3"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-primary bg-blue-600 hover:bg-blue-700 flex-1 py-3"
                                    >
                                        Register Hub
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
        </div>
    );
}
