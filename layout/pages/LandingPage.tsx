import Navbar from "@/layout/ui/Navbar";
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
import TrustSafety from "@/layout/sections/home/TrustSafety";
import AboutCompany from "@/layout/sections/home/AboutCompany";
import Footer from "../ui/Footer";

export default function Home() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');

        * {
          font-family: 'DM Sans', sans-serif;
        }

        .landing-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 32px;
        }

        @media (min-width: 1440px) {
          .landing-container {
            max-width: 1400px;
            padding: 0 48px;
          }
        }

        @media (max-width: 768px) {
          .landing-container {
            padding: 0 20px;
          }
        }

        /* Section animations */
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-section {
          animation: fadeUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        /* Smooth scroll behavior */
        html {
          scroll-behavior: smooth;
        }

        /* Section spacing - increased for better breathing */
        .section-spacing {
          padding: 100px 0;
        }

        @media (max-width: 768px) {
          .section-spacing {
            padding: 64px 0;
          }
        }

        /* Background gradients */
        .bg-gradient-light {
          background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
        }

        /* Hover card effects */
        .hover-lift {
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
          border-color: rgba(249, 115, 22, 0.2);
        }
      `}</style>

      <main className="min-h-screen bg-white">
        <Navbar />
        
        {/* Offset for fixed navbar */}
        <div style={{ paddingTop: '64px' }}>
          <HeroSection />
          
          <div className="landing-container">
            <div className="animate-section">
              <AboutChallenge />
            </div>
            <HowItWorks />
            <RewardsIncentives />
            <RulesConditions />
            <WhoCanParticipate />
            <ExperiencePreview />
            <WhyTakeChallenge />
            <Testimonials />
            <FAQ />
            <TrustSafety />
            <AboutCompany />
          </div>
          
          <Footer />
        </div>
      </main>
    </>
  );
}