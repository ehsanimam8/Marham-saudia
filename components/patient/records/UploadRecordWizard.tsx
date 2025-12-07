"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Upload, Calendar, CheckCircle, X, File, Activity, Pill, Microscope } from 'lucide-react';
import { uploadMedicalRecord } from '@/app/actions/records';
import { toast } from 'sonner';

const RECORD_TYPES = [
    { id: 'prescription', label: 'وصفة طبية', icon: Pill, color: 'text-blue-500 bg-blue-50' },
    { id: 'lab_result', label: 'نتائج تحليل', icon: Microscope, color: 'text-purple-500 bg-purple-50' },
    { id: 'imaging', label: 'أشعة / تصوير', icon: Activity, color: 'text-orange-500 bg-orange-50' },
    { id: 'report', label: 'تقرير طبي', icon: FileText, color: 'text-teal-500 bg-teal-50' },
];

export default function UploadRecordWizard({ onClose }: { onClose: () => void }) {
    const [step, setStep] = useState(1);
    const [type, setType] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [details, setDetails] = useState({ description: '', date: new Date().toISOString().split('T')[0] });
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (!type || !file) return;
        setLoading(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('recordType', type);
        formData.append('description', details.description);
        formData.append('recordDate', details.date);

        try {
            await uploadMedicalRecord(formData);
            toast.success('تم رفع الملف بنجاح');
            setStep(4); // Success step
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error) {
            toast.error('حدث خطأ أثناء الرفع');
            console.error(error);
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">

                {/* Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900">إضافة سجل طبي جديد</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-6">
                    {/* Progress Bar */}
                    <div className="flex gap-2 mb-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${step >= i ? 'bg-teal-600' : 'bg-gray-100'}`}></div>
                        ))}
                    </div>

                    {step === 1 && (
                        <div className="space-y-4">
                            <h4 className="text-lg font-bold text-center mb-6">ما نوع الملف الذي تود إضافته؟</h4>
                            <div className="grid grid-cols-2 gap-4">
                                {RECORD_TYPES.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => setType(t.id)}
                                        className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${type === t.id
                                                ? 'border-teal-600 bg-teal-50'
                                                : 'border-gray-100 hover:border-teal-200 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${t.color}`}>
                                            <t.icon className="w-6 h-6" />
                                        </div>
                                        <span className="font-medium text-gray-700">{t.label}</span>
                                    </button>
                                ))}
                            </div>
                            <div className="pt-4 flex justify-end">
                                <Button onClick={() => setStep(2)} disabled={!type} className="w-full">
                                    التالي
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <h4 className="text-lg font-bold mb-2">رفع الملف</h4>
                                <p className="text-gray-500 text-sm">صور الوصفة أو التقرير بوضوح (PDF, JPG, PNG)</p>
                            </div>

                            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:bg-gray-50 transition-colors relative">
                                <input
                                    type="file"
                                    accept="image/*,application/pdf"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                {file ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center mb-2">
                                            <CheckCircle className="w-8 h-8" />
                                        </div>
                                        <p className="font-bold text-gray-900 truncate max-w-[200px]">{file.name}</p>
                                        <p className="text-sm text-gray-500">تم اختيار الملف بنجاح</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center mb-2">
                                            <Upload className="w-8 h-8" />
                                        </div>
                                        <p className="font-bold text-gray-900">اضغط لرفع الملف</p>
                                        <p className="text-sm text-gray-500">أو اسحب الملف هنا</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">عودة</Button>
                                <Button onClick={() => setStep(3)} disabled={!file} className="flex-1">التالي</Button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4">
                            <h4 className="text-lg font-bold mb-4">تفاصيل إضافية</h4>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ السجل</label>
                                <div className="relative">
                                    <Input
                                        type="date"
                                        value={details.date}
                                        onChange={(e) => setDetails({ ...details, date: e.target.value })}
                                    />
                                    {/* <Calendar className="absolute left-3 top-3 text-gray-400 w-5 h-5 pointer-events-none" /> */}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">ملاحظات أو اسم الطبيب</label>
                                <Textarea
                                    placeholder="مثلاً: وصفة د. سارة لعلاج الحساسية..."
                                    value={details.description}
                                    onChange={(e) => setDetails({ ...details, description: e.target.value })}
                                    className="resize-none h-24"
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <Button variant="outline" onClick={() => setStep(2)} disabled={loading} className="flex-1">عودة</Button>
                                <Button onClick={handleSubmit} disabled={loading} className="flex-1">
                                    {loading ? 'جاري الرفع...' : 'حفظ السجل'}
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="text-center py-8">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                                <CheckCircle className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">تم الحفظ بنجاح!</h3>
                            <p className="text-gray-500 max-w-xs mx-auto">
                                سيقوم مساعدنا الذكي بتحليل الملف وإضافة المعلومات لملفك الصحي قريباً.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
