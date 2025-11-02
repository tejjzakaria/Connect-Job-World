import { MapPin, Users, Briefcase, GraduationCap, Home, TrendingUp, DollarSign, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const Countries = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const countries = [
    {
      id: "usa",
      nameKey: "countries.usa.name",
      flag: "🇺🇸",
      taglineKey: "countries.usa.tagline",
      gradient: "from-blue-600 to-blue-800",
      stats: [
        { labelKey: "countries.usa.stat1Label", value: "1M+", icon: Users },
        { labelKey: "countries.usa.stat2Label", value: "$60K", icon: DollarSign },
        { labelKey: "countries.usa.stat3Label", valueKey: "countries.usa.stat3Value", icon: Clock },
        { labelKey: "countries.usa.stat4Label", value: "3.8%", icon: TrendingUp }
      ],
      programs: [
        { icon: "🎰", titleKey: "countries.usa.program1Title", descKey: "countries.usa.program1Desc" },
        { icon: "💼", titleKey: "countries.usa.program2Title", descKey: "countries.usa.program2Desc" },
        { icon: "🎓", titleKey: "countries.usa.program3Title", descKey: "countries.usa.program3Desc" },
        { icon: "👨‍👩‍👧", titleKey: "countries.usa.program4Title", descKey: "countries.usa.program4Desc" },
        { icon: "🏢", titleKey: "countries.usa.program5Title", descKey: "countries.usa.program5Desc" },
        { icon: "⚽", titleKey: "countries.usa.program6Title", descKey: "countries.usa.program6Desc" }
      ],
      benefitKeys: [
        "countries.usa.benefit1",
        "countries.usa.benefit2",
        "countries.usa.benefit3",
        "countries.usa.benefit4",
        "countries.usa.benefit5",
        "countries.usa.benefit6"
      ]
    },
    {
      id: "canada",
      nameKey: "countries.canada.name",
      flag: "🇨🇦",
      taglineKey: "countries.canada.tagline",
      gradient: "from-red-600 to-red-800",
      stats: [
        { labelKey: "countries.canada.stat1Label", value: "400K+", icon: Users },
        { labelKey: "countries.canada.stat2Label", value: "$50K", icon: DollarSign },
        { labelKey: "countries.canada.stat3Label", valueKey: "countries.canada.stat3Value", icon: Clock },
        { labelKey: "countries.canada.stat4Label", value: "5.2%", icon: TrendingUp }
      ],
      programs: [
        { icon: "🚀", titleKey: "countries.canada.program1Title", descKey: "countries.canada.program1Desc" },
        { icon: "🏘️", titleKey: "countries.canada.program2Title", descKey: "countries.canada.program2Desc" },
        { icon: "💼", titleKey: "countries.canada.program3Title", descKey: "countries.canada.program3Desc" },
        { icon: "🎓", titleKey: "countries.canada.program4Title", descKey: "countries.canada.program4Desc" },
        { icon: "👨‍👩‍👧", titleKey: "countries.canada.program5Title", descKey: "countries.canada.program5Desc" },
        { icon: "🏢", titleKey: "countries.canada.program6Title", descKey: "countries.canada.program6Desc" }
      ],
      benefitKeys: [
        "countries.canada.benefit1",
        "countries.canada.benefit2",
        "countries.canada.benefit3",
        "countries.canada.benefit4",
        "countries.canada.benefit5",
        "countries.canada.benefit6"
      ]
    }
  ];
  return (
    <section dir={isRTL ? 'rtl' : 'ltr'} className="py-24 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <MapPin className="w-5 h-5 text-primary" />
            <span className="text-primary font-semibold">{t('countries.badge')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t('countries.heading')}
          </h2>
          <p className="text-xl text-muted-foreground">
            {t('countries.subtitle')}
          </p>
        </div>

        <div className="space-y-24 max-w-7xl mx-auto">
          {countries.map((country, countryIndex) => (
            <div
              key={country.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${countryIndex * 0.2}s` }}
            >
              {/* Country Header */}
              <Card className={`p-8 bg-gradient-to-br ${country.gradient} text-white mb-8 overflow-hidden relative`}>
                <div className="absolute top-0 left-0 text-9xl opacity-10">
                  {country.flag}
                </div>
                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                      <div className="text-6xl mb-4">{country.flag}</div>
                      <h3 className="text-4xl font-bold mb-2">{t(country.nameKey)}</h3>
                      <p className="text-xl opacity-90">{t(country.taglineKey)}</p>
                    </div>
                    <Button
                      size="lg"
                      className="bg-white text-primary hover:bg-white/90 font-semibold"
                      onClick={() => document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" })}
                    >
                      {t('countries.startApplication')}
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {country.stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <Card
                      key={index}
                      className="p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1"
                    >
                      <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                      <div className="text-3xl font-bold text-foreground mb-1">
                        {stat.valueKey ? t(stat.valueKey) : stat.value}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t(stat.labelKey)}
                      </div>
                    </Card>
                  );
                })}
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Programs */}
                <div className="lg:col-span-2">
                  <h4 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <Briefcase className="w-6 h-6 text-primary" />
                    {t('countries.availablePrograms')}
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {country.programs.map((program, index) => (
                      <Card
                        key={index}
                        className="p-6 hover:border-primary transition-all hover:shadow-lg group"
                      >
                        <div className="text-4xl mb-3">{program.icon}</div>
                        <h5 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {t(program.titleKey)}
                        </h5>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {t(program.descKey)}
                        </p>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div>
                  <h4 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <Home className="w-6 h-6 text-primary" />
                    {t('countries.keyBenefits')}
                  </h4>
                  <Card className="p-6">
                    <div className="space-y-3">
                      {country.benefitKeys.map((benefitKey, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0"
                        >
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                          </div>
                          <span className="text-sm text-muted-foreground leading-relaxed">
                            {t(benefitKey)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Final CTA */}
        <div className="text-center mt-16">
          <Card className="inline-block p-8 bg-gradient-to-br from-primary/10 to-accent/10 max-w-3xl">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              {t('countries.finalCtaHeading')}
            </h3>
            <p className="text-muted-foreground mb-6">
              {t('countries.finalCtaDescription')}
            </p>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary-dark text-white"
              onClick={() => document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" })}
            >
              {t('countries.finalCtaButton')}
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Countries;
