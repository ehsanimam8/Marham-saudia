import { getAdminStats } from '@/lib/api/admin';
import { createClient } from '@/lib/supabase/server';
import { Stethoscope, FileText, Users, Activity } from 'lucide-react';

export default async function AdminDashboardPage() {
    const supabase = await createClient();
    const stats = await getAdminStats(supabase);

    const statCards = [
        {
            title: 'إجمالي الطبيبات',
            value: stats.doctorsTotal,
            sub: `${stats.doctorsPending} في الانتظار`,
            icon: Stethoscope,
            color: 'bg-blue-500'
        },
        {
            title: 'المقالات الطبية',
            value: stats.articlesTotal,
            sub: `${stats.articlesPublished} منشور`,
            icon: FileText,
            color: 'bg-green-500'
        },
        {
            title: 'المستخدمين',
            value: '-',
            sub: 'بيانات تقريبية',
            icon: Users,
            color: 'bg-orange-500'
        },
        {
            title: 'الزيارات',
            value: '2.4k',
            sub: '+12% هذا الأسبوع',
            icon: Activity,
            color: 'bg-purple-500'
        }
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">نظرة عامة</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg ${stat.color} bg-opacity-10 flex items-center justify-center`}>
                            <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                            <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions or Recent Activity could go here */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-64 flex items-center justify-center text-gray-400">
                    مخطط بياني (قريباً)
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-64 flex items-center justify-center text-gray-400">
                    آخر النشاطات (قريباً)
                </div>
            </div>
        </div>
    );
}
