"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, X, Eye, ExternalLink } from 'lucide-react';
import { publishArticle } from '@/app/actions/admin';
import { toast } from 'sonner';
import Link from 'next/link';

export default function ArticlesTable({ articles }: { articles: any[] }) {
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const handlePublish = async (id: string) => {
        setLoadingId(id);
        try {
            await publishArticle(id);
            toast.success('تم نشر المقال بنجاح');
        } catch (error) {
            toast.error('حدث خطأ');
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-right">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="py-4 px-6 text-sm font-medium text-gray-500">عنوان المقال</th>
                            <th className="py-4 px-6 text-sm font-medium text-gray-500">الكاتب</th>
                            <th className="py-4 px-6 text-sm font-medium text-gray-500">التصنيف</th>
                            <th className="py-4 px-6 text-sm font-medium text-gray-500">الحالة</th>
                            <th className="py-4 px-6 text-sm font-medium text-gray-500">تاريخ الإنشاء</th>
                            <th className="py-4 px-6 text-sm font-medium text-gray-500">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {articles.map((article) => (
                            <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                                <td className="py-4 px-6">
                                    <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{article.title_ar}</h3>
                                </td>
                                <td className="py-4 px-6 text-sm text-gray-600">
                                    د. {article.doctors?.profiles?.full_name_ar}
                                </td>
                                <td className="py-4 px-6 text-sm text-gray-600">
                                    <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                                        {article.category}
                                    </span>
                                </td>
                                <td className="py-4 px-6">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${article.status === 'published'
                                            ? 'bg-green-50 text-green-700 border-green-100'
                                            : 'bg-yellow-50 text-yellow-700 border-yellow-100'
                                        }`}>
                                        {article.status === 'published' ? 'منشور' : 'مسودة / انتظار'}
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-sm text-gray-500">
                                    {new Date(article.created_at).toLocaleDateString('ar-SA')}
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-2">
                                        {article.status !== 'published' && (
                                            <Button
                                                size="icon"
                                                className="h-8 w-8 bg-green-50 text-green-600 hover:bg-green-100 border-green-200"
                                                onClick={() => handlePublish(article.id)}
                                                disabled={loadingId === article.id}
                                                title="نشر"
                                            >
                                                <Check className="w-4 h-4" />
                                            </Button>
                                        )}
                                        <Link href={`/articles/${article.slug}`} target="_blank">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-teal-600">
                                                <ExternalLink className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
