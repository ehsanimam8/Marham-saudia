import BodyMapClient from '@/components/onboarding/v5/BodyMap/BodyMapClient';

export const metadata = {
    title: 'Check Your Health | Marham Saudi',
    description: 'Interactive symptom checker and doctor matching',
};

export default function OnboardingPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-white to-teal-50/30 py-12">
            <BodyMapClient />
        </main>
    );
}
