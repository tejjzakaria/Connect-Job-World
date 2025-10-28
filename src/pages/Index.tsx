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

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Services />
      <Process />
      <WhyChooseUs />
      <Countries />
      <CountryComparison />
      <DocumentChecklist />
      <Flyers />
      <Testimonials />
      <FAQ />
      <ContactForm />
      <Footer />
    </div>
  );
};

export default Index;
