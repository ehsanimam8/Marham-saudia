import { fetchAllCategoriesWithParts } from '@/app/actions/admin_onboarding';
import OnboardingManager from '@/components/admin/OnboardingManager';

export default async function OnboardingAdminPage() {
    const data = await fetchAllCategoriesWithParts();

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Onboarding Taxonomy Manager</h1>
                <p className="text-gray-500">Manage categories, body parts, and icons for the V5 flow.</p>
            </div>

            <OnboardingManager initialData={data} />
        </div>
    );
}
