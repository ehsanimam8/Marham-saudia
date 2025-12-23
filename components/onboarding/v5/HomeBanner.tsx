"use client";

import Link from 'next/link';
import { Sparkles, Stethoscope, Activity } from 'lucide-react';
import { useEffect } from 'react';

export default function HomeBanner({ className = "" }: { className?: string }) {
    useEffect(() => {
        console.log("HomeBanner mounted - Fresh Component");
    }, []);

    return (
        <div className={`relative overflow-hidden group bg-teal-600 ${className}`}>
            {/* Background with Gradient and Glassmorphism */}
            <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-blue-600 opacity-95 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Decorative Blobs */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-teal-300 opacity-20 rounded-full blur-3xl" />

            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />

            <div className="relative w-full max-w-7xl mx-auto px-6 py-8 md:py-10 flex flex-col md:flex-row items-center justify-between gap-6">

                {/* Text Section */}
                <div className="flex-1 text-center md:text-right z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/10 text-white text-xs font-medium mb-3">
                        <Sparkles className="w-3 h-3 text-yellow-300" />
                        <span>ميزة جديدة: الفحص بالذكاء الاصطناعي</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
                        محتار أي تخصص تحتاج؟
                    </h2>
                    <p className="text-teal-50 text-sm md:text-base max-w-xl md:mx-0">
                        أجب عن بضعة أسئلة بسيطة، ونحن سنساعدك في تحديد الأعراض وتوجيهك إلى الطبيب الأنسب لحالتك بدقة.
                    </p>
                </div>

                {/* Interactive Action Section */}
                <div className="flex-shrink-0 z-20 flex flex-col items-center md:items-end gap-3 relative">
                    <Link href="/onboarding/v5" className="relative group/btn inline-block z-30">
                        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl blur opacity-25 group-hover/btn:opacity-75 transition duration-200 z-0"></div>
                        <div className="relative px-8 py-4 bg-white rounded-xl leading-none flex items-center gap-3 text-teal-700 font-bold hover:text-teal-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 cursor-pointer z-10">
                            <span>ابدأ الفحص المجاني الآن</span>
                            <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center group-hover/btn:bg-teal-100 transition-colors">
                                <Stethoscope className="w-4 h-4" />
                            </div>
                        </div>
                    </Link>
                    <div className="flex items-center gap-4 text-xs text-teal-100/80">
                        <span className="flex items-center gap-1">
                            <Activity className="w-3 h-3" />
                            تحليل فوري للأعراض
                        </span>
                        <span>•</span>
                        <span>بدون تسجيل مسبق</span>
                    </div>
                </div>

                {/* Floating Icon Decoration (Hidden on mobile) */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:block opacity-10 pointer-events-none z-0">
                    <Stethoscope className="w-64 h-64 text-white rotate-12" />
                </div>
            </div>
        </div>
    );
}
