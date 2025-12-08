import { getConsultationData } from '@/app/actions/consultation';
import ConsultationClient from './ConsultationClient';
import { redirect } from 'next/navigation';

export default async function ConsultationPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;

    let data;
    try {
        data = await getConsultationData(id);
    } catch (error) {
        // Redirect to login if unauthorized or 404
        return redirect('/login');
    }

    return (
        <ConsultationClient
            data={data}
            appointmentId={id}
        />
    );
}
