'use client';

import { FC } from 'react';
import { OnboardingSession, DoctorMatch } from '@/lib/onboarding/v5/types';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Calendar, Clock } from 'lucide-react';

interface ResultsClientProps {
    session: OnboardingSession;
    matchedDoctors: DoctorMatch[];
    articles: any[];
}

const ResultsClient: FC<ResultsClientProps> = ({ session, matchedDoctors }) => {
    return (
        <div className="max-w-4xl mx-auto p-4 pb-20">
            <header className="text-center py-8">
                <h1 className="text-3xl font-bold text-teal-900 mb-2">✅ Your Personalized Health Plan</h1>
                <p className="text-gray-600">Based on your symptoms, we found the best specialists for you.</p>
            </header>

            {/* Doctor Matches */}
            <section>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    Recommended Specialists ({matchedDoctors.length})
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                    {matchedDoctors.map(({ doctor, matchScore, matchReasons }) => (
                        <div key={doctor.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-6">
                                <div className="flex gap-4 mb-4">
                                    <div className="w-16 h-16 bg-slate-200 rounded-full flex-shrink-0 bg-cover bg-center" style={{ backgroundImage: `url(${doctor.profile_photo_url})` }} />
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900">{doctor.full_name_en}</h3>
                                        <p className="text-sm text-teal-600 font-medium">{doctor.specialty}</p>
                                        <p className="text-xs text-gray-500">{doctor.hospital}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1 mb-4">
                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    <span className="font-bold text-sm">{doctor.rating}</span>
                                    <span className="text-xs text-gray-400">({doctor.total_reviews} reviews)</span>
                                    <span className="mx-2 text-gray-300">|</span>
                                    <span className="text-xs text-green-600 font-medium">{matchScore}% Match</span>
                                </div>

                                {matchReasons.length > 0 && (
                                    <div className="mb-4 flex flex-wrap gap-2">
                                        {matchReasons.map(reason => (
                                            <span key={reason} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-md border border-green-100">
                                                {reason}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="flex justify-between items-center text-sm text-gray-600 border-t pt-4">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>Next: {doctor.next_available}</span>
                                    </div>
                                    <div className="font-bold text-slate-900">
                                        {/* Price display logic */}
                                        SAR {doctor.consultation_price}
                                    </div>
                                </div>
                            </div>
                            <div className="bg-slate-50 p-4 border-t border-slate-100 flex gap-3">
                                <Button variant="outline" className="flex-1 border-teal-200 text-teal-700 hover:bg-teal-50">View Profile</Button>
                                <Button className="flex-1 bg-teal-600 hover:bg-teal-700">Book Now</Button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {matchedDoctors.length === 0 && (
                <div className="text-center p-12 bg-white rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500">No specific matches found based on current criteria. Try adjusting your filters.</p>
                </div>
            )}
        </div>
    );
};

export default ResultsClient;
