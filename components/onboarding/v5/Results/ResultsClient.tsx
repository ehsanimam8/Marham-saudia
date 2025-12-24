// @ts-nocheck
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { scheduleNurseCall, uploadMedicalDocument } from '@/app/actions/onboarding_v5';
import { FC } from 'react';
import { OnboardingSession, DoctorMatch, MedicalDocument } from '@/lib/onboarding/v5/types';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Calendar, Clock, Stethoscope, Video, FileText, Upload, CheckCircle, AlertCircle, Trash2, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { deleteMedicalDocument } from '@/app/actions/onboarding_v5';

interface ResultsClientProps {
    session: OnboardingSession;
    matchedDoctors: DoctorMatch[];
    articles: any[];
    documents: MedicalDocument[];
    summaryData?: {
        concern: any;
        bodyPart: any;
        symptoms: any[];
        contextAnswers: any[];
    };
}

const ResultsClient: FC<ResultsClientProps> = ({ session, matchedDoctors, articles, documents: initialDocuments, summaryData }) => {
    const router = useRouter();
    const [isSchedulingNurse, setIsSchedulingNurse] = useState(false);
    const [nurseScheduled, setNurseScheduled] = useState(session.scheduled_nurse_call);
    const [showNurseDialog, setShowNurseDialog] = useState(false);
    const [phone, setPhone] = useState('');
    const [uploading, setUploading] = useState(false);
    const [documentType, setDocumentType] = useState('diagnosis');
    const [documents, setDocuments] = useState<MedicalDocument[]>(initialDocuments || []);
    const [documentCount, setDocumentCount] = useState(session.documents_uploaded || (initialDocuments?.length || 0));

    const handleScheduleNurse = async () => {
        if (!phone) {
            toast.error('Please enter your phone number');
            return;
        }

        setIsSchedulingNurse(true);
        try {
            const now = new Date();
            now.setMinutes(now.getMinutes() + 15);

            await scheduleNurseCall({
                sessionId: session.id,
                requestedDateTime: now.toISOString(),
                phone: phone,
                preferredLanguage: 'ar'
            } as any);

            setNurseScheduled(true);
            setShowNurseDialog(false);
            toast.success('تم إرسال طلب استشارة الممرضة بنجاح!');
        } catch (error) {
            toast.error('فشل في جدولة مكالمة الممرضة');
        } finally {
            setIsSchedulingNurse(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        setUploading(true);
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('documentType', documentType);
        formData.append('sessionId', session.id);

        try {
            const result = await uploadMedicalDocument(formData);

            // Add new document to list
            if (result && result.document) {
                setDocuments(prev => [result.document, ...prev]);
            }

            setDocumentCount(prev => prev + 1);
            toast.success('Document uploaded successfully');
        } catch (error) {
            toast.error('Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteDocument = async (docId: string) => {
        try {
            await deleteMedicalDocument(docId);
            setDocuments(prev => prev.filter(d => d.id !== docId));
            setDocumentCount(prev => Math.max(0, prev - 1));
            toast.success('Document deleted');
        } catch (error) {
            toast.error('Failed to delete document');
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-4 pb-20 space-y-8 relative">
            {/* Header */}
            <header className="text-center py-10 bg-gradient-to-br from-teal-600 via-teal-500 to-teal-400 rounded-3xl mb-8 shadow-xl shadow-teal-500/20 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-24 -mb-24 blur-2xl"></div>

                <div className="relative z-10 flex flex-col items-center">
                    <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl mb-4 border border-white/30 shadow-inner">
                        <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-3 font-arabic">اكتمل تحليل حالتك</h1>
                    <p className="text-teal-50 max-w-lg mx-auto font-arabic text-lg opacity-90">لقد قمنا بتحليل اختياراتك وأعددنا لكِ أفضل الخيارات الطبية المناسبة.</p>
                </div>
            </header>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    {/* 0. Selection Summary Card */}
                    {summaryData && (
                        <Card className="border-none shadow-lg bg-white overflow-hidden group">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between py-5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-teal-100 rounded-lg">
                                        <FileText className="w-5 h-5 text-teal-600" />
                                    </div>
                                    <CardTitle className="text-xl font-bold font-arabic text-slate-800">ملخص إجاباتك</CardTitle>
                                </div>
                                <div className="text-xs font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-100 font-arabic">
                                    تم التحديث الآن
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {/* Primary Concern & Body Part */}
                                    <div className="space-y-4">
                                        <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-100/50 hover:bg-teal-50 transition-colors">
                                            <Label className="text-teal-600 font-bold mb-2 block text-right font-arabic">المجال الرئيسي</Label>
                                            <div className="flex items-center gap-3 flex-row-reverse">
                                                <span className="text-2xl">{summaryData.concern?.icon || '🩺'}</span>
                                                <div className="text-right">
                                                    <div className="font-bold text-slate-800 font-arabic">{summaryData.concern?.name_ar || 'غير محدد'}</div>
                                                    <div className="text-xs text-slate-500 font-arabic">{summaryData.bodyPart?.name_ar || 'كامل الجسم'}</div>
                                                </div>
                                            </div>
                                        </div>

                                        {summaryData.symptoms.length > 0 && (
                                            <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-100/50 hover:bg-rose-50 transition-colors">
                                                <Label className="text-rose-600 font-bold mb-2 block text-right font-arabic">الأعراض المحددة</Label>
                                                <div className="flex flex-wrap gap-2 justify-end">
                                                    {summaryData.symptoms.map(s => (
                                                        <span key={s.id} className="px-3 py-1 bg-white border border-rose-100 rounded-full text-sm font-medium text-rose-700 shadow-sm font-arabic">
                                                            {s.name_ar}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Context & Metadata */}
                                    <div className="space-y-4">
                                        <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 hover:bg-blue-50 transition-colors">
                                            <Label className="text-blue-600 font-bold mb-2 block text-right font-arabic">معلومات المريض</Label>
                                            <div className="space-y-2 text-right">
                                                <div className="flex items-center justify-between flex-row-reverse">
                                                    <span className="text-slate-500 text-sm font-arabic">العمر:</span>
                                                    <span className="font-semibold text-slate-800 font-arabic">{session.age_range || 'غير محدد'} سنوات</span>
                                                </div>
                                                <div className="flex items-center justify-between flex-row-reverse">
                                                    <span className="text-slate-500 text-sm font-arabic">الحالة:</span>
                                                    <span className="font-semibold text-slate-800 font-arabic">{session.urgency === 'very_urgent' ? 'طارئة' : session.urgency === 'urgent' ? 'عاجلة' : 'روتينية'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {summaryData.contextAnswers.length > 0 && (
                                            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/50">
                                                <Label className="text-slate-600 font-bold mb-3 block text-right font-arabic">إجابات إضافية</Label>
                                                <div className="space-y-3">
                                                    {summaryData.contextAnswers.slice(0, 3).map((a, i) => (
                                                        <div key={i} className="text-right border-r-2 border-slate-200 pr-3">
                                                            <div className="text-[10px] text-slate-400 font-arabic leading-tight mb-0.5">{a.question}</div>
                                                            <div className="text-sm font-bold text-slate-700 font-arabic">{a.answer === 'yes' ? 'نعم' : a.answer === 'no' ? 'لا' : a.answer}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                    {/* 1. Helpful Content / Tips */}
                    <section>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800 font-arabic">
                            <AlertCircle className="w-5 h-5 text-teal-600" />
                            نصائح ومعلومات مفيدة
                        </h2>

                        {articles && articles.length > 0 ? (
                            <div className="grid gap-4">
                                {articles.map((article: any) => (
                                    <Card key={article.id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                                        <div className="flex flex-col sm:flex-row h-full">
                                            {article.thumbnail_url && (
                                                <div className="w-full sm:w-32 h-32 bg-gray-200 relative shrink-0">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={article.thumbnail_url} alt="" className="object-cover w-full h-full" />
                                                </div>
                                            )}
                                            <div className="p-4 flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                        {article.content_type}
                                                    </span>
                                                    {article.duration_minutes && (
                                                        <span className="text-xs text-gray-400 flex items-center gap-1">
                                                            <Clock className="w-3 h-3" /> {article.duration_minutes} min read
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className="font-bold text-slate-900 mb-1">{article.title_en}</h3>
                                                <p className="text-sm text-gray-500 line-clamp-2">Click to read more about managing your symptoms effectively.</p>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : null}
                    </section>

                    {/* 2. Doctor Matches */}
                    <section>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800 font-arabic">
                            <Stethoscope className="w-5 h-5 text-teal-600" />
                            الطبيبات المرشحات لكِ
                        </h2>

                        <div className="grid gap-6">
                            {matchedDoctors.map(({ doctor, matchScore, matchReasons }) => (
                                <div key={doctor.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col sm:flex-row">
                                    <div className="p-6 flex-1">
                                        <div className="flex gap-4 mb-4">
                                            <div className="w-16 h-16 bg-slate-200 rounded-full flex-shrink-0 bg-cover bg-center border border-gray-100" style={{ backgroundImage: `url(${doctor.profile_photo_url})` }} />
                                            <div>
                                                <h3 className="font-bold text-lg text-slate-900">{doctor.full_name_en}</h3>
                                                <p className="text-sm text-teal-600 font-medium">{doctor.specialty} • {doctor.hospital}</p>

                                                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                                    <div className="flex items-center gap-1">
                                                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                                        <span className="font-bold text-slate-700">{doctor.rating}</span>
                                                        <span>({doctor.total_reviews})</span>
                                                    </div>
                                                    <span className="text-gray-300">|</span>
                                                    <span className="text-green-600 font-medium flex items-center gap-0.5">
                                                        <CheckCircle className="w-3 h-3" /> نسبة المطابقة {matchScore}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {matchReasons.length > 0 && (
                                            <div className="mb-4 flex flex-wrap gap-2">
                                                {matchReasons.map(reason => (
                                                    <span key={reason} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-md border border-green-100">
                                                        {reason}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex items-center gap-4 text-sm mt-4 pt-4 border-t border-gray-50">
                                            <div className="flex items-center gap-1.5 text-slate-600 bg-slate-100 px-3 py-1.5 rounded-md font-arabic">
                                                <Calendar className="w-4 h-4" />
                                                الموعد القادم: <span className="font-semibold">{doctor.next_available}</span>
                                            </div>
                                            <div className="font-bold text-slate-900 text-lg ml-auto">
                                                {doctor.consultation_price} ريال
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 p-4 border-t sm:border-t-0 sm:border-l border-slate-100 flex flex-row sm:flex-col justify-center gap-3 w-full sm:w-48">
                                        <Button
                                            onClick={() => router.push(`/doctors/${doctor.id}?book=true`)}
                                            className="flex-1 bg-teal-600 hover:bg-teal-700 w-full shadow-sm font-arabic"
                                        >
                                            احجزي الآن
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => router.push(`/doctors/${doctor.id}`)}
                                            className="flex-1 border-teal-200 text-teal-700 hover:bg-teal-50 w-full font-arabic"
                                        >
                                            عرض الملف
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            {matchedDoctors.length === 0 && (
                                <div className="text-center p-12 bg-white rounded-xl border border-dashed border-gray-300">
                                    <p className="text-gray-500">No specific matches found based on current criteria.</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Sidebar Actions */}
                <div className="space-y-6">
                    {/* 3. Nurse Consultation CTA */}
                    <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-none shadow-lg overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-xl"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12 blur-xl"></div>
                        <CardContent className="p-6 relative z-10">
                            <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
                                <Video className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 font-arabic">تقييم مجاني مع ممرضة</h3>
                            <p className="text-indigo-100 text-sm mb-6 leading-relaxed font-arabic">
                                لستِ متأكدة من الطبيبة المناسبة؟ تحدثي مع ممرضة مرخصة لتقييم أولي مجاني وتوجيهك للأفضل.
                            </p>

                            {nurseScheduled && (
                                <div className="bg-white/20 backdrop-blur-md rounded-lg p-4 text-center border border-white/30 font-arabic">
                                    <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-300" />
                                    <p className="font-semibold">تم إرسال الطلب!</p>
                                    <p className="text-xs text-indigo-100">ستتصل بك الممرضة قريباً.</p>
                                </div>
                            )}

                            {!nurseScheduled && (
                                <>
                                    <Button
                                        onClick={() => setShowNurseDialog(true)}
                                        className="w-full bg-white text-indigo-700 hover:bg-indigo-50 font-bold border-none font-arabic"
                                    >
                                        اطلبي اتصالاً مجانياً
                                    </Button>

                                    <Dialog open={showNurseDialog} onOpenChange={setShowNurseDialog}>
                                        <DialogContent className="sm:max-w-md">
                                            <DialogHeader>
                                                <DialogTitle className="font-arabic">طلب استشارة ممرضة</DialogTitle>
                                                <DialogDescription className="font-arabic">
                                                    أدخلي رقم جوالك وسنتصل بك خلال 15 دقيقة لتقديم تقييم أولي مجاني.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4 py-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="phone" className="font-arabic">رقم الجوال</Label>
                                                    <div className="relative">
                                                        <Phone className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                                                        <Input
                                                            id="phone"
                                                            placeholder="05XXXXXXXX"
                                                            className="pr-9"
                                                            value={phone}
                                                            onChange={(e) => setPhone(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <DialogFooter className="sm:justify-start">
                                                <Button
                                                    onClick={handleScheduleNurse}
                                                    disabled={isSchedulingNurse || !phone}
                                                    className="w-full bg-indigo-600 hover:bg-indigo-700 font-arabic"
                                                >
                                                    {isSchedulingNurse ? 'جاري الطلب...' : 'تأكيد الطلب'}
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* 4. Upload Reports */}
                    <Card className="border-dashed border-2 border-gray-200 shadow-none hover:border-teal-400 transition-colors">
                        <CardContent className="p-6 text-center">
                            <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Upload className="w-8 h-8 text-teal-600" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2 font-arabic">لديكِ تقارير طبية؟</h3>
                            <p className="text-gray-500 text-sm mb-6 font-arabic">
                                قومي برفع الوصفات السابقة، نتائج التحاليل، أو صور المنطقة المصابة لتحليل أفضل.
                            </p>

                            <div className="flex items-center justify-center gap-2 mb-4 text-sm font-medium text-teal-700 bg-teal-50 py-2 rounded-lg font-arabic">
                                <FileText className="w-4 h-4" />
                                <span>تم رفع {documentCount} ملفات</span>
                            </div>

                            <div className="mb-4">
                                <Label htmlFor="doc-type" className="sr-only">Document Type</Label>
                                <select
                                    id="doc-type"
                                    value={documentType}
                                    onChange={(e) => setDocumentType(e.target.value)}
                                    className="w-full text-sm bg-gray-50 border border-gray-200 text-gray-700 rounded-lg p-2.5 focus:ring-teal-500 focus:border-teal-500"
                                    disabled={uploading}
                                >
                                    <option value="diagnosis">تقرير طبي</option>
                                    <option value="prescription">وصفة طبية</option>
                                    <option value="lab_result">نتيجة مختبر</option>
                                    <option value="imaging">صورة / أشعة</option>
                                    <option value="other">أخرى</option>
                                </select>
                            </div>

                            <div className="relative">
                                <input
                                    type="file"
                                    id="file-upload"
                                    className="hidden"
                                    accept="image/*,application/pdf"
                                    onChange={handleFileUpload}
                                    disabled={uploading}
                                />
                                <Label
                                    htmlFor="file-upload"
                                    className={`block w-full py-3 px-4 rounded-lg border border-teal-200 text-teal-700 font-semibold cursor-pointer hover:bg-teal-50 transition-colors text-center font-arabic ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                                >
                                    {uploading ? 'جاري الرفع...' : 'رفع ملف'}
                                </Label>
                            </div>
                            <p className="text-xs text-gray-400 mt-2 font-sans">Max 10MB • JPG, PNG, PDF</p>

                            {/* Document List */}
                            {documents.length > 0 && (
                                <div className="mt-6 space-y-3 text-right">
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 font-arabic">الملفات المرفوعة</h4>
                                    {documents.map((doc: MedicalDocument) => (
                                        <div key={doc.id} className="flex flex-col p-3 bg-white rounded-lg border border-gray-100 shadow-sm text-sm group">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2 overflow-hidden">
                                                    <FileText className="w-4 h-4 text-teal-500 shrink-0" />
                                                    <span className="truncate text-gray-700">{doc.file_name}</span>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteDocument(doc.id)}
                                                    className="text-gray-400 hover:text-red-500 p-1 transition-opacity"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Image Preview */}
                                            {doc.file_type.startsWith('image/') && (
                                                <div className="mt-2 rounded-md overflow-hidden border border-gray-50 bg-gray-50 max-h-32">
                                                    <img
                                                        src={doc.file_url}
                                                        alt={doc.file_name}
                                                        className="w-full h-full object-contain cursor-pointer hover:opacity-90 transition-opacity"
                                                        onClick={() => window.open(doc.file_url, '_blank')}
                                                    />
                                                </div>
                                            )}

                                            {doc.file_type === 'application/pdf' && (
                                                <a
                                                    href={doc.file_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="mt-1 text-xs text-teal-600 font-bold hover:underline font-arabic text-left"
                                                >
                                                    عرض ملف PDF
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Support Card */}
                    <div className="bg-gray-50 rounded-xl p-4 flex gap-3 items-start">
                        <AlertCircle className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs text-gray-500 leading-relaxed font-arabic">
                                <strong>ملاحظة الخصوصية:</strong> جميع بياناتك مشفرة ومحمية، ولن يتم مشاركتها إلا مع الطبيبة التي تحجزين معها. نحن نلتزم بمعايير الأمن الصحي في المملكة.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ResultsClient;
