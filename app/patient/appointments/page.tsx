
import { MessageSquare, Calendar, Clock, Video, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { createClient } from '@/lib/supabase/server';
import { getPatientAppointments } from '@/lib/api/appointments';

export default async function PatientAppointmentsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // In MVP, we might auto-create patient profile or handle auth check
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8 bg-white rounded-2xl shadow-sm max-w-md">
                    <h2 className="text-xl font-bold mb-2">يرجى تسجيل الدخول</h2>
                    <p className="text-gray-500 mb-4">يجب عليك تسجيل الدخول لعرض مواعيدك.</p>
                </div>
            </div>
        );
    }

    // Must fetch patient ID from profile ID
    const { data: patient, error: patientError } = await supabase
        .from('patients')
        .select('id')
        .eq('profile_id', user.id)
        .single();

    if (patientError) {
        console.error('Error fetching patient record:', patientError);
    }

    // If no patient record, show empty state or init
    const appointments = patient ? await getPatientAppointments(supabase, patient.id) : [];

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">مواعيدي</h1>
                        <p className="text-gray-500 mt-1">إدارة حجوزاتك ومواعيدك القادمة</p>
                    </div>

                    {appointments.length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                            <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto text-teal-200 mb-4">
                                <Calendar className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">لا توجد مواعيد قادمة</h3>
                            <p className="text-gray-500 mb-6">لم تقم بحجز أي موعد طبي حتى الآن.</p>
                            <Button className="bg-teal-600 hover:bg-teal-700">تصفح الأطباء</Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {appointments.map((apt: any) => (
                                <div key={apt.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="w-16 h-16 border-2 border-white shadow-sm">
                                            <AvatarImage src={apt.doctors.profile_photo_url} />
                                            <AvatarFallback>{apt.doctors?.profiles?.full_name_ar?.[0] || '?'}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg">د. {apt.doctors?.profiles?.full_name_ar || 'غير معروف'}</h3>
                                            <p className="text-sm text-gray-600 flex items-center gap-1.5 mb-2">
                                                <User className="w-3 h-3" />
                                                {apt.doctors?.specialty || '-'}
                                            </p>
                                            <div className="flex flex-wrap gap-3 text-sm">
                                                <span className="flex items-center gap-1.5 text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                                                    <Calendar className="w-4 h-4" />
                                                    {apt.appointment_date}
                                                </span>
                                                <span className="flex items-center gap-1.5 text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                                                    <Clock className="w-4 h-4" />
                                                    {apt.start_time}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                                        <Badge variant={apt.status === 'scheduled' ? 'default' : 'secondary'} className="mb-1">
                                            {apt.status === 'scheduled' ? 'مؤكد' : apt.status}
                                        </Badge>

                                        {/* Action Buttons */}
                                        <div className="flex gap-3 w-full md:w-auto">
                                            {apt.video_room_url && (
                                                <a href={`/consultation/${apt.id}`} target="_blank" rel="noopener noreferrer" className="w-full md:w-auto">
                                                    <Button className="w-full bg-teal-600 hover:bg-teal-700 gap-2">
                                                        <Video className="w-4 h-4" />
                                                        دخول العيادة الافتراضية
                                                    </Button>
                                                </a>
                                            )}
                                            <Button variant="outline" className="gap-2">
                                                <MessageSquare className="w-4 h-4" />
                                                مراسلة
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
