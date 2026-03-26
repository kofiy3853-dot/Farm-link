/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Leaf, MapPin, Truck, Download, FileCheck} from 'lucide-react';
import dynamic from 'next/dynamic';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import toast, { Toaster } from 'react-hot-toast';

const DeliveryMap = dynamic(() => import('@/components/DeliveryMap'), {
    ssr: false,
    loading: () => <div className="h-48 w-full bg-slate-100 animate-pulse rounded-lg flex items-center justify-center font-medium text-slate-400">Loading Map...</div>
});

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
    const [selectedPartner, setSelectedPartner] = useState<{ [key: string]: string }>({});

    // Dispute Modal State
    const [disputeModalOpen, setDisputeModalOpen] = useState(false);
    const [activeDisputeOrderId, setActiveDisputeOrderId] = useState<string | null>(null);
    const [disputeReason, setDisputeReason] = useState('');
    const [disputeEvidence, setDisputeEvidence] = useState('');

    const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading) {
            if (!isAuthenticated) {
                router.push('/login');
            } else {
                fetchOrders();
            }
        }
    }, [isAuthenticated, authLoading, router]);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders');
            setOrders(Array.isArray(response.data) ? response.data : (response.data?.data || []));
        } catch {
            toast.error('Failed to load orders');
            setOrders([]);
        } finally {
            setIsLoading(false);
        }
    };

    const updateOrderStatus = async (orderId: string, status: string) => {
        try {
            await api.patch(`/orders/${orderId}/status`, { status });
            setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
            toast.success('Order status updated');
        } catch {
            toast.error('Failed to update status');
        }
    };

    // Socket.io effect for live tracking
    useEffect(() => {
        if (!process.env.NEXT_PUBLIC_API_URL || !isAuthenticated || orders.length === 0) return;

        import('socket.io-client').then(({ io }) => {
            const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
                auth: { token: localStorage.getItem('token') }
            });

            socket.on('connect', () => {
                orders.forEach(order => {
                    if (['shipped', 'delivered'].includes(order.status)) {
                        socket.emit('joinRoom', order.id);
                    }
                });
            });

            socket.on('truck_location', (data: { lat: number, lng: number, routeId: string }) => {
                setOrders(prevOrders => prevOrders.map(order => {
                    if (order.deliveryRoute?.id === data.routeId) {
                        return {
                            ...order,
                            deliveryRoute: {
                                ...order.deliveryRoute,
                                currentLat: data.lat,
                                currentLng: data.lng
                            }
                        };
                    }
                    return order;
                }));
            });

            return () => {
                socket.disconnect();
            };
        }).catch(err => console.error("Failed to load socket.io-client", err));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated, orders.length]);

    const submitDispute = async () => {
        if (!activeDisputeOrderId || !disputeReason) return;
        try {
            await api.post('/disputes', {
                orderId: activeDisputeOrderId,
                reason: disputeReason,
                evidenceUrl: disputeEvidence,
            });
            await updateOrderStatus(activeDisputeOrderId, 'disputed');
            toast.success("Dispute raised. FarmLink Admins will review shortly.");
            setDisputeModalOpen(false);
            setDisputeReason('');
            setDisputeEvidence('');
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to raise dispute");
        }
    };

    const handleDispatch = async (orderId: string) => {
        if (!selectedPartner[orderId]) {
            toast.error('Please select a logistics partner');
            return;
        }
        await updateOrderStatus(orderId, 'shipped');
        toast.success(`Dispatched via ${selectedPartner[orderId]}!`);
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'pending': return '#fbbf24'; // Amber
            case 'processing': return '#3b82f6'; // Blue
            case 'packed': return '#0ea5e9'; // Light Blue
            case 'shipped': return '#8b5cf6'; // Purple
            case 'delivered': return '#10b981'; // Emerald
            case 'completed': return '#22c55e'; // Green
            case 'cancelled': return '#ef4444'; // Red
            case 'disputed': return '#f97316'; // Orange
            default: return 'var(--text-muted)';
        }
    };

    if (isLoading || authLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '6rem' }}>
                <Leaf className="logo-icon animate-pulse" size={40} color="var(--primary-color)" />
            </div>
        );
    }

    const safeOrders = Array.isArray(orders) ? orders : [];

    return (
        <div className="orders-container animate-fade-in" style={{ padding: '2rem clamp(2rem, 5vw, 6rem)', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
            <Toaster position="top-right" toastOptions={{ style: { background: '#1e2522', color: '#fff' } }} />

            <div style={{ marginBottom: '3rem' }}>
                <h1 className="heading-2" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Package size={28} color="var(--primary-color)" />
                    {user?.role === 'FARMER' ? 'Incoming Orders' : 'My Orders'}
                </h1>
                <p className="text-muted" style={{ marginTop: '0.5rem' }}>Track and manage your agricultural transactions.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {safeOrders.map(order => (
                    <div key={order.id} className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)' }}>Order #{order.id?.toString().slice(0, 8) || order.id}</h3>
                                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }} suppressHydrationWarning>{order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Just now'}</span>
                            </div>
                            <div style={{
                                padding: '6px 16px',
                                borderRadius: '20px',
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                border: `1px solid ${getStatusColor(order.status)}`,
                                color: getStatusColor(order.status),
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                textTransform: 'capitalize'
                            }}>
                                {order.status || 'Pending'}
                            </div>
                        </div>

                        {trackingOrderId === order.id && order.deliveryRoute && (
                            <div className="animate-fade-in" style={{ height: '300px', marginBottom: '1rem', position: 'relative' }}>
                                <DeliveryMap
                                    pickupCoords={order.deliveryRoute.pickupLat ? [order.deliveryRoute.pickupLat, order.deliveryRoute.pickupLng] : undefined}
                                    dropoffCoords={order.deliveryRoute.dropoffLat ? [order.deliveryRoute.dropoffLat, order.deliveryRoute.dropoffLng] : undefined}
                                    currentLocation={order.deliveryRoute.currentLat ? [order.deliveryRoute.currentLat, order.deliveryRoute.currentLng] : undefined}
                                />
                            </div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                            <div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Product</p>
                                <p style={{ fontWeight: 500 }}>{order.product?.name || 'Unknown Product'}</p>
                            </div>
                            <div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Quantity</p>
                                <p style={{ fontWeight: 500 }}>{order.quantity} units</p>
                            </div>
                            <div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Total Price</p>
                                <p style={{ fontWeight: 700, color: 'var(--primary-color)' }}>${order.totalprice?.toFixed(2) || (order.quantity * (order.product?.price || 0)).toFixed(2)}</p>
                            </div>
                        </div>

                        {user?.role === 'FARMER' && (
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                                {order.status === 'pending' && (
                                    <>
                                        <button onClick={() => updateOrderStatus(order.id, 'processing')} className="btn-primary" style={{ flex: 1, padding: '8px' }}>Accept Order</button>
                                        <button onClick={() => updateOrderStatus(order.id, 'cancelled')} className="btn-outline" style={{ flex: 1, padding: '8px', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}>Decline</button>
                                    </>
                                )}
                                {order.status === 'processing' && (
                                    <button onClick={() => updateOrderStatus(order.id, 'packed')} className="btn-primary" style={{ flex: 1, padding: '8px' }}>Mark as Packed</button>
                                )}
                                {order.status === 'packed' && (
                                    <div style={{ display: 'flex', gap: '1rem', flex: 1 }}>
                                        <select
                                            className="input-field"
                                            style={{ flex: 1 }}
                                            value={selectedPartner[order.id] || ''}
                                            onChange={(e) => setSelectedPartner({ ...selectedPartner, [order.id]: e.target.value })}
                                            aria-label="Select Logistics Fleet"
                                            title="Select Logistics Fleet"
                                        >
                                            <option value="">Select Logistics Fleet...</option>
                                            <option value="FarmLink Express">FarmLink Express (Est. pickup: 2h)</option>
                                            <option value="AgriTrans Ltd">AgriTrans Ltd (Est. pickup: 4h)</option>
                                            <option value="Self Delivery">Farmer Self-Delivery</option>
                                        </select>
                                        <button onClick={() => handleDispatch(order.id)} className="btn-primary" style={{ flex: 1, padding: '8px', backgroundColor: '#8b5cf6', borderColor: '#8b5cf6' }}>Dispatch Order</button>
                                    </div>
                                )}
                                {order.status === 'shipped' && (
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(139, 92, 246, 0.1)', padding: '0.75rem', borderRadius: '8px' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8b5cf6', fontWeight: 600 }}>
                                                <Truck size={18} /> In Transit via {selectedPartner[order.id] || order.logisticsPartner || 'Fleet'}
                                            </span>
                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>14 km away • ETA: 45m</span>
                                        </div>
                                        <button onClick={() => updateOrderStatus(order.id, 'delivered')} className="btn-primary" style={{ padding: '8px', backgroundColor: '#10b981', borderColor: '#10b981' }}>Confirm Delivery</button>
                                    </div>
                                )}
                                {order.status === 'delivered' && (
                                    <button onClick={() => updateOrderStatus(order.id, 'completed')} className="btn-primary" style={{ flex: 1, padding: '8px', backgroundColor: '#22c55e', borderColor: '#22c55e' }}>Complete Order</button>
                                )}
                                {order.status === 'completed' && (
                                    <div style={{ flex: 1, textAlign: 'center', padding: '8px', color: '#22c55e', fontWeight: 600 }}>Order Fulfilled Successfully</div>
                                )}
                                {['pending', 'processing', 'packed', 'shipped', 'delivered'].includes(order.status) && (
                                    <button onClick={() => updateOrderStatus(order.id, 'disputed')} className="btn-outline" style={{ padding: '8px 16px', color: '#f97316', borderColor: 'rgba(249, 115, 22, 0.3)' }}>Dispute</button>
                                )}
                            </div>
                        )}

                        {/* Buyer Controls */}
                        {user?.role === 'CUSTOMER' && (
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                                {order.status === 'completed' ? (
                                    <>
                                        <button onClick={() => toast.success('Invoice Downloaded')} className="btn-outline" style={{ flex: 1, padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                            <Download size={16} /> Download Invoice
                                        </button>
                                        <button onClick={() => toast.success('Viewing Proof of Delivery')} className="btn-outline" style={{ flex: 1, padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', borderColor: 'rgba(16, 185, 129, 0.3)', color: '#10b981' }}>
                                            <FileCheck size={16} /> Proof of Delivery
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => toast.success('Pro Forma Invoice Downloaded')} className="btn-outline" style={{ flex: 1, padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                            <Download size={16} /> Pro Forma Invoice
                                        </button>
                                        {['shipped', 'delivered'].includes(order.status) && (
                                            <button
                                                onClick={() => setTrackingOrderId(trackingOrderId === order.id ? null : order.id)}
                                                className="btn-outline"
                                                style={{ flex: 1, padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderColor: 'rgba(59, 130, 246, 0.3)' }}
                                            >
                                                <MapPin size={16} /> {trackingOrderId === order.id ? 'Close Map' : 'Track Shipment'}
                                            </button>
                                        )}
                                        {['delivered'].includes(order.status) && (
                                            <button onClick={() => updateOrderStatus(order.id, 'completed')} className="btn-primary" style={{ flex: 1, padding: '8px', backgroundColor: '#22c55e', borderColor: '#22c55e' }}>Confirm Receipt & Pay Escrow</button>
                                        )}
                                        {['pending', 'processing', 'packed', 'shipped', 'delivered', 'completed'].includes(order.status) && (
                                            <button
                                                onClick={() => { setActiveDisputeOrderId(order.id); setDisputeModalOpen(true); }}
                                                className="btn-outline"
                                                style={{ flex: 1, padding: '8px', color: '#f97316', borderColor: 'rgba(249, 115, 22, 0.3)' }}
                                            >
                                                Raise Dispute
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        )}

                    </div>
                ))}

                {safeOrders.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px dashed var(--border-color)' }}>
                        <Package size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                        <p>No orders found.</p>
                    </div>
                )}
            </div>

            {/* Dispute Modal */}
            {disputeModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="glass-card animate-fade-in" style={{ width: '90%', maxWidth: '500px', backgroundColor: 'var(--bg-dark)', border: '1px solid rgba(255,255,255,0.1)', padding: '2rem' }}>
                        <h2 className="heading-2" style={{ marginBottom: '1rem', color: '#f97316' }}>Raise a Dispute</h2>
                        <p className="text-muted" style={{ marginBottom: '1.5rem' }}>Submit a dispute for Order #{activeDisputeOrderId?.slice(0, 8)}. Admins will mediate the resolution.</p>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Reason for Dispute *</label>
                            <textarea
                                className="input-field"
                                rows={4}
                                placeholder="Describe the issue (e.g. Quality poor, Items missing...)"
                                value={disputeReason}
                                onChange={e => setDisputeReason(e.target.value)}
                            ></textarea>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Photographic Evidence Data (Image URL/Link)</label>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="https://..."
                                value={disputeEvidence}
                                onChange={e => setDisputeEvidence(e.target.value)}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={() => setDisputeModalOpen(false)} className="btn-outline" style={{ flex: 1, padding: '12px' }}>Cancel</button>
                            <button onClick={submitDispute} className="btn-primary" style={{ flex: 1, padding: '12px', backgroundColor: '#f97316', borderColor: '#f97316' }} disabled={!disputeReason}>Submit</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
