import MedicalRecords from '@/components/patient/dashboard/MedicalRecords';

export default function RecordsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">سجلي الطبي</h1>
                <p className="text-gray-500 mt-1">جميع تقاريرك الطبية ووصفاتك في مكان واحد</p>
            </div>

            <MedicalRecords />
        </div>
    );
}
