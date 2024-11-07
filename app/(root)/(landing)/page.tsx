import { Fira_Code } from "next/font/google";
import CTA from "./_components/cta";
import FAQS from "./_components/faqs";
import HeroSection from "./_components/hero";
import HowItWorks from "./_components/how-it-works";
import WhyUs from "./_components/why-us";

const font = Fira_Code({ subsets: ["latin"] });

const LandingPage = () => {
  return (
    <>
      <HeroSection />
      <HowItWorks />
      <WhyUs />
      <FAQS />
      <CTA />
    </>
  );
};

export default LandingPage;
