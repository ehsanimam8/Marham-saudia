'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquarePlus } from 'lucide-react';
import { updateOnboardingSession } from '@/app/actions/onboarding_v5';
import { toast } from 'sonner';

interface FeedbackSheetProps {
    sessionId: string;
    stepName: string; // To track where feedback came from
    triggerText?: string;
}

export default function FeedbackSheet({ sessionId, stepName, triggerText = "Can't find what you're looking for?" }: FeedbackSheetProps) {
    const [open, setOpen] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!feedback.trim()) return;
        setSubmitting(true);
        try {
            await updateOnboardingSession({
                sessionId,
                userFeedback: `[Step: ${stepName}] ${feedback}`
            });
            toast.success('Thanks for your feedback!');
            setFeedback('');
            setOpen(false);
        } catch (e) {
            console.error(e);
            toast.error('Failed to send feedback');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="text-sm text-slate-400 hover:text-slate-600 underline decoration-dotted transition-colors flex items-center gap-2 mx-auto mt-4">
                    <MessageSquarePlus className="w-4 h-4" />
                    {triggerText}
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Tell us more</DialogTitle>
                    <DialogDescription>
                        If you can't find what you're looking for or have a suggestion, please let us know.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <Textarea
                        placeholder="Type your feedback here..."
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="min-h-[150px] resize-none"
                    />
                    <Button
                        onClick={handleSubmit}
                        disabled={submitting || !feedback.trim()}
                        className="w-full bg-slate-900 text-white"
                    >
                        {submitting ? 'Sending...' : 'Send Feedback'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
