import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'dark' | 'emerald' | 'cyberpunk';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleDark: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('cs_theme') as ThemeMode;
      if (saved && ['light', 'dark', 'emerald', 'cyberpunk'].includes(saved)) {
        return saved;
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  const applyTheme = (t: ThemeMode) => {
    const root = document.documentElement;
    root.classList.remove('dark', 'theme-emerald', 'theme-cyberpunk');

    if (t === 'dark') {
      root.classList.add('dark');
    } else if (t === 'emerald') {
      root.classList.add('theme-emerald');
    } else if (t === 'cyberpunk') {
      root.classList.add('dark', 'theme-cyberpunk');
    }
  };

  useEffect(() => {
    applyTheme(theme);
    try {
      localStorage.setItem('cs_theme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  const toggleDark = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
