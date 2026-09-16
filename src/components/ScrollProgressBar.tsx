import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ScrollProgressBar: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, scrolled)));
      setShowBackToTop(winScroll > 220);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Circular progress math (circumference for radius 18 = 2 * PI * 18 ≈ 113.1)
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <>
      {/* Top Fixed Gradient Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 right-0 h-1 z-50 pointer-events-none bg-transparent"
        aria-hidden="true"
      >
        <div
          className="h-full bg-gradient-to-r from-emerald-500 via-sky-500 to-teal-400 transition-all duration-75 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Back to Top Button with Circular Progress Ring */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            id="back-to-top-button"
            initial={{ opacity: 0, scale: 0.7, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 20 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={scrollToTop}
            aria-label="Scroll back to top"
            title="Scroll back to top"
            className="fixed bottom-24 md:bottom-8 right-4 sm:right-6 z-40 p-2.5 rounded-full bg-white/90 dark:bg-zinc-900/90 text-zinc-800 dark:text-zinc-100 shadow-lg border border-zinc-200/80 dark:border-zinc-700/80 backdrop-blur-md cursor-pointer flex items-center justify-center group hover:border-emerald-500 dark:hover:border-emerald-400 transition-colors"
          >
            {/* SVG Progress Ring */}
            <svg className="w-10 h-10 -rotate-90" viewBox="0 0 44 44">
              <circle
                cx="22"
                cy="22"
                r={radius}
                className="stroke-zinc-200 dark:stroke-zinc-800 fill-none"
                strokeWidth="2.5"
              />
              <circle
                cx="22"
                cy="22"
                r={radius}
                className="stroke-emerald-500 dark:stroke-emerald-400 fill-none transition-all duration-75 ease-out"
                strokeWidth="2.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>

            {/* Inner Arrow Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform text-zinc-700 dark:text-zinc-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};
