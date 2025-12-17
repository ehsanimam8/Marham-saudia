import { Suspense } from 'react';
import { getAdminConcerns, getAdminSymptoms, getAdminQuestions } from '@/app/actions/admin_taxonomy';
import MedicalDataManager from '@/components/admin/MedicalDataManager';

export default async function MedicalDataPage() {
    // Parallel data fetch
    const [concerns, symptoms, questions] = await Promise.all([
        getAdminConcerns(),
        getAdminSymptoms(),
        getAdminQuestions()
    ]);

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Medical Taxonomy</h1>
                    <p className="text-muted-foreground">
                        Manage concerns, symptoms, and diagnostic questions.
                    </p>
                </div>
            </div>

            <Suspense fallback={<div>Loading data...</div>}>
                <MedicalDataManager
                    initialConcerns={concerns}
                    initialSymptoms={symptoms}
                    initialQuestions={questions}
                />
            </Suspense>
        </div>
    );
}
