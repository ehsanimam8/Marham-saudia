import Hero from '@/components/patient/home/Hero';
import TrustIndicators from '@/components/patient/home/TrustIndicators';
import HowItWorks from '@/components/patient/home/HowItWorks';
import SpecialtiesGrid from '@/components/patient/home/SpecialtiesGrid';
import FeaturedDoctors from '@/components/patient/home/FeaturedDoctors';
import ArticlesPreview from '@/components/patient/home/ArticlesPreview';
import WhyMarham from '@/components/patient/home/WhyMarham';
import Footer from '@/components/patient/home/Footer';
import OnboardingBanner from '@/components/onboarding/v5/OnboardingBanner';

export default function Home() {
  return (
    <main className="min-h-screen bg-white" suppressHydrationWarning>
      <Hero />
      <div className="container mx-auto px-4 mt-8 relative z-20 mb-12 min-h-[200px]">
        <OnboardingBanner className="rounded-3xl shadow-2xl w-full" />
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
