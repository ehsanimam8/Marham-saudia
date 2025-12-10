import { getAdminArticles } from '@/lib/api/admin';
import { createClient } from '@/lib/supabase/server';
import ArticlesTable from '@/components/admin/ArticlesTable';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function AdminArticlesPage() {
    const supabase = await createClient();
    const articles = await getAdminArticles(supabase);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">إدارة المقالات</h1>
                    <p className="text-gray-500 mt-1">مراجعة المحتوى الطبي</p>
                </div>
                {/* Placeholder for future Create Article feature */}
                <Button className="bg-teal-600 hover:bg-teal-700">
                    كتابة مقال جديد
                </Button>
            </div>

            <ArticlesTable articles={articles} />
        </div>
    );
}
