import { createClient } from '@/lib/supabase/server';
import { getDoctorProfile } from '@/lib/api/doctors';
import { redirect } from 'next/navigation';
import { Wallet, ArrowDownLeft, ArrowUpRight, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default async function EarningsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/auth/login');

    const doctor = await getDoctorProfile(user.id);
    if (!doctor) redirect('/doctor/register');

    // Fetch Earnings
    const { data: transactions } = await supabase
        .from('earnings')
        .select(`
            id,
            doctor_earnings,
            payout_status,
            created_at,
            appointments (
                appointment_date,
                patients (
                    profiles (full_name_ar)
                )
            )
        `)
        .eq('doctor_id', doctor.id)
        .order('created_at', { ascending: false });

    // Calculate Totals
    const totalEarnings = transactions?.reduce((sum, tx) => sum + Number(tx.doctor_earnings), 0) || 0;
    const pendingPayout = transactions
        ?.filter(tx => tx.payout_status === 'pending')
        .reduce((sum, tx) => sum + Number(tx.doctor_earnings), 0) || 0;
    const paidTotal = totalEarnings - pendingPayout;

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">الأرباح والمدفوعات</h1>
                <p className="text-gray-500 mt-1">تتبع دخلك من الاستشارات وحالة الدفعات</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Wallet className="w-24 h-24 text-teal-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-500 mb-2">إجمالي الأرباح</p>
                    <h3 className="text-3xl font-bold text-gray-900">{totalEarnings.toFixed(2)} ر.س</h3>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-50 rounded-lg text-green-600">
                            <ArrowDownLeft className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-medium text-gray-500">تم تحويله</p>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{paidTotal.toFixed(2)} ر.س</h3>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                            <Clock className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-medium text-gray-500">معلق (قيد المراجعة)</p>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{pendingPayout.toFixed(2)} ر.س</h3>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900">سجل المعاملات</h3>
                </div>

                {!transactions || transactions.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        لا توجد معاملات حتى الآن
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 text-xs text-gray-500 font-medium">
                                <tr>
                                    <th className="px-6 py-4 text-right">المريض</th>
                                    <th className="px-6 py-4 text-right">تاريخ الموعد</th>
                                    <th className="px-6 py-4 text-right">المبلغ</th>
                                    <th className="px-6 py-4 text-center">الحالة</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {transactions.map((tx: any) => (
                                    <tr key={tx.id} className="hover:bg-gray-50/50">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {tx.appointments?.patients?.profiles?.full_name_ar || 'مريض غير معروف'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {tx.appointments?.appointment_date || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900">
                                            {tx.doctor_earnings} ر.س
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Badge variant={tx.payout_status === 'paid' ? 'default' : 'secondary'}
                                                className={tx.payout_status === 'paid' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-amber-100 text-amber-700 hover:bg-amber-100 border-transparent'}>
                                                {tx.payout_status === 'paid' ? 'محول' : 'معلق'}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
