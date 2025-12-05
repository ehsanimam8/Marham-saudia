
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Save, Globe, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('@/components/editor/RichTextEditor'), { ssr: false });

// Mock categories for MVP
const CATEGORIES = [
    'General Health',
    'Pregnancy',
    'Nutrition',
    'Mental Health',
    'Fitness',
    'Pediatrics',
    'Women\'s Health'
];

export default function NewArticlePage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [lang, setLang] = useState<'ar' | 'en'>('ar');

    const [formData, setFormData] = useState({
        title_ar: '',
        title_en: '',
        content_ar: '',
        content_en: '',
        excerpt_ar: '',
        excerpt_en: '',
        category: '',
        featured_image_url: '',
        keywords: '', // Comma separated
    });

    const updateFormData = (data: Partial<typeof formData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const handleSubmit = async (status: 'draft' | 'published') => {
        setIsSubmitting(true);
        try {
            // Note: In a real app we would use a Server Action here.
            // For now, let's simulate functionality or call a placeholder action.
            // We should ideally create 'createArticle' in an action file.
            // But for this step let's just log and redirect, 
            // or better yet, implement the server action next.
            console.log('Saving article:', { ...formData, status });

            // Simulate delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            router.push('/doctor/dashboard/articles');
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Failed to save article');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowRight className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">مقال جديد</h1>
                        <p className="text-gray-500 mt-1">اكتب مقالاً طبياً جديداً</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={() => handleSubmit('draft')}
                        disabled={isSubmitting}
                    >
                        حفظ كمسودة
                    </Button>
                    <Button
                        className="bg-teal-600 hover:bg-teal-700 gap-2"
                        onClick={() => handleSubmit('published')}
                        disabled={isSubmitting}
                    >
                        <Globe className="w-4 h-4" />
                        نشر الآن
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content (Left/Center) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Language Toggler */}
                    <div className="bg-white p-1 rounded-lg border border-gray-200 inline-flex">
                        <button
                            onClick={() => setLang('ar')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${lang === 'ar' ? 'bg-teal-100 text-teal-700' : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            العربية
                        </button>
                        <button
                            onClick={() => setLang('en')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${lang === 'en' ? 'bg-teal-100 text-teal-700' : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            English
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
                        {lang === 'ar' ? (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="title_ar">عنوان المقال (بالعربية)</Label>
                                    <Input
                                        id="title_ar"
                                        placeholder="مثال: كيفية التعامل مع الصداع النصفي"
                                        value={formData.title_ar}
                                        onChange={e => updateFormData({ title_ar: e.target.value })}
                                        dir="rtl"
                                        className="text-lg font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>محتوى المقال (بالعربية)</Label>
                                    <RichTextEditor
                                        content={formData.content_ar}
                                        onChange={(html) => updateFormData({ content_ar: html })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="excerpt_ar">مقتطف قصير (للعرض في القوائم)</Label>
                                    <textarea
                                        id="excerpt_ar"
                                        rows={3}
                                        className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        value={formData.excerpt_ar}
                                        onChange={e => updateFormData({ excerpt_ar: e.target.value })}
                                        dir="rtl"
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="title_en">Article Title (English)</Label>
                                    <Input
                                        id="title_en"
                                        placeholder="e.g. How to deal with Migraines"
                                        value={formData.title_en}
                                        onChange={e => updateFormData({ title_en: e.target.value })}
                                        dir="ltr"
                                        className="text-lg font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Article Content (English)</Label>
                                    <RichTextEditor
                                        content={formData.content_en}
                                        onChange={(html) => updateFormData({ content_en: html })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="excerpt_en">Short Excerpt</Label>
                                    <textarea
                                        id="excerpt_en"
                                        rows={3}
                                        className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        value={formData.excerpt_en}
                                        onChange={e => updateFormData({ excerpt_en: e.target.value })}
                                        dir="ltr"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Sidebar Settings (Right) */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                        <div className="space-y-2">
                            <Label>صورة الغلاف</Label>
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                                <ImageIcon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                <span className="text-sm text-gray-500">اضغط لرفع صورة</span>
                            </div>
                            <Input
                                placeholder="أو أدخل رابط الصورة"
                                value={formData.featured_image_url}
                                onChange={e => updateFormData({ featured_image_url: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">التصنيف</Label>
                            <select
                                id="category"
                                className="w-full h-10 px-3 rounded-md border border-input bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                value={formData.category}
                                onChange={e => updateFormData({ category: e.target.value })}
                            >
                                <option value="">اختر تصنيفاً</option>
                                {CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="keywords">الكلمات المفتاحية</Label>
                            <Input
                                id="keywords"
                                placeholder="مثال: صداع، أعصاب، تغذية (فصل بفاصلة)"
                                value={formData.keywords}
                                onChange={e => updateFormData({ keywords: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                        <h4 className="font-bold text-blue-900 text-sm mb-2">نصائح للكتابة</h4>
                        <ul className="list-disc list-inside text-xs text-blue-700 space-y-1">
                            <li>استخدم لغة بسيطة ومفهومة للمرضى.</li>
                            <li>تأكد من دقة المعلومات الطبية.</li>
                            <li>أضف صوراً توضيحية إن أمكن.</li>
                            <li>راجع المقال لغوياً قبل النشر.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
