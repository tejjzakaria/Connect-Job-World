import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Process from "@/components/Process";
import WhyChooseUs from "@/components/WhyChooseUs";
import Countries from "@/components/Countries";
import CountryComparison from "@/components/CountryComparison";
import DocumentChecklist from "@/components/DocumentChecklist";
import Flyers from "@/components/Flyers";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import CTACard from "@/components/CTACard";
import ScrollToTop from "@/components/ScrollToTop";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Services />
      <CTACard variant="compact" />
      <Process />
      <CTACard variant="compact" />
      <WhyChooseUs />
      <CTACard />
      <Countries />
      <CTACard variant="compact" />
      <CountryComparison />
      <CTACard variant="compact" />
      <DocumentChecklist />
      <CTACard variant="compact" />
      <Flyers />
      <CTACard variant="compact" />
      <Testimonials />
      <CTACard />
      <FAQ />
      <ContactForm />
      <Footer />
      <ScrollToTop />
      <LanguageSwitcher />
    </div>
  );
};

export default Index;
