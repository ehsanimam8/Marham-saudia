import { CheckCircle } from 'lucide-react';

const services = [
    'استشارات تكيس المبايض (PCOS)',
    'استشارات الخصوبة',
    'متابعة الحمل',
    'استشارات ما قبل الحمل',
    'مشاكل الدورة الشهرية',
    'استشارات سن اليأس',
    'الوصفات الطبية',
    'تفسير التحاليل',
];

export default function DoctorServices() {
    return (
        <section className="bg-white rounded-2xl border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">الخدمات المقدمة</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {services.map((service, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{service}</span>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="font-bold text-gray-900 mb-2">اللغات</h3>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm">
                        العربية
                    </span>
                    <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm">
                        English
                    </span>
                </div>
            </div>
        </section>
    );
}
