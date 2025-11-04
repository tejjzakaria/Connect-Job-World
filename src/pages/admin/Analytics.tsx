/**
 * Analytics.tsx
 *
 * Author: Zakaria TEJJANI
 * Email: contact@tejjzakaria.com
 * Date: 2025-11-03
 *
 * Description:
 * Advanced analytics and reporting page displaying business intelligence insights.
 * Features conversion funnel analysis showing progression through workflow stages,
 * service performance comparison with completion rates, service distribution pie charts,
 * and comprehensive statistics. Provides data visualization using Recharts library with
 * interactive charts for trend analysis and performance monitoring. Includes PDF export
 * functionality for generating professional reports.
 */

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
import { useTranslation } from "react-i18next";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, ComposedChart, Area } from 'recharts';

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

interface ConversionFunnelData {
  stage: string;
  count: number;
  percentage: number;
  conversionRate: number;
}

interface ServicePerformance {
  service: string;
  total: number;
  completed: number;
  completionRate: number;
  inProgress: number;
}

// Helper function to get service translation from key
const getServiceTranslation = (serviceKey: string, t: any) => {
  const serviceMap: Record<string, string> = {
    'us_lottery': t('submissions.serviceUSLottery'),
    'canada_immigration': t('submissions.serviceCanadaImmigration'),
    'work_visa': t('submissions.serviceWorkVisa'),
    'study_abroad': t('submissions.serviceStudyAbroad'),
    'family_reunion': t('submissions.serviceFamilyReunion'),
    'soccer_talent': t('submissions.serviceSoccerTalent'),
  };

  return serviceMap[serviceKey] || serviceKey;
};

// Helper function to get status translation from key
const getStatusTranslation = (statusKey: string, t: any) => {
  const statusMap: Record<string, string> = {
    'new': t('submissions.statusNew'),
    'viewed': t('submissions.statusViewed'),
    'contacted': t('submissions.statusContacted'),
    'completed': t('submissions.statusCompleted'),
    'in_review': t('status.inProgress'),
    'rejected': t('status.rejected'),
  };

  return statusMap[statusKey] || statusKey;
};

