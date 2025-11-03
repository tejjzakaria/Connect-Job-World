/**
 * SignIn.tsx
 *
 * Author: Zakaria TEJJANI
 * Email: contact@tejjzakaria.com
 * Date: 2025-11-03
 *
 * Description:
 * Secure authentication page for admin panel access. Provides login functionality with
 * email and password authentication, featuring password visibility toggle, form validation,
 * error handling, and JWT token management. Implements security best practices including
 * SSL encryption notice and credential protection warnings. Redirects authenticated users
 * to the dashboard and provides navigation back to the main website. Supports multi-language
 * interface and displays animated background elements for visual appeal.
 */

import { useState, useEffect } from "react";
import { Eye, EyeOff, Lock, Mail, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const SignIn = () => {
  const { toast } = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  // Update document direction based on language
  useEffect(() => {
    const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
  }, [i18n.language]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await login(formData.email, formData.password);
      toast({
        title: t('auth.loginSuccess'),
        description: t('auth.welcomeToDashboard'),
      });
      // Navigate to dashboard
      navigate("/admin/dashboard");
    } catch (error) {
      toast({
        title: t('auth.loginError'),
        description: t('auth.invalidCredentials'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary-dark to-secondary relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "4s" }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-glow/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "6s", animationDelay: "1s" }} />

      {/* Language Switcher - Fixed Position */}
      <div className="absolute top-6 right-6 z-20 text-white">
        <LanguageSwitcher />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-md mx-auto">
          {/* Logo and Header */}
          <div className="text-center mb-8 animate-fade-in-up">
            <div className="flex justify-center mb-6">
              <img
                src="/logo.png"
                alt="Connect Job World"
                className="h-20 drop-shadow-2xl"
              />
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-4">
              <Shield className="w-5 h-5 text-white" />
              <span className="text-white font-semibold">{t('auth.dashboard')}</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {t('auth.signIn')}
            </h1>
            <p className="text-white">
              {t('auth.accessDashboard')}
            </p>
          </div>

          {/* Sign In Card */}
          <Card className="p-8 shadow-2xl border-2 border-border hover:border-primary/30 transition-all duration-300 animate-fade-in-up bg-card/80 backdrop-blur-sm" style={{ animationDelay: "0.1s" }}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  {t('auth.email')}
                </label>
                <Input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="admin@connectjobworld.com"
                  dir="ltr"
                  className="h-12 border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 bg-background px-4"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" />
                  {t('auth.password')}
                </label>
                <div className="relative">
                  <Input
                    required
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    placeholder="••••••••"
                    dir="ltr"
                    className="h-12 border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 bg-background pr-12 pl-4"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password 
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="text-muted-foreground">تذكرني</span>
                </label>
                <a href="#" className="text-primary hover:text-primary-dark transition-colors font-medium">
                  نسيت كلمة المرور؟
                </a>
              </div>*/}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-primary text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t('auth.loading')}
                  </span>
                ) : (
                  t('auth.signIn')
                )}
              </Button>
            </form>

            {/* Security Notice */}
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  {t('auth.securityNotice')}
                </p>
              </div>
            </div>
          </Card>

          {/* Back to Website Link */}
          <div className="text-center mt-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <a
              href="/"
              className="text-sm text-white hover:text-accent transition-colors inline-flex items-center gap-2"
            >
              {i18n.language === 'ar' ? (
                <span className="text-lg">→</span>
              ) : (
                <span className="text-lg">←</span>
              )}
              <span>{t('auth.backToWebsite')}</span>
              
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
