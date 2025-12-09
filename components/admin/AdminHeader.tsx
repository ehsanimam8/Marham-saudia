"use client";

import { Bell, Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function AdminHeader() {
    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
            <div className="relative w-96">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="بحث عام..."
                    className="w-full h-10 pr-10 pl-4 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            <div className="flex items-center gap-4">
                <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>

                <div className="flex items-center gap-3 border-r border-gray-200 pr-4 mr-2">
                    <div className="text-left hidden sm:block">
                        <p className="text-sm font-medium text-gray-900">Admin User</p>
                        <p className="text-xs text-gray-500">Super Admin</p>
                    </div>
                    <Avatar>
                        <AvatarImage src="/admin-avatar.png" />
                        <AvatarFallback className="bg-indigo-100 text-indigo-600">AD</AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </header>
    );
}
