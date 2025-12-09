import Footer from '@/components/patient/home/Footer';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';
import Image from 'next/image';
import { Calendar, User, Clock, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    // Try finding by ID first (UUID format check could optimize, but this is MVP)
    let query = supabase.from('articles').select('*, doctors(profiles(full_name_ar))').eq('status', 'published');

    // Check if likely UUID
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    if (isUuid) {
        query = query.eq('id', id);
    } else {
        query = query.eq('slug', id);
    }

    const { data: article } = await query.single() as any;

    if (!article) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-white" dir="rtl">
            {/* Header / Hero */}
            <div className="relative h-[400px] w-full bg-gray-900">
                {article.featured_image_url && (
                    <Image
                        src={article.featured_image_url}
                        alt={article.title_ar}
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 container mx-auto">
                    <div className="max-w-4xl">
                        {article.category && (
                            <span className="bg-teal-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">
                                {article.category}
                            </span>
                        )}
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            {article.title_ar}
                        </h1>
                        <div className="flex flex-wrap gap-6 text-gray-200 text-sm md:text-base items-center">
                            {article.doctors?.profiles?.full_name_ar && (
                                <div className="flex items-center gap-2">
                                    <User className="w-5 h-5 text-teal-400" />
                                    <span>د. {article.doctors.profiles.full_name_ar}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-teal-400" />
                                <span>{article.published_at ? format(new Date(article.published_at), 'd MMMM yyyy', { locale: arSA }) : ''}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-teal-400" />
                                <span>{article.read_time_minutes || 5} دقائق قراءة</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-12 flex flex-col lg:flex-row gap-12">
                <div className="lg:w-2/3">
                    <article className="prose prose-lg prose-teal max-w-none prose-headings:text-teal-900 prose-p:text-gray-700 prose-li:text-gray-700">
                        {/* 
                          MVP Note: Assuming content is stored as Markdown or simple HTML. 
                          For security, 'article.content' is rendered directly here if trusted, 
                          but typically use a markdown parser. For MVP assuming safe HTML or plain text.
                        */}
                        <div dangerouslySetInnerHTML={{ __html: article.content_ar?.replace(/\n/g, '<br/>') || '' }} />
                    </article>

                    <div className="mt-12 pt-8 border-t border-gray-100">
                        <h3 className="text-xl font-bold mb-4">شارك المقال</h3>
                        <div className="flex gap-4">
                            <Button variant="outline" className="gap-2 rounded-full">
                                <Share2 className="w-4 h-4" />
                                مشاركة
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:w-1/3 space-y-8">
                    {/* Sticky sidebar content could go here, like 'Book Consultation' CTA */}
                    <div className="bg-teal-50 rounded-2xl p-8 sticky top-24">
                        <h3 className="text-xl font-bold text-teal-900 mb-4">هل تحتاجين استشارة طبية؟</h3>
                        <p className="text-teal-700 mb-6">
                            تحدثي مع طبيبات متخصصات في صحة المرأة بكل خصوصية ومن منزلك.
                        </p>
                        <Button className="w-full bg-teal-600 hover:bg-teal-700 h-12 text-lg">
                            احجزي موعد الآن
                        </Button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
