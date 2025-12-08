'use client';

import RegistrationWizard from '@/components/doctor-portal/register/RegistrationWizard';

export default function DoctorRegisterPage() {
    return (
        <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">انضمي إلينا كطبيبة</h1>
                <p className="text-gray-500">سجلي الآن لتصبحي جزءاً من أكبر شبكة طبية نسائية في المملكة</p>
            </div>

            <RegistrationWizard />
        </div>
    );
}
