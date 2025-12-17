'use client';

import { usePathname } from 'next/navigation';
import DoctorSidebar from '@/components/doctor-portal/dashboard/DoctorSidebar';

export default function DoctorPortalContentWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    // Hide sidebar if path ends with '/room'
    const isRoomPage = pathname?.endsWith('/room');

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {!isRoomPage && <DoctorSidebar />}

            <main className={`flex-1 p-8 ${!isRoomPage ? 'mr-64' : 'p-0 mr-0'}`}>
                {children}
            </main>
        </div>
    );
}
