import { createClient } from '@/lib/supabase/server';
import { getSymptoms } from '@/lib/api/encyclopedia';
import Link from 'next/link';
import { Search, ChevronLeft, Activity, Thermometer, Brain } from 'lucide-react';

export const metadata = {
    title: 'مشخص الأعراض | مرهم السعودية',
    description: 'ابحث عن أعراضك واكتشف الأسباب المحتملة والأطباء المناسبين.',
};

export default async function SymptomsIndex() {
    const supabase = await createClient();
    const symptoms = await getSymptoms(supabase);

    return (
        <div className="min-h-screen bg-gray-50 pb-20" dir="rtl">
            {/* Hero Section */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl font-bold text-gray-900 mb-6">بماذا تشعر اليوم؟</h1>
                        <p className="text-xl text-gray-500 mb-10 leading-relaxed">
                            استخدم دليل الأعراض للبحث عن حالتك الصحية وفهم الأسباب المحتملة، ثم تواصل مع الطبيب المختص مباشرة.
                        </p>

                        <div className="relative max-w-2xl">
                            <input
                                type="text"
                                placeholder="ابحث عن عرض (مثلاً: صداع، حمى، ألم بطن...)"
                                className="w-full py-4 px-6 pr-12 rounded-2xl bg-gray-50 border-2 border-gray-100 focus:border-teal-500 focus:ring-0 outline-none transition-all text-gray-900"
                            />
                            <Search className="absolute right-4 top-4 text-gray-400 w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                    <Activity className="w-6 h-6 text-teal-600" />
                    الأعراض الأكثر شيوعاً
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {symptoms.map((symptom) => (
                        <Link
                            key={symptom.id}
                            href={`/symptoms/${symptom.slug}`}
                            className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 hover:border-teal-200 transition-all group flex items-center justify-between"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
                                    <Thermometer className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 group-hover:text-teal-700 transition-colors">{symptom.name_ar}</h3>
                                    <span className="text-xs text-gray-400 font-sans dir-ltr block text-right">{symptom.name_en}</span>
                                </div>
                            </div>
                            <ChevronLeft className="w-5 h-5 text-gray-300 group-hover:text-teal-500 transform group-hover:-translate-x-1 transition-all" />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
