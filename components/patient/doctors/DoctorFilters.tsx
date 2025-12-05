'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const specialties = [
    { value: 'OB/GYN', label: 'أمراض النساء والتوليد' },
    { value: 'Maternal-Fetal Medicine', label: 'طب الأمومة والجنين' },
    { value: 'Endocrinology', label: 'الغدد الصماء' },
    { value: 'Fertility', label: 'الخصوبة' },
    { value: 'Mental Health', label: 'الصحة النفسية' },
];

const cities = [
    { value: 'Riyadh', label: 'الرياض' },
    { value: 'Jeddah', label: 'جدة' },
    { value: 'Dammam', label: 'الدمام' },
    { value: 'Mecca', label: 'مكة' },
    { value: 'Medina', label: 'المدينة' },
];

const hospitals = [
    'King Faisal Specialist Hospital',
    'Saudi German Hospital',
    'Dr. Sulaiman Al Habib',
    'Dallah Hospital',
];

interface DoctorFiltersProps {
    onClose?: () => void;
}

export default function DoctorFilters({ onClose }: DoctorFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [selectedSpecialty, setSelectedSpecialty] = useState(searchParams.get('specialty') || '');
    const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '');
    const [selectedHospital, setSelectedHospital] = useState(searchParams.get('hospital') || '');
    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

    const updateFilters = () => {
        const params = new URLSearchParams();

        if (selectedSpecialty) params.set('specialty', selectedSpecialty);
        if (selectedCity) params.set('city', selectedCity);
        if (selectedHospital) params.set('hospital', selectedHospital);
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);

        router.push(`/doctors?${params.toString()}`);
        onClose?.();
    };

    const clearFilters = () => {
        setSelectedSpecialty('');
        setSelectedCity('');
        setSelectedHospital('');
        setMinPrice('');
        setMaxPrice('');
        router.push('/doctors');
        onClose?.();
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg">الفلاتر</h3>
                {onClose && (
                    <button onClick={onClose} className="md:hidden">
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            <div className="space-y-6">
                {/* Specialty */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        التخصص
                    </label>
                    <select
                        value={selectedSpecialty}
                        onChange={(e) => setSelectedSpecialty(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                        <option value="">الكل</option>
                        {specialties.map((spec) => (
                            <option key={spec.value} value={spec.value}>
                                {spec.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* City */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        المدينة
                    </label>
                    <select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                        <option value="">الكل</option>
                        {cities.map((city) => (
                            <option key={city.value} value={city.value}>
                                {city.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Hospital */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        المستشفى
                    </label>
                    <select
                        value={selectedHospital}
                        onChange={(e) => setSelectedHospital(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                        <option value="">الكل</option>
                        {hospitals.map((hospital) => (
                            <option key={hospital} value={hospital}>
                                {hospital}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Price Range */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        نطاق السعر (ريال)
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="من"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="w-1/2 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                        <input
                            type="number"
                            placeholder="إلى"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="w-1/2 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t">
                    <Button
                        onClick={updateFilters}
                        className="flex-1 bg-teal-600 hover:bg-teal-700"
                    >
                        تطبيق
                    </Button>
                    <Button
                        onClick={clearFilters}
                        variant="outline"
                        className="flex-1"
                    >
                        مسح الكل
                    </Button>
                </div>
            </div>
        </div>
    );
}
