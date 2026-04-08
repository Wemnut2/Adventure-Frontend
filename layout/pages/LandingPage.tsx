// app/page.tsx
import HeroSection from "@/layout/sections/home/HeroSection";
import AboutChallenge from "@/layout/sections/home/AboutChallenge";
import HowItWorks from "@/layout/sections/home/HowItWorks";
import RewardsIncentives from "@/layout/sections/home/RewardsIncentives";
import RulesConditions from "@/layout/sections/home/RulesConditions";
import WhoCanParticipate from "@/layout/sections/home/WhoCanParticipate";
import ExperiencePreview from "@/layout/sections/home/ExperiencePreview";
import WhyTakeChallenge from "@/layout/sections/home/WhyTakeChallenge";
import Testimonials from "@/layout/sections/home/Testimonials";
import FAQ from "@/layout/sections/home/FAQ";
import ApplicationSection from "@/layout/sections/home/ApplicationSection";
import TrustSafety from "@/layout/sections/home/TrustSafety";
import AboutCompany from "@/layout/sections/home/AboutCompany";
import Footer from "../ui/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      <AboutChallenge />
      <HowItWorks />
      <RewardsIncentives />
      <RulesConditions />
      <WhoCanParticipate />
      <ExperiencePreview />
      <WhyTakeChallenge />
      <Testimonials />
      <FAQ />
      <ApplicationSection />
      <TrustSafety />
      <AboutCompany />
      <Footer />
    </main>
  );
}