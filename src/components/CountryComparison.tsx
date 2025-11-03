/**
 * CountryComparison.tsx
 *
 * Author: Zakaria TEJJANI
 * Email: contact@tejjzakaria.com
 * Date: 2025-11-03
 *
 * Description:
 * Side-by-side country comparison table component for USA, Canada, and Australia immigration
 * options. Presents detailed comparison across multiple criteria including cost of living,
 * processing time, job market, education quality, healthcare system, family immigration,
 * language requirements, and climate. Uses check/cross icons for visual clarity and color-coded
 * cells for quick scanning. Helps clients evaluate which destination best matches their needs
 * and preferences. Features responsive table design and multi-language support.
 */

import { Check, X, DollarSign, Clock, Users, Briefcase, GraduationCap, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

const CountryComparison = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const comparisonData = [
    {
      categoryKey: "countryComparison.category1",
      icon: DollarSign,
      usaKey: "countryComparison.usa1",
      canadaKey: "countryComparison.canada1",
      advantage: "usa"
    },
    {
      categoryKey: "countryComparison.category2",
      icon: Clock,
      usaKey: "countryComparison.usa2",
      canadaKey: "countryComparison.canada2",
      advantage: "canada"
    },
    {
      categoryKey: "countryComparison.category3",
      icon: Users,
      usaKey: "countryComparison.usa3",
      canadaKey: "countryComparison.canada3",
      advantage: "canada"
    },
    {
      categoryKey: "countryComparison.category4",
      icon: Briefcase,
      usaKey: "countryComparison.usa4",
      canadaKey: "countryComparison.canada4",
      advantage: "usa"
    },
    {
      categoryKey: "countryComparison.category5",
      icon: GraduationCap,
      usaKey: "countryComparison.usa5",
      canadaKey: "countryComparison.canada5",
      advantage: "canada"
    },
    {
      categoryKey: "countryComparison.category6",
      icon: TrendingUp,
      usaKey: "countryComparison.usa6",
      canadaKey: "countryComparison.canada6",
      advantage: "canada"
    }
  ];

  const features = {
    usa: [
      "countryComparison.usaFeature1",
      "countryComparison.usaFeature2",
      "countryComparison.usaFeature3",
      "countryComparison.usaFeature4",
      "countryComparison.usaFeature5",
      "countryComparison.usaFeature6"
    ],
    canada: [
      "countryComparison.canadaFeature1",
      "countryComparison.canadaFeature2",
      "countryComparison.canadaFeature3",
      "countryComparison.canadaFeature4",
      "countryComparison.canadaFeature5",
      "countryComparison.canadaFeature6"
    ]
  };
  return (
    <section dir={isRTL ? 'rtl' : 'ltr'} className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span className="text-primary font-semibold">{t('countryComparison.badge')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t('countryComparison.heading')}
          </h2>
          <p className="text-xl text-muted-foreground">
            {t('countryComparison.subtitle')}
          </p>
        </div>

        {/* Comparison Table */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="grid gap-4">
            {/* Header */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div></div>
              <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white text-center">
                <div className="text-3xl mb-2">🇺🇸</div>
                <div className="text-2xl font-bold">{t('countryComparison.usa')}</div>
              </Card>
              <Card className="p-6 bg-gradient-to-br from-red-500 to-red-600 text-white text-center">
                <div className="text-3xl mb-2">🇨🇦</div>
                <div className="text-2xl font-bold">{t('countryComparison.canada')}</div>
              </Card>
            </div>

            {/* Comparison Rows */}
            {comparisonData.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="grid grid-cols-3 gap-4 items-center animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Card className="p-4 bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-semibold text-foreground">{t(item.categoryKey)}</span>
                    </div>
                  </Card>
                  <Card className={`p-4 text-center border-2 transition-all ${item.advantage === 'usa' ? 'border-blue-500 bg-blue-50' : 'border-border'}`}>
                    <span className="font-medium">{t(item.usaKey)}</span>
                  </Card>
                  <Card className={`p-4 text-center border-2 transition-all ${item.advantage === 'canada' ? 'border-red-500 bg-red-50' : 'border-border'}`}>
                    <span className="font-medium">{t(item.canadaKey)}</span>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* Features Comparison */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* USA Features */}
          <Card className="p-8 border-2 border-blue-500/20 hover:border-blue-500/50 transition-all">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-4xl">🇺🇸</div>
              <h3 className="text-2xl font-bold text-foreground">{t('countryComparison.usaFeaturesHeading')}</h3>
            </div>
            <div className="space-y-3">
              {features.usa.map((featureKey, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{t(featureKey)}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Canada Features */}
          <Card className="p-8 border-2 border-red-500/20 hover:border-red-500/50 transition-all">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-4xl">🇨🇦</div>
              <h3 className="text-2xl font-bold text-foreground">{t('countryComparison.canadaFeaturesHeading')}</h3>
            </div>
            <div className="space-y-3">
              {features.canada.map((featureKey, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <Check className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{t(featureKey)}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Card className="inline-block p-8 bg-gradient-to-br from-primary/10 to-accent/10">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              {t('countryComparison.ctaHeading')}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl">
              {t('countryComparison.ctaDescription')}
            </p>
            <a
              href="#contact-form"
              className="inline-block px-8 py-4 bg-primary text-white rounded-full font-semibold hover:bg-primary-dark transition-colors"
            >
              {t('countryComparison.ctaButton')}
            </a>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CountryComparison;
