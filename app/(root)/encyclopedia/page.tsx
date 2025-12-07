import { createClient } from '@/lib/supabase/server';
import { getMedicalConditions } from '@/lib/api/encyclopedia';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ChevronLeft, Activity, Heart, Brain, Stethoscope } from 'lucide-react';

export const metadata = {
    title: 'موسوعة الأمراض | مرهم السعودية',
    description: 'دليل شامل للأمراض والأعراض والعلاجات الموثوقة من أطباء معتمدين.',
};

export default async function EncyclopediaIndex() {
    const supabase = await createClient();
    const conditions = await getMedicalConditions(supabase, 50); // Fetch more for index

    return (
        <div className="min-h-screen bg-gray-50 pb-20" dir="rtl">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-teal-900 via-teal-800 to-teal-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">موسوعة مرهم الطبية</h1>
                        <p className="text-xl text-teal-100 mb-10 leading-relaxed">
                            مرجعك الموثوق للمعلومات الطبية. اكتشف الأعراض، الأسباب، وطرق العلاج بإشراف نخبة من الأطباء.
                        </p>

                        {/* Search Bar Placeholder */}
                        <div className="relative max-w-2xl mx-auto">
                            <input
                                type="text"
                                placeholder="ابحث عن مرض أو عرض صحي..."
                                className="w-full py-4 px-6 pr-12 rounded-2xl text-gray-900 shadow-xl focus:ring-4 focus:ring-teal-500/20 outline-none transition-all"
                            />
                            <Search className="absolute right-4 top-4 text-gray-400 w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Decorative curve */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="text-gray-50 fill-current">
                        <path fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
                {/* Statistics / Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-teal-50 flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                            <Activity className="w-7 h-7" />
                        </div>
                        <div>
                            <div className="font-bold text-2xl text-gray-900">+500</div>
                            <div className="text-gray-500">حالة طبية موثقة</div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-teal-50 flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
                            <Heart className="w-7 h-7" />
                        </div>
                        <div>
                            <div className="font-bold text-2xl text-gray-900">100%</div>
                            <div className="text-gray-500">مراجعة طبية</div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-teal-50 flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                            <Stethoscope className="w-7 h-7" />
                        </div>
                        <div>
                            <div className="font-bold text-2xl text-gray-900">مجاناً</div>
                            <div className="text-gray-500">استشارات أولية</div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">دليل الأمراض</h2>
                        <p className="text-gray-500 mt-2">تصفح الأمراض الشائعة والنادرة حسب الترتيب الأبجدي أو التخصص</p>
                    </div>
                    <Link href="/symptoms" className="hidden md:flex items-center gap-2 text-teal-600 font-medium hover:text-teal-700 transition-colors">
                        <span>ابحث بالأعراض بدلاً من ذلك</span>
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                </div>

                {/* Categories / Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {conditions.map((condition) => (
                        <Link
                            key={condition.id}
                            href={`/encyclopedia/${condition.slug}`}
                            className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full hover:-translate-y-1 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-teal-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-bl-full"></div>

                            <div className="flex items-start justify-between mb-4">
                                <span className="inline-block px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold tracking-wide">
                                    {condition.specialty}
                                </span>
                                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors duration-300">
                                    <ChevronLeft className="w-5 h-5" />
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-teal-700 transition-colors">
                                {condition.name_ar}
                            </h3>
                            <h4 className="text-sm text-gray-400 font-medium mb-4 font-sans dir-ltr text-right">
                                {condition.name_en}
                            </h4>

                            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4 flex-grow">
                                {condition.overview_ar}
                            </p>

                            <div className="border-t border-gray-100 pt-4 mt-auto">
                                <span className="text-sm text-teal-600 font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                                    اقرأ المزيد
                                    <ChevronLeft className="w-4 h-4" />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Link href="/symptoms" className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white border-2 border-teal-100 text-teal-700 font-bold rounded-xl hover:bg-teal-50 hover:border-teal-200 transition-colors md:hidden">
                        <span>ابحث بالأعراض</span>
                        <Activity className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
