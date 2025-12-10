'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle, Star, Loader2, PanelRightOpen, PanelRightClose } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import PatientInfoSidebar from '@/components/consultation/PatientInfoSidebar';

const ConsultationJitsi = dynamic(() => import('@/components/consultation/JitsiMeeting'), {
    ssr: false,
    loading: () => (
        <div className="h-full w-full bg-gray-900 flex items-center justify-center text-white flex-col">
            <Loader2 className="w-10 h-10 animate-spin text-teal-500 mb-4" />
            <p className="text-lg font-bold">جاري تهيئة العيادة الافتراضية...</p>
        </div>
    )
});

interface ConsultationClientProps {
    data: any; // Full consultation data from server action
    appointmentId: string;
}

export default function ConsultationClient({ data, appointmentId }: ConsultationClientProps) {
    const router = useRouter();
    const [callEnded, setCallEnded] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoveredStar, setHoveredStar] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const { userRole, currentUser, appointment } = data;
    const isDoctor = userRole === 'doctor';

    // Determine display names
    const myName = isDoctor
        ? appointment.doctor.profile.full_name_ar
        : appointment.patient.profile.full_name_ar;

    const otherPartyName = isDoctor
        ? appointment.patient.profile.full_name_ar
        : appointment.doctor.profile.full_name_ar;

    const roomName = `marham-consultation-${appointmentId}`; // Obscure enough for MVP

    const handleCallEnd = () => {
        if (isDoctor) {
            // Redirect doctor to post-consultation workflow
            router.push(`/doctor-portal/appointments/${appointmentId}/post-consultation`);
        } else {
            // Show rating for patient
            setCallEnded(true);
        }
    };

    const handleRatingSubmit = async () => {
        // Submit rating logic here (can be added later)
        router.push('/patient/appointments');
    };

    if (callEnded) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir="rtl">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full text-center animate-in fade-in zoom-in-95 duration-300">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 shadow-sm border-4 border-white">
                        <CheckCircle className="w-10 h-10" />
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-2">انتهت الاستشارة</h1>
                    <p className="text-gray-500 mb-8">
                        شكراً لك! نأمل أن تكوني قد حصلتي على الفائدة المرجوة من استشارتك مع <span className="font-semibold text-gray-700">{otherPartyName}</span>.
                    </p>

                    <div className="space-y-6 mb-8 text-left">
                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-3 block text-center">كيف كانت تجربتك؟</label>
                            <div className="flex justify-center gap-2" onMouseLeave={() => setHoveredStar(0)}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoveredStar(star)}
                                        className={`transition-colors focus:outline-none ${star <= (hoveredStar || rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                    >
                                        <Star className="w-8 h-8 fill-current" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-2 block">ملاحظات إضافية (اختياري)</label>
                            <Textarea
                                placeholder="اكتبي ملاحظاتك هنا..."
                                className="min-h-[100px] resize-none focus:ring-teal-500"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button
                            onClick={handleRatingSubmit}
                            className="bg-teal-600 hover:bg-teal-700 w-full sm:w-auto min-w-[140px]"
                        >
                            إرسال وتقييم
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => router.push('/patient/appointments')}
                            className="w-full sm:w-auto min-w-[140px]"
                        >
                            تخطي
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-gray-900 overflow-hidden" dir="rtl">
            {/* Header */}
            <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-20 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-teal-700 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-100">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" /></svg>
                        <span className="font-bold text-sm hidden sm:inline">عيادة آمنة ومشفرة</span>
                    </div>
                    <span className="w-px h-6 bg-gray-200 hidden sm:block" />
                    <span className="text-sm font-medium text-gray-700 truncate max-w-[200px] sm:max-w-md">
                        {isDoctor ? `استشارة مع ${otherPartyName}` : (otherPartyName.startsWith('د.') ? otherPartyName : `د. ${otherPartyName}`)}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {/* Only show Sidebar toggle for doctors */}
                    {isDoctor && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="hidden md:flex gap-2"
                        >
                            {sidebarOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
                            {sidebarOpen ? 'إخفاء الملف' : 'عرض الملف'}
                        </Button>
                    )}

                    <div className="flex items-center gap-2 text-xs text-red-500 bg-red-50 px-3 py-1.5 rounded-full animate-pulse border border-red-100 whitespace-nowrap">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        <span className="hidden sm:inline mr-1">مباشر</span>
                    </div>
                </div>
            </header >

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden relative">

                {/* Video Area */}
                <div className={`flex-1 relative transition-all duration-300 ${isDoctor && sidebarOpen ? 'md:ml-0' : ''}`}>
                    <ConsultationJitsi
                        roomName={roomName}
                        displayName={myName}
                        email={currentUser.email}
                        onReadyToClose={handleCallEnd}
                    />
                </div >

                {/* Sidebar (Doctor Only) */}
                {
                    isDoctor && (
                        <aside
                            className={`
                            fixed inset-y-0 left-0 z-30 w-full sm:w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:shadow-none md:border-r border-gray-200
                            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:hidden'}
                        `}
                            style={{ paddingTop: '0px' }} // Header is separate
                        >
                            <PatientInfoSidebar
                                patient={data.appointment.patient.profile}
                                intakeForm={data.intakeForm}
                                medicalRecord={data.medicalRecord}
                                documents={data.documents}
                            />
                            {/* Mobile close button for sidebar */}
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="md:hidden absolute top-4 right-4 p-2 bg-gray-100 rounded-full"
                            >
                                <PanelRightClose className="w-5 h-5" />
                            </button>
                        </aside>
                    )
                }
            </div >
        </div >
    );
}
