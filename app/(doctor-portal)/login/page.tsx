'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Stethoscope, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';

function DoctorLoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = createClient();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Check for URL params errors
    // Need to wrap in useEffect to avoid hydration mismatch if searchParams change? 
    // Actually searchParams is available on client.
    useEffect(() => {
        const urlError = searchParams.get('error');
        if (urlError === 'not_a_doctor') {
            setError('هذا الحساب ليس حساب طبيبة. يرجى استخدام بوابة المرضى.');
        } else if (urlError === 'no_doctor_record') {
            setError('لم يتم العثور على سجل طبيبة لهذا الحساب.');
        }
    }, [searchParams]);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Sign in with Supabase
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) {
                if (authError.message.includes('Invalid login credentials')) {
                    throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
                }
                throw authError;
            }

            if (!authData.user) throw new Error('Auth failed');

            // Verify user is a doctor
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', authData.user.id)
                .single();

            if (profileError) throw profileError;

            if (profile.role !== 'doctor') {
                // Not a doctor - sign them out
                await supabase.auth.signOut();

                if (profile.role === 'patient') {
                    // Setting error state with JSX element (React Node) isn't standard for simple state usually typed as string. 
                    // But I typed it string | null.
                    // I will throw an error message string for simplicity or update type.
                    throw new Error('هذا حساب مريضة. يرجى استخدام بوابة المرضى.');
                } else {
                    throw new Error('هذا الحساب غير مصرح له بالدخول إلى بوابة الأطباء');
                }
                return;
            }

            // Check if doctor record exists
            const { data: doctorData, error: doctorError } = await supabase
                .from('doctors')
                .select('verification_status')
                .eq('user_id', authData.user.id)
                .single();

            if (doctorError) {
                await supabase.auth.signOut();
                throw new Error('لم يتم العثور على سجل طبيبة. يرجى التواصل مع الدعم.');
            }

            // All checks passed - redirect (layout will handle pending/rejected status)
            router.push('/doctor-portal/dashboard');
            router.refresh();

        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full max-w-md">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                    <Stethoscope className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">مرهم Marham</h1>
                    <p className="text-sm text-gray-600">بوابة الأطباء</p>
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">تسجيل الدخول</h2>
                <p className="text-gray-600">
                    ليس لديك حساب؟{' '}
                    <Link href="/doctor-portal/register" className="text-teal-600 hover:text-teal-700 font-medium">
                        سجلي الآن
                    </Link>
                </p>
            </div>

            {error && (
                <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="doctor@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        dir="ltr"
                        className="text-left"
                        autoComplete="email"
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">كلمة المرور</Label>
                        <Link
                            href="/doctor/forgot-password"
                            className="text-sm text-teal-600 hover:text-teal-700"
                        >
                            نسيت كلمة المرور؟
                        </Link>
                    </div>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            dir="ltr"
                            className="text-left pr-10"
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full bg-teal-600 hover:bg-teal-700"
                    size="lg"
                    disabled={loading}
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            جاري تسجيل الدخول...
                        </span>
                    ) : (
                        <>
                            تسجيل الدخول
                            <ArrowRight className="mr-2 h-4 w-4" />
                        </>
                    )}
                </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="text-center space-y-3">
                    <p className="text-sm text-gray-600">هل أنتِ مريضة؟</p>
                    <Link
                        href="/login"
                        className="block text-teal-600 hover:text-teal-700 font-medium"
                    >
                        انتقل إلى بوابة المرضى ←
                    </Link>
                </div>
            </div>

            <div className="mt-6 text-center">
                <Link
                    href="/admin/login"
                    className="text-xs text-gray-500 hover:text-gray-700"
                >
                    دخول المسؤولين
                </Link>
            </div>
        </div>
    );
}

export default function DoctorLoginPage() {
    return (
        <div className="min-h-screen flex" dir="rtl">
            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <Suspense fallback={<div>Loading...</div>}>
                    <DoctorLoginForm />
                </Suspense>
            </div>

            {/* Right Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-600 to-emerald-600 p-12 flex-col justify-between text-white">
                <div>
                    <h2 className="text-4xl font-bold mb-4">بوابة الأطباء</h2>
                    <p className="text-xl text-teal-100">
                        منصة الاستشارات الطبية النسائية الرائدة في المملكة العربية السعودية
                    </p>
                </div>

                <div className="space-y-6">
                    {[
                        {
                            title: 'إدارة المواعيد',
                            description: 'جدولي مواعيدك واستشاراتك بسهولة ومرونة'
                        },
                        {
                            title: 'السجلات الطبية الإلكترونية',
                            description: 'وصول آمن ومشفر لسجلات المريضات الطبية'
                        },
                        {
                            title: 'الوصفات الطبية الرقمية',
                            description: 'إصدار وصفات طبية إلكترونية معتمدة'
                        },
                        {
                            title: 'الأرباح والإحصائيات',
                            description: 'تتبع أرباحك وأدائك بتقارير مفصلة'
                        }
                    ].map((feature, index) => (
                        <div key={index} className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                <span className="text-2xl">✓</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                                <p className="text-teal-100">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-sm text-teal-100">
                    © 2024 Marham. جميع الحقوق محفوظة.
                </div>
            </div>
        </div>
    );
}
