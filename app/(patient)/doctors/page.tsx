import { getDoctors } from '@/lib/api/doctors';
import DoctorCard from '@/components/patient/doctors/DoctorCard';
import DoctorFilters from '@/components/patient/doctors/DoctorFilters';
import DoctorSearch from '@/components/patient/doctors/DoctorSearch';
import Footer from '@/components/patient/home/Footer';
import { Filter } from 'lucide-react';
import StartOnboardingBanner from '@/components/onboarding/v5/StartOnboardingBanner';

interface SearchParams {
    specialty?: string;
    city?: string;
    hospital?: string;
    minPrice?: string;
    maxPrice?: string;
    search?: string;
}

import { createClient } from '@/lib/supabase/server';

export default async function DoctorsPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    const params = await searchParams;
    const supabase = await createClient();

    const filters = {
        specialty: params.specialty,
        city: params.city,
        hospital: params.hospital,
        minPrice: params.minPrice ? parseFloat(params.minPrice) : undefined,
        maxPrice: params.maxPrice ? parseFloat(params.maxPrice) : undefined,
        search: params.search,
    };

    const doctors = await getDoctors(supabase, filters);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-100">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        ابحثي عن طبيبة
                    </h1>
                    <p className="text-gray-500">
                        اختاري من بين {doctors.length} طبيبة متخصصة
                    </p>
                </div>
            </div>

            {/* AI Onboarding Banner */}
            <div className="container mx-auto px-4 -mt-4 mb-4 relative z-10">
                <StartOnboardingBanner className="rounded-2xl shadow-sm" />
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar - Desktop */}
                    <aside className="hidden lg:block w-80 flex-shrink-0">
                        <div className="sticky top-8">
                            <DoctorFilters />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Search Bar */}
                        <div className="mb-6">
                            <DoctorSearch />
                        </div>

                        {/* Mobile Filter Button */}
                        <div className="lg:hidden mb-6">
                            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50">
                                <Filter className="w-5 h-5" />
                                <span>الفلاتر</span>
                            </button>
                        </div>

                        {/* Results Count */}
                        <div className="mb-6 flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                                {doctors.length} طبيبة متاحة
                            </p>
                            <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
                                <option>الأعلى تقييماً</option>
                                <option>السعر: الأقل إلى الأعلى</option>
                                <option>السعر: الأعلى إلى الأقل</option>
                            </select>
                        </div>

                        {/* Doctor Grid */}
                        {doctors.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {doctors.map((doctor) => (
                                    <DoctorCard key={doctor.id} doctor={doctor} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    لم نجد نتائج
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    جربي تغيير الفلاتر أو البحث بكلمات مختلفة
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
