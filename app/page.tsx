import Hero from '@/components/patient/home/Hero';
import TrustIndicators from '@/components/patient/home/TrustIndicators';
import HowItWorks from '@/components/patient/home/HowItWorks';
import SpecialtiesGrid from '@/components/patient/home/SpecialtiesGrid';
import FeaturedDoctors from '@/components/patient/home/FeaturedDoctors';
import ArticlesPreview from '@/components/patient/home/ArticlesPreview';
import WhyMarham from '@/components/patient/home/WhyMarham';
import Footer from '@/components/patient/home/Footer';
import OnboardingBanner from '@/components/onboarding/v5/OnboardingBanner';

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <main className="min-h-screen bg-white" suppressHydrationWarning>
      <div className="bg-red-500 text-white text-xs p-1 text-center font-mono">v0.1.2 - DEBUG BANNER</div>
      <Hero />
      <div className="w-full bg-teal-600 my-8">
        <OnboardingBanner className="rounded-3xl shadow-2xl w-full max-w-7xl mx-auto" />
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
