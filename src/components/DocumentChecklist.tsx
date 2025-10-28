import { useState } from "react";
import { FileCheck, Download, CheckSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const checklists = [
  {
    id: "dv-lottery",
    title: "القرعة الأمريكية (DV Lottery)",
    icon: "🇺🇸",
    documents: [
      "صورة شخصية حديثة (بمواصفات محددة)",
      "جواز سفر ساري المفعول",
      "شهادة الميلاد",
      "شهادة الثانوية العامة أو ما يعادلها",
      "شهادات الخبرة المهنية (إن وجدت)",
      "معلومات الزوج/ة والأطفال (إن وجد)"
    ]
  },
  {
    id: "canada-express",
    title: "الهجرة إلى كندا (Express Entry)",
    icon: "🇨🇦",
    documents: [
      "جواز السفر ساري المفعول",
      "شهادة الثانوية والشهادات الجامعية",
      "تقييم الشهادات من WES أو ICAS",
      "نتائج اختبار اللغة (IELTS أو TEF)",
      "شهادات الخبرة المهنية",
      "كشف حساب بنكي (Proof of Funds)",
      "شهادة الميلاد وجواز سفر أفراد العائلة",
      "شهادة عدم السوابق العدلية",
      "الفحص الطبي"
    ]
  },
  {
    id: "work-visa",
    title: "تأشيرة العمل",
    icon: "💼",
    documents: [
      "جواز سفر ساري المفعول",
      "عرض عمل من صاحب عمل معتمد",
      "الشهادات الدراسية",
      "شهادات الخبرة المهنية",
      "السيرة الذاتية (CV)",
      "رسائل التوصية",
      "شهادة عدم السوابق العدلية",
      "الفحص الطبي",
      "إثبات القدرة المالية"
    ]
  },
  {
    id: "study",
    title: "الدراسة في الخارج",
    icon: "🎓",
    documents: [
      "جواز سفر ساري المفعول",
      "قبول جامعي (Letter of Acceptance)",
      "كشوفات الدرجات الأكاديمية",
      "الشهادات الدراسية السابقة",
      "نتائج اختبار اللغة (IELTS, TOEFL)",
      "إثبات القدرة المالية لتغطية الرسوم",
      "خطاب الدافع (Statement of Purpose)",
      "رسائل التوصية",
      "الفحص الطبي",
      "تأمين صحي"
    ]
  },
  {
    id: "family",
    title: "لم شمل العائلة",
    icon: "👨‍👩‍👧",
    documents: [
      "جواز السفر لجميع أفراد العائلة",
      "شهادات الميلاد",
      "عقد الزواج (للزوج/ة)",
      "إثبات العلاقة الأسرية",
      "كشف حساب بنكي للكفيل",
      "إثبات إقامة الكفيل",
      "شهادة عدم السوابق العدلية",
      "صور شخصية لجميع أفراد العائلة",
      "الفحص الطبي"
    ]
  },
  {
    id: "sports",
    title: "مواهب كرة القدم",
    icon: "⚽",
    documents: [
      "جواز سفر ساري المفعول",
      "السيرة الذاتية الرياضية",
      "شهادات المشاركة في المسابقات",
      "فيديوهات للأداء الرياضي",
      "رسائل توصية من مدربين",
      "الشهادة الدراسية",
      "الفحص الطبي الرياضي",
      "شهادة حسن السيرة والسلوك"
    ]
  }
];

const DocumentChecklist = () => {
  const [selectedChecklist, setSelectedChecklist] = useState(checklists[0].id);
  const activeChecklist = checklists.find(c => c.id === selectedChecklist) || checklists[0];

  return (
    <section dir="rtl" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <FileCheck className="w-5 h-5 text-primary" />
            <span className="text-primary font-semibold">الوثائق المطلوبة</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            قائمة الوثائق حسب الخدمة
          </h2>
          <p className="text-xl text-muted-foreground">
            تعرف على الوثائق المطلوبة لكل نوع من خدماتنا
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Service Selector */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {checklists.map((checklist, index) => (
              <button
                key={checklist.id}
                onClick={() => setSelectedChecklist(checklist.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 animate-fade-in-up ${
                  selectedChecklist === checklist.id
                    ? "border-primary bg-primary/10 shadow-lg"
                    : "border-border bg-card hover:border-primary/50"
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="text-3xl mb-2">{checklist.icon}</div>
                <div className={`text-sm font-semibold ${
                  selectedChecklist === checklist.id ? "text-primary" : "text-muted-foreground"
                }`}>
                  {checklist.title.split(" ")[0]}
                </div>
              </button>
            ))}
          </div>

          {/* Checklist Display */}
          <Card className="p-8 border-2">
            <div className="flex items-center justify-between mb-8 pb-6 border-b">
              <div className="flex items-center gap-4">
                <div className="text-5xl">{activeChecklist.icon}</div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-1">
                    {activeChecklist.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {activeChecklist.documents.length} وثيقة مطلوبة
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => alert("ستتم إضافة رابط التحميل قريباً")}
              >
                <Download className="w-4 h-4" />
                تحميل PDF
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {activeChecklist.documents.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CheckSquare className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{doc}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-primary/10 rounded-xl">
              <h4 className="font-bold text-foreground mb-2">ملاحظة هامة:</h4>
              <p className="text-muted-foreground leading-relaxed">
                جميع الوثائق يجب أن تكون أصلية أو نسخ مصدقة. الوثائق بلغات أخرى غير الإنجليزية أو الفرنسية تحتاج إلى ترجمة معتمدة. نحن نساعدك في إعداد وترجمة جميع الوثائق المطلوبة.
              </p>
            </div>
          </Card>

          {/* CTA */}
          <div className="text-center mt-12">
            <Card className="inline-block p-8 bg-gradient-to-br from-primary/10 to-accent/10">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                نساعدك في إعداد الوثائق
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl">
                لا تقلق بشأن الأوراق! فريقنا سيساعدك في جمع وإعداد وترجمة جميع الوثائق المطلوبة
              </p>
              <a
                href="#contact-form"
                className="inline-block px-8 py-4 bg-primary text-white rounded-full font-semibold hover:bg-primary-dark transition-colors"
              >
                تواصل معنا للمساعدة
              </a>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DocumentChecklist;
