'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calendar, FileText, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { signOut } from '@/app/(auth)/actions';

const navigation = [
    { name: 'لوحة التحكم', href: '/dashboard', icon: LayoutDashboard },
    { name: 'مواعيدي', href: '/dashboard/appointments', icon: Calendar },
    { name: 'سجلي الطبي', href: '/dashboard/records', icon: FileText },
    { name: 'الإعدادات', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardSidebar() {
    const pathname = usePathname();

    return (
        <div className="hidden md:flex md:w-64 md:flex-col fixed inset-y-0 right-0 bg-white border-l border-gray-200 pt-16">
            <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
                <div className="flex-1 px-4 py-6 space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    'group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-colors',
                                    isActive
                                        ? 'bg-teal-50 text-teal-700'
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                )}
                            >
                                <item.icon
                                    className={cn(
                                        'ml-3 h-5 w-5 flex-shrink-0',
                                        isActive ? 'text-teal-600' : 'text-gray-400 group-hover:text-gray-500'
                                    )}
                                />
                                {item.name}
                            </Link>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={async () => {
                            await signOut();
                        }}
                        className="flex items-center w-full px-3 py-3 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="ml-3 h-5 w-5" />
                        تسجيل الخروج
                    </button>
                </div>
            </div>
        </div>
    );
}
