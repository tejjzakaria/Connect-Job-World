/**
 * Testimonials.tsx
 *
 * Author: Zakaria TEJJANI
 * Email: contact@tejjzakaria.com
 * Date: 2025-11-03
 *
 * Description:
 * Client testimonials and reviews showcase component building social proof and credibility.
 * Displays success stories from satisfied clients in a card-based carousel layout with
 * 5-star ratings, client names, countries, and detailed feedback. Features quote icons,
 * gradient backgrounds, and staggered animations. Helps potential clients trust the service
 * by showing real experiences from previous customers. Supports multi-language testimonials
 * and responsive design for optimal viewing on all devices.
 */

import { Star, Quote } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

const Testimonials = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const testimonials = [
    {
      id: 1,
      nameKey: "testimonials.client1.name",
      serviceKey: "testimonials.client1.service",
      rating: 5,
      textKey: "testimonials.client1.text",
      image: "👨‍💼"
    },
    {
      id: 2,
      nameKey: "testimonials.client2.name",
      serviceKey: "testimonials.client2.service",
      rating: 5,
      textKey: "testimonials.client2.text",
      image: "👩‍💼"
    },
    {
      id: 3,
      nameKey: "testimonials.client3.name",
      serviceKey: "testimonials.client3.service",
      rating: 5,
      textKey: "testimonials.client3.text",
      image: "👨‍🔧"
    },
    {
      id: 4,
      nameKey: "testimonials.client4.name",
      serviceKey: "testimonials.client4.service",
      rating: 5,
      textKey: "testimonials.client4.text",
      image: "👩‍🎓"
    },
    {
      id: 5,
      nameKey: "testimonials.client5.name",
      serviceKey: "testimonials.client5.service",
      rating: 5,
      textKey: "testimonials.client5.text",
      image: "👨‍👩‍👧"
    },
    {
      id: 6,
      nameKey: "testimonials.client6.name",
      serviceKey: "testimonials.client6.service",
      rating: 5,
      textKey: "testimonials.client6.text",
      image: "⚽"
    }
  ];

  return (
    <section dir={isRTL ? 'rtl' : 'ltr'} className="py-24 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <Star className="w-5 h-5 text-primary fill-primary" />
            <span className="text-primary font-semibold">{t('testimonials.badge')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t('testimonials.heading')}
          </h2>
          <p className="text-xl text-muted-foreground">
            {t('testimonials.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.id}
              className="group relative overflow-hidden border-2 hover:border-primary transition-all duration-300 hover:shadow-2xl animate-fade-in-up p-8"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Quote icon */}
              <div className="absolute top-4 left-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="w-16 h-16 text-primary" />
              </div>

              <div className="relative space-y-4">
                {/* Rating */}
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-500 fill-yellow-500"
                    />
                  ))}
                </div>

                {/* Testimonial text */}
                <p className="text-muted-foreground leading-relaxed">
                  "{t(testimonial.textKey)}"
                </p>

                {/* Author info */}
                <div className="flex items-center gap-4 pt-4 border-t">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl">
                    {testimonial.image}
                  </div>
                  <div>
                    <div className="font-bold text-foreground">
                      {t(testimonial.nameKey)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {t(testimonial.serviceKey)}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-16 pt-16 border-t">
          <div className="text-center animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
            <div className="text-4xl font-bold text-primary mb-2">5000+</div>
            <div className="text-muted-foreground">{t('testimonials.stats.satisfiedClients')}</div>
          </div>
          <div className="text-center animate-fade-in-up" style={{ animationDelay: "0.7s" }}>
            <div className="text-4xl font-bold text-primary mb-2">98%</div>
            <div className="text-muted-foreground">{t('testimonials.stats.successRate')}</div>
          </div>
          <div className="text-center animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
            <div className="text-4xl font-bold text-primary mb-2">15+</div>
            <div className="text-muted-foreground">{t('testimonials.stats.yearsExperience')}</div>
          </div>
          <div className="text-center animate-fade-in-up" style={{ animationDelay: "0.9s" }}>
            <div className="text-4xl font-bold text-primary mb-2">24/7</div>
            <div className="text-muted-foreground">{t('testimonials.stats.support')}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
