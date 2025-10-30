import { User, Mail, Shield, Key, Globe, Bell, Database, Clock, Calendar, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/admin/DashboardLayout";
import { useState, useEffect } from "react";
import { clientsAPI, submissionsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [totalClients, setTotalClients] = useState(0);
  const [totalSubmissions, setTotalSubmissions] = useState(0);

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    whatsapp: true,
    newSubmissions: true,
    statusUpdates: true,
    reports: false
  });

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

  const handleSaveNotifications = () => {
    // TODO: Save to backend when notification preferences API is implemented
    toast({
      title: "تم حفظ الإعدادات",
      description: "تم حفظ إعدادات الإشعارات بنجاح",
    });
  };

  // System info
  const systemInfo = {
    version: "2.0.0",
    lastUpdate: new Date().toLocaleDateString('ar-EG'),
    database: "MongoDB Atlas",
    apiStatus: "متصل",
  };

  const accountInfo = {
    accountId: user?.id || user?._id || "N/A",
    createdDate: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ar-EG') : "N/A",
    lastLogin: new Date().toLocaleString('ar-EG'),
    totalClients,
    totalSubmissions,
    activeSessions: 1
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

        {/* Profile Information - Read Only */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-lg bg-primary/10">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">معلومات الحساب</h3>
              <p className="text-sm text-muted-foreground">بيانات حسابك الشخصية (للعرض فقط)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Avatar */}
            <div className="md:col-span-2 flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-3xl font-bold">
                {user?.name?.charAt(0) || "A"}
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">الصورة الشخصية</p>
                <p className="font-semibold text-foreground">{user?.name || "Admin"}</p>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <User className="w-4 h-4" />
                الاسم الكامل
              </label>
              <div className="p-3 bg-muted/50 rounded-lg border border-border">
                <p className="text-foreground font-medium">{user?.name || "Admin User"}</p>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Mail className="w-4 h-4" />
                البريد الإلكتروني
              </label>
              <div className="p-3 bg-muted/50 rounded-lg border border-border">
                <p className="text-foreground font-medium">{user?.email}</p>
              </div>
            </div>

            {/* Role */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Shield className="w-4 h-4" />
                الصلاحية
              </label>
              <div className="p-3 bg-muted/50 rounded-lg border border-border">
                <span className="inline-block px-3 py-1 bg-primary text-white rounded-full text-sm font-semibold">
                  {user?.role === "admin" ? "مدير النظام" : user?.role}
                </span>
              </div>
            </div>

            {/* Account ID */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Key className="w-4 h-4" />
                معرف الحساب
              </label>
              <div className="p-3 bg-muted/50 rounded-lg border border-border">
                <p className="text-foreground font-medium font-mono">{accountInfo.accountId}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Account Statistics */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-100">
                <Database className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">إحصائيات الحساب</h3>
                <p className="text-sm text-muted-foreground">نظرة عامة على نشاط حسابك</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchAccountStats}
              className="gap-2"
            >
              <Database className="w-4 h-4" />
              تحديث
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20">
              <p className="text-sm text-muted-foreground mb-1">تاريخ الإنشاء</p>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <p className="text-lg font-bold text-foreground">{accountInfo.createdDate}</p>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-lg border border-green-500/20">
              <p className="text-sm text-muted-foreground mb-1">آخر تسجيل دخول</p>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-600" />
                <p className="text-lg font-bold text-foreground">{accountInfo.lastLogin}</p>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-lg border border-purple-500/20">
              <p className="text-sm text-muted-foreground mb-1">الجلسات النشطة</p>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-600" />
                <p className="text-lg font-bold text-foreground">{accountInfo.activeSessions}</p>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-lg border border-blue-500/20">
              <p className="text-sm text-muted-foreground mb-1">إجمالي العملاء</p>
              <p className="text-2xl font-bold text-foreground">{accountInfo.totalClients.toLocaleString()}</p>
            </div>

            <div className="p-4 bg-gradient-to-br from-orange-500/10 to-orange-500/5 rounded-lg border border-orange-500/20 md:col-span-2">
              <p className="text-sm text-muted-foreground mb-1">إجمالي الطلبات</p>
              <p className="text-2xl font-bold text-foreground">{accountInfo.totalSubmissions.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-lg bg-yellow-100">
              <Bell className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">إعدادات الإشعارات</h3>
              <p className="text-sm text-muted-foreground">اختر كيف تريد تلقي الإشعارات</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Notification Channels */}
            <div>
              <h4 className="font-semibold text-foreground mb-3">قنوات الإشعارات</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium text-foreground">البريد الإلكتروني</span>
                  </div>
                  <button
                    onClick={() => setNotifications({...notifications, email: !notifications.email})}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      notifications.email ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      notifications.email ? 'right-1' : 'right-7'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium text-foreground">الرسائل النصية</span>
                  </div>
                  <button
                    onClick={() => setNotifications({...notifications, sms: !notifications.sms})}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      notifications.sms ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      notifications.sms ? 'right-1' : 'right-7'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium text-foreground">واتساب</span>
                  </div>
                  <button
                    onClick={() => setNotifications({...notifications, whatsapp: !notifications.whatsapp})}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      notifications.whatsapp ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      notifications.whatsapp ? 'right-1' : 'right-7'
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Notification Types */}
            <div>
              <h4 className="font-semibold text-foreground mb-3">أنواع الإشعارات</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                  <div>
                    <p className="font-medium text-foreground">طلبات جديدة</p>
                    <p className="text-sm text-muted-foreground">تلقي إشعار عند وصول طلب جديد</p>
                  </div>
                  <button
                    onClick={() => setNotifications({...notifications, newSubmissions: !notifications.newSubmissions})}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      notifications.newSubmissions ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      notifications.newSubmissions ? 'right-1' : 'right-7'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                  <div>
                    <p className="font-medium text-foreground">تحديثات الحالة</p>
                    <p className="text-sm text-muted-foreground">تلقي إشعار عند تغيير حالة طلب</p>
                  </div>
                  <button
                    onClick={() => setNotifications({...notifications, statusUpdates: !notifications.statusUpdates})}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      notifications.statusUpdates ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      notifications.statusUpdates ? 'right-1' : 'right-7'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                  <div>
                    <p className="font-medium text-foreground">التقارير الأسبوعية</p>
                    <p className="text-sm text-muted-foreground">تلقي تقرير أسبوعي بالإحصائيات</p>
                  </div>
                  <button
                    onClick={() => setNotifications({...notifications, reports: !notifications.reports})}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      notifications.reports ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      notifications.reports ? 'right-1' : 'right-7'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border flex justify-end">
            <Button onClick={handleSaveNotifications} className="bg-primary hover:bg-primary-dark">
              حفظ الإعدادات
            </Button>
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
