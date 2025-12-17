'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import DailyVideoRoom from '@/components/video/DailyVideoRoom';
import { Loader2, FileText, CheckSquare, X, Paperclip, MessageCircle } from 'lucide-react';
import ConsultationChat from '@/components/consultation/ConsultationChat';


import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

export default function DoctorRoomPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const supabase = createClient();
    const [token, setToken] = useState<string | null>(null);
    const [url, setUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Real-time Notes State
    const [notes, setNotes] = useState('');
    const [observations, setObservations] = useState('');
    const [savingNotes, setSavingNotes] = useState(false);

    // State for all patient data
    const [patientData, setPatientData] = useState<any>(null);
    const [patientFiles, setPatientFiles] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState('notes');
    const [userId, setUserId] = useState<string | null>(null);
    const [unreadChatCount, setUnreadChatCount] = useState(0);

    useEffect(() => {
        // Get user ID
        supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id || null));

        // Join logic
        const joinRoom = async () => {
            try {
                const { data } = await axios.post('/api/consultation/join-token', {
                    appointmentId: id
                });

                if (data.success) {
                    setToken(data.token);
                    setUrl(data.url);
                    // Fetch existing notes and patient data
                    fetchNotes();
                    fetchPatientData();
                } else {
                    toast.error('Failed to join');
                }
            } catch (error) {
                console.error(error);
                toast.error('Error joining room');
            } finally {
                setLoading(false);
            }
        };
        joinRoom();

        // Chat subscription for unread count
        const chatChannel = supabase
            .channel(`chat_unread_${id}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'consultation_chats',
                filter: `appointment_id=eq.${id}`
            }, (payload) => {
                if (activeTab !== 'chat') {
                    setUnreadChatCount(prev => prev + 1);
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(chatChannel);
        };
    }, [id, activeTab]);

    const fetchNotes = async () => {
        const { data } = await (supabase as any)
            .from('consultation_notes')
            .select('notes, observations')
            .eq('appointment_id', id)
            .single();

        if (data) {
            const notesData = data as any;
            setNotes(notesData.notes || '');
            setObservations(notesData.observations || '');
        }
    };

    const fetchPatientData = async () => {
        const { data } = await (supabase as any)
            .from('pre_consultation_data')
            .select('*')
            .eq('appointment_id', id)
            .single();

        if (data) {
            setPatientData(data);
            if (data.uploaded_files) {
                setPatientFiles(data.uploaded_files);
            }
        }
    };

    // Auto-save notes helper (debounced in effect ideally, but simple for now)
    const saveNotes = async () => {
        setSavingNotes(true);
        try {
            // Check if row exists first or upsert logic
            const { data: existing } = await supabase.from('consultation_notes').select('id').eq('appointment_id', id).single();


            if (existing) {
                await (supabase as any).from('consultation_notes').update({
                    notes,
                    observations,
                    updated_at: new Date().toISOString()
                } as any).eq('appointment_id', id);
            } else {
                // We need doctor_id context, usually better handled by RLS/Auth user on insert
                // Let's assume user is authenticated doctor
                // We need doctor table id not auth id
                const user = (await supabase.auth.getUser()).data.user;
                const { data: doctor } = await supabase.from('doctors').select('id').eq('profile_id', user?.id || '').single();

                if (doctor) {
                    await (supabase as any).from('consultation_notes').insert({
                        appointment_id: id,
                        doctor_id: (doctor as any).id,
                        notes,
                        observations
                    });
                }
            }
        } catch (e) {
            console.error("Auto-save failed", e);
        } finally {
            setSavingNotes(false);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (notes || observations) saveNotes();
        }, 30000); // Auto-save every 30s

        return () => clearInterval(interval);
    }, [notes, observations]);

    const handleEndConsultation = async () => {
        if (confirm("Are you sure you want to end the consultation? This will disconnect the patient.")) {
            try {
                // Save final notes
                await saveNotes();

                const { data } = await axios.post('/api/consultation/end', {
                    appointmentId: id
                });

                if (data.success) {
                    router.push(`/doctor-portal/consultation/${id}/post-consultation`);
                }
            } catch (error) {
                toast.error('Failed to end consultation');
            }
        }
    };

    if (loading) return (
        <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
            <p>Initializing Consultation...</p>
        </div>
    );

    if (!url || !token) return (
        <div className="h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
                <div className="h-12 w-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <X className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Failed to load consultation</h3>
                <p className="text-gray-500 mb-6">Could not retrieve room details. Please try again.</p>
                <div className="flex gap-3 justify-center">
                    <Button variant="outline" onClick={() => router.push('/doctor-portal/dashboard')}>
                        Go Back
                    </Button>
                    <Button onClick={() => window.location.reload()}>
                        Retry
                    </Button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="h-screen w-full relative flex">
            {/* Main Video Area */}
            <div className="flex-1 bg-gray-900 relative">
                <DailyVideoRoom url={url} token={token} onLeave={handleEndConsultation} />
            </div>

            {/* Side Panel for Notes */}
            <div className="w-96 bg-white border-l h-full flex flex-col shadow-xl z-10 transition-transform">
                <div className="p-4 border-b bg-gray-50">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="info" className="flex items-center gap-2 text-xs">
                                <FileText className="h-3 w-3" />
                                {activeTab === 'info' ? '' : 'Info'}
                            </TabsTrigger>
                            <TabsTrigger value="notes" className="flex items-center gap-2 text-xs">
                                <CheckSquare className="h-3 w-3" />
                                Notes
                            </TabsTrigger>
                            <TabsTrigger value="files" className="flex items-center gap-2 text-xs">
                                <Paperclip className="h-3 w-3" />
                                Files
                            </TabsTrigger>
                            <TabsTrigger value="chat" className="flex items-center gap-2 text-xs relative">
                                <MessageCircle className="h-3 w-3" />
                                Chat
                                {unreadChatCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full border border-white">
                                        {unreadChatCount}
                                    </span>
                                )}
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                    {savingNotes && <div className="text-xs text-center text-gray-400 mt-2">Saving notes...</div>}
                </div>

                <div className={`flex-1 overflow-y-auto ${activeTab === 'chat' ? 'overflow-hidden flex flex-col' : 'p-4'}`}>
                    {activeTab === 'info' && (
                        <div className="space-y-6">
                            {patientData ? (
                                <>
                                    <div className="space-y-1">
                                        <h3 className="text-xs font-semibold text-gray-500 uppercase">Primary Complaint</h3>
                                        <div className="p-3 bg-blue-50 text-blue-900 rounded-md text-sm border border-blue-100">
                                            {patientData.current_symptoms}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <h3 className="text-xs font-semibold text-gray-500 uppercase">Duration</h3>
                                            <p className="text-sm font-medium">{patientData.symptom_duration}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-xs font-semibold text-gray-500 uppercase">Severity</h3>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                                ${patientData.severity_level === 'severe' ? 'bg-red-100 text-red-800' :
                                                    patientData.severity_level === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-green-100 text-green-800'}`}>
                                                {patientData.severity_level}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-1 border-t pt-4">
                                        <h3 className="text-xs font-semibold text-gray-500 uppercase">Medications</h3>
                                        {patientData.current_medications && patientData.current_medications.length > 0 ? (
                                            <ul className="list-disc pl-5 text-sm space-y-1">
                                                {patientData.current_medications.map((med: string, i: number) => (
                                                    <li key={i}>{med}</li>
                                                ))}
                                            </ul>
                                        ) : <p className="text-sm text-gray-400 italic">None reported</p>}
                                    </div>
                                    <div className="space-y-1 border-t pt-4">
                                        <h3 className="text-xs font-semibold text-gray-500 uppercase text-red-600">Allergies</h3>
                                        {patientData.allergies && patientData.allergies.length > 0 ? (
                                            <ul className="list-disc pl-5 text-sm space-y-1 text-red-600 font-medium">
                                                {patientData.allergies.map((alg: string, i: number) => (
                                                    <li key={i}>{alg}</li>
                                                ))}
                                            </ul>
                                        ) : <p className="text-sm text-gray-400 italic">None reported</p>}
                                    </div>
                                </>
                            ) : (
                                <div className="text-center text-gray-400 py-10">
                                    <p>Loading details...</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'notes' && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Clinical Observations</label>
                                <Textarea
                                    className="h-32 resize-none focus:ring-blue-500"
                                    placeholder="Note patient appearance, vital signs..."
                                    value={observations}
                                    onChange={(e) => setObservations(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Medical Notes</label>
                                <Textarea
                                    className="h-64 resize-none font-mono text-sm focus:ring-blue-500"
                                    placeholder="History, findings, plan..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'files' && (
                        <div className="space-y-4">
                            <h3 className="font-medium text-sm text-gray-500 uppercase tracking-wide">Patient Documents</h3>
                            {patientFiles.length === 0 ? (
                                <p className="text-sm text-gray-400 italic text-center py-8">No files shared by patient.</p>
                            ) : (
                                <ul className="space-y-3">
                                    {patientFiles.map((file, idx) => (
                                        <li key={idx} className="bg-gray-50 p-3 rounded-lg border hover:bg-gray-100 transition-colors">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-medium text-sm text-gray-800 truncate block w-full" title={file.name}>{file.name}</span>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full text-xs h-8"
                                                onClick={() => window.open(file.url, '_blank')}
                                            >
                                                View Document
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}

                    {activeTab === 'chat' && userId && (
                        <div className="flex-1 flex flex-col h-full">
                            <ConsultationChat appointmentId={id} userRole="doctor" userId={userId} className="flex-1 border-0 shadow-none h-full" />
                        </div>
                    )}
                </div>

                <div className="p-4 border-t bg-gray-50">
                    <Button variant="destructive" className="w-full" onClick={handleEndConsultation}>
                        End Consultation
                    </Button>
                </div>
            </div>
        </div>
    );
}
