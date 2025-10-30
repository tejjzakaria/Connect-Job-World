import { Code2, Coffee, Zap } from 'lucide-react';

const Signature = () => {
    return (
        <div className="p-4 border-t border-border bg-gradient-to-r from-primary via-primary-dark to-accent relative overflow-hidden group" dir="rtl">
            {/* Animated background effect */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent animate-pulse"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex items-center justify-center gap-2 flex-wrap">
                <Code2 className="w-3 h-3 text-white animate-bounce" style={{ animationDuration: '2s' }} />
                <p className="text-xs text-white text-center flex items-center gap-1 flex-wrap justify-center">
                    صُنع بـ
                    <Coffee className="w-3 h-3 inline animate-pulse" />
                    و
                    <Zap className="w-3 h-3 inline" />
                    بواسطة <strong className="mr-1 hover:scale-110 transition-transform inline-block cursor-default">tejjzakaria</strong>
                </p>
            </div>

            {/* Fun subtitle */}
            <p className="text-[10px] text-white/70 text-center mt-1 relative z-10">
                نحول الأخطاء إلى ميزات منذ... اليوم؟ 🐛✨
            </p>
        </div>
    );
};

export default Signature;
