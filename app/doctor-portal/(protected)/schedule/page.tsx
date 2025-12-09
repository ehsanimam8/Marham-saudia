import WeeklySchedule from '@/components/doctor-portal/schedule/WeeklySchedule';
import { getDoctorSchedule } from '@/app/actions/schedule';

export default async function SchedulePage() {
    const schedule = await getDoctorSchedule();

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">إدارة الجدول</h1>
                <p className="text-gray-500 mt-1">قومي بتحديث أوقات عملك لتظهر للمرضى</p>
            </div>

            <WeeklySchedule initialSchedule={schedule || undefined} />
        </div>
    );
}
