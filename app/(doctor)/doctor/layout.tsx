import Link from 'next/link';
import { Stethoscope } from 'lucide-react';

export default function DoctorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Simple Header for Doctor Portal */}
            <header className="bg-white border-b border-gray-200 py-4">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white">
                            <Stethoscope className="w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">مرهم للأطباء</span>
                    </Link>
                    <div className="text-sm text-gray-500">
                        بوابة الشركاء
                    </div>
                </div>
            </header>

            <main className="flex-grow container mx-auto px-4 py-8">
                {children}
            </main>

            <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
                <div className="container mx-auto px-4 text-center text-sm text-gray-500">
                    © 2024 مرهم. جميع الحقوق محفوظة.
                </div>
            </footer>
        </div>
    );
}
