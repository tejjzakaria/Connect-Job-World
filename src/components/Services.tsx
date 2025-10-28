import { Flag, Plane, Briefcase, GraduationCap, Heart, FileCheck } from "lucide-react";
import { Card } from "@/components/ui/card";

const services = [
  {
    icon: Flag,
    title: "القرعة الأمريكية (DV Lottery)",
    description: "استشارة كاملة للتسجيل في القرعة الأمريكية بطريقة احترافية مع متابعة حتى النتائج",
    color: "from-primary to-primary-dark"
  },
  {
    icon: Plane,
    title: "الهجرة إلى كندا",
    description: "برامج Express Entry، والهجرة السريعة للعمال المهرة مع تقييم شامل للملف",
    color: "from-secondary to-primary"
  },
  {
    icon: Briefcase,
    title: "تأشيرات العمل",
    description: "مساعدة في الحصول على تأشيرات العمل لأمريكا وكندا مع دعم في إيجاد فرص العمل",
    color: "from-accent to-secondary"
  },
  {
    icon: GraduationCap,
    title: "الدراسة في الخارج",
    description: "استشارات للقبول الجامعي والحصول على تأشيرة الطالب",
    color: "from-primary-glow to-accent"
  },
  {
    icon: Heart,
    title: "لم شمل العائلة",
    description: "مساعدة في إجراءات لم الشمل العائلي وتأشيرات الزواج",
    color: "from-secondary to-primary-dark"
  },
  {
    icon: FileCheck,
    title: "إعداد الملفات",
    description: "إعداد وترجمة جميع الوثائق المطلوبة بطريقة احترافية ومعتمدة",
    color: "from-primary to-accent"
  }
];

const Services = () => {
  return (
    <section id="services" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            خدماتنا المتميزة
          </h2>
          <p className="text-xl text-muted-foreground">
            نقدم مجموعة شاملة من الخدمات لمساعدتك في تحقيق حلم الهجرة
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
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center shadow-medium group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description}
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
