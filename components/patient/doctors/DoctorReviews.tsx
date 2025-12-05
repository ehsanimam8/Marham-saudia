import { Star } from 'lucide-react';

interface Review {
    id: string;
    rating: number;
    review_text_ar: string;
    patient_name: string;
    city: string;
    created_at: string;
}

interface DoctorReviewsProps {
    doctorId: string;
    averageRating: number;
    totalReviews: number;
}

// Mock reviews for now
const mockReviews: Review[] = [
    {
        id: '1',
        rating: 5,
        review_text_ar: 'د. نورا رائعة! استمعت لمشكلتي بعناية وأعطتني خطة علاج واضحة لتكيس المبايض.',
        patient_name: 'فاطمة',
        city: 'الرياض',
        created_at: '2024-11-20'
    },
    {
        id: '2',
        rating: 5,
        review_text_ar: 'ساعدتني في فهم خيارات الخصوبة المتاحة. شرح واضح ومفصل.',
        patient_name: 'رنا',
        city: 'جدة',
        created_at: '2024-11-15'
    },
    {
        id: '3',
        rating: 4,
        review_text_ar: 'استشارة مفيدة جداً. كنت أتمنى لو كان الوقت أطول قليلاً.',
        patient_name: 'أمل',
        city: 'الدمام',
        created_at: '2024-10-28'
    }
];

export default function DoctorReviews({ doctorId, averageRating, totalReviews }: DoctorReviewsProps) {
    const ratingBreakdown = [
        { stars: 5, percentage: 85 },
        { stars: 4, percentage: 10 },
        { stars: 3, percentage: 3 },
        { stars: 2, percentage: 1 },
        { stars: 1, percentage: 1 },
    ];

    return (
        <section className="bg-white rounded-2xl border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">آراء المريضات</h2>

            {/* Rating Summary */}
            <div className="flex flex-col md:flex-row gap-8 mb-8 pb-8 border-b border-gray-100">
                <div className="text-center md:text-right">
                    <div className="text-5xl font-bold text-gray-900 mb-2">
                        {averageRating.toFixed(1)}
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`w-5 h-5 ${star <= averageRating
                                        ? 'text-yellow-400 fill-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                            />
                        ))}
                    </div>
                    <p className="text-sm text-gray-500">{totalReviews} تقييم</p>
                </div>

                <div className="flex-1">
                    {ratingBreakdown.map((item) => (
                        <div key={item.stars} className="flex items-center gap-3 mb-2">
                            <span className="text-sm text-gray-600 w-12">{item.stars} نجوم</span>
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-yellow-400"
                                    style={{ width: `${item.percentage}%` }}
                                />
                            </div>
                            <span className="text-sm text-gray-500 w-12">{item.percentage}%</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
                {mockReviews.map((review) => (
                    <div key={review.id} className="pb-6 border-b border-gray-50 last:border-0">
                        <div className="flex items-center gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-4 h-4 ${star <= review.rating
                                            ? 'text-yellow-400 fill-yellow-400'
                                            : 'text-gray-300'
                                        }`}
                                />
                            ))}
                        </div>
                        <p className="text-gray-700 mb-3 leading-relaxed">{review.review_text_ar}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="font-medium">{review.patient_name}</span>
                            <span>•</span>
                            <span>{review.city}</span>
                            <span>•</span>
                            <span>منذ شهر</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
