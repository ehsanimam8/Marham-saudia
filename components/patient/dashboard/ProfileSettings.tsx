'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ProfileSettings() {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Info */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">المعلومات الشخصية</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">الاسم الأول</Label>
                            <Input id="firstName" defaultValue="سارة" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">اسم العائلة</Label>
                            <Input id="lastName" defaultValue="محمد" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">البريد الإلكتروني</Label>
                        <Input id="email" type="email" defaultValue="sara@example.com" disabled className="bg-gray-50" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">رقم الجوال</Label>
                        <Input id="phone" type="tel" defaultValue="+966 50 123 4567" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="dob">تاريخ الميلاد</Label>
                            <Input id="dob" type="date" defaultValue="1990-05-15" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="gender">الجنس</Label>
                            <Select defaultValue="female">
                                <SelectTrigger>
                                    <SelectValue placeholder="اختر الجنس" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="female">أنثى</SelectItem>
                                    <SelectItem value="male">ذكر</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Medical Info */}
                <div className="space-y-4 pt-4">
                    <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">المعلومات الطبية</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="bloodType">فصيلة الدم</Label>
                            <Select defaultValue="o_pos">
                                <SelectTrigger>
                                    <SelectValue placeholder="اختر فصيلة الدم" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="a_pos">A+</SelectItem>
                                    <SelectItem value="a_neg">A-</SelectItem>
                                    <SelectItem value="b_pos">B+</SelectItem>
                                    <SelectItem value="b_neg">B-</SelectItem>
                                    <SelectItem value="o_pos">O+</SelectItem>
                                    <SelectItem value="o_neg">O-</SelectItem>
                                    <SelectItem value="ab_pos">AB+</SelectItem>
                                    <SelectItem value="ab_neg">AB-</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="weight">الوزن (كجم)</Label>
                            <Input id="weight" type="number" defaultValue="65" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="allergies">الحساسية (إن وجدت)</Label>
                        <Input id="allergies" placeholder="مثال: البنسلين، الفول السوداني..." />
                    </div>
                </div>

                <div className="pt-6">
                    <Button type="submit" className="bg-teal-600 hover:bg-teal-700 w-full md:w-auto" disabled={isLoading}>
                        {isLoading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
