'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FileText, Upload, X, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { submitIntakeForm } from '@/app/actions/intake';
import { toast } from 'sonner';

interface PreConsultationWizardProps {
    appointmentId: string;
    doctorName: string;
    existingHistory: {
        chronic_conditions?: string[];
        allergies?: string[];
        past_procedures?: string[];
    } | null;
    pastDocuments: any[];
    onComplete: () => void;
}

export default function PreConsultationWizard({
    appointmentId,
    doctorName,
    existingHistory,
    pastDocuments,
    onComplete
}: PreConsultationWizardProps) {
    const [step, setStep] = useState(1);
    const [symptoms, setSymptoms] = useState('');
    const [conditions, setConditions] = useState(
        existingHistory?.chronic_conditions?.join(', ') || ''
    );
    const [consent, setConsent] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles([...files, ...Array.from(e.target.files)]);
        }
    };

    const removeFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        const supabase = createClient();
        const uploadedIds: string[] = [];

        try {
            // 1. Upload Files
            if (files.length > 0) {
                setUploading(true);
                for (const file of files) {
                    const ext = file.name.split('.').pop();
                    const fileName = `${appointmentId}/${Math.random().toString(36).slice(2)}.${ext}`;

                    const { error: uploadError } = await supabase.storage
                        .from('medical-files')
                        .upload(fileName, file);

                    if (uploadError) throw uploadError;

                    // Create record in medical_documents
                    const { data: docData, error: dbError } = await (supabase
                        .from('medical_documents') as any)
                        .insert({
                            patient_id: (await supabase.auth.getUser()).data.user?.id,
                            document_name: file.name,
                            document_url: fileName,
                            document_type: 'lab_report', // Generic type
                            upload_date: new Date().toISOString()
                        })
                        .select()
                        .single();

                    if (dbError) throw dbError;
                    if (docData) uploadedIds.push(docData.id);
                }
                setUploading(false);
            }

            // 2. Submit Intake Form
            const result = await submitIntakeForm({
                appointmentId,
                currentSymptoms: symptoms,
                chronicConditions: conditions, // Pass as string, backend handles array if needed? Or consistent with intake action
                consentShare: consent,
                uploadedDocumentIds: uploadedIds
            });

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success('تم حفظ البيانات بنجاح');
                onComplete();
            }
        } catch (error: any) {
            console.error(error);
            toast.error('حدث خطأ أثناء الحفظ');
        } finally {
            setSubmitting(false);
            setUploading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl w-full text-right animate-in fade-in zoom-in-95 duration-300">
            {/* Progress Bar */}
            <div className="flex items-center justify-between mb-8 relative">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-10"></div>
                <div className={`flex flex-col items-center gap-2 bg-white px-2 z-10 ${step >= 1 ? 'text-teal-600' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${step >= 1 ? 'border-teal-600 bg-teal-50' : 'border-gray-300 bg-white'}`}>1</div>
                    <span className="text-xs font-medium">التاريخ المرضي</span>
                </div>
                <div className={`flex flex-col items-center gap-2 bg-white px-2 z-10 ${step >= 2 ? 'text-teal-600' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${step >= 2 ? 'border-teal-600 bg-teal-50' : 'border-gray-300 bg-white'}`}>2</div>
                    <span className="text-xs font-medium">الحالة الحالية</span>
                </div>
                <div className={`flex flex-col items-center gap-2 bg-white px-2 z-10 ${step >= 3 ? 'text-teal-600' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${step >= 3 ? 'border-teal-600 bg-teal-50' : 'border-gray-300 bg-white'}`}>3</div>
                    <span className="text-xs font-medium">المرفقات</span>
                </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                {step === 1 && 'التاريخ المرضي والموافقة'}
                {step === 2 && 'تفاصيل الحالة الحالية'}
                {step === 3 && 'إرفاق المستندات (اختياري)'}
            </h1>

            {step === 1 && (
                <div key="step-1" className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            الملف الطبي السابق
                        </h3>
                        {existingHistory ? (
                            <div className="text-sm text-blue-700 space-y-1">
                                <p><strong>الأمراض المزمنة:</strong> {existingHistory.chronic_conditions?.join(', ') || 'لا يوجد'}</p>
                                <p><strong>الحساسية:</strong> {existingHistory.allergies?.join(', ') || 'لا يوجد'}</p>
                            </div>
                        ) : (
                            <p className="text-sm text-blue-600">هذه أول زيارة لك، سيتم إنشاء ملف طبي جديد.</p>
                        )}

                        {pastDocuments.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-blue-200">
                                <p className="font-medium text-sm mb-2">التقارير السابقة المتوفرة ({pastDocuments.length}):</p>
                                <ul className="list-disc list-inside text-xs opacity-80">
                                    {pastDocuments.slice(0, 3).map((doc: any) => (
                                        <li key={doc.id}>{doc.document_name} ({new Date(doc.upload_date).toLocaleDateString()})</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setConsent(!consent)}>
                        <Checkbox id="consent" checked={consent} onCheckedChange={(c) => setConsent(c === true)} />
                        <div className="space-y-1">
                            <Label htmlFor="consent" className="font-bold cursor-pointer">أوافق على مشاركة ملفي الطبي</Label>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                أسمح للدكتور {doctorName} بالاطلاع على سجلي الطبي الكامل، بما في ذلك الزيارات السابقة والتقارير المرفقة، لغرض هذه الاستشارة فقط.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div key="step-2" className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    <div>
                        <Label className="mb-2 block">ما هو سبب الزيارة الرئيسي؟ (الأعراض الحالية) <span className="text-red-500">*</span></Label>
                        <Textarea
                            value={symptoms}
                            onChange={(e) => setSymptoms(e.target.value)}
                            placeholder="اشرحي بالتفصيل ما تشعرين به، متى بدأت الأعراض، وهل تزداد سوءاً؟"
                            className="min-h-[120px]"
                        />
                    </div>

                    <div>
                        <Label className="mb-2 block">هل تعانين من أي أمراض مزمنة أو حساسية؟</Label>
                        <Textarea
                            value={conditions}
                            onChange={(e) => setConditions(e.target.value)}
                            placeholder="مثال: سكري، ضغط، حساسية من البنسلين..."
                        />
                        <p className="text-xs text-gray-400 mt-1">سيتم تحديث ملفك الطبي بهذه المعلومات.</p>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div key="step-3" className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-teal-500 hover:bg-teal-50 transition-all">
                        <input
                            type="file"
                            id="file-upload"
                            multiple
                            className="hidden"
                            onChange={handleFileUpload}
                            accept="image/*,.pdf"
                        />
                        <Label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center text-teal-600">
                                <Upload className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">اضغطي هنا لرفع الملفات</p>
                                <p className="text-sm text-gray-500">صور تحاليل، أشعة، أو وصفات سابقة (PDF, JPG, PNG)</p>
                            </div>
                        </Label>
                    </div>

                    {files.length > 0 && (
                        <div className="space-y-2">
                            {files.map((file, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                                    <button onClick={() => removeFile(index)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Actions */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                {step > 1 ? (
                    <Button variant="outline" onClick={() => setStep(step - 1)} disabled={submitting}>
                        <ArrowRight className="w-4 h-4 ml-2" />
                        السابق
                    </Button>
                ) : (
                    <div></div>
                )}

                {step < 3 ? (
                    <Button
                        onClick={() => setStep(step + 1)}
                        className="bg-teal-600 hover:bg-teal-700 min-w-[120px]"
                        disabled={step === 2 && !symptoms.trim()} // Validation for Step 2
                    >
                        التالي
                        <ArrowLeft className="w-4 h-4 mr-2" />
                    </Button>
                ) : (
                    <Button
                        onClick={handleSubmit}
                        className="bg-teal-600 hover:bg-teal-700 min-w-[140px]"
                        disabled={submitting}
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                                جاري الحفظ...
                            </>
                        ) : 'حفظ ودخول العيادة'}
                    </Button>
                )}
            </div>
        </div>
    );
}
