'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { submitConsultation } from '@/app/actions/prescription';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Save, FileText as FileIcon, Stethoscope, Pill } from 'lucide-react';

interface PostConsultationFormProps {
    appointmentId: string;
    doctorId: string;
    patientId: string;
    patientName: string;
    doctorName: string;
}

interface Medication {
    id: number;
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
}

export default function PostConsultationForm({
    appointmentId,
    doctorId,
    patientId,
    patientName,
    doctorName
}: PostConsultationFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Clinical Notes
    const [subjective, setSubjective] = useState('');
    const [objective, setObjective] = useState('');

    // Diagnosis
    const [diagnosis, setDiagnosis] = useState('');
    const [differential, setDifferential] = useState('');

    // Prescription
    const [medications, setMedications] = useState<Medication[]>([]);
    const [rxInstructions, setRxInstructions] = useState('');

    // Plan
    const [treatmentPlan, setTreatmentPlan] = useState('');

    // Follow up
    const [followUp, setFollowUp] = useState(false);
    const [followUpTimeframe, setFollowUpTimeframe] = useState('');

    const addMedication = () => {
        setMedications([
            ...medications,
            { id: Date.now(), name: '', dosage: '', frequency: '', duration: '', instructions: '' }
        ]);
    };

    const updateMedication = (id: number, field: keyof Medication, value: string) => {
        setMedications(medications.map(m => m.id === id ? { ...m, [field]: value } : m));
    };

    const removeMedication = (id: number) => {
        setMedications(medications.filter(m => m.id !== id));
    };

    const handleSubmit = async () => {
        if (!diagnosis) {
            toast.error('يرجى كتابة التشخيص الأولي');
            return;
        }

        setLoading(true);

        const result = await submitConsultation({
            appointmentId,
            doctorId,
            patientId,
            doctorName,
            patientName,
            notes: {
                subjective,
                objective,
                plan: treatmentPlan,
                followUp,
                followUpTimeframe: followUp ? followUpTimeframe : null
            },
            diagnosis: {
                primary: diagnosis,
                differential: differential ? differential.split(',') : []
            },
            prescription: {
                medications,
                instructions: rxInstructions
            }
        });

        if (result.success) {
            toast.success('تم إنهاء الاستشارة وإرسال الوصفة بنجاح');
            router.push('/doctor-portal/appointments'); // Back to list
        } else {
            toast.error('حدث خطأ: ' + result.error);
        }
        setLoading(false);
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Clinical Notes */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileIcon className="w-5 h-5 text-teal-600" />
                        الملاحظات السريرية
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>شكوى المريض (Subjective)</Label>
                        <Textarea
                            placeholder="وصف المريض للأعراض..."
                            value={subjective}
                            onChange={(e) => setSubjective(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>الملاحظات والفحص (Objective)</Label>
                        <Textarea
                            placeholder="ملاحظاتك، العلامات الحيوية، نتائج الفحص..."
                            value={objective}
                            onChange={(e) => setObjective(e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Diagnosis */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Stethoscope className="w-5 h-5 text-teal-600" />
                        التخيص (Diagnosis)
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>التشخيص الأولي <span className="text-red-500">*</span></Label>
                        <Input
                            placeholder="أدخل التشخيص الرئيسي..."
                            value={diagnosis}
                            onChange={(e) => setDiagnosis(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>تشخيصات تفريقية (اختياري)</Label>
                        <Input
                            placeholder="افصل بينها بفاصلة..."
                            value={differential}
                            onChange={(e) => setDifferential(e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Prescription */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Pill className="w-5 h-5 text-teal-600" />
                            الوصفة الطبية
                        </CardTitle>
                        <Button onClick={addMedication} variant="outline" size="sm" type="button">
                            <Plus className="w-4 h-4 mr-2" /> إضافة دواء
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {medications.length === 0 && (
                        <div className="text-center p-4 border border-dashed rounded-lg text-gray-500 text-sm">
                            لا توجد أدوية مضافة. اضغط على "إضافة دواء" لإضافة واحد.
                        </div>
                    )}

                    {medications.map((med, index) => (
                        <div key={med.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3 relative">
                            <button
                                onClick={() => removeMedication(med.id)}
                                className="absolute top-2 left-2 text-red-500 hover:text-red-700"
                                title="حذف"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs">اسم الدواء</Label>
                                    <Input
                                        placeholder="Panadol Extra..."
                                        value={med.name}
                                        onChange={(e) => updateMedication(med.id, 'name', e.target.value)}
                                        className="h-9"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">الجرعة</Label>
                                    <Input
                                        placeholder="500mg..."
                                        value={med.dosage}
                                        onChange={(e) => updateMedication(med.id, 'dosage', e.target.value)}
                                        className="h-9"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">التكرار</Label>
                                    <Select
                                        value={med.frequency}
                                        onValueChange={(val) => updateMedication(med.id, 'frequency', val)}
                                    >
                                        <SelectTrigger className="h-9">
                                            <SelectValue placeholder="اختر..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Once daily">مرة يومياً (Once daily)</SelectItem>
                                            <SelectItem value="Twice daily">مرتين يومياً (Twice daily)</SelectItem>
                                            <SelectItem value="3 times daily">3 مرات يومياً</SelectItem>
                                            <SelectItem value="As needed">عند الحاجة (PRN)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">المدة</Label>
                                    <Input
                                        placeholder="5 days..."
                                        value={med.duration}
                                        onChange={(e) => updateMedication(med.id, 'duration', e.target.value)}
                                        className="h-9"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">تعليمات خاصة</Label>
                                <Input
                                    placeholder="بعد الأكل..."
                                    value={med.instructions}
                                    onChange={(e) => updateMedication(med.id, 'instructions', e.target.value)}
                                    className="h-9"
                                />
                            </div>
                        </div>
                    ))}

                    <div className="space-y-2 pt-2">
                        <Label>تعليمات عامة للوصفة</Label>
                        <Textarea
                            placeholder="توجيهات عامة للمريض..."
                            value={rxInstructions}
                            onChange={(e) => setRxInstructions(e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Plan & Follow Up */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileIcon className="w-5 h-5 text-teal-600" />
                        الخطة العلاجية والمتابعة
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>خطة العلاج (Treatment Plan)</Label>
                        <Textarea
                            placeholder="نصائح، تغيير نمط حياة، تمارين..."
                            value={treatmentPlan}
                            onChange={(e) => setTreatmentPlan(e.target.value)}
                            className="min-h-[100px]"
                        />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                        <Checkbox
                            id="followup"
                            checked={followUp}
                            onCheckedChange={(c) => setFollowUp(c === true)}
                        />
                        <Label htmlFor="followup" className="cursor-pointer">يتطلب موعد متابعة</Label>
                    </div>

                    {followUp && (
                        <div className="space-y-2 pl-6 animate-in slide-in-from-top-2">
                            <Label>متى؟</Label>
                            <Select
                                value={followUpTimeframe}
                                onValueChange={setFollowUpTimeframe}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="اختر المدة..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1 week">أسبوع</SelectItem>
                                    <SelectItem value="2 weeks">أسبوعين</SelectItem>
                                    <SelectItem value="1 month">شهر</SelectItem>
                                    <SelectItem value="3 months">3 أشهر</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Submit Actions */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 flex justify-end gap-3 z-40">
                <Button variant="outline" onClick={() => router.back()} disabled={loading}>
                    إلغاء
                </Button>
                <Button onClick={handleSubmit} disabled={loading} className="bg-teal-600 hover:bg-teal-700 min-w-[200px]">
                    {loading ? 'جاري الحفظ...' : 'إنهاء الاستشارة وإرسال الوصفة'}
                    <Save className="w-4 h-4 mr-2" />
                </Button>
            </div>
        </div>
    );
}
