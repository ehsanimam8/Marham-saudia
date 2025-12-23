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
    category?: string;
}

export default function SymptomsClient({ sessionId, concernDetails, symptoms, sessionData, category }: SymptomsClientProps) {
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
            toast.success('تم رفع الصورة بنجاح');
        } catch (error) {
            console.error('Upload failed:', error);
            toast.error('فشل في رفع الصورة. يرجى المحاولة مرة أخرى.');
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

    const isBeauty = category === 'beauty' || category === 'cosmetic';

    // Mock images for beauty enhancements (In production, these would be real assets)
    // Keys match keywords in concern name (lowercase)
    // Mock images for beauty enhancements (In production, these would be real assets)
    // Keys match keywords in concern name (lowercase)
    const BEAUTY_ENHANCEMENTS: Record<string, { id: string; name: string; description?: string; image: string }[]> = {
        'lip': [
            {
                id: 'shape_natural',
                name: 'Natural Definition',
                description: 'Subtle enhancement of your natural shape',
                image: '/images/enhancements/lip_natural.png'
            },
            {
                id: 'shape_russian',
                name: 'Russian Lips',
                description: 'Height and heart-shape emphasis',
                image: '/images/enhancements/lip_russian.png'
            },
            {
                id: 'shape_volume',
                name: 'Full Volume',
                description: 'Overall plumping for a glamorous look',
                image: '/images/enhancements/lip_volume.png'
            },
            {
                id: 'shape_correction',
                name: 'Symmetry Correction',
                description: 'Balancing uneven contours',
                image: '/images/enhancements/lip_symmetry.png'
            },
        ],
        'breast': [
            {
                id: 'shape_natural_enhanced',
                name: 'Natural Enhancement',
                description: 'Subtle volume increase maintaining natural slope',
                image: '/images/enhancements/breast_natural_clothed.png'
            },
            {
                id: 'shape_lift',
                name: 'Rejuvenated Lift',
                description: 'Restoring youthful position and firmness',
                image: '/images/enhancements/breast_lift_clothed.png'
            },
            {
                id: 'shape_implant_look',
                name: 'High Profile',
                description: 'Full upper pole and rounded aesthetic',
                image: '/images/enhancements/breast_implant_clothed.png'
            },
            {
                id: 'shape_reduction',
                name: 'Comfort Reduction',
                description: 'Proportional, lighter, and athletic contour',
                image: '/images/enhancements/breast_reduction_clothed.png'
            }
        ]
    };
    // Map 'chest' or other terms to 'breast' if needed via the key search logic
    // The key search below checks 'concernDetails.name_en' includes 'breast' or 'chest' etc.
    // If we want 'chest' to trigger 'breast' options, we can add 'chest' key or ensure lookup handles it.
    BEAUTY_ENHANCEMENTS['chest'] = BEAUTY_ENHANCEMENTS['breast'];

    // Determine if we have custom visual options for this concern
    const visualOptionsKey = Object.keys(BEAUTY_ENHANCEMENTS).find(key =>
        concernDetails?.name_en?.toLowerCase().includes(key) ||
        concernDetails?.name_ar?.includes(key)
    );

    const visualOptions = visualOptionsKey ? BEAUTY_ENHANCEMENTS[visualOptionsKey] : null;

    return (
        <div className="w-full max-w-md mx-auto flex flex-col min-h-[80vh]">
            <ProgressBar currentStep={3} totalSteps={6} className="mb-8" />

            <div className="flex-1">
                <h1 className="text-2xl font-bold mb-2 text-primary text-center font-arabic">
                    {concernDetails?.name_ar || (isBeauty ? 'اختاري النتيجة المثالية' : 'فحص الأعراض')}
                </h1>
                <p className="text-center text-muted-foreground mb-8 font-arabic">
                    {concernDetails?.description_ar || (isBeauty ? 'اختاري المظهر الذي ترغبين في تحقيقه' : 'حددي جميع الأعراض التي تنطبق عليك')}
                </p>

                <div className="space-y-3 mb-8">
                    {visualOptions ? (
                        <div className="grid grid-cols-2 gap-4">
                            {visualOptions.map((option) => (
                                <div
                                    key={option.id}
                                    onClick={() => toggleSymptom(option.id)}
                                    className={cn(
                                        "relative overflow-hidden rounded-2xl border-2 transition-all cursor-pointer group",
                                        selectedSymptoms.includes(option.id)
                                            ? "border-primary ring-2 ring-primary/20 ring-offset-2"
                                            : "border-transparent shadow-sm hover:border-slate-200"
                                    )}
                                >
                                    <div className="aspect-[4/3] relative bg-slate-100">
                                        <div className="absolute inset-0 bg-slate-200 animate-pulse" /> {/* Placeholder while loading */}
                                        <img
                                            src={option.image}
                                            alt={option.name}
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
                                            <h3 className="font-bold text-white text-sm font-arabic">{option.name}</h3>
                                            {option.description && (
                                                <p className="text-white/80 text-xs line-clamp-1 font-arabic">{option.description}</p>
                                            )}
                                        </div>

                                        {/* Selection Indicator */}
                                        <div className={cn(
                                            "absolute top-2 right-2 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center transition-colors",
                                            selectedSymptoms.includes(option.id)
                                                ? "bg-primary border-primary"
                                                : "bg-black/30 backdrop-blur-sm"
                                        )}>
                                            {selectedSymptoms.includes(option.id) && (
                                                <div className="w-2.5 h-2.5 bg-white rounded-full" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : symptoms.length === 0 ? (
                        <div className="text-center p-8 bg-slate-50 rounded-lg font-arabic">
                            <p>{isBeauty ? 'لا توجد خيارات محددة مسجلة. يمكنك وصف أهدافك أدناه.' : 'لا توجد أعراض محددة مسجلة لهذا القلق. يمكنك التخطي أو الوصف أدناه.'}</p>
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
                                <span className="text-2xl">{symptom.icon || (isBeauty ? '✨' : '⚕️')}</span>
                                <div className="font-arabic">
                                    <h3 className="font-medium text-slate-900">{symptom.name_ar || symptom.name_en}</h3>
                                    {(symptom.description_ar || symptom.description_en) && (
                                        <p className="text-sm text-slate-500">{symptom.description_ar || symptom.description_en}</p>
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
                <div className="mb-8 bg-white p-4 rounded-xl border border-slate-100 shadow-sm font-arabic">
                    <h3 className="font-semibold text-slate-900 mb-2">{isBeauty ? 'الصورة الحالية (اختياري)' : 'مؤشرات بصرية؟'}</h3>
                    <p className="text-sm text-slate-500 mb-4">
                        {isBeauty
                            ? 'قومي بتحميل صورة للمنطقة التي تريدين تحسينها لمساعدتنا في اقتراح أفضل إجراء.'
                            : 'إذا كان لديك أعراض مرئية (مثل الاحمرار أو التورم أو الطفح الجلدي)، فإن تحميل صورة يساعد أطباءنا في التشخيص.'}
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
                                <ImageIcon className="w-3 h-3" /> تم إرفاق الصورة
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
                                        <span className="text-sm font-medium text-slate-600 font-arabic">التقاط صورة</span>
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
                                        <span className="text-sm font-medium text-slate-600 font-arabic">تحميل</span>
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
                    className="w-full h-12 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all font-arabic"
                >
                    {submitting ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            جاري التحميل...
                        </div>
                    ) : (
                        selectedSymptoms.length === 0 && !uploadedImage ? 'تخطي / لا توجد أعراض' : 'متابعة'
                    )}
                </Button>
            </div>
        </div>
    );
}

