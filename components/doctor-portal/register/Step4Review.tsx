'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';

interface Step4Props {
    formData: any;
    onBack: () => void;
}

export default function Step4Review({ formData, onBack }: Step4Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            // We need to upload files first if they haven't been uploaded.
            // For this MVP, let's assume we are passing file objects to the server action,
            // OR we upload them here using client-side supabase.
            // Given the complexity, let's stick to the plan: "Step4Review to call server action".
            // We need to import registerDoctor.
            const { registerDoctor } = await import('@/app/actions/auth');

            // Prepare FormData if needed, or just pass object if server action supports it 
            // (Next.js server actions sort of support objects but files need FormData usually).
            // Let's convert to simple object for data and handle files separately if needed.
            // But registerDoctor expects an object currently. 
            // Let's assume for now we are not sending the actual file binaries in this specific call 
            // to keep it simple, or we just pass the object and let Next.js serialize (it fails on File objects).
            // CORRECT APPROACH: We should upload files in Step3 or here client-side, then pass URLs.

            // Let's assume for now we just pass the text data to verify the flow.
            // Real file upload requires a bit more setup (buckets).
            // Real file upload requires a bit more setup (buckets).
            const result = await registerDoctor({
                ...formData,
                documentUrls: [] // Placeholder until upload is fully wired
            });

            if (result.error) {
                toast.error(result.error);
                setIsSubmitting(false);
                return;
            }

            setIsSuccess(true);
        } catch (error) {
            console.error(error);
            toast.error('حدث خطأ غير متوقع');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6">
                    <CheckCircle className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">تم استلام طلب التسجيل بنجاح!</h2>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    شكراً لانضمامك إلينا. سنقوم بمراجعة مستنداتك وتفعيل حسابك خلال 24 ساعة. ستصلك رسالة تأكيد عبر البريد الإلكتروني.
                </p>
                <Button className="bg-teal-600 hover:bg-teal-700 w-full max-w-xs" onClick={() => window.location.href = '/'}>
                    العودة للرئيسية
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-md mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-xl font-bold text-gray-900">مراجعة الطلب</h2>
                <p className="text-gray-500 text-sm">يرجى التأكد من صحة المعلومات قبل الإرسال</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 space-y-4 text-sm">
                <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500">الاسم الكامل</span>
                    <span className="font-bold text-gray-900">{formData.firstName} {formData.lastName}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500">البريد الإلكتروني</span>
                    <span className="font-bold text-gray-900">{formData.email}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500">رقم الجوال</span>
                    <span className="font-bold text-gray-900" dir="ltr">{formData.phone}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500">التخصص</span>
                    <span className="font-bold text-gray-900">{formData.specialty}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500">رقم الترخيص</span>
                    <span className="font-bold text-gray-900">{formData.licenseNumber}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">المستندات المرفقة</span>
                    <span className="font-bold text-gray-900">{formData.documents.length} ملفات</span>
                </div>
            </div>

            <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-800">ملاحظة هامة</AlertTitle>
                <AlertDescription className="text-blue-700 text-xs mt-1">
                    بإرسال هذا الطلب، أنت توافقين على شروط الاستخدام وسياسة الخصوصية الخاصة بمنصة مرهم.
                </AlertDescription>
            </Alert>

            <div className="flex gap-4 pt-4">
                <Button variant="outline" onClick={onBack} className="w-full" disabled={isSubmitting}>
                    تعديل
                </Button>
                <Button
                    onClick={handleSubmit}
                    className="w-full bg-teal-600 hover:bg-teal-700"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
                </Button>
            </div>
        </div>
    );
}
