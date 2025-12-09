
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Admin client to bypass RLS and Create Users
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

interface DoctorSeed {
    id: string;
    email: string;
    fullNameEn: string;
    fullNameAr: string;
    city: string;
    specialty: string;
    subSpecialties: string[];
    hospital: string;
    experienceYears: number;
    price: number;
    rating: number;
    consultations: number;
    image: string;
    bioAr: string;
    bioEn: string;
    license: string;
}

const doctors: DoctorSeed[] = [
    {
        id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01',
        email: 'noura@test.com',
        fullNameEn: 'Dr. Noura Al-Rashid',
        fullNameAr: 'د. نورا الراشد',
        city: 'Riyadh',
        specialty: 'OB/GYN',
        subSpecialties: ['PCOS', 'Fertility'],
        hospital: 'King Faisal Specialist Hospital',
        experienceYears: 15,
        price: 200,
        rating: 4.9,
        consultations: 120,
        image: '/images/doctors/doctor_noura_alrashid_1764849899936.png',
        bioAr: 'استشارية أمراض النساء والولادة، متخصصة في علاج تكيس المبايض.',
        bioEn: 'Consultant OB/GYN specializing in PCOS and fertility.',
        license: '10101010'
    },
    {
        id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02',
        email: 'sara@test.com',
        fullNameEn: 'Dr. Sara Al-Ahmed',
        fullNameAr: 'د. سارة الأحمد',
        city: 'Jeddah',
        specialty: 'Fertility',
        subSpecialties: ['IVF'],
        hospital: 'Dallah Hospital',
        experienceYears: 12,
        price: 250,
        rating: 4.8,
        consultations: 95,
        image: '/images/doctors/doctor_sara_alahmed_1764849915248.png',
        bioAr: 'استشارية خصوبة وأطفال أنابيب.',
        bioEn: 'Fertility and IVF Consultant.',
        license: '20202020'
    },
    {
        id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03',
        email: 'laila@test.com',
        fullNameEn: 'Dr. Laila Al-Omari',
        fullNameAr: 'د. ليلى العمري',
        city: 'Dammam',
        specialty: 'Maternal-Fetal Medicine',
        subSpecialties: ['High-risk Pregnancy'],
        hospital: 'King Fahad Specialist Hospital',
        experienceYears: 18,
        price: 300,
        rating: 5.0,
        consultations: 210,
        image: '/images/doctors/doctor_laila_alomari_1764849928738.png',
        bioAr: 'خبرة طويلة في طب الأمومة والأجنة وحالات الحمل الحرجة.',
        bioEn: 'Extensive experience in maternal-fetal medicine.',
        license: '30303030'
    },
    {
        id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04',
        email: 'amal@test.com',
        fullNameEn: 'Dr. Amal Al-Harbi',
        fullNameAr: 'د. أمل الحربي',
        city: 'Riyadh',
        specialty: 'Mental Health',
        subSpecialties: ['Anxiety', 'Postpartum Depression'],
        hospital: 'IMC',
        experienceYears: 9,
        price: 180,
        rating: 4.7,
        consultations: 88,
        image: '/images/doctors/doctor_amal_alharbi_1764849951730.png',
        bioAr: 'طبيبة نفسية متخصصة في صحة المرأة.',
        bioEn: 'Psychiatrist specializing in women\'s mental health.',
        license: '40404040'
    },
    {
        id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05',
        email: 'haifa@test.com',
        fullNameEn: 'Dr. Haifa Al-Sulaiman',
        fullNameAr: 'د. هيفاء السليمان',
        city: 'Mecca',
        specialty: 'Endocrinology',
        subSpecialties: ['Diabetes', 'Thyroid'],
        hospital: 'Al Noor Hospital',
        experienceYears: 22,
        price: 220,
        rating: 4.9,
        consultations: 300,
        image: '/images/doctors/doctor_haifa_alsulaiman_1764849970279.png',
        bioAr: 'استشارية غدد صماء وسكري.',
        bioEn: 'Consultant Endocrinologist.',
        license: '50505050'
    },
    {
        id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a06',
        email: 'fatima@test.com',
        fullNameEn: 'Dr. Fatima Al-Zahrani',
        fullNameAr: 'د. فاطمة الزهراني',
        city: 'Abha',
        specialty: 'Dermatology',
        subSpecialties: ['Cosmetic', 'Acne'],
        hospital: 'Private Clinic',
        experienceYears: 7,
        price: 150,
        rating: 4.6,
        consultations: 65,
        image: '/images/doctors/doctor_1_fatima_1765000589927.png',
        bioAr: 'أخصائية جلدية وتجميل.',
        bioEn: 'Dermatology and Cosmetic Specialist.',
        license: '60606060'
    },
    {
        id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a07',
        email: 'huda@test.com',
        fullNameEn: 'Dr. Huda Al-Qahtani',
        fullNameAr: 'د. هدى القحطاني',
        city: 'Tabuk',
        specialty: 'Pediatrics',
        subSpecialties: ['Child Development', 'Vaccination'],
        hospital: 'Children Specialized Hospital',
        experienceYears: 14,
        price: 180,
        rating: 4.8,
        consultations: 150,
        image: '/images/doctors/doctor_7_huda_1765000799435.png',
        bioAr: 'استشارية طب أطفال ونمو.',
        bioEn: 'Consultant Pediatrician specializing in development.',
        license: '70707070'
    },
    {
        id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a08',
        email: 'mona@test.com',
        fullNameEn: 'Dr. Mona Al-Shehri',
        fullNameAr: 'د. منى الشهري',
        city: 'Riyadh',
        specialty: 'Nutrition',
        subSpecialties: ['Weight Management', 'Diabetes Diet'],
        hospital: 'Diet Center',
        experienceYears: 5,
        price: 120,
        rating: 4.5,
        consultations: 90,
        image: '/images/doctors/doctor_8_mona_1765000817845.png',
        bioAr: 'أخصائية تغذية علاجية.',
        bioEn: 'Clinical Nutritionist.',
        license: '80808080'
    },
    {
        id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a09',
        email: 'reem@test.com',
        fullNameEn: 'Dr. Reem Al-Dossari',
        fullNameAr: 'د. ريم الدوسري',
        city: 'Al Khobar',
        specialty: 'Dentistry',
        subSpecialties: ['Cosmetic Dentistry', 'Orthodontics'],
        hospital: 'Smile Clinic',
        experienceYears: 9,
        price: 200,
        rating: 4.9,
        consultations: 210,
        image: '/images/doctors/doctor_9_reem_1765000852328.png',
        bioAr: 'طبيبة أسنان تجميلية وتقويم.',
        bioEn: 'Cosmetic Dentist and Orthodontist.',
        license: '90909090'
    },
    {
        id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a10',
        email: 'salma@test.com',
        fullNameEn: 'Dr. Salma King',
        fullNameAr: 'د. سلمى كينج',
        city: 'Jeddah',
        specialty: 'General Practice',
        subSpecialties: ['Family Medicine', 'Geriatrics'],
        hospital: 'Community Health Center',
        experienceYears: 30,
        price: 250,
        rating: 5.0,
        consultations: 500,
        image: '/images/doctors/doctor_10_salma_1765000872582.png',
        bioAr: 'طبيبة أسرة بخبرة تتجاوز 30 عاماً.',
        bioEn: 'Family Medicine Practitioner with over 30 years of experience.',
        license: '11111111'
    }
];

