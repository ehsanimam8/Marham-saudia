import ProfileSettings from '@/components/patient/dashboard/ProfileSettings';

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">إعدادات الحساب</h1>
                <p className="text-gray-500 mt-1">تحديث معلوماتك الشخصية والطبية</p>
            </div>

            <ProfileSettings />
        </div>
    );
}
