/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState, useMemo } from 'react';

import dynamic from 'next/dynamic';
import { Package, Truck, Clock, MapPin, CheckCircle, Navigation } from 'lucide-react';
import api from '@/lib/api';
import toast, { Toaster } from 'react-hot-toast';

interface DeliveryRoute {
    id: string;
    orderId: string;
    routeStatus: 'PENDING' | 'ACCEPTED' | 'AT_PICKUP' | 'IN_TRANSIT' | 'DELIVERED';
    pickupLocation: string;
    pickupLat?: number;
    pickupLng?: number;
    dropoffLocation: string;
    dropoffLat?: number;
    dropoffLng?: number;
    currentLat?: number;
    currentLng?: number;
    driverNotes?: string;
    createdAt: string;
    order: {
        totalprice: number;
        product: {
            name: string;
            imageUrl?: string;
        };
        customer: {
            name: string;
            email: string;
        }
    };
}

const DeliveryMap = dynamic(() => import('@/components/DeliveryMap'), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-slate-100 animate-pulse rounded-lg flex items-center justify-center font-medium text-slate-400">Loading Map...</div>
});

export default function ActiveRoutesPage() {
    const [availableRoutes, setAvailableRoutes] = useState<DeliveryRoute[]>([]);
    const [myRoutes, setMyRoutes] = useState<DeliveryRoute[]>([]);
    const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const selectedRoute = useMemo(() =>
        myRoutes.find(r => r.id === selectedRouteId) || myRoutes[0],
        [myRoutes, selectedRouteId]);

    useEffect(() => {
        fetchRoutes();
    }, []);

    const fetchRoutes = async () => {
        try {
            const [availableRes, myRes] = await Promise.all([
                api.get('/logistics/available'),
                api.get('/logistics/me')
            ]);
            setAvailableRoutes(availableRes.data);
            setMyRoutes(myRes.data);
        } catch {
            toast.error("Failed to load delivery routes");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAcceptRoute = async (routeId: string) => {
        try {
            await api.post(`/logistics/${routeId}/accept`);
            toast.success("Route accepted successfully!");
            fetchRoutes();
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to accept route");
        }
    };

    const handleUpdateStatus = async (routeId: string, currentStatus: string) => {
        const nextStatusMap: Record<string, string> = {
            'ACCEPTED': 'AT_PICKUP',
            'AT_PICKUP': 'IN_TRANSIT',
            'IN_TRANSIT': 'DELIVERED'
        };

        const nextStatus = nextStatusMap[currentStatus];
        if (!nextStatus) return;

        try {
            await api.put(`/logistics/${routeId}/status`, { routeStatus: nextStatus });
            toast.success(`Route status updated to ${nextStatus}`);
            fetchRoutes();
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to update route status");
        }
    }

    if (isLoading) return <div className="p-8 text-center"><div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div></div>;

    return (
        <div className="container mx-auto px-8 py-8 animate-fade-in max-w-7xl">
            <Toaster position="top-right" />
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">Fleet Dispatch Terminal</h1>
                    <p className="text-muted mt-2">Manage unassigned payloads and live deliveries.</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-emerald-500/10 text-emerald-600 px-4 py-2 rounded-lg flex items-center gap-2 border border-emerald-500/20">
                        <Truck size={20} />
                        <span className="font-semibold">{myRoutes.length} Active Routes</span>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Available Payloads */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Package className="text-blue-500" />
                        Available Payloads
                        <span className="bg-blue-100 text-blue-700 text-sm py-1 px-3 rounded-full ml-auto">{availableRoutes.length}</span>
                    </h2>

                    {availableRoutes.length === 0 ? (
                        <div className="glass-card text-center py-12">
                            <Truck className="mx-auto h-12 w-12 text-muted mb-4 opacity-50" />
                            <p className="text-muted">No open payloads available in your network.</p>
                        </div>
                    ) : (
                        availableRoutes.map(route => (
                            <div key={route.id} className="glass-card hover:-translate-y-1 transition-transform">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-semibold text-lg">{route.order.product.name} Payload</h3>
                                        <p className="text-sm text-muted">Order #{route.orderId.slice(0, 8)}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-emerald-600">${(route.order.totalprice * 0.15).toFixed(2)}</div>
                                        <p className="text-xs text-muted">Est. Payout</p>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
                                            A
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted font-medium uppercase tracking-wider">Pickup From</p>
                                            <p className="font-medium text-foreground">{route.pickupLocation}</p>
                                        </div>
                                    </div>
                                    <div className="h-4 w-px bg-border ml-4"></div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 shrink-0">
                                            B
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted font-medium uppercase tracking-wider">Dropoff To</p>
                                            <p className="font-medium text-foreground">{route.dropoffLocation}</p>
                                        </div>
                                    </div>
                                </div>

                                <button onClick={() => handleAcceptRoute(route.id)} className="w-full btn-primary py-3 flex items-center justify-center gap-2">
                                    <CheckCircle size={18} />
                                    Accept Dispatch Route
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* My Active Routes */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Navigation className="text-emerald-500" />
                        Live Fleet Tracking
                    </h2>

                    <div className="glass-card p-0 overflow-hidden" style={{ height: '400px' }}>
                        {myRoutes.length > 0 ? (
                            <DeliveryMap
                                pickupCoords={selectedRoute?.pickupLat ? [selectedRoute.pickupLat, selectedRoute.pickupLng!] : undefined}
                                dropoffCoords={selectedRoute?.dropoffLat ? [selectedRoute.dropoffLat, selectedRoute.dropoffLng!] : undefined}
                                currentLocation={selectedRoute?.currentLat ? [selectedRoute.currentLat, selectedRoute.currentLng!] : undefined}
                            />
                        ) : (
                            <div className="h-full flex items-center justify-center text-muted bg-slate-50 dark:bg-slate-800">
                                <p>No active deliveries to track.</p>
                            </div>
                        )}
                    </div>

                    <h2 className="text-xl font-bold flex items-center gap-2 mt-8">
                        <Navigation className="text-emerald-500" />
                        My Active Routes
                        <span className="bg-emerald-100 text-emerald-700 text-sm py-1 px-3 rounded-full ml-auto">{myRoutes.length}</span>
                    </h2>

                    {myRoutes.length === 0 ? (
                        <div className="glass-card text-center py-12">
                            <MapPin className="mx-auto h-12 w-12 text-muted mb-4 opacity-50" />
                            <p className="text-muted">You have no active routes.</p>
                        </div>
                    ) : (
                        myRoutes.map(route => (
                            <div
                                key={route.id}
                                onClick={() => setSelectedRouteId(route.id)}
                                className={`glass-card border-l-4 transition-all cursor-pointer ${selectedRouteId === route.id || (!selectedRouteId && myRoutes[0].id === route.id) ? 'border-emerald-500 bg-emerald-50' : 'border-transparent'}`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">
                                                {route.routeStatus.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <h3 className="font-semibold text-slate-900">{route.order.product.name}</h3>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-6 text-slate-600">
                                    <div className="flex items-start gap-2 text-sm">
                                        <MapPin size={16} className="mt-0.5" />
                                        <span>{route.dropoffLocation}</span>
                                    </div>
                                    <div className="flex items-start gap-2 text-sm">
                                        <Clock size={16} className="mt-0.5" />
                                        <span>Dispatched: {new Date(route.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                {route.routeStatus !== 'DELIVERED' && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleUpdateStatus(route.id, route.routeStatus); }}
                                        className="w-full btn-secondary py-3 flex items-center justify-center gap-2"
                                    >
                                        Update Route Status →
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
