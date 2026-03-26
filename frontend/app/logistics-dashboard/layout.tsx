import Link from 'next/link';
import { Truck, User, Navigation, LayoutDashboard, LogOut, Map } from 'lucide-react';

export default function LogisticsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
            {/* Sidebar Navigation */}
            <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent flex items-center gap-2">
                        <Truck size={24} className="text-emerald-500" />
                        FleetHub
                    </h2>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/logistics-dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">
                        <LayoutDashboard size={20} />
                        <span className="font-medium">Dashboard</span>
                    </Link>

                    <Link href="/insights/heatmap" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">
                        <Map size={20} />
                        <span className="font-medium">Demand Heatmap</span>
                    </Link>

                    <Link href="/logistics-dashboard/routes" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">
                        <Navigation size={20} />
                        <span className="font-medium">Active Routes</span>
                    </Link>

                    <Link href="/logistics-dashboard/fleet" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">
                        <Truck size={20} />
                        <span className="font-medium">Fleet Management</span>
                    </Link>

                    <Link href="/logistics-dashboard/profile" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">
                        <User size={20} />
                        <span className="font-medium">Company Profile</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors">
                        <LogOut size={20} />
                        <span className="font-medium">Exit Terminal</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
