import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-6">مرهم</h2>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            أول منصة صحية نسائية في المملكة العربية السعودية. نربطك بأفضل الطبيبات السعوديات لاستشارات خاصة وآمنة من منزلك.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-teal-600 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-teal-600 transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-teal-600 transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold mb-6">روابط سريعة</h3>
                        <ul className="space-y-4">
                            <li><Link href="/about" className="hover:text-teal-400 transition-colors">عن مرهم</Link></li>
                            <li><Link href="/doctors" className="hover:text-teal-400 transition-colors">ابحثي عن طبيبة</Link></li>
                            <li><Link href="/how-it-works" className="hover:text-teal-400 transition-colors">كيف يعمل الموقع</Link></li>
                            <li><Link href="/pricing" className="hover:text-teal-400 transition-colors">الأسعار والباقات</Link></li>
                            <li><Link href="/doctor/register" className="hover:text-teal-400 transition-colors">انضمي كطبيبة</Link></li>
                        </ul>
                    </div>

                    {/* Specialties */}
                    <div>
                        <h3 className="text-white font-bold mb-6">التخصصات</h3>
                        <ul className="space-y-4">
                            <li><Link href="/doctors?specialty=obgyn" className="hover:text-teal-400 transition-colors">أمراض النساء والولادة</Link></li>
                            <li><Link href="/doctors?specialty=fertility" className="hover:text-teal-400 transition-colors">الخصوبة وعلاج العقم</Link></li>
                            <li><Link href="/doctors?specialty=pcos" className="hover:text-teal-400 transition-colors">علاج تكيس المبايض</Link></li>
                            <li><Link href="/doctors?specialty=pregnancy" className="hover:text-teal-400 transition-colors">متابعة الحمل</Link></li>
                            <li><Link href="/doctors?specialty=mental-health" className="hover:text-teal-400 transition-colors">الصحة النفسية</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-bold mb-6">تواصل معنا</h3>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-teal-500" />
                                <span dir="ltr">+966 50 123 4567</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-teal-500" />
                                <span>info@marham.sa</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-teal-500 mt-1" />
                                <span>الرياض، المملكة العربية السعودية</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                    <p>© 2024 مرهم. جميع الحقوق محفوظة.</p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-white transition-colors">سياسة الخصوصية</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">الشروط والأحكام</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
