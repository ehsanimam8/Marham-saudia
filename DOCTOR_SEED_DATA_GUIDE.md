# Doctor Seed Data - Summary & Instructions

## ✅ Fixed Migration Created

**File**: `supabase/migrations/20241204000003_add_more_doctors.sql`

This migration adds **20 NEW doctors** (4 per specialty) to your existing 5 doctors, for a total of **25 doctors**.

### Coverage Per Specialty:
- **OB/GYN**: 5 doctors total (1 existing + 4 new)
- **Fertility**: 5 doctors total (1 existing + 4 new)  
- **Maternal-Fetal Medicine**: 5 doctors total (1 existing + 4 new)
- **Mental Health**: 5 doctors total (1 existing + 4 new)
- **Endocrinology**: 5 doctors total (1 existing + 4 new)

## How to Apply the Migration

### Step 1: Go to Supabase Dashboard
1. Visit [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **SQL Editor** in the left sidebar

### Step 2: Run the Migration
1. Click **New Query**
2. Copy the entire content from: `supabase/migrations/20241204000003_add_more_doctors.sql`
3. Paste into the SQL editor
4. Click **Run** (or press Cmd/Ctrl + Enter)

### Step 3: Verify
Run this query to check:
```sql
SELECT specialty, COUNT(*) as doctor_count 
FROM doctors 
WHERE status = 'approved'
GROUP BY specialty
ORDER BY specialty;
```

Expected result:
| specialty | doctor_count |
|-----------|-------------|
| Endocrinology | 5 |
| Fertility | 5 |
| Maternal-Fetal Medicine | 5 |
| Mental Health | 5 |
| OB/GYN | 5 |

## Profile Photos
All 25 doctors use the existing 5 doctor images, rotated:
- `/images/doctors/doctor_noura_alrashid_1764849899936.png`
- `/images/doctors/doctor_sara_alahmed_1764849915248.png`
- `/images/doctors/doctor_laila_alomari_1764849928738.png`
- `/images/doctors/doctor_amal_alharbi_1764849951730.png`
- `/images/doctors/doctor_haifa_alsulaiman_1764849970279.png`

## Blog Images (Pending)
Due to image generation quota limits, the 3 blog article images need to be created. 

### Temporary Solution:
The ArticlesPreview component currently shows placeholder emojis (📄). You can:

**Option 1**: Wait ~7 minutes and I can generate the images
**Option 2**: Use free images from sites like:
- Unsplash.com
- Pexels.com  
- Pixabay.com

Search for:
1. "PCOS medical consultation"
2. "Pregnancy test positive"
3. "Pregnant woman healthy lifestyle"

Save images to: `/public/images/articles/` and update paths in `components/patient/home/ArticlesPreview.tsx`

## Next Steps After Migration
1. ✅ Run the SQL migration
2. ✅ Verify 25 doctors are created
3. ⏳ Add blog images (when quota resets or manually)
4. ✅ Test doctor filtering by specialty
5. ✅ Test booking flow

## Troubleshooting

### If you get duplicate key error:
The migration uses `ON CONFLICT DO NOTHING` so it's safe to run even if some records exist.

### If no doctors show up:
Check that you ran the original migration first:
```sql
SELECT COUNT(*) FROM doctors;
```
Should return 5 (from original seed) before running the new migration.
