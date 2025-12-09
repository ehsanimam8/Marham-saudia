"use client";

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Check, X, MoreHorizontal, Trash2, Edit } from 'lucide-react';
import { approveDoctor, rejectDoctor, deleteDoctor } from '@/app/actions/admin';
import { toast } from 'sonner';
import EditDoctorDialog from './EditDoctorDialog';

interface Doctor {
    id: string;
    profile_id: string;
    profiles: {
        full_name_ar: string;
        full_name_en: string;
        city: string;
    };
    specialty: string;
    hospital: string;
    status: string;
    created_at: string;
    scfhs_license: string;
    consultation_price: number;
    experience_years: number;
    bio_ar: string;
    bio_en: string;
    profile_photo_url: string;
}

export default function DoctorsTable({ doctors }: { doctors: any[] }) {
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const handleApprove = async (id: string) => {
        setLoadingId(id);
        try {
            await approveDoctor(id);
            toast.success('تم قبول الطبيبة بنجاح');
        } catch (error) {
            toast.error('حدث خطأ');
        } finally {
            setLoadingId(null);
        }
    };

    const handleReject = async (id: string) => {
        if (!confirm('هل أنت متأكد من رفض هذا الطلب؟')) return;
        setLoadingId(id);
        try {
            await rejectDoctor(id);
            toast.success('تم رفض الطلب');
        } catch (error) {
            toast.error('حدث خطأ');
        } finally {
            setLoadingId(null);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('هل أنت متأكد من حذف حساب الطبيبة نهائياً؟ هذا الإجراء لا يمكن التراجع عنه.')) return;
        setLoadingId(id);
        try {
            await deleteDoctor(id);
            toast.success('تم حذف الطبيبة بنجاح');
        } catch (error) {
            console.error(error);
            toast.error('حدث خطأ أثناء الحذف');
        } finally {
            setLoadingId(null);
        }
    };

    const openEdit = (doctor: any) => {
        setEditingDoctor(doctor);
        setIsEditOpen(true);
    };

    return (
        <>
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="py-4 px-6 text-sm font-medium text-gray-500">الطبيبة</th>
                                <th className="py-4 px-6 text-sm font-medium text-gray-500">التخصص</th>
                                <th className="py-4 px-6 text-sm font-medium text-gray-500">رخصة الهيئة</th>
                                <th className="py-4 px-6 text-sm font-medium text-gray-500">الحالة</th>
                                <th className="py-4 px-6 text-sm font-medium text-gray-500">تاريخ التسجيل</th>
                                <th className="py-4 px-6 text-sm font-medium text-gray-500">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {doctors.map((doctor) => (
                                <tr key={doctor.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={doctor.profile_photo_url} />
                                                <AvatarFallback>{doctor.profiles?.full_name_en?.[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-sm">{doctor.profiles?.full_name_ar}</h3>
                                                <p className="text-xs text-gray-500">{doctor.hospital}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-sm text-gray-600">{doctor.specialty}</td>
                                    <td className="py-4 px-6 text-sm font-mono text-gray-500">{doctor.scfhs_license}</td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${doctor.status === 'approved'
                                            ? 'bg-green-50 text-green-700 border-green-100'
                                            : doctor.status === 'pending'
                                                ? 'bg-yellow-50 text-yellow-700 border-yellow-100'
                                                : 'bg-red-50 text-red-700 border-red-100'
                                            }`}>
                                            {doctor.status === 'approved' ? 'نشط' : doctor.status === 'pending' ? 'قيد المراجعة' : 'مرفوض'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-sm text-gray-500">
                                        {new Date(doctor.created_at).toLocaleDateString('ar-SA')}
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2">
                                            {doctor.status === 'pending' ? (
                                                <>
                                                    <Button
                                                        size="icon"
                                                        className="h-8 w-8 bg-green-50 text-green-600 hover:bg-green-100 border-green-200"
                                                        onClick={() => handleApprove(doctor.id)}
                                                        disabled={loadingId === doctor.id}
                                                        title="قبول"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        className="h-8 w-8 bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                                                        onClick={() => handleReject(doctor.id)}
                                                        disabled={loadingId === doctor.id}
                                                        title="رفض"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-gray-400 hover:text-blue-500"
                                                        title="تعديل"
                                                        onClick={() => openEdit(doctor)}
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-gray-400 hover:text-red-500"
                                                        title="حذف الحساب"
                                                        onClick={() => handleDelete(doctor.id)}
                                                        disabled={loadingId === doctor.id}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <EditDoctorDialog
                doctor={editingDoctor}
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
            />
        </>
    );
}
