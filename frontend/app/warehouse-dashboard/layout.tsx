import Link from 'next/link';
import { Warehouse, Archive, LogOut, LayoutDashboard } from 'lucide-react';

export default function WarehouseLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
            {/* Sidebar Navigation */}
            <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent flex items-center gap-2">
                        <Warehouse size={24} className="text-blue-500" />
                        StorageOS
                    </h2>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/warehouse-dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-500 transition-colors">
                        <LayoutDashboard size={20} />
                        <span className="font-medium">Capacity Dashboard</span>
                    </Link>

                    <Link href="/warehouse-dashboard/inventory" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-500 transition-colors">
                        <Archive size={20} />
                        <span className="font-medium">Inventory Logs</span>
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
