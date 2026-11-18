import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-40 p-2.5 rounded-xl bg-oxford text-white dark:bg-slate-800 dark:text-slate-100 shadow-md hover:bg-oxford-600 dark:hover:bg-slate-700 transition-all duration-200 border border-slate-700/20 active:scale-95 no-print"
      title="Scroll to top"
    >
      <ArrowUp className="w-4 h-4" />
    </button>
  );
};