const Analytics = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState("month");
  const [isLoading, setIsLoading] = useState(true);

  const [totalClients, setTotalClients] = useState(0);
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [completedSubmissions, setCompletedSubmissions] = useState(0);
  const [successRate, setSuccessRate] = useState(0);
  const [serviceStats, setServiceStats] = useState<ServiceStat[]>([]);
  const [statusBreakdown, setStatusBreakdown] = useState<StatusStat[]>([]);
  const [conversionFunnel, setConversionFunnel] = useState<ConversionFunnelData[]>([]);
  const [servicePerformance, setServicePerformance] = useState<ServicePerformance[]>([]);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true);

      // Fetch stats from both APIs and all submissions for detailed analysis
      const [clientStatsRes, submissionStatsRes, allSubmissionsRes] = await Promise.all([
        clientsAPI.getStats(),
        submissionsAPI.getStats(),
        submissionsAPI.getAll({ limit: 10000, page: 1 }) // Fetch all for detailed analysis
      ]);

      if (clientStatsRes.success && submissionStatsRes.success) {
        const clientData = clientStatsRes.data;
        const submissionData = submissionStatsRes.data;
        const allSubmissions = allSubmissionsRes.success ? allSubmissionsRes.data : [];

        // Set totals
        setTotalClients(clientData.total || 0);
        setTotalSubmissions(submissionData.total || 0);

        // Calculate completed submissions and success rate
        const completed = submissionData.byStatus.find(
          (item: any) => item._id === "completed"
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

          // Assign colors based on service key
          let color = "bg-blue-500";
          if (item._id === "us_lottery") color = "bg-blue-500";
          else if (item._id === "canada_immigration") color = "bg-green-500";
          else if (item._id === "work_visa") color = "bg-purple-500";
          else if (item._id === "study_abroad") color = "bg-orange-500";
          else if (item._id === "family_reunion") color = "bg-pink-500";
          else if (item._id === "soccer_talent") color = "bg-yellow-500";

          return {
            name: getServiceTranslation(item._id, t),
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

          // Assign colors based on status key
          let color = "bg-gray-500";
          if (item._id === "completed") color = "bg-green-500";
          else if (item._id === "in_review" || item._id === "viewed" || item._id === "contacted") color = "bg-yellow-500";
          else if (item._id === "new") color = "bg-blue-500";
          else if (item._id === "rejected") color = "bg-red-500";

          return {
            status: getStatusTranslation(item._id, t),
            count: item.count,
            percentage,
            color
          };
        });
        setStatusBreakdown(statuses);

        // Calculate Conversion Funnel
        const newCount = submissionData.byStatus.find((s: any) => s._id === "new")?.count || 0;
        const viewedCount = submissionData.byStatus.find((s: any) => s._id === "viewed")?.count || 0;
        const contactedCount = submissionData.byStatus.find((s: any) => s._id === "contacted")?.count || 0;
        const completedCount = submissionData.byStatus.find((s: any) => s._id === "completed")?.count || 0;

        const totalInFunnel = submissionData.total || 1;
        const funnelData: ConversionFunnelData[] = [
          {
            stage: t('submissions.statusNew'),
            count: newCount,
            percentage: Math.round((newCount / totalInFunnel) * 100),
            conversionRate: 100
          },
          {
            stage: t('submissions.statusViewed'),
            count: viewedCount,
            percentage: Math.round((viewedCount / totalInFunnel) * 100),
            conversionRate: newCount > 0 ? Math.round((viewedCount / newCount) * 100) : 0
          },
          {
            stage: t('submissions.statusContacted'),
            count: contactedCount,
            percentage: Math.round((contactedCount / totalInFunnel) * 100),
            conversionRate: viewedCount > 0 ? Math.round((contactedCount / viewedCount) * 100) : 0
          },
          {
            stage: t('submissions.statusCompleted'),
            count: completedCount,
            percentage: Math.round((completedCount / totalInFunnel) * 100),
            conversionRate: contactedCount > 0 ? Math.round((completedCount / contactedCount) * 100) : 0
          }
        ];
        setConversionFunnel(funnelData);

        // Calculate Service Performance
        const servicePerf: ServicePerformance[] = submissionData.byService.map((serviceItem: any) => {
          // Filter submissions by this service
          const serviceSubmissions = allSubmissions.filter((sub: any) => sub.service === serviceItem._id);
          const totalForService = serviceSubmissions.length;
          const completedForService = serviceSubmissions.filter((sub: any) => sub.status === 'completed').length;
          const inProgressForService = serviceSubmissions.filter((sub: any) =>
            sub.status === 'viewed' || sub.status === 'contacted'
          ).length;

          return {
            service: getServiceTranslation(serviceItem._id, t),
            total: totalForService,
            completed: completedForService,
            completionRate: totalForService > 0 ? Math.round((completedForService / totalForService) * 100) : 0,
            inProgress: inProgressForService
          };
        }).sort((a, b) => b.completionRate - a.completionRate); // Sort by completion rate

        setServicePerformance(servicePerf);
      }

    } catch (error: any) {
      console.error("Error fetching analytics data:", error);
      toast({
        title: t('common.error'),
        description: error.message || t('common.tryAgain'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const overallStats = [
    {
      title: t('analytics.totalClients'),
      value: formatNumber(totalClients),
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: t('analytics.totalSubmissions'),
      value: formatNumber(totalSubmissions),
      icon: FileText,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: t('analytics.completedSubmissions'),
      value: formatNumber(completedSubmissions),
      icon: CheckCircle,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: t('analytics.successRate'),
      value: `${successRate}%`,
      icon: Award,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  const exportReport = async () => {
    try {
      toast({
        title: t('common.loading'),
        description: t('common.pleaseWait'),
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
      const completedStat = statusBreakdown.find(s => s.status === t('submissions.statusCompleted'));
      const rejectedStat = statusBreakdown.find(s => s.status === t('status.rejected'));
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
        title: t('common.success'),
        description: t('analytics.reportDownloaded'),
      });
    } catch (error: any) {
      console.error("Error exporting report:", error);
      toast({
        title: t('common.error'),
        description: error.message || t('analytics.exportError'),
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
  const completedStat = statusBreakdown.find(s => s.status === t('submissions.statusCompleted'));
  const rejectedStat = statusBreakdown.find(s => s.status === t('status.rejected'));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground">{t('analytics.title')}</h2>
            <p className="text-muted-foreground mt-1">
              {t('analytics.subtitle')}
            </p>
          </div>
          <div className="flex gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">{t('analytics.thisWeek')}</SelectItem>
                <SelectItem value="month">{t('analytics.thisMonth')}</SelectItem>
                <SelectItem value="quarter">{t('analytics.thisQuarter')}</SelectItem>
                <SelectItem value="year">{t('analytics.thisYear')}</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={exportReport} className="gap-2 bg-primary hover:bg-primary-dark">
              <Download className="w-4 h-4" />
              {t('analytics.exportReport')}
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

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Service Distribution - Keeping this one as user likes it */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              {t('analytics.serviceDistribution')}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name.split(' ')[0]}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {serviceStats.map((entry, index) => {
                    const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899', '#eab308'];
                    return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                  })}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 rounded-lg shadow-lg border">
                          <p className="font-semibold">{payload[0].name}</p>
                          <p className="text-sm text-gray-600">{t('analytics.requests')}: {payload[0].value}</p>
                          <p className="text-sm text-gray-600">{payload[0].payload.percentage}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {serviceStats.map((service, index) => {
                const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899', '#eab308'];
                return (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[index % colors.length] }}></div>
                    <span className="text-xs truncate">{service.name}: {service.count}</span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Conversion Funnel */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              {t('analytics.conversionFunnel', { defaultValue: 'Conversion Funnel' })}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={conversionFunnel} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="stage" type="category" width={100} tick={{ fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 rounded-lg shadow-lg border">
                          <p className="font-semibold">{payload[0].payload.stage}</p>
                          <p className="text-sm text-gray-600">{t('analytics.count')}: {payload[0].payload.count}</p>
                          <p className="text-sm text-gray-600">{t('analytics.percentage', { defaultValue: 'Percentage' })}: {payload[0].payload.percentage}%</p>
                          <p className="text-sm font-semibold text-primary">{t('analytics.conversionRate', { defaultValue: 'Conversion' })}: {payload[0].payload.conversionRate}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="percentage" fill="#3b82f6" radius={[0, 8, 8, 0]} />
              </ComposedChart>
            </ResponsiveContainer>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-2">{t('analytics.overallConversion', { defaultValue: 'Overall Conversion' })}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('submissions.statusNew')} → {t('submissions.statusCompleted')}</span>
                <span className="text-lg font-bold text-primary">{successRate}%</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Service Performance Comparison */}
        <Card className="p-6">
          <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            {t('analytics.servicePerformance', { defaultValue: 'Service Performance Comparison' })}
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={servicePerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="service"
                tick={{ fontSize: 11 }}
                angle={-20}
                textAnchor="end"
                height={80}
              />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 rounded-lg shadow-lg border">
                        <p className="font-semibold mb-2">{payload[0].payload.service}</p>
                        <p className="text-sm text-gray-600">{t('analytics.total', { defaultValue: 'Total' })}: {payload[0].payload.total}</p>
                        <p className="text-sm text-green-600">{t('analytics.completed', { defaultValue: 'Completed' })}: {payload[0].payload.completed}</p>
                        <p className="text-sm text-yellow-600">{t('analytics.inProgress', { defaultValue: 'In Progress' })}: {payload[0].payload.inProgress}</p>
                        <p className="text-sm font-bold text-primary mt-1">{t('analytics.completionRate')}: {payload[0].payload.completionRate}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="completed" name={t('analytics.completed', { defaultValue: 'Completed' })} fill="#10b981" radius={[8, 8, 0, 0]} />
              <Bar yAxisId="left" dataKey="inProgress" name={t('analytics.inProgress', { defaultValue: 'In Progress' })} fill="#eab308" radius={[8, 8, 0, 0]} />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="completionRate"
                name={t('analytics.completionRate')}
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 5 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            {servicePerformance.slice(0, 4).map((service, index) => (
              <div key={index} className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground truncate">{service.service}</p>
                <p className="text-lg font-bold text-primary">{service.completionRate}%</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 border-r-4 border-r-green-500">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-foreground mb-1">{t('analytics.completedRequests')}</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  {completedSubmissions} {t('analytics.completedDesc')} {totalSubmissions}
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
                <h4 className="font-bold text-foreground mb-1">{t('analytics.totalClients')}</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  {totalClients} {t('analytics.totalClientsDesc')}
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
