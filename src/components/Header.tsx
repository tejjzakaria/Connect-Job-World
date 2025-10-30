import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const navigate = useNavigate();
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
    { label: "الرئيسية", id: "hero", action: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
    { label: "خدماتنا", id: "services", action: () => scrollToSection("services") },
    { label: "لماذا نحن؟", id: "why-choose-us", action: () => scrollToSection("why-choose-us") },
    { label: "المستندات", id: "documents", action: () => scrollToSection("documents") },
    { label: "تواصل معنا", id: "contact-form", action: () => scrollToSection("contact-form") },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled
        ? "bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm"
        : "bg-transparent"
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Track Application Button */}
          <div className="hidden lg:flex items-center gap-4">
            <Button
              onClick={() => navigate('/track')}
              className={`gap-2 shadow-md hover:shadow-lg transition-all duration-300 ${
                isScrolled
                  ? "bg-gradient-to-r from-primary to-accent hover:from-primary-dark hover:to-accent-dark text-white"
                  : "bg-white text-primary hover:bg-white/90"
              }`}
            >
              <Search className="w-4 h-4" />
              تتبع طلبك
            </Button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8" dir="rtl">
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
                {item.label}
              </button>
            ))}
          </nav>

          {/* Logo */}
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
            <nav className="flex flex-col gap-4">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={item.action}
                  className={`font-medium transition-colors duration-200 text-right px-4 py-2 rounded-lg ${
                    isScrolled
                      ? "text-gray-700 hover:text-primary hover:bg-gray-50"
                      : "text-white hover:text-accent hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="px-4 pt-2">
                <Button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/track');
                  }}
                  className="w-full gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary-dark hover:to-accent-dark"
                >
                  <Search className="w-4 h-4" />
                  تتبع طلبك
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
