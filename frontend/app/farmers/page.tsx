/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Star, Package } from 'lucide-react';
import api from '@/lib/api';

export default function FarmersPage() {
    const [farmers, setFarmers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchFarmers();
    }, []);

    const fetchFarmers = async () => {
        try {
            const response = await api.get('/users/farmers');
            setFarmers(response.data);
        } catch {
            console.error('Failed to fetch farmers');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="farmers-container animate-fade-in" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>

            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 className="heading-1" style={{ marginBottom: '1rem' }}>Our Farmers</h1>
                <p className="text-muted" style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.25rem' }}>
                    Connect directly with the hardworking individuals who grow your food. Quality guaranteed, straight from the source.
                </p>
            </div>

            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '6rem' }}>
                    <div className="logo-icon animate-pulse" style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary-color)' }}></div>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                    {farmers.map((farmer) => (
                        <div key={farmer.id} className="glass-card group" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}>
                            <div style={{
                                width: '96px',
                                height: '96px',
                                borderRadius: '50%',
                                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '1.5rem',
                                border: '2px solid rgba(16, 185, 129, 0.3)',
                                fontSize: '2.5rem',
                                fontWeight: 'bold',
                                color: 'var(--primary-color)'
                            }}>
                                {farmer.name.charAt(0).toUpperCase()}
                            </div>

                            <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                                {farmer.name}
                            </h3>

                            <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <MapPin size={14} /> Local Farm
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Star size={14} color="#f59e0b" /> 4.9
                                </span>
                            </div>

                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: '1.6' }}>
                                Dedicated to sustainable farming practices and providing the freshest produce to the community since {new Date(farmer.createdAt).getFullYear()}.
                            </p>

                            <Link href={`/farmers/${farmer.id}`} className="btn-outline w-full" style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center', gap: '8px', textDecoration: 'none' }}>
                                <Package size={18} /> View Their Products
                            </Link>
                        </div>
                    ))}

                    {farmers.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                            No farmers have registered yet. Check back soon!
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
