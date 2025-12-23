
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        // 1. Authenticate User
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Use Admin Client to Bypass RLS
        // We do this because RLS policies might differ or be broken for 'medical_documents' depending on migration state.
        // This ensures we can definitely read the user's documents if they exist.
        const supabaseAdmin = createAdminClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { data: docs, error: dbError } = await supabaseAdmin
            .from('medical_documents')
            .select('*')
            .eq('patient_id', user.id)
            .order('created_at', { ascending: false });

        if (dbError) {
            console.error("Error fetching docs via Admin:", dbError);
            return NextResponse.json({ error: dbError.message }, { status: 500 });
        }

        return NextResponse.json({ documents: docs });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
