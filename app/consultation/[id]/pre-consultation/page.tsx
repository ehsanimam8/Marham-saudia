// @ts-nocheck
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
            try {
                const response = await fetch('/api/patient/documents');
                if (!response.ok) throw new Error('Failed to fetch documents');

                const data = await response.json();
                console.log("Fetched Docs (API):", data.documents);

                if (data.documents) {
                    setExistingRecords(data.documents);
                }
            } catch (error) {
                console.error("Error loading records:", error);
            } finally {
                setLoadingRecords(false);
            }
        };
        fetchRecords();
    }, []);

    const toggleRecordSelection = (doc: any) => {
        // We use state setter to ensure we always work with latest state
        setSelectedRecords(prevSelected => {
            const isSelected = prevSelected.includes(doc.id);
            if (isSelected) {
                return prevSelected.filter(id => id !== doc.id);
            } else {
                return [...prevSelected, doc.id];
            }
        });

        // Also update the formData to match
        setFormData(prev => {
            let newUploadedFiles = [...prev.uploaded_files];
            const exists = newUploadedFiles.find(f => f.originId === doc.id);

            if (exists) {
                // Remove
                newUploadedFiles = newUploadedFiles.filter(f => f.originId !== doc.id);
            } else {
                // Add
                newUploadedFiles.push({
                    name: doc.document_name || 'Medical Record',
                    url: doc.document_url,
                    type: 'document/existing',
                    originId: doc.id
                });
            }
            return { ...prev, uploaded_files: newUploadedFiles };
        });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
            const filePath = `${user.id}/${fileName}`;

            // 1. Upload to 'medical-records' bucket (Permanent Storage)
            const { error: uploadError } = await supabase.storage
                .from('medical-records')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('medical-records')
                .getPublicUrl(filePath);

            // 2. Insert into medical_documents table
            const { data: newDoc, error: dbError } = await supabase
                .from('medical_documents')
                .insert({
                    patient_id: user.id,
                    document_name: file.name,
                    document_url: publicUrl,
                    document_type: file.type.includes('image') ? 'image' : 'report',
                    uploaded_at: new Date().toISOString()
                })
                .select()
                .single();

            if (dbError) throw dbError;

            // 3. Update State: Add to existing records and select it
            const newRecord = {
                id: newDoc.id,
                document_name: newDoc.document_name,
                upload_date: newDoc.uploaded_at || newDoc.created_at || new Date().toISOString(),
                document_url: newDoc.document_url,
                source: 'medical_documents'
            };

            setExistingRecords(prev => [newRecord, ...prev]);

            // Auto-select
            toggleRecordSelection(newRecord);

            toast.success("File saved to records and selected");
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || t.error);
        } finally {
            setLoading(false);
            // Reset input
            e.target.value = '';
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
                            <div className="space-y-3 pt-4 border-t">
                                <Label className="text-base font-semibold text-gray-800">Share from Medical Records</Label>
                                {loadingRecords ? (
                                    <div className="text-sm text-gray-500 flex items-center gap-2">
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                        Checking for existing records...
                                    </div>
                                ) : existingRecords.length > 0 ? (
                                    <>
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
                                                        <span className="text-xs text-gray-400 block">{doc.upload_date ? new Date(doc.upload_date).toLocaleDateString() : 'No date'}</span>
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-sm text-gray-400 italic bg-gray-50 p-3 rounded">
                                        No previous medical documents found for this account.
                                    </p>
                                )}
                            </div>

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
                                <p className="text-xs text-gray-500 mt-1">Uploaded files will be saved to your medical records and selected automatically.</p>
                                {/* 
                                   Files are now displayed in the list above 
                                */}
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
