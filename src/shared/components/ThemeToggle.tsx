/**
 * ThemeToggle – thin wrapper that delegates to useTheme hook.
 */
import React, { memo } from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';

const ThemeToggle: React.FC = memo(() => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl hover:text-sky-500 transition-all shadow-sm border border-slate-100 dark:border-slate-700"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
    </motion.button>
  );
});

ThemeToggle.displayName = 'ThemeToggle';
export default ThemeToggle;
