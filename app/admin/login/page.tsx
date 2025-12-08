'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Lock, AlertCircle } from 'lucide-react';

function AdminLoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = createClient();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const urlError = searchParams.get('error');
    if (urlError === 'not_an_admin' && !error) {
        setError('هذا الحساب ليس حساب مسؤول.');
    }

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw authError;

            if (!authData.user) throw new Error('Auth failed');

            // Verify admin role
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', authData.user.id)
                .single();

            if (profileError) throw profileError;

            if (profile.role !== 'admin') {
                await supabase.auth.signOut();
                throw new Error('غير مصرح لك بالدخول إلى لوحة التحكم');
            }

            router.push('/admin-portal/dashboard');
            router.refresh();

        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.message || 'حدث خطأ أثناء تسجيل الدخول');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex flex-col items-center mb-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 text-purple-600">
                    <Shield className="w-8 h-8" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">مشرف النظام</h1>
                <p className="text-sm text-gray-500 mt-1">تسجيل الدخول للوحة التحكم</p>
            </div>

            {error && (
                <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                    <Label>البريد الإلكتروني</Label>
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="text-left"
                        dir="ltr"
                    />
                </div>

                <div className="space-y-2">
                    <Label>كلمة المرور</Label>
                    <div className="relative">
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="text-left"
                            dir="ltr"
                        />
                        <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    disabled={loading}
                >
                    {loading ? 'جاري الدخول...' : 'تسجيل الدخول'}
                </Button>
            </form>
        </div>
    );
}

export default function AdminLoginPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir="rtl">
            <Suspense fallback={<div>Loading...</div>}>
                <AdminLoginForm />
            </Suspense>
        </div>
    );
}
