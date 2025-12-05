import { ShieldCheck, UserCheck, Clock, CreditCard } from 'lucide-react';

const indicators = [
    {
        icon: UserCheck,
        title: "طبيبات سعوديات مرخصات",
        subtitle: "Licensed Saudi Doctors"
    },
    {
        icon: ShieldCheck,
        title: "استشارات خاصة وآمنة",
        subtitle: "Private & Secure"
    },
    {
        icon: Clock,
        title: "بدون قوائم انتظار",
        subtitle: "No Waiting Lists"
    },
    {
        icon: CreditCard,
        title: "نقبل التأمين الصحي",
        subtitle: "Insurance Accepted"
    }
];

export default function TrustIndicators() {
    return (
        <section className="py-8 bg-teal-50 border-b border-teal-100">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {indicators.map((item, index) => (
                        <div key={index} className="flex flex-col items-center text-center space-y-2">
                            <div className="p-3 bg-white rounded-full shadow-sm text-teal-600">
                                <item.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">{item.title}</h3>
                                <p className="text-xs text-gray-500 font-sans">{item.subtitle}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
