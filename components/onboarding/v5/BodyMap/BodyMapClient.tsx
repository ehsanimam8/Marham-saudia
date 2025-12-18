'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createOnboardingSession, getOnboardingCategories, getBodyParts } from '@/app/actions/onboarding_v5';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Activity, Sparkles, Brain, User, Heart, Smile, Wind, Scale, Baby, Stethoscope, Eye, Hand, Ear } from 'lucide-react';
import { BodyPart } from '@/lib/onboarding/v5/types';
import Image from 'next/image';

// Icon mapping for standard icons
const ICON_MAP: Record<string, any> = {
    Activity, Sparkles, Brain, Heart, Smile, Wind, Scale, Baby, User, Stethoscope, Eye, Hand, Ear
};

export default function BodyMapClient() {
    const router = useRouter();
    const [step, setStep] = useState<'category' | 'bodyPart'>('category');
    const [isLoading, setIsLoading] = useState(false);
    const [isDataLoading, setIsDataLoading] = useState(true);

    // Dynamic Data State
    const [categories, setCategories] = useState<any[]>([]);
    const [bodyParts, setBodyParts] = useState<BodyPart[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // Initial Data Fetch
    useEffect(() => {
        const fetchData = async () => {
            try {
                const cats = await getOnboardingCategories();
                setCategories(cats);
            } catch (err) {
                console.error("Failed to fetch categories", err);
            } finally {
                setIsDataLoading(false);
            }
        };
        fetchData();
    }, []);

    // Fetch Body Parts when Category Selected
    useEffect(() => {
        if (selectedCategory) {
            const fetchParts = async () => {
                setIsDataLoading(true); // Re-use loading state for part fetching
                try {
                    const parts = await getBodyParts(selectedCategory);
                    setBodyParts(parts);
                } catch (err) {
                    console.error("Failed to fetch body parts", err);
                } finally {
                    setIsDataLoading(false);
                }
            };
            fetchParts();
        }
    }, [selectedCategory]);

    // Enhanced Icon Renderer
    const renderIcon = (iconIdentifier?: string, className?: string) => {
        if (!iconIdentifier) return <Activity className={className} />;

        // Check if it's an image URL
        if (iconIdentifier.startsWith('http') || iconIdentifier.startsWith('/') || iconIdentifier.includes('data:image')) {
            // For layout consistency, we wrap image in a div that respects the className sizing
            // Assuming className usually sets w-X h-X
            return (
                <div className={`${className} relative overflow-hidden rounded-none`}>
                    {/* Use img for simplicity or Next Image if domain is whitelisted. 
                         Using img ensures external URLs work without config changes. */}
                    <img
                        src={iconIdentifier}
                        alt="icon"
                        className="w-full h-full object-contain"
                    />
                </div>
            );
        }

        // It's a Lucide icon name
        const IconComponent = ICON_MAP[iconIdentifier] || ICON_MAP['Activity'];
        return <IconComponent className={className} />;
    };

    const handleCategorySelect = (catId: string) => {
        setSelectedCategory(catId);
        setStep('bodyPart');
    };

    const handleBackToCategories = () => {
        setStep('category');
        setSelectedCategory(null);
        setBodyParts([]); // Clear parts
    };

    const handleBodyPartSelect = async (partId: string) => {
        setIsLoading(true);
        try {
            const session = await createOnboardingSession(partId) as any;
            router.push(`/onboarding/v5/${partId}?sessionId=${session.id}`);
        } catch (error) {
            console.error('Failed to start session', error);
            // Fallback
            router.push(`/onboarding/v5/${partId}`);
        } finally {
            // setIsLoading(false);
        }
    };

    // Loading Screen
    if (isDataLoading && step === 'category') {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // STEP 1: CATEGORY SELECTION
    if (step === 'category') {
        return (
            <div className="flex flex-col items-center justify-center w-full max-w-5xl mx-auto p-6 min-h-[80vh]">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-teal-900 leading-tight">
                        How can we help you today?
                    </h1>
                    <p className="text-xl text-gray-500">
                        Choose the area that best matches your needs
                        <span className="block text-sm mt-2 font-arabic text-teal-600">اختر المجال الذي يناسب احتياجاتك</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategorySelect(cat.id)}
                            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-teal-500 hover:shadow-md transition-all duration-300 group flex flex-col items-center text-center h-full aspect-[4/5] md:aspect-auto justify-center relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-teal-50/0 to-teal-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="bg-teal-50 p-6 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-teal-100 relative z-10 w-24 h-24 flex items-center justify-center">
                                {renderIcon(cat.icon, "w-12 h-12 text-teal-600")}
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-teal-700 relative z-10">
                                {cat.name_en}
                            </h3>
                            <p className="text-gray-500 text-sm leading-relaxed mb-4 relative z-10">
                                {cat.description_en}
                            </p>
                            <p className="text-teal-600 font-arabic text-sm mt-auto relative z-10 font-medium">
                                {cat.name_ar}
                            </p>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    // STEP 2: BODY PART SELECTION (GRID)
    return (
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header with Back Button */}
            <div className="w-full flex items-center justify-between mb-10">
                <Button variant="ghost" onClick={handleBackToCategories} className="gap-2 text-gray-600 hover:text-teal-700 pl-0 hover:bg-transparent">
                    <ArrowLeft className="w-5 h-5" /> Change Category
                </Button>
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-teal-900">
                        {categories.find(c => c.id === selectedCategory)?.name_en}
                    </h2>
                    <p className="text-sm text-gray-500 font-arabic">
                        Select area of concern | {categories.find(c => c.id === selectedCategory)?.name_ar}
                    </p>
                </div>
                <div className="w-[140px]"></div> {/* Spacer */}
            </div>

            {(isLoading || (isDataLoading && bodyParts.length === 0)) ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-500">{isLoading ? 'Starting your session...' : 'Loading areas...'}</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
                    {bodyParts.map((part) => (
                        <button
                            key={part.id}
                            onClick={() => handleBodyPartSelect(part.id)}
                            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-teal-500 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group"
                        >
                            <div className="p-4 bg-gray-50 rounded-full mb-4 group-hover:bg-teal-50 transition-colors w-20 h-20 flex items-center justify-center">
                                {renderIcon(part.icon, "w-10 h-10 text-gray-600 group-hover:text-teal-600 transition-colors")}
                            </div>
                            <h3 className="font-semibold text-lg text-gray-800 group-hover:text-teal-700 transition-colors">
                                {part.nameEn}
                            </h3>
                            <p className="text-sm text-gray-400 font-arabic mt-1 group-hover:text-teal-600 transition-colors">
                                {part.nameAr}
                            </p>
                        </button>
                    ))}
                </div>
            )}

            {!isDataLoading && bodyParts.length === 0 && (
                <div className="text-center py-20 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200 w-full">
                    <p>No specific areas found for this category yet.</p>
                    <Button variant="link" onClick={handleBackToCategories}>Go back</Button>
                </div>
            )}

        </div>
    );
}

