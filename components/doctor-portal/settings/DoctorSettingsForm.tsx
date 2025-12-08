'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { updateDoctorProfile } from '@/app/actions/doctor';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useEffect } from 'react';

interface DoctorSettingsFormProps {
    initialData: {
        fullName: string;
        specialty: string;
        price: number;
        bio: string;
    };
}

const initialState: any = {
    message: '',
    error: '',
    success: false
};

export default function DoctorSettingsForm({ initialData }: DoctorSettingsFormProps) {
    const [state, formAction, isPending] = useActionState(updateDoctorProfile, initialState);

    useEffect(() => {
        if (state?.success) {
            toast.success(state.message);
        } else if (state?.error) {
            toast.error(state.error);
        }
    }, [state]);

    return (
        <form action={formAction} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <div className="space-y-2">
                <Label htmlFor="fullName">الاسم الكامل (عربي)</Label>
                <Input
                    id="fullName"
                    name="fullName"
                    defaultValue={initialData.fullName}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="specialty">التخصص</Label>
                <Input
                    id="specialty"
                    name="specialty"
                    defaultValue={initialData.specialty}
                    disabled
                    className="bg-gray-50 text-gray-500"
                />
                <p className="text-xs text-gray-400">لا يمكن تغيير التخصص بعد التوثيق</p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="price">سعر الكشفية (ر.س)</Label>
                <Input
                    id="price"
                    name="price"
                    type="number"
                    defaultValue={initialData.price}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="bio">نبذة عني</Label>
                <Textarea
                    id="bio"
                    name="bio"
                    defaultValue={initialData.bio}
                    className="min-h-[120px]"
                />
            </div>

            <Button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700"
                disabled={isPending}
            >
                {isPending ? (
                    <>
                        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                        جاري الحفظ...
                    </>
                ) : 'حفظ التغييرات'}
            </Button>

            {state?.error && (
                <p className="text-red-500 text-sm">{state.error}</p>
            )}
        </form>
    );
}
