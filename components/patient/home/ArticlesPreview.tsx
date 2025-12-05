import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getArticles } from '@/lib/api/articles';

import { createClient } from '@/lib/supabase/server';

export default async function ArticlesPreview() {
    const supabase = await createClient();
    // Fetch 3 latest articles
    const { data: articles } = await getArticles(supabase, { limit: 3 });

    if (!articles || articles.length === 0) {
        return null;
    }

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">مقالات صحية</h2>
                        <p className="text-gray-500">معلومات طبية موثوقة من طبيباتنا</p>
                    </div>
                    <Link href="/articles" className="text-teal-600 hover:text-teal-700 font-semibold hidden md:block">
                        تصفح المكتبة الصحية ←
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {articles.map((article) => (
                        <Link
                            key={article.id}
                            href={`/articles/${article.slug}`}
                            className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                        >
                            <div className="h-48 bg-gradient-to-br from-teal-50 to-emerald-50 relative">
                                {article.featured_image_url ? (
                                    <img
                                        src={article.featured_image_url}
                                        alt={article.title_ar}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-teal-400">
                                        <span className="text-4xl">📄</span>
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-teal-600">
                                    {article.category}
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="font-bold text-lg text-gray-900 mb-3 group-hover:text-teal-600 transition-colors line-clamp-2">
                                    {article.title_ar}
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">
                                    {article.excerpt_ar}
                                </p>
                                <div className="flex items-center text-teal-600 text-sm font-medium">
                                    اقرأ المزيد <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="text-center mt-8 md:hidden">
                    <Link href="/articles" className="text-teal-600 hover:text-teal-700 font-semibold">
                        تصفح المكتبة الصحية ←
                    </Link>
                </div>
            </div>
        </section>
    );
}
