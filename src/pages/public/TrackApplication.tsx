/**
 * TrackApplication.tsx
 *
 * Author: Zakaria TEJJANI
 * Email: contact@tejjzakaria.com
 * Date: 2025-11-03
 *
 * Description:
 * Public application tracking page allowing clients to check their submission status.
 * Provides a search interface where clients can enter their phone number or email to
 * retrieve their application information. Displays submission details including current
 * status, service type, submission date, and contact information. Features status indicators
 * with color-coded badges and includes links to document upload functionality. Helps clients
 * stay informed about their application progress without requiring admin panel access.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, CheckCircle, Clock, FileText, ArrowLeft, Phone, Mail } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatShortDate } from "@/lib/dateUtils";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

interface ApplicationData {
  name: string;
  phone: string;
  email?: string;
  service: string;
  status: string;
  workflowStatus?: string;
  timestamp: string;
  createdAt: string;
  documentStats: {
    total: number;
    verified: number;
  };
}

const WORKFLOW_STAGES = [
  { id: 'pending_validation', label: 'قيد المراجعة الأولية', icon: Clock },
  { id: 'validated', label: 'تم التحقق من البيانات', icon: CheckCircle },
  { id: 'call_confirmed', label: 'تم التواصل', icon: Phone },
  { id: 'documents_requested', label: 'طلب المستندات', icon: FileText },
  { id: 'documents_uploaded', label: 'تم رفع المستندات', icon: FileText },
  { id: 'documents_verified', label: 'تم التحقق من المستندات', icon: CheckCircle },
  { id: 'converted_to_client', label: 'تم القبول', icon: CheckCircle },
];

export default function TrackApplication() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [applicationData, setApplicationData] = useState<ApplicationData | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone && !email) {
      setError("يرجى إدخال رقم الهاتف أو البريد الإلكتروني");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/submissions/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'حدث خطأ أثناء البحث');
        setApplicationData(null);
        return;
      }

      setApplicationData(data.data);
      setError(null);
    } catch (err) {
      console.error('Error tracking application:', err);
      setError('حدث خطأ أثناء الاتصال بالخادم');
      setApplicationData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentStageIndex = (workflowStatus?: string) => {
    if (!workflowStatus) return 0;
    const index = WORKFLOW_STAGES.findIndex(stage => stage.id === workflowStatus);
    return index >= 0 ? index : 0;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "جديد":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "تمت المعاينة":
      case "تم التواصل":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "مكتمل":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="/logo-orange.png" alt="Connect Job World" className="h-10" />
              <h1 className="text-xl font-bold text-foreground">تتبع حالة الطلب</h1>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              العودة للرئيسية
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Search Card */}
          <Card className="p-8 mb-8 shadow-lg">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                تتبع حالة طلبك
              </h2>
              <p className="text-muted-foreground">
                أدخل رقم الهاتف أو البريد الإلكتروني المستخدم في التقديم
              </p>
            </div>

            <form onSubmit={handleTrack} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">رقم الهاتف</label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="tel"
                      placeholder="مثال: 0612345678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pr-10"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    البريد الإلكتروني <span className="text-muted-foreground">(اختياري)</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="example@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pr-10"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    جاري البحث...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    تتبع الطلب
                  </>
                )}
              </Button>
            </form>
          </Card>

          {/* Application Status */}
          {applicationData && (
            <div className="space-y-6 animate-fade-in">
              {/* User Info Card */}
              <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-1">
                      {applicationData.name}
                    </h3>
                    <p className="text-muted-foreground">{applicationData.service}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(applicationData.status)}`}>
                    {applicationData.status}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{applicationData.phone}</span>
                  </div>
                  {applicationData.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">{applicationData.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">
                      تاريخ التقديم: {formatShortDate(applicationData.timestamp || applicationData.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">
                      المستندات: {applicationData.documentStats.verified} / {applicationData.documentStats.total} موثقة
                    </span>
                  </div>
                </div>
              </Card>

              {/* Progress Timeline */}
              <Card className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-6">
                  مراحل معالجة الطلب
                </h3>

                <div className="space-y-4">
                  {WORKFLOW_STAGES.map((stage, index) => {
                    const currentIndex = getCurrentStageIndex(applicationData.workflowStatus);
                    const isCompleted = index <= currentIndex;
                    const isCurrent = index === currentIndex;
                    const Icon = stage.icon;

                    return (
                      <div key={stage.id} className="flex items-start gap-4">
                        {/* Icon */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isCompleted
                            ? 'bg-gradient-to-br from-primary to-accent text-white'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 pb-6 border-r-2 border-muted mr-5 pr-4 relative">
                          {index < WORKFLOW_STAGES.length - 1 && (
                            <div className={`absolute top-10 right-[-2px] bottom-0 w-0.5 ${
                              isCompleted ? 'bg-primary' : 'bg-muted'
                            }`} />
                          )}
                          <div className={`${isCurrent ? 'font-bold' : ''}`}>
                            <h4 className={`font-semibold ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {stage.label}
                            </h4>
                            {isCurrent && (
                              <p className="text-sm text-primary mt-1">المرحلة الحالية</p>
                            )}
                            {isCompleted && !isCurrent && (
                              <p className="text-sm text-green-600 mt-1">✓ مكتملة</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Info Card */}
              <Card className="p-6 bg-blue-50 border-blue-200">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">ملاحظة هامة</h4>
                    <p className="text-sm text-muted-foreground">
                      سيتم التواصل معك عبر الهاتف أو البريد الإلكتروني لأي تحديثات على حالة طلبك.
                      في حالة طلب مستندات إضافية، ستتلقى رابطاً خاصاً لرفعها.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© 2024 Connect Job World. جميع الحقوق محفوظة</p>
        </div>
      </footer>
    </div>
  );
}
