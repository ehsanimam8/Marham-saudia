import { SocialProofData } from './analysis-types';

export function getSocialProofData(
    category: 'mental_health' | 'beauty' | 'medical',
    condition: string
): SocialProofData {
    const mentalHealthData: Record<string, SocialProofData> = {
        anxiety: {
            caseCount: 234,
            averageRating: 4.9,
            successRate: 87,
            testimonial: {
                text_en: "Dr. Amal helped me manage my anxiety with practical techniques. I feel so much better now and can handle daily stress.",
                text_ar: "د. أمل ساعدتني في إدارة القلق بتقنيات عملية. أشعر بتحسن كبير الآن وأستطيع التعامل مع الضغوط اليومية.",
                patientName: "سارة",
                patientAge: 28,
                patientCity: "الرياض"
            }
        },
        depression: {
            caseCount: 189,
            averageRating: 4.8,
            successRate: 82,
            testimonial: {
                text_en: "I was struggling for months. The therapy sessions changed my life completely. I'm grateful I took the first step.",
                text_ar: "كنت أعاني لشهور. جلسات العلاج غيرت حياتي تماماً. ممتنة أني أخذت الخطوة الأولى.",
                patientName: "منى",
                patientAge: 32,
                patientCity: "جدة"
            }
        },
        stress: {
            caseCount: 312,
            averageRating: 4.9,
            successRate: 91,
            testimonial: {
                text_en: "Learning stress management techniques was life-changing. I sleep better and feel more in control.",
                text_ar: "تعلم تقنيات إدارة التوتر كان تغييراً جذرياً. أنام بشكل أفضل وأشعر بسيطرة أكبر.",
                patientName: "هند",
                patientAge: 35,
                patientCity: "الدمام"
            }
        }
    }

    const beautyData: Record<string, SocialProofData> = {
        acne: {
            caseCount: 456,
            averageRating: 4.9,
            successRate: 88,
            testimonial: {
                text_en: "My skin cleared up in just 2 months! Dr. Laila's treatment plan was perfect for me.",
                text_ar: "بشرتي تحسنت في شهرين فقط! خطة العلاج من د. ليلى كانت مثالية لي.",
                patientName: "نور",
                patientAge: 24,
                patientCity: "الرياض"
            }
        },
        pigmentation: {
            caseCount: 298,
            averageRating: 4.8,
            successRate: 85,
            testimonial: {
                text_en: "The dark spots are almost gone! So happy with the results and professional care.",
                text_ar: "البقع الداكنة اختفت تقريباً! سعيدة جداً بالنتائج والرعاية المهنية.",
                patientName: "رهف",
                patientAge: 29,
                patientCity: "مكة"
            }
        },
        hair_loss: {
            caseCount: 267,
            averageRating: 4.7,
            successRate: 79,
            testimonial: {
                text_en: "I can see new hair growth after 3 months. The treatment really works!",
                text_ar: "أرى نمو شعر جديد بعد 3 شهور. العلاج فعّال حقاً!",
                patientName: "ريم",
                patientAge: 31,
                patientCity: "جدة"
            }
        }
    }

    const medicalData: Record<string, SocialProofData> = {
        pcos: {
            caseCount: 567,
            averageRating: 4.9,
            successRate: 86,
            testimonial: {
                text_en: "My cycle is finally regular after 3 months of treatment. Dr. Sara understood my concerns completely.",
                text_ar: "دورتي أصبحت منتظمة أخيراً بعد 3 شهور من العلاج. د. سارة فهمت مخاوفي تماماً.",
                patientName: "عبير",
                patientAge: 27,
                patientCity: "الرياض"
            }
        },
        irregular_periods: {
            caseCount: 623,
            averageRating: 4.8,
            successRate: 89,
            testimonial: {
                text_en: "After years of irregular cycles, I finally found the right treatment. So relieved!",
                text_ar: "بعد سنوات من عدم الانتظام، وجدت أخيراً العلاج المناسب. مرتاحة جداً!",
                patientName: "لمى",
                patientAge: 25,
                patientCity: "الدمام"
            }
        },
        thyroid: {
            caseCount: 389,
            averageRating: 4.9,
            successRate: 92,
            testimonial: {
                text_en: "My energy levels are back to normal! The medication adjustment made all the difference.",
                text_ar: "مستوى طاقتي عاد طبيعياً! تعديل الدواء أحدث فرقاً كبيراً.",
                patientName: "دانة",
                patientAge: 33,
                patientCity: "جدة"
            }
        },
        fertility: {
            caseCount: 412,
            averageRating: 4.9,
            successRate: 71,
            testimonial: {
                text_en: "Dr. Noura gave me hope and a clear plan. We're taking it step by step.",
                text_ar: "د. نورا أعطتني أملاً وخطة واضحة. نمضي خطوة بخطوة.",
                patientName: "أمل",
                patientAge: 34,
                patientCity: "الرياض"
            }
        }
    }

    let dataSet: Record<string, SocialProofData>;
    switch (category) {
        case 'mental_health':
            dataSet = mentalHealthData;
            break;
        case 'beauty':
            dataSet = beautyData;
            break;
        case 'medical':
            dataSet = medicalData;
            break;
        default:
            dataSet = medicalData;
    }

    // Find exact match or use default
    const conditionKey = condition.toLowerCase().replace(/\s+/g, '_');
    return dataSet[conditionKey] || Object.values(dataSet)[0];
}
