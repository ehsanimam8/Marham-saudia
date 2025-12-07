"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export default function UsersManagementPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const supabase = createClient();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        // Fetch only patients
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('role', 'patient')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setUsers(data);
        }
        setLoading(false);
    };

    const filteredUsers = users.filter(user =>
        user.full_name_ar?.includes(search) ||
        user.full_name_en?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">إدارة المستخدمين</h1>
                <div className="relative w-64">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="بحث بالاسم أو البريد..."
                        className="w-full pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-right">
                    <thead className="bg-gray-50 text-gray-500 text-sm">
                        <tr>
                            <th className="px-6 py-4 font-medium">المستخدم</th>
                            <th className="px-6 py-4 font-medium">نوع الحساب</th>
                            <th className="px-6 py-4 font-medium">تاريخ التسجيل</th>
                            <th className="px-6 py-4 font-medium">الحالة</th>
                            <th className="px-6 py-4 font-medium">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="py-8 text-center text-gray-500">
                                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                                    جاري التحميل...
                                </td>
                            </tr>
                        ) : filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="w-8 h-8">
                                                <AvatarFallback>{user.full_name_ar?.[0] || 'U'}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-bold text-gray-900 border-none bg-transparent">
                                                    {user.full_name_ar || user.full_name_en || 'مستخدم غير معروف'}
                                                </div>
                                                <div className="text-xs text-gray-400 font-sans">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant={user.role === 'doctor' ? 'default' : user.role === 'admin' ? 'destructive' : 'secondary'} className="px-3">
                                            {user.role === 'doctor' ? 'طبيب' : user.role === 'admin' ? 'مسؤول' : 'مريض'}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {user.created_at ? format(new Date(user.created_at), 'yyyy/MM/dd') : '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">
                                            نشط
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-600">
                                            حظر
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="py-8 text-center text-gray-500">
                                    لا يوجد مستخدمين
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
