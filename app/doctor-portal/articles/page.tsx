
import Link from 'next/link';
import { Plus, Search, FileText, Globe, Clock, MoreVertical, Edit, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/server';
import { getDoctorProfile } from '@/lib/api/doctors';
import { getDoctorArticles } from '@/lib/api/articles';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default async function ArticlesDashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // We assume middleware/layout ensures user is logged in
    // But getting profile is needed for ID
    const doctor = await getDoctorProfile(supabase, user?.id!);
    const articles = await getDoctorArticles(supabase, doctor?.id!);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">المقالات والمحتوى</h1>
                    <p className="text-gray-500 mt-1">أدر مقالاتك الطبية وشارك معرفتك مع المرضى</p>
                </div>
                <Link href="/doctor-portal/articles/new">
                    <Button className="bg-teal-600 hover:bg-teal-700 gap-2">
                        <Plus className="w-4 h-4" />
                        مقال جديد
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="بحث في المقالات..."
                        className="pr-9 border-gray-200 bg-gray-50 focus:bg-white"
                    />
                </div>
                <div className="flex gap-2">
                    <select className="h-10 px-3 rounded-md border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600">
                        <option value="all">كل الحالات</option>
                        <option value="published">منشور</option>
                        <option value="draft">مسودة</option>
                    </select>
                </div>
            </div>

            {/* Articles List */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="py-4 px-6 text-sm font-medium text-gray-500">العنوان</th>
                                <th className="py-4 px-6 text-sm font-medium text-gray-500">الحالة</th>
                                <th className="py-4 px-6 text-sm font-medium text-gray-500">التصنيف</th>
                                <th className="py-4 px-6 text-sm font-medium text-gray-500">المشاهدات</th>
                                <th className="py-4 px-6 text-sm font-medium text-gray-500">تاريخ النشر</th>
                                <th className="py-4 px-6 text-sm font-medium text-gray-500">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {articles.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-gray-500">
                                        <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                        <p>ليس لديك مقالات بعد. ابدأ بكتابة مقالك الأول!</p>
                                    </td>
                                </tr>
                            ) : (
                                articles.map((article) => (
                                    <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                {article.featured_image_url ? (
                                                    <img
                                                        src={article.featured_image_url}
                                                        alt={article.title_ar}
                                                        className="w-10 h-10 rounded-lg object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-200">
                                                        <FileText className="w-5 h-5" />
                                                    </div>
                                                )}
                                                <div>
                                                    <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{article.title_ar}</h3>
                                                    <p className="text-xs text-gray-400 line-clamp-1">{article.excerpt_ar}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${article.status === 'published'
                                                ? 'bg-green-50 text-green-700 border-green-100'
                                                : 'bg-yellow-50 text-yellow-700 border-yellow-100'
                                                }`}>
                                                {article.status === 'published' ? (
                                                    <Globe className="w-3 h-3" />
                                                ) : (
                                                    <Clock className="w-3 h-3" />
                                                )}
                                                {article.status === 'published' ? 'منشور' : 'مسودة'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                                                {article.category || 'عام'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-1 text-sm text-gray-600">
                                                <Eye className="w-4 h-4 text-gray-400" />
                                                {article.views || 0}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-sm text-gray-500">
                                                {article.published_at
                                                    ? new Date(article.published_at).toLocaleDateString('ar-SA')
                                                    : '-'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <Link href={`/doctor-portal/articles/edit/${article.id}`}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-teal-600">
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-teal-600">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
