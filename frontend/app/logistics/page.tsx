/* eslint-disable react/no-unescaped-entities */
'use client';

import { Truck, MapPin, Clock, BarChart } from 'lucide-react';

export default function LogisticsPage() {
    return (
        <div className="animate-fade-in" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>

            <div style={{ textAlign: 'center', marginBottom: '4rem', marginTop: '2rem' }}>
                <h1 className="heading-1" style={{ marginBottom: '1.5rem' }}>Cold-Chain Logistics</h1>
                <p className="text-muted" style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.25rem', lineHeight: '1.6' }}>
                    FarmLink isn't just a marketplace; it's a fully integrated supply chain solution ensuring your produce arrives at peak freshness.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                {/* Feature 1 */}
                <div className="glass-card group" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ padding: '12px', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: 'var(--primary-color)' }}>
                            <Clock size={24} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)' }}>24-Hour Delivery</h3>
                    </div>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>From harvest to door, our optimized routing algorithms guarantee next-day delivery on 95% of local orders.</p>
                </div>

                {/* Feature 2 */}
                <div className="glass-card group" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ padding: '12px', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: 'var(--primary-color)' }}>
                            <Truck size={24} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)' }}>Temp-Controlled</h3>
                    </div>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>Our fleet is fully equipped with multi-zone climate control, ensuring dairy stays cold while tomatoes stay ambient.</p>
                </div>

                {/* Feature 3 */}
                <div className="glass-card group" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ padding: '12px', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: 'var(--primary-color)' }}>
                            <MapPin size={24} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)' }}>Live Tracking</h3>
                    </div>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>Real-time GPS tracking allows buyers to see exactly where their order is on the map, down to the minute.</p>
                </div>
            </div>

            <div className="glass-card" style={{ padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <BarChart size={40} color="var(--primary-color)" style={{ marginBottom: '1rem' }} />
                <h3 className="heading-2" style={{ marginBottom: '1rem', textAlign: 'center' }}>Optimizing the Last Mile</h3>
                <p className="text-muted" style={{ textAlign: 'center', maxWidth: '600px', lineHeight: '1.6' }}>
                    Our proprietary logistics backend groups orders by farm density and delivery zones, dramatically reducing the carbon footprint of food transportation compared to traditional grocers.
                </p>
            </div>
        </div>
    );
}
