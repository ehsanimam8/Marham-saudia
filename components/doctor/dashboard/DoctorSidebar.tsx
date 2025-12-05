'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calendar, Users, Star, Settings, LogOut, Wallet, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
    { name: 'لوحة التحكم', href: '/doctor/dashboard', icon: LayoutDashboard },
    { name: 'المواعيد', href: '/doctor/dashboard/appointments', icon: Calendar },
    { name: 'جدول العمل', href: '/doctor/dashboard/schedule', icon: Clock },
    { name: 'مرضاي', href: '/doctor/dashboard/patients', icon: Users },
    { name: 'التقييمات', href: '/doctor/dashboard/reviews', icon: Star },
    { name: 'الأرباح', href: '/doctor/dashboard/earnings', icon: Wallet },
    { name: 'الإعدادات', href: '/doctor/dashboard/settings', icon: Settings },
];

import { signOut } from '@/app/auth/actions';

export default function DoctorSidebar() {
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
                        onClick={() => signOut()}
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
