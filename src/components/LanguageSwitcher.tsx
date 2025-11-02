import { useEffect } from "react";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";

interface LanguageSwitcherProps {
  variant?: 'floating' | 'inline';
}

const LanguageSwitcher = ({ variant = 'floating' }: LanguageSwitcherProps) => {
  const { t, i18n } = useTranslation();

  const languages = [
    { code: 'ar', label: 'header.arabic', dir: 'rtl' },
    { code: 'fr', label: 'header.french', dir: 'ltr' },
    { code: 'en', label: 'header.english', dir: 'ltr' },
  ];

  // Update document direction based on current language
  useEffect(() => {
    const currentLang = languages.find((lang) => lang.code === i18n.language);
    document.documentElement.dir = currentLang?.dir || 'rtl';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  const buttonClassName = variant === 'floating'
    ? "fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-primary hover:bg-primary-dark text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 p-0"
    : "w-10 h-10 p-0";

  const dropdownSide = variant === 'floating' ? 'top' : 'bottom';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant === 'inline' ? 'ghost' : 'default'}
          className={buttonClassName}
          aria-label="Change language"
        >
          <Globe className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side={dropdownSide}>
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={i18n.language === lang.code ? "bg-accent/10 font-semibold" : ""}
          >
            {t(lang.label)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
