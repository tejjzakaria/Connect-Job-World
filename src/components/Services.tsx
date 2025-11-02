import { Flag, Plane, Briefcase, GraduationCap, Heart, FileCheck, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

const Services = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const services = [
    {
      icon: Flag,
      titleKey: "services.dvLottery.title",
      descriptionKey: "services.dvLottery.description",
      color: "from-primary to-primary-dark"
    },
    {
      icon: Plane,
      titleKey: "services.canadaImmigration.title",
      descriptionKey: "services.canadaImmigration.description",
      color: "from-secondary to-primary"
    },
    {
      icon: Briefcase,
      titleKey: "services.workVisa.title",
      descriptionKey: "services.workVisa.description",
      color: "from-accent to-secondary"
    },
    {
      icon: GraduationCap,
      titleKey: "services.studyAbroad.title",
      descriptionKey: "services.studyAbroad.description",
      color: "from-primary-glow to-accent"
    },
    {
      icon: Heart,
      titleKey: "services.familyReunification.title",
      descriptionKey: "services.familyReunification.description",
      color: "from-secondary to-primary-dark"
    },
    {
      icon: FileCheck,
      titleKey: "services.filePreparation.title",
      descriptionKey: "services.filePreparation.description",
      color: "from-primary to-accent"
    },
    {
      icon: Trophy,
      titleKey: "services.footballTalent.title",
      descriptionKey: "services.footballTalent.description",
      color: "from-accent to-primary"
    }
  ];
  return (
    <section dir={isRTL ? 'rtl' : 'ltr'} id="services" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t('services.heading')}
          </h2>
          <p className="text-xl text-muted-foreground">
            {t('services.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card
                key={index}
                className="group relative overflow-hidden border-none shadow-soft hover:shadow-large transition-all duration-500 hover:-translate-y-2 animate-fade-in-up bg-card"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                <div className="relative p-8 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-medium group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {t(service.titleKey)}
                  </h3>

                  <p className="text-muted-foreground leading-relaxed">
                    {t(service.descriptionKey)}
                  </p>

                  <div className="pt-4">
                    <div className="h-1 w-0 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-500 rounded-full" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
