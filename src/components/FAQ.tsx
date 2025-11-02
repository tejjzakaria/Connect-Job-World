import { useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

const FAQ = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [openId, setOpenId] = useState<number | null>(null);

  const faqs = [
    {
      id: 1,
      categoryKey: "faq.categories.general",
      questionKey: "faq.q1.question",
      answerKey: "faq.q1.answer"
    },
    {
      id: 2,
      categoryKey: "faq.categories.usLottery",
      questionKey: "faq.q2.question",
      answerKey: "faq.q2.answer"
    },
    {
      id: 3,
      categoryKey: "faq.categories.usLottery",
      questionKey: "faq.q3.question",
      answerKey: "faq.q3.answer"
    },
    {
      id: 4,
      categoryKey: "faq.categories.canada",
      questionKey: "faq.q4.question",
      answerKey: "faq.q4.answer"
    },
    {
      id: 5,
      categoryKey: "faq.categories.canada",
      questionKey: "faq.q5.question",
      answerKey: "faq.q5.answer"
    },
    {
      id: 6,
      categoryKey: "faq.categories.workVisa",
      questionKey: "faq.q6.question",
      answerKey: "faq.q6.answer"
    },
    {
      id: 7,
      categoryKey: "faq.categories.costs",
      questionKey: "faq.q7.question",
      answerKey: "faq.q7.answer"
    },
    {
      id: 8,
      categoryKey: "faq.categories.procedures",
      questionKey: "faq.q8.question",
      answerKey: "faq.q8.answer"
    },
    {
      id: 9,
      categoryKey: "faq.categories.study",
      questionKey: "faq.q9.question",
      answerKey: "faq.q9.answer"
    },
    {
      id: 10,
      categoryKey: "faq.categories.general",
      questionKey: "faq.q10.question",
      answerKey: "faq.q10.answer"
    }
  ];

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  // Group FAQs by category
  const categories = Array.from(new Set(faqs.map(faq => faq.categoryKey)));

  return (
    <section dir={isRTL ? 'rtl' : 'ltr'} id="faq" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <HelpCircle className="w-5 h-5 text-primary" />
            <span className="text-primary font-semibold">{t('faq.badge')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t('faq.heading')}
          </h2>
          <p className="text-xl text-muted-foreground">
            {t('faq.subtitle')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {categories.map((category, catIndex) => (
            <div key={category} className="space-y-4">
              <h3 className="text-2xl font-bold text-primary mb-4">{t(category)}</h3>
              {faqs
                .filter(faq => faq.categoryKey === category)
                .map((faq, index) => (
                  <Card
                    key={faq.id}
                    className="overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 animate-fade-in-up"
                    style={{ animationDelay: `${(catIndex * 3 + index) * 0.05}s` }}
                  >
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className={`w-full p-6 flex items-center justify-between gap-4 hover:bg-muted/50 transition-colors ${isRTL ? 'text-right' : 'text-left'}`}
                    >
                      <span className="font-bold text-lg text-foreground flex-1">
                        {t(faq.questionKey)}
                      </span>
                      <ChevronDown
                        className={`w-6 h-6 text-primary transition-transform duration-300 flex-shrink-0 ${
                          openId === faq.id ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        openId === faq.id ? "max-h-96" : "max-h-0"
                      }`}
                    >
                      <div className="p-6 pt-0 text-muted-foreground leading-relaxed border-t">
                        {t(faq.answerKey)}
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          ))}
        </div>

        <div className="text-center mt-16 p-8 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            {t('faq.cta.title')}
          </h3>
          <p className="text-muted-foreground mb-6">
            {t('faq.cta.description')}
          </p>
          <a
            href="#contact-form"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-full font-semibold hover:bg-primary-dark transition-colors"
          >
            {t('faq.cta.button')}
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
