import Hero from "@/components/Hero";
import Services from "@/components/Services";
import WhyChooseUs from "@/components/WhyChooseUs";
import Flyers from "@/components/Flyers";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Services />
      <WhyChooseUs />
      <Flyers />
      <ContactForm />
      <Footer />
    </div>
  );
};

export default Index;
