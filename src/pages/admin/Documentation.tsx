import {
  BookOpen,
  FileText,
  Users,
  CheckCircle,
  Phone,
  Upload,
  Shield,
  ArrowLeft,
  Eye,
  Link,
  Clock,
  AlertCircle,
  Send,
  UserCheck,
  UserCog,
  Activity,
  Lock,
  UserPlus
} from "lucide-react";
import { Card } from "@/components/ui/card";
import DashboardLayout from "@/components/admin/DashboardLayout";

const Documentation = () => {
  const workflowSteps = [
    {
      number: 1,
      title: "استقبال الطلب",
      status: "جديد",
      icon: FileText,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      description: "يتم استقبال الطلب من العميل عبر نموذج الموقع أو القنوات الأخرى",
      action: "مراجعة البيانات الأولية"
    },
    {
      number: 2,
      title: "التحقق من البيانات",
      status: "pending_validation → validated",
      icon: Shield,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      description: "التأكد من صحة واكتمال البيانات المقدمة من العميل",
      action: "الضغط على زر 'التحقق من البيانات'"
    },
    {
      number: 3,
      title: "التواصل الهاتفي",
      status: "validated → call_confirmed",
      icon: Phone,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      description: "التواصل مع العميل عبر الهاتف وتأكيد التفاصيل",
      action: "الضغط على زر 'تأكيد المكالمة' وإضافة ملاحظات"
    },
    {
      number: 4,
      title: "طلب المستندات",
      status: "call_confirmed → documents_requested",
      icon: Send,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      description: "إنشاء رابط آمن لرفع المستندات المطلوبة",
      action: "الضغط على زر 'طلب المستندات' وإرسال الرابط للعميل"
    },
    {
      number: 5,
      title: "رفع المستندات",
      status: "documents_requested → documents_uploaded",
      icon: Upload,
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50",
      description: "العميل يقوم برفع المستندات عبر الرابط الآمن",
      action: "انتظار رفع المستندات من العميل"
    },
    {
      number: 6,
      title: "التحقق من المستندات",
      status: "documents_uploaded → documents_verified",
      icon: Eye,
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      description: "مراجعة والتحقق من صحة المستندات المرفوعة",
      action: "تحديد حالة كل مستند (موثق/مرفوض/يحتاج استبدال)"
    },
    {
      number: 7,
      title: "التحويل لعميل",
      status: "documents_verified → converted_to_client",
      icon: UserCheck,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      description: "تحويل الطلب إلى عميل نشط في النظام",
      action: "الضغط على زر 'تحويل إلى عميل'"
    }
  ];

  const features = [
    {
      icon: FileText,
      title: "إدارة الطلبات",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      items: [
        "عرض جميع الطلبات مع إمكانية البحث والتصفية",
        "تتبع حالة كل طلب في مراحل العمل المختلفة",
        "إضافة وتعديل وحذف الطلبات",
        "عرض تفاصيل كاملة لكل طلب"
      ]
    },
    {
      icon: Users,
      title: "إدارة العملاء",
      color: "text-green-500",
      bgColor: "bg-green-50",
      items: [
        "قاعدة بيانات شاملة لجميع العملاء",
        "عرض المستندات المرفقة لكل عميل",
        "تعديل بيانات العملاء",
        "حذف سجلات العملاء عند الحاجة"
      ]
    },
    {
      icon: UserCog,
      title: "إدارة الموظفين",
      color: "text-indigo-500",
      bgColor: "bg-indigo-50",
      items: [
        "إضافة موظفين جدد مع تحديد الأدوار",
        "تفعيل وإلغاء تفعيل حسابات الموظفين",
        "تعديل معلومات وصلاحيات الموظفين",
        "نظام صلاحيات متقدم (مدير، موظف، مشاهد)"
      ]
    },
    {
      icon: Upload,
      title: "نظام المستندات",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      items: [
        "إنشاء روابط آمنة ومشفرة للرفع",
        "تحديد صلاحية الروابط (عدد الأيام)",
        "تخزين منظم بأسماء موحدة للملفات",
        "تحميل المستندات بنقرة واحدة"
      ]
    },
    {
      icon: Activity,
      title: "تسجيل الأنشطة",
      color: "text-cyan-500",
      bgColor: "bg-cyan-50",
      items: [
        "تسجيل تلقائي لجميع العمليات",
        "تتبع تسجيل الدخول والخروج",
        "مراقبة التعديلات على البيانات",
        "إحصائيات مفصلة عن النشاطات"
      ]
    },
    {
      icon: Shield,
      title: "الأمان والخصوصية",
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      items: [
        "مصادقة آمنة بنظام JWT",
        "روابط رفع المستندات محمية برموز فريدة",
        "تخزين آمن للبيانات في قاعدة MongoDB",
        "حماية جميع المسارات بنظام المصادقة"
      ]
    }
  ];

  const documentTypes = [
    { name: "جواز السفر", key: "passport" },
    { name: "بطاقة الهوية الوطنية", key: "national_id" },
    { name: "شهادة الميلاد", key: "birth_certificate" },
    { name: "الشهادة الدراسية", key: "diploma" },
    { name: "عقد العمل", key: "work_contract" },
    { name: "كشف حساب بنكي", key: "bank_statement" },
    { name: "إثبات العنوان", key: "proof_of_address" },
    { name: "عقد الزواج", key: "marriage_certificate" },
    { name: "السجل العدلي", key: "police_clearance" },
    { name: "تقرير طبي", key: "medical_report" },
    { name: "أخرى", key: "other" }
  ];

  const bestPractices = [
    {
      icon: CheckCircle,
      title: "التحقق السريع",
      description: "تحقق من البيانات خلال 24 ساعة من استلام الطلب"
    },
    {
      icon: Phone,
      title: "التواصل الفعال",
      description: "تواصل مع العميل مباشرة لتأكيد التفاصيل وبناء الثقة"
    },
    {
      icon: Clock,
      title: "المتابعة المنتظمة",
      description: "تابع حالة المستندات وذكر العملاء عند الحاجة"
    },
    {
      icon: AlertCircle,
      title: "الوضوح والشفافية",
      description: "أبقِ العميل على علم بحالة طلبه في كل مرحلة"
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="animate-fade-in-up">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-xl">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground">دليل استخدام المنصة</h2>
              <p className="text-muted-foreground mt-1">
                كل ما تحتاج معرفته عن نظام إدارة الطلبات والعملاء
              </p>
            </div>
          </div>
        </div>

        {/* Platform Overview */}
        <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
          <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            نظرة عامة على المنصة
          </h3>
          <p className="text-foreground leading-relaxed mb-4">
            منصة <span className="font-bold text-primary">Connect Job World</span> هي نظام متكامل لإدارة طلبات الهجرة والتأشيرات
            والخدمات المرتبطة. تم تصميم النظام لتبسيط عملية معالجة الطلبات من الاستقبال الأولي وحتى التحويل إلى عميل نشط.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <div className="text-3xl font-bold text-primary mb-1">7</div>
              <div className="text-sm text-muted-foreground">مراحل العمل</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <div className="text-3xl font-bold text-green-600 mb-1">11</div>
              <div className="text-sm text-muted-foreground">نوع من المستندات</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <div className="text-3xl font-bold text-purple-600 mb-1">6</div>
              <div className="text-sm text-muted-foreground">خدمات متاحة</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <div className="text-3xl font-bold text-indigo-600 mb-1">3</div>
              <div className="text-sm text-muted-foreground">أدوار مستخدمين</div>
            </div>
          </div>
        </Card>

        {/* Workflow Steps */}
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-6">مراحل معالجة الطلب</h3>
          <div className="space-y-4">
            {workflowSteps.map((step, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start gap-4">
                  {/* Step Number */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold text-lg`}>
                    {step.number}
                  </div>

                  {/* Step Icon */}
                  <div className={`flex-shrink-0 p-3 rounded-xl ${step.bgColor}`}>
                    <step.icon className="w-6 h-6" style={{ color: step.color.split(' ')[0].replace('from-', '') }} />
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h4 className="text-xl font-bold text-foreground">{step.title}</h4>
                      <span className="text-xs font-mono bg-muted px-3 py-1 rounded-full whitespace-nowrap">
                        {step.status}
                      </span>
                    </div>
                    <p className="text-muted-foreground mb-3">{step.description}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <ArrowLeft className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-primary">{step.action}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* User Roles & Permissions */}
        <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200">
          <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Lock className="w-6 h-6 text-indigo-600" />
            الأدوار والصلاحيات
          </h3>
          <p className="text-muted-foreground mb-6">
            النظام يدعم ثلاثة أدوار مختلفة لضمان التحكم الكامل في الصلاحيات والوصول
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-lg border-2 border-red-200">
              <div className="flex items-center gap-2 mb-3">
                <UserCog className="w-5 h-5 text-red-600" />
                <h4 className="font-bold text-red-600">مدير (Admin)</h4>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>صلاحيات كاملة على النظام</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>إدارة الموظفين والأدوار</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>عرض سجلات الأنشطة</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>حذف العملاء والطلبات</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-5 rounded-lg border-2 border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <UserPlus className="w-5 h-5 text-blue-600" />
                <h4 className="font-bold text-blue-600">موظف (Agent)</h4>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>إدارة العملاء والطلبات</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>رفع وإدارة المستندات</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>رؤية العملاء المخصصين فقط</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>لا يمكن حذف البيانات</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-5 rounded-lg border-2 border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <Eye className="w-5 h-5 text-gray-600" />
                <h4 className="font-bold text-gray-600">مشاهد (Viewer)</h4>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                  <span>عرض التقارير والإحصائيات</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                  <span>الوصول للقراءة فقط</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                  <span>لا يمكن تعديل البيانات</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                  <span>مناسب للمراقبة والإشراف</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Features Grid */}
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-6">المميزات الرئيسية</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-xl ${feature.bgColor}`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h4 className="text-xl font-bold text-foreground">{feature.title}</h4>
                </div>
                <ul className="space-y-2">
                  {feature.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>

        {/* Document Types */}
        <Card className="p-6">
          <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            أنواع المستندات المدعومة
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {documentTypes.map((doc, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm text-foreground">{doc.name}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Document Upload Guide */}
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
          <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Link className="w-5 h-5 text-purple-600" />
            كيفية عمل نظام رفع المستندات
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">إنشاء الرابط</p>
                <p className="text-sm text-muted-foreground">
                  اضغط على "طلب المستندات" في صفحة تفاصيل الطلب لإنشاء رابط آمن ومشفر
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">إرسال الرابط</p>
                <p className="text-sm text-muted-foreground">
                  انسخ الرابط وأرسله للعميل عبر واتساب أو البريد الإلكتروني
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">رفع المستندات</p>
                <p className="text-sm text-muted-foreground">
                  العميل يفتح الرابط ويقوم برفع المستندات المطلوبة (حتى 10 ملفات)
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                4
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">المراجعة</p>
                <p className="text-sm text-muted-foreground">
                  ستظهر المستندات في صفحة إدارة المستندات لمراجعتها والتحقق منها
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Employee Management Guide */}
        <Card className="p-6 bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200">
          <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <UserCog className="w-5 h-5 text-cyan-600" />
            إدارة الموظفين
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">إضافة موظف جديد</p>
                <p className="text-sm text-muted-foreground">
                  من صفحة الموظفين، اضغط "إضافة موظف جديد" وأدخل البيانات (الاسم، البريد، كلمة المرور، الدور)
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">تعديل الصلاحيات</p>
                <p className="text-sm text-muted-foreground">
                  يمكنك تغيير دور أي موظف (مدير، موظف، مشاهد) في أي وقت من خلال زر "تعديل"
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">إلغاء التفعيل</p>
                <p className="text-sm text-muted-foreground">
                  بدلاً من الحذف، يمكنك إلغاء تفعيل حساب الموظف مؤقتاً للحفاظ على سجلات الأنشطة
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                4
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">البحث والتصفية</p>
                <p className="text-sm text-muted-foreground">
                  استخدم البحث للعثور على موظف معين، أو صفي حسب الدور أو الحالة (نشط/غير نشط)
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Activity Logging Guide */}
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
          <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-600" />
            تسجيل الأنشطة
          </h3>
          <p className="text-muted-foreground mb-4">
            النظام يسجل تلقائياً جميع العمليات المهمة لضمان الشفافية والأمان:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <h5 className="font-semibold text-foreground mb-2">أنشطة المستخدمين</h5>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  تسجيل الدخول والخروج
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  إنشاء وتعديل الموظفين
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  تفعيل/إلغاء تفعيل الحسابات
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  تغيير كلمات المرور
                </li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg border border-green-200">
              <h5 className="font-semibold text-foreground mb-2">أنشطة العملاء والطلبات</h5>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  إنشاء وتعديل العملاء
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  التحقق من الطلبات
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  تأكيد المكالمات
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  التحويل إلى عميل
                </li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg border border-green-200">
              <h5 className="font-semibold text-foreground mb-2">أنشطة المستندات</h5>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  إنشاء روابط الرفع
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  التحقق من المستندات
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  رفض المستندات
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  حذف المستندات
                </li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg border border-green-200">
              <h5 className="font-semibold text-foreground mb-2">معلومات إضافية</h5>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  عنوان IP المستخدم
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  نوع المتصفح
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  تاريخ ووقت الإجراء
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  تفاصيل العملية
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-4 bg-white rounded-lg border-2 border-green-300">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">ملاحظة:</span> يمكن للمديرين فقط الوصول إلى سجلات الأنشطة من خلال قسم خاص في لوحة التحكم
            </p>
          </div>
        </Card>

        {/* Best Practices */}
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-6">أفضل الممارسات</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bestPractices.map((practice, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <practice.icon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-2">{practice.title}</h4>
                    <p className="text-sm text-muted-foreground">{practice.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Status Guide */}
        <Card className="p-6">
          <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-primary" />
            دليل حالات الطلبات
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="font-semibold text-foreground">جديد</span>
              </div>
              <p className="text-sm text-muted-foreground">طلب جديد تم استقباله ولم تتم مراجعته بعد</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="font-semibold text-foreground">تمت المعاينة</span>
              </div>
              <p className="text-sm text-muted-foreground">تم التحقق من البيانات بنجاح</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="font-semibold text-foreground">تم التواصل</span>
              </div>
              <p className="text-sm text-muted-foreground">تم التواصل مع العميل وتأكيد التفاصيل</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="font-semibold text-foreground">مكتمل</span>
              </div>
              <p className="text-sm text-muted-foreground">تم إكمال جميع المراحل وتحويله لعميل</p>
            </div>
          </div>
        </Card>

        {/* Quick Tips */}
        <Card className="p-6 bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200">
          <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            نصائح سريعة
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-foreground">
                استخدم البحث والتصفية للوصول السريع إلى الطلبات والعملاء
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-foreground">
                اجعل روابط رفع المستندات قصيرة المدة (3-7 أيام) للحفاظ على الأمان
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-foreground">
                راجع صفحة التقارير بانتظام لمتابعة أداء العمل
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-foreground">
                تأكد من تحديث حالة المستندات (موثق/مرفوض/يحتاج استبدال) قبل التحويل لعميل
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-foreground">
                امنح كل موظف الدور المناسب لعمله - لا تعطي صلاحيات المدير إلا عند الضرورة
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-foreground">
                راجع سجلات الأنشطة بشكل دوري لمراقبة العمليات وضمان الأمان
              </span>
            </li>
          </ul>
        </Card>

        {/* Security Best Practices */}
        <Card className="p-6 bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200">
          <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-600" />
            أفضل ممارسات الأمان
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground mb-1">كلمات المرور القوية</p>
                <p className="text-sm text-muted-foreground">
                  تأكد من أن جميع الموظفين يستخدمون كلمات مرور قوية (6 أحرف على الأقل، مزيج من الأحرف والأرقام)
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <UserCog className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground mb-1">مبدأ الحد الأدنى من الصلاحيات</p>
                <p className="text-sm text-muted-foreground">
                  امنح كل موظف فقط الصلاحيات التي يحتاجها لأداء عمله - لا أكثر ولا أقل
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Activity className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground mb-1">مراجعة سجلات الأنشطة</p>
                <p className="text-sm text-muted-foreground">
                  راجع سجلات الأنشطة بانتظام لاكتشاف أي نشاط غير عادي أو محاولات وصول غير مصرح بها
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground mb-1">إلغاء تفعيل الحسابات غير المستخدمة</p>
                <p className="text-sm text-muted-foreground">
                  عند مغادرة موظف، قم بإلغاء تفعيل حسابه فوراً للحفاظ على أمان النظام
                </p>
              </div>
            </li>
          </ul>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Documentation;
