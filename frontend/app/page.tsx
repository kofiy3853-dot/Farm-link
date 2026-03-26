/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
'use client';

import Link from 'next/link';
import { ArrowRight, TrendingUp, TrendingDown, Tractor, ShoppingCart, Truck, Activity, ShieldCheck, MapPin, Smartphone, SmartphoneNfc, Globe2, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function Home() {
  const [stats, setStats] = useState({
    totalListings: 1250,
    activeFarmers: 420,
    ordersInTransit: 85,
    regionsCovered: 12
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/insights/homepage-stats');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch homepage stats:', error);
      }
    };
    fetchStats();
  }, []);

  // Mock live market data for the ticker
  const marketTicker = [
    { crop: 'Maize (White)', price: 'GHS 1,200/MT', trend: 'up', change: '+2.4%' },
    { crop: 'Tomatoes', price: 'GHS 850/Crate', trend: 'down', change: '-1.2%' },
    { crop: 'Rice (Local)', price: 'GHS 1,450/MT', trend: 'up', change: '+5.1%' },
    { crop: 'Groundnut', price: 'GHS 2,200/MT', trend: 'stable', change: '0.0%' },
    { crop: 'Yam', price: 'GHS 500/100 Tbrs', trend: 'up', change: '+1.5%' },
  ];

  return (
    <div style={{ width: "100%", overflowX: 'hidden' }}>

      {/* 1. HERO SECTION */}
      <section style={{
        position: 'relative',
        minHeight: 'calc(100vh - 80px)',
        display: 'flex',
        alignItems: 'center',
        padding: '6rem clamp(2rem, 5vw, 8rem)',
        overflow: 'hidden'
      }}>
        {/* Background Gradient Overlay */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.15, pointerEvents: 'none', background: 'radial-gradient(circle at 70% 30%, var(--primary-color), transparent 50%), radial-gradient(circle at 30% 70%, #3b82f6, transparent 50%)' }} />

        <div style={{ maxWidth: '1600px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 10, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4rem' }}>

          {/* Text Left */}
          <div style={{ flex: '1 1 500px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '30px', color: 'var(--primary-color)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <Globe2 size={14} /> Building the future of agricultural trade in Ghana
            </div>

            <h1 style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '1.5rem', background: 'linear-gradient(to right, #fff, #a7f3d0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Connecting Farmers, Buyers & Logistics Across Ghana.
            </h1>

            <p style={{ fontSize: 'clamp(1.1rem, 1.5vw, 1.3rem)', color: 'var(--text-muted)', maxWidth: '600px', marginBottom: '3rem', lineHeight: 1.6 }}>
              Buy, sell, transport, finance and track agricultural produce in one powerful ecosystem. Join the revolution today.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/register" style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '1rem 2rem', fontSize: '1.1rem', fontWeight: 600,
                backgroundColor: 'var(--primary-color)', color: 'white',
                borderRadius: '12px', textDecoration: 'none', boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)'
              }}>
                <Tractor size={20} /> Sell Produce
              </Link>
              <Link href="/marketplace" style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '1rem 2rem', fontSize: '1.1rem', fontWeight: 600,
                backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px', textDecoration: 'none'
              }}>
                <ShoppingCart size={20} /> Buy Produce
              </Link>
            </div>
          </div>

          {/* Image Right */}
          <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: '-20px', background: 'linear-gradient(135deg, var(--primary-color), #3b82f6)', opacity: 0.2, filter: 'blur(40px)', borderRadius: '50%' }} />
            <div style={{ position: 'relative', width: '100%', maxWidth: '600px', height: '550px', borderRadius: '30px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
              <img src="https://images.unsplash.com/photo-1592982537447-6f2a6a0c5c83?q=80&w=1000&auto=format&fit=crop" alt="Farming in Ghana" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

              {/* Floating Badge */}
              <div style={{ position: 'absolute', bottom: '2rem', left: '-1rem', backgroundColor: 'rgba(13, 17, 16, 0.85)', backdropFilter: 'blur(10px)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '1rem 1.5rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', transform: 'translate(40px, 0)' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 color="var(--primary-color)" size={20} />
                </div>
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Harvest Quality</p>
                  <p style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>100% Verified</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. LIVE MARKET SNAPSHOT */}
      <section style={{ padding: '0 clamp(2rem, 5vw, 8rem) 4rem', marginTop: '-3rem', position: 'relative', zIndex: 20 }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          {/* Ticker & Stats in Glass Panel */}
          <div className="glass-card" style={{ padding: '2rem', borderRadius: '24px', backgroundColor: 'rgba(13, 17, 16, 0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>

            {/* Ticker */}
            <div style={{ display: 'flex', gap: '2rem', overflowX: 'auto', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', scrollbarWidth: 'none' }} className="hide-scroll">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap', paddingRight: '2rem', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                <Activity size={18} /> Live Market
              </div>
              {marketTicker.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', whiteSpace: 'nowrap', padding: '0 1rem', borderRight: i < marketTicker.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{item.crop}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{item.price}</span>
                  <span style={{
                    display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', fontWeight: 700,
                    color: item.trend === 'up' ? '#10b981' : item.trend === 'down' ? '#ef4444' : 'var(--text-muted)',
                    backgroundColor: item.trend === 'up' ? 'rgba(16,185,129,0.1)' : item.trend === 'down' ? 'rgba(239,68,68,0.1)' : 'transparent',
                    padding: '2px 8px', borderRadius: '12px'
                  }}>
                    {item.trend === 'up' ? <TrendingUp size={14} /> : item.trend === 'down' ? <TrendingDown size={14} /> : '-'} {item.change}
                  </span>
                </div>
              ))}
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', paddingTop: '1.5rem' }}>
              {[
                { label: 'Active Listings', value: stats.totalListings.toLocaleString() },
                { label: 'Verified Farmers', value: stats.activeFarmers.toLocaleString() },
                { label: 'Orders in Transit', value: stats.ordersInTransit.toLocaleString(), color: '#3b82f6' },
                { label: 'Regions Covered', value: stats.regionsCovered.toLocaleString(), color: '#8b5cf6' },
              ].map((stat, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center', textAlign: 'center' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 800, color: stat.color || 'var(--primary-color)', lineHeight: 1 }}>{stat.value}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section style={{ padding: '5rem clamp(2rem, 5vw, 8rem) 6rem', maxWidth: '1600px', margin: '0 auto', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: '20px', backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Ecosystem Simplicity</div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1rem' }}>3 Steps to Seamless Trade</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>From planting to final delivery, FarmLink removes the friction from agricultural commerce.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', position: 'relative' }}>
          {/* Connecting line (desktop) */}
          <div style={{ position: 'absolute', top: '40px', left: '15%', right: '15%', height: '2px', background: 'linear-gradient(to right, rgba(16,185,129,0.2), rgba(59,130,246,0.2))', zIndex: 0, display: 'none' }} className="lg:block" />

          {[
            { step: '1', title: 'Farmers List Produce', desc: 'Verified farmers digitize their harvest using simple mobile forms.', icon: <Tractor size={32} /> },
            { step: '2', title: 'Buyers Place Orders', desc: 'Businesses source bulk commodities with secure digital escrow.', icon: <ShoppingCart size={32} /> },
            { step: '3', title: 'Logistics Delivers', desc: 'Integrated fleet managers optimize routing and track cold chain.', icon: <Truck size={32} /> },
          ].map((item, i) => (
            <div key={i} style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '24px', backgroundColor: 'var(--bg-color)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--primary-color)', boxShadow: '0 10px 30px rgba(16,185,129,0.1) inset' }}>
                {item.icon}
              </div>
              <div style={{ position: 'absolute', top: '-15px', right: '-15px', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 800, boxShadow: '0 4px 10px rgba(16,185,129,0.4)' }}>{item.step}</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>{item.title}</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FEATURED PRODUCE */}
      <section style={{ padding: '5rem clamp(2rem, 5vw, 8rem) 6rem', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)' }} />
        <div style={{ maxWidth: '1600px', margin: '0 auto' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Live Marketplace</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Sourced directly from verified Ghanaian cooperatives.</p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {[
                { label: 'All Regions', query: '' },
                { label: 'Price: Low to High', query: '?sort=price_asc' },
                { label: 'Available Now', query: '?available=true' },
                { label: 'Delivery Included', query: '?delivery=true' }
              ].map((filter, i) => (
                <Link key={i} href={`/marketplace${filter.query}`} style={{ padding: '8px 16px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s', textDecoration: 'none' }} className="hover:bg-white-10 hover:text-white">
                  {filter.label}
                </Link>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {[
              { name: 'Premium White Maize', region: 'Ashanti Region', price: '1,200', qty: '50', img: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=600&auto=format&fit=crop', rating: 4.8 },
              { name: 'Fresh Tomatoes', region: 'Brong Ahafo', price: '850', qty: '120', img: 'https://images.unsplash.com/photo-1592841200221-a6898f307ba1?q=80&w=600&auto=format&fit=crop', rating: 4.9 },
              { name: 'Raw Groundnut', region: 'Northern Region', price: '2,200', qty: '15', img: 'https://images.unsplash.com/photo-1565011523534-747a8601f10a?q=80&w=600&auto=format&fit=crop', rating: 4.7 },
              { name: 'Local Rice', region: 'Volta Region', price: '1,450', qty: '200', img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600&auto=format&fit=crop', rating: 5.0 }
            ].map((mock, i) => (
              <div key={i} className="glass-card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ height: '220px', width: '100%', position: 'relative' }}>
                  <img src={mock.img} alt={mock.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '1rem', left: '1rem', padding: '6px 12px', backgroundColor: 'rgba(13,17,16,0.8)', backdropFilter: 'blur(8px)', color: 'white', fontSize: '0.75rem', fontWeight: 700, borderRadius: '8px', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={14} color="var(--primary-color)" /> Verified
                  </div>
                  <div style={{ position: 'absolute', bottom: '-15px', right: '1rem', padding: '6px 12px', backgroundColor: 'var(--bg-color)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', color: '#fbbf24', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', zIndex: 10 }}>
                    ★ {mock.rating}
                  </div>
                </div>

                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    <MapPin size={14} color="var(--primary-color)" /> {mock.region}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.2rem' }}>{mock.name}</h3>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '1.5rem' }}>
                    <div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.3rem', letterSpacing: '0.05em' }}>Price</p>
                      <p style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white' }}>GHS {mock.price}<span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>/MT</span></p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.3rem', letterSpacing: '0.05em' }}>Available</p>
                      <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)' }}>{mock.qty} MT</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
                    <Link href="/marketplace" style={{ flex: 1, padding: '0.75rem', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontWeight: 600, borderRadius: '12px', textDecoration: 'none' }}>
                      View Details
                    </Link>
                    <Link href="/marketplace" style={{ flex: 1, padding: '0.75rem', textAlign: 'center', backgroundColor: 'var(--primary-color)', color: 'white', fontWeight: 600, borderRadius: '12px', textDecoration: 'none', boxShadow: '0 4px 15px rgba(16,185,129,0.3)' }}>
                      Buy Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link href="/marketplace" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', borderBottom: '1px solid var(--primary-color)', paddingBottom: '4px', fontWeight: 600, textDecoration: 'none' }} className="hover:text-primary">
              Browse All Listings <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. UNIFIED PLATFORM */}
      <section style={{ padding: '5rem clamp(2rem, 5vw, 8rem) 6rem', maxWidth: '1600px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1rem' }}>One Unified Platform</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>Tailored tools for every stakeholder in the agricultural supply chain.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>

          {/* For Farmers */}
          <div className="glass-card" style={{ padding: '3rem 2.5rem', borderRadius: '24px', border: '1px solid rgba(16,185,129,0.2)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(16,185,129,0.1), transparent 70%)', borderRadius: '50%', transform: 'translate(30%, -30%)' }} />
            <Tractor size={48} color="#10b981" style={{ marginBottom: '2rem' }} />
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', marginBottom: '1.5rem' }}>For Farmers</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2.5rem 0', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {['List crops easily', 'Transparent pricing', 'Access buyers nationwide'].map((t, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', fontSize: '1.05rem' }}>
                  <CheckCircle2 size={20} color="#10b981" /> {t}
                </li>
              ))}
            </ul>
            <Link href="/register" style={{ display: 'inline-flex', padding: '0.8rem 1.5rem', backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981', fontWeight: 600, borderRadius: '8px', textDecoration: 'none' }}>
              Join as Farmer &rarr;
            </Link>
          </div>

          {/* For Buyers */}
          <div className="glass-card" style={{ padding: '3rem 2.5rem', borderRadius: '24px', border: '1px solid rgba(59,130,246,0.2)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(59,130,246,0.1), transparent 70%)', borderRadius: '50%', transform: 'translate(30%, -30%)' }} />
            <ShoppingCart size={48} color="#3b82f6" style={{ marginBottom: '2rem' }} />
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', marginBottom: '1.5rem' }}>For Buyers</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2.5rem 0', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {['Verified farmers', 'Bulk order support', 'Secure payments'].map((t, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', fontSize: '1.05rem' }}>
                  <CheckCircle2 size={20} color="#3b82f6" /> {t}
                </li>
              ))}
            </ul>
            <Link href="/marketplace" style={{ display: 'inline-flex', padding: '0.8rem 1.5rem', backgroundColor: 'rgba(59,130,246,0.1)', color: '#60a5fa', fontWeight: 600, borderRadius: '8px', textDecoration: 'none' }}>
              Start Buying &rarr;
            </Link>
          </div>

          {/* For Logistics */}
          <div className="glass-card" style={{ padding: '3rem 2.5rem', borderRadius: '24px', border: '1px solid rgba(139,92,246,0.2)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(139,92,246,0.1), transparent 70%)', borderRadius: '50%', transform: 'translate(30%, -30%)' }} />
            <Truck size={48} color="#8b5cf6" style={{ marginBottom: '2rem' }} />
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', marginBottom: '1.5rem' }}>For Logistics</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2.5rem 0', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {['Delivery scheduling', 'Route optimization', 'Cold chain tracking'].map((t, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', fontSize: '1.05rem' }}>
                  <CheckCircle2 size={20} color="#8b5cf6" /> {t}
                </li>
              ))}
            </ul>
            <Link href="/logistics" style={{ display: 'inline-flex', padding: '0.8rem 1.5rem', backgroundColor: 'rgba(139,92,246,0.1)', color: '#a78bfa', fontWeight: 600, borderRadius: '8px', textDecoration: 'none' }}>
              Manage Fleet &rarr;
            </Link>
          </div>

        </div>
      </section>

      {/* 6. AI AGRICULTURE */}
      <section style={{ padding: '6rem clamp(2rem, 5vw, 8rem)', backgroundColor: 'rgba(0,0,0,0.4)', position: 'relative', overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ position: 'absolute', right: '-10%', top: '-20%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(59,130,246,0.05), transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1600px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '3rem', alignItems: 'center' }}>

          {/* Text Content */}
          <div style={{ flex: '1 1 500px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '30px', color: '#60a5fa', fontSize: '0.85rem', fontWeight: 600, marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <Activity size={14} /> Intelligence Pipeline
            </div>
            <h2 style={{ fontSize: '3rem', fontWeight: 800, color: 'white', marginBottom: '1.5rem', lineHeight: 1.1 }}>AI-Driven Agriculture.</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '3rem', lineHeight: 1.6 }}>
              FarmLink isn't just a marketplace. We leverage advanced artificial intelligence to provide strategic insights that empower your agribusiness.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '3rem' }}>
              {[
                { title: 'Price Prediction', desc: 'Forecast future market prices based on historical trends.', icon: <TrendingUp size={24} color="#60a5fa" /> },
                { title: 'Demand Forecasting', desc: 'Predict regional supply needs before shortages happen.', icon: <ShoppingCart size={24} color="#60a5fa" /> },
                { title: 'Crop Supply Analysis', desc: 'Monitor active listings and map production heatmaps.', icon: <MapPin size={24} color="#60a5fa" /> },
                { title: 'Market Alerts', desc: 'Get notified of sudden policy changes or price spikes.', icon: <ShieldCheck size={24} color="#60a5fa" /> }
              ].map((feat, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {feat.icon}
                  </div>
                  <h4 style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>{feat.title}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>{feat.desc}</p>
                </div>
              ))}
            </div>

            <Link href="/agric-news" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', backgroundColor: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)', fontWeight: 600, borderRadius: '12px', textDecoration: 'none' }}>
              View Market Insights <ArrowRight size={18} />
            </Link>
          </div>

          {/* Visual Dashboard Mockup */}
          <div style={{ flex: '1 1 500px', display: 'flex', justifyContent: 'center' }}>
            <div className="glass-card" style={{ width: '100%', maxWidth: '600px', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(59,130,246,0.2)', boxShadow: '0 30px 60px rgba(0,0,0,0.6), 0 0 40px rgba(59,130,246,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', alignItems: 'center' }}>
                <span style={{ color: 'white', fontWeight: 600 }}>Forecast: Maize (Ashanti)</span>
                <span style={{ color: '#10b981', fontSize: '0.9rem', fontWeight: 700, backgroundColor: 'rgba(16,185,129,0.1)', padding: '4px 10px', borderRadius: '12px' }}>+12% Expected</span>
              </div>

              {/* Dummy Chart */}
              <div style={{ height: '200px', width: '100%', borderBottom: '1px solid rgba(255,255,255,0.1)', borderLeft: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'flex-end', gap: '2%', padding: '1rem' }}>
                {[30, 45, 25, 60, 50, 80, 70, 95].map((h, i) => (
                  <div key={i} style={{ flex: 1, backgroundColor: i === 7 ? 'rgba(59,130,246,0.8)' : 'rgba(59,130,246,0.3)', height: `${h}%`, borderRadius: '4px 4px 0 0', position: 'relative' }}>
                    {i === 7 && <div style={{ position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'white', color: 'black', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>1,400</div>}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span style={{ color: 'white', fontWeight: 600 }}>Aug</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 7. LIVE MARKET INTELLIGENCE DASHBOARD */}
      <section style={{ padding: '5rem clamp(2rem, 5vw, 8rem) 6rem', maxWidth: '1600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Live Market Intelligence</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Real-time updates and news affecting the agriculture sector.</p>
          </div>
          <Link href="/agric-news" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', borderBottom: '1px solid var(--text-muted)', paddingBottom: '4px', fontWeight: 600, textDecoration: 'none' }}>
            Open Full Dashboard <ArrowRight size={18} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {[
            { tag: 'Demand Surge', color: '#ef4444', title: 'Tomato demand rising rapidly in Kumasi metropolitan.', icon: <TrendingUp size={20} color="#ef4444" />, time: '2 mins ago' },
            { tag: 'Policy Update', color: '#10b981', title: 'Government fertilizer subsidy registration now open via FarmLink.', icon: <ShieldCheck size={20} color="#10b981" />, time: '1 hour ago' },
            { tag: 'Weather Forecast', color: '#3b82f6', title: 'Dry season price forecast released for major grains.', icon: <Globe2 size={20} color="#3b82f6" />, time: '3 hours ago' },
            { tag: 'Market Alert', color: '#f59e0b', title: 'Logistics routes in Northern region clear after roadworks.', icon: <Truck size={20} color="#f59e0b" />, time: '5 hours ago' }
          ].map((news, i) => (
            <div key={i} className="glass-card" style={{ padding: '1.5rem', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ padding: '10px', backgroundColor: `rgba(${news.color === '#ef4444' ? '239,68,68' : news.color === '#10b981' ? '16,185,129' : news.color === '#3b82f6' ? '59,130,246' : '245,158,11'}, 0.1)`, borderRadius: '12px' }}>
                {news.icon}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <span style={{ color: news.color, fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{news.tag}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>• {news.time}</span>
                </div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'white', lineHeight: 1.5 }}>{news.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. DOWNLOAD APP */}
      <section style={{ padding: '3rem clamp(2rem, 5vw, 8rem) 6rem', maxWidth: '1600px', margin: '0 auto' }}>
        <div style={{ padding: '3rem 4rem', background: 'linear-gradient(135deg, var(--bg-dark) 0%, #064e3b 100%)', borderRadius: '32px', display: 'flex', flexWrap: 'wrap', gap: '3rem', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(16, 185, 129, 0.3)', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
          <div style={{ flex: '1 1 400px' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 800, color: 'white', marginBottom: '1.5rem', lineHeight: 1.1 }}>Take the Marketplace Everywhere.</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2.5rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {['Push notifications for new orders', 'Chat with buyers and sellers in real-time', 'Offline mode for remote farm access'].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' }}>
                  <CheckCircle2 size={20} color="var(--primary-color)" /> {item}
                </li>
              ))}
            </ul>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', padding: '1rem 2rem', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}>
                <Smartphone size={24} color="white" />
                <div style={{ color: 'white', fontWeight: 600, fontSize: '1rem' }}>iOS Coming Soon</div>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', padding: '1rem 2rem', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}>
                <SmartphoneNfc size={24} color="white" />
                <div style={{ color: 'white', fontWeight: 600, fontSize: '1rem' }}>Android Coming Soon</div>
              </div>
            </div>
          </div>

          <div style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center' }}>
            {/* Phone Mockup Design */}
            <div style={{ width: '280px', height: '560px', backgroundColor: 'var(--bg-color)', borderRadius: '40px', border: '12px solid #222', position: 'relative', overflow: 'hidden', boxShadow: '20px 20px 60px rgba(0,0,0,0.6)' }}>
              {/* Notch */}
              <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '120px', height: '25px', backgroundColor: '#222', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', zIndex: 10 }} />

              <div style={{ padding: '3rem 1.5rem 1.5rem', height: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h4 style={{ color: 'white', fontWeight: 700, fontSize: '1.2rem' }}>Good morning, Nana</h4>
                <div style={{ width: '100%', height: '120px', background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(59,130,246,0.2))', borderRadius: '16px', border: '1px solid rgba(16,185,129,0.2)', padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Total Sales (Month)</span>
                  <span style={{ color: 'white', fontSize: '1.8rem', fontWeight: 800 }}>GHS 14,500</span>
                </div>
                <div style={{ color: 'white', fontWeight: 600, marginTop: '1rem' }}>Pending Orders</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[1, 2, 3].map(i => (
                    <div key={i} style={{ width: '100%', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ width: '60%', height: '12px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '4px', marginBottom: '8px' }} />
                        <div style={{ width: '40%', height: '10px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '5rem clamp(2rem, 5vw, 8rem)', backgroundColor: 'rgba(0,0,0,0.4)' }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '4rem', marginBottom: '4rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <div className="logo-icon" style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Tractor size={18} color="white" />
              </div>
              <span className="logo-text" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>FarmLink.</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>The digital infrastructure empowering Africa's agricultural supply chain from farm gate to factory gate.</p>
          </div>
          <div>
            <h4 style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '1.5rem' }}>Platform</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><Link href="/marketplace" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Marketplace</Link></li>
              <li><Link href="/register" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>For Farmers</Link></li>
              <li><Link href="/logistics" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>For Logistics</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '1.5rem' }}>Company</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><Link href="/about" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>About Us</Link></li>
              <li><Link href="/about" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Contact Support</Link></li>
              <li><Link href="/about" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Careers</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '1.5rem' }}>Legal</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><Link href="/about" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Privacy Policy</Link></li>
              <li><Link href="/about" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Terms of Service</Link></li>
              <li><Link href="/about" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>KYC Compliance</Link></li>
            </ul>
          </div>
        </div>
        <div style={{ maxWidth: '1600px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>&copy; 2026 FarmLink Technologies Limited. All rights reserved.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <Globe2 size={16} /> Region: <strong style={{ color: 'var(--text-main)' }}>Ghana</strong>
          </div>
        </div>
      </footer>
    </div>
  );
}
