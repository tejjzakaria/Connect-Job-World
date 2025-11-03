/**
 * ScrollToTop.tsx
 *
 * Author: Zakaria TEJJANI
 * Email: contact@tejjzakaria.com
 * Date: 2025-11-03
 *
 * Description:
 * Floating "scroll to top" button component providing quick navigation back to page top.
 * Appears when user scrolls down past a threshold (400px) with smooth fade-in animation.
 * Features fixed positioning in bottom-right corner with circular button design and up arrow
 * icon. Implements smooth scrolling behavior on click for better user experience. Commonly
 * used on long pages to improve navigation and reduce scrolling effort. Includes responsive
 * positioning and hover effects for visual feedback.
 */

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 left-8 z-50 w-12 h-12 rounded-full bg-primary hover:bg-primary-dark text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 p-0 animate-fade-in-up"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6" />
        </Button>
      )}
    </>
  );
};

export default ScrollToTop;
