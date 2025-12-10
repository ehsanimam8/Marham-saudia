
import { createClient } from '@/lib/supabase/server';
import ArticlesTable from '@/components/admin/ArticlesTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminArticlesPage() {
    const supabase = await createClient();

    const { data: articles } = await supabase
        .from('articles')
        .select(`
            *,
            doctors:reviewed_by_doctor_id (
                *,
                profiles:profile_id (*)
            )
        `)
        .order('created_at', { ascending: false });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">إدارة المقالات</h1>
                    <p className="text-gray-500 mt-1">مراجعة ونشر المقالات الطبية</p>
                </div>
                {/* Link to Doctor Portal for creating article? Or Admin Create? For now no Admin Create UI */}
                <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700" disabled>
                    <Plus className="w-4 h-4" />
                    إضافة مقال (عبر بوابة الطبيب)
                </Button>
            </div>

            <ArticlesTable articles={articles || []} />
        </div>
    );
}
