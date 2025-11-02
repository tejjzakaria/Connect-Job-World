import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Menu, X, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const Header = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const menuItems = [
    { labelKey: "header.home", id: "hero", action: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
    { labelKey: "header.services", id: "services", action: () => scrollToSection("services") },
    { labelKey: "header.whyUs", id: "why-choose-us", action: () => scrollToSection("why-choose-us") },
    { labelKey: "header.documents", id: "documents", action: () => scrollToSection("documents") },
    { labelKey: "header.contact", id: "contact-form", action: () => scrollToSection("contact-form") },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled
        ? "bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm"
        : "bg-transparent"
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20 relative" dir={isRTL ? 'rtl' : 'ltr'}>
          {/* Logo - First element */}
          <div
            className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <img
              src={isScrolled ? "/logo-orange.png" : "/logo.png"}
              alt="Connect Job World"
              className="h-12 transition-opacity duration-300"
            />
          </div>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2" dir={isRTL ? 'rtl' : 'ltr'}>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={item.action}
                className={`font-medium transition-all duration-200 hover:scale-105 ${
                  isScrolled
                    ? "text-gray-700 hover:text-primary"
                    : "text-white hover:text-accent"
                }`}
              >
                {t(item.labelKey)}
              </button>
            ))}
          </nav>

          {/* Track Application & Login Buttons - Last element */}
          <div className="hidden lg:flex items-center gap-4">
            <Button
              onClick={() => navigate('/track')}
              className={`gap-2 shadow-md hover:shadow-lg transition-all duration-300 ${
                isScrolled
                  ? "bg-primary hover:from-primary-dark hover:to-accent-dark text-white"
                  : "bg-white text-primary hover:bg-white/90"
              }`}
            >
              <Search className="w-4 h-4" />
              {t('header.trackApplication')}
            </Button>
            <Button
              onClick={() => navigate('/admin/login')}
              size="icon"
              className={`shadow-md hover:shadow-lg transition-all duration-300 ${
                isScrolled
                  ? "bg-primary hover:from-primary-dark hover:to-accent-dark text-white"
                  : "bg-white text-primary hover:bg-white/90"
              }`}
              title={t('header.login')}
            >
              <LogIn className="w-5 h-5" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden p-2 transition-colors ${
              isScrolled
                ? "text-gray-700 hover:text-primary"
                : "text-white hover:text-accent"
            }`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`lg:hidden py-4 animate-fade-in ${
            isScrolled
              ? "bg-white/95 border-t border-gray-200"
              : "bg-primary/95 backdrop-blur-md"
          }`}>
            <nav className="flex flex-col gap-4" dir={isRTL ? 'rtl' : 'ltr'}>
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={item.action}
                  className={`font-medium transition-colors duration-200 ${isRTL ? 'text-right' : 'text-left'} px-4 py-2 rounded-lg ${
                    isScrolled
                      ? "text-gray-700 hover:text-primary hover:bg-gray-50"
                      : "text-white hover:text-accent hover:bg-white/10"
                  }`}
                >
                  {t(item.labelKey)}
                </button>
              ))}
              <div className="px-4 pt-2">
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/track');
                    }}
                    className="flex-1 gap-2 bg-white text-primary hover:bg-white/90 shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <Search className="w-4 h-4" />
                    {t('header.trackApplication')}
                  </Button>
                  <Button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/admin/login');
                    }}
                    size="icon"
                    className="bg-white text-primary hover:bg-white/90 shadow-md hover:shadow-lg transition-all duration-300"
                    title={t('header.login')}
                  >
                    <LogIn className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
