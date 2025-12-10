"use client";

import { useState } from 'react';
import BodyNavigator from '@/components/onboarding/BodyNavigator';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function OnboardingPage() {
    const [started, setStarted] = useState(false);

    if (!started) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-purple-50 flex items-center justify-center p-6 relative overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute top-20 left-20 w-64 h-64 bg-teal-200/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-1000" />

                <div className="max-w-xl w-full text-center relative z-10">
                    <div className="mb-8 relative inline-block">
                        <div className="w-24 h-24 bg-gradient-to-br from-teal-400 to-teal-600 rounded-3xl rotate-3 flex items-center justify-center shadow-2xl mx-auto">
                            <Sparkles className="w-12 h-12 text-white" />
                        </div>
                        <div className="absolute -top-4 -right-4 bg-white p-2 rounded-xl shadow-lg animate-bounce">
                            <span className="text-2xl">✨</span>
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                        اكتشفي احتياجاتك<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-purple-600">
                            الصحية والجمالية
                        </span>
                    </h1>

                    <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-md mx-auto">
                        تجربة تفاعلية جديدة صممت خصيصاً لكِ. استكشفي جسمك، وافهمي أعراضك، وتواصلي مع أفضل الأطباء بخصوصية تامة.
                    </p>

                    <Button
                        onClick={() => setStarted(true)}
                        size="lg"
                        className="bg-gray-900 text-white hover:bg-gray-800 text-lg px-12 py-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                    >
                        ابدأي الآن
                        <ArrowLeft className="w-6 h-6 mr-2" />
                    </Button>

                    <p className="mt-8 text-sm text-gray-400 font-medium">
                        خصوصية تامة 100% • أطباء معتمدون • تجربة مخصصة
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
                        <span className="font-bold text-gray-900">Marham Navigator</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-500 hover:text-gray-900"
                        onClick={() => setStarted(false)}
                    >
                        خروج
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-4">
                <BodyNavigator />
            </main>
        </div>
    );
}
