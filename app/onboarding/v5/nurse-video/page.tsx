'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Video, Mic, MicOff, VideoOff, PhoneOff, User } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function NurseVideoPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NurseVideoContent />
        </Suspense>
    );
}

function NurseVideoContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const sessionId = searchParams.get('sessionId');
    const [status, setStatus] = useState('connecting'); // connecting, active, ended

    useEffect(() => {
        const timer = setTimeout(() => {
            setStatus('active');
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
            <div className="max-w-4xl w-full aspect-video bg-slate-800 rounded-3xl overflow-hidden shadow-2xl relative border border-slate-700">
                {status === 'connecting' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white space-y-4">
                        <div className="w-20 h-20 bg-teal-500 rounded-full animate-pulse flex items-center justify-center">
                            <Video className="w-10 h-10" />
                        </div>
                        <p className="text-xl font-arabic">جاري الاتصال بالممرضة...</p>
                    </div>
                )}

                {status === 'active' && (
                    <>
                        {/* Remote Stream Placeholder */}
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center">
                            <div className="absolute inset-0 bg-black/20" />
                            <div className="absolute bottom-6 right-6 bg-teal-600 text-white px-3 py-1 rounded-md text-sm font-arabic">
                                متصلة: الممرضة نورة
                            </div>
                        </div>

                        {/* Local Stream Placeholder */}
                        <div className="absolute top-6 left-6 w-32 md:w-48 aspect-video bg-slate-700 rounded-xl border-2 border-white/20 overflow-hidden shadow-lg">
                            <div className="w-full h-full flex items-center justify-center bg-slate-600">
                                <User className="w-10 h-10 text-white/50" />
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
                            <button className="p-4 bg-slate-700/80 backdrop-blur-md rounded-full text-white hover:bg-slate-600 transition-colors">
                                <Mic className="w-6 h-6" />
                            </button>
                            <button className="p-4 bg-slate-700/80 backdrop-blur-md rounded-full text-white hover:bg-slate-600 transition-colors">
                                <Video className="w-6 h-6" />
                            </button>
                            <button
                                onClick={() => setStatus('ended')}
                                className="p-4 bg-red-500 rounded-full text-white hover:bg-red-600 transition-transform hover:scale-110"
                            >
                                <PhoneOff className="w-6 h-6" />
                            </button>
                        </div>
                    </>
                )}

                {status === 'ended' && (
                    <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center text-white p-8 text-center">
                        <CheckCircle2 className="w-16 h-16 text-teal-500 mb-4" />
                        <h2 className="text-2xl font-bold font-arabic mb-2">انتهت الاستشارة</h2>
                        <p className="text-slate-400 font-arabic mb-8">شكراً لكِ. الممرضة نورة توصي بحجز موعد مع الدكتورة سارة (طبيبة نساء وولادة).</p>
                        <Button
                            onClick={() => router.push(`/onboarding/v5/results?sessionId=${sessionId}`)}
                            className="bg-teal-600 hover:bg-teal-700 font-arabic px-8 h-12"
                        >
                            العودة للنتائج وحجز الطبيبة
                        </Button>
                    </div>
                )}
            </div>

            <p className="mt-6 text-slate-500 text-sm font-arabic">
                جميع المكالمات مشفرة وآمنة تماماً
            </p>
        </div>
    );
}

function CheckCircle2(props: any) {
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
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    )
}
