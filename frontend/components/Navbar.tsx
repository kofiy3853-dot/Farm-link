'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Leaf, LogOut, Search, ChevronDown, LayoutDashboard, Package, ShieldAlert, Menu, X, Truck } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import NotificationBell from './NotificationBell';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const profileRef = useRef<HTMLDivElement>(null);

    const { user, isAuthenticated, logout, initAuth } = useAuthStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        initAuth();
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [initAuth]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!mounted) return <nav className="glass-nav nav-placeholder"></nav>;

    const handleLogout = () => {
        logout();
        setIsProfileOpen(false);
        router.push('/');
    };

    const centerLinks = [
        { name: 'Home', path: '/' },
        { name: 'Marketplace', path: '/marketplace' },
        { name: 'Farmers', path: '/farmers' },
        { name: 'Buyers', path: '/buyers' },
        { name: 'Logistics', path: '/logistics' },
        { name: 'Agric-News', path: '/agric-news' },
        { name: 'About', path: '/about' },
    ];

    return (
        <nav className={`glass-nav ${isScrolled ? 'scrolled' : ''}`}>
            <div className="nav-container">

                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                        className="nav-mobile-btn mobile-only"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle mobile menu"
                        title="Toggle mobile menu"
                    >
                        <Menu size={24} />
                    </button>
                    <Link href="/" className="nav-logo group">
                        <Leaf className="logo-icon" />
                        <span className="logo-text" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>FarmLink</span>
                    </Link>
                </div>

                {/* Center Navigation */}
                <div className="nav-links desktop-only">
                    {centerLinks.map((link) => {
                        const isActive = pathname === link.path || pathname.startsWith(link.path + '/');
                        // Exact match for home, partial for others
                        const isReallyActive = link.path === '/' ? pathname === '/' : isActive;

                        return (
                            <Link
                                key={link.path}
                                href={link.path}
                                className={`nav-link ${isReallyActive ? 'active' : ''}`}
                            >
                                <span>{link.name}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* Right Section */}
                <div className="nav-actions desktop-only">

                    {/* Search Bar */}
                    <div className="nav-search-wrapper">
                        <Search size={16} className="nav-search-icon" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="input-field nav-search-input"
                        />
                    </div>

                    {isAuthenticated ? (
                        <>
                            <NotificationBell />

                            {/* Profile Dropdown */}
                            <div style={{ position: 'relative' }} ref={profileRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="nav-profile-toggle"
                                    aria-label="Toggle profile menu"
                                    title="Toggle profile menu"
                                >
                                    <div className="user-avatar">
                                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <ChevronDown size={14} color="var(--text-muted)" />
                                </button>

                                {isProfileOpen && (
                                    <div className="glass-card nav-profile-dropdown">
                                        <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.25rem' }}>
                                            <p style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.875rem' }}>{user?.name}</p>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'capitalize' }}>{user?.role.toLowerCase()}</p>
                                        </div>

                                        {user?.role === 'FARMER' && (
                                            <Link href="/dashboard" onClick={() => setIsProfileOpen(false)} className="nav-dropdown-item">
                                                <LayoutDashboard size={16} /> Dashboard
                                            </Link>
                                        )}
                                        {user?.role === 'LOGISTICS' && (
                                            <Link href="/logistics-dashboard" onClick={() => setIsProfileOpen(false)} className="nav-dropdown-item">
                                                <Truck size={16} /> Fleet Terminal
                                            </Link>
                                        )}
                                        {user?.role === 'ADMIN' && (
                                            <Link href="/admin" onClick={() => setIsProfileOpen(false)} className="nav-dropdown-item danger">
                                                <ShieldAlert size={16} /> Admin Panel
                                            </Link>
                                        )}
                                        <Link href="/orders" onClick={() => setIsProfileOpen(false)} className="nav-dropdown-item">
                                            <Package size={16} /> My Orders
                                        </Link>
                                        <Link href="/disputes" onClick={() => setIsProfileOpen(false)} className="nav-dropdown-item warning">
                                            <ShieldAlert size={16} /> Dispute Center
                                        </Link>

                                        <button onClick={handleLogout} className="nav-dropdown-item danger">
                                            <LogOut size={16} /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="nav-auth-buttons">
                            <Link href="/login" className="btn-outline nav-auth-btn borderless">Login</Link>
                            <Link href="/register" className="btn-primary nav-auth-btn rounded">Register</Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            <div className={`mobile-nav-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                    <span className="logo-text" style={{ fontSize: '1.25rem', fontWeight: 800 }}>Menu</span>
                    <button aria-label="Close menu" title="Close menu" onClick={() => setIsMobileMenuOpen(false)} className="nav-mobile-close">
                        <X size={24} />
                    </button>
                </div>

                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {centerLinks.map((link) => (
                        <Link
                            key={`mobile-${link.path}`}
                            href={link.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`mobile-nav-link ${pathname === link.path ? 'active' : ''}`}
                        >
                            {link.name}
                        </Link>
                    ))}

                    {!isAuthenticated && (
                        <div className="mobile-auth-buttons">
                            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="btn-outline mobile-btn">Login</Link>
                            <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="btn-primary mobile-btn">Register</Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Overlay */}
            {
                isMobileMenuOpen && (
                    <div
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="mobile-menu-overlay"
                    />
                )
            }
        </nav >
    );
}
