'use client';

import {
    LayoutDashboard,
    Users,
    ShoppingBag,
    Truck,
    CreditCard,
    BarChart3,
    Activity,
    ShieldCheck,
    Settings,
    BellRing,
    X
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AdminSidebarProps {
    isOpen?: boolean;
    setIsOpen?: (val: boolean) => void;
}

export default function AdminSidebar({ isOpen, setIsOpen }: AdminSidebarProps) {
    const pathname = usePathname();

    const menuItems = [
        { name: 'Overview', path: '/admin', icon: LayoutDashboard },
        { name: 'User Management', path: '/admin/users', icon: Users },
        { name: 'Marketplace', path: '/admin/marketplace', icon: ShoppingBag },
        { name: 'Logistics', path: '/admin/logistics', icon: Truck },
        { name: 'Finance', path: '/admin/finance', icon: CreditCard },
        { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
        { name: 'AI Intelligence', path: '/admin/intelligence', icon: Activity },
        { name: 'Compliance & Security', path: '/admin/compliance', icon: ShieldCheck },
        { name: 'Communications', path: '/admin/communications', icon: BellRing },
        { name: 'Settings', path: '/admin/settings', icon: Settings },
    ];

    return (
        <>
            {isOpen && setIsOpen && (
                <div
                    className="mobile-only admin-sidebar-overlay"
                    onClick={() => setIsOpen(false)}
                />
            )}
            <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
                <div className="admin-sidebar-header">
                    <p className="admin-sidebar-label">Enterprise</p>
                    {setIsOpen && (
                        <button className="mobile-only admin-sidebar-close" onClick={() => setIsOpen(false)} aria-label="Close sidebar" title="Close sidebar">
                            <X size={20} />
                        </button>
                    )}
                </div>

                {menuItems.map((item) => {
                    const isActive = pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            onClick={() => setIsOpen && setIsOpen(false)}
                            className={`admin-sidebar-link ${isActive ? 'active' : ''} hover:bg-green-900/10`}
                        >
                            <Icon size={18} />
                            {item.name}
                        </Link>
                    );
                })}
            </aside>
        </>
    );
}
