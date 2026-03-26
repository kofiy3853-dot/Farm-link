/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState, useEffect } from 'react';
import { Newspaper, Rss, Clock, Tag, AlertTriangle, CloudSun, Sparkles, ChevronRight } from 'lucide-react';
import api from '@/lib/api';

const CATEGORIES = ['All', 'Crops', 'Livestock', 'Market Prices', 'Weather', 'Pest & Disease', 'Government Policies', 'Agri Technology'];

export default function AgricNewsPage() {
    const [news, setNews] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');

    useEffect(() => {
        fetchNews(activeCategory);
    }, [activeCategory]);

    const fetchNews = async (category: string) => {
        setIsLoading(true);
        try {
            const endpoint = category === 'All' ? '/agric-news/latest' : `/agric-news/category/${category}`;
            const res = await api.get(endpoint);
            setNews(res.data.news || []);
        } catch (error) {
            console.error('Failed to fetch agric news', error);
        } finally {
            setIsLoading(false);
        }
    };

    const isUrgent = (category: string) => ['Pest & Disease', 'Weather'].includes(category);

    return (
        <div style={{ minHeight: '100vh', width: '100%', padding: '2rem 1rem 6rem', position: 'relative' }} className="animate-fade-in">
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

                {/* Header Section */}
                <header style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    gap: '1.5rem',
                    borderBottom: '1px solid var(--border-color)',
                    paddingBottom: '2rem',
                    marginBottom: '2.5rem'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px 12px',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            border: '1px solid rgba(16, 185, 129, 0.2)',
                            borderRadius: '30px',
                            color: 'var(--primary-color)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            alignSelf: 'flex-start'
                        }}>
                            <Sparkles size={14} /> AI-Powered Intelligence
                        </div>
                        <h1 className="heading-1" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            Agric-News Hub
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '700px', lineHeight: 1.6 }}>
                            Real-time agricultural updates, automatically summarized and categorized for your convenience.
                        </p>
                    </div>

                    <div className="glass-card" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '12px 20px',
                        borderRadius: '20px'
                    }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', boxShadow: '0 0 10px var(--primary-color)', animation: 'pulse 2s infinite' }}></div>
                        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', marginRight: '8px' }}>Live Feed</span>
                        <Rss color="var(--primary-color)" size={18} />
                    </div>
                </header>

                {/* Categories */}
                <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '2rem', scrollbarWidth: 'none' }}>
                    {CATEGORIES.map(cat => {
                        const isActive = activeCategory === cat;
                        return (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                style={{
                                    padding: '12px 24px',
                                    borderRadius: '16px',
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
                                    whiteSpace: 'nowrap',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    border: isActive ? '1px solid transparent' : '1px solid var(--border-color)',
                                    background: isActive ? 'linear-gradient(135deg, var(--primary-color), var(--primary-hover))' : 'var(--glass-bg)',
                                    color: isActive ? '#fff' : 'var(--text-muted)',
                                    boxShadow: isActive ? '0 4px 15px var(--primary-glow)' : 'none',
                                    backdropFilter: 'blur(8px)'
                                }}
                            >
                                {cat}
                            </button>
                        );
                    })}
                </div>

                {/* News Grid */}
                {isLoading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6rem 2rem', gap: '1.5rem' }}>
                        <div style={{ position: 'relative', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'var(--primary-glow)', borderRadius: '50%', filter: 'blur(20px)', animation: 'pulse 2s infinite' }}></div>
                            <Newspaper size={40} color="var(--primary-color)" style={{ position: 'relative', zIndex: 10, animation: 'bounce 2s infinite' }} />
                        </div>
                        <p style={{ color: 'var(--primary-color)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.875rem', animation: 'pulse 2s infinite' }}>
                            Fetching Insights...
                        </p>
                    </div>
                ) : news.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                        {news.map((item) => {
                            const urgent = isUrgent(item.category);
                            return (
                                <a
                                    key={item.id}
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="glass-card"
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        overflow: 'hidden',
                                        padding: 0,
                                        textDecoration: 'none',
                                        transition: 'transform 0.4s ease, border-color 0.4s ease',
                                        borderColor: urgent ? 'rgba(249, 115, 22, 0.4)' : 'var(--border-color)',
                                        borderRadius: '24px'
                                    }}
                                >
                                    {/* Image Head */}
                                    <div style={{ height: '220px', width: '100%', position: 'relative', overflow: 'hidden', backgroundColor: 'var(--surface-color)' }}>
                                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--surface-color), transparent)', zIndex: 10 }}></div>

                                        {item.image ? (
                                            <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Newspaper size={64} color="var(--border-color)" />
                                            </div>
                                        )}

                                        {/* Badges */}
                                        <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 20 }}>
                                            <span style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                padding: '6px 14px',
                                                fontSize: '0.75rem',
                                                fontWeight: 800,
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em',
                                                borderRadius: '12px',
                                                backgroundColor: urgent ? '#f97316' : 'rgba(13, 17, 16, 0.8)',
                                                color: urgent ? '#fff' : 'var(--primary-color)',
                                                border: urgent ? 'none' : '1px solid rgba(16, 185, 129, 0.3)',
                                                backdropFilter: 'blur(4px)'
                                            }}>
                                                {urgent && <AlertTriangle size={14} />}
                                                {item.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content Body */}
                                    <div style={{
                                        padding: '2rem',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        flex: 1,
                                        marginTop: '-40px',
                                        position: 'relative',
                                        zIndex: 30,
                                        background: 'transparent'
                                    }}>
                                        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.5rem', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {item.title}
                                        </h3>

                                        {/* AI Summary Card */}
                                        <div style={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                            padding: '1rem 1.25rem',
                                            borderRadius: '16px',
                                            border: '1px solid rgba(255, 255, 255, 0.05)',
                                            marginBottom: '1.5rem',
                                            flex: 1,
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}>
                                            <div style={{ position: 'absolute', top: 0, right: 0, opacity: 0.05, padding: '10px' }}>
                                                <Sparkles size={64} />
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', fontSize: '0.75rem', fontWeight: 800, color: 'rgba(16, 185, 129, 0.9)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                <Sparkles size={14} /> AI Summary
                                            </div>
                                            <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: 1.6, fontSize: '0.95rem', position: 'relative', zIndex: 10 }}>
                                                "{item.summary}"
                                            </p>
                                        </div>

                                        {/* Metadata Footer */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <Tag size={14} /> {item.source}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', fontWeight: 500, color: 'rgba(255, 255, 255, 0.4)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <Clock size={14} /> {new Date(item.published_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>
                                            </div>

                                            <div className="chevron-btn" style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--surface-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
                                                <ChevronRight size={18} />
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                ) : (
                    <div className="glass-card" style={{ padding: '4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', maxWidth: '600px', margin: '4rem auto', borderStyle: 'dashed' }}>
                        <CloudSun size={64} color="var(--primary-color)" style={{ marginBottom: '1.5rem', opacity: 0.5 }} />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>No news found</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.5 }}>The AI intelligence engine hasn't populated updates for the "{activeCategory}" category yet. Check back later.</p>
                    </div>
                )}
            </div>

            {/* Inline CSS animations */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes pulse {
                    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
                    70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
                    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(-5%); animation-timing-function: cubic-bezier(0.8,0,1,1); }
                    50% { transform: none; animation-timing-function: cubic-bezier(0,0,0.2,1); }
                }
                a.glass-card:hover {
                    border-color: rgba(16, 185, 129, 0.4) !important;
                }
                a.glass-card:hover h3 {
                    color: var(--primary-color) !important;
                }
                a.glass-card:hover img {
                    transform: scale(1.05);
                    transition: transform 1s ease;
                }
                a.glass-card:hover .chevron-btn {
                    background-color: var(--primary-color) !important;
                    color: #fff !important;
                }
            `}} />
        </div>
    );
}
