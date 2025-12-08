"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Upload, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import React from 'react';

export default function EditArticlePage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    // Unwrap params using React.use() or await in useEffect if not available
    // Since this is a client component receiving a promise, we should use React.use(paramsPromise) if on Next.js 15, or just await it.
    // For safety in diverse Next.js environments:
    const params = React.use(paramsPromise);

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState({
        title_ar: '',
        excerpt_ar: '',
        content_ar: '',
        category: 'General',
        featured_image_url: '',
    });

    useEffect(() => {
        async function fetchArticle() {
            try {
                const supabase = createClient();
                const { data: article, error } = await supabase
                    .from('articles')
                    .select('*')
                    .eq('id', params.id)
                    .single();

                if (error) throw error;
                if (article) {
                    setFormData({
                        title_ar: article.title_ar,
                        excerpt_ar: article.excerpt_ar || '',
                        content_ar: article.content_ar || '',
                        category: article.category || 'General',
                        featured_image_url: article.featured_image_url || '',
                    });
                }
            } catch (error) {
                console.error('Error fetching article:', error);
                toast.error('فشل تحميل بيانات المقال');
                router.push('/doctor-portal/articles');
            } finally {
                setFetching(false);
            }
        }

        fetchArticle();
    }, [params.id, router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        alert("Image upload implementation requires Storage bucket setup. Using placeholder.");
        setFormData(prev => ({
            ...prev,
            featured_image_url: '/images/blog/default.jpg'
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const supabase = createClient();

            const { error } = await supabase
                .from('articles')
                .update({
                    title_ar: formData.title_ar,
                    excerpt_ar: formData.excerpt_ar,
                    content_ar: formData.content_ar,
                    category: formData.category,
                    featured_image_url: formData.featured_image_url,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', params.id);

            if (error) throw error;

            toast.success('تم تحديث المقال بنجاح');
            router.push('/doctor-portal/articles');

        } catch (error: any) {
            console.error(error);
            toast.error(error.message || 'حدث خطأ أثناء تحديث المقال');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">تعديل المقال</h1>
                    <p className="text-gray-500 mt-1">قم بتحديث محتوى مقالك الطبي</p>
                </div>
                <Link href="/doctor-portal/articles">
                    <Button variant="outline" className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        إلغاء
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">عنوان المقال</label>
                        <Input
                            name="title_ar"
                            value={formData.title_ar}
                            onChange={handleInputChange}
                            placeholder="مثال: 5 نصائح للوقاية من السكري..."
                            required
                            className="text-lg"
                        />
                    </div>

                    {/* Category & Image */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">التصنيف</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="w-full h-10 px-3 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                            >
                                <option value="General">عام</option>
                                <option value="Women Health">صحة المرأة</option>
                                <option value="Pregnancy">الحمل والولادة</option>
                                <option value="Nutrition">تغذية</option>
                                <option value="Mental Health">صحة نفسية</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">الصورة البارزة</label>
                            <div className="flex items-center gap-4">
                                {formData.featured_image_url && (
                                    <img src={formData.featured_image_url} alt="Thumbnail" className="w-10 h-10 rounded object-cover" />
                                )}
                                <Button type="button" variant="outline" className="w-full gap-2 relative border-dashed">
                                    <Upload className="w-4 h-4" />
                                    تغيير الصورة
                                    <Input
                                        type="file"
                                        className="opacity-0 absolute inset-0 cursor-pointer"
                                        onChange={handleImageUpload}
                                        disabled
                                    />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Excerpt */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">مقتطف قصير</label>
                        <Textarea
                            name="excerpt_ar"
                            value={formData.excerpt_ar}
                            onChange={handleInputChange}
                            placeholder="اكتب ملخصاً قصيراً للمقال..."
                            maxLength={160}
                            rows={3}
                        />
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">محتوى المقال</label>
                        <Textarea
                            name="content_ar"
                            value={formData.content_ar}
                            onChange={handleInputChange}
                            placeholder="اكتب محتوى المقال هنا..."
                            className="min-h-[400px] font-sans"
                            required
                        />
                    </div>

                    {/* Actions */}
                    <div className="pt-6 border-t border-gray-50 flex items-center justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={() => router.back()}>إلغاء</Button>
                        <Button type="submit" className="bg-teal-600 hover:bg-teal-700 gap-2" disabled={loading}>
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            حفظ التغييرات
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
