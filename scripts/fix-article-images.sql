-- Fix article images to use existing image files
-- Run this in Supabase SQL Editor

-- Update articles to use existing images based on their category/topic

-- Articles about breastfeeding
UPDATE articles 
SET featured_image_url = '/images/articles/breastfeeding-guide.png'
WHERE (title_ar LIKE '%الرضاعة%' OR title_en LIKE '%Breastfeeding%' OR title_ar LIKE '%التغذية%الرضاعة%')
  AND featured_image_url NOT LIKE '%breastfeeding-guide.png';

-- Articles about anxiety/mental health for new moms
UPDATE articles 
SET featured_image_url = '/images/articles/mental-health-pregnancy.png'
WHERE (title_ar LIKE '%القلق%' OR title_ar LIKE '%الصحة النفسية%' OR title_en LIKE '%Anxiety%' OR title_en LIKE '%Mental Health%')
  AND featured_image_url NOT LIKE '%mental-health-pregnancy.png';

-- Articles about newborn care
UPDATE articles 
SET featured_image_url = '/images/articles/pregnancy-first-trimester-guide.png'
WHERE (title_ar LIKE '%المولود%' OR title_ar LIKE '%العناية بالطفل%' OR title_en LIKE '%Newborn%' OR title_en LIKE '%Baby Care%')
  AND featured_image_url NOT LIKE '%pregnancy%';

-- Articles about postpartum hair loss
UPDATE articles 
SET featured_image_url = '/images/articles/prenatal-vitamins-guide.png'
WHERE (title_ar LIKE '%تساقط الشعر%بعد الولادة%' OR title_en LIKE '%Postpartum Hair%')
  AND featured_image_url NOT LIKE '%prenatal%';

-- Articles about sleep
UPDATE articles 
SET featured_image_url = '/images/articles/mental-health-pregnancy.png'
WHERE (title_ar LIKE '%نوم%' OR title_en LIKE '%Sleep%')
  AND featured_image_url NOT LIKE '%mental-health%';

-- Articles about pap smear
UPDATE articles 
SET featured_image_url = '/images/articles/endometriosis-symptoms-treatment.png'
WHERE (title_ar LIKE '%مسحة عنق الرحم%' OR title_en LIKE '%Pap Smear%')
  AND featured_image_url NOT LIKE '%endometriosis%';

-- Articles about water/hydration
UPDATE articles 
SET featured_image_url = '/images/articles/prenatal-vitamins-guide.png'
WHERE (title_ar LIKE '%شرب الماء%' OR title_en LIKE '%Drinking Water%' OR title_en LIKE '%Hydration%')
  AND featured_image_url NOT LIKE '%prenatal%';

-- Articles about Vitamin D
UPDATE articles 
SET featured_image_url = '/images/articles/prenatal-vitamins-guide.png'
WHERE (title_ar LIKE '%فيتامين د%' OR title_en LIKE '%Vitamin D%')
  AND featured_image_url NOT LIKE '%prenatal%';

-- Articles about Kegel exercises
UPDATE articles 
SET featured_image_url = '/images/articles/menstrual-cycle-irregularities.png'
WHERE (title_ar LIKE '%كيجل%' OR title_en LIKE '%Kegel%')
  AND featured_image_url NOT LIKE '%menstrual%';

-- Articles about folic acid
UPDATE articles 
SET featured_image_url = '/images/articles/prenatal-vitamins-guide.png'
WHERE (title_ar LIKE '%حمض الفوليك%' OR title_en LIKE '%Folic Acid%')
  AND featured_image_url NOT LIKE '%prenatal%';

-- Show updated articles
SELECT slug, title_ar, title_en, featured_image_url 
FROM articles 
WHERE status = 'published'
ORDER BY published_at DESC;
