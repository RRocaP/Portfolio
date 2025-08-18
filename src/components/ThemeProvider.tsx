import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getThemeManager, type ThemeContextType, type Theme, type ThemeMode } from '../utils/theme';

const ThemeContext = createContext<ThemeContextType | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
  defaultMode?: ThemeMode;
  enableTransitions?: boolean;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultMode = 'system',
  enableTransitions = true 
}) => {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [mode, setModeState] = useState<ThemeMode>(defaultMode);
  const [isHydrated, setIsHydrated] = useState(false);
  
  useEffect(() => {
    const themeManager = getThemeManager();
    
    // Initial theme setup
    setTheme(themeManager.getTheme());
    setModeState(themeManager.getMode());
    setIsHydrated(true);
    
    // Subscribe to theme changes
    const unsubscribe = themeManager.subscribe(() => {
      setTheme(themeManager.getTheme());
      setModeState(themeManager.getMode());
    });
    
    // Inject theme styles if not already present
    if (enableTransitions && !document.getElementById('theme-styles')) {
      const styleElement = document.createElement('style');
      styleElement.id = 'theme-styles';
      styleElement.textContent = `
        .theme-transition,
        .theme-transition *,
        .theme-transition *:before,
        .theme-transition *:after {
          transition: 
            background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
            border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
            color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
            box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `;
      document.head.appendChild(styleElement);
    }
    
    return unsubscribe;
  }, [enableTransitions]);

  const setMode = (newMode: ThemeMode) => {
    const themeManager = getThemeManager();
    themeManager.setMode(newMode);
  };

  const toggleTheme = () => {
    const themeManager = getThemeManager();
    themeManager.toggleTheme();
  };

  // Prevent hydration mismatch by not rendering until theme is loaded
  if (!isHydrated || !theme) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  const contextValue: ThemeContextType = {
    theme,
    mode,
    setMode,
    toggleTheme,
    isSystemMode: mode === 'system',
    isDark: theme.mode === 'dark',
    isLight: theme.mode === 'light',
  };

  return (
    <ThemeContext.Provider value={contextValue}>
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

// Theme toggle button component
export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { mode, setMode, isDark, isSystemMode } = useTheme();

  const getNextMode = (): ThemeMode => {
    switch (mode) {
      case 'light': return 'dark';
      case 'dark': return 'system';
      case 'system': return 'light';
      default: return 'light';
    }
  };

  const getModeIcon = () => {
    if (isSystemMode) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    }
    
    return isDark ? (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    ) : (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    );
  };

  const getModeLabel = () => {
    switch (mode) {
      case 'light': return 'Light mode';
      case 'dark': return 'Dark mode';
      case 'system': return 'System mode';
      default: return 'Toggle theme';
    }
  };

  return (
    <button
      onClick={() => setMode(getNextMode())}
      className={`relative p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 hover:bg-gray-200 dark:hover:bg-gray-700 ${className}`}
      aria-label={getModeLabel()}
      title={getModeLabel()}
    >
      <div className="relative overflow-hidden">
        {getModeIcon()}
        
        {/* Mode indicator dot */}
        <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full transition-colors ${
          mode === 'system' ? 'bg-blue-500' :
          isDark ? 'bg-purple-500' : 'bg-yellow-500'
        }`} />
      </div>
    </button>
  );
};

// Utility component for theme-aware styling
export const ThemedDiv: React.FC<{
  children: ReactNode;
  lightClass?: string;
  darkClass?: string;
  className?: string;
}> = ({ children, lightClass = '', darkClass = '', className = '' }) => {
  const { isDark } = useTheme();
  
  return (
    <div className={`${className} ${isDark ? darkClass : lightClass}`}>
      {children}
    </div>
  );
};

// Hook for theme-aware values
export const useThemeValue = <T,>(lightValue: T, darkValue: T): T => {
  const { isDark } = useTheme();
  return isDark ? darkValue : lightValue;
};

// CSS-in-JS helper for theme values
export const useThemeStyles = () => {
  const { theme } = useTheme();
  
  return {
    colors: theme.colors,
    typography: theme.typography,
    spacing: theme.spacing,
    breakpoints: theme.breakpoints,
    animations: theme.animations,
    shadows: theme.shadows,
  };
};

export default ThemeProvider;