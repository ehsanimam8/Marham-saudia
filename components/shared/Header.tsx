'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function Header() {
    const pathname = usePathname();

    // Hide Header on Admin Pages
    if (pathname?.startsWith('/admin')) return null;

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
                                className="text-gray-700 hover:text-teal-600 transition-colors font-medium"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link href="/doctor/register">
                            <Button variant="outline">انضمي كطبيبة</Button>
                        </Link>
                        <Link href="/dashboard">
                            <Button className="bg-teal-600 hover:bg-teal-700">حسابي</Button>
                        </Link>
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
                                    className="text-gray-700 hover:text-teal-600 transition-colors font-medium py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
                                <Link href="/doctor/register" onClick={() => setMobileMenuOpen(false)}>
                                    <Button variant="outline" className="w-full">انضمي كطبيبة</Button>
                                </Link>
                                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                                    <Button className="w-full bg-teal-600 hover:bg-teal-700">حسابي</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}
