import React from "react";
import HeroSection from "@/components/landing/hero";
// import LeadGenerationForm from "@/components/landing/LeadGenerationForm";
import SupportBox from "@/components/landing/SupportBox";
// import TrustBadges from "@/components/landing/TrustBadges";
import AboutSection from "@/components/landing/about";
import CsrBanner from "@/components/landing/CsrBanner";
import ServicesSection from "@/components/landing/service";
// import HowItWorksSection from "@/componant/landing/howto";
import WhyChooseUsSection from "@/components/landing/whyWeBest";
import TestimonialsSection from "@/components/landing/testimonials";
import FaqSection from "@/components/landing/faq";

export const metadata = {
  title: 'Clezo | Premium Fashion',
  description: 'Shop the latest trends in Men, Women, Kids fashion and Accessories.',
};

export default function Home() {
  return (
    <React.Fragment>
      <HeroSection />
      <main role="main" className="relative">
        {/* <TrustBadges /> */}
        <AboutSection />
        <CsrBanner />
        {/* <LeadGenerationForm /> */}
        <SupportBox />
        <ServicesSection />
        {/* <HowItWorksSection /> */}
        <WhyChooseUsSection />
        <TestimonialsSection />
        <FaqSection />
      </main>
    </React.Fragment>
  );
}
