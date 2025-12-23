
import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center space-y-4">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-teal-100 rounded-full"></div>
                <div className="w-16 h-16 border-4 border-teal-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
            </div>
            <div className="flex flex-col items-center">
                <p className="text-teal-900 font-bold text-lg animate-pulse">جاري التحميل</p>
                <p className="text-teal-600/60 text-sm">مرهم السعودية</p>
            </div>
        </div>
    );
}
