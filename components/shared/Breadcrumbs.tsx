import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    return (
        <nav className="flex items-center gap-2 text-sm mb-6" aria-label="Breadcrumb">
            <Link href="/" className="text-gray-500 hover:text-teal-600 transition-colors">
                الرئيسية
            </Link>
            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                    <ChevronLeft className="w-4 h-4 text-gray-400 rotate-180" />
                    {item.href ? (
                        <Link href={item.href} className="text-gray-500 hover:text-teal-600 transition-colors">
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-gray-900 font-medium">{item.label}</span>
                    )}
                </div>
            ))}
        </nav>
    );
}
