"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Upload, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function NewArticlePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title_ar: '',
        excerpt_ar: '',
        content_ar: '',
        category: 'General',
        featured_image_url: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Placeholder for image upload logic
        // Ideally upload to storage bucket
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

            // Get current user (doctor)
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            // Get doctor profile ID
            const { data: doctor, error: doctorError } = await supabase
                .from('doctors')
                .select('id')
                .eq('profile_id', user.id)
                .single();

            if (doctorError || !doctor) throw new Error("Doctor profile not found");

            // Insert Article
            const { error } = await supabase
                .from('articles')
                .insert({
                    title_ar: formData.title_ar,
                    // Temporarily using title as slug (url-encoded)
                    slug: formData.title_ar.replace(/\s+/g, '-'),
                    excerpt_ar: formData.excerpt_ar,
                    content_ar: formData.content_ar,
                    category: formData.category,
                    featured_image_url: formData.featured_image_url,
                    author_id: doctor.id,
                    reviewed_by_doctor_id: doctor.id, // Author is the reviewer/writer
                    status: 'published', // Review logic can be added later
                    published_at: new Date().toISOString(),
                });

            if (error) throw error;

            toast.success('تم نشر المقال بنجاح');
            router.push('/doctor-portal/articles');

        } catch (error: any) {
            console.error(error);
            toast.error(error.message || 'حدث خطأ أثناء نشر المقال');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">كتابة مقال جديد</h1>
                    <p className="text-gray-500 mt-1">شارك خبرتك الطبية مع المجتمع</p>
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
                                <Button type="button" variant="outline" className="w-full gap-2 relative border-dashed">
                                    <Upload className="w-4 h-4" />
                                    رفع صورة
                                    <Input
                                        type="file"
                                        className="opacity-0 absolute inset-0 cursor-pointer"
                                        onChange={handleImageUpload}
                                        disabled
                                    />
                                </Button>
                                <span className="text-xs text-gray-400">(معطل مؤقتاً)</span>
                            </div>
                        </div>
                    </div>

                    {/* Excerpt */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">مقتطف قصير (للعرض في القائمة)</label>
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
                        <p className="text-xs text-gray-400 text-left dir-ltr">Supports HTML (Basic)</p>
                    </div>

                    {/* Actions */}
                    <div className="pt-6 border-t border-gray-50 flex items-center justify-end gap-3">
                        <Button type="button" variant="ghost">حفظ كمسودة</Button>
                        <Button type="submit" className="bg-teal-600 hover:bg-teal-700 gap-2" disabled={loading}>
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            نشر المقال
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
