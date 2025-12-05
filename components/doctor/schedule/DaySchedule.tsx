'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import TimeSlotPicker from './TimeSlotPicker';

interface TimeSlot {
    start: string;
    end: string;
}

interface DayScheduleProps {
    day: string;
    dayName: string;
    isEnabled: boolean;
    slots: TimeSlot[];
    onToggle: (enabled: boolean) => void;
    onUpdateSlots: (slots: TimeSlot[]) => void;
}

export default function DaySchedule({
    day,
    dayName,
    isEnabled,
    slots,
    onToggle,
    onUpdateSlots,
}: DayScheduleProps) {
    const addSlot = () => {
        onUpdateSlots([...slots, { start: '09:00 AM', end: '05:00 PM' }]);
    };

    const updateSlot = (index: number, newSlot: TimeSlot) => {
        const newSlots = [...slots];
        newSlots[index] = newSlot;
        onUpdateSlots(newSlots);
    };

    const removeSlot = (index: number) => {
        const newSlots = [...slots];
        newSlots.splice(index, 1);
        onUpdateSlots(newSlots);
    };

    return (
        <div className={`p-6 rounded-xl border transition-colors ${isEnabled ? 'bg-white border-gray-200' : 'bg-gray-50 border-transparent'}`}>
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                    <Switch
                        checked={isEnabled}
                        onCheckedChange={onToggle}
                    />
                    <span className={`font-bold ${isEnabled ? 'text-gray-900' : 'text-gray-400'}`}>
                        {dayName}
                    </span>
                </div>

                {isEnabled && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={addSlot}
                        className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                    >
                        <Plus className="w-4 h-4 ml-1" />
                        إضافة فترة
                    </Button>
                )}
            </div>

            {isEnabled && (
                <div className="space-y-3 pr-12">
                    {slots.map((slot, index) => (
                        <TimeSlotPicker
                            key={index}
                            slot={slot}
                            onUpdate={(newSlot) => updateSlot(index, newSlot)}
                            onRemove={() => removeSlot(index)}
                        />
                    ))}
                    {slots.length === 0 && (
                        <p className="text-sm text-gray-400 italic">لا توجد فترات محددة</p>
                    )}
                </div>
            )}
        </div>
    );
}
