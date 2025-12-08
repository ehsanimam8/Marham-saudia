'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login, signup } from '../actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, AlertCircle } from 'lucide-react';

export default function AuthForms({ next }: { next?: string }) {
    const router = useRouter();
    const [loginState, loginAction, isLoginPending] = useActionState(login, null);
    const [signupState, signupAction, isSignupPending] = useActionState(signup, null);

    // Handle successful login redirect
    useEffect(() => {
        if (loginState?.success) {
            router.push(loginState.redirectTo || '/');
            router.refresh();
        }
    }, [loginState, router]);

    // Handle successful signup redirect
    useEffect(() => {
        if (signupState?.success) {
            router.push(signupState.redirectTo || '/');
            router.refresh();
        }
    }, [signupState, router]);

    return (
        <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="login">تسجيل دخول</TabsTrigger>
                <TabsTrigger value="signup">حساب جديد</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
                <form action={loginAction} className="space-y-4">
                    <input type="hidden" name="next" value={next || ''} />

                    {loginState?.error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                            <div>
                                {loginState.error === 'IS_DOCTOR' ? (
                                    <span>
                                        هذا حساب طبيبة. يرجى استخدام{' '}
                                        <a href="/doctor-portal/login" className="underline font-medium hover:text-red-800">
                                            بوابة الأطباء
                                        </a>
                                    </span>
                                ) : loginState.error === 'IS_ADMIN' ? (
                                    <span>
                                        هذا حساب مسؤول. يرجى استخدام{' '}
                                        <a href="/admin/login" className="underline font-medium hover:text-red-800">
                                            بوابة المسؤولين
                                        </a>
                                    </span>
                                ) : (
                                    loginState.error
                                )}
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="email-login">البريد الإلكتروني</Label>
                        <Input id="email-login" name="email" type="email" placeholder="name@example.com" required className="text-left" dir="ltr" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password-login">كلمة المرور</Label>
                        <Input id="password-login" name="password" type="password" required className="text-left" dir="ltr" />
                    </div>

                    <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={isLoginPending}>
                        {isLoginPending ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                جاري تسجيل الدخول...
                            </>
                        ) : (
                            'تسجيل الدخول'
                        )}
                    </Button>
                </form>
            </TabsContent>

            <TabsContent value="signup">
                <form action={signupAction} className="space-y-4">
                    <input type="hidden" name="next" value={next || ''} />

                    {signupState?.error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            {signupState.error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="fullname">الاسم الكامل</Label>
                        <Input id="fullname" name="full_name" type="text" placeholder="الاسم كما يظهر في الهوية" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email-signup">البريد الإلكتروني</Label>
                        <Input id="email-signup" name="email" type="email" placeholder="name@example.com" required className="text-left" dir="ltr" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password-signup">كلمة المرور</Label>
                        <Input id="password-signup" name="password" type="password" required className="text-left" dir="ltr" minLength={6} />
                    </div>

                    <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={isSignupPending}>
                        {isSignupPending ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                جاري إنشاء الحساب...
                            </>
                        ) : (
                            'إنشاء حساب جديد'
                        )}
                    </Button>
                </form>
            </TabsContent>
        </Tabs>
    );
}
