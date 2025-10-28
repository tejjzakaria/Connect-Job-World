import { Facebook, Instagram, Linkedin, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer dir="rtl" className="bg-primary from-foreground via-foreground/95 to-foreground text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-12 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <img
                src="/logo.png"
                alt=""
                className="h-16"
              />
            <p className="text-white/70 leading-relaxed">
              Connect Job World هي وكالة هجرة وتوظيف تساعد العملاء الناطقين باللغة العربية في العثور على فرص عمل والانتقال إلى الولايات المتحدة وكندا، وتقدم التوجيه بشأن التأشيرات وتصاريح العمل والاستقرار.
            </p>
            <div className="flex gap-4">
              
              <a
                href="https://www.instagram.com/connect.job.world?igsh=MWx6NWloeGNlandiaQ%3D%3D&utm_source=qr" target="_blank"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Instagram className="w-5 h-5" />
              </a>
              
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold">روابط سريعة</h4>
            <ul className="space-y-2">
              <li>
                <a href="#services" className="text-white/70 hover:text-white transition-colors">
                  خدماتنا
                </a>
              </li>
              <li>
                <a href="#contact-form" className="text-white/70 hover:text-white transition-colors">
                  تواصل معنا
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white transition-colors">
                  من نحن
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white transition-colors">
                  الأسئلة الشائعة
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold">تواصل معنا</h4>
            <div className="space-y-3">
              <a
                href="tel:+212764724608"
                className="flex items-center gap-3 text-white/70 hover:text-white transition-colors group"
              >
                <Phone className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>212764724608+</span>
              </a>
              <a
                href="mailto:info@connectjobworld.com"
                className="flex items-center gap-3 text-white/70 hover:text-white transition-colors group"
              >
                <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>info@connectjobworld.com</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-white/60 text-sm">
          <p>© 2025 Connect Job World. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
