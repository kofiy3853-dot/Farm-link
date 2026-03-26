/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Leaf, ChevronLeft, Store, ShieldCheck, MapPin, Truck, Repeat } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [product, setProduct] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [orderLoading, setOrderLoading] = useState(false);

    // Logistics & Pricing State
    const [deliveryRegion, setDeliveryRegion] = useState('Greater Accra');
    const [logisticsPartner, setLogisticsPartner] = useState('FarmLink Express');

    // Gallery State
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    // Recurring Order State
    const [isRecurring, setIsRecurring] = useState(false);
    const [recurringInterval, setRecurringInterval] = useState('WEEKLY');

    // Helper for resolving Cloudinary DNS issues via Next.js rewrites
    const getProxiedUrl = (url?: string) => {
        if (!url) return '';
        return url.replace('https://res.cloudinary.com', '/media');
    };

    const { isAuthenticated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        fetchProduct();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchProduct = async () => {
        try {
            const response = await api.get(`/products/${id}`);
            setProduct(response.data);
            setActiveImageIndex(0); // Reset index on new product load
        } catch {
            toast.error('Failed to load product details');
            router.push('/marketplace');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOrder = async () => {
        if (!isAuthenticated) {
            toast.error('Please login to place an order');
            router.push('/login');
            return;
        }

        const deliveryCost = logisticsPartner === 'FarmLink Express' ? 250 : 150;

        try {
            setOrderLoading(true);
            await api.post('/orders', {
                productId: product.id,
                quantity: quantity,
                paymentMethod: 'escrow',
                logisticsPartner: logisticsPartner,
                deliveryRegion: deliveryRegion,
                deliveryCost: deliveryCost,
                isRecurring: isRecurring,
                recurringInterval: isRecurring ? recurringInterval : null
            });
            toast.success('Secure Escrow Checkout Initialized!');
            setTimeout(() => {
                router.push('/orders');
            }, 1000);
        } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            toast.error(error.response?.data?.error || 'Failed to initialize checkout');
        } finally {
            setOrderLoading(false);
        }
    };
    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '6rem' }}>
                <Leaf className="logo-icon animate-pulse" size={40} color="var(--primary-color)" />
            </div>
        );
    }

    if (!product) return null;

    return (
        <div className="product-detail-container animate-fade-in" style={{ padding: '2rem clamp(2rem, 5vw, 6rem)', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
            <Toaster position="top-right" toastOptions={{ style: { background: '#1e2522', color: '#fff' } }} />

            <Link href="/marketplace" className="btn-outline" style={{ display: 'inline-flex', gap: '8px', marginBottom: '2rem', padding: '8px 16px', border: 'none' }}>
                <ChevronLeft size={18} />
                <span>Back to Marketplace</span>
            </Link>

            <div className="glass-card" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1fr', gap: '3rem', padding: '0', overflow: 'hidden' }}>
                {/* Image Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: 'rgba(0,0,0,0.1)', padding: '1rem' }}>
                    <div style={{
                        backgroundColor: 'var(--bg-dark)',
                        height: '400px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        borderRadius: '12px',
                        overflow: 'hidden'
                    }}>
                        {product.imageUrls && product.imageUrls.length > 0 ? (
                            <img src={getProxiedUrl(product.imageUrls[activeImageIndex])} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', cursor: 'zoom-in' }} onClick={() => setPreviewImage(product.imageUrls[activeImageIndex])} />
                        ) : (
                            <Leaf size={80} color="var(--primary-glow)" />
                        )}
                        <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {product.isOrganic && (
                                <div style={{ padding: '6px 14px', backgroundColor: '#10b981', color: 'white', fontSize: '0.8rem', fontWeight: 700, borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.05em', boxShadow: '0 2px 10px rgba(16,185,129,0.3)' }}>
                                    Certified Organic
                                </div>
                            )}
                            <div style={{ padding: '6px 14px', backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', color: 'white', fontSize: '0.8rem', fontWeight: 600, borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                {product.qualityGrade || 'Standard'} Grade
                            </div>
                        </div>
                    </div>

                    {/* Thumbnails */}
                    {product.imageUrls && product.imageUrls.length > 1 && (
                        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                            {product.imageUrls.map((url: string, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImageIndex(idx)}
                                    style={{
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        border: activeImageIndex === idx ? '2px solid var(--primary-color)' : '2px solid transparent',
                                        padding: 0,
                                        cursor: 'pointer',
                                        flexShrink: 0
                                    }}
                                >
                                    <img src={getProxiedUrl(url)} alt={`Preview ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Video Section */}
                    {product.videoUrl && (
                        <div style={{ marginTop: '1rem' }}>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 600 }}>Product Video</p>
                            <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <video
                                    src={getProxiedUrl(product.videoUrl)}
                                    controls
                                    style={{ width: '100%', display: 'block' }}
                                    poster={getProxiedUrl(product.imageUrls?.[0])}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Details Section */}
                <div style={{ display: 'flex', flexDirection: 'column', padding: '3rem 3rem 3rem 0' }}>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <Link href={`/farmers/${product.farmerId}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)', textDecoration: 'none' }} className="hover:text-primary transition-colors">
                            <Store size={18} />
                            <span style={{ fontWeight: 600 }}>{product.farmer?.name || 'Local Farm'}</span>
                        </Link>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <div style={{ padding: '4px 12px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 600 }}>
                                {product.region || 'Greater Accra'}
                            </div>
                            {product.harvestDate && (
                                <div style={{ padding: '4px 12px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 600 }}>
                                    Harvested: {new Date(product.harvestDate).toLocaleDateString()}
                                </div>
                            )}
                        </div>
                    </div>

                    <h1 className="heading-1" style={{ fontSize: '2.5rem', marginBottom: '1rem', lineHeight: 1.2 }}>{product.name}</h1>

                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.2rem', fontWeight: 600 }}>Unit Price</p>
                            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary-color)', lineHeight: 1 }}>
                                {product.price?.toLocaleString()} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>GHS / MT</span>
                            </div>
                        </div>
                        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.2rem', fontWeight: 600 }}>Available Bulk</p>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1 }}>
                                {product.availableQuantity} MT
                            </div>
                        </div>
                    </div>

                    <p className="text-muted" style={{ fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>
                        {product.description || 'Verified agricultural listing ready for bulk purchasing or immediate dispatch.'}
                    </p>

                    <div style={{ marginTop: 'auto', padding: '2rem', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <label htmlFor="quantity" style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Purchase Quantity (MT):</label>
                                <input
                                    id="quantity"
                                    type="number"
                                    title="Purchase Quantity (MT)"
                                    min={product.minOrderQuantity || 1}
                                    max={product.availableQuantity || 9999}
                                    value={quantity}
                                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                    className="input-field"
                                    style={{ width: '120px', padding: '10px 14px', fontSize: '1.1rem', fontWeight: 700 }}
                                />
                            </div>
                            <div style={{ textAlign: 'right', fontSize: '0.85rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Min Order: </span>
                                <strong style={{ color: 'var(--text-main)', fontSize: '1rem' }}>{product.minOrderQuantity || 1} MT</strong>
                            </div>
                        </div>

                        {/* Logistics Section */}
                        <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <MapPin size={18} color="var(--primary-color)" />
                                <div style={{ flex: 1 }}>
                                    <label htmlFor="deliveryRegion" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Delivery Region</label>
                                    <select id="deliveryRegion" title="Delivery Region" className="input-field" style={{ padding: '8px', fontSize: '0.9rem' }} value={deliveryRegion} onChange={(e) => setDeliveryRegion(e.target.value)}>
                                        <option value="Greater Accra">Greater Accra</option>
                                        <option value="Ashanti">Ashanti Region</option>
                                        <option value="Northern">Northern Region</option>
                                        <option value="Western">Western Region</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <Truck size={18} color="var(--primary-color)" />
                                <div style={{ flex: 1 }}>
                                    <label htmlFor="logisticsPartner" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Logistics Partner</label>
                                    <select id="logisticsPartner" title="Logistics Partner" className="input-field" style={{ padding: '8px', fontSize: '0.9rem' }} value={logisticsPartner} onChange={(e) => setLogisticsPartner(e.target.value)}>
                                        <option value="FarmLink Express">FarmLink Express (Est. 24h, Cold Storage) - 250 GHS</option>
                                        <option value="AgriTrans Ltd">AgriTrans Ltd (Est. 48h, Standard) - 150 GHS</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Recurring Contract Section */}
                        <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                                <input id="recurring" type="checkbox" checked={isRecurring} onChange={e => setIsRecurring(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: '#10b981' }} />
                                <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Standing Bulk Contract (Auto-Renewing)</span>
                            </label>

                            {isRecurring && (
                                <div className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.25rem', paddingLeft: '30px' }}>
                                    <Repeat size={18} color="#10b981" />
                                    <div style={{ flex: 1 }}>
                                        <label htmlFor="recurringInterval" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Delivery Frequency</label>
                                        <select id="recurringInterval" title="Delivery Frequency" className="input-field" style={{ padding: '8px', fontSize: '0.9rem' }} value={recurringInterval} onChange={(e) => setRecurringInterval(e.target.value)}>
                                            <option value="WEEKLY">Weekly Delivery Route</option>
                                            <option value="BIWEEKLY">Bi-Weekly Delivery Route</option>
                                            <option value="MONTHLY">Monthly Delivery Route</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.85rem', fontWeight: 600 }}>
                                <ShieldCheck size={16} /> Escrow Protection Active
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Cost (+Logistics)</p>
                                <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                                    {((quantity * product.price) + (logisticsPartner === 'FarmLink Express' ? 250 : 150)).toLocaleString()} GHS
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <button
                                onClick={handleOrder}
                                disabled={orderLoading}
                                className="btn-primary"
                                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '16px', fontSize: '1rem', backgroundColor: '#2563eb', borderColor: '#2563eb' }}
                            >
                                <ShoppingCart size={20} />
                                <span>{orderLoading ? 'Processing...' : 'Escrow Checkout'}</span>
                            </button>
                            <button
                                onClick={() => router.push(`/messages?supplierId=${product.farmerId}&productId=${product.id}`)}
                                style={{
                                    display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '16px', fontSize: '1rem',
                                    backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
                                    color: 'var(--text-main)', borderRadius: '8px', cursor: 'pointer',
                                    fontWeight: 600, transition: 'all 0.2s'
                                }}
                                className="hover:bg-white-5 hover:border-primary transition-all duration-300"
                            >
                                Request Quote
                            </button>
                        </div>
                        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
                            &quot;Request Quote&quot; allows you to negotiate pricing for bulk requests directly with the supplier.
                        </p>
                    </div>
                </div>
            </div>
            {/* IMAGE LIGHTBOX PREVIEW */}
            {previewImage && (
                <div
                    style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out', backdropFilter: 'blur(10px)', animation: 'fade-in 0.2s' }}
                    onClick={() => setPreviewImage(null)}
                >
                    <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
                        <img src={getProxiedUrl(previewImage || '')} alt="Preview" style={{ maxWidth: '100%', maxHeight: '90vh', borderRadius: '12px', boxShadow: '0 0 50px rgba(0,0,0,0.5)', objectFit: 'contain' }} />
                        <button
                            style={{ position: 'absolute', top: '-40px', right: '-40px', background: 'none', border: 'none', color: 'white', fontSize: '2rem', cursor: 'pointer' }}
                            onClick={(e) => { e.stopPropagation(); setPreviewImage(null); }}
                        >
                            ×
                        </button>
                        <p style={{ position: 'absolute', bottom: '-40px', left: 0, right: 0, textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Click anywhere to close</p>
                    </div>
                </div>
            )}
        </div>
    );
}
