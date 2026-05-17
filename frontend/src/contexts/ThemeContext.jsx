import { createContext, useEffect, useMemo, useState } from 'react';

export const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    const classList = document.body.classList;
    if (darkMode) {
      classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  const value = useMemo(() => ({ darkMode, toggleTheme }), [darkMode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
