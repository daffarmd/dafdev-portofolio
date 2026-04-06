import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type ThemeContextValue = {
  darkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (nextValue: boolean) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [darkMode, setDarkMode] = useState<boolean>(
    localStorage.getItem('darkMode') === 'true' ||
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const value = useMemo<ThemeContextValue>(() => ({
    darkMode,
    toggleDarkMode: () => setDarkMode((current) => !current),
    setDarkMode,
  }), [darkMode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return context;
};
