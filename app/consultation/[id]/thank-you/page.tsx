
'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Star, Mail, CheckCircle, Home } from 'lucide-react';
import { toast } from 'sonner';
import { ConsultationLanguageProvider, useConsultationLanguage } from '@/app/consultation/LanguageProvider';

function ThankYouContent({ id }: { id: string }) {
    const { t } = useConsultationLanguage();
    const router = useRouter();
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async () => {
        // Here we would typically save the feedback to the backend
        // For now, we'll just simulate a successful submission
        setSubmitted(true);
        toast.success(t.feedbackSuccess || 'Thank you for your feedback!');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-lg text-center">
                <CardHeader>
                    <div className="mx-auto bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl">{t.consultationCompleted || 'Consultation Completed'}</CardTitle>
                    <CardDescription className="text-lg pt-2">
                        {t.thankYouMessage || 'Thank you for using Marham Saudi.'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Information Section */}
                    <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-4 text-left">
                        <Mail className="h-6 w-6 text-blue-600 shrink-0 mt-1" />
                        <div>
                            <h3 className="font-semibold text-blue-900">{t.checkEmail || 'Check your Inbox'}</h3>
                            <p className="text-sm text-blue-700 mt-1">
                                {t.emailNote || 'Your prescription and consultation notes have been sent to your registered email address.'}
                            </p>
                        </div>
                    </div>

                    {!submitted ? (
                        <div className="space-y-4 pt-4 border-t">
                            <h3 className="font-medium text-gray-900">{t.rateExperience || 'How was your experience?'}</h3>

                            <div className="flex justify-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setRating(star)}
                                        className={`transition-colors ${rating >= star ? 'text-yellow-400' : 'text-gray-200'} hover:text-yellow-400`}
                                    >
                                        <Star className="h-8 w-8 fill-current" />
                                    </button>
                                ))}
                            </div>

                            <Textarea
                                placeholder={t.feedbackPlaceholder || 'Share any additional feedback (optional)...'}
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                className="min-h-[100px]"
                            />

                            <Button
                                className="w-full"
                                onClick={handleSubmit}
                                disabled={rating === 0}
                            >
                                {t.submitFeedback || 'Submit Feedback'}
                            </Button>
                        </div>
                    ) : (
                        <div className="pt-4 border-t">
                            <p className="text-green-600 font-medium mb-6">
                                {t.feedbackSubmitted || 'Your feedback has been submitted successfully.'}
                            </p>
                            <Button variant="outline" className="w-full" onClick={() => router.push('/dashboard')}>
                                <Home className="mr-2 h-4 w-4" />
                                {t.backToDashboard || 'Back to Dashboard'}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default function ThankYouPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    return (
        <ConsultationLanguageProvider>
            <ThankYouContent id={id} />
        </ConsultationLanguageProvider>
    );
}
