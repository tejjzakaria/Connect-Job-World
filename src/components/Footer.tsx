/**
 * Footer.tsx
 *
 * Author: Zakaria TEJJANI
 * Email: contact@tejjzakaria.com
 * Date: 2025-11-03
 *
 * Description:
 * Main website footer component providing comprehensive site information and navigation.
 * Organized in multiple columns featuring quick links to services, useful links for tracking
 * and document upload, contact information (email, phone, address), and social media integration.
 * Displays company branding, description, copyright notice, and links to social platforms
 * (Facebook, Instagram, LinkedIn). Supports multi-language content and RTL layout for Arabic.
 * Includes location information and office hours for client convenience.
 */

import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  return (
    <footer dir={isRTL ? 'rtl' : 'ltr'} className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="relative container mx-auto px-4 py-16">
        {/* Main Content */}
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2 space-y-6">
            <div className="space-y-4">
              <img
                src="/logo.png"
                alt="Connect Job World"
                className="h-16 drop-shadow-2xl"
              />
              <p className="text-white/80 leading-relaxed max-w-md text-base">
                {t('footer.brandDescription')}
              </p>
            </div>

            {/* Social Media */}
            <div className="space-y-3">
              <h5 className="text-sm font-semibold text-white/90 uppercase tracking-wide">
                {t('footer.followUs')}
              </h5>
              <div className="flex gap-3">
                <a
                  href="https://www.instagram.com/connect.job.world"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-11 h-11 rounded-xl bg-primary flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-pink-500/50"
                >
                  <Instagram className="w-5 h-5 text-white relative z-10" />
                </a>
                
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <h4 className="text-lg font-bold text-white relative inline-block">
              {t('footer.quickLinks')}
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-primary to-accent"></span>
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#services"
                  className="text-white/70 hover:text-white transition-all duration-200 flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary group-hover:w-3 transition-all duration-200"></span>
                  {t('footer.services')}
                </a>
              </li>
              <li>
                <a
                  href="#contact-form"
                  className="text-white/70 hover:text-white transition-all duration-200 flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary group-hover:w-3 transition-all duration-200"></span>
                  {t('footer.contact')}
                </a>
              </li>
              <li>
                <a
                  href="#why-choose-us"
                  className="text-white/70 hover:text-white transition-all duration-200 flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary group-hover:w-3 transition-all duration-200"></span>
                  {t('footer.aboutUs')}
                </a>
              </li>
              <li>
                <a
                  href="#documents"
                  className="text-white/70 hover:text-white transition-all duration-200 flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary group-hover:w-3 transition-all duration-200"></span>
                  {t('footer.faq')}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-5">
            <h4 className="text-lg font-bold text-white relative inline-block">
              {t('footer.contactHeading')}
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-primary to-accent"></span>
            </h4>
            <div className="space-y-4">
              <a
                href="tel:+212764724608"
                className="flex items-center gap-3 text-white/70 hover:text-white transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-lg bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-all duration-200">
                  <Phone className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-sm">+212 764 724 608</span>
              </a>
              <a
                href="mailto:info@connectjobworld.com"
                className="flex items-center gap-3 text-white/70 hover:text-white transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-lg bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-all duration-200">
                  <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-sm break-all">info@connectjobworld.com</span>
              </a>
              
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 mt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/60 text-sm text-center md:text-left">
              {t('footer.copyright')}
            </p>
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <Globe className="w-4 h-4" />
              <span>{t('footer.globalService')}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
