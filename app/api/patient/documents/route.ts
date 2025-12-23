
import { getPatientRecords } from '@/app/actions/records';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const records = await getPatientRecords();

        // Map to API response format expected by client
        const documents = records.map(r => ({
            id: r.id,
            document_name: r.name,
            upload_date: r.date,
            document_url: r.url,
            source: r.source,
            type: r.type
        }));

        return NextResponse.json({ documents });
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
