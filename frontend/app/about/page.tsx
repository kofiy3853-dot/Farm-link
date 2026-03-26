/* eslint-disable react/no-unescaped-entities */
'use client';

import { Heart, Globe, Shield, Award } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="animate-fade-in" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>

            <div style={{ textAlign: 'center', marginBottom: '4rem', marginTop: '2rem' }}>
                <h1 className="heading-1" style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>Our Mission</h1>
                <p className="text-muted" style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.5rem', lineHeight: '1.6', fontWeight: 300 }}>
                    To completely decentralize the food supply chain, giving the power and majority of profits back to the farmers who feed the world.
                </p>
            </div>

            <div className="glass-card" style={{ padding: '4rem 3rem', marginBottom: '4rem', display: 'flex', flexWrap: 'wrap', gap: '3rem', alignItems: 'center' }}>
                <div style={{ flex: '1 1 400px' }}>
                    <h2 className="heading-2" style={{ marginBottom: '1.5rem' }}>The Problem</h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '1.5rem', fontSize: '1.05rem' }}>
                        The traditional agricultural supply chain is dominated by middlemen. Grocers, distributors, and logistics firms often extract up to 80% of the final retail price of produce, leaving farmers struggling to maintain sustainable margins while consumers pay inflated prices for food that may have spent weeks in transit.
                    </p>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '1.05rem' }}>
                        This system is not only economically inefficient but also heavily damaging to the environment due to excessive long-haul transportation of perishable goods.
                    </p>
                </div>
                <div style={{ flex: '1 1 400px' }}>
                    <h2 className="heading-2" style={{ marginBottom: '1.5rem' }}>The FarmLink Solution</h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '1.5rem', fontSize: '1.05rem' }}>
                        By building a unified digital marketplace paired with an optimized last-mile logistics network, FarmLink allows buyers (from families to large restaurant groups) to purchase directly from local farms.
                    </p>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '1.05rem' }}>
                        Farmers set their own prices and keep 90% of the revenue. Buyers receive fresher food, often harvested the very same day, typically at a lower cost than major supermarket chains.
                    </p>
                </div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h2 className="heading-2">Core Values</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '5rem' }}>
                <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
                    <Heart size={32} color="#ef4444" style={{ margin: '0 auto 1.5rem' }} />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1rem' }}>Community First</h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>We prioritize the well-being of our local farming ecosystems over pure corporate extraction.</p>
                </div>

                <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
                    <Globe size={32} color="#3b82f6" style={{ margin: '0 auto 1.5rem' }} />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1rem' }}>Sustainability</h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>Reducing food miles dramatically lowers the carbon footprint of the meals on your table.</p>
                </div>

                <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
                    <Shield size={32} color="var(--primary-color)" style={{ margin: '0 auto 1.5rem' }} />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1rem' }}>Transparency</h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>Zero hidden fees. Complete visibility into pricing, logistics, and farmer revenue shares.</p>
                </div>

                <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
                    <Award size={32} color="#f59e0b" style={{ margin: '0 auto 1.5rem' }} />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1rem' }}>Premium Quality</h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>Direct-to-consumer routing means your food isn't sitting in massive ripening warehouses.</p>
                </div>
            </div>

            <div style={{ textAlign: 'center', padding: '4rem 0', borderTop: '1px solid var(--border-color)' }}>
                <h2 className="heading-2" style={{ marginBottom: '2rem' }}>Experience the difference.</h2>
                <Link href="/register" className="btn-primary" style={{ padding: '14px 40px', fontSize: '1.1rem', borderRadius: '30px' }}>Join FarmLink Today</Link>
            </div>
        </div>
    );
}
