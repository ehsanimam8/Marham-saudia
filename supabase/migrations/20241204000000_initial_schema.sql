-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Enums
-- Create Enums safely
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('patient', 'doctor', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE doctor_status AS ENUM ('pending', 'approved', 'rejected', 'suspended');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE appointment_status AS ENUM ('scheduled', 'completed', 'cancelled', 'no_show');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE consultation_type AS ENUM ('new', 'followup');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE article_status AS ENUM ('draft', 'published');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payout_status AS ENUM ('pending', 'paid');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    role user_role NOT NULL DEFAULT 'patient',
    full_name_ar TEXT,
    full_name_en TEXT,
    phone TEXT,
    city TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Doctors Table
CREATE TABLE IF NOT EXISTS doctors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    scfhs_license TEXT UNIQUE,
    specialty TEXT,
    sub_specialties TEXT[],
    hospital TEXT,
    qualifications JSONB,
    experience_years INTEGER,
    bio_ar TEXT,
    bio_en TEXT,
    profile_photo_url TEXT,
    consultation_price DECIMAL(10, 2),
    rating DECIMAL(3, 2) DEFAULT 0,
    total_consultations INTEGER DEFAULT 0,
    status doctor_status DEFAULT 'pending',
    bank_iban TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Doctor Schedules Table
CREATE TABLE IF NOT EXISTS doctor_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Patients Table
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    date_of_birth DATE,
    insurance_company TEXT,
    insurance_number TEXT,
    emergency_contact TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status appointment_status DEFAULT 'scheduled',
    consultation_type consultation_type DEFAULT 'new',
    reason_ar TEXT,
    reason_en TEXT,
    price DECIMAL(10, 2) NOT NULL,
    payment_status payment_status DEFAULT 'pending',
    payment_id TEXT,
    video_room_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Consultations Table
CREATE TABLE IF NOT EXISTS consultations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE NOT NULL,
    diagnosis TEXT,
    prescription JSONB,
    notes TEXT,
    recommendations TEXT[],
    next_followup_date DATE,
    duration_minutes INTEGER,
    recording_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE NOT NULL,
    doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    review_text_ar TEXT,
    review_text_en TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Articles Table
CREATE TABLE IF NOT EXISTS articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title_ar TEXT NOT NULL,
    title_en TEXT NOT NULL,
    content_ar TEXT,
    content_en TEXT,
    excerpt_ar TEXT,
    excerpt_en TEXT,
    featured_image_url TEXT,
    category TEXT,
    keywords TEXT[],
    reviewed_by_doctor_id UUID REFERENCES doctors(id) ON DELETE SET NULL,
    read_time_minutes INTEGER,
    views INTEGER DEFAULT 0,
    status article_status DEFAULT 'draft',
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Earnings Table
CREATE TABLE IF NOT EXISTS earnings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    platform_fee DECIMAL(10, 2) NOT NULL,
    doctor_earnings DECIMAL(10, 2) NOT NULL,
    payout_status payout_status DEFAULT 'pending',
    payout_date DATE,
    payout_reference TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE earnings ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles
DO $$ BEGIN
    CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Doctors
DO $$ BEGIN
    CREATE POLICY "Approved doctors are viewable by everyone" ON doctors FOR SELECT USING (status = 'approved');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Doctors can view own profile" ON doctors FOR SELECT USING (auth.uid() = profile_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Doctors can update own profile" ON doctors FOR UPDATE USING (auth.uid() = profile_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Doctors can insert own profile" ON doctors FOR INSERT WITH CHECK (auth.uid() = profile_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Doctor Schedules
DO $$ BEGIN
    CREATE POLICY "Schedules viewable by everyone" ON doctor_schedules FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Doctors can manage own schedule" ON doctor_schedules FOR ALL USING (
        EXISTS (SELECT 1 FROM doctors WHERE id = doctor_schedules.doctor_id AND profile_id = auth.uid())
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Patients
DO $$ BEGIN
    CREATE POLICY "Patients view own profile" ON patients FOR SELECT USING (auth.uid() = profile_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Patients update own profile" ON patients FOR UPDATE USING (auth.uid() = profile_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Patients insert own profile" ON patients FOR INSERT WITH CHECK (auth.uid() = profile_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Doctors view patients they have appointments with" ON patients FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM appointments 
            WHERE appointments.patient_id = patients.id 
            AND appointments.doctor_id IN (SELECT id FROM doctors WHERE profile_id = auth.uid())
        )
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Appointments
DO $$ BEGIN
    CREATE POLICY "Patients view own appointments" ON appointments FOR SELECT USING (
        EXISTS (SELECT 1 FROM patients WHERE id = appointments.patient_id AND profile_id = auth.uid())
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Doctors view own appointments" ON appointments FOR SELECT USING (
        EXISTS (SELECT 1 FROM doctors WHERE id = appointments.doctor_id AND profile_id = auth.uid())
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Patients can insert appointments" ON appointments FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM patients WHERE id = appointments.patient_id AND profile_id = auth.uid())
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Both can update appointment status" ON appointments FOR UPDATE USING (
        (EXISTS (SELECT 1 FROM patients WHERE id = appointments.patient_id AND profile_id = auth.uid())) OR
        (EXISTS (SELECT 1 FROM doctors WHERE id = appointments.doctor_id AND profile_id = auth.uid()))
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Consultations
DO $$ BEGIN
    CREATE POLICY "Patients view own consultations" ON consultations FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM appointments 
            JOIN patients ON appointments.patient_id = patients.id 
            WHERE appointments.id = consultations.appointment_id AND patients.profile_id = auth.uid()
        )
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Doctors view/manage own consultations" ON consultations FOR ALL USING (
        EXISTS (
            SELECT 1 FROM appointments 
            JOIN doctors ON appointments.doctor_id = doctors.id 
            WHERE appointments.id = consultations.appointment_id AND doctors.profile_id = auth.uid()
        )
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Reviews
DO $$ BEGIN
    CREATE POLICY "Reviews viewable by everyone" ON reviews FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Patients can insert reviews" ON reviews FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM patients WHERE id = reviews.patient_id AND profile_id = auth.uid())
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Articles
DO $$ BEGIN
    CREATE POLICY "Articles viewable by everyone" ON articles FOR SELECT USING (status = 'published');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Admins/Doctors can manage articles" ON articles FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'doctor'))
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Earnings
DO $$ BEGIN
    CREATE POLICY "Doctors view own earnings" ON earnings FOR SELECT USING (
        EXISTS (SELECT 1 FROM doctors WHERE id = earnings.doctor_id AND profile_id = auth.uid())
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Functions and Triggers

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name_ar, role)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name_ar', new.raw_user_meta_data->>'full_name', new.email),
    COALESCE((new.raw_user_meta_data->>'role')::user_role, 'patient'::user_role)
  );
  
  -- Also create patient record if role is patient
  IF COALESCE((new.raw_user_meta_data->>'role')::user_role, 'patient'::user_role) = 'patient' THEN
    INSERT INTO public.patients (id, profile_id)
    VALUES (uuid_generate_v4(), new.id);
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to all tables
-- Apply updated_at trigger to all tables
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_doctors_updated_at ON doctors;
CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON doctors FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_doctor_schedules_updated_at ON doctor_schedules;
CREATE TRIGGER update_doctor_schedules_updated_at BEFORE UPDATE ON doctor_schedules FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_patients_updated_at ON patients;
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_appointments_updated_at ON appointments;
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_consultations_updated_at ON consultations;
CREATE TRIGGER update_consultations_updated_at BEFORE UPDATE ON consultations FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_articles_updated_at ON articles;
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_earnings_updated_at ON earnings;
CREATE TRIGGER update_earnings_updated_at BEFORE UPDATE ON earnings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
