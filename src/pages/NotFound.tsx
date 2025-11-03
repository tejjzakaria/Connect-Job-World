/**
 * NotFound.tsx
 *
 * Author: Zakaria TEJJANI
 * Email: contact@tejjzakaria.com
 * Date: 2025-11-03
 *
 * Description:
 * Custom 404 error page displayed when users navigate to non-existent routes. Provides
 * a user-friendly error message with helpful suggestions and navigation options to return
 * to the home page or use the search functionality. Features animated illustrations, clear
 * error messaging, and quick action buttons. Logs the attempted path for debugging purposes
 * and maintains consistent branding with the rest of the application.
 */

import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowRight, FileQuestion, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div dir="rtl" className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto p-8 md:p-12 shadow-2xl border-2 border-primary/10">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img src="/logo-orange.png" alt="Connect Job World" className="h-16" />
          </div>

          {/* 404 Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-pulse">
                <FileQuestion className="w-16 h-16 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center">
                <span className="text-2xl">!</span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              404
            </h1>
            <h2 className="text-3xl font-bold text-foreground">
              عذراً، الصفحة غير موجودة
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-md mx-auto">
              الصفحة التي تبحث عنها قد تكون محذوفة أو غير متاحة. يرجى التحقق من الرابط أو العودة إلى الصفحة الرئيسية.
            </p>
          </div>

          {/* Path Info */}
          <div className="mb-8 p-4 bg-muted/50 rounded-lg border border-border">
            <div className="flex items-start gap-2">
              <Search className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground mb-1">المسار المطلوب:</p>
                <p className="font-mono text-sm text-foreground break-all">{location.pathname}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate("/")}
              className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all"
            >
              <Home className="w-5 h-5" />
              العودة للصفحة الرئيسية
            </Button>
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="gap-2 border-2 border-primary/20 hover:bg-primary/5"
            >
              <ArrowRight className="w-5 h-5" />
              الرجوع للصفحة السابقة
            </Button>
          </div>

          {/* Quick Links */}
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-center text-sm text-muted-foreground mb-4">
              روابط مفيدة:
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                onClick={() => navigate("/")}
                variant="ghost"
                size="sm"
                className="text-primary hover:text-primary-dark"
              >
                الرئيسية
              </Button>
              <span className="text-muted-foreground">•</span>
              <Button
                onClick={() => navigate("/admin/login")}
                variant="ghost"
                size="sm"
                className="text-primary hover:text-primary-dark"
              >
                تسجيل الدخول
              </Button>
              <span className="text-muted-foreground">•</span>
              
            </div>
          </div>
        </Card>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-primary/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-accent/10 blur-3xl animate-pulse" />
      </div>
    </div>
  );
};

export default NotFound;
