const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixArticleImages() {
    console.log('Fixing article images...\n');

    // Map of article topics to existing images
    const imageMapping = [
        {
            condition: (title_ar, title_en) =>
                title_ar?.includes('الرضاعة') || title_en?.includes('Breastfeeding') || title_ar?.includes('التغذية') && title_ar?.includes('الرضاعة'),
            image: '/images/articles/breastfeeding-guide.png',
            topic: 'Breastfeeding'
        },
        {
            condition: (title_ar, title_en) =>
                title_ar?.includes('القلق') || title_ar?.includes('الصحة النفسية') || title_en?.includes('Anxiety') || title_en?.includes('Mental Health'),
            image: '/images/articles/mental-health-pregnancy.png',
            topic: 'Mental Health'
        },
        {
            condition: (title_ar, title_en) =>
                title_ar?.includes('المولود') || title_ar?.includes('العناية بالطفل') || title_en?.includes('Newborn') || title_en?.includes('Baby Care'),
            image: '/images/articles/pregnancy-first-trimester-guide.png',
            topic: 'Newborn Care'
        },
        {
            condition: (title_ar, title_en) =>
                (title_ar?.includes('تساقط الشعر') && title_ar?.includes('بعد الولادة')) || title_en?.includes('Postpartum Hair'),
            image: '/images/articles/prenatal-vitamins-guide.png',
            topic: 'Postpartum Hair Loss'
        },
        {
            condition: (title_ar, title_en) =>
                title_ar?.includes('نوم') || title_en?.includes('Sleep'),
            image: '/images/articles/mental-health-pregnancy.png',
            topic: 'Sleep'
        },
        {
            condition: (title_ar, title_en) =>
                title_ar?.includes('مسحة عنق الرحم') || title_en?.includes('Pap Smear'),
            image: '/images/articles/endometriosis-symptoms-treatment.png',
            topic: 'Pap Smear'
        },
        {
            condition: (title_ar, title_en) =>
                title_ar?.includes('شرب الماء') || title_en?.includes('Drinking Water') || title_en?.includes('Hydration'),
            image: '/images/articles/prenatal-vitamins-guide.png',
            topic: 'Water/Hydration'
        },
        {
            condition: (title_ar, title_en) =>
                title_ar?.includes('فيتامين د') || title_en?.includes('Vitamin D'),
            image: '/images/articles/prenatal-vitamins-guide.png',
            topic: 'Vitamin D'
        },
        {
            condition: (title_ar, title_en) =>
                title_ar?.includes('كيجل') || title_en?.includes('Kegel'),
            image: '/images/articles/menstrual-cycle-irregularities.png',
            topic: 'Kegel Exercises'
        },
        {
            condition: (title_ar, title_en) =>
                title_ar?.includes('حمض الفوليك') || title_en?.includes('Folic Acid'),
            image: '/images/articles/prenatal-vitamins-guide.png',
            topic: 'Folic Acid'
        },
        {
            condition: (title_ar, title_en) =>
                title_ar?.includes('حب الشباب') || title_en?.includes('Acne'),
            image: '/images/articles/skincare-acne.png',
            topic: 'Acne'
        },
        {
            condition: (title_ar, title_en) =>
                title_ar?.includes('تكيس') || title_en?.includes('PCOS'),
            image: '/images/articles/pcos-symptoms-treatment.png',
            topic: 'PCOS'
        }
    ];

    // Get all published articles
    const { data: articles, error } = await supabase
        .from('articles')
        .select('id, slug, title_ar, title_en, featured_image_url')
        .eq('status', 'published');

    if (error) {
        console.error('Error fetching articles:', error);
        return;
    }

    console.log(`Found ${articles.length} published articles\n`);

    let updatedCount = 0;

    for (const article of articles) {
        // Check if image path is broken (contains unsplash or doesn't exist)
        const needsUpdate =
            !article.featured_image_url ||
            article.featured_image_url.includes('unsplash') ||
            article.featured_image_url.includes('400') ||
            article.featured_image_url.includes('404');

        if (needsUpdate) {
            // Find matching image
            const match = imageMapping.find(m =>
                m.condition(article.title_ar, article.title_en)
            );

            if (match) {
                const { error: updateError } = await supabase
                    .from('articles')
                    .update({ featured_image_url: match.image })
                    .eq('id', article.id);

                if (updateError) {
                    console.error(`Error updating ${article.slug}:`, updateError);
                } else {
                    console.log(`✅ Updated ${article.slug} (${match.topic}) -> ${match.image}`);
                    updatedCount++;
                }
            } else {
                console.log(`⚠️  No match found for: ${article.title_en}`);
            }
        }
    }

    console.log(`\n✅ Updated ${updatedCount} articles`);
}

fixArticleImages().catch(console.error);
