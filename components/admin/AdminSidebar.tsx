"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Stethoscope, FileText, Settings, LogOut, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const sidebarItems = [
    {
        title: 'لوحة التحكم',
        href: '/admin/dashboard',
        icon: LayoutDashboard
    },
    {
        title: 'الطبيبات',
        href: '/admin/doctors',
        icon: Stethoscope
    },
    {
        title: 'المقالات',
        href: '/admin/articles',
        icon: FileText
    },
    {
        title: 'الاستشارات',
        href: '/admin/consultations',
        icon: Stethoscope // Reusing Stethoscope for now or Calendar/MessageCircle
    },
    {
        title: 'المستخدمين',
        href: '/admin/users',
        icon: Users
    },
    {
        title: 'الموسوعة الطبية',
        href: '/admin/encyclopedia',
        icon: FileText
    },
    {
        title: 'إعدادات',
        href: '/admin/settings',
        icon: Settings
    }
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/admin/login');
    };

    return (
        <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col fixed right-0 top-0 h-full overflow-y-auto z-50 shadow-xl">
            <div className="p-6 border-b border-slate-800 flex flex-col items-center justify-center gap-4 py-8">
                <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center font-bold text-white text-3xl shadow-lg shadow-indigo-500/30">
                    M
                </div>
                <span className="text-xl font-bold tracking-wide">لوحة الإدارة</span>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-indigo-600 text-white"
                                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.title}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-3 py-3 w-full rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-slate-800 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    تسجيل الخروج
                </button>
            </div>
        </aside>
    );
}
