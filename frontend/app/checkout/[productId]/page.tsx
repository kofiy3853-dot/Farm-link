/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Truck, ShieldCheck, CreditCard, CheckCircle2, Leaf, Package, AlertCircle } from 'lucide-react';
import api from '@/lib/api';

export default function CheckoutPage({ params }: { params: { productId: string } }) {
    const router = useRouter();
    const [product, setProduct] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Form State
    const [quantity, setQuantity] = useState(1);
    const [deliveryRegion, setDeliveryRegion] = useState('');
    const [logisticsPartner, setLogisticsPartner] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchProductData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.productId]);

    const fetchProductData = async () => {
        try {
            const res = await api.get(`/products/${params.productId}`);
            setProduct(res.data);
            setQuantity(res.data.minOrderQuantity || 1);
        } catch {
            setError('Failed to load product for checkout.');
        } finally {
            setIsLoading(false);
        }
    };

    // Logistics Pricing Mock Matrix
    const calculateDeliveryCost = () => {
        if (!deliveryRegion || !logisticsPartner) return 0;

        let baseCost = 0;
        if (deliveryRegion === product?.region) baseCost = 50 * quantity; // Same region
        else baseCost = 150 * quantity; // Inter-region

        if (logisticsPartner === 'FarmLink Fleet') return baseCost * 1.2; // Premium cold chain
        if (logisticsPartner === 'Third-Party Transporter') return baseCost * 0.9;
        if (logisticsPartner === 'Self-Pickup') return 0;

        return baseCost; // Default fallback
    };

    const handleCheckout = async () => {
        if (!deliveryRegion || !logisticsPartner || !paymentMethod) {
            setError('Please complete all checkout fields.');
            return;
        }

        if (quantity < (product.minOrderQuantity || 1)) {
            setError(`Minimum order quantity is ${product.minOrderQuantity || 1} MT`);
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            await api.post('/orders', {
                productId: product.id,
                quantity: quantity,
                deliveryRegion,
                logisticsPartner,
                paymentMethod,
                deliveryCost: calculateDeliveryCost()
            });

            router.push('/orders?success=true');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to place order.');
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="p-24 text-center">Loading Secure Checkout...</div>;
    if (!product) return <div className="p-24 text-center text-red">{error}</div>;

    const subtotal = product.price * quantity;
    const deliveryCost = calculateDeliveryCost();
    const platformFee = subtotal * 0.02; // 2% Escrow fee
    const grandTotal = subtotal + deliveryCost + platformFee;

    return (
        <div className="animate-fade-in mx-auto w-full max-w-6xl p-8 min-h-[80vh]">
            <div className="mb-8">
                <h1 className="heading-2 d-flex items-center gap-3">
                    <ShieldCheck color="#10b981" /> Secure Escrow Checkout
                </h1>
                <p className="text-muted mt-2">Your funds are held securely until delivery is confirmed.</p>
            </div>

            {error && (
                <div className="p-4 rounded-lg d-flex items-center gap-2 mb-8" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderLeft: '3px solid #ef4444', color: '#f87171' }}>
                    <AlertCircle size={18} /> {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8 items-start">

                {/* ⬅️ LEFT COLUMN: Forms */}
                <div className="d-flex flex-col gap-8">

                    {/* 1. Item Selection */}
                    <div className="glass-card p-8">
                        <h3 className="heading-2 text-xl d-flex items-center gap-2 mb-6">
                            <Package size={20} color="var(--primary-color)" /> 1. Order Quantity
                        </h3>

                        <div className="d-flex items-center justify-between p-4 rounded-xl border" style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' }}>
                            <div className="d-flex gap-4 items-center">
                                <div className="w-[60px] h-[60px] rounded-lg overflow-hidden bg-dark d-flex items-center justify-center">
                                    {product.imageUrls && product.imageUrls.length > 0 ? (
                                        <img src={product.imageUrls[0]} alt={product.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <Leaf size={24} color="var(--primary-color)" />
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-bold text-main">{product.name}</h4>
                                    <p className="text-sm text-muted">{product.price.toLocaleString()} GHS / MT</p>
                                </div>
                            </div>

                            <div className="d-flex items-center gap-4">
                                <div className="d-flex flex-col items-end">
                                    <label htmlFor="quantity-input" className="text-xs text-muted uppercase mb-1">Quantity (MT)</label>
                                    <input
                                        id="quantity-input"
                                        type="number"
                                        className="input-field w-[100px] text-center"
                                        min={product.minOrderQuantity || 1}
                                        max={product.availableQuantity}
                                        value={quantity}
                                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                        title="Order Quantity"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Logistics Details */}
                    <div className="glass-card p-8">
                        <h3 className="heading-2 text-xl d-flex items-center gap-2 mb-6">
                            <Truck size={20} color="#3b82f6" /> 2. Delivery & Logistics
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="delivery-region" className="block text-sm text-muted font-bold mb-2">Destination Region</label>
                                <select 
                                    id="delivery-region"
                                    className="input-field w-full" 
                                    value={deliveryRegion} 
                                    onChange={(e) => setDeliveryRegion(e.target.value)}
                                    title="Destination Region Selection"
                                >
                                    <option value="" disabled>Select region...</option>
                                    {['Greater Accra', 'Ashanti Region', 'Northern Region', 'Volta Region', 'Brong Ahafo Region', 'Bono Region'].map(r => (
                                        <option key={r} value={r}>{r}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="logistics-partner" className="block text-sm text-muted font-bold mb-2">Logistics Partner</label>
                                <select 
                                    id="logistics-partner"
                                    className="input-field w-full" 
                                    value={logisticsPartner} 
                                    onChange={(e) => setLogisticsPartner(e.target.value)}
                                    title="Logistics Partner Selection"
                                >
                                    <option value="" disabled>Select fleet...</option>
                                    <option value="FarmLink Fleet">FarmLink Cold-Chain Fleet</option>
                                    <option value="Third-Party Transporter">Standard Third-Party</option>
                                    <option value="Self-Pickup">Self-Pickup (No Delivery)</option>
                                </select>
                            </div>
                        </div>

                        {logisticsPartner === 'FarmLink Fleet' && (
                            <div className="mt-4 p-3 rounded-lg border-l-4" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', borderColor: '#3b82f6', fontSize: '0.85rem', color: '#93c5fd' }}>
                                <strong>FarmLink Fleet Selected:</strong> Includes real-time GPS tracking and temperature monitoring guarantees.
                            </div>
                        )}
                    </div>

                    {/* 3. Payment Method */}
                    <div className="glass-card p-8">
                        <h3 className="heading-2 text-xl d-flex items-center gap-2 mb-6">
                            <CreditCard size={20} color="#8b5cf6" /> 3. Payment Method
                        </h3>

                        <div className="grid grid-auto-fit gap-4">
                            {[
                                { id: 'ESCROW_BANK', title: 'Escrow Bank Transfer', desc: 'Secure B2B wire with 2% fee.' },
                                { id: 'MOMO_PAY', title: 'Mobile Money (MoMo)', desc: 'Instant for orders under 50k GHS.' },
                            ].map(method => (
                                <button
                                    key={method.id}
                                    type="button"
                                    onClick={() => setPaymentMethod(method.id)}
                                    className="p-6 rounded-xl cursor-pointer transition-all border d-flex flex-col items-center"
                                    style={{
                                        backgroundColor: paymentMethod === method.id ? 'rgba(139, 92, 246, 0.1)' : 'rgba(255,255,255,0.02)',
                                        borderColor: paymentMethod === method.id ? '#8b5cf6' : 'rgba(255,255,255,0.1)',
                                    }}
                                    title={`Select ${method.title}`}
                                >
                                    <h4 className="font-bold mb-2" style={{ color: paymentMethod === method.id ? '#c4b5fd' : 'var(--text-main)' }}>{method.title}</h4>
                                    <p className="text-xs text-muted">{method.desc}</p>
                                    {paymentMethod === method.id && <CheckCircle2 size={24} color="#8b5cf6" className="mt-4" />}
                                </button>
                            ))}
                        </div>
                    </div>

                </div>

                {/* ➡️ RIGHT COLUMN: Order Summary Box */}
                <div className="glass-card p-8 sticky top-24" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <h3 className="heading-2 text-xl mb-6">Order Summary</h3>

                    <div className="d-flex flex-col gap-4 mb-8 pb-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                        <div className="d-flex justify-between text-sm text-muted">
                            <span>Commodity Value ({quantity} MT)</span>
                            <span className="font-bold text-main">GHS {subtotal.toLocaleString()}</span>
                        </div>
                        <div className="d-flex justify-between text-sm text-muted">
                            <span>Logistics Estimate</span>
                            <span className="font-bold text-main">GHS {deliveryCost.toLocaleString()}</span>
                        </div>
                        <div className="d-flex justify-between text-sm text-muted">
                            <span>Escrow Protection Fee (2%)</span>
                            <span className="font-bold text-main">GHS {platformFee.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="d-flex justify-between items-end mb-8">
                        <span className="font-bold text-main">Total</span>
                        <span className="font-extrabold text-primary leading-none" style={{ fontSize: '2rem' }}>
                            GHS {grandTotal.toLocaleString()}
                        </span>
                    </div>

                    <button
                        className="btn-primary w-full p-4 text-lg d-flex justify-center items-center gap-2"
                        onClick={handleCheckout}
                        disabled={isSubmitting}
                        style={{ boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)' }}
                        title="Authorize Payment"
                    >
                        {isSubmitting ? 'Securing Transaction...' : <><ShieldCheck size={20} /> Authorize Payment</>}
                    </button>

                    <p className="text-center text-xs text-muted mt-4 d-flex items-center justify-center gap-1">
                        <ShieldCheck size={12} /> Protected by FarmLink Trust Guarantee
                    </p>
                </div>

            </div>
        </div>
    );
}
