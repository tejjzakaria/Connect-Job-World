import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, FileText, CheckCircle, TrendingUp, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import DashboardLayout from "@/components/admin/DashboardLayout";
import { clientsAPI, submissionsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { formatShortDate, formatNumber } from "@/lib/dateUtils";
import { useTranslation } from "react-i18next";

interface DashboardStats {
  totalClients: number;
  newSubmissions: number;
  completedSubmissions: number;
  successRate: number;
}

interface Submission {
  _id: string;
  name: string;
  service: string;
  phone: string;
  status: string;
  timestamp: string;
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

  // Return translated value if key exists, otherwise return the original (for backwards compatibility)
  return serviceMap[serviceKey] || serviceKey;
};

// Helper function to get status translation from key
const getStatusTranslation = (statusKey: string, t: any) => {
  const statusMap: Record<string, string> = {
    'new': t('submissions.statusNew'),
    'viewed': t('submissions.statusViewed'),
    'contacted': t('submissions.statusContacted'),
    'completed': t('submissions.statusCompleted'),
  };

  // Return translated value if key exists, otherwise return the original (for backwards compatibility)
  return statusMap[statusKey] || statusKey;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    newSubmissions: 0,
    completedSubmissions: 0,
    successRate: 0
  });
  const [recentSubmissions, setRecentSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      // Fetch all required data in parallel
      const [clientStatsRes, submissionStatsRes, recentSubmissionsRes] = await Promise.all([
        clientsAPI.getStats(),
        submissionsAPI.getStats(),
        submissionsAPI.getAll({ limit: 5, page: 1 })
      ]);

      // Calculate statistics
      if (clientStatsRes.success && submissionStatsRes.success) {
        const clientData = clientStatsRes.data;
        const submissionData = submissionStatsRes.data;

        // Total clients
        const totalClients = clientData.total || 0;

        // New submissions (status: "new")
        const newSubmissions = submissionData.byStatus.find(
          (item: any) => item._id === "new"
        )?.count || 0;

        // Completed submissions (status: "completed")
        const completedSubmissions = submissionData.byStatus.find(
          (item: any) => item._id === "completed"
        )?.count || 0;

        // Success rate: completed submissions / total submissions * 100
        const totalSubmissions = submissionData.total || 1; // Avoid division by zero
        const successRate = totalSubmissions > 0
          ? Math.round((completedSubmissions / totalSubmissions) * 100)
          : 0;

        setStats({
          totalClients,
          newSubmissions,
          completedSubmissions,
          successRate
        });
      }

      // Set recent submissions
      if (recentSubmissionsRes.success && recentSubmissionsRes.data) {
        setRecentSubmissions(recentSubmissionsRes.data);
      }

    } catch (error: any) {
      console.error("Error fetching dashboard data:", error);
      toast({
        title: t('dashboard.errorLoading'),
        description: error.message || t('dashboard.tryAgain'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const statsCards = [
    {
      title: t('dashboard.totalClients'),
      value: formatNumber(stats.totalClients),
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: t('dashboard.newSubmissions'),
      value: formatNumber(stats.newSubmissions),
      icon: FileText,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: t('dashboard.completedSubmissions'),
      value: formatNumber(stats.completedSubmissions),
      icon: CheckCircle,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: t('dashboard.successRate'),
      value: `${stats.successRate}%`,
      icon: TrendingUp,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50"
    }
  ];


  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
      case "جديد":
        return "bg-blue-50 text-blue-700";
      case "viewed":
      case "تمت المعاينة":
        return "bg-yellow-50 text-yellow-700";
      case "contacted":
      case "تم التواصل":
        return "bg-purple-50 text-purple-700";
      case "completed":
      case "مكتمل":
        return "bg-green-50 text-green-700";
      default:
        return "bg-gray-50 text-gray-700";
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Message */}
        <div className="animate-fade-in-up">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            {t('dashboard.welcome', { defaultValue: 'Welcome!' })} 👋
          </h2>
          <p className="text-muted-foreground">
            {t('dashboard.todayOverview', { defaultValue: "Here's an overview of today's activity" })}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-all duration-300 animate-fade-in-up cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => {
                  if (index === 0) navigate("/admin/clients");
                  else if (index === 1 || index === 2) navigate("/admin/submissions");
                }}
              >
                <div className="flex items-start justify-between">
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

        <div className="grid gap-6">
          {/* Recent Submissions */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                {t('dashboard.recentSubmissions')}
              </h3>
              <button onClick={() => navigate("/admin/submissions")} className="text-sm text-primary hover:text-primary-dark transition-colors">
                {t('dashboard.viewAll')} {t('common.arrow', { defaultValue: '←' })}
              </button>
            </div>

            {recentSubmissions.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">{t('dashboard.noRecentSubmissions')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentSubmissions.map((submission, index) => (
                  <div
                    key={submission._id}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors animate-fade-in-up cursor-pointer"
                    style={{ animationDelay: `${index * 0.05}s` }}
                    onClick={() => navigate("/admin/submissions")}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                        {submission.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground">{submission.name}</h4>
                        <p className="text-sm text-muted-foreground">{getServiceTranslation(submission.service, t)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(submission.status)}`}>
                        {getStatusTranslation(submission.status, t)}
                      </span>
                      <span className="text-sm text-muted-foreground hidden sm:block">
                        {formatShortDate(submission.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-xl font-bold text-foreground mb-4">{t('dashboard.quickActions', { defaultValue: 'Quick Actions' })}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate("/admin/clients/add")}
              className="p-4 bg-gradient-to-br from-primary to-primary-dark text-white rounded-xl hover:shadow-lg transition-all hover:scale-105"
            >
              <Users className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium">{t('clients.addClient')}</span>
            </button>
            <button
              onClick={() => navigate("/admin/submissions")}
              className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105"
            >
              <FileText className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium">{t('submissions.title')}</span>
            </button>
            <button
              onClick={() => navigate("/admin/analytics")}
              className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105"
            >
              <TrendingUp className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium">{t('menu.analytics')}</span>
            </button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
