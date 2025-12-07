import { createClient } from '@/lib/supabase/server';
import { getSymptomBySlug } from '@/lib/api/encyclopedia';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, ArrowLeft, Stethoscope, AlertTriangle, FileText } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const supabase = await createClient();
    const symptom = await getSymptomBySlug(supabase, slug);

    if (!symptom) return { title: 'موسوعة الأعراض | مرهم السعودية' };

    return {
        title: `${symptom.name_ar} | أعراض وأسباب`,
        description: symptom.description_ar,
    };
}

export default async function SymptomDetail({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const supabase = await createClient();
    const symptom = await getSymptomBySlug(supabase, slug);

    if (!symptom) {
        notFound();
    }

    // Flatten the nested conditions structure
    const associatedConditions = symptom.conditions?.map((c: any) => c.medical_conditions) || [];

    return (
        <div className="min-h-screen bg-gray-50 pb-20" dir="rtl">
            {/* Header */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center text-sm text-gray-500">
                        <Link href="/" className="hover:text-teal-600">الرئيسية</Link>
                        <ChevronRight className="w-4 h-4 mx-2" />
                        <Link href="/symptoms" className="hover:text-teal-600">دليل الأعراض</Link>
                        <ChevronRight className="w-4 h-4 mx-2" />
                        <span className="text-gray-900 font-medium">{symptom.name_ar}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Main Symptom Box */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-12 text-center">
                    <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="w-10 h-10 text-rose-500" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{symptom.name_ar}</h1>
                    <h2 className="text-xl text-gray-400 font-sans mb-8 dir-ltr">{symptom.name_en}</h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        {symptom.description_ar}
                    </p>
                </div>

                {/* Associated Conditions */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Stethoscope className="w-6 h-6 text-teal-600" />
                        <h2 className="text-2xl font-bold text-gray-900">أمراض قد تسبب هذا العرض</h2>
                    </div>

                    {associatedConditions.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {associatedConditions.map((condition: any) => (
                                <Link
                                    key={condition.id}
                                    href={`/encyclopedia/${condition.slug}`}
                                    className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg border border-gray-100 hover:border-teal-200 transition-all block relative"
                                >
                                    <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ArrowLeft className="w-5 h-5 text-teal-600" />
                                    </div>

                                    <span className="text-xs font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-full mb-3 inline-block">
                                        {condition.specialty}
                                    </span>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{condition.name_ar}</h3>
                                    <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                                        {condition.overview_ar}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center text-gray-500">
                            لا توجد أمراض مرتبطة بهذا العرض في قاعدتنا حاليًا. يرجى استشارة طبيب عام.
                            <div className="mt-6">
                                <Link href="/find-doctor" className="inline-flex items-center gap-2 text-teal-600 font-bold hover:text-teal-700">
                                    استشارة طبيب عام <ArrowLeft className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
