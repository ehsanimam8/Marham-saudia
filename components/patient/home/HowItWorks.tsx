import { Search, Calendar, Video } from 'lucide-react';

const steps = [
    {
        icon: Search,
        title: "1. اختاري طبيبتك",
        description: "تصفحي قائمة الطبيبات حسب التخصص والتقييم",
        subtitle: "Choose your doctor"
    },
    {
        icon: Calendar,
        title: "2. احجزي موعدك",
        description: "اختاري الوقت المناسب وادفعي بأمان",
        subtitle: "Book appointment"
    },
    {
        icon: Video,
        title: "3. استشيري من منزلك",
        description: "تحدثي مع الطبيبة عبر مكالمة فيديو خاصة",
        subtitle: "Consult from home"
    }
];

export default function HowItWorks() {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">كيف يعمل مرهم؟</h2>
                    <p className="text-gray-500">خطوات بسيطة للحصول على الرعاية الصحية</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connecting line for desktop */}
                    <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-teal-100 -z-10 transform -translate-y-1/2"></div>

                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center text-center bg-white p-6 rounded-xl">
                            <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 mb-6 border-4 border-white shadow-sm">
                                <step.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                            <p className="text-gray-600 mb-1">{step.description}</p>
                            <p className="text-sm text-gray-400 font-sans">{step.subtitle}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
