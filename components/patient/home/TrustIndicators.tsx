import { ShieldCheck, UserCheck, Clock, CreditCard } from 'lucide-react';

const indicators = [
    {
        icon: UserCheck,
        title: "طبيبات سعوديات مرخصات"
    },
    {
        icon: ShieldCheck,
        title: "استشارات خاصة وآمنة"
    },
    {
        icon: Clock,
        title: "بدون قوائم انتظار"
    },
    {
        icon: CreditCard,
        title: "نقبل التأمين الصحي"
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
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