async function seedDoctors() {
    console.log('🌱 Creating 10 Doctor Accounts...');

    for (const doc of doctors) {
        // 1. Create Auth User (or get ID if exists)
        // We use admin.createUser which bypasses email confirmation if set
        // But for idempotency, we check if user exists by trying to sign in? 
        // Or we just try create and catch error.

        let userId = doc.id;

        // Try creating
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: doc.email,
            password: 'password123',
            email_confirm: true,
            user_metadata: {
                full_name: doc.fullNameEn,
                role: 'doctor'
            }
        });

        if (authError) {
            // If user exists, we can't easily get the ID if we don't know it, BUT we hardcoded IDs in our seed data.
            // If the user already exists with that email, the ID might be different if it wasn't created with OUR hardcoded ID.
            // However, `createUser` doesn't let us specify ID cleanly in the JS client usually unless we use SQL.
            // Actually, JS client `createUser` generates a random ID.
            // We SHOULD check if user exists by email.

            // Workaround: List users to find ID by email
            // This is expensive but fine for 10 users one-off script

            // Note: listUsers is the way.
            console.log(`User ${doc.email} might exist. Checking...`);
        } else {
            console.log(`✅ Auth user created for ${doc.email}`);
            userId = authData.user.id;
            // Note: If we just created it, it has a random ID, NOT the hardcoded one from SQL.
            // That's fine, we update our variable.
        }

        // Let's resolve the actual User ID
        // Warning: listUsers API might not return all if many users, but we assume small numbers for now.
        const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
        const existingUser = users.find(u => u.email === doc.email);

        if (existingUser) {
            userId = existingUser.id;
        } else {
            console.error(`Could not find or create user for ${doc.email}`);
            continue;
        }

        // 2. Upsert Profile
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .upsert({
                id: userId,
                role: 'doctor',
                full_name_ar: doc.fullNameAr,
                full_name_en: doc.fullNameEn,
                city: doc.city
            });

        if (profileError) console.error(`Profile Error for ${doc.email}:`, profileError.message);

        // 3. Upsert Doctor Record
        // We need to find if doctor record exists for this profile
        const { data: existingDoc } = await supabaseAdmin
            .from('doctors')
            .select('id')
            .eq('profile_id', userId)
            .single();

        const doctorData = {
            profile_id: userId,
            scfhs_license: doc.license,
            specialty: doc.specialty,
            sub_specialties: doc.subSpecialties,
            hospital: doc.hospital,
            experience_years: doc.experienceYears,
            consultation_price: doc.price,
            rating: doc.rating,
            total_consultations: doc.consultations,
            status: 'approved',
            profile_photo_url: doc.image,
            bio_ar: doc.bioAr,
            bio_en: doc.bioEn
        };

        if (existingDoc) {
            await supabaseAdmin.from('doctors').update(doctorData).eq('id', existingDoc.id);
            console.log(`✅ Updated doctor record for ${doc.fullNameEn}`);
        } else {
            await supabaseAdmin.from('doctors').insert(doctorData);
            console.log(`✅ Created doctor record for ${doc.fullNameEn}`);
        }

        // 4. Create Schedule (Default 5 PM - 9 PM)
        // Get doctor ID again
        const { data: finalDoc } = await supabaseAdmin.from('doctors').select('id').eq('profile_id', userId).single();
        if (finalDoc) {
            // Check if schedule exists
            const { count } = await supabaseAdmin.from('doctor_schedules').select('*', { count: 'exact', head: true }).eq('doctor_id', finalDoc.id);
            if (!count || count === 0) {
                await supabaseAdmin.from('doctor_schedules').insert([
                    { doctor_id: finalDoc.id, day_of_week: 0, start_time: '17:00', end_time: '21:00' },
                    { doctor_id: finalDoc.id, day_of_week: 1, start_time: '17:00', end_time: '21:00' },
                    { doctor_id: finalDoc.id, day_of_week: 2, start_time: '17:00', end_time: '21:00' },
                    { doctor_id: finalDoc.id, day_of_week: 3, start_time: '17:00', end_time: '21:00' },
                    { doctor_id: finalDoc.id, day_of_week: 4, start_time: '14:00', end_time: '18:00' },
                ]);
                console.log(`✅ Created schedule for ${doc.fullNameEn}`);
            }
        }
    }
    console.log('✨ Seeding Complete!');
}

seedDoctors();
