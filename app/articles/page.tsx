
import Link from 'next/link';
import { Search, Calendar, User, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/server';
import { getArticles } from '@/lib/api/articles';

// Categories for filter
const CATEGORIES = [
    { id: 'all', name: 'الكل' },
    { id: 'General Health', name: 'صحة عامة' },
    { id: 'Pregnancy', name: 'الحمل والولادة' },
    { id: 'Nutrition', name: 'التغذية' },
    { id: 'Mental Health', name: 'الصحة النفسية' },
    { id: 'Women\'s Health', name: 'صحة المرأة' },
];

export default async function ArticlesPage({ searchParams }: { searchParams: { category?: string, q?: string } }) {
    // Await searchParams before using its properties
    const params = await searchParams;
    const category = params?.category || 'all';
    const searchQuery = params?.q || '';

    // Auth client
    const supabase = await createClient();

    const { data: articles } = await getArticles(supabase, {
        category: category,
        search: searchQuery
    });

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-100 py-12 mb-8">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto text-center space-y-4">
                        <h1 className="text-3xl font-bold text-gray-900">المقالات والمحتوى الطبي</h1>
                        <p className="text-gray-500">تصفح مئات المقالات الطبية الموثوقة المكتوبة بواسطة نخبة من الأطباء المتخصصين</p>

                        {/* Search Bar */}
                        <div className="relative mt-6">
                            <form action="/articles" className="relative">
                                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    name="q"
                                    defaultValue={searchQuery}
                                    placeholder="ابحث عن موضوع صحي..."
                                    className="pr-12 h-12 rounded-full border-gray-200 bg-gray-50 focus:bg-white text-lg transition-all"
                                />
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4">
                {/* Categories */}
                <div className="flex flex-wrap gap-2 justify-center mb-10">
                    {CATEGORIES.map(cat => (
                        <Link
                            key={cat.id}
                            href={`/articles?category=${cat.id}`}
                        >
                            <Badge
                                variant={category === cat.id ? "default" : "secondary"}
                                className={`px-4 py-2 text-sm cursor-pointer hover:bg-teal-100 hover:text-teal-700 transition-colors ${category === cat.id ? 'bg-teal-600 hover:bg-teal-700' : 'bg-white text-gray-600 border border-gray-200'
                                    }`}
                            >
                                {cat.name}
                            </Badge>
                        </Link>
                    ))}
                </div>

                {/* Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.length === 0 ? (
                        <div className="col-span-full text-center py-20">
                            <p className="text-gray-500 text-lg">لا توجد مقالات تطابق بحثك حالياً.</p>
                        </div>
                    ) : (
                        articles.map(article => (
                            <Link key={article.id} href={`/articles/${article.slug}`} className="group">
                                <article className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-full flex flex-col">
                                    {/* Thumbnail */}
                                    <div className="aspect-video bg-gray-100 relative overflow-hidden">
                                        {article.featured_image_url ? (
                                            <img
                                                src={article.featured_image_url}
                                                alt={article.title_ar}
                                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-teal-50 text-teal-200">
                                                <span className="text-4xl font-bold">Marham</span>
                                            </div>
                                        )}
                                        <Badge className="absolute top-4 right-4 bg-white/90 text-teal-700 backdrop-blur-sm shadow-sm hover:bg-white">
                                            {article.category}
                                        </Badge>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex-1 flex flex-col">
                                        <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-teal-600 transition-colors">
                                            {article.title_ar}
                                        </h2>
                                        <p className="text-gray-500 text-sm line-clamp-3 mb-4 flex-1">
                                            {article.excerpt_ar}
                                        </p>

                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden">
                                                    {/* Placeholder for doctor image */}
                                                    <div className="w-full h-full flex items-center justify-center bg-teal-100 text-teal-600 text-xs font-bold">
                                                        {article.doctors?.profiles?.full_name_ar?.[0] || 'د'}
                                                    </div>
                                                </div>
                                                <span className="text-xs font-medium text-gray-700">
                                                    د. {article.doctors?.profiles?.full_name_ar}
                                                </span>
                                            </div>
                                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(article.published_at!).toLocaleDateString('ar-SA')}
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
