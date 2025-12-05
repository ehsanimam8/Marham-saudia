
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, User, Clock, Share2, Facebook, Twitter, Linkedin, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getArticleBySlug } from '@/lib/api/articles';
import { Metadata } from 'next';

export async function generateMetadata({ params: paramsPromise }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const params = await paramsPromise;
    const article = await getArticleBySlug(params.slug);

    if (!article) {
        return {
            title: 'المقال غير موجود',
        };
    }

    return {
        title: `${article.title_ar} | مرهم السعودية`,
        description: article.excerpt_ar,
    };
}

export default async function ArticlePage({ params: paramsPromise }: { params: Promise<{ slug: string }> }) {
    const params = await paramsPromise;
    const article = await getArticleBySlug(params.slug);

    if (!article) {
        notFound();
    }

    // Parse keywords
    const keywords = article.keywords || [];

    return (
        <article className="min-h-screen bg-white pb-20">
            {/* Hero Section */}
            <div className="bg-teal-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-teal-900 via-teal-800 to-emerald-900 opacity-90" />
                <div className="container mx-auto px-4 relative z-10 py-16 md:py-24">
                    <div className="max-w-4xl mx-auto text-center space-y-6">
                        <Link href="/articles" className="inline-flex items-center text-teal-200 hover:text-white transition-colors mb-4">
                            <ArrowLeft className="w-4 h-4 ml-2" />
                            عودة للمقالات
                        </Link>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                            {article.title_ar}
                        </h1>
                        <div className="flex flex-wrap items-center justify-center gap-6 text-teal-100 text-sm">
                            <div className="flex items-center gap-2">
                                <Avatar className="w-8 h-8 border-2 border-teal-400">
                                    <AvatarFallback>{article.doctors?.profiles?.full_name_ar?.[0]}</AvatarFallback>
                                </Avatar>
                                <span>د. {article.doctors?.profiles?.full_name_ar}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(article.published_at!).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{article.read_time_minutes || 5} دقائق قراءة</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-10 relative z-20">
                <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    {/* Featured Image */}
                    {article.featured_image_url && (
                        <div className="relative aspect-[21/9] w-full bg-gray-100">
                            <img
                                src={article.featured_image_url}
                                alt={article.title_ar}
                                className="object-cover w-full h-full"
                            />
                        </div>
                    )}

                    <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Main Content */}
                        <div className="lg:col-span-8 space-y-8">
                            {/* Prose Content */}
                            <div
                                className="prose prose-lg prose-purple max-w-none text-gray-800 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: article.content_ar }}
                            />

                            {/* Tags */}
                            {keywords.length > 0 && (
                                <div className="pt-8 border-t border-gray-100">
                                    <h3 className="text-sm font-bold text-gray-900 mb-3">مواضيع ذات صلة:</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {keywords.map(keyword => (
                                            <span key={keyword} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 cursor-pointer transition-colors">
                                                #{keyword.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <aside className="lg:col-span-4 space-y-8">
                            {/* Author Card */}
                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 sticky top-24">
                                <div className="flex items-center gap-4 mb-4">
                                    <Avatar className="w-16 h-16">
                                        <AvatarFallback className="text-xl bg-teal-100 text-teal-600">
                                            {article.doctors?.profiles?.full_name_ar?.[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg">د. {article.doctors?.profiles?.full_name_ar}</h3>
                                        <p className="text-teal-600 text-sm font-medium">{article.doctors?.specialty}</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                                    طبيب متخصص في {article.doctors?.specialty}. يشارك مقالات طبية لتوعية المجتمع.
                                </p>
                                <Button className="w-full bg-teal-600 hover:bg-teal-700">
                                    حجز موعد
                                </Button>

                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <p className="text-sm font-bold text-gray-900 mb-3">شارك المقال</p>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="icon" className="rounded-full hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200">
                                            <Twitter className="w-4 h-4" />
                                        </Button>
                                        <Button variant="outline" size="icon" className="rounded-full hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200">
                                            <Facebook className="w-4 h-4" />
                                        </Button>
                                        <Button variant="outline" size="icon" className="rounded-full hover:bg-blue-50 hover:text-blue-800 hover:border-blue-200">
                                            <Linkedin className="w-4 h-4" />
                                        </Button>
                                        <Button variant="outline" size="icon" className="rounded-full hover:bg-gray-100">
                                            <Share2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </article>
    );
}
