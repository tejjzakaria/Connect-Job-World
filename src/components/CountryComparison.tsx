import { Check, X, DollarSign, Clock, Users, Briefcase, GraduationCap, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

const comparisonData = [
  {
    category: "متوسط الدخل السنوي",
    icon: DollarSign,
    usa: "$60,000 - $80,000",
    canada: "$45,000 - $65,000",
    advantage: "usa"
  },
  {
    category: "وقت معالجة الهجرة",
    icon: Clock,
    usa: "12-24 شهر",
    canada: "6-12 شهر",
    advantage: "canada"
  },
  {
    category: "نظام الرعاية الصحية",
    icon: Users,
    usa: "تأمين خاص (مكلف)",
    canada: "رعاية صحية مجانية",
    advantage: "canada"
  },
  {
    category: "فرص العمل",
    icon: Briefcase,
    usa: "واسعة جداً",
    canada: "جيدة ومتنوعة",
    advantage: "usa"
  },
  {
    category: "نظام التعليم",
    icon: GraduationCap,
    usa: "ممتاز (مكلف)",
    canada: "ممتاز (أقل تكلفة)",
    advantage: "canada"
  },
  {
    category: "مسار الجنسية",
    icon: TrendingUp,
    usa: "5+ سنوات",
    canada: "3 سنوات",
    advantage: "canada"
  }
];

const features = {
  usa: [
    "اقتصاد أقوى في العالم",
    "فرص عمل واسعة ومتنوعة",
    "رواتب عالية",
    "جامعات مرموقة عالمياً",
    "تنوع ثقافي كبير",
    "فرص للابتكار وريادة الأعمال"
  ],
  canada: [
    "نظام هجرة أسهل وأسرع",
    "رعاية صحية مجانية",
    "تعليم جيد وبأسعار معقولة",
    "جودة حياة عالية",
    "أمان ومجتمع مرحب",
    "مسار أسرع للحصول على الجنسية"
  ]
};

const CountryComparison = () => {
  return (
    <section dir="rtl" className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span className="text-primary font-semibold">مقارنة الدول</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            أمريكا أم كندا؟
          </h2>
          <p className="text-xl text-muted-foreground">
            مقارنة شاملة لمساعدتك في اختيار الوجهة المناسبة لك
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
                <div className="text-2xl font-bold">أمريكا</div>
              </Card>
              <Card className="p-6 bg-gradient-to-br from-red-500 to-red-600 text-white text-center">
                <div className="text-3xl mb-2">🇨🇦</div>
                <div className="text-2xl font-bold">كندا</div>
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
                      <span className="font-semibold text-foreground">{item.category}</span>
                    </div>
                  </Card>
                  <Card className={`p-4 text-center border-2 transition-all ${item.advantage === 'usa' ? 'border-blue-500 bg-blue-50' : 'border-border'}`}>
                    <span className="font-medium">{item.usa}</span>
                  </Card>
                  <Card className={`p-4 text-center border-2 transition-all ${item.advantage === 'canada' ? 'border-red-500 bg-red-50' : 'border-border'}`}>
                    <span className="font-medium">{item.canada}</span>
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
              <h3 className="text-2xl font-bold text-foreground">مميزات أمريكا</h3>
            </div>
            <div className="space-y-3">
              {features.usa.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Canada Features */}
          <Card className="p-8 border-2 border-red-500/20 hover:border-red-500/50 transition-all">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-4xl">🇨🇦</div>
              <h3 className="text-2xl font-bold text-foreground">مميزات كندا</h3>
            </div>
            <div className="space-y-3">
              {features.canada.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <Check className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Card className="inline-block p-8 bg-gradient-to-br from-primary/10 to-accent/10">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              محتار في الاختيار؟
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl">
              احجز استشارة مجانية وسنساعدك في اختيار الوجهة الأنسب بناءً على وضعك ومؤهلاتك
            </p>
            <a
              href="#contact-form"
              className="inline-block px-8 py-4 bg-primary text-white rounded-full font-semibold hover:bg-primary-dark transition-colors"
            >
              احجز استشارة مجانية
            </a>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CountryComparison;
