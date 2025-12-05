'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle, Star, Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const VideoRoom = dynamic(() => import('@/components/video/VideoRoom'), {
    ssr: false,
    loading: () => (
        <div className="h-[calc(100vh-80px)] w-full bg-gray-900 rounded-2xl flex items-center justify-center text-white flex-col">
            <Loader2 className="w-10 h-10 animate-spin text-teal-500 mb-4" />
            <p className="text-lg font-bold">جاري تهيئة العيادة الافتراضية الآمنة...</p>
            <p className="text-sm text-gray-400 mt-2">يتم تشفير الاتصال لضمان خصوصيتك</p>
        </div>
    )
});

interface ConsultationClientProps {
    roomName: string;
    displayName: string;
    email?: string; // allow optional
    otherPartyName: string;
}

export default function ConsultationClient({ roomName, displayName, email, otherPartyName }: ConsultationClientProps) {
    const router = useRouter();
    const [callEnded, setCallEnded] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoveredStar, setHoveredStar] = useState(0);

    const handleCallEnd = () => {
        setCallEnded(true);
    };

    const handleRatingSubmit = async () => {
        // Here we would submit the rating to the backend
        // await submitReview(rating, ...);
        router.push('/patient/appointments');
    };

    if (callEnded) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full text-center animate-in fade-in zoom-in-95 duration-300">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 shadow-sm border-4 border-white">
                        <CheckCircle className="w-10 h-10" />
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-2">انتهت الاستشارة</h1>
                    <p className="text-gray-500 mb-8">
                        شكراً لك! نأمل أن تكوني قد حصلتي على الفائدة المرجوة من استشارتك مع <span className="font-semibold text-gray-700">{otherPartyName}</span>.
                    </p>

                    <div className="space-y-6 mb-8 text-left">
                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-3 block text-center">كيف كانت تجربتك؟</label>
                            <div className="flex justify-center gap-2" onMouseLeave={() => setHoveredStar(0)}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoveredStar(star)}
                                        className={`transition-colors focus:outline-none ${star <= (hoveredStar || rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                    >
                                        <Star className="w-8 h-8 fill-current" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-2 block">ملاحظات إضافية (اختياري)</label>
                            <Textarea
                                placeholder="اكتبي ملاحظاتك هنا..."
                                className="min-h-[100px] resize-none focus:ring-teal-500"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button
                            onClick={handleRatingSubmit}
                            className="bg-teal-600 hover:bg-teal-700 w-full sm:w-auto min-w-[140px]"
                        >
                            إرسال وتقييم
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => router.push('/')}
                            className="w-full sm:w-auto min-w-[140px]"
                        >
                            تخطي
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col">
            {/* Simple Header */}
            <div className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shadow-sm z-10">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-teal-700 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-100">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" /></svg>
                        <span className="font-bold text-sm">عيادة آمنة ومشفرة</span>
                    </div>
                    <span className="w-px h-6 bg-gray-200" />
                    <span className="text-sm font-medium text-gray-700">
                        استشارة طبية مع {otherPartyName}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-red-500 bg-red-50 px-3 py-1.5 rounded-full animate-pulse border border-red-100">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    مباشر
                </div>
            </div>

            {/* Video Room */}
            <div className="flex-1 p-4">
                <VideoRoom
                    roomName={roomName}
                    displayName={displayName}
                    email={email}
                    onEnd={handleCallEnd}
                />
            </div>
        </div>
    );
}
