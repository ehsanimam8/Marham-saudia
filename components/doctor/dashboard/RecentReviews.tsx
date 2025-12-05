import { Star, MessageSquare } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface RecentReviewsProps {
    reviews: any[];
}

export default function RecentReviews({ reviews }: RecentReviewsProps) {
    if (!reviews || reviews.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center justify-center min-h-[300px]">
                <div className="text-center text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>لا توجد تقييمات حديثة</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-gray-900">أحدث التقييمات</h3>
                <span className="text-sm text-gray-500">آخر 7 أيام</span>
            </div>

            <div className="space-y-6">
                {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Avatar className="w-8 h-8">
                                    <AvatarImage src="" alt={review.patients?.profiles?.full_name_ar} />
                                    <AvatarFallback>{review.patients?.profiles?.full_name_ar?.[0] || '?'}</AvatarFallback>
                                </Avatar>
                                <span className="font-bold text-sm text-gray-900">{review.patients?.profiles?.full_name_ar || 'مريض'}</span>
                            </div>
                            {/* Format date */}
                            <span className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString('ar-SA')}</span>
                        </div>

                        <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
                                />
                            ))}
                        </div>

                        <p className="text-sm text-gray-600 leading-relaxed">
                            "{review.review_text_ar || review.review_text_en}"
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
