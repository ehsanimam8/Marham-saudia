import { Heart, Baby, Stethoscope, Brain, Activity, Sparkles } from 'lucide-react';
import Link from 'next/link';

const specialties = [
    {
        icon: Heart,
        title: "صحة المرأة",
        href: "/doctors?specialty=womens-health"
    },
    {
        icon: Baby,
        title: "الحمل والولادة",
        href: "/doctors?specialty=pregnancy"
    },
    {
        icon: Stethoscope,
        title: "أمراض النساء",
        href: "/doctors?specialty=obgyn"
    },
    {
        icon: Activity,
        title: "تكيس المبايض",
        href: "/doctors?specialty=pcos"
    },
    {
        icon: Sparkles,
        title: "الخصوبة",
        href: "/doctors?specialty=fertility"
    },
    {
        icon: Brain,
        title: "الصحة النفسية",
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
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
