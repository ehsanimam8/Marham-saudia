'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateOnboardingSession } from '@/app/actions/onboarding_v5';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/onboarding/v5/shared/ProgressBar';
import { ArrowLeft, GripVertical } from 'lucide-react';
import { motion, Reorder } from 'framer-motion';
import FeedbackSheet from '@/components/onboarding/v5/shared/FeedbackSheet';

// ...

// Remove the inline import I added erroneously previously
// The previous tool call added `import FeedbackSheet ...` inside the return block or near it.
// I need to clean that up.
// Actually, in the previous call I put `import ...` into ReplacementContent but targeted the bottom lines.
// So the file now has `import ...` near line 130. I need to remove that and add it to top.

// Let's first just add it to top.


interface PriorityOption {
    id: string;
    name_ar: string;
    name_en: string;
    description_ar: string;
    description_en: string;
    icon: string;
}

interface PrioritiesClientProps {
    sessionId: string;
    options: PriorityOption[];
}

export default function PrioritiesClient({ sessionId, options }: PrioritiesClientProps) {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);

    // Initial state: available options unranked.
    // We want the user to select and order them.
    // Let's use two lists: ranked and available? 
    // Or just one list "Rank these by importance".

    const [items, setItems] = useState(options);

    const handleContinue = async () => {
        if (!sessionId) return;
        setSubmitting(true);
        try {
            // Map items order to rankings
            // Index 0 = Rank 1
            const prioritiesMap: Record<string, number> = {};

            items.forEach((item, index) => {
                // Strip 'priority_' prefix to match the expected key in server action
                const key = item.id.replace('priority_', '');
                prioritiesMap[key] = index + 1;
            });

            await updateOnboardingSession({
                sessionId,
                priorities: prioritiesMap
            });

            // Calculate next screen (Results)
            // We need to fetch current state to pass to getNextScreen? 
            // Or just hardcode the results screen since Priorities is usually the last step.
            // But let's use the helper to be safe, creating a partial state.
            const next = '/onboarding/v5/results'; // Priorities is the final step before results in the flow
            router.push(`${next}?sessionId=${sessionId}`);
        } catch (e) {
            console.error(e);
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-100 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-100 rounded-full blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="max-w-md mx-auto min-h-screen flex flex-col p-6 relative z-10">
                <Button
                    variant="ghost"
                    size="icon"
                    className="self-start mb-6 -ml-2"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="w-6 h-6 text-slate-600" />
                </Button>

                <ProgressBar currentStep={6} totalSteps={6} className="mb-8" />

                <div className="flex-1">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h1 className="text-3xl font-bold text-slate-900 mb-3 text-right" dir="rtl">
                            ما الذي يهمك أكثر؟
                        </h1>
                        <p className="text-slate-500 text-lg text-right" dir="rtl">
                            رتبي هذه العوامل حسب أولويتك (اسحبي للترتيب)
                        </p>
                    </motion.div>

                    <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-3">
                        {items.map((item, index) => (
                            <Reorder.Item key={item.id} value={item}>
                                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-4 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold shrink-0">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 text-right">
                                        <h3 className="font-semibold text-slate-900">{item.name_ar}</h3>
                                        <p className="text-sm text-slate-500">{item.description_ar}</p>
                                    </div>
                                    <div className="text-2xl shrink-0 w-8 text-center">{item.icon}</div>
                                    <GripVertical className="text-slate-300 w-5 h-5 shrink-0" />
                                </div>
                            </Reorder.Item>
                        ))}
                    </Reorder.Group>
                </div>


                <div className="mt-8 text-center space-y-4">
                    <Button
                        onClick={handleContinue}
                        disabled={submitting}
                        className="w-full h-14 text-lg rounded-2xl bg-[#D4AF37] hover:bg-[#c4a030] text-white shadow-lg shadow-yellow-900/10"
                    >
                        {submitting ? 'جاري الحفظ...' : 'عرض النتائج'}
                    </Button>
                    <FeedbackSheet sessionId={sessionId} stepName="Priorities" />
                </div>
            </div>
        </div>
    );
}
