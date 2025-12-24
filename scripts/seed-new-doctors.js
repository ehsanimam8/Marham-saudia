const { createClient } = require('@supabase/supabase-js');

const supabase = createClient('https://znmnqvmcwjjtocbosgnr.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpubW5xdm1jd2pqdG9jYm9zZ25yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDg0NTc2MywiZXhwIjoyMDgwNDIxNzYzfQ.SSJNR6LF4DfEySQSE9AqKenYKW4TkYSwgCzZSLFnduM');

const doctors = [
    {
        email: 'dr.laila@marham.sa',
        password: 'password123',
        fullNameAr: 'د. ليلى الفارس',
        fullNameEn: 'Dr. Laila Al-Farsi',
        city: 'Riyadh',
        specialty: 'Dermatologist',
        hospital: 'Saudi German Hospital',
        license: 'SC-99881',
        price: 250,
        experience: 12,
        bioAr: 'أخصائية جلدية وتجميل، خبيرة في علاج مشاكل البشرة وحب الشباب.',
        bioEn: 'Specialist in dermatology and aesthetics, expert in skin issues and acne treatments.',
        photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300'
    },
    {
        email: 'dr.sara@marham.sa',
        password: 'password123',
        fullNameAr: 'د. سارة السعود',
        fullNameEn: 'Dr. Sara Al-Saud',
        city: 'Jeddah',
        specialty: 'Dermatologist',
        hospital: 'King Faisal Specialist Hospital',
        license: 'SC-99882',
        price: 300,
        experience: 15,
        bioAr: 'استشارية أمراض جلدية، متخصصة في الليزر والعناية بالبشرة.',
        bioEn: 'Consultant Dermatologist, specialized in laser and skin care.',
        photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300'
    },
    {
        email: 'dr.nora@marham.sa',
        password: 'password123',
        fullNameAr: 'د. نورة الزهراني',
        fullNameEn: 'Dr. Nora Al-Zahrani',
        city: 'Dammam',
        specialty: 'Psychologist',
        hospital: 'Al Mana Hospital',
        license: 'SC-99883',
        price: 200,
        experience: 8,
        bioAr: 'أخصائية نفسية متخصصة في العلاج السلوكي والاستشارات الأسرية.',
        bioEn: 'Specialist psychologist focusing on behavioral therapy and family counseling.',
        photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300&h=300'
    },
    {
        email: 'dr.reem@marham.sa',
        password: 'password123',
        fullNameAr: 'د. ريم القحطاني',
        fullNameEn: 'Dr. Reem Al-Qahtani',
        city: 'Riyadh',
        specialty: 'Psychologist',
        hospital: 'Habib Medical Group',
        license: 'SC-99884',
        price: 220,
        experience: 10,
        bioAr: 'خبيرة في الصحة النفسية للمرأة وعلاج القلق والتوتر.',
        bioEn: 'Expert in women\'s mental health, treating anxiety and stress.',
        photo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=300&h=300'
    },
    {
        email: 'dr.maha@marham.sa',
        password: 'password123',
        fullNameAr: 'د. مها العتيبي',
        fullNameEn: 'Dr. Maha Al-Otaibi',
        city: 'Riyadh',
        specialty: 'Psychiatrist',
        hospital: 'King Saud University Medical City',
        license: 'SC-99885',
        price: 350,
        experience: 20,
        bioAr: 'استشارية طب نفسي، متخصصة في الاضطرابات النفسية المعقدة.',
        bioEn: 'Consultant Psychiatrist, specialized in complex psychiatric disorders.',
        photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b1a8?auto=format&fit=crop&q=80&w=300&h=300'
    }
];

async function seed() {
    for (const doc of doctors) {
        console.log(`Creating doctor: ${doc.fullNameEn}`);

        // 1. Create doctor account
        const { data: userId, error: rpcError } = await supabase.rpc('create_doctor_account', {
            p_email: doc.email,
            p_password: doc.password,
            p_full_name_ar: doc.fullNameAr,
            p_full_name_en: doc.fullNameEn,
            p_city: doc.city,
            p_specialty: doc.specialty,
            p_hospital: doc.hospital,
            p_scfhs_license: doc.license,
            p_consultation_price: doc.price,
            p_experience_years: doc.experience,
            p_bio_ar: doc.bioAr,
            p_bio_en: doc.bioEn
        });

        if (rpcError) {
            console.error(`Error creating ${doc.fullNameEn}:`, rpcError);
            continue;
        }

        console.log(`User created with ID: ${userId}`);

        // 2. Find the doctor record to update photo and add schedule
        const { data: doctor, error: docError } = await supabase
            .from('doctors')
            .select('id')
            .eq('profile_id', userId)
            .single();

        if (docError) {
            console.error(`Error finding doctor record for ${userId}:`, docError);
            continue;
        }

        const doctorId = doctor.id;

        // Update photo
        await supabase
            .from('doctors')
            .update({ profile_photo_url: doc.photo })
            .eq('id', doctorId);

        // 3. Add Schedule (Sun-Thu, 09:00 - 16:00)
        const schedules = [];
        for (let day = 0; day <= 4; day++) {
            schedules.push({
                doctor_id: doctorId,
                day_of_week: day,
                start_time: '09:00:00',
                end_time: '16:00:00',
                is_available: true
            });
        }

        const { error: schedError } = await supabase
            .from('doctor_schedules')
            .insert(schedules);

        if (schedError) {
            console.error(`Error adding schedule for ${doc.fullNameEn}:`, schedError);
        } else {
            console.log(`Successfully seeded ${doc.fullNameEn}`);
        }
    }
}

seed();
