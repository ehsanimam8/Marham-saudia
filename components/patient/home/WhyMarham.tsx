import { CheckCircle2 } from 'lucide-react';

const benefits = [
    {
        title: "طبيبات سعوديات فقط",
        description: "نفهم ثقافتك وخصوصيتك، جميع طبيباتنا سعوديات مؤهلات.",
        titleEn: "Female Saudi Doctors Only"
    },
    {
        title: "خصوصية تامة 100%",
        description: "بياناتك مشفرة ومحمية، ولا نشاركها مع أي طرف ثالث.",
        titleEn: "100% Private & Secure"
    },
    {
        title: "متاحة في أي وقت",
        description: "احجزي موعدك في الوقت الذي يناسبك، حتى في عطلة نهاية الأسبوع.",
        titleEn: "Available Anytime"
    },
    {
        title: "تقبل التأمين الصحي",
        description: "نتعاون مع كبرى شركات التأمين في المملكة لتغطية تكاليف علاجك.",
        titleEn: "Insurance Accepted"
    }
];

export default function WhyMarham() {
    return (
        <section className="py-16 bg-teal-900 text-white overflow-hidden relative">
            {/* Background patterns */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-600/20 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    <div className="w-full lg:w-1/2">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            لماذا تختارين <span className="text-pink-400">مرهم</span>؟
                        </h2>
                        <p className="text-teal-200 text-lg mb-8 leading-relaxed">
                            لأول مرة في المملكة، منصة صحية مصممة خصيصاً للمرأة. نجمع لك أفضل الخبرات الطبية في بيئة آمنة ومريحة تحترم خصوصيتك.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-6 h-6 text-pink-400 flex-shrink-0" />
                                        <h3 className="font-bold text-lg">{benefit.title}</h3>
                                    </div>
                                    <p className="text-teal-200 text-sm pr-8 opacity-80">{benefit.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="w-full lg:w-1/2">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-2xl">💬</div>
                                <div>
                                    <p className="font-bold text-lg">تجربة مريضة</p>
                                    <p className="text-sm text-teal-200">سارة، الرياض</p>
                                </div>
                            </div>
                            <p className="text-xl italic leading-relaxed opacity-90">
                                &ldquo;استشرت طبيبة في خصوصية تامة من منزلي. كانت تجربة رائعة وفرت علي عناء الانتظار في العيادات. الطبيبة كانت متفهمة جداً ومحترفة.&rdquo;
                            </p>
                            <div className="flex gap-1 mt-4 text-yellow-400">
                                ★★★★★
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
