
import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark-blue' | 'dark-black' | 'dark-green' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('app_theme');
    // Migrate old 'dark' to 'dark-blue'
    if (saved === 'dark') return 'dark-blue';
    return (saved as Theme) || 'system';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    const applyTheme = (t: Theme) => {
      // Remove all theme classes
      root.classList.remove('dark', 'theme-dark-black', 'theme-dark-green');
      
      if (t === 'light') {
        // Light mode, no dark classes
      } else if (t === 'dark-blue') {
        root.classList.add('dark');
      } else if (t === 'dark-black') {
        root.classList.add('dark', 'theme-dark-black');
      } else if (t === 'dark-green') {
        root.classList.add('dark', 'theme-dark-green');
      } else {
        // System
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          root.classList.add('dark', 'theme-dark-black'); // Default system dark is dark-black
        }
      }
    };

    applyTheme(theme);
    localStorage.setItem('app_theme', theme);

    // Listener for system changes if mode is system
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('system');
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }

  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
