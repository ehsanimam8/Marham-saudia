'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader2, FileText, ArrowRight, Clock, Video } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

export default function ConsultationDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [starting, setStarting] = useState(false);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch appointment with patient details and pre-consultation data
                const { data: appointment, error } = await supabase
                    .from('appointments')
                    .select(`
                    *,
                    patient:patients(
                        *,
                        profile:profiles(*)
                    ),
                    pre_consultation_data(*),
                    consultation_notes(*)
                `)
                    .eq('id', id)
                    .single();

                if (error) throw error;
                setData(appointment);
            } catch (e) {
                console.error(e);
                toast.error('Failed to load consultation details');
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [id]);

    const handleStartConsultation = async () => {
        setStarting(true);
        try {
            // Create room if not exists
            const { data } = await axios.post('/api/consultation/create-room', {
                appointmentId: id
            });

            if (data.success) {
                // Force a small delay or router refresh to ensure state propagation if needed, though usually not required
                router.refresh();
                router.push(`/doctor-portal/consultation/${id}/room`);
            } else {
                console.error("API Error Response:", data);
                throw new Error(data.error || 'Failed to create room');
            }
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.error || error.message || 'Could not start consultation';
            toast.error(msg);
            setStarting(false);
        }
    };

    if (loading) return <div className="p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    if (!data) return <div className="p-8">Consultation not found</div>;

    const preConsult = data.pre_consultation_data?.[0] || {};
    const notes = data.consultation_notes?.[0] || {};
    const patient = data.patient?.profile || {};
    const isCompleted = data.status === 'completed';

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Consultation Details</h1>
                    <p className="text-muted-foreground">{isCompleted ? 'Review consultation summary.' : 'Review patient information before starting the call.'}</p>
                </div>
                {!isCompleted && (
                    <Button onClick={handleStartConsultation} size="lg" disabled={starting}>
                        {starting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Video className="mr-2 h-4 w-4" />}
                        Start Consultation
                    </Button>
                )}
                {isCompleted && (
                    <Button variant="outline" onClick={() => router.push('/doctor-portal/appointments')}>
                        Back to Appointments
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Patient Profile */}
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>Patient</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600 mb-2">
                                {patient.full_name_en?.[0] || patient.full_name_ar?.[0] || 'P'}
                            </div>
                            <h3 className="font-semibold">{patient.full_name_en || patient.full_name_ar}</h3>
                            <p className="text-sm text-gray-500">{patient.gender} • {data.patient?.age || 'N/A'} yrs</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Content Area */}
                <div className="md:col-span-2 space-y-6">
                    {/* Consultation Report (If Completed) */}
                    {isCompleted && (
                        <Card className="border-teal-200 bg-teal-50/30">
                            <CardHeader>
                                <CardTitle className="text-teal-900 flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Consultation Report
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-1">Diagnosis</h4>
                                    <p className="text-gray-700 font-medium">{notes.diagnosis || 'No diagnosis recorded'}</p>
                                </div>

                                <div>
                                    <h4 className="font-medium text-gray-900 mb-1">Treatment Plan</h4>
                                    <p className="text-gray-600 whitespace-pre-line">{notes.treatment_plan || 'No treatment plan recorded'}</p>
                                </div>

                                {notes.prescription && notes.prescription.length > 0 && (
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-2">Prescription</h4>
                                        <div className="bg-white rounded-md border p-4 space-y-3">
                                            {notes.prescription.map((med: any, idx: number) => (
                                                <div key={idx} className="flex justify-between items-center border-b last:border-0 pb-2 last:pb-0">
                                                    <div>
                                                        <span className="font-medium text-gray-900">{med.name}</span>
                                                        <span className="text-gray-500 text-sm ml-2">{med.dosage}</span>
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        {med.frequency} for {med.duration}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {notes.follow_up_needed && (
                                    <div className="bg-yellow-50 p-3 rounded-md border border-yellow-100 flex items-center gap-2 text-yellow-800 text-sm">
                                        <Clock className="h-4 w-4" />
                                        <span>Follow-up recommended on <strong>{notes.follow_up_date}</strong></span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Pre-Consultation Data */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Clinical Information (Pre-Consultation)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h4 className="font-medium text-gray-900 mb-1">Chief Complaint</h4>
                                <p className="text-gray-600 bg-gray-50 p-3 rounded-md">{preConsult.current_symptoms || 'Not provided'}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-1">Duration</h4>
                                    <p className="text-gray-600">{preConsult.symptom_duration || '--'}</p>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-1">Severity</h4>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                    ${preConsult.severity_level === 'severe' ? 'bg-red-100 text-red-800' :
                                            preConsult.severity_level === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-green-100 text-green-800'}`}>
                                        {preConsult.severity_level || 'Unknown'}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium text-gray-900 mb-1">Current Medications</h4>
                                <p className="text-gray-600">{preConsult.current_medications?.length ? preConsult.current_medications.join(', ') : 'None reported'}</p>
                            </div>

                            <div>
                                <h4 className="font-medium text-gray-900 mb-1">Uploaded Files</h4>
                                {preConsult.uploaded_files && preConsult.uploaded_files.length > 0 ? (
                                    <ul className="space-y-2">
                                        {preConsult.uploaded_files.map((file: any, idx: number) => (
                                            <li key={idx}>
                                                <a href={file.url} target="_blank" rel="noreferrer" className="flex items-center text-blue-600 hover:underline">
                                                    <FileText className="h-4 w-4 mr-2" />
                                                    {file.name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                ) : <p className="text-gray-500 italic">No files uploaded</p>}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function VideoIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m22 8-6 4 6 4V8Z" />
            <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
        </svg>
    );
}
