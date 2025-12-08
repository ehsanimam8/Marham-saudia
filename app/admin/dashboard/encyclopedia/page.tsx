import { getMedicalConditions } from '@/lib/api/encyclopedia';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

import AddConditionDialog, { DeleteConditionButton } from '@/components/admin/encyclopedia/AddConditionDialog';

export default async function AdminEncyclopediaPage() {
    const supabase = await createClient();
    const conditions = await getMedicalConditions(supabase, 100);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">الموسوعة الطبية</h1>
                    <p className="text-gray-500 mt-1">إدارة الأمراض والأعراض الطبية</p>
                </div>
                <AddConditionDialog />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <Table className="text-right">
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead className="text-right">اسم المرض (عربي)</TableHead>
                            <TableHead className="text-right">الاسم الإنجليزي</TableHead>
                            <TableHead className="text-right">التخصص</TableHead>
                            <TableHead className="text-right">الإجراءات</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {conditions.length > 0 ? (
                            conditions.map((condition: any) => (
                                <TableRow key={condition.id}>
                                    <TableCell className="font-medium text-gray-900">
                                        {condition.name_ar}
                                    </TableCell>
                                    <TableCell className="text-gray-500 font-sans" dir="ltr">
                                        {condition.name_en}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="bg-teal-50 text-teal-700">
                                            {condition.specialty}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                                تعديل
                                            </Button>
                                            <DeleteConditionButton id={condition.id} />
                                            <Link href={`/encyclopedia/${condition.slug}`} target="_blank">
                                                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                                                    عرض
                                                </Button>
                                            </Link>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-gray-500">
                                    لا توجد بيانات حالياً
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
