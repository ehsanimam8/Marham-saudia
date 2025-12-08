'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Step1Props {
    formData: any;
    updateFormData: (data: any) => void;
    onNext: () => void;
}

export default function Step1BasicInfo({ formData, updateFormData, onNext }: Step1Props) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onNext();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-xl font-bold text-gray-900">المعلومات الأساسية</h2>
                <p className="text-gray-500 text-sm">لنبدأ بإنشاء حسابك</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="firstName">الاسم الأول</Label>
                    <Input
                        id="firstName"
                        required
                        value={formData.firstName}
                        onChange={(e) => updateFormData({ firstName: e.target.value })}
                        placeholder="مثال: سارة"
                        autoComplete="given-name"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="lastName">اسم العائلة</Label>
                    <Input
                        id="lastName"
                        required
                        value={formData.lastName}
                        onChange={(e) => updateFormData({ lastName: e.target.value })}
                        placeholder="مثال: الأحمد"
                        autoComplete="family-name"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => updateFormData({ email: e.target.value })}
                    placeholder="name@example.com"
                    autoComplete="email"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="phone">رقم الجوال</Label>
                <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => updateFormData({ phone: e.target.value })}
                    placeholder="+966 50 000 0000"
                    dir="ltr"
                    className="text-right"
                    autoComplete="tel"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input
                    id="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => updateFormData({ password: e.target.value })}
                    placeholder="••••••••"
                    autoComplete="new-password"
                />
            </div>

            <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700">
                التالي
            </Button>
        </form>
    );
}
