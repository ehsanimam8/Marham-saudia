# MARHAM SAUDI MVP - PORTAL SPECIFICATION
## Patient Portal + Doctor Portal + Content System

**Version:** 1.0  
**Date:** December 4, 2024  
**Purpose:** Build validation MVP for Saudi women's health platform

---

## TABLE OF CONTENTS

1. [Overview & Strategy](#overview-strategy)
2. [Patient Portal (Frontend)](#patient-portal)
3. [Doctor Portal (Backend)](#doctor-portal)
4. [Content System (SEO Articles)](#content-system)
5. [Tech Stack Recommendation](#tech-stack)
6. [AI Prompts for Building](#ai-prompts)
7. [Implementation Phases](#implementation-phases)

---

## OVERVIEW & STRATEGY

### **What We're Building:**

**TWO portals + ONE content system:**

1. **Patient Portal** (marham.sa)
   - Public-facing website
   - Health articles (Arabic + English)
   - Doctor search & profiles
   - Booking consultation
   - Video consultation interface

2. **Doctor Portal** (doctors.marham.sa)
   - Self-registration
   - Profile management
   - Schedule management
   - Consultation interface
   - Earnings dashboard

3. **Content System** (marham.sa/health)
   - SEO-optimized health articles
   - Arabic women's health content
   - Doctor-reviewed badges
   - Search & browse by condition

---

### **Strategic Context (From Our Discussions):**

**Key Decisions Made:**
- ✅ Women's health vertical (not general healthcare)
- ✅ Female-only doctors
- ✅ Saudi doctors + US specialists (unique differentiator)
- ✅ SEO-first GTM (content → trust → users)
- ✅ Arabic-first platform (English secondary)
- ✅ Start with Riyadh/Jeddah/Dammam

**Business Model:**
- Patients pay: SAR 75-150 per consultation
- Doctors earn: 70% (SAR 52.50-105)
- Platform keeps: 30% (SAR 22.50-45)
- US specialists: 50/50 split (SAR 400 each from SAR 800)

**MVP Goals:**
1. Validate demand (30-day test: 100+ leads, 5+ prepayments)
2. Recruit 10 doctors (functional platform needed)
3. Run 20 test consultations
4. Prove concept before full build

**What This Portal Enables:**
- Share link with doctors during recruitment ("Here's the platform")
- Share link with patients during validation ("Sign up here")
- Run test consultations (prove the full flow works)
- Build SEO content (start ranking in Google)

---

## PATIENT PORTAL

### **HOMEPAGE (marham.sa)**

**Hero Section:**
```
[Background: Gradient purple/pink, woman using phone smiling]

Arabic (Primary):
رعاية صحية نسائية من طبيبات سعوديات
احجزي استشارة مع طبيبة متخصصة من منزلك

English (Secondary):
Women's Healthcare from Female Saudi Doctors
Book a consultation with a female specialist from home

[CTA Button: احجزي استشارة الآن / Book Consultation Now]
[Secondary CTA: تصفح الطبيبات / Browse Doctors]
```

**Trust Indicators:**
- ✅ "طبيبات سعوديات مرخصات" (Licensed Saudi female doctors)
- ✅ "استشارات خاصة وآمنة" (Private & secure consultations)
- ✅ "بدون قوائم انتظار" (No waiting lists)
- ✅ Logo: Partner hospital (DNMKH) once confirmed

**How It Works (3 Steps):**
```
1. اختاري طبيبتك
   Browse female doctors by specialty
   [Icon: Search doctors]

2. احجزي موعدك
   Choose time, pay online
   [Icon: Calendar]

3. استشيري من منزلك
   Video call with doctor
   [Icon: Video chat]
```

**Specialties We Cover:**
```
[Grid of 6 cards with icons]

1. صحة المرأة / Women's Health
2. أمراض النساء والتوليد / OB/GYN
3. الحمل والولادة / Pregnancy Care
4. تكيس المبايض / PCOS
5. الخصوبة / Fertility
6. الصحة النفسية / Mental Health
```

**Featured Doctors (4-6 profiles):**
```
[Card for each doctor]
- Photo (professional, wearing hijab if applicable)
- Name: د. [Name]
- Specialty: اختصاصية [specialty]
- Hospital: مستشفى [hospital]
- Experience: [X] سنوات خبرة
- Rating: ⭐⭐⭐⭐⭐ (4.9)
- Available: Today / Tomorrow
- Price: من SAR 75

[CTA: احجزي الآن / Book Now]
```

**Health Articles (Preview - 3 articles):**
```
[Cards with image + text]

1. "أعراض تكيس المبايض: متى يجب استشارة الطبيبة؟"
   [Image: Woman with doctor]
   Read more →

2. "الخصوبة بعد الثلاثين: ما تحتاجين معرفته"
   [Image: Pregnant woman]
   Read more →

3. "الحمل الصحي: دليل الأشهر الثلاثة الأولى"
   [Image: Ultrasound]
   Read more →

[CTA: المزيد من المقالات / More Articles]
```

**Why Marham? (Social Proof):**
```
"لأول مرة في المملكة: منصة صحية للنساء فقط"
First female-only health platform in Saudi Arabia

- ✅ طبيبات سعوديات فقط (Female Saudi doctors only)
- ✅ استشارات خاصة 100% (100% private consultations)
- ✅ متاحة في أي وقت (Available anytime)
- ✅ تقبل التأمين الصحي (Health insurance accepted)
```

**Testimonials (Once you have them):**
```
[3 cards with patient quotes]

"استشرت طبيبة في خصوصية تامة من منزلي. تجربة رائعة!"
- نورة، الرياض

"ساعدتني الطبيبة في فهم حالة تكيس المبايض وبدأت العلاج"
- سارة، جدة

[After validation phase with real testimonials]
```

**Footer:**
```
[4 columns]

Col 1: روابط سريعة / Quick Links
- عن مرهم / About Marham
- كيف نعمل / How It Works
- الأسعار / Pricing
- الأسئلة الشائعة / FAQ

Col 2: التخصصات / Specialties
- أمراض النساء / OB/GYN
- الحمل / Pregnancy
- الخصوبة / Fertility
- الصحة النفسية / Mental Health

Col 3: الموارد / Resources
- مقالات صحية / Health Articles
- دليل الأمراض / Conditions Guide
- نصائح صحية / Health Tips

Col 4: تواصل معنا / Contact Us
- واتساب: +966 XX XXX XXXX
- البريد: info@marham.sa
- العنوان: الرياض، المملكة العربية السعودية

[Social Media Icons: Instagram, Twitter, LinkedIn]

[Legal]
- سياسة الخصوصية / Privacy Policy
- الشروط والأحكام / Terms & Conditions
- ترخيص وزارة الصحة: [Number - once obtained]
```

---

### **DOCTOR LISTING PAGE (marham.sa/doctors)**

**Filters (Left Sidebar):**
```
التخصص / Specialty:
☐ أمراض النساء والتوليد (OB/GYN)
☐ طب الأمومة والجنين (Maternal-Fetal Medicine)
☐ الغدد الصماء (Endocrinology)
☐ الخصوبة (Fertility)
☐ الصحة النفسية (Mental Health)

المدينة / City:
☐ الرياض (Riyadh)
☐ جدة (Jeddah)
☐ الدمام (Dammam)
☐ مكة (Mecca)
☐ المدينة (Medina)

المستشفى / Hospital:
☐ مستشفى الملك فيصل (King Faisal)
☐ السعودي الألماني (Saudi German)
☐ د. سليمان الحبيب (Dr. Sulaiman Al Habib)

السعر / Price:
☐ أقل من SAR 100 (Under SAR 100)
☐ SAR 100 - 150
☐ أكثر من SAR 150 (Over SAR 150)

التوفر / Availability:
☐ متاحة اليوم (Available today)
☐ متاحة هذا الأسبوع (This week)
☐ عطلة نهاية الأسبوع (Weekends)
```

**Doctor Cards (Right Side - Grid):**
```
[Each card shows]

[Profile Photo - circular]

د. نورا الراشد
Dr. Noura Al-Rashid

اختصاصية أمراض النساء والتوليد
OB/GYN Specialist

مستشفى الملك فيصل
King Faisal Specialist Hospital

⭐ 4.8 (24 تقييم / reviews)
🎓 15 سنة خبرة / years experience
🏥 بورد سعودي / Saudi Board

التخصصات الفرعية / Sub-specialties:
• تكيس المبايض (PCOS)
• الخصوبة والإنجاب (Fertility)
• الحمل عالي الخطورة (High-risk pregnancy)

💰 SAR 100 للاستشارة / per consultation
⏰ متاحة اليوم / Available today

[Button: احجزي موعد / Book Appointment]
[Button: الملف الكامل / View Full Profile]
```

**Sort Options (Top):**
```
ترتيب حسب / Sort by:
- الأعلى تقييماً (Highest rated)
- السعر: الأقل إلى الأعلى (Price: Low to High)
- السعر: الأعلى إلى الأقل (Price: High to Low)
- الأقرب موعداً (Earliest available)
```

---

### **DOCTOR PROFILE PAGE (marham.sa/doctors/[slug])**

**Header:**
```
[Left Side: Large profile photo]

[Right Side:]
د. نورا الراشد
Dr. Noura Al-Rashid, MBBS, Saudi Board

اختصاصية أمراض النساء والتوليد
OB/GYN Specialist

مستشفى الملك فيصل التخصصي
King Faisal Specialist Hospital

⭐⭐⭐⭐⭐ 4.8/5 (24 تقييم)
👥 120+ استشارة مكتملة / consultations completed
✅ تم التحقق من الترخيص / License verified

[Large CTA Button: احجزي استشارة - SAR 100]
```

**About (نبذة عنها):**
```
د. نورا متخصصة في أمراض النساء والتوليد مع أكثر من 15 عاماً من الخبرة في مستشفى الملك فيصل التخصصي. 

لديها اهتمام خاص بـ:
• علاج تكيس المبايض
• استشارات الخصوبة
• متابعة الحمل عالي الخطورة

Dr. Noura is an OB/GYN specialist with over 15 years of experience at King Faisal Specialist Hospital.

Special interests include:
• PCOS treatment
• Fertility consultations  
• High-risk pregnancy care
```

**Qualifications (المؤهلات):**
```
🎓 التعليم / Education:
- بكالوريوس الطب والجراحة - جامعة الملك سعود (2008)
  MBBS - King Saud University (2008)
- بورد سعودي في أمراض النساء والتوليد (2014)
  Saudi Board in OB/GYN (2014)
- زمالة طب الأمومة والجنين - مستشفى مايو كلينك، أمريكا (2016)
  Fellowship in Maternal-Fetal Medicine - Mayo Clinic, USA (2016)

📋 الترخيص / License:
- SCFHS License: 1-234567 (التحقق ✓)

🏥 الخبرة المهنية / Professional Experience:
- استشارية، مستشفى الملك فيصل (2016 - الآن)
  Consultant, King Faisal Hospital (2016 - Present)
- أستاذ مساعد، كلية الطب - جامعة الملك سعود
  Assistant Professor, College of Medicine - KSU
```

**Services Offered (الخدمات المقدمة):**
```
✓ استشارات تكيس المبايض (PCOS consultations)
✓ استشارات الخصوبة (Fertility consultations)
✓ متابعة الحمل (Pregnancy follow-up)
✓ استشارات ما قبل الحمل (Pre-pregnancy consultations)
✓ مشاكل الدورة الشهرية (Menstrual disorders)
✓ استشارات سن اليأس (Menopause consultations)
✓ الوصفات الطبية (Prescriptions)
✓ تفسير التحاليل (Lab results interpretation)
```

**Languages (اللغات):**
```
🗣️ العربية (Arabic) - اللغة الأم
🗣️ English - Fluent
```

**Availability (الأوقات المتاحة):**
```
[Weekly calendar showing available slots]

الأحد - Sun: 6:00 PM - 10:00 PM
الإثنين - Mon: 6:00 PM - 10:00 PM  
الثلاثاء - Tue: Not available
الأربعاء - Wed: 6:00 PM - 10:00 PM
الخميس - Thu: 6:00 PM - 10:00 PM
الجمعة - Fri: 3:00 PM - 9:00 PM
السبت - Sat: 3:00 PM - 9:00 PM

[Button: اختاري موعد / Choose Time]
```

**Patient Reviews (آراء المريضات):**
```
[Card for each review]

⭐⭐⭐⭐⭐ 5/5
"د. نورا رائعة! استمعت لمشكلتي بعناية وأعطتني خطة علاج واضحة لتكيس المبايض."
- فاطمة، الرياض (منذ أسبوعين / 2 weeks ago)

⭐⭐⭐⭐⭐ 5/5  
"ساعدتني في فهم خيارات الخصوبة المتاحة. شرح واضح ومفصل."
- رنا، جدة (منذ شهر / 1 month ago)

⭐⭐⭐⭐ 4/5
"استشارة مفيدة جداً. كنت أتمنى لو كان الوقت أطول قليلاً."
- أمل، الدمام (منذ 3 أشهر / 3 months ago)

[Button: عرض جميع التقييمات / View All Reviews]
```

**Pricing (الأسعار):**
```
💰 استشارة عادية / Standard Consultation (30 min)
   SAR 100

💰 استشارة متابعة / Follow-up Consultation (15 min)
   SAR 75

💰 استشارة مع استشاري أمريكي / With US Specialist (45 min)
   SAR 1,000
   
[CTA: احجزي الآن / Book Now]
```

---

### **BOOKING FLOW**

**Step 1: Select Time**
```
اختاري موعدك مع د. نورا الراشد
Choose your appointment time with Dr. Noura Al-Rashid

[Calendar on left showing available dates]
[Time slots on right]

الأحد، 10 ديسمبر
Sunday, December 10

Available slots:
○ 6:00 PM - 6:30 PM
○ 6:30 PM - 7:00 PM
● 7:00 PM - 7:30 PM (Selected)
○ 7:30 PM - 8:00 PM
○ 8:00 PM - 8:30 PM

[Button: التالي / Next]
```

**Step 2: Patient Information**
```
معلوماتك الشخصية
Your Information

الاسم الكامل* / Full Name*
[Text input]

رقم الجوال* / Mobile Number*
[+966 | ___ ___ ____]

البريد الإلكتروني / Email
[Text input]

تاريخ الميلاد* / Date of Birth*
[DD/MM/YYYY]

المدينة / City
[Dropdown: الرياض / Riyadh]

هل لديك تأمين صحي؟ / Do you have health insurance?
○ نعم / Yes
○ لا / No

[If Yes]
شركة التأمين / Insurance Company
[Dropdown]

ما سبب الاستشارة؟* / Reason for consultation*
[Text area - 500 characters]
"مثال: عدم انتظام الدورة الشهرية منذ 3 أشهر"
"Example: Irregular periods for 3 months"

هل هذه أول استشارة؟ / Is this your first consultation?
○ نعم، استشارة جديدة / Yes, new consultation
○ لا، متابعة / No, follow-up

[Checkbox] أوافق على الشروط والأحكام وسياسة الخصوصية*
I agree to Terms & Conditions and Privacy Policy

[Button: التالي / Next]
```

**Step 3: Payment**
```
ملخص الحجز
Booking Summary

الطبيبة / Doctor: د. نورا الراشد
التاريخ / Date: الأحد، 10 ديسمبر - 7:00 PM
المدة / Duration: 30 دقيقة / minutes
نوع الاستشارة / Type: استشارة عبر الفيديو / Video consultation

─────────────────
الاستشارة / Consultation:    SAR 100
رسوم المنصة / Platform fee:  Included
ضريبة القيمة المضافة / VAT:   SAR 15
─────────────────
المجموع / Total:              SAR 115

طريقة الدفع / Payment Method:
○ بطاقة مدى / Mada
○ فيزا / Visa
○ ماستركارد / Mastercard
○ أبل باي / Apple Pay
○ STC Pay

[Payment form fields]

[Button: تأكيد الدفع / Confirm Payment - SAR 115]

🔒 آمن ومشفر / Secure & Encrypted
```

**Step 4: Confirmation**
```
✅ تم الحجز بنجاح!
Booking Confirmed!

تم إرسال تفاصيل الموعد إلى:
Confirmation sent to:
📧 sara@example.com
📱 +966 50 123 4567

موعدك / Your Appointment:
────────────────
👩‍⚕️ الطبيبة: د. نورا الراشد
📅 التاريخ: الأحد، 10 ديسمبر 2024
⏰ الوقت: 7:00 PM - 7:30 PM
💻 النوع: استشارة فيديو / Video call

ما التالي؟ / What's Next?

1️⃣ سنرسل لك رابط الفيديو قبل الموعد بـ 15 دقيقة
   We'll send the video link 15 minutes before

2️⃣ تأكدي من اتصال الإنترنت والكاميرا
   Check your internet and camera

3️⃣ حضّري أي تقارير أو تحاليل طبية
   Prepare any medical reports

[Button: إضافة للتقويم / Add to Calendar]
[Button: الذهاب للوحة التحكم / Go to Dashboard]

هل تحتاجين المساعدة؟ / Need Help?
📞 تواصلي معنا على واتساب: +966 XX XXX XXXX
```

---

### **VIDEO CONSULTATION PAGE**

**Waiting Room (Before consultation time):**
```
استشارتك مع د. نورا الراشد
Your consultation with Dr. Noura Al-Rashid

⏰ موعدك: اليوم في 7:00 PM

الاستعداد للاستشارة / Preparing for Consultation:
✅ الاتصال جيد / Connection good
✅ الكاميرا تعمل / Camera working  
✅ الميكروفون يعمل / Microphone working

⏳ سيبدأ الاتصال تلقائياً في: 4:32

يرجى البقاء على هذه الصفحة
Please stay on this page

نصائح قبل الاستشارة / Pre-Consultation Tips:
• اجلسي في مكان هادئ ومريح
• تأكدي من خصوصية المكان
• احضري أي تقارير طبية سابقة
• اكتبي أسئلتك مسبقاً

[Test Audio] [Test Video]
```

**Active Consultation:**
```
[Large video area]
[Doctor video - top right corner]
[Patient video - bottom right corner]

[Bottom controls]
🎤 Mute/Unmute
📷 Camera On/Off
💬 Chat
📎 Share File
🖐️ Raise Hand
📝 Notes
📊 Share Screen
📞 End Call

[Timer: 08:32 / 30:00]

[Right sidebar - collapsed by default]
- Notes taken by doctor (visible to patient)
- Uploaded files
- Chat messages
```

**Post-Consultation:**
```
✅ انتهت الاستشارة
Consultation Ended

شكراً لاستخدام مرهم!
Thank you for using Marham!

ملخص الاستشارة / Consultation Summary:
────────────────
المدة / Duration: 28 دقيقة / minutes
التشخيص / Diagnosis: [To be filled by doctor]
الوصفة الطبية / Prescription: [Attached if any]
الملاحظات / Notes: [Doctor's notes]

التوصيات / Recommendations:
• [Doctor will add]
• [Doctor will add]

الخطوات التالية / Next Steps:
□ متابعة بعد أسبوعين / Follow-up in 2 weeks
□ عمل تحليل [Test name]
□ [Other recommendations]

[Button: تحميل الملخص PDF / Download Summary]
[Button: حجز موعد متابعة / Book Follow-up]

━━━━━━━━━━━━━━━━━━━━━━

قيّمي تجربتك / Rate Your Experience:

كيف كانت الاستشارة؟ / How was the consultation?
⭐⭐⭐⭐⭐

رأيك في الطبيبة / Review the doctor (optional):
[Text area]

[Button: إرسال التقييم / Submit Review]
```

---

### **PATIENT DASHBOARD (marham.sa/dashboard)**

**After patient creates account:**

```
مرحباً، سارة 👋
Welcome, Sara

[Top navigation]
المواعيد / Appointments | السجل الطبي / Medical Records | المفضلة / Favorites | الإعدادات / Settings

━━━━━━━━━━━━━━━━━━━━━━

المواعيد القادمة / Upcoming Appointments:

[Card]
📅 الأحد، 10 ديسمبر - 7:00 PM
👩‍⚕️ د. نورا الراشد
📍 استشارة فيديو / Video consultation
⏰ بعد يومين / In 2 days

[Button: الانضمام / Join] [Button: إعادة الجدولة / Reschedule] [Button: إلغاء / Cancel]

─────────────────

المواعيد السابقة / Past Appointments:

[Card]
✅ الأحد، 26 نوفمبر - 6:00 PM
👩‍⚕️ د. ليلى العمري
💬 استشارة PCOS
⭐⭐⭐⭐⭐ تم التقييم / Rated

[Button: عرض الملخص / View Summary] [Button: إعادة الحجز / Rebook]

━━━━━━━━━━━━━━━━━━━━━━

السجل الطبي / Medical Records:

📄 ملخص الاستشارات (3)
📋 الوصفات الطبية (2)
🧪 التحاليل (5 ملفات)
📊 التقارير الطبية (2)

[Button: عرض الكل / View All]

━━━━━━━━━━━━━━━━━━━━━━

الطبيبات المفضلة / Favorite Doctors:

[3 doctor cards]
[Same format as listing page]

━━━━━━━━━━━━━━━━━━━━━━

مقالات قد تهمك / Articles You Might Like:

[Based on past consultations]
- "كل ما تحتاجين معرفته عن تكيس المبايض"
- "نصائح للخصوبة الطبيعية"

━━━━━━━━━━━━━━━━━━━━━━
```

---

## DOCTOR PORTAL

### **DOCTOR REGISTRATION (doctors.marham.sa/register)**

**Landing Page:**
```
انضمي لمرهم - أول منصة صحية نسائية في المملكة
Join Marham - First Female-Only Health Platform in Saudi Arabia

[Hero section with doctor using laptop]

لماذا تنضمين لمرهم؟
Why Join Marham?

💰 دخل إضافي مرن
   Flexible Additional Income
   SAR 200-300 للاستشارة / per consultation

⏰ اختاري أوقاتك
   Set Your Own Hours
   عملي من المنزل أو العيادة / Work from home or clinic

💝 ساعدي النساء المحتاجات
   Help Underserved Women
   آلاف النساء ينتظرن رعايتك / Thousands of women waiting

🎓 طوري مهاراتك
   Develop Your Skills
   تدريب على الطب الرقمي / Digital medicine training

[Button: سجلي الآن / Register Now]

━━━━━━━━━━━━━━━━━━━━━━

الشروط / Requirements:

✓ طبيبة سعودية أو مقيمة / Saudi or resident female doctor
✓ ترخيص SCFHS ساري / Valid SCFHS license
✓ تخصص أمراض نساء أو طب نفسي أو غدد صماء
  OB/GYN, Psychiatry, or Endocrinology specialty
✓ خبرة سنتين على الأقل / Minimum 2 years experience

━━━━━━━━━━━━━━━━━━━━━━

كيف تعمل المنصة؟
How It Works?

1️⃣ سجلي وأنشئي ملفك الطبي
2️⃣ نتحقق من ترخيصك (24-48 ساعة)
3️⃣ حددي أوقات عملك
4️⃣ ابدئي استقبال المريضات
5️⃣ احصلي على أرباحك كل أسبوع

[Button: ابدئي الآن / Start Now]
```

**Registration Form:**

```
التسجيل كطبيبة - Marham
Doctor Registration

الخطوة 1 من 4: المعلومات الشخصية
Step 1 of 4: Personal Information

الاسم الكامل (بالعربية)* / Full Name (Arabic)*
[Text input]

الاسم الكامل (بالإنجليزية)* / Full Name (English)*
[Text input]

رقم الجوال* / Mobile Number*
[+966 | ___ ___ ____]

البريد الإلكتروني* / Email Address*
[Text input]

المدينة* / City*
[Dropdown: Riyadh, Jeddah, Dammam, Other]

[Button: التالي / Next]

━━━━━━━━━━━━━━━━━━━━━━

الخطوة 2 من 4: المؤهلات الطبية
Step 2 of 4: Medical Qualifications

رقم ترخيص الهيئة السعودية* / SCFHS License Number*
[1-______]
[سنقوم بالتحقق تلقائياً / We'll verify automatically]

التخصص* / Specialty*
○ أمراض النساء والتوليد / OB/GYN
○ طب الأمومة والجنين / Maternal-Fetal Medicine
○ الغدد الصماء / Endocrinology
○ الخصوبة / Fertility
○ الطب النفسي / Psychiatry
○ أخرى / Other [Text input]

التخصص الفرعي / Sub-specialty (optional)
[Checkbox list]
☐ تكيس المبايض / PCOS
☐ الخصوبة / Fertility
☐ الحمل عالي الخطورة / High-risk pregnancy
☐ سن اليأس / Menopause
☐ اضطرابات الدورة / Menstrual disorders

سنوات الخبرة* / Years of Experience*
[Dropdown: 2-5, 5-10, 10-15, 15+]

المؤهلات الأكاديمية* / Academic Qualifications*
[Text area]
"مثال: بكالوريوس طب - جامعة الملك سعود (2010)، بورد سعودي (2015)"

الزمالات (إن وجدت) / Fellowships (if any)
[Text area]

[Button: رجوع / Back] [Button: التالي / Next]

━━━━━━━━━━━━━━━━━━━━━━

الخطوة 3 من 4: معلومات العمل
Step 3 of 4: Professional Information

المستشفى / العيادة الحالية* / Current Hospital/Clinic*
[Text input]

المنصب الحالي* / Current Position*
○ استشارية / Consultant
○ أخصائية / Specialist
○ مقيمة أولى / Senior Resident
○ أخرى / Other

اللغات / Languages*
☑ العربية / Arabic
☐ الإنجليزية / English
☐ أخرى / Other [Text input]

نبذة مختصرة (سيتم عرضها للمريضات)* / About You (patients will see this)*
[Text area - 500 characters]
"اكتبي نبذة مختصرة عن خبرتك واهتماماتك الطبية"

صورة شخصية* / Profile Photo*
[Upload button]
"صورة احترافية بجودة عالية - ستظهر للمريضات"
"Professional high-quality photo - patients will see this"

نسخة من الترخيص* / License Copy*
[Upload button - PDF/JPG]

نسخة من الهوية / CV* / ID / CV Copy*
[Upload button - PDF]

[Button: رجوع / Back] [Button: التالي / Next]

━━━━━━━━━━━━━━━━━━━━━━

الخطوة 4 من 4: الأسعار والمدفوعات
Step 4 of 4: Pricing & Payments

سعر الاستشارة* / Consultation Price*
○ SAR 75 (نوصي للمبتدئين / Recommended for beginners)
○ SAR 100 (الأكثر شيوعاً / Most common)
○ SAR 125
○ SAR 150
○ مخصص / Custom [Input]

💡 أنت تحصلين على 70% (مثلاً: SAR 70 من SAR 100)
   You receive 70% (e.g., SAR 70 from SAR 100)

معلومات البنك (للمدفوعات)* / Bank Information (for payments)*
اسم البنك / Bank Name: [Dropdown]
رقم الآيبان / IBAN: [SA__ ____ ____ ____ ____ ____]
اسم صاحب الحساب / Account Name: [Text input]

جدول الدفع / Payment Schedule:
○ أسبوعي (كل يوم أحد) / Weekly (every Sunday)
○ شهري (أول كل شهر) / Monthly (1st of month)

الشروط والأحكام / Terms & Conditions:
☐ أوافق على شروط وأحكام منصة مرهم*
   I agree to Marham platform terms and conditions

☐ أوافق على سياسة الخصوصية*
   I agree to the Privacy Policy

☐ أؤكد أن جميع المعلومات المقدمة صحيحة*
   I confirm all information provided is accurate

[Button: رجوع / Back] [Button: إرسال الطلب / Submit Application]

━━━━━━━━━━━━━━━━━━━━━━

✅ تم إرسال طلبك بنجاح!
Application Submitted Successfully!

ما التالي؟ / What's Next?

1️⃣ التحقق من الترخيص (12-24 ساعة)
   License verification (12-24 hours)

2️⃣ مراجعة الملف (24-48 ساعة)
   Profile review (24-48 hours)

3️⃣ تفعيل الحساب وإرسال بيانات الدخول
   Account activation & login credentials sent

سنتواصل معك على:
We'll contact you at:
📧 noura.alrashid@hospital.com
📱 +966 50 123 4567

[Button: العودة للرئيسية / Back to Home]
```

---

### **DOCTOR DASHBOARD (doctors.marham.sa/dashboard)**

**After doctor logs in:**

```
مرحباً، د. نورا 👋
Welcome, Dr. Noura

[Top Navigation]
لوحة التحكم / Dashboard | المواعيد / Appointments | المريضات / Patients | الجدول / Schedule | الأرباح / Earnings | الملف / Profile

━━━━━━━━━━━━━━━━━━━━━━

📊 نظرة عامة / Overview

[4 cards in row]

💰 أرباح هذا الشهر
   This Month Earnings
   SAR 3,450
   +15% عن الشهر الماضي

📅 الاستشارات
   Consultations
   42 هذا الشهر
   23 قادمة / 19 مكتملة

⭐ التقييم
   Rating
   4.8 / 5.0
   من 28 تقييم

👥 المريضات
   Patients
   67 مريضة
   12 جديدة هذا الشهر

━━━━━━━━━━━━━━━━━━━━━━

📅 المواعيد اليوم / Today's Appointments

[List of appointments]

⏰ 6:00 PM - 6:30 PM
👤 سارة أحمد
💬 استشارة: عدم انتظام الدورة
📋 استشارة جديدة / New consultation
[Button: بدء الاستشارة / Start] [Button: إلغاء / Cancel]

⏰ 7:00 PM - 7:30 PM  
👤 فاطمة علي
💬 استشارة: متابعة PCOS
📋 متابعة / Follow-up
[Button: عرض السجل / View Record] [Button: بدء / Start]

⏰ 8:00 PM - 8:30 PM
👤 رنا خالد
💬 استشارة: استشارة خصوبة
📋 استشارة جديدة / New consultation
[Button: بدء / Start]

[Button: عرض كل المواعيد / View All Appointments]

━━━━━━━━━━━━━━━━━━━━━━

📊 أداء هذا الأسبوع / This Week Performance

[Simple bar chart]
الأحد: 3 استشارات
الإثنين: 4 استشارات
الثلاثاء: 0 استشارات (عطلة)
الأربعاء: 5 استشارات
الخميس: 3 استشارات
الجمعة: 2 استشارات
السبت: 4 استشارات

المجموع: 21 استشارة، أرباح SAR 1,470

━━━━━━━━━━━━━━━━━━━━━━

📢 الإشعارات / Notifications

🔔 مريضة جديدة حجزت موعد غداً الساعة 6:00 PM
🔔 تقييم جديد من مريضة (⭐⭐⭐⭐⭐)
🔔 تم تحويل أرباح الأسبوع الماضي (SAR 980)

[View All]

━━━━━━━━━━━━━━━━━━━━━━
```

---

### **SCHEDULE MANAGEMENT (doctors.marham.sa/schedule)**

```
جدول المواعيد / Schedule Management

حددي أوقات توفرك خلال الأسبوع
Set your availability for the week

[Weekly calendar grid]

         | الأحد  | الإثنين | الثلاثاء | الأربعاء | الخميس | الجمعة | السبت
---------|--------|---------|---------|----------|--------|--------|--------
6:00 AM  |        |         |         |          |        |        |
7:00 AM  |        |         |         |          |        |        |
...      |        |         |         |          |        |        |
6:00 PM  | ✓✓✓    | ✓✓✓     |         | ✓✓✓      | ✓✓✓    | ✓✓     | ✓✓
7:00 PM  | ✓✓✓    | ✓✓✓     |         | ✓✓✓      | ✓✓✓    | ✓✓     | ✓✓
8:00 PM  | ✓✓     | ✓✓      |         | ✓✓       | ✓✓     | ✓✓     | ✓✓
9:00 PM  | ✓      | ✓       |         | ✓        | ✓      | ✓      | ✓
10:00 PM |        |         |         |          |        |        |

✓✓✓ = Available (3 slots)
✓✓ = Some booked (2 slots left)
✓ = Mostly booked (1 slot left)
[Grey] = Fully booked
[White] = Not available

[Actions]
[Button: حفظ التغييرات / Save Changes]
[Button: نسخ للأسبوع القادم / Copy to Next Week]
[Button: إضافة عطلة / Add Time Off]

━━━━━━━━━━━━━━━━━━━━━━

⚙️ إعدادات الجدول / Schedule Settings

مدة الاستشارة الافتراضية / Default Consultation Duration:
○ 15 دقيقة (متابعة) / 15 min (follow-up)
● 30 دقيقة (عادية) / 30 min (standard)
○ 45 دقيقة (معقدة) / 45 min (complex)

الفترة بين الاستشارات / Break Between Consultations:
● 0 دقيقة / 0 min
○ 5 دقائق / 5 min
○ 10 دقائق / 10 min

عدد الاستشارات في الساعة / Consultations Per Hour:
● 2 استشارة (30 دقيقة لكل)
○ 3 استشارات (20 دقيقة لكل)
○ 4 استشارات (15 دقيقة لكل)

السماح بالحجز المسبق / Advance Booking:
● حتى 14 يوم مقدماً / Up to 14 days
○ حتى 7 أيام / Up to 7 days
○ حتى 3 أيام / Up to 3 days

الحجز الفوري / Instant Booking:
☑ السماح بالحجز اليوم نفسه / Allow same-day bookings
☑ السماح بالحجز قبل ساعة / Allow bookings 1 hour before

[Button: حفظ / Save]

━━━━━━━━━━━━━━━━━━━━━━

📅 العطلات والإجازات / Time Off & Holidays

[List]
🏖️ إجازة عائلية / Family vacation
   25 - 30 ديسمبر / December 25-30
   [Edit] [Delete]

🕌 عيد الفطر / Eid Al-Fitr  
   10 - 13 أبريل / April 10-13
   [Edit] [Delete]

[Button: + إضافة إجازة جديدة / Add New Time Off]
```

---

### **PATIENT RECORDS (doctors.marham.sa/patients/[id])**

```
👤 سارة أحمد
Patient: Sara Ahmed

[Tabs: نظرة عامة / Overview | التاريخ الطبي / Medical History | الاستشارات / Consultations | الملفات / Files]

━━━━━━━━━━━━━━━━━━━━━━

📋 نظرة عامة / Overview

معلومات أساسية / Basic Information:
- العمر / Age: 28 سنة / years
- المدينة / City: الرياض / Riyadh
- رقم الجوال / Mobile: +966 50 XXX XXXX
- البريد / Email: sara@example.com
- التأمين / Insurance: Bupa Arabia

الاستشارات / Consultations:
- الأولى / First: 15 نوفمبر 2024
- الأخيرة / Last: 26 نوفمبر 2024
- العدد الإجمالي / Total: 3 استشارات

الشكوى الرئيسية / Main Complaint:
عدم انتظام الدورة الشهرية
Irregular menstrual cycles

━━━━━━━━━━━━━━━━━━━━━━

📝 التاريخ الطبي / Medical History

الأمراض المزمنة / Chronic Conditions:
- تكيس المبايض / PCOS (مشخص 2022)

الأدوية الحالية / Current Medications:
- Metformin 500mg مرتين يومياً / twice daily
- Vitamin D3 10,000 IU أسبوعياً / weekly

الحساسية / Allergies:
- لا توجد / None

العمليات السابقة / Past Surgeries:
- لا توجد / None

التاريخ العائلي / Family History:
- السكري لدى الوالدة / Diabetes (mother)
- تكيس المبايض لدى الأخت / PCOS (sister)

━━━━━━━━━━━━━━━━━━━━━━

📅 سجل الاستشارات / Consultation History

[Accordion list]

▼ 26 نوفمبر 2024 - 6:00 PM (متابعة / Follow-up)

الشكوى / Complaint:
استمرار عدم انتظام الدورة بعد شهر من العلاج

الفحص / Examination:
- الوزن / Weight: 72 kg (زيادة 1 كجم / +1kg)
- ضغط الدم / BP: 120/80

التشخيص / Diagnosis:
تكيس المبايض - تحسن جزئي
PCOS - Partial improvement

العلاج / Treatment:
- استمرار Metformin
- إضافة Inositol
- متابعة بعد شهر

الملاحظات / Notes:
المريضة ملتزمة بالعلاج ولكن لم تبدأ التمارين بعد. نصحتها بالمشي 30 دقيقة يومياً.

━━━━━━━━━━━━━━━━━━━━━━

▼ 15 نوفمبر 2024 - 7:00 PM (استشارة جديدة / New)

الشكوى / Complaint:
عدم انتظام الدورة منذ 6 أشهر، صعوبة في فقدان الوزن

[Full consultation details...]

━━━━━━━━━━━━━━━━━━━━━━

📎 الملفات / Files

[List of uploaded files]
📄 تحليل هرمونات - 20 نوفمبر 2024.pdf (245 KB)
   [View] [Download]

📄 سونار المبايض - 18 نوفمبر 2024.jpg (1.2 MB)
   [View] [Download]

📄 تحليل سكر صائم - 15 نوفمبر 2024.pdf (180 KB)
   [View] [Download]

[Button: + رفع ملف جديد / Upload New File]

━━━━━━━━━━━━━━━━━━━━━━

[Bottom Action Buttons]
[حجز موعد متابعة / Book Follow-up] [إرسال رسالة / Send Message] [طباعة السجل / Print Record]
```

---

### **EARNINGS DASHBOARD (doctors.marham.sa/earnings)**

```
💰 الأرباح / Earnings

[Summary Cards]

الرصيد الحالي / Current Balance:     SAR 2,485
[سيتم التحويل يوم الأحد / Transfer on Sunday]

أرباح هذا الشهر / This Month:        SAR 3,450
[+15% عن الشهر الماضي / vs last month]

إجمالي الأرباح / Total Earnings:     SAR 12,890
[منذ الانضمام / Since joining]

عدد الاستشارات / Consultations:      42 هذا الشهر
[126 إجمالي / Total 126]

━━━━━━━━━━━━━━━━━━━━━━

📊 تفاصيل الأرباح / Earnings Breakdown

[Table]

التاريخ | النوع | المريضة | السعر | نصيبك | حالة
Date | Type | Patient | Price | Your Share | Status
──────|────|──────|────|──────|─────
2 ديسمبر | استشارة | سارة أ. | SAR 100 | SAR 70 | ✅ مكتملة
1 ديسمبر | متابعة | فاطمة ع. | SAR 75 | SAR 52.50 | ✅ مكتملة
1 ديسمبر | استشارة | رنا خ. | SAR 100 | SAR 70 | ✅ مكتملة
30 نوفمبر | استشارة | أمل س. | SAR 100 | SAR 70 | ✅ مكتملة
29 نوفمبر | متابعة | سارة أ. | SAR 75 | SAR 52.50 | ✅ مكتملة

[Pagination: 1 2 3 ... 12 >]

[Export CSV] [Export PDF]

━━━━━━━━━━━━━━━━━━━━━━

📈 الرسم البياني / Earnings Chart

[Line chart showing earnings over last 6 months]

يوليو: SAR 1,200
أغسطس: SAR 1,850
سبتمبر: SAR 2,100
أكتوبر: SAR 2,650
نوفمبر: SAR 2,980
ديسمبر: SAR 3,450

━━━━━━━━━━━━━━━━━━━━━━

💳 سجل التحويلات / Transfer History

[Table]

التاريخ | المبلغ | الحالة | رقم المرجع
Date | Amount | Status | Reference
──────|────|────|─────
26 نوفمبر | SAR 980 | ✅ محول / Transferred | TXN-20241126-001
19 نوفمبر | SAR 1,050 | ✅ محول / Transferred | TXN-20241119-001
12 نوفمبر | SAR 875 | ✅ محول / Transferred | TXN-20241112-001

━━━━━━━━━━━━━━━━━━━━━━

⚙️ إعدادات الدفع / Payment Settings

معلومات البنك / Bank Information:
البنك / Bank: الراجحي / Al Rajhi Bank
الآيبان / IBAN: SA12 3456 7890 1234 5678 9012
اسم الحساب / Name: نورا الراشد / Noura Al-Rashid

جدول الدفع / Payment Schedule:
● أسبوعي (كل يوم أحد)
○ شهري (أول كل شهر)

[Button: تعديل / Edit]

━━━━━━━━━━━━━━━━━━━━━━
```

---

## CONTENT SYSTEM

### **ARTICLE PAGE (marham.sa/health/[slug])**

**Example: PCOS Article**

```
[Breadcrumb]
الرئيسية / Home > صحة المرأة / Women's Health > تكيس المبايض / PCOS

━━━━━━━━━━━━━━━━━━━━━━

تكيس المبايض: الأعراض، الأسباب، والعلاج
PCOS: Symptoms, Causes, and Treatment

[Featured image: Medical illustration of PCOS]

✍️ كتبته: فريق مرهم الطبي / Written by: Marham Medical Team
✅ مراجعة طبية: د. نورا الراشد، اختصاصية أمراض النساء
   Medical review: Dr. Noura Al-Rashid, OB/GYN Specialist
📅 آخر تحديث: 1 ديسمبر 2024 / Last updated: December 1, 2024
⏱️ وقت القراءة: 8 دقائق / Reading time: 8 minutes

━━━━━━━━━━━━━━━━━━━━━━

[Table of Contents - Sticky sidebar on right]
في هذا المقال / In This Article:
1. ما هو تكيس المبايض؟
2. الأعراض الشائعة
3. الأسباب وعوامل الخطر
4. التشخيص
5. خيارات العلاج
6. نصائح لإدارة الحالة
7. متى يجب استشارة الطبيبة؟
8. الأسئلة الشائعة

━━━━━━━━━━━━━━━━━━━━━━

## ما هو تكيس المبايض؟

تكيس المبايض (PCOS - Polycystic Ovary Syndrome) هو اضطراب هرموني شائع يصيب النساء في سن الإنجاب. يؤثر على 8-13% من النساء في المملكة العربية السعودية.

[Highlight box]
💡 الحقيقة المهمة:
تكيس المبايض ليس مرضاً لا يمكن علاجه. مع العلاج المناسب ونمط الحياة الصحي، يمكن التحكم في الأعراض وتحسين الخصوبة.

[Continue with full article content - 2000+ words]

## الأعراض الشائعة

### أعراض الدورة الشهرية:
- عدم انتظام الدورة الشهرية
- قلة عدد مرات الدورة (أقل من 9 مرات في السنة)
- غياب الدورة لعدة أشهر

[Infographic: Visual showing symptoms]

### أعراض هرمونية:
- نمو شعر زائد في الوجه والجسم (70% من الحالات)
- حب الشباب
- تساقط الشعر

[Continue...]

━━━━━━━━━━━━━━━━━━━━━━

[Inline CTA Box - After section 2]

🩺 هل تعانين من أعراض تكيس المبايض؟

استشيري طبيبة متخصصة الآن واحصلي على خطة علاج مخصصة.

[Button: احجزي استشارة / Book Consultation]

━━━━━━━━━━━━━━━━━━━━━━

[Continue with remaining sections...]

## متى يجب استشارة الطبيبة؟

يجب استشارة طبيبة متخصصة في أمراض النساء إذا كنت تعانين من:

✓ عدم انتظام الدورة لأكثر من 3 أشهر
✓ صعوبة في الحمل لأكثر من سنة
✓ أعراض هرمونية واضحة (شعر زائد، حب شباب شديد)
✓ زيادة مفاجئة في الوزن

[Doctor recommendation box]
👩‍⚕️ الطبيبات المتخصصات في مرهم

[3 doctor cards - same format as homepage]

د. نورا الراشد
اختصاصية PCOS والخصوبة
⭐ 4.8 (28 تقييم)
SAR 100 / استشارة
[Button: احجزي الآن]

━━━━━━━━━━━━━━━━━━━━━━

## الأسئلة الشائعة

[Accordion FAQ]

▼ هل يمكن الحمل مع تكيس المبايض؟

نعم، يمكن الحمل مع تكيس المبايض. مع العلاج المناسب وتغيير نمط الحياة، حوالي 80% من النساء المصابات بتكيس المبايض يمكنهن الحمل. قد تحتاجين إلى:
- أدوية تحفيز الإباضة
- متابعة مع طبيبة خصوبة
- في بعض الحالات، علاجات مساعدة على الإنجاب

▼ هل تكيس المبايض يسبب السمنة؟

تكيس المبايض ومقاومة الأنسولين يمكن أن تجعل فقدان الوزن صعباً. ولكن فقدان حتى 5-10% من وزن الجسم يمكن أن يحسن الأعراض بشكل كبير.

[Continue with 8-10 FAQs...]

━━━━━━━━━━━━━━━━━━━━━━

## المصادر

[References - medical sources]
1. Saudi Journal of Medicine & Medical Sciences - PCOS in Saudi Arabia (2023)
2. American College of Obstetricians and Gynecologists - PCOS Guidelines
3. Endocrine Society Clinical Practice Guideline

━━━━━━━━━━━━━━━━━━━━━━

[Bottom of article]

✍️ هل كان هذا المقال مفيداً؟
Was this article helpful?

👍 نعم (245) | 👎 لا (12)

شاركي هذا المقال / Share:
[Social sharing buttons: WhatsApp, Twitter, Facebook, Copy link]

━━━━━━━━━━━━━━━━━━━━━━

📚 مقالات ذات صلة / Related Articles

[3 related article cards]
- "علاج تكيس المبايض بالأدوية: دليل شامل"
- "الخصوبة والحمل مع تكيس المبايض"
- "نظام غذائي لتكيس المبايض: نصائح عملية"

━━━━━━━━━━━━━━━━━━━━━━

💬 هل لديك سؤال عن تكيس المبايض؟
Do you have a question about PCOS?

استشيري طبيبة متخصصة الآن
Consult a specialist now

[Large CTA: احجزي استشارة / Book Consultation - SAR 75]

━━━━━━━━━━━━━━━━━━━━━━
```

---

### **HEALTH ARTICLES LIBRARY (marham.sa/health)**

```
المكتبة الصحية
Health Library

🔍 [Search box: ابحثي عن موضوع صحي... / Search health topics...]

[Filters on left]
التصنيف / Category:
☐ الكل / All (246)
☐ أمراض النساء / Gynecology (68)
☐ الحمل والولادة / Pregnancy (52)
☐ الخصوبة / Fertility (34)
☐ تكيس المبايض / PCOS (28)
☐ الصحة النفسية / Mental Health (24)
☐ سن اليأس / Menopause (18)
☐ التغذية / Nutrition (22)

[Grid of article cards - 3 columns]

[Article Card 1]
[Image]
تكيس المبايض: الأعراض والعلاج
PCOS: Symptoms & Treatment

✍️ د. نورا الراشد
📅 1 ديسمبر 2024
⏱️ 8 دقائق
👁️ 1,245 قراءة

[Continue Reading →]

[Article Card 2]
[Image]
الخصوبة بعد الثلاثين: دليل شامل
Fertility After 30: Complete Guide

✍️ د. ليلى العمري
📅  28 نوفمبر 2024
⏱️ 10 دقائق
👁️ 892 قراءة

[Continue Reading →]

[12 articles per page, pagination at bottom]

━━━━━━━━━━━━━━━━━━━━━━

📌 الأكثر قراءة / Most Read

1. علامات الحمل المبكرة
2. أعراض تكيس المبايض
3. متى يحدث التبويض؟
4. أسباب تأخر الحمل
5. الدورة الشهرية غير المنتظمة

━━━━━━━━━━━━━━━━━━━━━━
```

---

## SAMPLE ARTICLES (3 COMPLETE ARTICLES FOR MVP)

### **Article 1: PCOS (تكيس المبايض)**
- **Length:** 2,000 words (Arabic + English)
- **Keywords:** تكيس المبايض، PCOS، أعراض تكيس المبايض، علاج تكيس المبايض
- **Sections:** Definition, symptoms, causes, diagnosis, treatment, lifestyle, FAQ
- **Doctor reviewer:** د. نورا الراشد (fictional, but marked as reviewed)

### **Article 2: Fertility (الخصوبة والإنجاب)**
- **Length:** 2,500 words
- **Keywords:** الخصوبة، الحمل، صعوبة الحمل، تحسين الخصوبة
- **Sections:** Fertility basics, age factors, male/female factors, treatments, lifestyle, FAQ

### **Article 3: Pregnancy Care (رعاية الحمل)**
- **Length:** 1,800 words
- **Keywords:** الحمل، رعاية الحمل، الأشهر الأولى، نصائح للحامل
- **Sections:** First trimester guide, nutrition, exercise, warning signs, prenatal care, FAQ

**Why these 3?**
- Cover top 3 pain points (PCOS, fertility, pregnancy)
- Combined search volume: 200K+ monthly searches in Saudi
- Show content quality to doctors during recruitment
- Prove SEO capability to partner

---

## TECH STACK RECOMMENDATION

### **OPTION 1: Fast MVP (2-3 weeks) - Recommended**

**Frontend (Patient Portal):**
- **Next.js 14** (React framework)
- **Tailwind CSS** (styling)
- **Shadcn/UI** (component library)
- **Arabic RTL** support built-in

**Backend (Doctor Portal + API):**
- **Supabase** (PostgreSQL + Auth + Storage + Real-time)
  - Authentication (doctors + patients)
  - Database (doctors, patients, appointments, consultations)
  - File storage (profile photos, medical records)
  - Real-time (video consultation signaling)

**Video Consultation:**
- **Daily.co** or **Whereby** API
  - Pre-built video rooms
  - Recording capability
  - Screen sharing
  - Chat included
  - Cost: $9-99/month depending on usage

**Payments:**
- **Stripe** (international cards)
- **Moyasar** or **Tap Payments** (Mada, STC Pay, Apple Pay)
- **HyperPay** (Saudi-specific, all local methods)

**Content/CMS:**
- **Contentful** or **Sanity.io** (headless CMS)
- Or simple Next.js markdown pages for MVP

**Hosting:**
- **Vercel** (frontend - $0-20/month)
- **Supabase** (backend - $0-25/month for MVP)

**Total MVP cost: $50-150/month**

---

### **OPTION 2: Custom Build (4-6 weeks)**

**Frontend:**
- Next.js 14 + TypeScript
- Tailwind CSS
- React Hook Form + Zod validation

**Backend:**
- **Node.js + Express** or **FastAPI** (Python)
- **PostgreSQL** database
- **Redis** (caching + sessions)
- **AWS S3** or **Cloudflare R2** (file storage)

**Video:**
- **WebRTC** (custom implementation)
- **Agora** or **Twilio Video** SDK
- Cost: $0.99-2.99 per 1,000 minutes

**Payments:**
- Direct integration with Saudi payment gateways

**Hosting:**
- **AWS** or **DigitalOcean**
- **CloudFlare** CDN

**Total cost: $100-300/month + development time**

---

### **MY RECOMMENDATION: OPTION 1 (Supabase + Next.js)**

**Why:**
✅ Fast to build (2-3 weeks vs 6 weeks)
✅ Low cost ($50-150/month)
✅ Scalable (can handle 10K+ users)
✅ Auth + DB + Storage + Real-time included
✅ Focus on features, not infrastructure
✅ Easy to find developers (Next.js + Supabase popular)

**Trade-offs:**
❌ Vendor lock-in (Supabase)
❌ Less customization than custom build
❌ Monthly cost grows with usage (but still cheap)

**For MVP validation, these trade-offs are worth it.**

---

## IMPLEMENTATION PHASES

### **PHASE 1: WEEK 1-2 (Core Foundation)** ✅ COMPLETED

**Patient Portal:**
- ✅ Homepage (hero, how it works, featured doctors, trust indicators)
- ✅ Doctor listing page (filters, search, cards)
- ✅ Doctor profile page (about, qualifications, reviews, booking CTA)
- ✅ Simple booking flow (select time → info → payment → confirmation)
- ✅ 3 sample health articles (PCOS, fertility, pregnancy)
- ✅ Patient dashboard with appointments
- ✅ Authentication flow (login/signup) with error handling

**Doctor Portal:**
- ✅ Registration form (4 steps)
- ✅ Login / authentication with self-healing logic
- ✅ Basic dashboard (overview stats)
- ✅ Profile management
- ✅ Schedule management (weekly calendar) - **DB Connected**

**Admin:**
- ✅ Approve/reject doctor applications
- ✅ View all appointments
- ✅ Basic analytics

**Tech Setup:**
- ✅ Next.js project initialized
- ✅ Supabase configured (database schema, auth)
- ✅ Tailwind + Shadcn/UI components
- ✅ Arabic/English language toggle
- ✅ Database triggers with self-healing logic
- ✅ Idempotent migration scripts

**Deliverable:** Working MVP you can show to doctors and patients ✅

---

### **PHASE 2: WEEK 3 (Video Consultation)** ✅ COMPLETED

**Video Integration:**
- ✅ Jitsi Meet integrated (replaced Daily.co/Whereby)
- ✅ Waiting room for patients
- ✅ Consultation interface (video, chat, notes)
- ✅ Post-consultation summary with feedback form
- ✅ Recording capability (with consent)
- ✅ Secure authorization checks (only patient/doctor can join)

**Consultation Flow:**
- ✅ Patient gets link 15 min before
- ✅ Doctor joins from dashboard
- ✅ Both can see timer, chat, share files
- ✅ Doctor can write notes visible to patient
- ✅ Auto-end after allotted time
- ✅ Post-call feedback and rating system

**Deliverable:** End-to-end consultation flow working ✅

---

### **PHASE 2.5: DOCTOR PORTAL ENHANCEMENTS** ✅ COMPLETED

**Dashboard Features:**
- ✅ Schedule Management (DB-connected with save/load)
- ✅ Earnings Dashboard
  - Total earnings display
  - Paid vs pending breakdown
  - Transaction history table
  - Real-time calculation from database
- ✅ Reviews Dashboard
  - Average rating calculation
  - Review list with patient details
  - Star rating display
- ✅ Appointments Management
  - Full appointment history
  - Status badges (scheduled/completed/cancelled)
  - Direct "Join Video Call" links
- ✅ Patients List
  - All patients with appointment history
  - Contact information
  - Last visit tracking
- ✅ Settings Page
  - Update profile information
  - Change consultation price
  - Edit bio
  - Form validation with toast notifications
- ✅ Logout functionality integrated

**Database Improvements:**
- ✅ Robust database triggers with defaults
- ✅ Self-healing authentication logic
- ✅ Idempotent migration scripts (safe to re-run)
- ✅ Proper RLS policies

**Deliverable:** Complete doctor portal with all management features ✅

---

### **PHASE 3: WEEK 4 (Payments + Polish)** ⏳ IN PROGRESS

**Payment Integration:**
- ⏳ Stripe for international cards
- ⏳ Moyasar/Tap/HyperPay for Mada + local methods
- ⏳ Test mode for validation phase
- ⏳ Automatic payouts to doctors (weekly)

**Polish:**
- ⏳ Email notifications (booking confirmation, reminders)
- ⏳ SMS reminders (via Twilio)
- ⏳ WhatsApp integration (optional - can add later)
- ✅ Mobile responsive (critical!)
- ✅ Arabic fonts and RTL layout perfected
- ✅ Color scheme updated (teal/emerald instead of purple)
- ✅ UI consistency across all pages
- ✅ Smooth animations and transitions

**Testing:**
- ✅ Comprehensive testing checklist created
- ✅ Test scenarios documented
- ⏳ 5 test bookings end-to-end
- ⏳ Doctor feedback on interface
- ⏳ Patient (internal team) testing
- ⏳ Payment testing (real charges in test mode)

**Content:**
- ✅ 20 health articles created and ready to seed

**Deliverable:** Production-ready MVP (pending payment integration)

---

### **PHASE 4: POST-LAUNCH (Month 2+)**

**Add after MVP validation:**
- Patient medical records system
- Prescription writing + e-prescription
- Insurance integration
- Mobile apps (React Native)
- AI symptom checker
- US specialist tier integration
- WhatsApp chatbot
- Referral program
- Loyalty program
- Advanced analytics

**Don't build these in MVP - validate first!**

---

## AI PROMPTS FOR BUILDING

I'll create these prompts in the next section...
