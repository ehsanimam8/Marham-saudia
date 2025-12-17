'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import DailyVideoRoom from '@/components/video/DailyVideoRoom';

export const dynamic = 'force-dynamic';

import { Loader2, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

import { ConsultationLanguageProvider, useConsultationLanguage } from '../../LanguageProvider';

function ConsultationRoomContent({ id }: { id: string }) {
    const { t } = useConsultationLanguage();
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    const [url, setUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Join the room (get token)
        const joinRoom = async () => {
            try {
                const { data } = await axios.post('/api/consultation/join-token', {
                    appointmentId: id
                });

                if (data.success) {
                    setToken(data.token);
                    setUrl(data.url);
                } else {
                    toast.error('Failed to join consultation');
                    router.push(`/consultation/${id}/waiting-room`);
                }
            } catch (error) {
                console.error(error);
                toast.error(t.error);
            } finally {
                setLoading(false);
            }
        };

        joinRoom();

        // Listen for consultation completion
        const supabase = createClient();
        const channel = supabase
            .channel(`consultation_status_${id}`)
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'appointments',
                filter: `id=eq.${id}`
            }, (payload) => {
                if (payload.new.status === 'completed') {
                    // Slight delay to ensure user sees any "ended call" UI if handled by DailyVideoRoom
                    // But usually we want to take them away immediately or let them read a toast.
                    // Daily onLeave handles manual leave, but this is the doctor ending it.
                    router.push(`/consultation/${id}/thank-you`);
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [id]);

    const handleLeave = () => {
        if (confirm(t.leaveConfirm)) {
            // Note: Doctor ends it usually, but patient can leave
            router.push('/dashboard');
        };
    };

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-gray-900 text-white">
                <Loader2 className="h-10 w-10 animate-spin" />
                <span className="ml-3">{t.connecting}</span>
            </div>
        );
    }

    if (!url || !token) return null;

    return (
        <div className="h-screen w-full bg-gray-950">
            <DailyVideoRoom url={url} token={token} onLeave={handleLeave} />

            {/* Privacy Badge Overlay */}
            <div className="absolute bottom-4 left-4 z-50 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm border border-white/10 pointer-events-none">
                <ShieldCheck className="w-4 h-4 text-green-400" />
                <span className="font-medium">End-to-End Encrypted & Private</span>
            </div>

            {/* Chat Overlay */}
            <ChatOverlay appointmentId={id} />
        </div >
    );
}

import ConsultationChat from '@/components/consultation/ConsultationChat';
import { MessageCircle, Minimize2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

function ChatOverlay({ appointmentId }: { appointmentId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id || null));
    }, []);

    if (!userId) return null;

    return (
        <div className="absolute bottom-4 right-4 z-50 flex flex-col items-end gap-2">
            {isOpen ? (
                <div className="w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden flex flex-col">
                    <div className="bg-primary text-primary-foreground p-2 flex justify-between items-center text-sm font-medium">
                        <span>Chat with Doctor</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-white hover:bg-white/20" onClick={() => setIsOpen(false)}>
                            <Minimize2 className="h-4 w-4" />
                        </Button>
                    </div>
                    <ConsultationChat appointmentId={appointmentId} userRole="patient" userId={userId} className="flex-1" />
                </div>
            ) : (
                <Button
                    className="h-14 w-14 rounded-full shadow-xl bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => setIsOpen(true)}
                >
                    <MessageCircle className="h-6 w-6" />
                </Button>
            )}
        </div>
    );
}

export default function ConsultationRoomPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    return (
        <ConsultationLanguageProvider>
            <ConsultationRoomContent id={id} />
        </ConsultationLanguageProvider>
    );
}
