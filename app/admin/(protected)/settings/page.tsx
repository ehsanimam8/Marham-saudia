"use client";

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Save, Globe, Lock, Bell, Mail } from 'lucide-react';

export default function AdminSettingsPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">إعدادات المنصة</h1>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                    <Save className="w-4 h-4 ml-2" />
                    حفظ التغييرات
                </Button>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="mb-6 grid w-full md:w-[600px] grid-cols-4 bg-white border border-gray-200 p-1 rounded-xl h-auto">
                    <TabsTrigger value="general" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 py-2">عام</TabsTrigger>
                    <TabsTrigger value="content" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 py-2">المحتوى</TabsTrigger>
                    <TabsTrigger value="notifications" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 py-2">الإشعارات</TabsTrigger>
                    <TabsTrigger value="security" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 py-2">الأمان</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="w-5 h-5 text-gray-500" />
                                معلومات المنصة الأساسية
                            </CardTitle>
                            <CardDescription>تعديل اسم الموقع، الوصف، والشعار</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>اسم المنصة (عربي)</Label>
                                    <Input defaultValue="مرهم السعودية" />
                                </div>
                                <div className="space-y-2">
                                    <Label>اسم المنصة (إنجليزي)</Label>
                                    <Input defaultValue="Marham Saudi" className="text-left" dir="ltr" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>البريد الإلكتروني للدعم</Label>
                                <Input defaultValue="support@marham.sa" className="text-left" dir="ltr" />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <h4 className="font-medium">وضع الصيانة</h4>
                                    <p className="text-sm text-gray-500">إيقاف الموقع مؤقتاً للزوار</p>
                                </div>
                                <Switch />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="w-5 h-5 text-gray-500" />
                                إعدادات التنبيهات
                            </CardTitle>
                            <CardDescription>التحكم في الإشعارات التلقائية للنظام</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between py-2 border-b">
                                <div>
                                    <p className="font-medium">تنبيه عند تسجيل طبيب جديد</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between py-2 border-b">
                                <div>
                                    <p className="font-medium">تنبيه عند حجز موعد جديد</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <div>
                                    <p className="font-medium">رسائل الأخطاء التقنية</p>
                                </div>
                                <Switch />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Lock className="w-5 h-5 text-gray-500" />
                                إعدادات الأمان
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>كلمة مرور المسؤول الرئيسية</Label>
                                <Input type="password" placeholder="••••••••" className="text-left" dir="ltr" />
                            </div>
                            <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                                تغيير كلمة المرور
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
