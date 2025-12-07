# Marham Saudi - Production Details

## 🌐 URLs
- **Main Website:** https://marham-saudi-hdod333kt-ehsan-imams-projects.vercel.app
- **Admin Portal:** https://marham-saudi-hdod333kt-ehsan-imams-projects.vercel.app/admin/dashboard
- **Doctor Portal:** https://marham-saudi-hdod333kt-ehsan-imams-projects.vercel.app/doctor/dashboard

## 🔑 Access Credentials

### Admin Account
- **Username:** admin@marham.sa
- **Password:** password123

### Doctor Account (Demo)
- **Username:** noura@test.com
- **Password:** password123

## ✨ Features Summary
- **Patient Portal**: Search doctors by city/specialty, view detailed profiles, book appointments (video/clinic), and access health articles.
- **Doctor Portal**: Manage schedule (weekly/slots), view patient list, track earnings, and initiate video consultations.
- **Admin Portal**: Approve/Reject doctor applications, manually onboard new doctors, and manage content.
- **Video Consultation**: Integrated Jitsi Meet for secure telehealth sessions.
- **Content System**: Bilingual health library with 20+ articles.
- **Localization**: Full English/Arabic (RTL) support.

## ⚠️ Database Setup (Required)
For the above credentials to work, you must run the following SQL scripts in your Supabase **Production** SQL Editor:

1. `supabase/migrations/20241206_create_doctor_function.sql` (Required for Add Doctor)
2. `supabase/migrations/20241206_seed_admin.sql` (Creates Admin account)
3. `supabase/migrations/20241206_seed_10_doctors.sql` (Creates Doctor accounts)
4. `supabase/migrations/seed_articles.sql` (Populates Health Library)
