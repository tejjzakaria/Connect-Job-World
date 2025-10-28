import { MessageSquare, FileSearch, FileCheck, Plane, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

const steps = [
  {
    id: 1,
    icon: MessageSquare,
    title: "الاستشارة المجانية",
    description: "نبدأ بجلسة استشارية مجانية لفهم احتياجاتك وتقييم أهليتك للهجرة",
    duration: "30 دقيقة",
    color: "from-primary to-primary-dark"
  },
  {
    id: 2,
    icon: FileSearch,
    title: "تقييم الملف",
    description: "نقوم بتحليل شامل لملفك وتحديد أفضل المسارات والبرامج المناسبة لك",
    duration: "2-3 أيام",
    color: "from-primary-dark to-secondary"
  },
  {
    id: 3,
    icon: FileCheck,
    title: "إعداد الوثائق",
    description: "نساعدك في جمع وإعداد وترجمة جميع الوثائق المطلوبة بطريقة احترافية",
    duration: "1-2 أسبوع",
    color: "from-secondary to-accent"
  },
  {
    id: 4,
    icon: Plane,
    title: "تقديم الطلب",
    description: "نتولى تقديم الطلب بشكل صحيح والمتابعة مع الجهات المعنية",
    duration: "يوم واحد",
    color: "from-accent to-primary"
  },
  {
    id: 5,
    icon: CheckCircle,
    title: "النجاح والمتابعة",
    description: "نستمر معك حتى الحصول على الموافقة ونقدم الدعم في الخطوات اللاحقة",
    duration: "حسب البرنامج",
    color: "from-primary to-accent"
  }
];

const Process = () => {
  return (
    <section dir="rtl" className="py-24 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-6xl">
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <CheckCircle className="w-5 h-5 text-primary" />
            <span className="text-primary font-semibold">خطوات العمل</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            رحلتك معنا خطوة بخطوة
          </h2>
          <p className="text-xl text-muted-foreground">
            نسير معك في كل مرحلة من رحلة الهجرة حتى تحقيق حلمك
          </p>
        </div>

        {/* Desktop view - Timeline */}
        <div className="hidden lg:block relative max-w-6xl mx-auto">
          {/* Connection line */}
          <div className="absolute top-1/2 right-0 left-0 h-1 bg-gradient-to-l from-primary via-secondary to-accent transform -translate-y-1/2" />

          <div className="relative grid grid-cols-5 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.id}
                  className="relative animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Step card */}
                  <Card className="relative z-10 p-6 text-center border-2 hover:border-primary transition-all duration-300 hover:shadow-2xl group">
                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    {/* Number badge */}
                    <div className="absolute -top-3 right-1/2 transform translate-x-1/2 w-8 h-8 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm shadow-lg">
                      {step.id}
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                      {step.description}
                    </p>
                    <div className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full inline-block">
                      {step.duration}
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile view - Vertical */}
        <div className="lg:hidden space-y-6 max-w-2xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className="relative animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Card className="p-6 border-2 hover:border-primary transition-all duration-300 hover:shadow-xl">
                  <div className="flex gap-4">
                    {/* Icon and number */}
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg relative">
                        <Icon className="w-7 h-7 text-white" />
                        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-white font-bold flex items-center justify-center text-xs shadow">
                          {step.id}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground mb-3 leading-relaxed">
                        {step.description}
                      </p>
                      <div className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full inline-block">
                        {step.duration}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Connecting line for mobile */}
                {index < steps.length - 1 && (
                  <div className="h-6 w-0.5 bg-gradient-to-b from-primary to-accent mr-7 my-2" />
                )}
              </div>
            );
          })}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          <div className="inline-flex flex-col items-center gap-4 p-8 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 rounded-3xl max-w-2xl">
            <h3 className="text-2xl font-bold text-foreground">
              جاهز لبدء رحلتك؟
            </h3>
            <p className="text-muted-foreground">
              احجز استشارتك المجانية اليوم ودعنا نساعدك في تحقيق حلمك
            </p>
            <a
              href="#contact-form"
              className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              احجز استشارة مجانية
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
