'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Video,
    Calendar,
    Star,
    Users,
    CheckCircle2,
    Clock,
    Shield,
    Award,
    ArrowRight,
    Play,
    AlertCircle
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import type { AnalysisResult, SocialProofData, MatchedDoctor } from '@/lib/onboarding/v5/analysis-types';

export function ExitIntentPopup({ sessionId }: { sessionId: string }) {
    const [showPopup, setShowPopup] = useState(false);
    const router = useRouter();

    useEffect(() => {
        let exitIntent = false;

        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0 && !exitIntent) {
                exitIntent = true;
                setShowPopup(true);
            }
        };

        document.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    if (!showPopup) return null;

    return (
        <Dialog open={showPopup} onOpenChange={setShowPopup}>
            <DialogContent className="max-w-md" dir="rtl">
                <DialogHeader>
                    <DialogTitle className="text-2xl text-center font-arabic">
                        انتظري قليلاً! ⏸️
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <p className="text-center text-gray-700 font-arabic text-lg">
                        لديكِ <strong>استشارة مجانية</strong> مع ممرضة متخصصة بانتظارك الآن
                    </p>

                    <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
                        <ul className="space-y-3">
                            {[
                                'مكالمة فيديو مجانية لمدة 5 دقائق',
                                'إرشادات فورية متخصصة لحالتك',
                                'بدون دفع، وبدون أي التزام'
                            ].map((text, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-green-200 flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="w-4 h-4 text-green-700" />
                                    </div>
                                    <span className="text-sm font-bold font-arabic text-green-800">{text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <Button
                        onClick={() => {
                            setShowPopup(false);
                            router.push(`/onboarding/v5/nurse-video?sessionId=${sessionId}`);
                        }}
                        className="w-full bg-green-600 hover:bg-green-700 h-14 text-xl font-bold font-arabic shadow-lg shadow-green-100"
                    >
                        احصلي على الاستشارة المجانية
                    </Button>

                    <Button
                        variant="ghost"
                        onClick={() => setShowPopup(false)}
                        className="w-full text-xs text-gray-400 font-arabic"
                    >
                        لا، شكراً، أريد المغادرة
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

interface ConversionResultsClientProps {
    analysisResult: AnalysisResult;
    socialProof: SocialProofData;
    matchedDoctors: MatchedDoctor[];
    sessionId: string;
}

export default function ConversionResultsClient({
    analysisResult,
    socialProof,
    matchedDoctors,
    sessionId
}: ConversionResultsClientProps) {
    const router = useRouter();

    function handleFreeNurseConsultation() {
        // In a real app, this would open a video modal or redirect
        router.push(`/onboarding/v5/nurse-video?sessionId=${sessionId}`);
    }

    function handleBookDoctor(doctorId: string) {
        router.push(`/doctors/${doctorId}?book=true&sessionId=${sessionId}`);
    }

    const severityColor = {
        mild: 'bg-green-100 text-green-800 border-green-200',
        moderate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        severe: 'bg-red-100 text-red-800 border-red-200'
    };

    const severityIcon = {
        mild: '✓',
        moderate: '⚠️',
        severe: '🚨'
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white pb-20" dir="rtl">
            <ExitIntentPopup sessionId={sessionId} />
            <div className="max-w-4xl mx-auto px-4 py-8">

                {/* SECTION 1: Reassurance Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-8"
                >
                    <div className="inline-block bg-white rounded-full px-6 py-3 shadow-sm mb-4 border border-teal-100">
                        <p className="text-sm text-gray-600 flex items-center gap-2 justify-center">
                            <Users className="w-4 h-4 text-teal-600" />
                            <span className="font-semibold text-teal-600">
                                {socialProof.caseCount}+
                            </span>
                            <span className="font-arabic">
                                حالة مشابهة وجدت الراحة معنا
                            </span>
                        </p>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3 font-arabic leading-tight">
                        لستِ وحدك، نحن هنا لمساعدتك 💚
                    </h1>

                    <p className="text-lg text-gray-600 font-arabic">
                        ساعدنا {socialProof.caseCount} امرأة في حالات مشابهة لحالتك تماماً
                    </p>
                </motion.div>

                {/* SECTION 2: Condition Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <Card className="mb-8 border-2 border-teal-100 shadow-sm overflow-hidden">
                        <CardHeader className="bg-teal-50/50 border-b border-teal-100 py-4 px-6">
                            <CardTitle className="flex items-center justify-between text-lg md:text-xl font-arabic">
                                <span>تحليل الأعراض الأولي</span>
                                <Badge className={`${severityColor[analysisResult.severity]} font-arabic px-3 py-1`}>
                                    <span className="ml-1">{severityIcon[analysisResult.severity]}</span>
                                    {analysisResult.severity === 'mild' && 'حالة خفيفة'}
                                    {analysisResult.severity === 'moderate' && 'حالة متوسطة'}
                                    {analysisResult.severity === 'severe' && 'حالة شديدة'}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 px-6">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-3 font-arabic text-lg">
                                        الحالة المحتملة:
                                    </h3>
                                    <p className="text-2xl text-teal-700 font-bold font-arabic leading-none">
                                        {analysisResult.primaryCondition_ar}
                                    </p>
                                    <p className="text-sm text-gray-400 mt-1">{analysisResult.primaryCondition}</p>
                                </div>

                                <div className="border-t border-gray-100 pt-6">
                                    <h3 className="font-bold text-gray-900 mb-4 font-arabic">
                                        الأعراض التي ذكرتِها:
                                    </h3>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {analysisResult.symptoms.map((symptom, index) => (
                                            <li key={index} className="flex items-start gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                                <CheckCircle2 className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                                                <span className="text-gray-700 font-arabic text-sm">{symptom}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                                    <div className="flex gap-3">
                                        <AlertCircle className="w-5 h-5 text-blue-600 shrink-0" />
                                        <p className="text-sm text-blue-900 font-arabic leading-relaxed">
                                            <strong>ملاحظة هامة:</strong> هذا تحليل أولي بناءً على إجاباتك فقط.
                                            استشارة الطبيبة المتخصصة ستوفر لكِ التشخيص الدقيق والنهائي مع خطة علاج مخصصة تناسب احتياجاتك.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* SECTION 3: Matched Doctors */}
                <motion.div
                    id="matched-doctors"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-16"
                >
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold mb-4 font-arabic text-gray-900 border-b-2 border-teal-100 inline-block pb-2">
                            طبيبات متميزات مرشحات لكِ
                        </h2>
                        <p className="text-gray-600 font-arabic text-lg max-w-2xl mx-auto">
                            لقد اخترنا لكِ أفضل 3 طبيبات بناءً على خبرتهن في التعامل مع حالات {analysisResult.primaryCondition_ar} السابقة.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {matchedDoctors.map((doctor, index) => (
                            <DoctorMatchCard
                                key={doctor.id}
                                doctor={doctor}
                                rank={index + 1}
                                onBook={() => handleBookDoctor(doctor.id)}
                            />
                        ))}
                    </div>
                </motion.div>

                {/* SECTION 4: Social Proof Testimonial */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mb-12"
                >
                    <Card className="bg-gradient-to-br from-white to-teal-50 border-2 border-teal-100 shadow-lg relative overflow-hidden group">
                        <div className="absolute -top-12 -right-12 w-24 h-24 bg-teal-100/50 rounded-full blur-2xl group-hover:bg-teal-200/50 transition-colors" />
                        <CardContent className="pt-8 pb-6 px-8 relative z-10">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                                <div className="flex-shrink-0">
                                    <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl border border-teal-50 transform -rotate-3 group-hover:rotate-0 transition-transform">
                                        <Star className="w-10 h-10 text-yellow-400 fill-yellow-400" />
                                    </div>
                                </div>
                                <div className="flex-1 text-center md:text-right">
                                    <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                            ))}
                                        </div>
                                        <span className="text-2xl font-bold text-gray-900 mr-2">
                                            {socialProof.averageRating}
                                        </span>
                                        <span className="text-gray-500 font-arabic text-sm">
                                            (من {socialProof.caseCount} مريضة)
                                        </span>
                                    </div>

                                    <blockquote className="text-gray-800 italic mb-4 text-xl font-arabic leading-relaxed">
                                        "{socialProof.testimonial.text_ar}"
                                    </blockquote>

                                    <div className="flex items-center justify-center md:justify-start gap-3 text-sm text-gray-600 font-arabic">
                                        <span className="font-bold text-teal-700">
                                            {socialProof.testimonial.patientName}
                                        </span>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                        <span>{socialProof.testimonial.patientAge} سنة</span>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                        <span>{socialProof.testimonial.patientCity}</span>
                                    </div>

                                    <div className="mt-6 inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full border border-green-100">
                                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                                        <span className="text-sm font-bold text-green-800 font-arabic">
                                            {socialProof.successRate}% نسبة تحسن الحالات المشابهة
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* SECTION 5: Free Nurse CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mb-16"
                >
                    <h2 className="text-3xl font-bold text-center mb-10 font-arabic text-gray-900">
                        احصلي على استشارة مجانية الآن
                    </h2>

                    <div className="max-w-2xl mx-auto">
                        {/* FREE Nurse Option */}
                        <Card className="border-2 border-slate-200 hover:border-green-500 hover:shadow-2xl transition-all cursor-pointer group flex flex-col h-full bg-white relative">
                            <CardHeader className="bg-slate-50 border-b border-slate-100 group-hover:bg-green-50/50 transition-colors">
                                <div className="flex items-center justify-between mb-4">
                                    <Badge className="bg-green-600 text-white font-arabic py-1 px-3">
                                        مجاناً تماماً
                                    </Badge>
                                    <Video className="w-8 h-8 text-green-600" />
                                </div>
                                <CardTitle className="text-2xl font-arabic leading-tight">
                                    تحدثي مع ممرضة الآن
                                    <span className="block text-sm font-normal text-gray-500 font-sans mt-1">Free Nurse Triage</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-8 flex-1 space-y-6">
                                <p className="text-gray-700 font-arabic text-lg">
                                    احصلي على إرشادات فورية وتقييم أولي لحالتك عبر مكالمة فيديو سريعة.
                                </p>

                                <ul className="space-y-4">
                                    {[
                                        'مكالمة فيديو فورية (5 دقائق)',
                                        'شرح مفصل لنتائج تحليلك',
                                        'نصائح أولية لتخفيف الأعراض',
                                        'توجيهك للطبيبة الأنسب لحالتك'
                                    ].map((text, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                            </div>
                                            <span className="text-gray-700 font-arabic">{text}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="bg-green-50 rounded-xl p-4 border border-green-200 animate-pulse">
                                    <div className="flex items-center gap-3 text-sm text-green-900 justify-center">
                                        <Clock className="w-5 h-5" />
                                        <span className="font-bold font-arabic">
                                            ممرضة متاحة الآن - ابدئي فوراً!
                                        </span>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleFreeNurseConsultation}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white h-14 text-xl font-arabic font-bold shadow-lg shadow-green-200 group-hover:scale-[1.02] transition-transform"
                                >
                                    <Video className="w-6 h-6 ml-3" />
                                    ابدئي المكالمة المجانية
                                </Button>

                                <p className="text-xs text-center text-gray-400 font-arabic">
                                    * الخدمة مجانية ولا تتطلب أي معلومات بنكية
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </motion.div>

                {/* SECTION 6: Trust Signals */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            {
                                icon: Shield,
                                title_ar: 'طبيبات مرخصات',
                                desc_ar: 'من قبل وزارة الصحة',
                                color: 'bg-blue-50 text-blue-600'
                            },
                            {
                                icon: CheckCircle2,
                                title_ar: 'خصوصية تامة',
                                desc_ar: 'بياناتك مشفرة ومحمية',
                                color: 'bg-green-50 text-green-600'
                            },
                            {
                                icon: Award,
                                title_ar: 'جودة عالمية',
                                desc_ar: 'أفضل المعايير الطبية',
                                color: 'bg-purple-50 text-purple-600'
                            },
                            {
                                icon: Users,
                                title_ar: 'ثقة المريضات',
                                desc_ar: 'أكثر من 10 آلاف استشارة',
                                color: 'bg-orange-50 text-orange-600'
                            }
                        ].map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <Card key={index} className="text-center border-none shadow-sm bg-white hover:shadow-md transition-shadow">
                                    <CardContent className="pt-8 pb-6">
                                        <div className={`w-14 h-14 ${item.color} mx-auto mb-4 rounded-2xl flex items-center justify-center`}>
                                            <Icon className="w-8 h-8" />
                                        </div>
                                        <h4 className="font-bold text-gray-900 font-arabic mb-1">
                                            {item.title_ar}
                                        </h4>
                                        <p className="text-xs text-gray-500 font-arabic">
                                            {item.desc_ar}
                                        </p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </motion.div>

            </div>
        </div>
    );
}

// Doctor Match Card Component
function DoctorMatchCard({
    doctor,
    rank,
    onBook
}: {
    doctor: MatchedDoctor;
    rank: number;
    onBook: () => void;
}) {
    const isAvailableToday = doctor.next_available &&
        new Date(doctor.next_available).toDateString() === new Date().toDateString();

    const availabilityText = isAvailableToday
        ? {
            ar: 'متاحة اليوم',
            time: new Date(doctor.next_available).toLocaleTimeString('ar-SA', {
                hour: '2-digit',
                minute: '2-digit'
            })
        }
        : {
            ar: 'أول موعد متاح',
            time: new Date(doctor.next_available).toLocaleDateString('ar-SA', {
                month: 'short',
                day: 'numeric'
            })
        };

    return (
        <Card className="hover:shadow-2xl transition-all group relative border-2 border-slate-100 flex flex-col h-full bg-white overflow-hidden">
            {rank === 1 && (
                <div className="absolute -top-1 -right-1 bg-gradient-to-l from-orange-500 to-yellow-500 text-white px-6 py-2 rounded-bl-3xl text-sm font-bold shadow-lg z-10 font-arabic border-b-2 border-l-2 border-white/20">
                    🥇 أفضل تطابق لكِ
                </div>
            )}

            <CardContent className="pt-10 flex-1 flex flex-col items-center">
                <div className="relative mb-6">
                    <Avatar className="w-28 h-28 border-4 border-teal-50 shadow-inner group-hover:scale-110 transition-transform duration-300">
                        <AvatarImage src={doctor.profile_image_url} alt={doctor.name_ar} className="object-cover" />
                        <AvatarFallback className="bg-teal-100 text-teal-800 text-2xl font-bold">
                            {doctor.name_ar.split(' ').slice(0, 2).map(n => n[0]).join('')}
                        </AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 left-0 bg-white shadow-md rounded-full px-2 py-1 border border-teal-50 flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs font-bold text-gray-700">{doctor.rating}</span>
                    </div>
                </div>

                <div className="text-center mb-6 w-full">
                    <h3 className="font-bold text-xl text-gray-900 font-arabic group-hover:text-teal-600 transition-colors">
                        د. {doctor.name_ar}
                    </h3>
                    <p className="text-sm text-gray-400 font-sans mb-2 font-medium">Dr. {doctor.name_en}</p>

                    <Badge variant="secondary" className="bg-teal-50 text-teal-700 border-teal-100 font-arabic font-medium px-4 py-1 mb-2">
                        {doctor.specialty_ar}
                    </Badge>

                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500 font-arabic">
                        <MapPin className="w-3 h-3" />
                        <span>{doctor.hospital}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full mb-6">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                        <div className="text-xs text-gray-400 font-arabic mb-1">التقييمات</div>
                        <div className="text-sm font-bold text-gray-800">{doctor.reviews_count}+ تـقيـيم</div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                        <div className="text-xs text-gray-400 font-arabic mb-1">سنوات الخبرة</div>
                        <div className="text-sm font-bold text-gray-800">{doctor.years_experience}+ سنوات</div>
                    </div>
                </div>

                {doctor.has_treated_condition && (
                    <div className="w-full bg-green-50 text-green-700 p-3 rounded-xl border border-green-100 flex items-center gap-2 justify-center mb-6">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-xs font-bold font-arabic italic">خبيرة في حالات {doctor.specialty_ar}</span>
                    </div>
                )}

                <div className="bg-teal-50 rounded-2xl p-4 mb-6 border border-teal-100 w-full group-hover:bg-teal-100 transition-colors duration-300">
                    <div className="flex items-center justify-between">
                        <div className="text-right">
                            <div className="text-xs text-teal-600 font-arabic mb-0.5">{availabilityText.ar}</div>
                            <div className="text-sm font-bold text-teal-900 font-arabic">{availabilityText.time}</div>
                        </div>
                        <Clock className="w-6 h-6 text-teal-600" />
                    </div>
                </div>

                <div className="mt-auto w-full">
                    <div className="text-center mb-4">
                        <span className="text-3xl font-black text-gray-900">{doctor.consultation_price}</span>
                        <span className="text-sm text-gray-500 mr-2 font-arabic">ريال</span>
                    </div>

                    <Button
                        onClick={onBook}
                        className="w-full bg-slate-900 hover:bg-black text-white h-12 text-lg font-arabic font-bold rounded-xl group-hover:scale-[1.05] transition-transform duration-300 shadow-lg shadow-slate-200"
                    >
                        احجزي الآن
                        <ArrowRight className="w-5 h-5 mr-3" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

// MapPin icon helper (not imported initially)
function MapPin(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    );
}
