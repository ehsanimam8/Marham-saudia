import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { Doctor } from '@/lib/api/doctors';

interface DoctorPricingProps {
    doctor: Doctor;
}

export default function DoctorPricing({ doctor }: DoctorPricingProps) {
    return (
        <section className="bg-white rounded-2xl border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">الأسعار</h2>

            <div className="space-y-4">
                {/* Standard Consultation */}
                <div className="flex items-center justify-between p-4 bg-teal-50 rounded-xl">
                    <div>
                        <h3 className="font-bold text-gray-900 mb-1">استشارة عادية</h3>
                        <p className="text-sm text-gray-600">30 دقيقة</p>
                    </div>
                    <div className="text-left">
                        <div className="text-2xl font-bold text-teal-600">
                            {doctor.consultation_price} ريال
                        </div>
                    </div>
                </div>

                {/* Follow-up */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                        <h3 className="font-bold text-gray-900 mb-1">استشارة متابعة</h3>
                        <p className="text-sm text-gray-600">15 دقيقة</p>
                    </div>
                    <div className="text-left">
                        <div className="text-2xl font-bold text-gray-900">
                            {Math.round(doctor.consultation_price * 0.75)} ريال
                        </div>
                    </div>
                </div>

                {/* What's Included */}
                <div className="pt-4 border-t border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-3">ما يشمله السعر:</h3>
                    <ul className="space-y-2">
                        {[
                            'استشارة فيديو خاصة',
                            'تقرير طبي مفصل',
                            'وصفة طبية إلكترونية',
                            'متابعة عبر الرسائل لمدة 48 ساعة',
                        ].map((item, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-gray-700">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* CTA */}
                <div className="pt-6">
                    <Link href={`/book/${doctor.id}`}>
                        <Button className="w-full bg-teal-600 hover:bg-teal-700" size="lg">
                            احجزي الآن - {doctor.consultation_price} ريال
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
