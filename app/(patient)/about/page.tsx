import Footer from '@/components/patient/home/Footer';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-16">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">عن مرهم</h1>
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                    <p className="text-lg text-gray-700 leading-relaxed mb-6">
                        مرهم هي أول منصة صحية نسائية متخصصة في المملكة العربية السعودية.
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                        نهدف إلى توفير رعاية صحية عالية الجودة للنساء من خلال ربطهن بأفضل الطبيبات السعوديات المتخصصات.
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
}
