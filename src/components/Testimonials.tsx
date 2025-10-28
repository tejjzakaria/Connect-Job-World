import { Star, Quote } from "lucide-react";
import { Card } from "@/components/ui/card";

const testimonials = [
  {
    id: 1,
    name: "أحمد المالكي",
    service: "القرعة الأمريكية",
    rating: 5,
    text: "بفضل فريق Connect Job World حصلت على الفيزا الأمريكية من أول مرة! كانوا معي في كل خطوة وقدموا لي كل الدعم اللازم. خدمة احترافية ومتابعة مستمرة.",
    image: "👨‍💼"
  },
  {
    id: 2,
    name: "فاطمة الزهراء",
    service: "الهجرة إلى كندا",
    rating: 5,
    text: "تجربة رائعة! ساعدوني في برنامج Express Entry وحصلت على الإقامة الدائمة في كندا خلال 8 أشهر. فريق محترف جداً ويفهم كل التفاصيل.",
    image: "👩‍💼"
  },
  {
    id: 3,
    name: "يوسف بنعلي",
    service: "تأشيرة عمل",
    rating: 5,
    text: "حصلت على عقد عمل في أمريكا بمساعدة Connect Job World. ساعدوني في إيجاد الفرصة وإكمال جميع الإجراءات. أنصح بهم بشدة!",
    image: "👨‍🔧"
  },
  {
    id: 4,
    name: "سارة التازي",
    service: "الدراسة في الخارج",
    rating: 5,
    text: "حلمت بالدراسة في كندا وبفضل فريق Connect Job World حصلت على قبول جامعي وفيزا دراسية. شكراً لكم من القلب على كل المساعدة والدعم!",
    image: "👩‍🎓"
  },
  {
    id: 5,
    name: "محمد الإدريسي",
    service: "لم شمل العائلة",
    rating: 5,
    text: "كنت أعيش في كندا وأردت أن تلحق بي عائلتي. بفضل Connect Job World تمت الإجراءات بسلاسة وسرعة. الآن عائلتي معي والحمد لله!",
    image: "👨‍👩‍👧"
  },
  {
    id: 6,
    name: "نورا العلوي",
    service: "مواهب كرة القدم",
    rating: 5,
    text: "ابني لاعب كرة قدم موهوب وساعدوه في الالتحاق بأكاديمية مرموقة في أمريكا. خدمة مميزة وفريق متفاني في عمله.",
    image: "⚽"
  }
];

const Testimonials = () => {
  return (
    <section dir="rtl" className="py-24 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <Star className="w-5 h-5 text-primary fill-primary" />
            <span className="text-primary font-semibold">قصص النجاح</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            ماذا يقول عملاؤنا
          </h2>
          <p className="text-xl text-muted-foreground">
            آراء حقيقية من عملاء حققوا أحلامهم بالهجرة معنا
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
                  "{testimonial.text}"
                </p>

                {/* Author info */}
                <div className="flex items-center gap-4 pt-4 border-t">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl">
                    {testimonial.image}
                  </div>
                  <div>
                    <div className="font-bold text-foreground">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.service}
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
            <div className="text-muted-foreground">عميل راضٍ</div>
          </div>
          <div className="text-center animate-fade-in-up" style={{ animationDelay: "0.7s" }}>
            <div className="text-4xl font-bold text-primary mb-2">98%</div>
            <div className="text-muted-foreground">معدل النجاح</div>
          </div>
          <div className="text-center animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
            <div className="text-4xl font-bold text-primary mb-2">15+</div>
            <div className="text-muted-foreground">سنة خبرة</div>
          </div>
          <div className="text-center animate-fade-in-up" style={{ animationDelay: "0.9s" }}>
            <div className="text-4xl font-bold text-primary mb-2">24/7</div>
            <div className="text-muted-foreground">دعم مستمر</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
