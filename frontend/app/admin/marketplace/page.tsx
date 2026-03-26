/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, Search, Trash2, AlertTriangle } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminMarketplacePage() {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/admin/products');
            setProducts(response.data);
        } catch {
            console.error('Failed to fetch products');
            toast.error('Failed to load marketplace listings');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteProduct = async (productId: string) => {
        if (!confirm('Are you sure you want to permanently delete this listing? It will be removed from the marketplace.')) return;

        try {
            await api.delete(`/admin/products/${productId}`);
            toast.success('Listing deleted successfully');
            fetchProducts();
        } catch {
            toast.error('Failed to delete listing');
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.farmer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate-fade-in" style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <ShoppingBag size={36} color="var(--primary-color)" />
                    <div>
                        <h1 className="heading-2">Marketplace Control</h1>
                        <p className="text-muted" style={{ marginTop: '0.25rem' }}>Moderate active produce listings and monitor platform integrity.</p>
                    </div>
                </div>

                <div className="input-wrapper">
                    <Search className="input-icon" size={18} />
                    <input
                        type="text"
                        className="input-field with-icon"
                        placeholder="Search produce, farmer, or category..."
                        style={{ width: '300px' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '6rem' }}>
                    <div className="logo-icon animate-pulse" style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary-color)' }}></div>
                </div>
            ) : (
                <div className="glass-card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
                    <div style={{ overflowX: 'auto', width: '100%' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Product Name</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Category</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Price & Quantity</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Farmer Info</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Date Listed</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem', textAlign: 'right' }}>Moderation</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background-color 0.2s' }} className="hover:bg-white/5">
                                        <td style={{ padding: '1rem', color: 'var(--text-main)', fontWeight: 500 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                {product.imageUrls && product.imageUrls.length > 0 && (
                                                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                                                        <img src={product.imageUrls[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    </div>
                                                )}
                                                {product.name}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '4px 8px',
                                                borderRadius: '6px',
                                                fontSize: '0.75rem',
                                                fontWeight: 600,
                                                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                                color: '#3b82f6',
                                                textTransform: 'uppercase'
                                            }}>
                                                {product.category}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                                            <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>${product.price.toFixed(2)}</div>
                                            <div style={{ fontSize: '0.85rem' }}>Qty: {product.quantity}</div>
                                        </td>
                                        <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                                            <div style={{ fontWeight: 500, color: 'var(--text-main)' }}>{product.farmer?.name}</div>
                                            <div style={{ fontSize: '0.85rem' }}>{product.farmer?.email}</div>
                                        </td>
                                        <td style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }} suppressHydrationWarning>
                                            {new Date(product.createdAt).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                                <button
                                                    style={{
                                                        background: 'transparent',
                                                        border: 'none',
                                                        color: '#f59e0b',
                                                        cursor: 'pointer',
                                                        padding: '6px',
                                                        borderRadius: '4px',
                                                        transition: 'background-color 0.2s'
                                                    }}
                                                    className="hover:bg-yellow-900/20"
                                                    title="Flag for review"
                                                >
                                                    <AlertTriangle size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(product.id)}
                                                    style={{
                                                        background: 'transparent',
                                                        border: 'none',
                                                        color: '#ef4444',
                                                        cursor: 'pointer',
                                                        padding: '6px',
                                                        borderRadius: '4px',
                                                        transition: 'background-color 0.2s'
                                                    }}
                                                    className="hover:bg-red-900/20"
                                                    title="Remove Listing"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredProducts.length === 0 && (
                                    <tr>
                                        <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                            No marketplace listings found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
