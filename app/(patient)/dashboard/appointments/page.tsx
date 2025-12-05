import AppointmentsList from '@/components/patient/dashboard/AppointmentsList';

export default function AppointmentsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">مواعيدي</h1>
                <p className="text-gray-500 mt-1">إدارة مواعيدك الحالية والسابقة</p>
            </div>

            <AppointmentsList />
        </div>
    );
}
