import Footer from '@/components/patient/home/Footer';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function HealthPage() {
    const supabase = await createClient();
    const { data: articles } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false }) as any;

    return (
        <div className="min-h-screen bg-gray-50 direction-rtl" dir="rtl">
            <div className="bg-teal-900 text-white py-16">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold mb-4">المكتبة الصحية</h1>
                    <p className="text-teal-100 text-lg max-w-2xl">
                        مصادر طبية موثوقة ومعلومات شاملة عن صحة المرأة، مكتوبة ومراجعة من قبل طبيبات متخصصات.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {articles && articles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {articles.map((article: any) => (
                            <Link href={`/health/${article.slug || article.id}`} key={article.id}>
                                <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden cursor-pointer group">
                                    <div className="relative h-48 w-full bg-gray-200">
                                        {article.featured_image_url ? (
                                            <Image
                                                src={article.featured_image_url}
                                                alt={article.title_ar}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-400">
                                                <span>لا توجد صورة</span>
                                            </div>
                                        )}
                                    </div>
                                    <CardHeader>
                                        <CardTitle className="text-xl line-clamp-2 leading-relaxed text-teal-900">
                                            {article.title_ar}
                                        </CardTitle>
                                        <div className="text-xs text-gray-500 mt-2 flex gap-2">
                                            <span>{article.published_at ? format(new Date(article.published_at), 'd MMMM yyyy', { locale: arSA }) : ''}</span>
                                            {article.category && <span className="text-teal-600 bg-teal-50 px-2 rounded-full">{article.category}</span>}
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-600 line-clamp-3 text-sm">
                                            {article.excerpt_ar || article.content_ar?.substring(0, 150) + '...'}
                                        </p>
                                        <span className="text-teal-600 text-sm font-medium mt-4 block group-hover:underline">
                                            قراءة المزيد ←
                                        </span>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">لا توجد مقالات منشورة حالياً</h3>
                        <p className="text-gray-500">يرجى العودة قريباً للاطلاع على أحدث المقالات الطبية.</p>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
