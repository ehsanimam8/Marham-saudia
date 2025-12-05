import Hero from '@/components/patient/home/Hero';
import TrustIndicators from '@/components/patient/home/TrustIndicators';
import HowItWorks from '@/components/patient/home/HowItWorks';
import SpecialtiesGrid from '@/components/patient/home/SpecialtiesGrid';
import FeaturedDoctors from '@/components/patient/home/FeaturedDoctors';
import ArticlesPreview from '@/components/patient/home/ArticlesPreview';
import WhyMarham from '@/components/patient/home/WhyMarham';
import Footer from '@/components/patient/home/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
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
