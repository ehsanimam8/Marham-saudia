'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface Step2Props {
    formData: any;
    updateFormData: (data: any) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function Step2ProfessionalInfo({ formData, updateFormData, onNext, onBack }: Step2Props) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onNext();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-xl font-bold text-gray-900">المعلومات المهنية</h2>
                <p className="text-gray-500 text-sm">أخبرينا عن تخصصك وخبرتك</p>
            </div>

            <div className="space-y-2">
                <div className="space-y-2">
                    <Label htmlFor="specialty">التخصص الرئيسي</Label>
                    <Select
                        value={formData.specialty}
                        onValueChange={(value) => updateFormData({ specialty: value })}
                    >
                        <SelectTrigger className="w-full text-right" dir="rtl">
                            <SelectValue placeholder="اختر التخصص" />
                        </SelectTrigger>
                        <SelectContent dir="rtl">
                            <SelectItem value="OB/GYN">أمراض النساء والولادة</SelectItem>
                            <SelectItem value="Fertility">الخصوبة وعلاج العقم</SelectItem>
                            <SelectItem value="Maternal-Fetal Medicine">طب الأمومة والجنين</SelectItem>
                            <SelectItem value="Mental Health">الصحة النفسية</SelectItem>
                            <SelectItem value="Endocrinology">الغدد الصماء</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="licenseNumber">رقم الترخيص المهني (SCFHS)</Label>
                <Input
                    id="licenseNumber"
                    required
                    value={formData.licenseNumber}
                    onChange={(e) => updateFormData({ licenseNumber: e.target.value })}
                    placeholder="مثال: 12345678"
                    autoComplete="off"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="hospital">المستشفى / العيادة الحالية</Label>
                <Input
                    id="hospital"
                    required
                    value={formData.hospital}
                    onChange={(e) => updateFormData({ hospital: e.target.value })}
                    placeholder="مثال: مستشفى دله"
                    autoComplete="organization"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="bio">نبذة تعريفية</Label>
                <Textarea
                    id="bio"
                    required
                    value={formData.bio}
                    onChange={(e) => updateFormData({ bio: e.target.value })}
                    placeholder="اكتبي نبذة مختصرة عن خبراتك ومجالات اهتمامك..."
                    className="h-32"
                    autoComplete="off"
                />
            </div>

            <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={onBack} className="w-full">
                    السابق
                </Button>
                <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700">
                    التالي
                </Button>
            </div>
        </form>
    );
}
