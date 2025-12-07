"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Search, Filter, Calendar } from 'lucide-react';
import UploadRecordWizard from './UploadRecordWizard';
import Image from 'next/image';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';

interface MedicalRecord {
    id: string;
    record_type: string;
    file_name: string;
    description: string;
    record_date: string;
    ai_status: string;
    signedUrl?: string;
}

const TYPE_LABELS: Record<string, string> = {
    prescription: 'وصفة طبية',
    lab_result: 'نتائج تحليل',
    imaging: 'أشعة',
    report: 'تقرير طبي',
    other: 'ملف آخر'
};

const TYPE_COLORS: Record<string, string> = {
    prescription: 'bg-blue-100 text-blue-700 border-blue-200',
    lab_result: 'bg-purple-100 text-purple-700 border-purple-200',
    imaging: 'bg-orange-100 text-orange-700 border-orange-200',
    report: 'bg-teal-100 text-teal-700 border-teal-200',
    other: 'bg-gray-100 text-gray-700 border-gray-200'
};

export default function RecordsPageClient({ initialRecords }: { initialRecords: MedicalRecord[] }) {
    const [wizardOpen, setWizardOpen] = useState(false);
    const [filter, setFilter] = useState('all');

    const filteredRecords = filter === 'all'
        ? initialRecords
        : initialRecords.filter(r => r.record_type === filter);

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-16 z-10">
                <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">سجلي الطبي</h1>
                            <p className="text-sm text-gray-500">احتفظي بجميع وصفاتك وتقاريرك في مكان واحد</p>
                        </div>
                    </div>

                    <Button onClick={() => setWizardOpen(true)} className="gap-2">
                        <Plus className="w-5 h-5" />
                        سجل جديد
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="container mx-auto px-4 py-6">
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {['all', 'prescription', 'lab_result', 'imaging', 'report'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${filter === f
                                ? 'bg-gray-900 text-white shadow-md'
                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            {f === 'all' ? 'الكل' : TYPE_LABELS[f]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4">
                {filteredRecords.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredRecords.map((record) => (
                            <div key={record.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group">
                                <div className="p-1 min-h-[160px] bg-gray-50 relative flex items-center justify-center overflow-hidden">
                                    {/* Preview if image */}
                                    {record.signedUrl && (record.file_name.match(/\.(jpg|jpeg|png|webp)$/i)) ? (
                                        <div className="relative w-full h-full min-h-[200px]">
                                            <Image
                                                src={record.signedUrl}
                                                alt={record.description || 'Record'}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                    ) : (
                                        <FileText className="w-16 h-16 text-gray-300" />
                                    )}

                                    <div className="absolute top-3 right-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${TYPE_COLORS[record.record_type] || TYPE_COLORS.other}`}>
                                            {TYPE_LABELS[record.record_type]}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-gray-900 line-clamp-1" title={record.description}>
                                            {record.description || record.file_name}
                                        </h3>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-400 mb-4 gap-4">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {format(new Date(record.record_date), 'd MMM yyyy', { locale: arSA })}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                        <span className={`text-xs px-2 py-1 rounded bg-gray-100 text-gray-500 flex items-center gap-1`}>
                                            {record.ai_status === 'pending' ? 'بانتظار تحليل الذكاء الاصطناعي...' : 'تم التحليل'}
                                        </span>
                                        {record.signedUrl && (
                                            <a
                                                href={record.signedUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-teal-600 text-sm font-bold hover:underline"
                                            >
                                                عرض الملف
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                            <FileText className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">لا توجد سجلات طبية بعد</h3>
                        <p className="text-gray-500 mb-8 text-center max-w-sm">
                            ابدئي بإضافة وصفاتك الطبية وتقاريرك ليقوم النظام بتحليلها وتنظيمها لك.
                        </p>
                        <Button onClick={() => setWizardOpen(true)} size="lg" className="rounded-xl">
                            إضافة أول سجل
                        </Button>
                    </div>
                )}
            </div>

            {wizardOpen && <UploadRecordWizard onClose={() => setWizardOpen(false)} />}
        </div>
    );
}
