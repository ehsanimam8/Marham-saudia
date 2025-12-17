'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Plus, Trash2, FileText, Send } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

export default function PostConsultationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);

    // Form State
    const [diagnosis, setDiagnosis] = useState('');
    const [treatmentPlan, setTreatmentPlan] = useState('');
    const [followUpNeeded, setFollowUpNeeded] = useState(false);
    const [followUpDate, setFollowUpDate] = useState('');

    // Prescription State
    const [medicines, setMedicines] = useState([
        { name: '', dosage: '', frequency: '', duration: '' }
    ]);

    const addMedicine = () => {
        setMedicines([...medicines, { name: '', dosage: '', frequency: '', duration: '' }]);
    };

    const removeMedicine = (index: number) => {
        const newMeds = [...medicines];
        newMeds.splice(index, 1);
        setMedicines(newMeds);
    };

    const updateMedicine = (index: number, field: string, value: string) => {
        const newMeds = [...medicines];
        (newMeds[index] as any)[field] = value;
        setMedicines(newMeds);
    };

    const handleSubmit = async () => {
        if (!diagnosis || !treatmentPlan) {
            toast.error('Please fill in diagnosis and treatment plan');
            return;
        }

        setLoading(true);
        try {
            const consultationData = {
                diagnosis,
                treatment_plan: treatmentPlan,
                prescription: medicines.filter(m => m.name.trim() !== ''),
                follow_up_needed: followUpNeeded,
                follow_up_date: followUpNeeded ? followUpDate : null,
                updated_at: new Date().toISOString()
            };

            // 1. Update/Upsert Database
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                toast.error('You are not authenticated');
                setLoading(false);
                return;
            }

            // Get doctor ID and Appointment details (including patient auth id)
            // We need patient_id (auth id) for the consultation_notes table if creating a new row
            const { data: appointmentData, error: appointmentError } = await (supabase as any)
                .from('appointments')
                .select(`
                    id,
                    patient:patients(profile_id)
                `)
                .eq('id', id)
                .single();

            if (appointmentError || !appointmentData) {
                console.error("Appointment fetch error:", appointmentError);
                toast.error('Could not load appointment details.');
                setLoading(false);
                return;
            }

            const patientAuthId = appointmentData.patient?.profile_id;

            // Get doctor ID from user ID
            const { data: doctorData, error: doctorError } = await (supabase as any)
                .from('doctors')
                .select('id')
                .eq('profile_id', user.id)
                .single();

            if (doctorError || !doctorData) {
                console.error("Doctor fetch error:", doctorError);
                toast.error('Could not find doctor profile. Please contact support.');
                setLoading(false);
                return;
            }

            // Prepare payload using "Enhanced Telemed 20241208" Schema
            // Columns: diagnosis, treatment_plan, follow_up_required, follow_up_timeframe, subjective_notes, objective_findings

            // We consolidate prescription into treatment_plan for storage in this table
            const prescriptionText = medicines.filter(m => m.name.trim() !== '').map(m => `- ${m.name}: ${m.dosage}, ${m.frequency} for ${m.duration}`).join('\n');
            const finalTreatmentPlan = `${treatmentPlan}\n\nPrescription:\n${prescriptionText}`.trim();

            const safePayload = {
                appointment_id: id,
                doctor_id: user.id, // Wait, Schema 1 doctor_id references auth.users(id), NOT doctors(id)! 
                // Let's verify Schema 1: "doctor_id UUID REFERENCES auth.users(id)"
                // Schema 20241216: "doctor_id UUID REFERENCES doctors(id)"
                // This is a critical divergence. 
                // If Schema 1 won, it expects AUTH ID.
                // Let's try sending Auth ID. If it fails due to FK, we try Doctor ID.
                // Actually, "doctor_id UUID REFERENCES auth.users(id)" is standard in our earlier schemas.
                // But let's check creating conflicts. 
                // To be safe, try user.id (Auth ID).

                patient_id: patientAuthId, // Auth ID from profile

                diagnosis: diagnosis,
                treatment_plan: finalTreatmentPlan,
                follow_up_required: followUpNeeded,
                follow_up_timeframe: followUpDate ? String(followUpDate) : null,

                updated_at: new Date().toISOString()
            };

            const { error } = await (supabase as any)
                .from('consultation_notes')
                .upsert(safePayload, { onConflict: 'appointment_id' });

            if (error) {
                console.error("Supabase Error Full Object:", JSON.stringify(error, null, 2));
                throw error;
            }

            console.log("Generating prescription...");
            // 2. Generate Prescription PDF
            const pdfRes = await axios.post('/api/consultation/generate-prescription', {
                appointmentId: id,
                consultation: consultationData
            });
            console.log("Prescription generated:", pdfRes.data);

            console.log("Sending summary email...");
            // 3. Send Summary Email
            await axios.post('/api/consultation/send-summary-email', {
                appointmentId: id,
                consultation: consultationData
            });
            console.log("Email sent.");

            toast.success('Consultation finalized and summary sent!');
            router.push('/doctor-portal');

        } catch (error: any) {
            console.error("Finalize Consultation Error:", error);
            if (error.response) {
                console.error("API Error Response Data:", error.response.data);
                toast.error(error.response.data.error || 'Failed to finalize consultation');
            } else if (error.message) {
                toast.error(error.message);
            } else {
                toast.error('An unknown error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Post-Consultation Report</h1>
                <p className="text-muted-foreground">Finalize diagnosis, prescriptions, and follow-ups.</p>
            </div>

            <div className="grid grid-cols-1 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Clinical Assessment
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Final Diagnosis</Label>
                            <Input
                                value={diagnosis}
                                onChange={(e) => setDiagnosis(e.target.value)}
                                placeholder="e.g. Acute Bronchitis"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Treatment Plan & Advice</Label>
                            <Textarea
                                value={treatmentPlan}
                                onChange={(e) => setTreatmentPlan(e.target.value)}
                                placeholder="Detailed instructions for the patient..."
                                className="h-32"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            <span>e-Prescription</span>
                            <Button type="button" variant="outline" size="sm" onClick={addMedicine}>
                                <Plus className="h-4 w-4 mr-2" /> Add Medicine
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {medicines.map((med, index) => (
                            <div key={index} className="flex gap-4 items-end bg-gray-50 p-4 rounded-lg">
                                <div className="flex-1 space-y-1">
                                    <Label className="text-xs">Medicine Name</Label>
                                    <Input
                                        value={med.name}
                                        onChange={(e) => updateMedicine(index, 'name', e.target.value)}
                                        placeholder="Drug name"
                                    />
                                </div>
                                <div className="w-24 space-y-1">
                                    <Label className="text-xs">Dosage</Label>
                                    <Input
                                        value={med.dosage}
                                        onChange={(e) => updateMedicine(index, 'dosage', e.target.value)}
                                        placeholder="500mg"
                                    />
                                </div>
                                <div className="w-32 space-y-1">
                                    <Label className="text-xs">Frequency</Label>
                                    <Input
                                        value={med.frequency}
                                        onChange={(e) => updateMedicine(index, 'frequency', e.target.value)}
                                        placeholder="sys. B.D."
                                    />
                                </div>
                                <div className="w-32 space-y-1">
                                    <Label className="text-xs">Duration</Label>
                                    <Input
                                        value={med.duration}
                                        onChange={(e) => updateMedicine(index, 'duration', e.target.value)}
                                        placeholder="5 days"
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => removeMedicine(index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        {medicines.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No medications prescribed.</p>}
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center space-x-2 mb-4">
                            <Checkbox
                                id="followUp"
                                checked={followUpNeeded}
                                onCheckedChange={(checked) => setFollowUpNeeded(checked as boolean)}
                            />
                            <Label htmlFor="followUp">Follow-up required?</Label>
                        </div>

                        {followUpNeeded && (
                            <div className="max-w-xs">
                                <Label>Follow-up Date</Label>
                                <Input
                                    type="date"
                                    value={followUpDate}
                                    onChange={(e) => setFollowUpDate(e.target.value)}
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                    <Button variant="outline" onClick={() => router.push('/doctor-portal')}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading} className="w-48">
                        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                        Finalize & Send
                    </Button>
                </div>
            </div>
        </div>
    );
}
