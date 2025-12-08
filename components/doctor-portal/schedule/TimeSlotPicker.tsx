'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TimeSlot {
    start: string;
    end: string;
}

interface TimeSlotPickerProps {
    slot: TimeSlot;
    onUpdate: (slot: TimeSlot) => void;
    onRemove: () => void;
}

const hours = Array.from({ length: 24 }, (_, i) => {
    const hour = i % 12 || 12;
    const ampm = i < 12 ? 'AM' : 'PM';
    return `${hour}:00 ${ampm}`;
});

export default function TimeSlotPicker({ slot, onUpdate, onRemove }: TimeSlotPickerProps) {
    return (
        <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
            <Select
                value={slot.start}
                onValueChange={(value) => onUpdate({ ...slot, start: value })}
            >
                <SelectTrigger className="w-[110px] bg-white">
                    <SelectValue placeholder="من" />
                </SelectTrigger>
                <SelectContent>
                    {hours.map((time) => (
                        <SelectItem key={`start-${time}`} value={time}>
                            {time}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <span className="text-gray-400">-</span>

            <Select
                value={slot.end}
                onValueChange={(value) => onUpdate({ ...slot, end: value })}
            >
                <SelectTrigger className="w-[110px] bg-white">
                    <SelectValue placeholder="إلى" />
                </SelectTrigger>
                <SelectContent>
                    {hours.map((time) => (
                        <SelectItem key={`end-${time}`} value={time}>
                            {time}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Button
                variant="ghost"
                size="icon"
                onClick={onRemove}
                className="text-gray-400 hover:text-red-500 hover:bg-red-50"
            >
                <X className="w-4 h-4" />
            </Button>
        </div>
    );
}
