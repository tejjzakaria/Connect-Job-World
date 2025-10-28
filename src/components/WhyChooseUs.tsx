import { CheckCircle2, Shield, Clock, Headphones } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "موثوقية 100%",
    description: "مسجلون رسمياً ومعتمدون من الجهات المختصة"
  },
  {
    icon: Headphones,
    title: "دعم مستمر",
    description: "فريقنا متاح دائماً للإجابة على استفساراتك"
  },
  {
    icon: Clock,
    title: "سرعة في الإنجاز",
    description: "نلتزم بالمواعيد ونعمل بكفاءة عالية"
  },
  {
    icon: CheckCircle2,
    title: "خبرة واسعة",
    description: "أكثر من 15 سنة في مجال الهجرة والاستشارات"
  }
];

const WhyChooseUs = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent" />
      <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-r from-secondary/5 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Content */}
          <div className="space-y-8 animate-fade-in-up">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                لماذا تختار
                <span className="text-primary"> Connect Job World</span>؟
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                نحن نفهم أن قرار الهجرة هو أحد أهم القرارات في حياتك. لذلك نلتزم بتقديم أفضل الخدمات لضمان نجاحك.
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
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right side - Visual */}
          <div className="relative animate-fade-in">
            <div className="relative z-10 bg-gradient-to-br from-primary via-secondary to-accent rounded-3xl p-12 shadow-large">
              <div className="space-y-8 text-white">
                <div className="space-y-4">
                  <div className="text-6xl font-bold">98%</div>
                  <div className="text-2xl opacity-90">معدل نجاح عملائنا</div>
                </div>
                
                <div className="h-px bg-white/20" />
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-accent" />
                    <span className="text-lg">استشارة مجانية أولى</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-accent" />
                    <span className="text-lg">متابعة حتى النتائج</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-accent" />
                    <span className="text-lg">ضمان الجودة</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-accent" />
                    <span className="text-lg">أسعار تنافسية</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-accent/20 rounded-full blur-2xl animate-pulse" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "1s" }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
