import { getPatientRecords } from '@/app/actions/records';
import RecordsPageClient from '@/components/patient/records/RecordsPageClient';

export const metadata = {
    title: 'سجلي الطبي | مرهم',
    description: 'إدارة السجلات الطبية والوصفات'
};

export default async function MedicalRecordsPage() {
    const records = await getPatientRecords();

    return <RecordsPageClient initialRecords={records} />;
}
