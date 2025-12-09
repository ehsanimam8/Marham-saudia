'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

export default function Header() {
    const pathname = usePathname();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Hide Header on Admin and Doctor Pages
    if (pathname?.startsWith('/admin') || pathname?.startsWith('/doctor-portal')) return null;

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const supabase = createClient();

        async function getUser() {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                setUser(user);
            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                setLoading(false);
            }
        }

        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const navigation = [
        { name: 'الرئيسية', href: '/' },
        { name: 'ابحثي عن طبيبة', href: '/doctors' },
        { name: 'المكتبة الصحية', href: '/articles' },
        { name: 'كيف يعمل', href: '/how-it-works' },
        { name: 'عن مرهم', href: '/about' },
    ];

    return (
        <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <nav className="container mx-auto px-4">
                <div className="flex items-center justify-between py-3">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/logo.png"
                            alt="Marham Saudi"
                            width={240}
                            height={60}
                            className="h-20 w-auto object-contain"
                            priority
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                translate="no"
                                className="text-gray-700 hover:text-teal-600 transition-colors font-medium"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center gap-3">
                        {!loading && (
                            <>
                                {!user && (
                                    <Button asChild variant="outline">
                                        <Link href="/doctor-portal/register">انضمي كطبيبة</Link>
                                    </Button>
                                )}
                                <Button asChild className="bg-teal-600 hover:bg-teal-700">
                                    <Link href={user ? "/dashboard" : "/login"} translate="no">
                                        {user ? "لوحة التحكم" : "حسابي"}
                                    </Link>
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-gray-700"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-100">
                        <div className="flex flex-col gap-4">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    translate="no"
                                    className="text-gray-700 hover:text-teal-600 transition-colors font-medium py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
                                {!loading && (
                                    <>
                                        {!user && (
                                            <Button asChild variant="outline" className="w-full">
                                                <Link href="/doctor-portal/register" onClick={() => setMobileMenuOpen(false)}>
                                                    انضمي كطبيبة
                                                </Link>
                                            </Button>
                                        )}
                                        <Button asChild className="w-full bg-teal-600 hover:bg-teal-700">
                                            <Link href={user ? "/dashboard" : "/login"} translate="no" onClick={() => setMobileMenuOpen(false)}>
                                                {user ? "لوحة التحكم" : "حسابي"}
                                            </Link>
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}
