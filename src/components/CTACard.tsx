import { MessageCircle, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CTACardProps {
  variant?: "default" | "compact";
}

const CTACard = ({ variant = "default" }: CTACardProps) => {
  const scrollToForm = () => {
    document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" });
  };

  if (variant === "compact") {
    return (
      <div dir="rtl" className="py-8 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <span className="text-foreground font-semibold">جاهز للبدء؟</span>
            <div className="flex gap-3">
              <a
                href="https://wa.me/212764724608"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 h-12 bg-[#25D366] text-white rounded-full font-semibold hover:bg-[#20BA5A] transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg whitespace-nowrap"
              >
                <MessageCircle className="w-5 h-5" />
                <span>واتساب</span>
              </a>
              <Button
                onClick={scrollToForm}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 h-12 bg-primary text-white rounded-full font-semibold hover:bg-primary-dark transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg whitespace-nowrap"
              >
                <FileText className="w-5 h-5" />
                <span>املأ النموذج</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section dir="rtl" className="py-12 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 border-2 border-primary/20 shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-right">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                لنبدأ رحلتك اليوم!
              </h3>
              <p className="text-muted-foreground">
                تواصل معنا الآن عبر واتساب أو املأ النموذج للحصول على استشارة مجانية
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://wa.me/212764724608"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 h-14 bg-[#25D366] text-white rounded-full font-semibold hover:bg-[#20BA5A] transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap"
              >
                <MessageCircle className="w-5 h-5" />
                <span>تواصل عبر واتساب</span>
              </a>
              <Button
                onClick={scrollToForm}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 h-14 bg-primary text-white rounded-full font-semibold hover:bg-primary-dark transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap"
              >
                <FileText className="w-5 h-5" />
                <span>املأ النموذج</span>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default CTACard;
