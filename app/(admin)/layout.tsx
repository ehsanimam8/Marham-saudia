import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Marham Admin',
    description: 'Marham Saudi Administration Portal',
    robots: 'noindex, nofollow',
};

export default function AdminRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 font-sans text-right" dir="rtl">
            {children}
        </div>
    );
}
