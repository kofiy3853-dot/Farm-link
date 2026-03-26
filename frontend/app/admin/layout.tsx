'use client';

import { ReactNode, useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Menu } from 'lucide-react';

export default function AdminLayout({ children }: { children: ReactNode }) {
    const { user, isAuthenticated, isLoading } = useAuthStore();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                router.push('/login');
            } else if (user?.role !== 'ADMIN') {
                router.push('/');
            }
        }
    }, [isAuthenticated, user, isLoading, router]);

    if (isLoading || !isAuthenticated || user?.role !== 'ADMIN') {
        return null; // Or a loading spinner
    }

    return (
        <div className="d-flex min-h-content">
            <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <main className="flex-1 bg-main overflow-y-auto">
                <div className="mobile-only p-6 border-b items-center gap-4">
                    <button 
                        onClick={() => setIsSidebarOpen(true)} 
                        className="bg-transparent border-none text-main cursor-pointer d-flex items-center"
                        title="Open Sidebar"
                        aria-label="Open Sidebar"
                    >
                        <Menu size={24} />
                    </button>
                    <h2 className="text-lg font-bold">Admin Panel</h2>
                </div>
                {children}
            </main>
        </div>
    );
}
