import { getBodyPartDetails, getOnboardingSession, getPriorityOptions } from '@/app/actions/onboarding_v5';
import PrioritiesClient from './PrioritiesClient';
import { redirect } from 'next/navigation';

export default async function PrioritiesPage({
    searchParams,
}: {
    searchParams: Promise<{ sessionId?: string }>;
}) {
    const { sessionId } = await searchParams;

    if (!sessionId) {
        redirect('/onboarding/v5');
    }

    // 1. Fetch Session to get BodyPart
    const session = await getOnboardingSession(sessionId) as any;
    if (!session) {
        redirect('/onboarding/v5');
    }

    // 2. Fetch Body Part to get Category
    const bodyPart = await getBodyPartDetails(session.body_part);
    if (!bodyPart) {
        // Fallback or error
        console.error('Body part not found for session', session.id);
        return <div>Error loading session context.</div>;
    }

    // 3. Fetch Priority Options
    const allOptions = await getPriorityOptions();

    // 4. Filter Options
    const categoryId = bodyPart.category; // 'medical', 'beauty', 'mental'

    // Check if applies_to_categories contains the categoryId
    // The DB column is text[], so it returns an array of strings.
    const filteredOptions = allOptions.filter((opt: any) =>
        opt.applies_to_categories && opt.applies_to_categories.includes(categoryId)
    ) as any[];

    return (
        <PrioritiesClient
            sessionId={sessionId}
            options={filteredOptions}
        />
    );
}
