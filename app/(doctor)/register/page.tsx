import Footer from '@/components/patient/home/Footer';

export default function DoctorRegisterPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-16">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">انضمي كطبيبة</h1>
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                    <p className="text-lg text-gray-700 mb-6">
                        هل أنتِ طبيبة مرخصة وترغبين في الانضمام إلى منصة مرهم؟
                    </p>
                    <p className="text-gray-600">
                        قريباً: نموذج التسجيل للطبيبات
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
}
