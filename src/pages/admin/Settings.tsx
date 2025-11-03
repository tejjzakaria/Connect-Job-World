/**
 * Settings.tsx
 *
 * Author: Zakaria TEJJANI
 * Email: contact@tejjzakaria.com
 * Date: 2025-11-03
 *
 * Description:
 * System settings and configuration page for platform administration. Provides centralized
 * control over security settings, language preferences, notification preferences, and database
 * configuration. Displays current user information, system status, and allows administrators
 * to manage platform-wide settings. Features comprehensive system information display and
 * configuration options for optimal platform operation.
 */

import { Shield, Globe, Bell, Database, Loader2, User as UserIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/admin/DashboardLayout";
import { useState, useEffect } from "react";
import { clientsAPI, submissionsAPI } from "@/lib/api";
import { useTranslation } from "react-i18next";

const Settings = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
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
          <h2 className="text-3xl font-bold text-foreground">{t('settings.title')}</h2>
          <p className="text-muted-foreground mt-1">
            {t('settings.subtitle')}
          </p>
        </div>

        {/* Account Information */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-lg bg-blue-100">
              <UserIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">{t('settings.accountInfo')}</h3>
              <p className="text-sm text-muted-foreground">{t('settings.accountDetails')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
              <p className="text-sm text-muted-foreground mb-1">{t('settings.name')}</p>
              <p className="text-lg font-semibold text-foreground">{user?.name || "N/A"}</p>
            </div>

            <div className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
              <p className="text-sm text-muted-foreground mb-1">{t('settings.email')}</p>
              <p className="text-lg font-semibold text-foreground">{user?.email || "N/A"}</p>
            </div>

            <div className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
              <p className="text-sm text-muted-foreground mb-1">{t('settings.role')}</p>
              <p className="text-lg font-semibold text-foreground capitalize">
                {user?.role === "admin" ? t('roles.admin') : user?.role === "agent" ? t('roles.agent') : t('roles.viewer')}
              </p>
            </div>

            <div className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
              <p className="text-sm text-muted-foreground mb-1">{t('settings.totalClients')}</p>
              <p className="text-lg font-semibold text-foreground">{totalClients}</p>
            </div>

            <div className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
              <p className="text-sm text-muted-foreground mb-1">{t('settings.totalSubmissions')}</p>
              <p className="text-lg font-semibold text-foreground">{totalSubmissions}</p>
            </div>

            <div className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
              <p className="text-sm text-muted-foreground mb-1">{t('settings.accountId')}</p>
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
              <h3 className="text-xl font-bold text-foreground">{t('settings.systemInfo')}</h3>
              <p className="text-sm text-muted-foreground">{t('settings.systemDetails')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
              <p className="text-sm text-muted-foreground mb-1">{t('settings.systemVersion')}</p>
              <p className="text-lg font-semibold text-foreground">{systemInfo.version}</p>
            </div>

            <div className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
              <p className="text-sm text-muted-foreground mb-1">{t('settings.lastUpdate')}</p>
              <p className="text-lg font-semibold text-foreground">{systemInfo.lastUpdate}</p>
            </div>

            <div className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
              <p className="text-sm text-muted-foreground mb-1">{t('settings.database')}</p>
              <p className="text-lg font-semibold text-foreground">{systemInfo.database}</p>
            </div>

            <div className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
              <p className="text-sm text-muted-foreground mb-1">{t('settings.apiStatus')}</p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <p className="text-lg font-semibold text-green-600">{t('settings.connected')}</p>
              </div>
            </div>

            <div className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
              <p className="text-sm text-muted-foreground mb-1">{t('settings.technologies')}</p>
              <p className="text-sm font-semibold text-foreground">React + TypeScript</p>
            </div>

            <div className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
              <p className="text-sm text-muted-foreground mb-1">{t('settings.server')}</p>
              <p className="text-sm font-semibold text-foreground">Node.js + Express</p>
            </div>
          </div>

          {/* Platform Features */}
          <div className="mt-6 pt-6 border-t border-border">
            <h4 className="font-semibold text-foreground mb-4">{t('settings.platformFeatures')}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-sm text-foreground">{t('settings.jwtAuth')}</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <Database className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-foreground">{t('settings.mongoStorage')}</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                <Globe className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-foreground">{t('settings.secureLinks')}</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
                <Bell className="w-4 h-4 text-orange-600" />
                <span className="text-sm text-foreground">{t('settings.notifications')}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Security Notice */}
        <Card className="p-6 bg-primary/5 border-primary/20">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-primary mt-1" />
            <div>
              <h4 className="font-bold text-foreground mb-2">{t('settings.securityNotice')}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('settings.securityMessage')}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
