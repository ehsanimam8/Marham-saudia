import { Heart, Baby, Stethoscope, Brain, Activity, Sparkles } from 'lucide-react';
import Link from 'next/link';

const specialties = [
    {
        icon: Heart,
        title: "صحة المرأة",
        titleEn: "Women's Health",
        href: "/doctors?specialty=womens-health"
    },
    {
        icon: Baby,
        title: "الحمل والولادة",
        titleEn: "Pregnancy Care",
        href: "/doctors?specialty=pregnancy"
    },
    {
        icon: Stethoscope,
        title: "أمراض النساء",
        titleEn: "OB/GYN",
        href: "/doctors?specialty=obgyn"
    },
    {
        icon: Activity,
        title: "تكيس المبايض",
        titleEn: "PCOS",
        href: "/doctors?specialty=pcos"
    },
    {
        icon: Sparkles,
        title: "الخصوبة",
        titleEn: "Fertility",
        href: "/doctors?specialty=fertility"
    },
    {
        icon: Brain,
        title: "الصحة النفسية",
        titleEn: "Mental Health",
        href: "/doctors?specialty=mental-health"
    }
];

export default function SpecialtiesGrid() {
    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">تخصصاتنا</h2>
                    <p className="text-gray-500">نغطي جميع جوانب صحة المرأة</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {specialties.map((item, index) => (
                        <Link
                            key={index}
                            href={item.href}
                            className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center border border-transparent hover:border-teal-100 hover:-translate-y-1"
                            suppressHydrationWarning
                        >
                            <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 mb-4 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                                <item.icon className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                            <p className="text-xs text-gray-400 font-sans">{item.titleEn}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
