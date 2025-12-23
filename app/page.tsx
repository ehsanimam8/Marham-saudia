import Hero from '@/components/patient/home/Hero';
import TrustIndicators from '@/components/patient/home/TrustIndicators';
import HowItWorks from '@/components/patient/home/HowItWorks';
import SpecialtiesGrid from '@/components/patient/home/SpecialtiesGrid';
import FeaturedDoctors from '@/components/patient/home/FeaturedDoctors';
import ArticlesPreview from '@/components/patient/home/ArticlesPreview';
import WhyMarham from '@/components/patient/home/WhyMarham';
import Footer from '@/components/patient/home/Footer';
import HomeBanner from '@/components/onboarding/v5/HomeBanner';

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <main className="min-h-screen bg-white" suppressHydrationWarning>
      <Hero />
      <div className="w-full bg-teal-600 my-8">
        <HomeBanner className="rounded-3xl shadow-2xl w-full max-w-7xl mx-auto" />
      </div>
      <TrustIndicators />
      <HowItWorks />
      <SpecialtiesGrid />
      <FeaturedDoctors />
      <WhyMarham />
      <ArticlesPreview />
      <Footer />
    </main>
  );
}
