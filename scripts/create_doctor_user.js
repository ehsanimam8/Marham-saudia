
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Env Vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    const email = 'doctor@marham.sa';
    const password = 'password123';
    const fullName = 'Dr. Test User';

    console.log(`🔵 Attempting to create/login doctor: ${email}`);

    // 1. Try Login first
    let { data: { user }, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (loginError) {
        console.log('⚠️ Login failed (expected if new):', loginError.message);

        // 2. Try Signup
        console.log('🔵 Trying Signup...');
        const { data: signupData, error: signupError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    full_name_ar: 'د. مستخدم تجريب',
                    role: 'doctor' // Hint to trigger
                }
            }
        });

        if (signupError) {
            console.error('❌ Signup failed:', signupError.message);
            return;
        }

        user = signupData.user;
        console.log('✅ Signup successful. User ID:', user?.id);
    } else {
        console.log('✅ Login successful. User ID:', user.id);
    }

    if (!user) {
        console.error('❌ No user object found.');
        return;
    }

    // 3. Ensure Profile Exists & Upgrade
    console.log('🔍 Checking profile...');

    // We can't update profile via ANON key due to RLS usually, 
    // UNLESS the user is logged in as themselves (which they are!).
    // So we need a client authenticated as THIS user.

    // However, the `supabase` client above is ANON. 
    // We verify session.

    // Actually, sign in/sign up returns a session!
    // We should use that token.

    // Wait, createClient maintains state if not configured otherwise? 
    // No, strictly needs token.

    // Re-auth as user
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        // If we just signed up, we might not have session if email confirm is on.
        console.log('⚠️ No session. Email confirmation might be required.');
        return;
    }

    console.log('✅ Have Session. Updating Profile...');

    const { error: updateError } = await supabase
        .from('profiles')
        .update({
            role: 'doctor',
            full_name_en: 'Dr. Test User Upgrade',
            full_name_ar: 'د. مستخدم تجريب'
        })
        .eq('id', user.id);

    if (updateError) {
        console.error('❌ Profile update error:', updateError);
    } else {
        console.log('✅ Profile updated to doctor.');
    }

    // 4. Create Doctor Record
    // Try insert
    const { error: doctorError } = await supabase
        .from('doctors')
        .insert({
            id: user.id,
            specialty: 'General Medicine',
            hospital: 'Demo Hospital',
            consultation_price: 200,
            bio_en: 'Demo doctor account',
            bio_ar: 'حساب طبيب تجريبي',
            rating: 5.0
        });

    if (doctorError) {
        if (doctorError.code === '23505') { // Unique violation
            console.log('✅ Doctor record already exists.');
        } else {
            console.error('❌ Doctor record creation error:', doctorError);
        }
    } else {
        console.log('✅ Doctor record created.');
    }

    console.log('🎉 DONE. You can login as doctor@marham.sa / password123');
}

main();
