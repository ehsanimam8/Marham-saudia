'use client';

import { useState } from 'react';
import {
    User,
    ClipboardList,
    Thermometer,
    Pill,
    FileText,
    Activity,
    ChevronDown,
    ChevronUp,
    Download,
    Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { format } from 'date-fns';

// Simple types for props
interface PatientInfoSidebarProps {
    patient: any;
    intakeForm: any;
    medicalRecord: any;
    documents: any[];
}

export default function PatientInfoSidebar({
    patient,
    intakeForm,
    medicalRecord,
    documents
}: PatientInfoSidebarProps) {

    return (
        <div className="h-full flex flex-col bg-white border-r border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="font-bold text-gray-800 flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-teal-600" />
                    ملف المريض
                </h2>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">

                    {/* A. Demographics */}
                    <SidebarSection title="بيانات المريضة" icon={User} defaultOpen>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">الاسم:</span>
                                <span className="font-medium">{patient.full_name_ar || patient.full_name_en}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">المدينة:</span>
                                <span>{patient.city || '-'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">الجوال:</span>
                                <span dir="ltr">{patient.phone || '-'}</span>
                            </div>
                        </div>
                    </SidebarSection>

                    {/* B. Chief Complaint */}
                    {intakeForm && (
                        <SidebarSection title="الشكوى الرئيسية" icon={Activity} defaultOpen>
                            <div className="space-y-3">
                                <div className="bg-red-50 p-3 rounded-lg text-sm text-gray-800 border-r-4 border-red-400">
                                    {intakeForm.chief_complaint}
                                </div>
                                <div className="flex flex-wrap gap-2 text-xs">
                                    <Badge variant="outline">المدة: {formatDuration(intakeForm.symptoms_duration)}</Badge>
                                    <Badge variant={intakeForm.severity_level > 7 ? 'destructive' : 'secondary'}>
                                        الحدة: {intakeForm.severity_level}/10
                                    </Badge>
                                </div>
                            </div>
                        </SidebarSection>
                    )}

                    {/* C. Current Symptoms */}
                    {intakeForm?.current_symptoms && (
                        <SidebarSection title="الأعراض الحالية" icon={Thermometer}>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(intakeForm.current_symptoms)
                                    .filter(([_, v]) => v)
                                    .map(([k, _]) => (
                                        <Badge key={k} variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                                            {formatSymptom(k)}
                                        </Badge>
                                    ))
                                }
                            </div>
                            {intakeForm.symptom_details && (
                                <p className="mt-2 text-sm text-gray-600 border-t pt-2">
                                    {intakeForm.symptom_details}
                                </p>
                            )}
                        </SidebarSection>
                    )}

                    {/* D. Medications */}
                    {(intakeForm?.tried_medications?.length > 0 || intakeForm?.current_medications_list) && (
                        <SidebarSection title="الأدوية" icon={Pill}>
                            <div className="space-y-2 text-sm">
                                {intakeForm.tried_medications?.length > 0 && (
                                    <div>
                                        <span className="text-gray-500 block mb-1">أدوية تمت تجربتها:</span>
                                        <ul className="list-disc list-inside">
                                            {intakeForm.tried_medications.map((m: string, i: number) => (
                                                <li key={i}>{m}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </SidebarSection>
                    )}

                    {/* E. Documents */}
                    {documents && documents.length > 0 && (
                        <SidebarSection title="المرفقات الطبية" icon={FileText} defaultOpen>
                            <div className="space-y-2">
                                {documents.map((doc: any) => (
                                    <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-100">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                                            <div className="truncate text-xs">
                                                <div className="font-medium truncate">{doc.title}</div>
                                                <div className="text-gray-500">{doc.document_type}</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                                                <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                                                    <Eye className="w-3 h-3" />
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </SidebarSection>
                    )}

                    {/* F. Medical History (EMR) */}
                    {medicalRecord && (
                        <SidebarSection title="السجل الطبي" icon={ClipboardList}>
                            <div className="space-y-2 text-sm">
                                {medicalRecord.allergies && medicalRecord.allergies.length > 0 && (
                                    <div className="text-red-600">
                                        <span className="font-bold">الحساسية: </span>
                                        {medicalRecord.allergies.join(', ')}
                                    </div>
                                )}
                                {medicalRecord.chronic_conditions && medicalRecord.chronic_conditions.length > 0 && (
                                    <div className="text-gray-800">
                                        <span className="font-bold">أمراض مزمنة: </span>
                                        {medicalRecord.chronic_conditions.join(', ')}
                                    </div>
                                )}
                                {(!medicalRecord.allergies && !medicalRecord.chronic_conditions) && (
                                    <p className="text-gray-400 italic">لا توجد بيانات مسجلة</p>
                                )}
                            </div>
                        </SidebarSection>
                    )}

                </div>
            </ScrollArea>
        </div>
    );
}

function SidebarSection({ title, icon: Icon, children, defaultOpen = false }: any) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border border-gray-200 rounded-lg overflow-hidden">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-white hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                    <Icon className="w-4 h-4 text-gray-500" />
                    {title}
                </div>
                {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="p-3 bg-white border-t border-gray-100">
                {children}
            </CollapsibleContent>
        </Collapsible>
    );
}

// Helpers
function formatDuration(val: string) {
    const map: Record<string, string> = {
        'less_24h': 'أقل من 24 ساعة',
        '1_3_days': '1-3 أيام',
        '1_week': 'أسبوع',
        '2_weeks': 'أسبوعين',
        '1_month': 'شهر',
        'more_1_month': 'أكثر من شهر'
    };
    return map[val] || val;
}

function formatSymptom(key: string) {
    // Map same keys as IntakeForm
    const map: Record<string, string> = {
        'irregular_periods': 'عدم انتظام الدورة',
        'heavy_bleeding': 'نزيف حاد',
        'pelvic_pain': 'ألم حوض',
        'vaginal_discharge': 'إفرازات',
        'cramps': 'تشنجات',
        'hot_flashes': 'هبات ساخنة',
        'breast_pain': 'ألم ثدي'
    };
    return map[key] || key;
}
