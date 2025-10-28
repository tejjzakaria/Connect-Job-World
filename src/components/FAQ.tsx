import { useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";

const faqs = [
  {
    id: 1,
    category: "عام",
    question: "ما هي الخدمات التي تقدمونها؟",
    answer: "نقدم خدمات شاملة في مجال الهجرة والاستشارات تشمل: القرعة الأمريكية، الهجرة إلى كندا، تأشيرات العمل، الدراسة في الخارج، لم شمل العائلة، إعداد الملفات، وخدمات خاصة للمواهب الرياضية."
  },
  {
    id: 2,
    category: "القرعة الأمريكية",
    question: "متى يبدأ التسجيل في القرعة الأمريكية؟",
    answer: "يبدأ التسجيل في القرعة الأمريكية عادة في شهر أكتوبر من كل سنة ويستمر لمدة شهر تقريباً. نحن نساعدك في التسجيل الصحيح والمتابعة حتى ظهور النتائج."
  },
  {
    id: 3,
    category: "القرعة الأمريكية",
    question: "ما هي شروط الأهلية للقرعة الأمريكية؟",
    answer: "يجب أن تكون من دولة مؤهلة، أن يكون لديك شهادة الثانوية أو سنتان خبرة عمل في مهنة محددة خلال آخر 5 سنوات، وأن تستوفي متطلبات الصور والوثائق المطلوبة."
  },
  {
    id: 4,
    category: "كندا",
    question: "ما هو برنامج Express Entry؟",
    answer: "Express Entry هو نظام إلكتروني تستخدمه الحكومة الكندية لإدارة طلبات الهجرة للعمال المهرة. يتم تقييم المتقدمين بناءً على العمر، التعليم، الخبرة، واللغة. نساعدك في تحسين ملفك وزيادة فرص قبولك."
  },
  {
    id: 5,
    category: "كندا",
    question: "كم من الوقت تستغرق معالجة طلب الهجرة إلى كندا؟",
    answer: "تختلف المدة حسب البرنامج المختار. برنامج Express Entry يستغرق عادة 6-8 أشهر، بينما البرامج الإقليمية قد تستغرق 12-18 شهراً. نحن نضمن متابعة دقيقة لملفك."
  },
  {
    id: 6,
    category: "تأشيرات العمل",
    question: "هل تساعدون في إيجاد فرص عمل؟",
    answer: "نعم، نقدم خدمة البحث عن فرص عمل مناسبة في أمريكا وكندا ونساعد في التواصل مع أصحاب العمل وإكمال إجراءات تأشيرة العمل."
  },
  {
    id: 7,
    category: "التكاليف",
    question: "كم تكلف خدماتكم؟",
    answer: "تختلف التكلفة حسب نوع الخدمة المطلوبة. نقدم استشارة مجانية أولى لتقييم حالتك وتقديم عرض سعر شفاف. يمكنك التواصل معنا للحصول على تفاصيل الأسعار."
  },
  {
    id: 8,
    category: "الإجراءات",
    question: "ما هي الوثائق المطلوبة؟",
    answer: "تختلف الوثائق حسب نوع الطلب، لكن عموماً تشمل: جواز السفر، الشهادات الدراسية، شهادات الخبرة، كشف حساب بنكي، شهادة الميلاد، وشهادة عدم السوابق. نساعدك في إعداد وترجمة جميع الوثائق."
  },
  {
    id: 9,
    category: "الدراسة",
    question: "هل تساعدون في الحصول على قبول جامعي؟",
    answer: "نعم، نساعد في اختيار الجامعة المناسبة، تحضير الطلب، الحصول على القبول الجامعي، وإكمال إجراءات تأشيرة الطالب."
  },
  {
    id: 10,
    category: "عام",
    question: "هل خدماتكم معتمدة وقانونية؟",
    answer: "نعم، نحن مسجلون رسمياً ومعتمدون من الجهات المختصة. فريقنا يتكون من مستشارين مؤهلين مع خبرة أكثر من 15 سنة في مجال الهجرة والاستشارات."
  }
];

const FAQ = () => {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  // Group FAQs by category
  const categories = Array.from(new Set(faqs.map(faq => faq.category)));

  return (
    <section dir="rtl" id="faq" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <HelpCircle className="w-5 h-5 text-primary" />
            <span className="text-primary font-semibold">الأسئلة الشائعة</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            أسئلة وأجوبة
          </h2>
          <p className="text-xl text-muted-foreground">
            إجابات على الأسئلة الأكثر شيوعاً حول خدماتنا وعملية الهجرة
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {categories.map((category, catIndex) => (
            <div key={category} className="space-y-4">
              <h3 className="text-2xl font-bold text-primary mb-4">{category}</h3>
              {faqs
                .filter(faq => faq.category === category)
                .map((faq, index) => (
                  <Card
                    key={faq.id}
                    className="overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 animate-fade-in-up"
                    style={{ animationDelay: `${(catIndex * 3 + index) * 0.05}s` }}
                  >
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full p-6 text-right flex items-center justify-between gap-4 hover:bg-muted/50 transition-colors"
                    >
                      <span className="font-bold text-lg text-foreground flex-1">
                        {faq.question}
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
                        {faq.answer}
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          ))}
        </div>

        <div className="text-center mt-16 p-8 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            لم تجد إجابة لسؤالك؟
          </h3>
          <p className="text-muted-foreground mb-6">
            تواصل معنا مباشرة وسيسعدنا الإجابة على جميع استفساراتك
          </p>
          <a
            href="#contact-form"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-full font-semibold hover:bg-primary-dark transition-colors"
          >
            تواصل معنا الآن
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
