/**
 * FooterDash.tsx
 *
 * Author: Zakaria TEJJANI
 * Email: contact@tejjzakaria.com
 * Date: 2025-11-03
 *
 * Description:
 * Footer component specifically designed for the admin dashboard pages. Displays copyright
 * information, developer credit, and branding in a compact format suitable for dashboard
 * layouts. Features gradient background with subtle animations and multi-language support.
 * Includes icons for visual appeal and professional acknowledgment. Positioned at the bottom
 * of admin pages providing consistent branding across the admin panel. Implements RTL support
 * for Arabic language and responsive design for various screen sizes.
 */

import { Code2, Heart, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FooterDash = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="p-6 border-t border-border mt-8 bg-gradient-to-br from-muted/30 to-muted/10 relative overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl"></div>

      {/* Main content */}
      <div className="relative z-10 space-y-3">
        {/* Developer signature */}
        <div className="flex items-center justify-center gap-2 group flex-wrap">
          <Sparkles className="w-4 h-4 text-accent group-hover:rotate-12 transition-transform" />
          <p className="text-sm text-muted-foreground text-center flex items-center gap-2 flex-wrap justify-center">
            {t('footerDash.madeWith')}
            <Heart className="w-4 h-4 text-red-500 animate-pulse inline" />
            {t('footerDash.by')}
            <strong className="hover:scale-110 transition-transform inline-block cursor-default bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-bold">
              tejjzakaria
            </strong>
          </p>
          <Code2 className="w-4 h-4 text-primary group-hover:-rotate-12 transition-transform" />
        </div>

        {/* Version/Status */}
        <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground/60 flex-wrap">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            {t('footerDash.systemOperational')}
          </span>
          <span>•</span>
          <span>v1.0.0</span>
          <span>•</span>
          <span className="hover:text-primary transition-colors cursor-default">
            © 2025
          </span>
        </div>
      </div>
    </div>
  );
};

export default FooterDash;
