'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { scheduleNurseCall, uploadMedicalDocument } from '@/app/actions/onboarding_v5';
import { generatePatientStories } from '@/app/actions/ai_analysis';
import { FC } from 'react';
import { OnboardingSession, DoctorMatch, MedicalDocument } from '@/lib/onboarding/v5/types';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Calendar, Clock, Stethoscope, Video, FileText, Upload, CheckCircle, AlertCircle, Bot, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Trash2, Phone } from 'lucide-react';
import { deleteMedicalDocument } from '@/app/actions/onboarding_v5';
import AiNurseChat from './AiNurseChat';

interface ResultsClientProps {
    session: OnboardingSession;
    matchedDoctors: DoctorMatch[];
    articles: any[];
    documents: MedicalDocument[];
    aiInsights?: any;
}

const ResultsClient: FC<ResultsClientProps> = ({ session, matchedDoctors, articles, documents: initialDocuments, aiInsights }) => {
    const router = useRouter();
    const [isSchedulingNurse, setIsSchedulingNurse] = useState(false);
    const [nurseScheduled, setNurseScheduled] = useState(session.scheduled_nurse_call);
    const [showNurseDialog, setShowNurseDialog] = useState(false);
    const [phone, setPhone] = useState('');
    const [uploading, setUploading] = useState(false);
    const [documentType, setDocumentType] = useState('diagnosis');
    const [documents, setDocuments] = useState<MedicalDocument[]>(initialDocuments || []);
    const [documentCount, setDocumentCount] = useState(session.documents_uploaded || (initialDocuments?.length || 0));
    const [showAiChat, setShowAiChat] = useState(false);
    const [aiLanguage, setAiLanguage] = useState<'ar' | 'en'>('ar');
    const [currentAiInsights, setCurrentAiInsights] = useState(aiInsights);
    const [isGeneratingAi, setIsGeneratingAi] = useState(false);

    useEffect(() => {
        if (!currentAiInsights && !isGeneratingAi) {
            handleGenerateAi();
        }
    }, []);

    const handleGenerateAi = async () => {
        if (isGeneratingAi) return;
        setIsGeneratingAi(true);
        try {
            const result = await generatePatientStories(session.id);
            if (result.success) {
                setCurrentAiInsights(result.data);
                // toast.success('تم تحديث التقرير بنجاح');
            } else {
                toast.error('الخدمة مزدحمة حالياً، سنحاول مرة أخرى');
                // Optional: retry after a delay
                setTimeout(handleGenerateAi, 5000);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsGeneratingAi(false);
        }
    };

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
            {/* AI Chat Overlay */}
            {showAiChat && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <AiNurseChat
                        sessionId={session.id}
                        onClose={() => setShowAiChat(false)}
                        onComplete={() => {
                            setShowAiChat(false);
                            setShowNurseDialog(true);
                            toast.success("AI Assessment Complete. Please schedule your call.");
                        }}
                    />
                </div>
            )}
            {/* Header */}
            <header className="text-center py-8 bg-gradient-to-b from-teal-50 to-white rounded-b-3xl -mt-4 mb-4 select-none">
                <div className="inline-block p-3 bg-teal-100 rounded-full mb-4">
                    <CheckCircle className="w-8 h-8 text-teal-600" />
                </div>
                <h1 className="text-3xl font-bold text-teal-900 mb-2 font-arabic">اكتمل التحليل</h1>
                <p className="text-gray-600 max-w-lg mx-auto font-arabic">لقد قمنا بتحليل أعراضك وأعددنا لكِ خطة رعاية مخصصة.</p>
            </header>

            <div className="grid md:grid-cols-3 gap-8">

                <div className="md:col-span-2 space-y-8">
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

                        {/* Always show Quick Tip if available from AI */}
                        {aiInsights?.quick_tip && (
                            <Card className="bg-teal-50 border-teal-100 mt-4 overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-teal-100/50 rounded-full -mr-8 -mt-8 blur-xl"></div>
                                <CardContent className="p-6 relative z-10">
                                    <h3 className="font-bold text-teal-900 mb-2 flex items-center gap-2 font-arabic">
                                        <Sparkles className="w-5 h-5 text-teal-600" />
                                        <span>نصيحة سريعة</span>
                                    </h3>
                                    <p className="text-teal-800 font-arabic leading-relaxed">
                                        {aiLanguage === 'ar' ? aiInsights.quick_tip_ar : aiInsights.quick_tip}
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {/* AI Analysis Sections */}
                        {currentAiInsights ? (
                            <div className="space-y-6 mt-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 font-arabic">
                                        <Bot className="w-5 h-5 text-violet-600" />
                                        <span>تقرير الذكاء الاصطناعي الشامل</span>
                                    </h2>
                                    <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                                        <button
                                            onClick={() => setAiLanguage('ar')}
                                            className={`px-3 py-1 text-xs rounded-md transition-all ${aiLanguage === 'ar' ? 'bg-white shadow-sm text-violet-700 font-bold' : 'text-slate-500'}`}
                                        >العربية</button>
                                        <button
                                            onClick={() => setAiLanguage('en')}
                                            className={`px-3 py-1 text-xs rounded-md transition-all ${aiLanguage === 'en' ? 'bg-white shadow-sm text-violet-700 font-bold' : 'text-slate-500'}`}
                                        >English</button>
                                    </div>
                                </div>

                                {/* Patient Narrative */}
                                <Card className="border-violet-100 bg-violet-50/30">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg font-bold text-violet-900 flex items-center gap-2 font-arabic">
                                            <Sparkles className="w-5 h-5" />
                                            <span>تحليل الحالة</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-slate-700 font-arabic leading-relaxed whitespace-pre-wrap">
                                            {aiLanguage === 'ar' ? currentAiInsights.patient_story_ar : currentAiInsights.patient_story}
                                        </p>
                                    </CardContent>
                                </Card>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    {/* Expectations */}
                                    <Card className="border-emerald-100 bg-emerald-50/30">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-base font-bold text-emerald-900 flex items-center gap-2 font-arabic">
                                                <Calendar className="w-4 h-4" />
                                                <span>ماذا نتوقع؟</span>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-slate-700 font-arabic leading-relaxed">
                                                {aiLanguage === 'ar' ? currentAiInsights.expectations_ar : currentAiInsights.expectations}
                                            </p>
                                        </CardContent>
                                    </Card>

                                    {/* Process Details */}
                                    <Card className="border-blue-100 bg-blue-50/30">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-base font-bold text-blue-900 flex items-center gap-2 font-arabic">
                                                <FileText className="w-4 h-4" />
                                                <span>خطوات التشخيص</span>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-slate-700 font-arabic leading-relaxed">
                                                {aiLanguage === 'ar' ? currentAiInsights.process_details_ar : currentAiInsights.process_details}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Recommended Doctor Profile */}
                                <Card className="border-indigo-100 bg-gradient-to-r from-indigo-50/50 to-white overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100/50 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                                    <CardContent className="p-6 relative z-10">
                                        <div className="flex flex-col sm:flex-row gap-4 items-start">
                                            <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shrink-0">
                                                <Stethoscope className="w-8 h-8 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-indigo-900 mb-2 font-arabic">التوصية بالتخصص الطبي</h3>
                                                <p className="text-slate-700 font-arabic leading-relaxed">
                                                    {aiLanguage === 'ar' ? currentAiInsights.doctor_profile_ar : currentAiInsights.doctor_profile}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ) : (
                            <Card className="mt-8 border-none bg-gradient-to-br from-violet-50 to-white shadow-inner overflow-hidden relative">
                                <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-0"></div>
                                <CardContent className="p-10 text-center relative z-10">
                                    <div className="relative w-24 h-24 mx-auto mb-6">
                                        <div className="absolute inset-0 bg-violet-200 rounded-full animate-ping opacity-25"></div>
                                        <div className="relative bg-white w-24 h-24 rounded-full shadow-lg flex items-center justify-center">
                                            <Bot className="w-12 h-12 text-violet-600 animate-pulse" />
                                        </div>
                                        <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-lg shadow-md">
                                            <Sparkles className="w-5 h-5 text-yellow-500 animate-bounce" />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2 font-arabic">جاري توليد تقرير الذكاء الاصطناعي...</h3>
                                    <p className="text-slate-500 mb-8 font-arabic max-w-sm mx-auto">
                                        يقوم Gemini الآن بتحليل إجاباتك وأعراضك بدقة لتوفير أفضل توصية طبية لكِ.
                                    </p>

                                    <div className="flex flex-col gap-3 max-w-xs mx-auto">
                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-violet-600 animate-progress-indefinite rounded-full w-1/2"></div>
                                        </div>
                                        <div className="flex justify-between text-[10px] text-slate-400 font-arabic">
                                            <span>تحليل الإجابات</span>
                                            <span>تحديد الأخصائية</span>
                                            <span>كتابة التقرير</span>
                                        </div>
                                    </div>
                                </CardContent>
                                <style jsx>{`
                                    @keyframes progress-indefinite {
                                        0% { transform: translateX(-100%); }
                                        100% { transform: translateX(200%); }
                                    }
                                    .animate-progress-indefinite {
                                        animation: progress-indefinite 2s infinite linear;
                                    }
                                `}</style>
                            </Card>
                        )}
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

                    {/* NEW: AI Nurse CTA */}
                    <Card className="bg-gradient-to-br from-violet-600 to-fuchsia-700 text-white border-none shadow-xl overflow-hidden relative group cursor-pointer hover:scale-[1.02] transition-transform" onClick={() => setShowAiChat(true)}>
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl animate-pulse"></div>
                        <CardContent className="p-6 relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                    <Sparkles className="w-6 h-6 text-yellow-300" />
                                </div>
                                <span className="bg-white/20 text-xs px-2 py-1 rounded-full backdrop-blur-md">مدعوم من Gemini Pro</span>
                            </div>

                            <h3 className="text-2xl font-bold mb-2 font-arabic">تحليل تفصيلي بالذكاء الاصطناعي</h3>
                            <p className="text-violet-100 text-sm mb-6 leading-relaxed font-arabic">
                                تحدثي مع ممرضة مرهم الآلية لتقديم تاريخ طبي أعمق. سنقوم بتسجيل تفاصيلك للطبيبة والتحقق من حالتك.
                            </p>

                            <Button variant="secondary" className="w-full bg-white text-violet-700 font-bold hover:bg-violet-50 font-arabic">
                                ابدأي التقييم الذكي
                            </Button>
                        </CardContent>
                    </Card>

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
                                        <div key={doc.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 shadow-sm text-sm group">
                                            <div className="flex items-center gap-2 overflow-hidden">
                                                <FileText className="w-4 h-4 text-teal-500 shrink-0" />
                                                <span className="truncate text-gray-700">{doc.file_name}</span>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteDocument(doc.id)}
                                                className="text-gray-400 hover:text-red-500 p-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
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
