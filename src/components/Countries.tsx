import { MapPin, Users, Briefcase, GraduationCap, Home, TrendingUp, DollarSign, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const countries = [
  {
    id: "usa",
    name: "الولايات المتحدة الأمريكية",
    flag: "🇺🇸",
    tagline: "أرض الفرص والأحلام",
    gradient: "from-blue-600 to-blue-800",
    stats: [
      { label: "عدد المهاجرين سنوياً", value: "1M+", icon: Users },
      { label: "متوسط الراتب", value: "$60K", icon: DollarSign },
      { label: "وقت المعالجة", value: "12-24 شهر", icon: Clock },
      { label: "معدل البطالة", value: "3.8%", icon: TrendingUp }
    ],
    programs: [
      {
        icon: "🎰",
        title: "القرعة الأمريكية",
        description: "برنامج التنوع للحصول على البطاقة الخضراء"
      },
      {
        icon: "💼",
        title: "تأشيرات العمل",
        description: "H-1B, L-1, O-1 وتأشيرات أخرى"
      },
      {
        icon: "🎓",
        title: "تأشيرة الطالب",
        description: "F-1 للدراسة في الجامعات الأمريكية"
      },
      {
        icon: "👨‍👩‍👧",
        title: "لم شمل العائلة",
        description: "تأشيرات K-1, K-3 للأزواج والعائلات"
      },
      {
        icon: "🏢",
        title: "المستثمرون",
        description: "تأشيرة EB-5 للمستثمرين"
      },
      {
        icon: "⚽",
        title: "الرياضيون",
        description: "برامج خاصة للمواهب الرياضية"
      }
    ],
    benefits: [
      "أكبر اقتصاد في العالم",
      "رواتب عالية وفرص وظيفية ممتازة",
      "جامعات ومؤسسات تعليمية رائدة",
      "تنوع ثقافي واجتماعي كبير",
      "فرص للابتكار وريادة الأعمال",
      "حماية قانونية وحقوق قوية"
    ]
  },
  {
    id: "canada",
    name: "كندا",
    flag: "🇨🇦",
    tagline: "بلد الترحيب والفرص",
    gradient: "from-red-600 to-red-800",
    stats: [
      { label: "عدد المهاجرين سنوياً", value: "400K+", icon: Users },
      { label: "متوسط الراتب", value: "$50K", icon: DollarSign },
      { label: "وقت المعالجة", value: "6-12 شهر", icon: Clock },
      { label: "معدل البطالة", value: "5.2%", icon: TrendingUp }
    ],
    programs: [
      {
        icon: "🚀",
        title: "Express Entry",
        description: "أسرع طريقة للهجرة للعمال المهرة"
      },
      {
        icon: "🏘️",
        title: "البرامج الإقليمية",
        description: "PNP برامج الترشيح الإقليمية"
      },
      {
        icon: "💼",
        title: "تأشيرات العمل",
        description: "LMIA وتصاريح العمل المختلفة"
      },
      {
        icon: "🎓",
        title: "تأشيرة الطالب",
        description: "Study Permit للدراسة في كندا"
      },
      {
        icon: "👨‍👩‍👧",
        title: "لم شمل العائلة",
        description: "برامج رعاية الأزواج والآباء"
      },
      {
        icon: "🏢",
        title: "رجال الأعمال",
        description: "برامج Start-up Visa للمستثمرين"
      }
    ],
    benefits: [
      "نظام هجرة واضح وشفاف",
      "رعاية صحية شاملة ومجانية",
      "تعليم عالي الجودة وبأسعار معقولة",
      "جودة حياة عالية وأمان",
      "مجتمع متعدد الثقافات ومرحب",
      "مسار سريع للحصول على الجنسية (3 سنوات)"
    ]
  }
];

const Countries = () => {
  return (
    <section dir="rtl" className="py-24 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <MapPin className="w-5 h-5 text-primary" />
            <span className="text-primary font-semibold">وجهاتنا</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            الدول التي نخدمها
          </h2>
          <p className="text-xl text-muted-foreground">
            نتخصص في خدمات الهجرة لأفضل وجهتين في العالم
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
                      <h3 className="text-4xl font-bold mb-2">{country.name}</h3>
                      <p className="text-xl opacity-90">{country.tagline}</p>
                    </div>
                    <Button
                      size="lg"
                      className="bg-white text-primary hover:bg-white/90 font-semibold"
                      onClick={() => document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" })}
                    >
                      ابدأ طلبك الآن
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
                        {stat.value}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {stat.label}
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
                    البرامج المتاحة
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {country.programs.map((program, index) => (
                      <Card
                        key={index}
                        className="p-6 hover:border-primary transition-all hover:shadow-lg group"
                      >
                        <div className="text-4xl mb-3">{program.icon}</div>
                        <h5 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {program.title}
                        </h5>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {program.description}
                        </p>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div>
                  <h4 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <Home className="w-6 h-6 text-primary" />
                    المميزات الرئيسية
                  </h4>
                  <Card className="p-6">
                    <div className="space-y-3">
                      {country.benefits.map((benefit, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0"
                        >
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                          </div>
                          <span className="text-sm text-muted-foreground leading-relaxed">
                            {benefit}
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
              أي دولة تناسبك أكثر؟
            </h3>
            <p className="text-muted-foreground mb-6">
              احجز استشارة مجانية وسنساعدك في اتخاذ القرار الصحيح بناءً على وضعك الشخصي
            </p>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary-dark text-white"
              onClick={() => document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" })}
            >
              احجز استشارة مجانية الآن
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Countries;
