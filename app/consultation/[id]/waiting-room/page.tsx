'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

import { ConsultationLanguageProvider, useConsultationLanguage } from '@/app/consultation/LanguageProvider';

function WaitingRoomContent({ id }: { id: string }) {
    const router = useRouter();
    const supabase = createClient();
    const { t } = useConsultationLanguage();
    const [loading, setLoading] = useState(true);
    const [appointment, setAppointment] = useState<any>(null);

    useEffect(() => {
        fetchAppointment();

        // Subscribe to appointment changes (to see when doctor joins/starts)
        const channel = supabase
            .channel(`appointment_${id}`)
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'appointments',
                filter: `id=eq.${id}`
            }, (payload: any) => {
                if (payload.new.status === 'in_progress') {
                    toast.success(t.doctorJoined);
                    router.push(`/consultation/${id}/room`);
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [id]);

    const fetchAppointment = async () => {
        try {
            // Using more standard query format to ensure relationships work
            const { data, error } = await (supabase as any)
                .from('appointments')
                .select(`
                    *,
                    doctor:doctors (
                        profile_photo_url,
                        profile:profiles (
                            full_name_en,
                            full_name_ar
                        )
                    )
                `)
                .eq('id', id)
                .single();

            if (error) {
                console.error("Fetch Appointment Error:", JSON.stringify(error, null, 2));
                throw error;
            }
            setAppointment(data);

            const appt = data as any;

            // Safety check: if pre-consultation is not done, redirect back
            if (!appt.pre_consultation_completed) {
                toast.error(t.completePreConsultFirst || 'Please complete pre-consultation first');
                router.push(`/consultation/${id}/pre-consultation`);
                return;
            }

            if (appt && appt.status === 'in_progress') {
                router.push(`/consultation/${id}/room`);
            }
        } catch (error) {
            console.error("Full Error Object:", error);
            toast.error('Failed to load appointment details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">{t.waitingTitle}</CardTitle>
                    <p className="text-muted-foreground">{t.waitingDesc}</p>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="bg-primary/5 p-4 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Clock className="text-primary h-5 w-5" />
                            <span className="font-medium">{t.estimatedWait}</span>
                        </div>
                        <span className="text-lg font-bold text-primary">~5 {t.minutes}</span>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-medium text-sm text-gray-500 uppercase tracking-wider">{t.systemCheck}</h3>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-green-600">
                                <CheckCircle className="h-4 w-4" />
                                <span className="text-sm">{t.camera}</span>
                            </div>
                            <div className="flex items-center gap-2 text-green-600">
                                <CheckCircle className="h-4 w-4" />
                                <span className="text-sm">{t.mic}</span>
                            </div>
                            <div className="flex items-center gap-2 text-green-600">
                                <CheckCircle className="h-4 w-4" />
                                <span className="text-sm">{t.internet}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-yellow-50 p-3 rounded border border-yellow-200 text-sm text-yellow-800">
                        {t.keepOpen}
                    </div>

                    {appointment?.doctor && (
                        <div className="flex items-center gap-4 pt-4 border-t">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={appointment.doctor.profile_photo_url} />
                                <AvatarFallback>DR</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Doctor</p>
                                <p className="font-medium">{appointment.doctor.profile?.full_name_en}</p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default function WaitingRoomPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    return (
        <ConsultationLanguageProvider>
            <WaitingRoomContent id={id} />
        </ConsultationLanguageProvider>
    );
}
