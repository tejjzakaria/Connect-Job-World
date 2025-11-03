/**
 * Flyers.tsx
 *
 * Author: Zakaria TEJJANI
 * Email: contact@tejjzakaria.com
 * Date: 2025-11-03
 *
 * Description:
 * Downloadable flyers and promotional materials section component. Displays available
 * marketing materials and informational brochures that clients can download for reference.
 * Features card-based layout with file icons, titles, and descriptions. Provides quick
 * access to service information in PDF format for offline viewing. Supports multi-language
 * content and helps clients share service information with friends and family.
 */

import { FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

const Flyers = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const flyers = [
    {
      id: 1,
      titleKey: "flyers.usaLottery.title",
      image: "/flyers/poste america jiob with number .png",
      altKey: "flyers.usaLottery.alt"
    },
    {
      id: 2,
      titleKey: "flyers.canadaJobs.title",
      image: "/flyers/poste canda job with number phone.png",
      altKey: "flyers.canadaJobs.alt"
    }
  ];

  return (
    <section id="flyers" dir={isRTL ? 'rtl' : 'ltr'} className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <FileText className="w-5 h-5 text-primary" />
            <span className="text-primary font-semibold">{t('flyers.badge')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t('flyers.heading')}
          </h2>
          <p className="text-xl text-muted-foreground">
            {t('flyers.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {flyers.map((flyer, index) => (
            <Card
              key={flyer.id}
              className="group overflow-hidden border-2 hover:border-primary transition-all duration-300 hover:shadow-2xl animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                <img
                  src={flyer.image}
                  alt={t(flyer.altKey)}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-6 bg-card">
                <h3 className="text-2xl font-bold text-foreground text-center group-hover:text-primary transition-colors">
                  {t(flyer.titleKey)}
                </h3>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            {t('flyers.footer')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Flyers;
