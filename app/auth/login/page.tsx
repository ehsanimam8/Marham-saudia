
import Link from 'next/link';
import AuthForms from './auth-forms';
import { Shield, ArrowLeft } from 'lucide-react';

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ next?: string }>;
}) {
    const { next } = await searchParams;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="p-4">
                <Link href="/" className="inline-flex items-center text-gray-500 hover:text-teal-600 transition-colors">
                    <ArrowLeft className="w-4 h-4 ml-2" />
                    العودة للرئيسية
                </Link>
            </div>

            <div className="flex-1 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                    <div className="bg-teal-600 p-8 text-center text-white">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold mb-2">مرحباً بك في مرهم</h1>
                        <p className="text-teal-100">سجلي دخولك للوصول إلى استشاراتك الطبية</p>
                    </div>

                    <div className="p-8">
                        <AuthForms next={next} />
                        <div className="mt-6 text-center text-xs text-gray-400">
                            بالتسجيل، أنت توافقين على شروط الاستخدام وسياسة الخصوصية
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
