import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const theme = {
    isDarkMode,
    toggleTheme,
    colors: isDarkMode ? {
      // Dark theme - Professional midnight blue palette
      background: 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900',
      backgroundSolid: 'bg-slate-900',
      backgroundSecondary: 'bg-slate-800',
      
      // Cards and surfaces
      card: 'bg-slate-800/90 backdrop-blur-xl',
      cardHover: 'hover:bg-slate-800/95',
      cardSecondary: 'bg-slate-700/60',
      surface: 'bg-slate-800/80',
      overlay: 'bg-black/50',
      
      // Borders
      border: 'border-slate-700/50',
      borderLight: 'border-slate-600/30',
      borderHover: 'border-slate-600/70',
      
      // Legacy support (for backward compatibility)
      cardBg: 'bg-slate-800/90',
      cardBorder: 'border-slate-700/50',
      
      // Text colors
      text: {
        primary: 'text-white',
        secondary: 'text-slate-300',
        muted: 'text-slate-400',
        accent: 'text-blue-400',
        success: 'text-emerald-400',
        warning: 'text-amber-400',
        error: 'text-red-400'
      },
      
      // Buttons
      button: {
        primary: 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/25',
        primaryHover: 'hover:from-blue-700 hover:to-cyan-700 hover:shadow-xl hover:shadow-blue-500/30',
        secondary: 'bg-slate-700/60 text-slate-200 border border-slate-600/50',
        secondaryHover: 'hover:bg-slate-700/80 hover:border-slate-500/60',
        ghost: 'text-slate-300 hover:bg-slate-700/40',
        danger: 'bg-red-600 text-white hover:bg-red-700'
      },
      
      // Form inputs
      input: {
        background: 'bg-slate-800/60',
        border: 'border-slate-600/40',
        borderFocus: 'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
        text: 'text-white placeholder-slate-400',
        hover: 'hover:border-slate-500/60'
      },
      
      // Navigation
      nav: {
        background: 'bg-slate-900/95 backdrop-blur-xl',
        border: 'border-slate-700/50',
        item: 'text-slate-300 hover:text-white hover:bg-slate-700/60',
        itemActive: 'text-white bg-blue-600/20 border-blue-500/50'
      },
      
      // Status colors
      status: {
        success: 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30',
        warning: 'bg-amber-600/20 text-amber-400 border-amber-500/30',
        error: 'bg-red-600/20 text-red-400 border-red-500/30',
        info: 'bg-blue-600/20 text-blue-400 border-blue-500/30'
      }
    } : {
      // Light theme - Clean professional palette
      background: 'bg-gradient-to-br from-slate-50 via-white to-slate-100',
      backgroundSolid: 'bg-white',
      backgroundSecondary: 'bg-slate-50',
      
      // Cards and surfaces
      card: 'bg-white/90 backdrop-blur-xl shadow-xl shadow-slate-200/60',
      cardHover: 'hover:bg-white/95 hover:shadow-2xl hover:shadow-slate-200/80',
      cardSecondary: 'bg-slate-50/80',
      surface: 'bg-white/80',
      overlay: 'bg-black/20',
      
      // Borders
      border: 'border-slate-200/70',
      borderLight: 'border-slate-100',
      borderHover: 'border-slate-300/80',
      
      // Legacy support
      cardBg: 'bg-white/90',
      cardBorder: 'border-slate-200/70',
      
      // Text colors
      text: {
        primary: 'text-slate-900',
        secondary: 'text-slate-700',
        muted: 'text-slate-600',
        accent: 'text-blue-700',
        success: 'text-emerald-700',
        warning: 'text-amber-700',
        error: 'text-red-700'
      },
      
      // Buttons
      button: {
        primary: 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/25',
        primaryHover: 'hover:from-blue-700 hover:to-cyan-700 hover:shadow-xl hover:shadow-blue-500/30',
        secondary: 'bg-white text-slate-800 border border-slate-300 shadow-sm',
        secondaryHover: 'hover:bg-slate-50 hover:border-slate-400 hover:shadow-md',
        ghost: 'text-slate-700 hover:bg-slate-100',
        danger: 'bg-red-600 text-white hover:bg-red-700'
      },
      
      // Form inputs
      input: {
        background: 'bg-white',
        border: 'border-slate-300',
        borderFocus: 'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
        text: 'text-slate-900 placeholder-slate-500',
        hover: 'hover:border-slate-400'
      },
      
      // Navigation
      nav: {
        background: 'bg-white/95 backdrop-blur-xl shadow-sm',
        border: 'border-slate-200',
        item: 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/60',
        itemActive: 'text-blue-700 bg-blue-50 border-blue-200'
      },
      
      // Status colors
      status: {
        success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        warning: 'bg-amber-50 text-amber-700 border-amber-200',
        error: 'bg-red-50 text-red-700 border-red-200',
        info: 'bg-blue-50 text-blue-700 border-blue-200'
      }
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};
