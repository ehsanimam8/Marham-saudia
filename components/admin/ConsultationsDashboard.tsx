"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CheckCircle, Clock, Star, TrendingUp, User } from 'lucide-react';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function ConsultationsDashboard({ consultations, stats }: { consultations: any[], stats: any }) {
    const [filter, setFilter] = useState('all');

    const filtered = filter === 'all'
        ? consultations
        : consultations.filter(c => c.status === filter);

    return (
        <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">إجمالي الاستشارات</CardTitle>
                        <Calendar className="w-4 h-4 text-teal-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.overview.total}</div>
                        <p className="text-xs text-gray-400 mt-1">
                            {stats.overview.completed} مكتملة
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">معدل الحل الفوري</CardTitle>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.overview.resolutionRate}%</div>
                        <p className="text-xs text-green-600 mt-1 flex items-center">
                            تم حلها في جلسة واحدة
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">رضا المراجعات</CardTitle>
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.overview.positiveRate}%</div>
                        <p className="text-xs text-gray-400 mt-1">تقييم 5 نجوم كامل</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">مقياس التعاطف</CardTitle>
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.overview.avgEmpathy} / 5</div>
                        <p className="text-xs text-gray-400 mt-1">جودة الاستماع والتواصل</p>
                    </CardContent>
                </Card>
            </div>

            {/* Doctor Leaderboard Section */}
            {stats.leaderboard && stats.leaderboard.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="col-span-1">
                        <CardHeader>
                            <CardTitle>أفضل الطبيبات أداءً</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {stats.leaderboard.map((doc: any, i: number) => (
                                    <div key={doc.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm">
                                                {i + 1}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{doc.name}</p>
                                                <p className="text-xs text-gray-500">{doc.specialty}</p>
                                            </div>
                                        </div>
                                        <div className="text-left">
                                            <div className="flex items-center gap-1 text-sm font-bold text-gray-900">
                                                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                                {doc.rating}
                                            </div>
                                            <p className="text-xs text-gray-400">{doc.consultations} استشارة</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="col-span-1 border-dashed border-2 flex items-center justify-center bg-gray-50">
                        <div className="text-center text-gray-400">
                            <p>مساحة لتحليلات الذكاء الاصطناعي المستقبلية</p>
                            <p className="text-xs mt-2">تحليل النصوص الطبية، الأنماط الشائعة، الخ</p>
                        </div>
                    </Card>
                </div>
            )}

            {/* List Section */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-800">سجل الاستشارات</h2>
                    <div className="flex gap-2">
                        {['all', 'completed', 'pending', 'cancelled'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filter === f
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {f === 'all' ? 'الكل' : f === 'completed' ? 'مكتملة' : f === 'pending' ? 'قادمة' : 'ملغاة'}
                            </button>
                        ))}
                    </div>
                </div>

                <table className="w-full text-right">
                    <thead className="bg-gray-50 text-gray-500 text-sm">
                        <tr>
                            <th className="px-6 py-4 font-medium">الطبيب</th>
                            <th className="px-6 py-4 font-medium">المريض</th>
                            <th className="px-6 py-4 font-medium">الموعد</th>
                            <th className="px-6 py-4 font-medium">المدة</th>
                            <th className="px-6 py-4 font-medium">الحالة</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filtered.length > 0 ? (
                            filtered.map((consultation) => (
                                <tr key={consultation.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="w-8 h-8">
                                                <AvatarFallback className="bg-teal-50 text-teal-700">D</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-bold text-gray-900 text-sm">
                                                    {consultation.doctor?.profiles?.full_name_ar}
                                                </div>
                                                <div className="text-xs text-gray-400">{consultation.doctor?.specialty}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm text-gray-700">{consultation.patient?.profiles?.full_name_ar}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {format(new Date(consultation.appointment_date), 'd MMM yyyy', { locale: arSA })}
                                        <span className="block text-xs text-gray-400">{consultation.start_time}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-mono text-gray-500">
                                        30 دقيقة
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge
                                            variant={
                                                consultation.status === 'completed' ? 'default' :
                                                    consultation.status === 'cancelled' ? 'destructive' : 'secondary'
                                            }
                                            className={
                                                consultation.status === 'completed' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                                                    consultation.status === 'pending' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' : ''
                                            }
                                        >
                                            {consultation.status === 'completed' ? 'مكتملة' :
                                                consultation.status === 'pending' ? 'قادمة' :
                                                    consultation.status === 'cancelled' ? 'ملغاة' : consultation.status}
                                        </Badge>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="py-8 text-center text-gray-500">
                                    لا توجد استشارات مطابقة
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
