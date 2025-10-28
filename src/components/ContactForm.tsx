import { useState } from "react";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ContactForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get Google Sheets URL from environment variable
      const googleSheetsUrl = import.meta.env.VITE_GOOGLE_SHEETS_URL;

      if (!googleSheetsUrl) {
        throw new Error("Google Sheets URL not configured");
      }

      // Send data to Google Sheets
      await fetch(googleSheetsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        mode: 'no-cors', // Required for Google Apps Script
      });

      // Note: no-cors mode doesn't allow reading the response,
      // but the request will still be processed by Google Sheets
      toast({
        title: "تم إرسال طلبك بنجاح!",
        description: "سنتواصل معك في أقرب وقت ممكن",
      });

      // Reset form
      setFormData({ name: "", email: "", phone: "", service: "", message: "" });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "حدث خطأ",
        description: "يرجى المحاولة مرة أخرى أو التواصل معنا مباشرة",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section id="contact-form" className="py-24 bg-gradient-to-br from-muted/30 via-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            ابدأ رحلتك معنا اليوم
          </h2>
          <p className="text-xl text-muted-foreground">
            املأ النموذج وسيتواصل معك فريقنا خلال 24 ساعة
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 max-w-7xl mx-auto">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6 animate-fade-in">
            <Card className="p-8 bg-gradient-to-br from-primary via-secondary to-accent text-white border-none shadow-large">
              <h3 className="text-2xl font-bold mb-8">معلومات التواصل</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-all">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm opacity-80 mb-1">اتصل بنا</div>
                    <a href="tel:+212764724608" className="text-lg font-semibold hover:text-accent transition-colors">
                      +212 764 724 608
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-all">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm opacity-80 mb-1">البريد الإلكتروني</div>
                    <a href="mailto:info@connectjobworld.com" className="text-lg font-semibold hover:text-accent transition-colors">
                      info@connectjobworld.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-all">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm opacity-80 mb-1">العنوان</div>
                    <div className="text-lg font-semibold">
                      المغرب، الدار البيضاء
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/20">
                <p className="text-sm opacity-90 leading-relaxed">
                  نحن متاحون من السبت إلى الخميس
                  <br />
                  من 9:00 صباحاً حتى 6:00 مساءً
                </p>
              </div>
            </Card>

            {/* WhatsApp Card */}
            <Card className="p-6 bg-[#25D366] text-white border-none shadow-medium hover:shadow-large transition-all duration-300 hover:scale-105 cursor-pointer animate-pulse-glow">
              <a
                href="https://wa.me/212764724608"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4"
              >
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Phone className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-lg font-bold">تواصل عبر واتساب</div>
                  <div className="text-sm opacity-90">رد فوري على استفساراتك</div>
                </div>
              </a>
            </Card>
          </div>

          {/* Form */}
          <Card className="lg:col-span-3 p-8 shadow-large border-border animate-fade-in-up">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">الاسم الكامل *</label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="أدخل اسمك الكامل"
                    className="h-12 border-border focus:border-primary transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">رقم الهاتف *</label>
                  <Input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="+212 XXX XXX XXX"
                    className="h-12 border-border focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">البريد الإلكتروني *</label>
                <Input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="example@email.com"
                  className="h-12 border-border focus:border-primary transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">الخدمة المطلوبة *</label>
                <Select required value={formData.service} onValueChange={(value) => handleChange("service", value)}>
                  <SelectTrigger className="h-12 border-border">
                    <SelectValue placeholder="اختر الخدمة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dv-lottery">القرعة الأمريكية</SelectItem>
                    <SelectItem value="canada">الهجرة إلى كندا</SelectItem>
                    <SelectItem value="work-visa">تأشيرة عمل</SelectItem>
                    <SelectItem value="study">الدراسة في الخارج</SelectItem>
                    <SelectItem value="family">لم شمل العائلة</SelectItem>
                    <SelectItem value="other">خدمات أخرى</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">رسالتك</label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  placeholder="أخبرنا المزيد عن احتياجاتك..."
                  className="min-h-32 border-border focus:border-primary transition-colors resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 text-lg bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-primary text-white rounded-xl shadow-medium hover:shadow-large transition-all duration-300 hover:scale-[1.02] group"
              >
                {isSubmitting ? (
                  "جاري الإرسال..."
                ) : (
                  <>
                    إرسال الطلب
                    <Send className="mr-2 h-5 w-5 group-hover:-rotate-45 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
