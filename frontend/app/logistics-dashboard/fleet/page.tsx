/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState, useEffect } from 'react';
import { Truck, Plus, CheckCircle, Anchor, Trash2 } from 'lucide-react';
import api from '@/lib/api';
import toast, { Toaster } from 'react-hot-toast';

interface Vehicle {
    id: string;
    licensePlate: string;
    vehicleType: string;
    capacityMT: number;
    isColdStorage: boolean;
    insuranceExpiry?: string;
    status: string;
}

export default function FleetManagementPage() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Form State
    const [licensePlate, setLicensePlate] = useState('');
    const [vehicleType, setVehicleType] = useState('Pickup');
    const [capacityMT, setCapacityMT] = useState('');
    const [isColdStorage, setIsColdStorage] = useState(false);

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        try {
            const res = await api.get('/vehicles/me');
            setVehicles(res.data);
        } catch {
            toast.error("Failed to load fleet data");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddVehicle = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/vehicles', {
                licensePlate: licensePlate.toUpperCase(),
                vehicleType,
                capacityMT: parseFloat(capacityMT),
                isColdStorage
            });
            toast.success("Vehicle added to fleet!");
            setIsAddModalOpen(false);

            // Reset form
            setLicensePlate('');
            setVehicleType('Pickup');
            setCapacityMT('');
            setIsColdStorage(false);

            fetchVehicles();
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to add vehicle");
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to remove this vehicle from your fleet?")) return;
        try {
            await api.delete(`/vehicles/${id}`);
            toast.success("Vehicle removed");
            fetchVehicles();
        } catch {
            toast.error("Failed to delete vehicle");
        }
    };

    const handleUpdateStatus = async (id: string, currentStatus: string) => {
        const nextStatus = currentStatus === 'AVAILABLE' ? 'MAINTENANCE' : 'AVAILABLE';
        try {
            await api.put(`/vehicles/${id}`, { status: nextStatus });
            toast.success(`Vehicle status updated to ${nextStatus}`);
            fetchVehicles();
        } catch {
            toast.error("Failed to update status");
        }
    };

    if (isLoading) return (
        <div className="p-8 text-center">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
    );

    const totalCapacity = vehicles.reduce((sum, v) => sum + v.capacityMT, 0);

    return (
        <div className="max-w-6xl mx-auto animate-fade-in p-8">
            <Toaster position="top-right" />

            <div className="d-flex justify-between items-end mb-8 flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Fleet & Vehicle Management</h1>
                    <p className="text-muted mt-2">Manage your delivery vehicles, capacities, and availability statuses.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="btn-primary d-flex items-center gap-2"
                    title="Add Vehicle"
                >
                    <Plus size={18} /> Add Vehicle
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass-card p-6 d-flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 d-flex items-center justify-center">
                        <Truck size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-muted font-medium uppercase">Total Vehicles</p>
                        <p className="text-2xl font-bold">{vehicles.length}</p>
                    </div>
                </div>
                <div className="glass-card p-6 d-flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 d-flex items-center justify-center">
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-muted font-medium uppercase">Available for Dispatch</p>
                        <p className="text-2xl font-bold">{vehicles.filter(v => v.status === 'AVAILABLE').length}</p>
                    </div>
                </div>
                <div className="glass-card p-6 d-flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 d-flex items-center justify-center">
                        <Anchor size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-muted font-medium uppercase">Total Capacity</p>
                        <p className="text-2xl font-bold">{totalCapacity.toFixed(1)} MT</p>
                    </div>
                </div>
            </div>

            {/* Vehicle List */}
            <div className="glass-card p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-white-5">
                            <tr>
                                <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">License Plate</th>
                                <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Type & Features</th>
                                <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Capacity</th>
                                <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Status</th>
                                <th className="p-4 font-semibold text-slate-600 dark:text-slate-300 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white-5">
                            {vehicles.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-muted">
                                        No vehicles in your fleet yet. Click "Add Vehicle" to register one.
                                    </td>
                                </tr>
                            ) : (
                                vehicles.map(vehicle => (
                                    <tr key={vehicle.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                                        <td className="p-4 font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                                            {vehicle.licensePlate}
                                        </td>
                                        <td className="p-4">
                                            <div className="d-flex items-center gap-2">
                                                <span>{vehicle.vehicleType}</span>
                                                {vehicle.isColdStorage && (
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 uppercase">Cold</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 text-slate-600 dark:text-slate-300">
                                            {vehicle.capacityMT} MT
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => handleUpdateStatus(vehicle.id, vehicle.status)}
                                                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide transition-colors border-none cursor-pointer ${
                                                    vehicle.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' :
                                                    vehicle.status === 'IN_TRANSIT' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                                }`}
                                                title={`Change status from ${vehicle.status}`}
                                            >
                                                {vehicle.status.replace('_', ' ')}
                                            </button>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => handleDelete(vehicle.id)}
                                                className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg bg-transparent border-none cursor-pointer hover:bg-red-50 dark:hover:bg-red-500/10"
                                                title="Remove Vehicle"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 d-flex items-center justify-center bg-black-50 backdrop-blur-sm animate-fade-in p-4">
                    <div className="glass-card w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-white-5 shadow-2xl p-8 relative">
                        <button onClick={() => setIsAddModalOpen(false)} className="absolute top-4 right-4 bg-transparent border-none text-muted hover:text-white cursor-pointer text-2xl" title="Close Modal">×</button>
                        <h2 className="text-2xl font-bold mb-6">Register Vehicle</h2>

                        <form onSubmit={handleAddVehicle} className="d-flex flex-col gap-4">
                            <div className="d-flex flex-col gap-2">
                                <label htmlFor="license-plate" className="text-sm font-medium text-slate-700 dark:text-slate-300">License Plate</label>
                                <input
                                    id="license-plate"
                                    type="text"
                                    required
                                    className="input-field uppercase"
                                    placeholder="e.g. GR-1234-24"
                                    value={licensePlate}
                                    onChange={e => setLicensePlate(e.target.value)}
                                    title="License Plate"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="d-flex flex-col gap-2">
                                    <label htmlFor="vehicle-type" className="text-sm font-medium text-slate-700 dark:text-slate-300">Vehicle Type</label>
                                    <select
                                        id="vehicle-type"
                                        className="input-field"
                                        value={vehicleType}
                                        onChange={e => setVehicleType(e.target.value)}
                                        title="Vehicle Type"
                                    >
                                        <option value="Pickup">Pickup</option>
                                        <option value="Van">Cargo Van</option>
                                        <option value="Light Truck">Light Truck</option>
                                        <option value="10-Ton Truck">10-Ton Truck</option>
                                        <option value="Articulator">Articulator</option>
                                    </select>
                                </div>
                                <div className="d-flex flex-col gap-2">
                                    <label htmlFor="capacity" className="text-sm font-medium text-slate-700 dark:text-slate-300">Capacity (MT)</label>
                                    <input
                                        id="capacity"
                                        type="number"
                                        required
                                        min="0.1"
                                        step="0.1"
                                        className="input-field"
                                        placeholder="e.g. 5.5"
                                        value={capacityMT}
                                        onChange={e => setCapacityMT(e.target.value)}
                                        title="Capacity in Metric Tons"
                                    />
                                </div>
                            </div>

                            <div className="d-flex items-center gap-3 p-4 bg-slate-50 dark:bg-white-5 rounded-xl border border-slate-100 dark:border-white-5 mt-2">
                                <input
                                    type="checkbox"
                                    id="coldStorage"
                                    className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                    checked={isColdStorage}
                                    onChange={e => setIsColdStorage(e.target.checked)}
                                    title="Cold Storage Capability"
                                />
                                <label htmlFor="coldStorage" className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                                    Has Cold Storage Capability?
                                </label>
                            </div>

                            <div className="d-flex gap-3 mt-6 pt-4 border-t border-white-5">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="btn-outline flex-1 py-3"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary flex-1 py-3"
                                >
                                    Register
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
