import { createClient } from '@/lib/supabase/server';
import { getDoctorProfile } from '@/lib/api/doctors';
import { redirect } from 'next/navigation';
import { Star, MessageSquare, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';

export default async function ReviewsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/auth/login');

    const doctor = await getDoctorProfile(user.id);
    if (!doctor) redirect('/doctor/register');

    // Fetch Reviews
    const { data: reviews } = await supabase
        .from('reviews')
        .select(`
            *,
            patients (
                profiles (full_name_ar)
            )
        `)
        .eq('doctor_id', doctor.id)
        .order('created_at', { ascending: false });

    const totalReviews = reviews?.length || 0;
    const averageRating = totalReviews > 0
        ? (reviews?.reduce((sum, r) => sum + r.rating, 0) || 0) / totalReviews
        : 0;

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">التقييمات والمراجعات</h1>
                <p className="text-gray-500 mt-1">آراء المرضى وتجاربهم معك</p>
            </div>

            {/* Summary Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-8 mb-8">
                <div className="text-center px-4 border-l border-gray-100">
                    <div className="text-4xl font-bold text-gray-900 mb-1">{averageRating.toFixed(1)}</div>
                    <div className="flex justify-center mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`w-4 h-4 ${star <= Math.round(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                            />
                        ))}
                    </div>
                    <div className="text-xs text-gray-500">متوسط التقييم العام</div>
                </div>
                <div>
                    <div className="text-lg font-bold text-gray-900 mb-1">{totalReviews} مراجعة</div>
                    <p className="text-sm text-gray-500">إجمالي عدد التقييمات التي حصلت عليها</p>
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                {!reviews || reviews.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">لا توجد مراجعات بعد</h3>
                        <p className="text-gray-500">ستظهر آراء المرضى هنا بمجرد الحصول عليها</p>
                    </div>
                ) : (
                    reviews.map((review: any) => (
                        <div key={review.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 font-bold">
                                        {review.patients?.profiles?.full_name_ar?.[0] || 'م'}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">
                                            {review.patients?.profiles?.full_name_ar || 'مريض غير معروف'}
                                        </h4>
                                        <div className="flex items-center gap-1 mt-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`w-3 h-3 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full">
                                    <Calendar className="w-3 h-3" />
                                    {format(new Date(review.created_at), 'd MMMM yyyy', { locale: arSA })}
                                </div>
                            </div>
                            <p className="text-gray-600 leading-relaxed text-sm">
                                {review.review_text_ar || review.review_text_en || 'لا يوجد تعليق نصي'}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
