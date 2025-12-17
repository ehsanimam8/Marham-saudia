import ConcernSelectionClient from '@/components/onboarding/v5/QuestionFlow/ConcernSelectionClient';
import { getPrimaryConcerns, getBodyPartDetails } from '@/app/actions/onboarding_v5';

interface PageProps {
    params: {
        bodyPart: string;
    }
}

export default async function BodyPartPage({ params }: PageProps) {
    // Await params if using Next.js 15+ or simply use it as is if 14
    const resolvedParams = await params;
    const bodyPartId = resolvedParams.bodyPart;

    // Fetch dynamic data
    const [bodyPartDetails, concerns] = await Promise.all([
        getBodyPartDetails(bodyPartId),
        getPrimaryConcerns(bodyPartId)
    ]);

    return (
        <main>
            <ConcernSelectionClient
                bodyPartId={bodyPartId}
                initialConcerns={concerns}
                bodyPartDetails={bodyPartDetails || undefined}
            />
        </main>
    );
}
