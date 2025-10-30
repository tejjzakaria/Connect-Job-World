import { Code2, Heart, Sparkles } from 'lucide-react';

const FooterDash = () => {
  return (
    <div className="p-6 border-t border-border mt-8 bg-gradient-to-br from-muted/30 to-muted/10 relative overflow-hidden" dir="rtl">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl"></div>

      {/* Main content */}
      <div className="relative z-10 space-y-3">
        {/* Developer signature */}
        <div className="flex items-center justify-center gap-2 group flex-wrap">
          <Sparkles className="w-4 h-4 text-accent group-hover:rotate-12 transition-transform" />
          <p className="text-sm text-muted-foreground text-center flex items-center gap-2 flex-wrap justify-center">
            صُنع بكل
            <Heart className="w-4 h-4 text-red-500 animate-pulse inline" />
            بواسطة
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
            النظام يعمل
          </span>
          <span>•</span>
          <span>v1.0.0</span>
          <span>•</span>
          <span className="hover:text-primary transition-colors cursor-default">
            © 2024
          </span>
        </div>
      </div>
    </div>
  );
};

export default FooterDash;
