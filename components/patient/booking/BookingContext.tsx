'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface BookingState {
    doctorId: string;
    selectedDate: Date | null;
    selectedTime: string | null;
    consultationType: 'new' | 'followup';
    reasonAr: string;
    reasonEn: string;
    patientInfo: {
        insuranceCompany?: string;
        insuranceNumber?: string;
    };
    paymentMethod: string;
    appointmentId?: string;
}

interface BookingContextType {
    bookingState: BookingState;
    updateBookingState: (updates: Partial<BookingState>) => void;
    currentStep: number;
    setCurrentStep: (step: number) => void;
    resetBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children, doctorId }: { children: ReactNode; doctorId: string }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [bookingState, setBookingState] = useState<BookingState>({
        doctorId,
        selectedDate: null,
        selectedTime: null,
        consultationType: 'new',
        reasonAr: '',
        reasonEn: '',
        patientInfo: {},
        paymentMethod: '',
    });

    const updateBookingState = (updates: Partial<BookingState>) => {
        setBookingState(prev => ({ ...prev, ...updates }));
    };

    const resetBooking = () => {
        setBookingState({
            doctorId,
            selectedDate: null,
            selectedTime: null,
            consultationType: 'new',
            reasonAr: '',
            reasonEn: '',
            patientInfo: {},
            paymentMethod: '',
        });
        setCurrentStep(1);
    };

    return (
        <BookingContext.Provider value={{ bookingState, updateBookingState, currentStep, setCurrentStep, resetBooking }}>
            {children}
        </BookingContext.Provider>
    );
}

export function useBooking() {
    const context = useContext(BookingContext);
    if (!context) {
        throw new Error('useBooking must be used within BookingProvider');
    }
    return context;
}
