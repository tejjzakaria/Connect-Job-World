import { useState } from "react";
import { Phone, Mail, MapPin, Send, User, Briefcase, MessageSquare, Clock } from "lucide-react";
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
    <section dir="rtl" id="contact-form" className="py-24 bg-gradient-to-br from-primary/5 via-background to-accent/5 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "4s" }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "6s", animationDelay: "1s" }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <Send className="w-5 h-5 text-primary" />
            <span className="text-primary font-semibold">تواصل معنا</span>
          </div>
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
            <Card className="p-8 bg-gradient-to-br from-primary via-secondary to-accent text-white border-none shadow-2xl relative overflow-hidden">
              {/* Decorative pattern */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16" />

              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-8">معلومات التواصل</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-all">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm opacity-80 mb-1">اتصل بنا</div>
                    <a href="tel:+212764724608" className="text-lg font-semibold hover:text-accent transition-colors">
                      212764724608+
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
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-5 h-5" />
                  <span className="font-semibold">ساعات العمل</span>
                </div>
                <p className="text-sm opacity-90 leading-relaxed">
                  نحن متاحون من الاثنين إلى الجمعة
                  <br />
                  من 9:00 صباحاً حتى 6:00 مساءً
                </p>
              </div>
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
          <Card className="lg:col-span-3 p-8 md:p-10 shadow-2xl border-2 border-border hover:border-primary/30 transition-all duration-300 animate-fade-in-up bg-card/50 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3 group">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    الاسم الكامل *
                  </label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="أدخل اسمك الكامل"
                    className="h-14 border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 bg-background text-lg"
                  />
                </div>

                <div className="space-y-3 group">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" />
                    رقم الهاتف *
                  </label>
                  <Input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="0XXXXXXXXX"
                    className="h-14 border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 bg-background text-lg"
                  />
                </div>
              </div>

              <div className="space-y-3 group">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  البريد الإلكتروني (اختياري)
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="example@email.com"
                  className="h-14 border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 bg-background text-lg"
                />
              </div>

              <div className="space-y-3 group">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-primary" />
                  الخدمة المطلوبة *
                </label>
                <Select required value={formData.service} onValueChange={(value) => handleChange("service", value)}>
                  <SelectTrigger className="h-14 border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 bg-background text-lg">
                    <SelectValue placeholder="اختر الخدمة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dv-lottery">القرعة الأمريكية</SelectItem>
                    <SelectItem value="canada">الهجرة إلى كندا</SelectItem>
                    <SelectItem value="work-visa">تأشيرة عمل</SelectItem>
                    <SelectItem value="study">الدراسة في الخارج</SelectItem>
                    <SelectItem value="family">لم شمل العائلة</SelectItem>
                    <SelectItem value="sports">مواهب كرة القدم</SelectItem>
                    <SelectItem value="other">خدمات أخرى</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3 group">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  رسالتك
                </label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  placeholder="أخبرنا المزيد عن احتياجاتك..."
                  className="min-h-36 border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 resize-none bg-background text-lg"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-16 text-xl font-bold bg-gradient-to-r from-primary via-secondary to-accent hover:from-primary-dark hover:via-primary hover:to-secondary text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    جاري الإرسال...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    إرسال الطلب
                    <Send className="h-6 w-6 group-hover:-rotate-45 transition-transform duration-300" />
                  </span>
                )}
              </Button>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center justify-center gap-6 pt-6 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>استجابة خلال 24 ساعة</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>بياناتك آمنة ومحمية</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <span>استشارة مجانية</span>
                </div>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
