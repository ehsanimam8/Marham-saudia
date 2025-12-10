
import { createClient } from '@/lib/supabase/server';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
    const supabase = await createClient();

    // Fetch profiles (which represent users)
    const { data: users } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">إدارة المستخدمين</h1>
                <p className="text-gray-500 mt-1">عرض جميع المستخدمين المسجلين (مرضى وأطباء)</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                <table className="w-full text-right">
                    <thead className="bg-gray-50 text-gray-500 text-sm">
                        <tr>
                            <th className="px-6 py-4 font-medium">الاسم</th>
                            <th className="px-6 py-4 font-medium">الدور</th>
                            <th className="px-6 py-4 font-medium">المدينة</th>
                            <th className="px-6 py-4 font-medium">تاريخ التسجيل</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users?.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="w-8 h-8">
                                            <AvatarFallback className="bg-indigo-50 text-indigo-700">
                                                {user.full_name_en?.[0] || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-bold text-gray-900 text-sm">
                                                {user.full_name_ar || 'مستخدم غير معروف'}
                                            </div>
                                            <div className="text-xs text-gray-400">{user.email} (Auth ID: {user.id.substring(0, 6)}...)</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <Badge variant={user.role === 'doctor' ? 'default' : 'secondary'}>
                                        {user.role === 'doctor' ? 'طبيب' : user.role === 'admin' ? 'مدير' : 'مريض'}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {user.city || '-'}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {user.created_at ? format(new Date(user.created_at), 'd MMM yyyy', { locale: arSA }) : '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
