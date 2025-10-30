import { useState, useEffect } from "react";
import { TrendingUp, Users, FileText, CheckCircle, XCircle, Calendar, Award, Download, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DashboardLayout from "@/components/admin/DashboardLayout";
import { clientsAPI, submissionsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { formatShortDate, formatDateForExport, formatDateForFilename, formatNumber } from "@/lib/dateUtils";

interface ServiceStat {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

interface StatusStat {
  status: string;
  count: number;
  percentage: number;
  color: string;
}

const Analytics = () => {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState("month");
  const [isLoading, setIsLoading] = useState(true);

  const [totalClients, setTotalClients] = useState(0);
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [completedSubmissions, setCompletedSubmissions] = useState(0);
  const [successRate, setSuccessRate] = useState(0);
  const [serviceStats, setServiceStats] = useState<ServiceStat[]>([]);
  const [statusBreakdown, setStatusBreakdown] = useState<StatusStat[]>([]);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true);

      // Fetch stats from both APIs
      const [clientStatsRes, submissionStatsRes] = await Promise.all([
        clientsAPI.getStats(),
        submissionsAPI.getStats()
      ]);

      if (clientStatsRes.success && submissionStatsRes.success) {
        const clientData = clientStatsRes.data;
        const submissionData = submissionStatsRes.data;

        // Set totals
        setTotalClients(clientData.total || 0);
        setTotalSubmissions(submissionData.total || 0);

        // Calculate completed submissions and success rate
        const completed = submissionData.byStatus.find(
          (item: any) => item._id === "مكتمل"
        )?.count || 0;
        setCompletedSubmissions(completed);

        const rate = submissionData.total > 0
          ? Math.round((completed / submissionData.total) * 100)
          : 0;
        setSuccessRate(rate);

        // Process service statistics
        const services = submissionData.byService.map((item: any) => {
          const percentage = submissionData.total > 0
            ? Math.round((item.count / submissionData.total) * 100)
            : 0;

          // Assign colors based on service name
          let color = "bg-blue-500";
          if (item._id === "القرعة الأمريكية") color = "bg-blue-500";
          else if (item._id === "الهجرة إلى كندا") color = "bg-green-500";
          else if (item._id === "تأشيرة عمل") color = "bg-purple-500";
          else if (item._id === "الدراسة في الخارج") color = "bg-orange-500";
          else if (item._id === "لم شمل العائلة") color = "bg-pink-500";
          else if (item._id === "مواهب كرة القدم") color = "bg-yellow-500";

          return {
            name: item._id,
            count: item.count,
            percentage,
            color
          };
        });
        setServiceStats(services);

        // Process status breakdown
        const statuses = submissionData.byStatus.map((item: any) => {
          const percentage = submissionData.total > 0
            ? Math.round((item.count / submissionData.total) * 100)
            : 0;

          // Assign colors based on status
          let color = "bg-gray-500";
          if (item._id === "مكتمل") color = "bg-green-500";
          else if (item._id === "قيد المراجعة" || item._id === "تمت المعاينة" || item._id === "تم التواصل") color = "bg-yellow-500";
          else if (item._id === "جديد") color = "bg-blue-500";
          else if (item._id === "مرفوض") color = "bg-red-500";

          return {
            status: item._id,
            count: item.count,
            percentage,
            color
          };
        });
        setStatusBreakdown(statuses);
      }

    } catch (error: any) {
      console.error("Error fetching analytics data:", error);
      toast({
        title: "خطأ في تحميل البيانات",
        description: error.message || "يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const overallStats = [
    {
      title: "إجمالي العملاء",
      value: formatNumber(totalClients),
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "إجمالي الطلبات",
      value: formatNumber(totalSubmissions),
      icon: FileText,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "طلبات مكتملة",
      value: formatNumber(completedSubmissions),
      icon: CheckCircle,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "معدل النجاح",
      value: `${successRate}%`,
      icon: Award,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  const exportReport = async () => {
    try {
      toast({
        title: "جاري تصدير التقرير...",
        description: "يرجى الانتظار",
      });

      // Create comprehensive analytics report
      const reportLines: string[] = [];
      const date = formatShortDate(new Date());

      // Report Header
      reportLines.push("تقرير التحليلات والإحصائيات");
      reportLines.push(`التاريخ: ${date}`);
      reportLines.push(`الفترة الزمنية: ${timeRange === 'week' ? 'هذا الأسبوع' : timeRange === 'month' ? 'هذا الشهر' : timeRange === 'quarter' ? 'هذا الربع' : 'هذا العام'}`);
      reportLines.push("");

      // Overall Statistics Section
      reportLines.push("=== الإحصائيات العامة ===");
      reportLines.push(`إجمالي العملاء,${totalClients}`);
      reportLines.push(`إجمالي الطلبات,${totalSubmissions}`);
      reportLines.push(`طلبات مكتملة,${completedSubmissions}`);
      reportLines.push(`معدل النجاح,${successRate}%`);
      reportLines.push("");

      // Service Distribution Section
      reportLines.push("=== توزيع الخدمات ===");
      reportLines.push("الخدمة,العدد,النسبة المئوية");
      serviceStats.forEach(service => {
        reportLines.push(`${service.name},${service.count},${service.percentage}%`);
      });
      reportLines.push("");

      // Status Breakdown Section
      reportLines.push("=== توزيع الحالات ===");
      reportLines.push("الحالة,العدد,النسبة المئوية");
      statusBreakdown.forEach(status => {
        reportLines.push(`${status.status},${status.count},${status.percentage}%`);
      });
      reportLines.push("");

      // Summary Statistics
      const completedStat = statusBreakdown.find(s => s.status === "مكتمل");
      const rejectedStat = statusBreakdown.find(s => s.status === "مرفوض");
      reportLines.push("=== ملخص الأداء ===");
      reportLines.push(`معدل الإكمال,${completedStat?.percentage || 0}%`);
      reportLines.push(`معدل الرفض,${rejectedStat?.percentage || 0}%`);
      reportLines.push("");

      // Additional Insights
      reportLines.push("=== رؤى إضافية ===");
      const topService = serviceStats.length > 0 ? serviceStats.reduce((max, service) =>
        service.count > max.count ? service : max
      ) : null;
      if (topService) {
        reportLines.push(`الخدمة الأكثر طلباً,${topService.name} (${topService.count} طلب)`);
      }

      const topStatus = statusBreakdown.length > 0 ? statusBreakdown.reduce((max, status) =>
        status.count > max.count ? status : max
      ) : null;
      if (topStatus) {
        reportLines.push(`الحالة الأكثر شيوعاً,${topStatus.status} (${topStatus.count} طلب)`);
      }

      reportLines.push(`إجمالي الطلبات النشطة,${totalSubmissions - completedSubmissions - (rejectedStat?.count || 0)}`);
      reportLines.push("");

      // Footer
      reportLines.push("=== نهاية التقرير ===");
      reportLines.push(`تم إنشاء التقرير بواسطة: Connect Job World`);
      reportLines.push(`تاريخ الإنشاء: ${formatDateForExport(new Date())}`);

      // Create CSV content
      const csvContent = reportLines.join("\n");

      // Add BOM for proper UTF-8 encoding in Excel
      const BOM = "\uFEFF";
      const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `analytics_report_${formatDateForFilename()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "تم تصدير التقرير بنجاح",
        description: "تم تنزيل التقرير الشامل",
      });
    } catch (error: any) {
      console.error("Error exporting report:", error);
      toast({
        title: "خطأ في التصدير",
        description: error.message || "حدث خطأ أثناء تصدير التقرير",
        variant: "destructive"
      });
    }
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

  // Get completed and rejected percentages for summary
  const completedStat = statusBreakdown.find(s => s.status === "مكتمل");
  const rejectedStat = statusBreakdown.find(s => s.status === "مرفوض");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground">التقارير والإحصائيات</h2>
            <p className="text-muted-foreground mt-1">
              نظرة شاملة على أداء الأعمال
            </p>
          </div>
          <div className="flex gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">هذا الأسبوع</SelectItem>
                <SelectItem value="month">هذا الشهر</SelectItem>
                <SelectItem value="quarter">هذا الربع</SelectItem>
                <SelectItem value="year">هذا العام</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={exportReport} className="gap-2 bg-primary hover:bg-primary-dark">
              <Download className="w-4 h-4" />
              تصدير التقرير
            </Button>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {overallStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <h3 className="text-3xl font-bold text-foreground">{stat.value}</h3>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Service Distribution */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              توزيع الخدمات
            </h3>
            <div className="space-y-4">
              {serviceStats.map((service, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{service.name}</span>
                    <span className="text-muted-foreground">
                      {service.count} ({service.percentage}%)
                    </span>
                  </div>
                  <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`absolute inset-y-0 right-0 ${service.color} rounded-full transition-all duration-500`}
                      style={{ width: `${service.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Status Breakdown */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              توزيع الحالات
            </h3>
            <div className="space-y-4">
              {statusBreakdown.map((status, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{status.status}</span>
                    <span className="text-muted-foreground">
                      {status.count} ({status.percentage}%)
                    </span>
                  </div>
                  <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`absolute inset-y-0 right-0 ${status.color} rounded-full transition-all duration-500`}
                      style={{ width: `${status.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Stats */}
            <div className="mt-6 pt-6 border-t border-border grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{completedStat?.percentage || 0}%</p>
                <p className="text-xs text-muted-foreground mt-1">معدل الإكمال</p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <p className="text-2xl font-bold text-red-600">{rejectedStat?.percentage || 0}%</p>
                <p className="text-xs text-muted-foreground mt-1">معدل الرفض</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 border-r-4 border-r-green-500">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-foreground mb-1">الطلبات المكتملة</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  {completedSubmissions} طلب تم إنجازه بنجاح من أصل {totalSubmissions} طلب
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-l from-green-500 to-emerald-600"
                      style={{ width: `${successRate}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-green-600">{successRate}%</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-r-4 border-r-blue-500">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-foreground mb-1">إجمالي العملاء</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  {totalClients} عميل مسجل في النظام حتى الآن
                </p>
                <div className="text-2xl font-bold text-blue-600">{totalClients}</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
