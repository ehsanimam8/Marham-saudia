import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function Hero() {
    return (
        <section className="relative bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 text-white overflow-hidden">
            <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center">
                <div className="w-full md:w-1/2 space-y-6 text-center md:text-right z-10">
                    <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                        رعاية صحية نسائية <br />
                        <span className="text-cyan-100">من طبيبات سعوديات</span>
                    </h1>
                    <p className="text-lg md:text-xl text-teal-50 max-w-lg mx-auto md:mx-0">
                        احجزي استشارة مع طبيبة متخصصة من منزلك في خصوصية تامة.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <Button asChild size="lg" className="bg-white text-teal-700 hover:bg-teal-50 font-bold text-lg px-8 shadow-lg">
                            <Link href="/doctors" suppressHydrationWarning>
                                احجزي استشارة الآن
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm">
                            <Link href="/doctors" suppressHydrationWarning>
                                تصفح الطبيبات
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="w-full md:w-1/2 mt-10 md:mt-0 relative">
                    <div className="relative w-full h-[300px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white/20">
                        <Image
                            src="/images/heroes/hero_woman_phone_1764849865934.png"
                            alt="امرأة سعودية تستخدم تطبيق مرهم للاستشارة الطبية | Saudi woman using Marham telemedicine app"
                            fill
                            className="object-cover"
                            priority
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </div>
                </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-900/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
        </section>
    );
}
