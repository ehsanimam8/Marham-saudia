'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import DaySchedule from './DaySchedule';
import { toast } from 'sonner';

const DAYS = [
    { id: 'sunday', name: 'الأحد' },
    { id: 'monday', name: 'الاثنين' },
    { id: 'tuesday', name: 'الثلاثاء' },
    { id: 'wednesday', name: 'الأربعاء' },
    { id: 'thursday', name: 'الخميس' },
    { id: 'friday', name: 'الجمعة' },
    { id: 'saturday', name: 'السبت' },
];

import { saveDoctorSchedule } from '@/app/actions/schedule';

interface WeeklyScheduleProps {
    initialSchedule?: Record<string, any>;
}

export default function WeeklySchedule({ initialSchedule }: WeeklyScheduleProps) {
    const [schedule, setSchedule] = useState<Record<string, any>>(initialSchedule || {
        sunday: { enabled: true, slots: [{ start: '09:00 AM', end: '05:00 PM' }] },
        monday: { enabled: true, slots: [{ start: '09:00 AM', end: '05:00 PM' }] },
        tuesday: { enabled: true, slots: [{ start: '09:00 AM', end: '05:00 PM' }] },
        wednesday: { enabled: true, slots: [{ start: '09:00 AM', end: '05:00 PM' }] },
        thursday: { enabled: true, slots: [{ start: '09:00 AM', end: '05:00 PM' }] },
        friday: { enabled: false, slots: [] },
        saturday: { enabled: false, slots: [] },
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const result = await saveDoctorSchedule(schedule);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success('تم حفظ جدول العمل بنجاح');
            }
        } catch (error) {
            toast.error('حدث خطأ أثناء الحفظ');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 sticky top-20 z-10 shadow-sm">
                <div>
                    <h2 className="font-bold text-gray-900">جدول العمل الأسبوعي</h2>
                    <p className="text-sm text-gray-500">حددي أوقات توفرك للاستشارات</p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-teal-600 hover:bg-teal-700"
                >
                    <Save className="w-4 h-4 ml-2" />
                    {isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                </Button>
            </div>

            <div className="space-y-4">
                {DAYS.map((day) => (
                    <DaySchedule
                        key={day.id}
                        day={day.id}
                        dayName={day.name}
                        isEnabled={schedule[day.id].enabled}
                        slots={schedule[day.id].slots}
                        onToggle={(enabled) =>
                            setSchedule(prev => ({ ...prev, [day.id]: { ...prev[day.id], enabled } }))
                        }
                        onUpdateSlots={(slots) =>
                            setSchedule(prev => ({ ...prev, [day.id]: { ...prev[day.id], slots } }))
                        }
                    />
                ))}
            </div>
        </div>
    );
}
