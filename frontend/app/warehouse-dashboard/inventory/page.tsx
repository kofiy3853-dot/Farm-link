/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Archive, Filter, LogOut } from 'lucide-react';
import api from '@/lib/api';
import toast, { Toaster } from 'react-hot-toast';

interface InventoryItem {
    id: string;
    warehouseId: string;
    ownerId: string;
    productName: string;
    quantityMT: number;
    storedAt: string;
    expiryDate?: string;
    status: 'STORED' | 'DISPATCHED';
}

interface Warehouse {
    id: string;
    name: string;
    totalCapacityMT: number;
    usedCapacityMT: number;
}

import { Suspense } from 'react';

export default function InventoryLogsPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div></div>}>
            <InventoryLogsContent />
        </Suspense>
    );
}

function InventoryLogsContent() {
    const searchParams = useSearchParams();
    const hubParam = searchParams.get('hub');

    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [selectedHub, setSelectedHub] = useState<string>(hubParam || '');
    const [inventories, setInventories] = useState<InventoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isCheckingIn, setIsCheckingIn] = useState(false);
    // Form fields for Checkin
    const [ownerId, setOwnerId] = useState('');
    const [productName, setProductName] = useState('');
    const [quantityMT, setQuantityMT] = useState('');

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchData = async () => {
        try {
            const res = await api.get('/warehouses/me');
            const data = res.data;
            setWarehouses(data);

            // Extract all inventories and flatten
            let allInventories: InventoryItem[] = [];
            data.forEach((w: any) => {
                allInventories = [...allInventories, ...w.inventories];
            });

            setInventories(allInventories.sort((a, b) => new Date(b.storedAt).getTime() - new Date(a.storedAt).getTime()));

            if (!selectedHub && data.length > 0 && !hubParam) {
                setSelectedHub(data[0].id);
            }
        } catch {
            toast.error("Failed to load inventory data");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDispatch = async (warehouseId: string, inventoryId: string) => {
        if (!window.confirm("Confirm dispatch of this inventory lot? This will free up warehouse capacity.")) return;

        try {
            await api.put(`/warehouses/${warehouseId}/inventory/${inventoryId}/dispatch`);
            toast.success("Inventory dispatched successfully.");
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to dispatch inventory");
        }
    };

    const handleCheckIn = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post(`/warehouses/${selectedHub}/inventory`, {
                ownerId,
                productName,
                quantityMT: parseFloat(quantityMT)
            });
            toast.success("Inventory registered successfully.");
            setIsCheckingIn(false);
            setOwnerId('');
            setProductName('');
            setQuantityMT('');
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to check-in inventory");
        }
    };

    // Filter inventories by hub if requested
    const filteredInventories = selectedHub === 'ALL'
        ? inventories
        : inventories.filter(i => i.warehouseId === selectedHub);

    if (isLoading) return <div className="p-8 text-center"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div></div>;

    const currentHub = warehouses.find(w => w.id === selectedHub);

    return (
        <div className="container mx-auto px-8 py-8 animate-fade-in max-w-7xl">
            <Toaster position="top-right" />

            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">Inventory Logs</h1>
                    <p className="text-muted mt-2">Track Check-ins, dispatch statuses, and storage times.</p>
                </div>
                <button
                    onClick={() => setIsCheckingIn(true)}
                    className="btn-primary flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                    disabled={!selectedHub || selectedHub === 'ALL'}
                >
                    <Archive size={18} /> Check-in Inventory Lot
                </button>
            </div>

            {/* Filters */}
            <div className="glass-card mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-slate-600 font-medium">
                        <Filter size={18} />
                        Filter Hub:
                    </div>
                    <select
                        aria-label="Filter by Hub"
                        title="Filter by Hub"
                        className="input-field max-w-xs"
                        value={selectedHub}
                        onChange={(e) => setSelectedHub(e.target.value)}
                    >
                        <option value="ALL">All Hubs & Silos</option>
                        {warehouses.map(w => (
                            <option key={w.id} value={w.id}>{w.name}</option>
                        ))}
                    </select>
                </div>

                {currentHub && (
                    <div className="flex items-center gap-4 text-sm font-medium">
                        <span className="text-slate-500">Hub Capacity:</span>
                        <div className="flex items-center gap-2">
                            <span className="text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{currentHub.usedCapacityMT.toFixed(1)} MT Used</span>
                            <span className="text-slate-400">/</span>
                            <span className="text-slate-600 bg-slate-100 px-3 py-1 rounded-full">{currentHub.totalCapacityMT.toFixed(1)} MT Total</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Inventory List */}
            <div className="glass-card p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-border">
                            <tr>
                                <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Product / Commodity</th>
                                <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Volume</th>
                                <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Storage Date</th>
                                <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Status</th>
                                <th className="p-4 font-semibold text-slate-600 dark:text-slate-300 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredInventories.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-muted">
                                        No inventory records match the current filter.
                                    </td>
                                </tr>
                            ) : (
                                filteredInventories.map(item => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900 dark:text-white truncate max-w-xs">{item.productName}</span>
                                                <span className="text-xs text-slate-500 font-medium">Owner ID: {item.ownerId.slice(0, 8)}...</span>
                                            </div>
                                        </td>
                                        <td className="p-4 font-medium text-slate-700 dark:text-slate-300">
                                            {item.quantityMT} MT
                                        </td>
                                        <td className="p-4 text-slate-600 dark:text-slate-300">
                                            {new Date(item.storedAt).toLocaleDateString()}
                                            <div className="text-xs text-slate-400 mt-0.5">{new Date(item.storedAt).toLocaleTimeString()}</div>
                                        </td>
                                        <td className="p-4">
                                            {item.status === 'STORED' ? (
                                                <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-blue-100 text-blue-700">
                                                    Stored
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-slate-100 text-slate-500">
                                                    Dispatched
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            {item.status === 'STORED' && (
                                                <button
                                                    onClick={() => handleDispatch(item.warehouseId, item.id)}
                                                    className="btn-outline border-blue-200 text-blue-700 hover:bg-blue-50 py-1.5 px-3 text-sm h-auto"
                                                >
                                                    <LogOut size={14} className="inline mr-1" />
                                                    Dispatch
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Checkin Modal */}
            {isCheckingIn && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in p-4">
                    <div className="glass-card w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl">
                        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-2">
                            <Archive className="text-blue-500" /> Check In Lot
                        </h2>

                        <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 p-3 rounded-lg text-sm mb-6 font-medium">
                            Registering to: {currentHub?.name}
                        </div>

                        <form onSubmit={handleCheckIn} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Owner User UUID</label>
                                <input
                                    type="text"
                                    required
                                    className="input-field"
                                    placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
                                    value={ownerId}
                                    onChange={e => setOwnerId(e.target.value)}
                                />
                                <p className="text-xs text-slate-500 mt-1">UUID of the Farmer or Buyer storing goods.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Commodity / Produce Name</label>
                                <input
                                    type="text"
                                    required
                                    className="input-field"
                                    placeholder="e.g. Maize (Yellow) - Premium Grade"
                                    value={productName}
                                    onChange={e => setProductName(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Volume Deposited (MT)</label>
                                <input
                                    type="number"
                                    required
                                    min="0.1"
                                    step="0.01"
                                    className="input-field"
                                    placeholder="e.g. 15.5"
                                    value={quantityMT}
                                    onChange={e => setQuantityMT(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-3 mt-8 pt-4 border-t border-border">
                                <button
                                    type="button"
                                    onClick={() => setIsCheckingIn(false)}
                                    className="btn-outline flex-1 py-3"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary bg-blue-600 hover:bg-blue-700 flex-1 py-3"
                                >
                                    Confirm Check-In
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
