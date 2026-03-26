'use client';

import { Users, Search, ShoppingBag, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function BuyersPage() {
    return (
        <div className="animate-fade-in" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>

            <div style={{ textAlign: 'center', marginBottom: '4rem', marginTop: '2rem' }}>
                <h1 className="heading-1" style={{ marginBottom: '1.5rem' }}>For Buyers</h1>
                <p className="text-muted" style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.25rem', lineHeight: '1.6' }}>
                    Join thousands of restaurants, markets, and individuals sourcing the freshest, highest-quality produce directly from local farmers.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', marginBottom: '1.5rem', color: 'var(--primary-color)' }}>
                        <Search size={32} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-main)' }}>Traceable Sourcing</h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>Every product lists its exact origin. Know your farmer, know your food.</p>
                </div>

                <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', marginBottom: '1.5rem', color: 'var(--primary-color)' }}>
                        <ShoppingBag size={32} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-main)' }}>Wholesale & Retail</h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>Whether buying for a family or a commercial kitchen, we scale to your needs.</p>
                </div>

                <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', marginBottom: '1.5rem', color: 'var(--primary-color)' }}>
                        <ShieldCheck size={32} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-main)' }}>Secure Transactions</h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>Payments are held securely and released only upon delivery confirmation.</p>
                </div>
            </div>

            <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center', backgroundColor: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <Users size={48} color="var(--primary-color)" style={{ margin: '0 auto 1.5rem' }} />
                <h2 className="heading-2" style={{ marginBottom: '1rem' }}>Ready to start sourcing?</h2>
                <p className="text-muted" style={{ marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
                    Create your free buyer account today and get immediate access to the premium agricultural marketplace.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <Link href="/register" className="btn-primary" style={{ padding: '12px 32px', fontSize: '1.1rem' }}>Create Account</Link>
                    <Link href="/marketplace" className="btn-outline" style={{ padding: '12px 32px', fontSize: '1.1rem' }}>Browse Market</Link>
                </div>
            </div>
        </div>
    );
}
