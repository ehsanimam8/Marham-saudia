import { Calendar, Clock, FileText, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">مرحباً، سارة 👋</h1>
                <p className="text-gray-500 mt-1">هنا نظرة عامة على حالتك الصحية ومواعيدك القادمة</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center text-teal-600">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">المواعيد القادمة</p>
                            <p className="text-2xl font-bold text-gray-900">2</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">التقارير الطبية</p>
                            <p className="text-2xl font-bold text-gray-900">5</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                            <Activity className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">الزيارات المكتملة</p>
                            <p className="text-2xl font-bold text-gray-900">12</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Next Appointment Card */}
            <div className="bg-gradient-to-br from-teal-600 to-pink-600 rounded-2xl p-8 text-white">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium mb-4">
                            <Clock className="w-4 h-4" />
                            الموعد القادم: غداً، 10:30 صباحاً
                        </div>
                        <h2 className="text-2xl font-bold mb-2">استشارة متابعة مع د. نورا الراشد</h2>
                        <p className="text-teal-100">استشارة فيديو • 30 دقيقة</p>
                    </div>
                    <Button className="bg-white text-teal-600 hover:bg-gray-50 border-0" size="lg">
                        دخول غرفة الانتظار
                    </Button>
                </div>
            </div>

            {/* Recent Activity / Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-900 mb-4">إجراءات سريعة</h3>
                    <div className="space-y-3">
                        <Link href="/doctors" className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                            <span className="font-medium text-gray-700">حجز موعد جديد</span>
                            <span className="text-gray-400">←</span>
                        </Link>
                        <Link href="/dashboard/records" className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                            <span className="font-medium text-gray-700">عرض نتائج التحاليل</span>
                            <span className="text-gray-400">←</span>
                        </Link>
                        <Link href="/dashboard/settings" className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                            <span className="font-medium text-gray-700">تحديث الملف الشخصي</span>
                            <span className="text-gray-400">←</span>
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-900 mb-4">نصائح صحية لك</h3>
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0"></div>
                            <div>
                                <h4 className="font-bold text-gray-900 mb-1">أهمية الفيتامينات أثناء الحمل</h4>
                                <p className="text-sm text-gray-500 line-clamp-2">تعرفي على أهم الفيتامينات والمعادن التي تحتاجينها لضمان صحتك وصحة جنينك.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0"></div>
                            <div>
                                <h4 className="font-bold text-gray-900 mb-1">تمارين رياضية آمنة</h4>
                                <p className="text-sm text-gray-500 line-clamp-2">دليل شامل للتمارين الرياضية المناسبة لكل مرحلة من مراحل حياتك.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
