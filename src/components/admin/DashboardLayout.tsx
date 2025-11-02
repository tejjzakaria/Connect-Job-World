import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  BookOpen,
  UserCog
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Signature from "../Signature";
import { Footer } from "react-day-picker";
import FooterDash from "../FooterDash";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../LanguageSwitcher";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t, i18n } = useTranslation();

  // Update document direction based on language
  useEffect(() => {
    const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
  }, [i18n.language]);

  const menuItems = [
    { icon: LayoutDashboard, label: t('menu.dashboard'), path: "/admin/dashboard", roles: ["admin", "agent", "viewer"] },
    { icon: Users, label: t('menu.clients'), path: "/admin/clients", roles: ["admin", "agent"] },
    { icon: FileText, label: t('menu.submissions'), path: "/admin/submissions", roles: ["admin", "agent"] },
    { icon: UserCog, label: t('menu.employees'), path: "/admin/employees", roles: ["admin"] },
    { icon: BarChart3, label: t('menu.analytics'), path: "/admin/analytics", roles: ["admin", "viewer"] },
    { icon: BookOpen, label: t('menu.documentation'), path: "/admin/documentation", roles: ["admin", "agent", "viewer"] },
    { icon: Settings, label: t('menu.settings'), path: "/admin/settings", roles: ["admin"] },
  ];

  const handleLogout = () => {
    logout();
  };

  const isRTL = i18n.language === 'ar';

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 ${isRTL ? 'right-0 border-l' : 'left-0 border-r'} h-full w-64 bg-card border-border z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : (isRTL ? "translate-x-full" : "-translate-x-full")
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <img src="/logo-orange.png" alt="Connect Job World" className="h-10" />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems
              .filter((item) => item.roles.includes(user?.role || "viewer"))
              .map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                        ? "bg-primary text-white shadow-md"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
          </nav>

          {/* User Info & Logout */}
          
          <div className="p-4 border-t border-border space-y-2">
            <Link to="/admin/profile" onClick={() => setSidebarOpen(false)}>
              <Card className="p-4 bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                    {user?.name?.charAt(0) || "A"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{user?.name || "Admin"}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                </div>
              </Card>
            </Link>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="w-full gap-2"
            >
              <LogOut className="w-4 h-4" />
              {t('auth.logout')}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={isRTL ? "lg:mr-64" : "lg:ml-64"}>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-card border-b border-border shadow-sm">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              <h1 className="text-xl font-bold text-foreground">
                {menuItems.filter((item) => item.roles.includes(user?.role || "viewer")).find(item => item.path === location.pathname)?.label || t('menu.dashboard')}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <LanguageSwitcher variant="inline" />
              <NotificationsDropdown />
              <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold">
                  {user?.name?.charAt(0) || "A"}
                </div>
                <span className="text-sm font-medium">{user?.name || "Admin"}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
          <FooterDash />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
