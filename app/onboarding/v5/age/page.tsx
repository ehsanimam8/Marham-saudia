import { Suspense } from 'react';
import AgeCheckClient from '@/components/onboarding/v5/QuestionFlow/AgeCheckClient';

export default function AgePage() {
    return (
        <main>
            <Suspense fallback={<div>جاري التحميل...</div>}>
                <AgeCheckClient />
            </Suspense>
        </main>
    );
}
