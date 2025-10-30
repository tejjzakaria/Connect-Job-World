import { Shield, Globe, Bell, Database, Loader2, User as UserIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/admin/DashboardLayout";
import { useState, useEffect } from "react";
import { clientsAPI, submissionsAPI } from "@/lib/api";

const Settings = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [totalClients, setTotalClients] = useState(0);
  const [totalSubmissions, setTotalSubmissions] = useState(0);

  useEffect(() => {
    fetchAccountStats();
  }, []);

  const fetchAccountStats = async () => {
    try {
      setIsLoading(true);
      const [clientStatsRes, submissionStatsRes] = await Promise.all([
        clientsAPI.getStats(),
        submissionsAPI.getStats()
      ]);

      if (clientStatsRes.success) {
        setTotalClients(clientStatsRes.data.total || 0);
      }

      if (submissionStatsRes.success) {
        setTotalSubmissions(submissionStatsRes.data.total || 0);
      }
    } catch (error: any) {
      console.error("Error fetching account stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // System info
  const systemInfo = {
    version: "1.0.0",
    lastUpdate: new Date().toLocaleDateString('en-GB'),
    database: "MongoDB Atlas",
    apiStatus: "متصل",
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-foreground">الإعدادات</h2>
          <p className="text-muted-foreground mt-1">
            إدارة الحساب والإعدادات العامة
          </p>
        </div>

        {/* Account Information */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-lg bg-blue-100">
              <UserIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">معلومات الحساب</h3>
              <p className="text-sm text-muted-foreground">تفاصيل حول حسابك ونشاطك</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
              <p className="text-sm text-muted-foreground mb-1">الاسم</p>
              <p className="text-lg font-semibold text-foreground">{user?.name || "N/A"}</p>
            </div>

            <div className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
              <p className="text-sm text-muted-foreground mb-1">البريد الإلكتروني</p>
              <p className="text-lg font-semibold text-foreground">{user?.email || "N/A"}</p>
            </div>

            <div className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
              <p className="text-sm text-muted-foreground mb-1">الدور</p>
              <p className="text-lg font-semibold text-foreground capitalize">
                {user?.role === "admin" ? "مدير" : user?.role === "agent" ? "موظف" : "مشاهد"}
              </p>
            </div>

            <div className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
              <p className="text-sm text-muted-foreground mb-1">إجمالي العملاء</p>
              <p className="text-lg font-semibold text-foreground">{totalClients}</p>
            </div>

            <div className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
              <p className="text-sm text-muted-foreground mb-1">إجمالي الطلبات</p>
              <p className="text-lg font-semibold text-foreground">{totalSubmissions}</p>
            </div>

            <div className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
              <p className="text-sm text-muted-foreground mb-1">معرف الحساب</p>
              <p className="text-sm font-semibold text-foreground truncate">{user?.id || "N/A"}</p>
            </div>
          </div>
        </Card>

        {/* System Information */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-lg bg-purple-100">
              <Database className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">معلومات النظام</h3>
              <p className="text-sm text-muted-foreground">تفاصيل حول النظام والخدمات</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
              <p className="text-sm text-muted-foreground mb-1">إصدار النظام</p>
              <p className="text-lg font-semibold text-foreground">{systemInfo.version}</p>
            </div>

            <div className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
              <p className="text-sm text-muted-foreground mb-1">آخر تحديث</p>
              <p className="text-lg font-semibold text-foreground">{systemInfo.lastUpdate}</p>
            </div>

            <div className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
              <p className="text-sm text-muted-foreground mb-1">قاعدة البيانات</p>
              <p className="text-lg font-semibold text-foreground">{systemInfo.database}</p>
            </div>

            <div className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
              <p className="text-sm text-muted-foreground mb-1">حالة API</p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <p className="text-lg font-semibold text-green-600">{systemInfo.apiStatus}</p>
              </div>
            </div>

            <div className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
              <p className="text-sm text-muted-foreground mb-1">التقنيات المستخدمة</p>
              <p className="text-sm font-semibold text-foreground">React + TypeScript</p>
            </div>

            <div className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
              <p className="text-sm text-muted-foreground mb-1">الخادم</p>
              <p className="text-sm font-semibold text-foreground">Node.js + Express</p>
            </div>
          </div>

          {/* Platform Features */}
          <div className="mt-6 pt-6 border-t border-border">
            <h4 className="font-semibold text-foreground mb-4">مميزات المنصة</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-sm text-foreground">مصادقة JWT آمنة</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <Database className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-foreground">تخزين سحابي MongoDB</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                <Globe className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-foreground">روابط رفع مستندات آمنة</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
                <Bell className="w-4 h-4 text-orange-600" />
                <span className="text-sm text-foreground">نظام إشعارات متقدم</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Security Notice */}
        <Card className="p-6 bg-primary/5 border-primary/20">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-primary mt-1" />
            <div>
              <h4 className="font-bold text-foreground mb-2">ملاحظة أمنية</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                معلومات حسابك محمية ولا يمكن تعديلها من خلال لوحة التحكم. لتغيير أي معلومات، يرجى الاتصال بمسؤول النظام.
                جميع الأنشطة في هذا الحساب مسجلة ومراقبة لضمان الأمان.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
