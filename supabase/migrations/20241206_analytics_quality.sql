-- Create Reviews Table (Patient feedback)
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE NOT NULL,
    doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    feedback TEXT,
    -- Specific metrics for Women's Health/Privacy context
    privacy_rating INTEGER CHECK (privacy_rating >= 1 AND privacy_rating <= 5), -- Comfort level
    empathy_rating INTEGER CHECK (empathy_rating >= 1 AND empathy_rating <= 5), -- Did the doctor listen?
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Consultation Outcomes Table (Doctor's efficiency report)
CREATE TABLE IF NOT EXISTS consultation_outcomes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE NOT NULL,
    doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
    diagnosis_category TEXT, -- e.g., 'Dermatology', 'Psychology' (for trends)
    outcome_status TEXT CHECK (outcome_status IN ('resolved', 'follow_up_needed', 'referred_to_hospital', 'prescription_only')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_outcomes ENABLE ROW LEVEL SECURITY;

-- Patients can create reviews for their own appointments
CREATE POLICY "Patients can create reviews" ON reviews
    FOR INSERT WITH CHECK (
        auth.uid() IN (SELECT profile_id FROM patients WHERE id = reviews.patient_id)
    );

-- Everyone can read reviews (for the doctor profile page)
CREATE POLICY "Public can read reviews" ON reviews FOR SELECT USING (true);

-- Doctors can create outcomes
CREATE POLICY "Doctors can log outcomes" ON consultation_outcomes
    FOR INSERT WITH CHECK (
        auth.uid() IN (SELECT profile_id FROM doctors WHERE id = consultation_outcomes.doctor_id)
    );

-- Admin can read all (using service role usually, but let's be explicit if needed)
-- (Supabase Service Key bypasses RLS, so admin dashboard is safe)
