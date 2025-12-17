'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { updateOnboardingSession, uploadMedicalDocument } from '@/app/actions/onboarding_v5';
import { Button } from '@/components/ui/button';
import { getNextScreen } from '@/lib/onboarding/v5/questionFlows';
import { ProgressBar } from '@/components/onboarding/v5/shared/ProgressBar';
import { OnboardingFormState } from '@/lib/onboarding/v5/types';
import { Loader2, Camera, Image as ImageIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import FeedbackSheet from '@/components/onboarding/v5/shared/FeedbackSheet';

interface SymptomsClientProps {
    sessionId: string;
    concernDetails: any;
    symptoms: any[];
    sessionData: any;
}

export default function SymptomsClient({ sessionId, concernDetails, symptoms, sessionData }: SymptomsClientProps) {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

    // Image Upload State
    const [uploadedImage, setUploadedImage] = useState<{ url: string, id: string } | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        // Pre-select if already saved
        if (sessionData?.symptoms_selected && Array.isArray(sessionData.symptoms_selected)) {
            setSelectedSymptoms(sessionData.symptoms_selected);
        }
        // TODO: Could pre-load existing images if we fetched them
    }, [sessionData]);

    const toggleSymptom = (symptomId: string) => {
        setSelectedSymptoms(prev =>
            prev.includes(symptomId)
                ? prev.filter(id => id !== symptomId)
                : [...prev, symptomId]
        );
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('documentType', 'other'); // Or 'symptom_image'
        formData.append('sessionId', sessionId);
        formData.append('notes', 'Uploaded during symptoms selection');
        // Hack: Use today's date if needed
        formData.append('documentDate', new Date().toISOString().split('T')[0]);

        try {
            const result = await uploadMedicalDocument(formData) as any;
            setUploadedImage({
                url: result.document.file_url,
                id: result.document.id
            });
            toast.success('Image uploaded successfully');
        } catch (error) {
            console.error('Upload failed:', error);
            toast.error('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleContinue = async () => {
        setSubmitting(true);
        try {
            // Update session
            await updateOnboardingSession({
                sessionId,
                symptoms: selectedSymptoms.length > 0 ? selectedSymptoms : ['none_specified']
            });

            // Calculate next path using shared logic
            const partialState: OnboardingFormState = {
                currentStep: 4,
                sessionId,
                bodyPart: sessionData?.body_part || 'unknown',
                primaryConcern: sessionData?.primary_concern || 'unknown',
                selectedSymptoms: selectedSymptoms,
                ageRange: sessionData?.age_range || '',
                previousDiagnosis: null,
                urgencyLevel: null,
                priorities: {}
            };

            const nextPath = getNextScreen(partialState);
            router.push(`${nextPath}?sessionId=${sessionId}`);
        } catch (e) {
            console.error('Failed to update symptoms', e);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto flex flex-col min-h-[80vh]">
            <ProgressBar currentStep={3} totalSteps={6} className="mb-8" />

            <div className="flex-1">
                <h1 className="text-2xl font-bold mb-2 text-primary text-center">
                    {concernDetails?.name_en || 'Symptoms Check'}
                </h1>
                <p className="text-center text-muted-foreground mb-8">
                    {concernDetails?.description_en || 'Select all symptoms that apply to you'}
                </p>

                <div className="space-y-3 mb-8">
                    {symptoms.length === 0 ? (
                        <div className="text-center p-8 bg-slate-50 rounded-lg">
                            <p>No specific symptoms listed for this concern. You can skip or describe below.</p>
                        </div>
                    ) : (
                        symptoms.map((symptom) => (
                            <div
                                key={symptom.id}
                                onClick={() => toggleSymptom(symptom.id)}
                                className={cn(
                                    "p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-4",
                                    selectedSymptoms.includes(symptom.id)
                                        ? "border-primary bg-primary/5"
                                        : "border-transparent bg-white shadow-sm hover:border-slate-200"
                                )}
                            >
                                <span className="text-2xl">{symptom.icon || '⚕️'}</span>
                                <div>
                                    <h3 className="font-medium text-slate-900">{symptom.name_en}</h3>
                                    {symptom.description_en && (
                                        <p className="text-sm text-slate-500">{symptom.description_en}</p>
                                    )}
                                </div>
                                <div className="ml-auto">
                                    <div className={cn(
                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                        selectedSymptoms.includes(symptom.id)
                                            ? "border-primary bg-primary"
                                            : "border-slate-300"
                                    )}>
                                        {selectedSymptoms.includes(symptom.id) && (
                                            <div className="w-2 h-2 bg-white rounded-full" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* VISUAL SYMPTOMS / UPLOAD SECTION */}
                <div className="mb-8 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <h3 className="font-semibold text-slate-900 mb-2">Visual Indicators?</h3>
                    <p className="text-sm text-slate-500 mb-4">
                        If you have visible symptoms (like redness, swelling, or a rash), uploading a photo helps our doctors triaging.
                    </p>

                    {uploadedImage ? (
                        <div className="relative rounded-lg overflow-hidden border border-slate-200">
                            <img src={uploadedImage.url} alt="Uploaded symptom" className="w-full h-48 object-cover" />
                            <button
                                onClick={() => setUploadedImage(null)}
                                className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            <div className="bg-emerald-50 text-emerald-600 text-xs font-medium p-2 text-center flex items-center justify-center gap-1">
                                <ImageIcon className="w-3 h-3" /> Image attached
                            </div>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <label
                                className={cn(
                                    "flex-1 flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-primary/50 hover:bg-slate-50 transition-all",
                                    uploading && "opacity-50 pointer-events-none"
                                )}
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                />
                                {uploading ? (
                                    <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
                                ) : (
                                    <>
                                        <Camera className="w-6 h-6 text-primary mb-1" />
                                        <span className="text-sm font-medium text-slate-600">Take Photo</span>
                                    </>
                                )}
                            </label>

                            <label
                                className={cn(
                                    "flex-1 flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-primary/50 hover:bg-slate-50 transition-all",
                                    uploading && "opacity-50 pointer-events-none"
                                )}
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                />
                                {uploading ? (
                                    <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
                                ) : (
                                    <>
                                        <ImageIcon className="w-6 h-6 text-primary mb-1" />
                                        <span className="text-sm font-medium text-slate-600">Upload</span>
                                    </>
                                )}
                            </label>
                        </div>
                    )}
                </div>

                <FeedbackSheet sessionId={sessionId} stepName="Symptoms" />
            </div>

            <div className="pt-8 mt-auto sticky bottom-0 bg-white/80 backdrop-blur-md pb-8">
                <Button
                    onClick={handleContinue}
                    disabled={submitting || uploading}
                    className="w-full h-12 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                    {submitting ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Updating...
                        </div>
                    ) : (
                        selectedSymptoms.length === 0 && !uploadedImage ? 'Skip / No Symptoms' : 'Continue'
                    )}
                </Button>
            </div>
        </div>
    );
}

