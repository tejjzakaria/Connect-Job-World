import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, User, Mail, Phone, FileText, MessageSquare, Calendar, Save } from "lucide-react";
import { clientsAPI } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DashboardLayout from "@/components/admin/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

const AddClient = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    status: "new",
    message: ""
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const services = [
    { key: "us_lottery", label: t('submissions.serviceUSLottery') },
    { key: "canada_immigration", label: t('submissions.serviceCanadaImmigration') },
    { key: "work_visa", label: t('submissions.serviceWorkVisa') },
    { key: "study_abroad", label: t('submissions.serviceStudyAbroad') },
    { key: "family_reunion", label: t('submissions.serviceFamilyReunion') },
    { key: "soccer_talent", label: t('submissions.serviceSoccerTalent') }
  ];

  const statuses = [
    { key: "new", label: t('status.new') },
    { key: "in_review", label: t('status.inProgress') },
    { key: "completed", label: t('status.completed') },
    { key: "rejected", label: t('status.rejected') }
  ];

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = t("errors.nameRequired");
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t("errors.phoneRequired");
    } else if (!/^[\d\s\+\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = t("errors.phoneInvalid");
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("errors.emailInvalid");
    }

    if (!formData.service) {
      newErrors.service = t("errors.serviceRequired");
    }

    if (!formData.message.trim()) {
      newErrors.message = t("errors.messageRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى التحقق من جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await clientsAPI.create({
        name: formData.name,
        email: formData.email || undefined,
        phone: formData.phone,
        service: formData.service,
        status: formData.status,
        message: formData.message,
      });

      if (response.success) {
        toast({
          title: "تم بنجاح!",
          description: "تمت إضافة العميل بنجاح",
        });
        navigate("/admin/clients");
      } else {
        throw new Error("Failed to create client");
      }
    } catch (error: any) {
      console.error("Error creating client:", error);
      toast({
        title: "حدث خطأ",
        description: error.message || "يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/admin/clients")}
                className="gap-2"
              >
                <ArrowRight className="w-4 h-4" />
                {t("common.back")}
              </Button>
            </div>
            <h2 className="text-3xl font-bold text-foreground">{t("clients.addClient")}</h2>
            <p className="text-muted-foreground mt-1">
              {t("clients.addClientDescription")}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <Card className="p-6 mb-6">
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              {t("clients.basicInfo")}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  {t("clients.fullName")} <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="مثال: أحمد محمد العلوي"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`h-12 ${errors.name ? "border-red-500" : ""}`}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  {t("clients.email")} <span className="text-muted-foreground text-xs">(اختياري)</span>
                </label>
                <Input
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`h-12 ${errors.email ? "border-red-500" : ""}`}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  {t("clients.phone")} <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="+212 612 345 678"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={`h-12 ${errors.phone ? "border-red-500" : ""}`}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              {/* Service */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  {t("clients.service")} <span className="text-red-500">*</span>
                </label>
                <Select value={formData.service} onValueChange={(value) => handleInputChange("service", value)}>
                  <SelectTrigger className={`h-12 ${errors.service ? "border-red-500" : ""}`}>
                    <SelectValue placeholder={t("clients.selectService")} />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.key} value={service.key}>
                        {service.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.service && (
                  <p className="text-sm text-red-500">{errors.service}</p>
                )}
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  {t("clients.status")} <span className="text-red-500">*</span>
                </label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status.key} value={status.key}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Auto Date Display */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  {t("clients.date")}
                </label>
                <div className="h-12 px-4 py-3 bg-muted/50 border border-border rounded-lg text-muted-foreground">
                  {new Date().toISOString().split('T')[0]}
                </div>
              </div>
            </div>
          </Card>

          {/* Additional Information */}
          <Card className="p-6 mb-6">
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              {t("clients.additionalInfo")}
            </h3>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
                {t("clients.message")} <span className="text-red-500">*</span>
              </label>
              <Textarea
                placeholder="أدخل تفاصيل الطلب أو أي ملاحظات إضافية..."
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                className={`min-h-32 resize-none ${errors.message ? "border-red-500" : ""}`}
              />
              {errors.message && (
                <p className="text-sm text-red-500">{errors.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                اكتب أي معلومات إضافية حول طلب العميل أو احتياجاته الخاصة
              </p>
            </div>
          </Card>

          {/* Form Actions */}
          <div className="flex items-center gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/clients")}
              disabled={isSubmitting}
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              className="gap-2 bg-primary hover:bg-primary-dark min-w-32"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t("common.saving")}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {t("clients.saveClient")}
                </>
              )}
            </Button>
          </div>

          {/* Required Fields Notice */}
          <Card className="p-4 bg-blue-50 border-blue-200 mt-6">
            <p className="text-sm text-blue-800 flex items-start gap-2">
              <span className="text-red-500 mt-0.5">*</span>
              <span>{t("common.requiredFields")}</span>
            </p>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddClient;
