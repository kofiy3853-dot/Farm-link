/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ShieldCheck, MessageSquare, MapPin, Package, Star, Calendar, ArrowLeft, Leaf } from 'lucide-react';
import api from '@/lib/api';

export default function FarmerProfilePage({ params: paramsPromise }: { params: Promise<{ farmerId: string }> }) {
    const params = use(paramsPromise);
    const [farmer, setFarmer] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFarmerProfile = async () => {
            try {
                // Fetch Farmer details
                const userRes = await api.get(`/users/${params.farmerId}`);
                if (userRes.data.role !== 'FARMER') throw new Error("User is not a verified seller.");
                setFarmer(userRes.data);

                // Fetch Farmer's listings
                const prodRes = await api.get(`/products?farmerId=${params.farmerId}`);
                setProducts(prodRes.data);
            } catch (err: any) {
                setError(err.response?.data?.error || 'Failed to load seller profile.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchFarmerProfile();
    }, [params.farmerId]);

    if (isLoading) return <div style={{ padding: '6rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading Verified Seller Profile...</div>;
    if (error) return <div style={{ padding: '6rem', textAlign: 'center', color: '#ef4444' }}>{error}</div>;

    const memberSince = new Date(farmer.createdAt).getFullYear();

    return (
        <div className="animate-fade-in" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>

            <Link href="/marketplace" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '2rem', textDecoration: 'none' }} className="hover:text-primary">
                <ArrowLeft size={16} /> Back to Marketplace
            </Link>

            {/* TRUST PROFILE HEADER */}
            <div className="glass-card" style={{ padding: '3rem', marginBottom: '3rem', display: 'flex', flexWrap: 'wrap', gap: '3rem', alignItems: 'center', background: 'linear-gradient(145deg, rgba(16, 185, 129, 0.05), rgba(31, 41, 55, 0.4))' }}>

                {/* Avatar / Identity */}
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flex: 1, minWidth: '300px' }}>
                    <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '3rem', fontWeight: 800, border: '4px solid rgba(16, 185, 129, 0.3)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                        {farmer.name.charAt(0)}
                    </div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.1 }}>{farmer.farmName || farmer.name}</h1>
                            {farmer.isVerified && (
                                <div style={{ padding: '4px 8px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 700, border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                                    <ShieldCheck size={14} /> KYC VERIFIED
                                </div>
                            )}
                        </div>
                        <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '0.5rem' }}>
                            <Calendar size={16} /> Joined FarmLink Ecosystem in {memberSince}
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            {farmer.district && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> {farmer.district}</span>}
                            {farmer.farmSize && <span>• {farmer.farmSize} Acres</span>}
                            {farmer.experienceYears && <span>• {farmer.experienceYears} Years Exp.</span>}
                        </div>
                    </div>
                </div>

                {/* Trust Metrics */}
                <div style={{ display: 'flex', gap: '3rem', paddingLeft: '3rem', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '2.5rem', fontWeight: 800, color: '#f59e0b', lineHeight: 1, marginBottom: '0.5rem' }}>
                            {farmer.rating} <Star size={24} fill="#f59e0b" color="#f59e0b" />
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Supplier Rating</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1, marginBottom: '0.5rem' }}>
                            {farmer.totalSales}+
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Successful Trades</p>
                    </div>
                </div>

                {/* Action */}
                <div style={{ flexBasis: '100%', display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <Link href={`/chat?user=${farmer.id}`} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem' }}>
                        <MessageSquare size={18} /> Direct Message Supplier
                    </Link>
                </div>
            </div>

            {/* FARMER'S INVENTORY */}
            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Package color="var(--primary-color)" /> Active Commodities ({products.length})
                </h2>
            </div>

            <div className="products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {products.map(product => (
                    <Link href={`/products/${product.id}`} key={product.id} className="glass-card product-card group" style={{ padding: '0', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ height: '200px', width: '100%', position: 'relative', overflow: 'hidden', backgroundColor: 'var(--bg-dark)' }}>
                            {product.imageUrls && product.imageUrls.length > 0 ? (
                                <img src={product.imageUrls[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} className="group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                                <div className="flex items-center justify-center w-full h-full text-green-500 opacity-20"><Leaf size={48} /></div>
                            )}
                            <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {product.isOrganic && (
                                    <div style={{ padding: '4px 10px', backgroundColor: '#10b981', color: 'white', fontSize: '0.7rem', fontWeight: 700, borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        Certified Organic
                                    </div>
                                )}
                                {product.isSoldOut && (
                                    <div style={{ padding: '4px 10px', backgroundColor: '#ef4444', color: 'white', fontSize: '0.7rem', fontWeight: 700, borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        SOLD OUT
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)', lineHeight: 1.3 }}>{product.name}</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                                <MapPin size={14} /> {product.region}
                            </div>

                            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div>
                                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.2rem', fontWeight: 600 }}>Wholesale Price</p>
                                        <p style={{ fontSize: '1.5rem', fontWeight: 800, color: product.isSoldOut ? 'var(--text-muted)' : 'var(--primary-color)', lineHeight: 1 }}>
                                            {product.isSoldOut ? 'N/A' : `${product.price.toLocaleString()}`} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>{product.isSoldOut ? '' : 'GHS'}</span>
                                        </p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.2rem', fontWeight: 600 }}>Avail. Qty</p>
                                        <p style={{ fontSize: '1.1rem', fontWeight: 600, color: product.isSoldOut ? 'var(--text-muted)' : 'var(--text-main)', lineHeight: 1 }}>
                                            {product.isSoldOut ? '0 MT' : `${product.availableQuantity} MT`}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}

                {products.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        This supplier has no active listings.
                    </div>
                )}
            </div>

        </div>
    );
}
