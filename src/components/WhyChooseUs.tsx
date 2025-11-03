/**
 * WhyChooseUs.tsx
 *
 * Author: Zakaria TEJJANI
 * Email: contact@tejjzakaria.com
 * Date: 2025-11-03
 *
 * Description:
 * Value proposition section highlighting key advantages of choosing Connect Job World.
 * Features four main benefits: professional expertise, guaranteed security, fast processing,
 * and 24/7 support. Each benefit is presented in a card format with icons, titles, and
 * descriptions. Implements gradient backgrounds, hover effects, and responsive grid layout.
 * Helps build trust and credibility with potential clients by showcasing company strengths.
 */

import { CheckCircle2, Shield, Clock, Headphones } from "lucide-react";
import { useTranslation } from "react-i18next";

const WhyChooseUs = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const features = [
    {
      icon: Shield,
      titleKey: "whyChooseUs.feature1.title",
      descriptionKey: "whyChooseUs.feature1.description"
    },
    {
      icon: Headphones,
      titleKey: "whyChooseUs.feature2.title",
      descriptionKey: "whyChooseUs.feature2.description"
    },
    {
      icon: Clock,
      titleKey: "whyChooseUs.feature3.title",
      descriptionKey: "whyChooseUs.feature3.description"
    },
    {
      icon: CheckCircle2,
      titleKey: "whyChooseUs.feature4.title",
      descriptionKey: "whyChooseUs.feature4.description"
    }
  ];
  return (
    <section id="why-choose-us" dir={isRTL ? 'rtl' : 'ltr'} className="py-24 bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent" />
      <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-r from-secondary/5 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Right side - Visual */}
          <div className="relative animate-fade-in">
            <div className="relative z-10 bg-gradient-to-br from-primary via-secondary to-accent rounded-3xl p-12 shadow-large">
              <div className="space-y-8 text-white">
                <div className="space-y-4">
                  <div className="text-6xl font-bold">98%</div>
                  <div className="text-2xl opacity-90">{t('whyChooseUs.successRate')}</div>
                </div>

                <div className="h-px bg-white/20" />

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-accent" />
                    <span className="text-lg">{t('whyChooseUs.benefit1')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-accent" />
                    <span className="text-lg">{t('whyChooseUs.benefit2')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-accent" />
                    <span className="text-lg">{t('whyChooseUs.benefit3')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-accent" />
                    <span className="text-lg">{t('whyChooseUs.benefit4')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-accent/20 rounded-full blur-2xl animate-pulse" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "1s" }} />
          </div>

          {/* Left side - Content */}
          <div className="space-y-8 animate-fade-in-up">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                {t('whyChooseUs.heading')}
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {t('whyChooseUs.subtitle')}
              </p>
            </div>

            <div className="space-y-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="flex gap-4 items-start group animate-slide-in-right"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-soft group-hover:shadow-medium transition-all duration-300 group-hover:scale-110">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {t(feature.titleKey)}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {t(feature.descriptionKey)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
