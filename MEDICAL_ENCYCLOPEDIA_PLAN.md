# Medical Encyclopedia & Symptom Checker Plan
Based on analysis of Altibbi and Marham Saudi requirements.

## 1. Overview
We will create a **Medical Encyclopedia** section (موسوعة مرهم) that serves two purposes:
1.  **SEO & Traffic**: Attract users searching for symptoms (e.g., "headache", "pcos symptoms").
2.  **Conversion**: Link these conditions directly to relevant doctors.

## 2. Data Structure Analysis (from Altibbi)
Altibbi organizes content into:
*   **Diseases (الأمراض)**: Detailed pages with Definition, Causes, Symptoms, Diagnosis, Treatment.
*   **Symptoms (الأعراض)**: Pages describing a symptom and linking to potential diseases.

## 3. Proposed Schema
We need to extend our Supabase schema to support this structured data.

### 3.1 New Tables
**`medical_conditions`**
*   `id`: UUID
*   `slug`: Text (Unique, for URL: `/conditions/diabetes`)
*   `name_ar`: Text ("السكري")
*   `name_en`: Text ("Diabetes")
*   `overview_ar`: Text (HTML/Markdown)
*   `symptoms_ar`: Text (HTML/Markdown)
*   `treatment_ar`: Text (HTML/Markdown)
*   `specialty`: Text (Links to `doctors.specialty`)

**`symptoms`**
*   `id`: UUID
*   `slug`: Text (Unique, for URL: `/symptoms/headache`)
*   `name_ar`: Text ("صداع")
*   `name_en`: Text ("Headache")
*   `description_ar`: Text

**`condition_symptoms`** (Many-to-Many)
*   `condition_id`: UUID
*   `symptom_id`: UUID

## 4. Integration Strategy
*   **Doctor Matching**: When a user views "PCOS" (Disease), we automatically show doctors with `specialty = 'OB/GYN'` or `sub_specialties` containing 'PCOS'.
*   **Symptom Checker**: A simple UI where users select symptoms -> we query `condition_symptoms` -> show possible conditions -> show doctors.

## 5. Next Steps
1.  Create the database migration for these new tables.
2.  Seed initial data (e.g., 5 common conditions like Diabetes, PCOS, Hypertension).
3.  Build the frontend pages:
    *   `/encyclopedia`: Index of conditions.
    *   `/encyclopedia/[slug]`: Disease detail page with "Book a Doctor" CTA.
    *   `/symptoms`: Index of symptoms.
    *   `/symptoms/[slug]`: Symptom detail page linking to conditions.

## 6. Sample Data (To be seeded)
**Condition: Polycystic Ovary Syndrome (PCOS)**
*   **slug**: `pcos`
*   **name_ar**: تكيس المبايض
*   **symptoms**: irregular periods, weight gain, acne.
*   **Linked Doctors**: Dr. Noura Al-Rashid.

**Condition: Diabetes Type 2**
*   **slug**: `diabetes-type-2`
*   **name_ar**: السكري من النوع الثاني
*   **symptoms**: thirst, frequent urination, fatigue.
*   **Linked Doctors**: Dr. Haifa Al-Sulaiman.
