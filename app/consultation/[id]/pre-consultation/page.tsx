'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from 'sonner';
import { Loader2, Upload } from 'lucide-react';

import { ConsultationLanguageProvider, useConsultationLanguage } from '@/app/consultation/LanguageProvider';

function PreConsultationContent({ id }: { id: string }) {
    const router = useRouter();
    const supabase = createClient();
    const { t } = useConsultationLanguage();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        current_symptoms: '',
        symptom_duration: '',
        severity_level: 'moderate',
        current_medications: '',
        allergies: '',
        uploaded_files: [] as any[]
    });

    const [existingRecords, setExistingRecords] = useState<any[]>([]);
    const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
    const [loadingRecords, setLoadingRecords] = useState(true);

    useEffect(() => {
        const fetchRecords = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Get patient profile first to ensure we match correctly? 
            // Or usually medical_documents are linked to user_id or patient_id.
            // Let's assume user_id or profile_id reference.
            // Checking logical assumption: medical_documents usually has patient_id or user_id.
            // Let's try fetching by patient_id linked to auth user.

            const { data: patient } = await supabase.from('patients').select('id').eq('profile_id', user.id).single();

            if (patient) {
                const { data: docs } = await supabase
                    .from('medical_documents')
                    .select('*')
                    .eq('patient_id', patient.id)
                    .order('created_at', { ascending: false });

                if (docs) setExistingRecords(docs);
            }
            setLoadingRecords(false);
        };
        fetchRecords();
    }, []);

    const toggleRecordSelection = (doc: any) => {
        const isSelected = selectedRecords.includes(doc.id);
        let newSelected;
        let newUploadedFiles = [...formData.uploaded_files];

        if (isSelected) {
            newSelected = selectedRecords.filter(id => id !== doc.id);
            // Remove from uploaded_files if it was added from existing records
            newUploadedFiles = newUploadedFiles.filter(f => f.url !== doc.document_url);
        } else {
            newSelected = [...selectedRecords, doc.id];
            // Add to uploaded_files
            newUploadedFiles.push({
                name: doc.document_name || 'Medical Record',
                url: doc.document_url,
                type: 'document/existing' // Marker
            });
        }

        setSelectedRecords(newSelected);
        setFormData(prev => ({ ...prev, uploaded_files: newUploadedFiles }));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setLoading(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('consultation-files')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('consultation-files')
                .getPublicUrl(filePath);

            setFormData(prev => ({
                ...prev,
                uploaded_files: [...prev.uploaded_files, { name: file.name, url: publicUrl, type: file.type }]
            }));

            toast.success(t.success);
        } catch (error) {
            toast.error(t.error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await (supabase as any)
                .from('pre_consultation_data')
                .insert({
                    appointment_id: id,
                    current_symptoms: formData.current_symptoms,
                    symptom_duration: formData.symptom_duration,
                    severity_level: formData.severity_level,
                    current_medications: formData.current_medications ? [formData.current_medications] : [],
                    allergies: formData.allergies ? [formData.allergies] : [],
                    uploaded_files: formData.uploaded_files
                });

            if (error) throw error;

            // Update appointment to indicate pre-consultation done
            await (supabase as any).from('appointments')
                .update({ pre_consultation_completed: true })
                .eq('id', id);

            router.push(`/consultation/${id}/waiting-room`);
        } catch (error) {
            console.error(error);
            toast.error(t.error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
            <div className="max-w-3xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>{t.preConsultationTitle}</CardTitle>
                        <CardDescription>
                            {t.preConsultationDesc}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label>{t.currentSymptoms}</Label>
                                <Textarea
                                    required
                                    placeholder={t.symptomsPlaceholder}
                                    value={formData.current_symptoms}
                                    onChange={(e) => setFormData({ ...formData, current_symptoms: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>{t.duration}</Label>
                                    <Input
                                        placeholder={t.durationPlaceholder}
                                        value={formData.symptom_duration}
                                        onChange={(e) => setFormData({ ...formData, symptom_duration: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>{t.severity}</Label>
                                    <RadioGroup
                                        // @ts-ignore
                                        value={formData.severity_level}
                                        onValueChange={(val) => setFormData({ ...formData, severity_level: val })}
                                        className="flex gap-4"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="mild" id="mild" />
                                            <Label htmlFor="mild">{t.mild}</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="moderate" id="moderate" />
                                            <Label htmlFor="moderate">{t.moderate}</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="severe" id="severe" />
                                            <Label htmlFor="severe">{t.severe}</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>{t.medications}</Label>
                                <Input
                                    placeholder={t.medicationsPlaceholder}
                                    value={formData.current_medications}
                                    onChange={(e) => setFormData({ ...formData, current_medications: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>{t.allergies}</Label>
                                <Input
                                    placeholder={t.allergiesPlaceholder}
                                    value={formData.allergies}
                                    onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                                />
                            </div>

                            {/* Existing Medical Records Selection */}
                            {existingRecords.length > 0 && (
                                <div className="space-y-3 pt-4 border-t">
                                    <Label className="text-base font-semibold text-gray-800">Share from Medical Records</Label>
                                    <p className="text-sm text-gray-500">Select previously uploaded files to share with the doctor.</p>
                                    <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto p-2 bg-gray-50 rounded-lg">
                                        {existingRecords.map((doc) => (
                                            <div key={doc.id} className="flex items-start gap-2 p-2 bg-white border rounded shadow-sm hover:border-blue-300">
                                                <input
                                                    type="checkbox"
                                                    id={`doc-${doc.id}`}
                                                    checked={selectedRecords.includes(doc.id)}
                                                    onChange={() => toggleRecordSelection(doc)}
                                                    className="mt-1"
                                                />
                                                <label htmlFor={`doc-${doc.id}`} className="text-sm cursor-pointer flex-1">
                                                    <span className="font-medium truncate block">{doc.document_name}</span>
                                                    <span className="text-xs text-gray-400 block">{doc.date || 'No date'}</span>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2 pt-4 border-t">
                                <Label>{t.upload}</Label>
                                <div className="flex items-center gap-4">
                                    <Input
                                        type="file"
                                        className="hidden"
                                        id="file-upload"
                                        onChange={handleFileUpload}
                                        disabled={loading}
                                    />
                                    <Label
                                        htmlFor="file-upload"
                                        className="cursor-pointer flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50 bg-white"
                                    >
                                        <Upload className="h-4 w-4" />
                                        {t.uploadBtn}
                                    </Label>
                                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                                </div>
                                <div className="space-y-1">
                                    {formData.uploaded_files.map((file, idx) => (
                                        <div key={idx} className="text-sm text-gray-600 flex justify-between items-center bg-gray-50 px-3 py-1 rounded">
                                            <span className="truncate max-w-[200px]">{file.name}</span>
                                            {file.type === 'document/existing' && <span className="text-xs text-blue-500 bg-blue-50 px-2 py-0.5 rounded">Existing</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                {t.continueBtn}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function PreConsultationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    return (
        <ConsultationLanguageProvider>
            <PreConsultationContent id={id} />
        </ConsultationLanguageProvider>
    );
}
