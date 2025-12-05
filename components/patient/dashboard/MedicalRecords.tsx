'use client';

import { FileText, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Mock data
const records = [
    {
        id: 1,
        title: 'تقرير استشارة طبية',
        doctor: 'د. نورا الراشد',
        date: '2024-11-28',
        type: 'report',
    },
    {
        id: 2,
        title: 'وصفة طبية',
        doctor: 'د. نورا الراشد',
        date: '2024-11-28',
        type: 'prescription',
    },
    {
        id: 3,
        title: 'نتائج تحاليل الدم',
        doctor: 'مختبرات البرج',
        date: '2024-11-25',
        type: 'lab',
    },
];

export default function MedicalRecords() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {records.map((record) => (
                <div key={record.id} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow group">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                            <FileText className="w-6 h-6" />
                        </div>
                        <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                            {record.date}
                        </span>
                    </div>

                    <h3 className="font-bold text-gray-900 mb-1">{record.title}</h3>
                    <p className="text-sm text-gray-500 mb-6">{record.doctor}</p>

                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="w-4 h-4 ml-2" />
                            عرض
                        </Button>
                        <Button variant="ghost" size="sm" className="px-3">
                            <Download className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            ))}

            {/* Upload New Record Card */}
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-purple-300 hover:bg-teal-50/50 transition-colors cursor-pointer min-h-[200px]">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                    <span className="text-2xl">+</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">إضافة ملف جديد</h3>
                <p className="text-sm text-gray-500">ارفعي نتائج التحاليل أو التقارير الخارجية</p>
            </div>
        </div>
    );
}
