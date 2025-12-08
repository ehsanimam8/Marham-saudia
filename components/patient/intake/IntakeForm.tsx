'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { FileUpload, UploadedFile } from '@/components/shared/FileUpload';
import { submitIntakeForm } from '@/app/actions/intake';
import {
    ClipboardList,
    Activity,
    Pill,
    FileText,
    CheckCircle2,
    AlertCircle,
    Baby, // For pregnancy
    Thermometer // For symptoms
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface IntakeFormProps {
    appointmentId: string;
    patientId: string;
}

export default function IntakeForm({ appointmentId, patientId }: IntakeFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // A. Chief Complaint
    const [chiefComplaint, setChiefComplaint] = useState('');
    const [symptomsDuration, setSymptomsDuration] = useState('');
    const [severityLevel, setSeverityLevel] = useState([5]); // Slider uses array

    // B. Current Symptoms
    const [currentSymptoms, setCurrentSymptoms] = useState<Record<string, boolean>>({});
    const [symptomDetails, setSymptomDetails] = useState('');

    // C. Medical History
    const [consultedBefore, setConsultedBefore] = useState('no');
    const [consultationsCount, setConsultationsCount] = useState(0);
    const [triedMedications, setTriedMedications] = useState('');
    const [currentlyTakingMeds, setCurrentlyTakingMeds] = useState('no');
    const [currentMedicationsList, setCurrentMedicationsList] = useState('');
    const [allergies, setAllergies] = useState('');
    const [chronicConditions, setChronicConditions] = useState<string[]>([]);

    // D. Women's Health
    const [isPregnant, setIsPregnant] = useState('no');
    const [isBreastfeeding, setIsBreastfeeding] = useState('no');
    const [lastPeriodDate, setLastPeriodDate] = useState('');
    const [menstrualConcerns, setMenstrualConcerns] = useState('no');
    const [menstrualDetails, setMenstrualDetails] = useState('');

    // E. Documents
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

    // F. Consent
    const [consentShare, setConsentShare] = useState(false);

    // Constants
    const symptomOptions = [
        { id: 'irregular_periods', label: 'عدم انتظام الدورة الشهرية' },
        { id: 'heavy_bleeding', label: 'نزيف حاد' },
        { id: 'pelvic_pain', label: 'ألم في الحوض' },
        { id: 'vaginal_discharge', label: 'إفرازات مهبلية' },
        { id: 'cramps', label: 'تشنجات الحيض' },
        { id: 'hot_flashes', label: 'هبات ساخنة' },
        { id: 'breast_pain', label: 'ألم في الثدي' },
    ];

    const conditionOptions = [
        'السكري (Diabetes)',
        'ارتفاع ضغط الدم (Hypertension)',
        'الربو (Asthma)',
        'فقر الدم (Anemia)',
        'تكيس المبايض (PCOS)',
        'قصور الغدة الدرقية (Hypothyroidism)'
    ];

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!chiefComplaint) {
            toast.error('يرجى ذكر سبب الزيارة (الشكوى الرئيسية)');
            return;
        }
        if (!consentShare) {
            toast.error('يرجى الموافقة على مشاركة المعلومات الطبية للمتابعة');
            return;
        }

        setLoading(true);

        const formData = {
            appointmentId,
            chiefComplaint,
            symptomsDuration,
            severityLevel: severityLevel[0],
            currentSymptoms,
            symptomDetails,
            triedMedications,
            previousConsultations: consultedBefore === 'yes' ? consultationsCount : 0,
            currentMedicationsList: currentlyTakingMeds === 'yes' ? currentMedicationsList : '',
            allergies,
            chronicConditions,
            isPregnant,
            isBreastfeeding,
            lastPeriodDate,
            menstrualConcerns,
            menstrualDetails: menstrualConcerns === 'yes' ? menstrualDetails : '',
            consentShare,
            uploadedDocumentIds: uploadedFiles.map(f => f.id),
        };

        const result = await submitIntakeForm(formData);

        if (result.error) {
            toast.error('حدث خطأ أثناء حفظ النموذج: ' + result.error);
        } else {
            toast.success('تم حفظ النموذج بنجاح!');
            // Redirect or show success state
            router.push(`/patient/appointments?success=intake_submitted`);
        }
        setLoading(false);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto pb-12">

            {/* A. Chief Complaint */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ClipboardList className="w-5 h-5 text-teal-600" />
                        الشكوى الرئيسية
                    </CardTitle>
                    <CardDescription>ما هو سبب زيارتك للطبيبة اليوم؟</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>صفي مشكلتك الصحية بإيجاز <span className="text-red-500">*</span></Label>
                        <Textarea
                            placeholder="مثال: أشعر بصداع مستمر منذ أسبوع..."
                            value={chiefComplaint}
                            onChange={(e) => setChiefComplaint(e.target.value)}
                            className="min-h-[100px]"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>منذ متى بدأت الأعراض؟</Label>
                            <select
                                title="Duration"
                                className="w-full p-2 border rounded-md"
                                value={symptomsDuration}
                                onChange={(e) => setSymptomsDuration(e.target.value)}
                            >
                                <option value="">اختر المدة...</option>
                                <option value="less_24h">أقل من 24 ساعة</option>
                                <option value="1_3_days">1-3 أيام</option>
                                <option value="1_week">أسبوع واحد</option>
                                <option value="2_weeks">أسبوعين</option>
                                <option value="1_month">شهر</option>
                                <option value="more_1_month">أكثر من شهر</option>
                            </select>
                        </div>

                        <div className="space-y-4">
                            <Label>مدى حدة الأعراض (من 1 إلى 10)</Label>
                            <div className="px-2">
                                <Slider
                                    value={severityLevel}
                                    onValueChange={setSeverityLevel}
                                    max={10}
                                    min={1}
                                    step={1}
                                />
                            </div>
                            <div className="text-center text-sm font-medium text-teal-600">
                                {severityLevel[0]} / 10
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* B. Current Symptoms */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Thermometer className="w-5 h-5 text-teal-600" />
                        الأعراض الحالية
                    </CardTitle>
                    <CardDescription>حددي جميع الأعراض التي تشعرين بها</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {symptomOptions.map(option => (
                            <div key={option.id} className="flex items-center gap-2">
                                <Checkbox
                                    id={option.id}
                                    checked={!!currentSymptoms[option.id]}
                                    onCheckedChange={(checked) =>
                                        setCurrentSymptoms(prev => ({ ...prev, [option.id]: checked === true }))
                                    }
                                />
                                <Label htmlFor={option.id} className="cursor-pointer">{option.label}</Label>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-2">
                        <Label>تفاصيل أخرى للأعراض (اختياري)</Label>
                        <Textarea
                            placeholder="اكتبي أي تفاصيل إضافية هنا..."
                            value={symptomDetails}
                            onChange={(e) => setSymptomDetails(e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* C. Medical History */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-teal-600" />
                        التاريخ الطبي
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <Label className="text-base">هل استشرتِ طبيبة بخصوص هذه المشكلة من قبل؟</Label>
                        <RadioGroup value={consultedBefore} onValueChange={setConsultedBefore} className="flex gap-4">
                            <div className="flex items-center space-x-2 space-x-reverse">
                                <RadioGroupItem value="yes" id="consulted-yes" />
                                <Label htmlFor="consulted-yes">نعم</Label>
                            </div>
                            <div className="flex items-center space-x-2 space-x-reverse">
                                <RadioGroupItem value="no" id="consulted-no" />
                                <Label htmlFor="consulted-no">لا</Label>
                            </div>
                        </RadioGroup>
                        {consultedBefore === 'yes' && (
                            <div className="mt-2">
                                <Label>عدد المرات التقريبي:</Label>
                                <Input
                                    type="number"
                                    className="w-24 mt-1"
                                    value={consultationsCount}
                                    onChange={(e) => setConsultationsCount(Number(e.target.value))}
                                />
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>ما الأدوية أو العلاجات التي جربتها؟</Label>
                        <Textarea
                            value={triedMedications}
                            onChange={(e) => setTriedMedications(e.target.value)}
                            placeholder="وصفات طبية، أعشاب، مسكنات..."
                        />
                    </div>

                    <div className="space-y-4">
                        <Label className="text-base">هل تتناولين أي أدوية بانتظام حالياً؟</Label>
                        <RadioGroup value={currentlyTakingMeds} onValueChange={setCurrentlyTakingMeds} className="flex gap-4">
                            <div className="flex items-center space-x-2 space-x-reverse">
                                <RadioGroupItem value="yes" id="meds-yes" />
                                <Label htmlFor="meds-yes">نعم</Label>
                            </div>
                            <div className="flex items-center space-x-2 space-x-reverse">
                                <RadioGroupItem value="no" id="meds-no" />
                                <Label htmlFor="meds-no">لا</Label>
                            </div>
                        </RadioGroup>
                        {currentlyTakingMeds === 'yes' && (
                            <Textarea
                                placeholder="اذكري أسماء الأدوية والجرعات..."
                                value={currentMedicationsList}
                                onChange={(e) => setCurrentMedicationsList(e.target.value)}
                                className="mt-2"
                            />
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>هل لديك أي حساسية؟ (طعام، أدوية، بيئة)</Label>
                        <Input
                            value={allergies}
                            onChange={(e) => setAllergies(e.target.value)}
                            placeholder="اتركيه فارغاً إذا لا يوجد"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>هل تعانين من أمراض مزمنة؟</Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                            {conditionOptions.map(cond => (
                                <div key={cond} className="flex items-center gap-2">
                                    <Checkbox
                                        id={cond}
                                        checked={chronicConditions.includes(cond)}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                setChronicConditions([...chronicConditions, cond]);
                                            } else {
                                                setChronicConditions(chronicConditions.filter(c => c !== cond));
                                            }
                                        }}
                                    />
                                    <Label htmlFor={cond}>{cond}</Label>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* D. Women's Health (Specialty Specific - Assuming Gyn/Obs for context) */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Baby className="w-5 h-5 text-teal-600" />
                        صحة المرأة
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <Label>هل أنتِ حامل؟</Label>
                            <select
                                title="Pregnant"
                                className="w-full p-2 border rounded-md"
                                value={isPregnant}
                                onChange={(e) => setIsPregnant(e.target.value)}
                            >
                                <option value="no">لا</option>
                                <option value="yes">نعم</option>
                                <option value="not_sure">غير متأكدة</option>
                            </select>
                        </div>

                        <div className="space-y-3">
                            <Label>هل تقومين بالرضاعة الطبيعية؟</Label>
                            <select
                                title="Breastfeeding"
                                className="w-full p-2 border rounded-md"
                                value={isBreastfeeding}
                                onChange={(e) => setIsBreastfeeding(e.target.value)}
                            >
                                <option value="no">لا</option>
                                <option value="yes">نعم</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>تاريخ آخر دورة شهرية</Label>
                        <Input
                            type="date"
                            value={lastPeriodDate}
                            onChange={(e) => setLastPeriodDate(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="concern"
                                checked={menstrualConcerns === 'yes'}
                                onCheckedChange={(checked) => setMenstrualConcerns(checked ? 'yes' : 'no')}
                            />
                            <Label htmlFor="concern">لدي مخاوف تتعلق بالدورة الشهرية</Label>
                        </div>
                        {menstrualConcerns === 'yes' && (
                            <Textarea
                                value={menstrualDetails}
                                onChange={(e) => setMenstrualDetails(e.target.value)}
                                placeholder="اشرحي المشكلة..."
                            />
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* E. Upload Documents */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-teal-600" />
                        المرفقات الطبية
                    </CardTitle>
                    <CardDescription>
                        يمكنك رفع نتائج تحاليل، أشعة، أو تقارير سابقة (اختياري)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <FileUpload
                        patientId={patientId}
                        appointmentId={appointmentId}
                        onUploadComplete={(newFiles) => {
                            // Append new files to existing list
                            setUploadedFiles(prev => [...prev, ...newFiles]); // Wait, FileUpload handles its own state for display? 
                            // Yes, but we need IDs for submission.
                            // FileUpload component I created manages its own state for display, 
                            // but triggers callback. If callback returns ALL files, we replace.
                            // My FileUpload implementation: `onUploadComplete(uploadedFiles)` passes ONLY new batch.
                            // So we append.
                            // Wait, if I append, I might get duplicates if React renders multiple times?
                            // `onUploadComplete` logic checking unique IDs would be safer.
                            setUploadedFiles(prev => {
                                const all = [...prev, ...newFiles];
                                // Dedup by ID
                                const unique = Array.from(new Map(all.map(item => [item.id, item])).values());
                                return unique;
                            });
                        }}
                    />
                </CardContent>
            </Card>

            {/* F. Consent */}
            <Card className="bg-blue-50 border-blue-100">
                <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                        <Checkbox
                            id="consent"
                            checked={consentShare}
                            onCheckedChange={(c) => setConsentShare(c === true)}
                            className="mt-1"
                        />
                        <div className="space-y-1">
                            <Label htmlFor="consent" className="font-bold text-gray-900 cursor-pointer">
                                أوافق على مشاركة معلوماتي الطبية مع الطبيبة المعالجة
                            </Label>
                            <p className="text-sm text-gray-600">
                                تشمل معلوماتك: السجل الطبي، الأدوية، والملفات المرفقة. هذه المعلومات ضرورية لتقديم أفضل رعاية طبية وتساعد الطبيبة في التشخيص الدقيق.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex justify-end pt-4">
                <Button
                    type="submit"
                    size="lg"
                    className="bg-teal-600 hover:bg-teal-700 min-w-[200px]"
                    disabled={loading}
                >
                    {loading ? 'جاري الحفظ...' : 'حفظ وإرسال النموذج'}
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                </Button>
            </div>

        </form>
    );
}
