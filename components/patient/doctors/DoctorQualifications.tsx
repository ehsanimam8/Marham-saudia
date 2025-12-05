import { GraduationCap, Award, Briefcase } from 'lucide-react';
import type { Doctor } from '@/lib/api/doctors';

interface DoctorQualificationsProps {
    doctor: Doctor;
}

export default function DoctorQualifications({ doctor }: DoctorQualificationsProps) {
    return (
        <section className="bg-white rounded-2xl border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">المؤهلات والخبرات</h2>

            <div className="space-y-6">
                {/* Education */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <GraduationCap className="w-5 h-5 text-teal-600" />
                        <h3 className="font-bold text-gray-900">التعليم</h3>
                    </div>
                    <div className="pr-7 space-y-2 text-gray-700">
                        <p>بكالوريوس الطب والجراحة - جامعة الملك سعود</p>
                        <p className="text-sm text-gray-500">2008</p>
                    </div>
                </div>

                {/* Certifications */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <Award className="w-5 h-5 text-teal-600" />
                        <h3 className="font-bold text-gray-900">الشهادات</h3>
                    </div>
                    <div className="pr-7 space-y-2 text-gray-700">
                        <p>البورد السعودي في {doctor.specialty}</p>
                        <p className="text-sm text-gray-500">الهيئة السعودية للتخصصات الصحية</p>
                    </div>
                </div>

                {/* License */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <Briefcase className="w-5 h-5 text-teal-600" />
                        <h3 className="font-bold text-gray-900">الترخيص</h3>
                    </div>
                    <div className="pr-7 space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="text-gray-700">رقم الترخيص: {doctor.scfhs_license}</span>
                            <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full font-medium">
                                تم التحقق ✓
                            </span>
                        </div>
                    </div>
                </div>

                {/* Experience */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <Briefcase className="w-5 h-5 text-teal-600" />
                        <h3 className="font-bold text-gray-900">الخبرة المهنية</h3>
                    </div>
                    <div className="pr-7 space-y-3">
                        <div>
                            <p className="font-medium text-gray-900">استشارية - {doctor.hospital}</p>
                            <p className="text-sm text-gray-500">{doctor.experience_years} سنوات</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
