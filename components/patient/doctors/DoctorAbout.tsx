import type { Doctor } from '@/lib/api/doctors';

interface DoctorAboutProps {
    doctor: Doctor;
}

export default function DoctorAbout({ doctor }: DoctorAboutProps) {
    return (
        <section className="bg-white rounded-2xl border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">نبذة عن الطبيبة</h2>

            <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                    {doctor.bio_ar}
                </p>

                {doctor.sub_specialties && doctor.sub_specialties.length > 0 && (
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">الاهتمامات الخاصة:</h3>
                        <ul className="space-y-2">
                            {doctor.sub_specialties.map((interest, idx) => (
                                <li key={idx} className="flex items-center gap-2 text-gray-700">
                                    <span className="w-1.5 h-1.5 bg-teal-600 rounded-full"></span>
                                    {interest}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </section>
    );
}
