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
import { submissionsAPI } from "@/lib/api";
import { useTranslation } from "react-i18next";

const ContactForm = () => {
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
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

    let mongoSuccess = false;
    let sheetsSuccess = false;

    try {
      // 1. Send to MongoDB
      try {
        console.log("🔄 Attempting to save to MongoDB...");
        console.log("API URL:", import.meta.env.VITE_API_URL);

        const response = await submissionsAPI.create({
          name: formData.name,
          email: formData.email || undefined,
          phone: formData.phone,
          service: formData.service,
          message: formData.message,
          source: 'website'
        });

        console.log("MongoDB Response:", response);

        if (response.success) {
          mongoSuccess = true;
          console.log("✅ Saved to MongoDB");
        }
      } catch (mongoError) {
        console.error("❌ MongoDB error:", mongoError);
        console.error("Error details:", mongoError);
        // Continue to try Google Sheets even if MongoDB fails
      }

      // 2. Send to Google Sheets (in parallel)
      try {
        const googleSheetsUrl = import.meta.env.VITE_GOOGLE_SHEETS_URL;

        if (googleSheetsUrl) {
          await fetch(googleSheetsUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
            mode: 'no-cors', // Required for Google Apps Script
          });

          sheetsSuccess = true;
          console.log("✅ Saved to Google Sheets");
        } else {
          console.warn("⚠️ Google Sheets URL not configured");
        }
      } catch (sheetsError) {
        console.error("❌ Google Sheets error:", sheetsError);
        // Continue anyway
      }

      // Show success if at least one destination worked
      if (mongoSuccess || sheetsSuccess) {
        toast({
          title: t('contactForm.successTitle'),
          description: t('contactForm.successDescription'),
        });

        // Reset form
        setFormData({ name: "", email: "", phone: "", service: "", message: "" });
      } else {
        throw new Error("Both MongoDB and Google Sheets failed");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: t('contactForm.errorTitle'),
        description: t('contactForm.errorDescription'),
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
    <section dir={isRTL ? 'rtl' : 'ltr'} id="contact-form" className="py-24 bg-gradient-to-br from-primary/5 via-background to-accent/5 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "4s" }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "6s", animationDelay: "1s" }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <Send className="w-5 h-5 text-primary" />
            <span className="text-primary font-semibold">{t('contactForm.badge')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t('contactForm.heading')}
          </h2>
          <p className="text-xl text-muted-foreground">
            {t('contactForm.subtitle')}
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
                <h3 className="text-2xl font-bold mb-8">{t('contactForm.contactInfoHeading')}</h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-all">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm opacity-80 mb-1">{t('contactForm.phoneLabel')}</div>
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
                    <div className="text-sm opacity-80 mb-1">{t('contactForm.emailLabel')}</div>
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
                    <div className="text-sm opacity-80 mb-1">{t('contactForm.addressLabel')}</div>
                    <div className="text-lg font-semibold">
                      {t('contactForm.addressText')}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/20">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-5 h-5" />
                  <span className="font-semibold">{t('contactForm.workHoursHeading')}</span>
                </div>
                <p className="text-sm opacity-90 leading-relaxed whitespace-pre-line">
                  {t('contactForm.workHoursText')}
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
                  <div className="text-lg font-bold">{t('contactForm.whatsappHeading')}</div>
                  <div className="text-sm opacity-90">{t('contactForm.whatsappSubtitle')}</div>
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
                    {t('contactForm.nameLabel')}
                  </label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder={t('contactForm.namePlaceholder')}
                    className="h-14 border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 bg-background text-lg"
                  />
                </div>

                <div className="space-y-3 group">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" />
                    {t('contactForm.phoneFieldLabel')}
                  </label>
                  <Input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder={t('contactForm.phonePlaceholder')}
                    className="h-14 border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 bg-background text-lg"
                  />
                </div>
              </div>

              <div className="space-y-3 group">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  {t('contactForm.emailFieldLabel')}
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder={t('contactForm.emailPlaceholder')}
                  className="h-14 border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 bg-background text-lg"
                />
              </div>

              <div className="space-y-3 group">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-primary" />
                  {t('contactForm.serviceLabel')}
                </label>
                <Select required value={formData.service} onValueChange={(value) => handleChange("service", value)}>
                  <SelectTrigger className="h-14 border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 bg-background text-lg">
                    <SelectValue placeholder={t('contactForm.servicePlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us_lottery">{t('contactForm.serviceUSLottery')}</SelectItem>
                    <SelectItem value="canada_immigration">{t('contactForm.serviceCanadaImmigration')}</SelectItem>
                    <SelectItem value="work_visa">{t('contactForm.serviceWorkVisa')}</SelectItem>
                    <SelectItem value="study_abroad">{t('contactForm.serviceStudyAbroad')}</SelectItem>
                    <SelectItem value="family_reunion">{t('contactForm.serviceFamilyReunion')}</SelectItem>
                    <SelectItem value="soccer_talent">{t('contactForm.serviceSoccerTalent')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3 group">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  {t('contactForm.messageLabel')}
                </label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  placeholder={t('contactForm.messagePlaceholder')}
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
                    {t('contactForm.submittingButton')}
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    {t('contactForm.submitButton')}
                    <Send className="h-6 w-6 group-hover:-rotate-45 transition-transform duration-300" />
                  </span>
                )}
              </Button>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center justify-center gap-6 pt-6 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>{t('contactForm.trustBadge1')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>{t('contactForm.trustBadge2')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <span>{t('contactForm.trustBadge3')}</span>
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
