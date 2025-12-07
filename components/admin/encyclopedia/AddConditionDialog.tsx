"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { createMedicalCondition, deleteMedicalCondition } from '@/app/actions/encyclopedia';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus, Trash2 } from 'lucide-react';

export default function AddConditionDialog() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);

        try {
            await createMedicalCondition(formData);
            toast.success('تم إضافة المرض بنجاح');
            setOpen(false);
        } catch (error) {
            toast.error('حدث خطأ أثناء الإضافة');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-teal-600 hover:bg-teal-700">
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة مرض جديد
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]" dir="rtl">
                <DialogHeader className="text-right">
                    <DialogTitle>إضافة مرض جديد</DialogTitle>
                    <DialogDescription>
                        أدخل تفاصيل المرض الجديد لإضافته للموسوعة.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name_ar">اسم المرض (عربي)</Label>
                            <Input id="name_ar" name="name_ar" required placeholder="مثال: الصداع النصفي" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name_en">اسم المرض (إنجليزي)</Label>
                            <Input id="name_en" name="name_en" required placeholder="Ex: Migraine" className="text-left" dir="ltr" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="specialty">التخصص الطبي</Label>
                        <Input id="specialty" name="specialty" required placeholder="مثال: المخ والأعصاب" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">وصف مختصر</Label>
                        <Textarea id="description" name="description" placeholder="نبذة عن المرض..." />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="symptoms_text">الأعراض (كل عرض في سطر)</Label>
                        <Textarea id="symptoms_text" name="symptoms_text" placeholder="- ألم شديد في الرأس..." />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="treatment_text">العلاجات المقترحة</Label>
                        <Textarea id="treatment_text" name="treatment_text" placeholder="الراحة، المسكنات..." />
                    </div>

                    <DialogFooter>
                        <div className="flex gap-2 w-full">
                            <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={loading}>
                                {loading && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
                                حفظ
                            </Button>
                            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                                إلغاء
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export function DeleteConditionButton({ id }: { id: string }) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!confirm('هل أنت متأكد من حذف هذا المرض؟')) return;
        setLoading(true);
        try {
            await deleteMedicalCondition(id);
            toast.success('تم الحذف بنجاح');
        } catch (error) {
            toast.error('فشل الحذف');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button variant="ghost" size="sm" onClick={handleDelete} disabled={loading} className="text-red-500 hover:text-red-600 hover:bg-red-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        </Button>
    )
}
