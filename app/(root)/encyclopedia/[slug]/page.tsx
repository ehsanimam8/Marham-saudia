import { createClient } from '@/lib/supabase/server';
import { getConditionBySlug } from '@/lib/api/encyclopedia';
import { getDoctors } from '@/lib/api/doctors';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ChevronRight, Calendar, Star, ShieldCheck, ArrowLeft, Info, Stethoscope, AlertCircle } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const supabase = await createClient();
    const condition = await getConditionBySlug(supabase, slug);

    if (!condition) return { title: 'موسوعة مرهم السعودية' };

    return {
        title: `${condition.name_ar} | موسوعة مرهم`,
        description: condition.overview_ar.substring(0, 160),
    };
}

export default async function ConditionDetail({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const supabase = await createClient();
    const condition = await getConditionBySlug(supabase, slug);

    if (!condition) {
        notFound();
    }

    // Fetch doctors related to this specialty
    const doctors = await getDoctors(supabase, { specialty: condition.specialty });

    return (
        <div className="min-h-screen bg-gray-50 pb-20" dir="rtl">
            {/* Header / Breadcrumb */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center text-sm text-gray-500">
                        <Link href="/" className="hover:text-teal-600">الرئيسية</Link>
                        <ChevronRight className="w-4 h-4 mx-2" />
                        <Link href="/encyclopedia" className="hover:text-teal-600">موسوعة الأمراض</Link>
                        <ChevronRight className="w-4 h-4 mx-2" />
                        <span className="text-gray-900 font-medium">{condition.name_ar}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Main Content (2/3 width) */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden p-8">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{condition.name_ar}</h1>
                            <h2 className="text-xl text-gray-400 font-sans mb-6 dir-ltr text-right">{condition.name_en}</h2>

                            <div className="prose prose-lg prose-teal max-w-none">
                                <div className="flex gap-4 items-start mb-8 bg-teal-50 p-6 rounded-2xl border border-teal-100">
                                    <Info className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                                    <p className="text-lg text-gray-700 leading-relaxed m-0">{condition.overview_ar}</p>
                                </div>

                                <div className="space-y-8">
                                    <section>
                                        <h3 className="flex items-center gap-3 text-2xl font-bold text-gray-900 mb-4">
                                            <span className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600">
                                                <AlertCircle className="w-5 h-5" />
                                            </span>
                                            الأعراض
                                        </h3>
                                        <div className="bg-gray-50 rounded-2xl p-6 text-gray-700 leading-relaxed">
                                            {condition.symptoms_ar}
                                        </div>
                                    </section>

                                    <section>
                                        <h3 className="flex items-center gap-3 text-2xl font-bold text-gray-900 mb-4">
                                            <span className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                                <Stethoscope className="w-5 h-5" />
                                            </span>
                                            التشخيص
                                        </h3>
                                        <p className="text-gray-700 leading-relaxed bg-white border border-gray-100 p-6 rounded-2xl">
                                            {condition.diagnosis_ar}
                                        </p>
                                    </section>

                                    <section>
                                        <h3 className="flex items-center gap-3 text-2xl font-bold text-gray-900 mb-4">
                                            <span className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                                                <ShieldCheck className="w-5 h-5" />
                                            </span>
                                            العلاج
                                        </h3>
                                        <p className="text-gray-700 leading-relaxed bg-white border border-gray-100 p-6 rounded-2xl">
                                            {condition.treatment_ar}
                                        </p>
                                    </section>
                                </div>
                            </div>
                        </div>

                        {/* Related Symptoms */}
                        {condition.symptoms && condition.symptoms.length > 0 && (
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                                <h3 className="text-xl font-bold mb-6">أعراض ذات صلة</h3>
                                <div className="flex flex-wrap gap-3">
                                    {condition.symptoms.map((symptom: any) => (
                                        <Link
                                            key={symptom.id}
                                            href={`/symptoms/${symptom.slug}`}
                                            className="px-4 py-2 bg-gray-50 hover:bg-teal-50 text-gray-700 hover:text-teal-700 rounded-xl transition-colors border border-gray-200 hover:border-teal-200"
                                        >
                                            {symptom.name_ar}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar (1/3 width) - Doctor Booking CTA */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-gradient-to-br from-teal-900 to-teal-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg sticky top-24">
                            <div className="absolute top-0 right-0 p-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>

                            <h3 className="text-2xl font-bold mb-4 relative z-10">هل تعاني من هذه الأعراض؟</h3>
                            <p className="text-teal-100 mb-8 relative z-10">
                                لا تتجاهل صحتك. استشر أفضل الاستشاريين المتخصصين في {condition.name_ar} الآن عبر الاتصال المرئي.
                            </p>

                            <div className="space-y-4 relative z-10">
                                {doctors.slice(0, 3).map((doctor) => (
                                    <div key={doctor.id} className="bg-white/10 backdrop-blur-md rounded-xl p-4 flex items-center gap-4 border border-white/10 hover:bg-white/20 transition-colors">
                                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                            {doctor.profile_photo_url ? (
                                                <Image
                                                    src={doctor.profile_photo_url}
                                                    alt={doctor.profiles?.full_name_ar || ''}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500">
                                                    <Stethoscope className="w-6 h-6" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-white truncate">{doctor.profiles?.full_name_ar}</h4>
                                            <p className="text-teal-200 text-sm truncate">{doctor.specialty}</p>
                                        </div>
                                        <div className="flex items-center bg-white/20 px-2 py-1 rounded-lg">
                                            <Star className="w-3 h-3 text-yellow-400 fill-current ml-1" />
                                            <span className="text-xs font-bold text-white">{doctor.rating}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Link
                                href={`/find-doctor?specialty=${condition.specialty}`}
                                className="mt-8 block w-full bg-white text-teal-900 text-center font-bold py-4 rounded-xl hover:bg-teal-50 transition-colors shadow-lg"
                            >
                                عرض جميع الأطباء ({doctors.length})
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
