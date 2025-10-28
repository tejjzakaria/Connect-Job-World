import { FileText } from "lucide-react";
import { Card } from "@/components/ui/card";

const Flyers = () => {
  const flyers = [
    {
      id: 1,
      title: "التسجيل في القرعة الامريكية",
      image: "/flyers/poste america jiob with number .png",
      alt: "فرص العمل في أمريكا"
    },
    {
      id: 2,
      title: "فرص العمل في كندا",
      image: "/flyers/poste canda job with number phone.png",
      alt: "فرص العمل في كندا"
    }
  ];

  return (
    <section id="flyers" className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <FileText className="w-5 h-5 text-primary" />
            <span className="text-primary font-semibold">فرص العمل</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            استكشف فرص العمل المتاحة
          </h2>
          <p className="text-xl text-muted-foreground">
            اطلع على آخر الفرص المتاحة للعمل في أمريكا وكندا
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
                  alt={flyer.alt}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-6 bg-card">
                <h3 className="text-2xl font-bold text-foreground text-center group-hover:text-primary transition-colors">
                  {flyer.title}
                </h3>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            للمزيد من المعلومات حول هذه الفرص، تواصل معنا اليوم
          </p>
        </div>
      </div>
    </section>
  );
};

export default Flyers;
