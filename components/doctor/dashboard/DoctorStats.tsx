import { Users, Calendar, Star, Wallet, TrendingUp } from 'lucide-react';
import { DashboardStats } from '@/lib/api/dashboard';

interface DoctorStatsProps {
    stats: DashboardStats;
}

export default function DoctorStats({ stats }: DoctorStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center text-teal-600">
                        <Calendar className="w-6 h-6" />
                    </div>
                    {/* Placeholder trend */}
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        +12%
                    </span>
                </div>
                <p className="text-sm text-gray-500 mb-1">مواعيد اليوم</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.appointmentsToday}</h3>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                        <Users className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        +5%
                    </span>
                </div>
                <p className="text-sm text-gray-500 mb-1">إجمالي المرضى</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.totalPatients}</h3>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-yellow-600">
                        <Star className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                        {stats.rating.toFixed(1)}/5.0
                    </span>
                </div>
                <p className="text-sm text-gray-500 mb-1">التقييم العام</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.rating.toFixed(1)}</h3>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                        <Wallet className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        +8%
                    </span>
                </div>
                <p className="text-sm text-gray-500 mb-1">أرباح الشهر</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.earningsMonth.toLocaleString()} ر.س</h3>
            </div>
        </div>
    );
}
