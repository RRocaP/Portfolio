/**
 * Advanced Theme System with Dark/Light Mode Support
 * Provides comprehensive theme management with smooth transitions
 */

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  // Brand Colors (Catalan-inspired)
  brand: {
    red: string;
    yellow: string;
    redHover: string;
    yellowHover: string;
  };
  
  // Background Hierarchy
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    elevated: string;
    overlay: string;
  };
  
  // Text Colors
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    muted: string;
    inverse: string;
  };
  
  // UI Colors
  border: {
    primary: string;
    secondary: string;
    focus: string;
    error: string;
    success: string;
    warning: string;
  };
  
  // Status Colors
  status: {
    error: string;
    success: string;
    warning: string;
    info: string;
    errorBg: string;
    successBg: string;
    warningBg: string;
    infoBg: string;
  };
  
  // Interactive Elements
  interactive: {
    primary: string;
    primaryHover: string;
    secondary: string;
    secondaryHover: string;
    disabled: string;
    disabledText: string;
  };
}

export interface ThemeTypography {
  // Font Families
  families: {
    primary: string;
    display: string;
    mono: string;
  };
  
  // Font Sizes (fluid with clamp)
  sizes: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
    '6xl': string;
  };
  
  // Font Weights
  weights: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
    black: number;
  };
  
  // Line Heights
  lineHeights: {
    tight: number;
    normal: number;
    relaxed: number;
    loose: number;
  };
  
  // Letter Spacing
  letterSpacing: {
    tighter: string;
    tight: string;
    normal: string;
    wide: string;
    wider: string;
  };
}

export interface ThemeSpacing {
  // 8px Grid System
  xs: string;    // 4px
  sm: string;    // 8px
  md: string;    // 16px
  lg: string;    // 24px
  xl: string;    // 32px
  '2xl': string; // 48px
  '3xl': string; // 64px
  '4xl': string; // 96px
  '5xl': string; // 128px
  '6xl': string; // 192px
}

export interface ThemeBreakpoints {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

export interface ThemeAnimations {
  durations: {
    fast: string;
    normal: string;
    slow: string;
    slower: string;
  };
  
  easings: {
    default: string;
    smooth: string;
    spring: string;
    bounce: string;
  };
  
  keyframes: {
    fadeIn: string;
    slideUp: string;
    scaleIn: string;
    spin: string;
    pulse: string;
  };
}

export interface ThemeShadows {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  inner: string;
  focus: string;
  glow: string;
}

export interface Theme {
  mode: ThemeMode;
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  breakpoints: ThemeBreakpoints;
  animations: ThemeAnimations;
  shadows: ThemeShadows;
}

// Light Theme Configuration
const lightTheme: Omit<Theme, 'mode'> = {
  colors: {
    brand: {
      red: '#DA291C',
      yellow: '#FFD93D',
      redHover: '#B91C1C',
      yellowHover: '#FCD34D',
    },
    background: {
      primary: '#FFFFFF',
      secondary: '#F9FAFB',
      tertiary: '#F3F4F6',
      elevated: '#FFFFFF',
      overlay: 'rgba(0, 0, 0, 0.5)',
    },
    text: {
      primary: '#111827',
      secondary: '#374151',
      tertiary: '#6B7280',
      muted: '#9CA3AF',
      inverse: '#FFFFFF',
    },
    border: {
      primary: '#E5E7EB',
      secondary: '#D1D5DB',
      focus: '#DA291C',
      error: '#EF4444',
      success: '#10B981',
      warning: '#F59E0B',
    },
    status: {
      error: '#EF4444',
      success: '#10B981',
      warning: '#F59E0B',
      info: '#3B82F6',
      errorBg: '#FEF2F2',
      successBg: '#ECFDF5',
      warningBg: '#FFFBEB',
      infoBg: '#EFF6FF',
    },
    interactive: {
      primary: '#DA291C',
      primaryHover: '#B91C1C',
      secondary: '#6B7280',
      secondaryHover: '#4B5563',
      disabled: '#E5E7EB',
      disabledText: '#9CA3AF',
    },
  },
  typography: {
    families: {
      primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      display: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      mono: "'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', monospace",
    },
    sizes: {
      xs: 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)',
      sm: 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)',
      base: 'clamp(1rem, 0.95rem + 0.25vw, 1.125rem)',
      lg: 'clamp(1.125rem, 1.05rem + 0.375vw, 1.25rem)',
      xl: 'clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem)',
      '2xl': 'clamp(1.5rem, 1.35rem + 0.75vw, 1.875rem)',
      '3xl': 'clamp(1.875rem, 1.65rem + 1.125vw, 2.25rem)',
      '4xl': 'clamp(2.25rem, 1.95rem + 1.5vw, 3rem)',
      '5xl': 'clamp(3rem, 2.55rem + 2.25vw, 4rem)',
      '6xl': 'clamp(3.75rem, 3.15rem + 3vw, 5rem)',
    },
    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      black: 900,
    },
    lineHeights: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
      loose: 2,
    },
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0em',
      wide: '0.025em',
      wider: '0.05em',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
    '4xl': '6rem',
    '5xl': '8rem',
    '6xl': '12rem',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  animations: {
    durations: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
      slower: '750ms',
    },
    easings: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
    keyframes: {
      fadeIn: 'fadeIn 0.3s ease-out forwards',
      slideUp: 'slideUp 0.4s ease-out forwards',
      scaleIn: 'scaleIn 0.3s ease-out forwards',
      spin: 'spin 1s linear infinite',
      pulse: 'pulse 2s ease-in-out infinite',
    },
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    focus: '0 0 0 3px rgba(218, 41, 28, 0.5)',
    glow: '0 0 20px rgba(218, 41, 28, 0.3)',
  },
};

// Dark Theme Configuration
const darkTheme: Omit<Theme, 'mode'> = {
  ...lightTheme,
  colors: {
    brand: {
      red: '#EF4444',
      yellow: '#FFD93D',
      redHover: '#FF5555',
      yellowHover: '#FDE047',
    },
    background: {
      primary: '#0A0A0A',
      secondary: '#171717',
      tertiary: '#1E1E1E',
      elevated: '#252525',
      overlay: 'rgba(0, 0, 0, 0.8)',
    },
    text: {
      primary: '#F9FAFB',
      secondary: '#E5E7EB',
      tertiary: '#D1D5DB',
      muted: '#9CA3AF',
      inverse: '#111827',
    },
    border: {
      primary: '#374151',
      secondary: '#4B5563',
      focus: '#EF4444',
      error: '#F87171',
      success: '#34D399',
      warning: '#FBBF24',
    },
    status: {
      error: '#F87171',
      success: '#34D399',
      warning: '#FBBF24',
      info: '#60A5FA',
      errorBg: '#7F1D1D',
      successBg: '#064E3B',
      warningBg: '#92400E',
      infoBg: '#1E3A8A',
    },
    interactive: {
      primary: '#EF4444',
      primaryHover: '#FF5555',
      secondary: '#6B7280',
      secondaryHover: '#9CA3AF',
      disabled: '#374151',
      disabledText: '#6B7280',
    },
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)',
    focus: '0 0 0 3px rgba(239, 68, 68, 0.5)',
    glow: '0 0 20px rgba(239, 68, 68, 0.4)',
  },
};

export interface ThemeContextType {
  theme: Theme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  isSystemMode: boolean;
  isDark: boolean;
  isLight: boolean;
}

class ThemeManager {
  private currentMode: ThemeMode = 'system';
  private currentTheme: Theme;
  private listeners: Set<() => void> = new Set();
  private mediaQuery: MediaQueryList;
  private storageKey = 'portfolio-theme';

  constructor() {
    // Initialize media query listener for system preference
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.mediaQuery.addEventListener('change', this.handleSystemThemeChange);
    
    // Load saved preference or default to system
    const savedMode = this.loadFromStorage();
    this.currentMode = savedMode || 'system';
    
    // Set initial theme
    this.currentTheme = this.createTheme(this.currentMode);
    
    // Apply theme to document
    this.applyTheme();
    
    // Add smooth transition class after initial load
    setTimeout(() => {
      document.documentElement.classList.add('theme-transition');
    }, 100);
  }

  private createTheme(mode: ThemeMode): Theme {
    const effectiveMode = mode === 'system' ? this.getSystemPreference() : mode;
    const baseTheme = effectiveMode === 'dark' ? darkTheme : lightTheme;
    
    return {
      ...baseTheme,
      mode: effectiveMode,
    };
  }

  private getSystemPreference(): 'light' | 'dark' {
    return this.mediaQuery.matches ? 'dark' : 'light';
  }

  private handleSystemThemeChange = () => {
    if (this.currentMode === 'system') {
      this.currentTheme = this.createTheme('system');
      this.applyTheme();
      this.notifyListeners();
    }
  };

  private applyTheme(): void {
    const root = document.documentElement;
    const { colors, typography, spacing, animations, shadows } = this.currentTheme;

    // Set CSS custom properties
    const setCSSProperty = (name: string, value: string) => {
      root.style.setProperty(name, value);
    };

    // Brand colors
    setCSSProperty('--color-brand-red', colors.brand.red);
    setCSSProperty('--color-brand-yellow', colors.brand.yellow);
    setCSSProperty('--color-brand-red-hover', colors.brand.redHover);
    setCSSProperty('--color-brand-yellow-hover', colors.brand.yellowHover);

    // Background colors
    setCSSProperty('--color-bg-primary', colors.background.primary);
    setCSSProperty('--color-bg-secondary', colors.background.secondary);
    setCSSProperty('--color-bg-tertiary', colors.background.tertiary);
    setCSSProperty('--color-bg-elevated', colors.background.elevated);
    setCSSProperty('--color-bg-overlay', colors.background.overlay);

    // Text colors
    setCSSProperty('--color-text-primary', colors.text.primary);
    setCSSProperty('--color-text-secondary', colors.text.secondary);
    setCSSProperty('--color-text-tertiary', colors.text.tertiary);
    setCSSProperty('--color-text-muted', colors.text.muted);
    setCSSProperty('--color-text-inverse', colors.text.inverse);

    // Border colors
    setCSSProperty('--color-border-primary', colors.border.primary);
    setCSSProperty('--color-border-secondary', colors.border.secondary);
    setCSSProperty('--color-border-focus', colors.border.focus);
    setCSSProperty('--color-border-error', colors.border.error);
    setCSSProperty('--color-border-success', colors.border.success);
    setCSSProperty('--color-border-warning', colors.border.warning);

    // Status colors
    setCSSProperty('--color-status-error', colors.status.error);
    setCSSProperty('--color-status-success', colors.status.success);
    setCSSProperty('--color-status-warning', colors.status.warning);
    setCSSProperty('--color-status-info', colors.status.info);
    setCSSProperty('--color-status-error-bg', colors.status.errorBg);
    setCSSProperty('--color-status-success-bg', colors.status.successBg);
    setCSSProperty('--color-status-warning-bg', colors.status.warningBg);
    setCSSProperty('--color-status-info-bg', colors.status.infoBg);

    // Interactive colors
    setCSSProperty('--color-interactive-primary', colors.interactive.primary);
    setCSSProperty('--color-interactive-primary-hover', colors.interactive.primaryHover);
    setCSSProperty('--color-interactive-secondary', colors.interactive.secondary);
    setCSSProperty('--color-interactive-secondary-hover', colors.interactive.secondaryHover);
    setCSSProperty('--color-interactive-disabled', colors.interactive.disabled);
    setCSSProperty('--color-interactive-disabled-text', colors.interactive.disabledText);

    // Typography
    setCSSProperty('--font-family-primary', typography.families.primary);
    setCSSProperty('--font-family-display', typography.families.display);
    setCSSProperty('--font-family-mono', typography.families.mono);

    // Font sizes
    Object.entries(typography.sizes).forEach(([key, value]) => {
      setCSSProperty(`--font-size-${key}`, value);
    });

    // Spacing
    Object.entries(spacing).forEach(([key, value]) => {
      setCSSProperty(`--spacing-${key}`, value);
    });

    // Animation durations
    Object.entries(animations.durations).forEach(([key, value]) => {
      setCSSProperty(`--duration-${key}`, value);
    });

    // Animation easings
    Object.entries(animations.easings).forEach(([key, value]) => {
      setCSSProperty(`--easing-${key}`, value);
    });

    // Shadows
    Object.entries(shadows).forEach(([key, value]) => {
      setCSSProperty(`--shadow-${key}`, value);
    });

    // Set theme mode class
    root.classList.remove('theme-light', 'theme-dark');
    root.classList.add(`theme-${this.currentTheme.mode}`);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', colors.background.primary);
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(this.storageKey, this.currentMode);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  }

  private loadFromStorage(): ThemeMode | null {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved && ['light', 'dark', 'system'].includes(saved)) {
        return saved as ThemeMode;
      }
    } catch (error) {
      console.warn('Failed to load theme preference:', error);
    }
    return null;
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }

  public getTheme(): Theme {
    return this.currentTheme;
  }

  public getMode(): ThemeMode {
    return this.currentMode;
  }

  public setMode(mode: ThemeMode): void {
    if (mode !== this.currentMode) {
      this.currentMode = mode;
      this.currentTheme = this.createTheme(mode);
      this.applyTheme();
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  public toggleTheme(): void {
    const newMode = this.currentTheme.mode === 'dark' ? 'light' : 'dark';
    this.setMode(newMode);
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public get isDark(): boolean {
    return this.currentTheme.mode === 'dark';
  }

  public get isLight(): boolean {
    return this.currentTheme.mode === 'light';
  }

  public get isSystemMode(): boolean {
    return this.currentMode === 'system';
  }

  public destroy(): void {
    this.mediaQuery.removeEventListener('change', this.handleSystemThemeChange);
    this.listeners.clear();
  }
}

// Create singleton instance
let themeManager: ThemeManager | null = null;

export function getThemeManager(): ThemeManager {
  if (!themeManager && typeof window !== 'undefined') {
    themeManager = new ThemeManager();
  }
  return themeManager!;
}

// CSS for smooth theme transitions
export const themeTransitionStyles = `
  .theme-transition,
  .theme-transition *,
  .theme-transition *:before,
  .theme-transition *:after {
    transition: 
      background-color var(--duration-normal) var(--easing-default),
      border-color var(--duration-normal) var(--easing-default),
      color var(--duration-normal) var(--easing-default),
      box-shadow var(--duration-normal) var(--easing-default) !important;
  }
`;

// Keyframes for animations
export const themeKeyframes = `
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

// Export theme instances for direct use
export const themes = {
  light: { ...lightTheme, mode: 'light' as const },
  dark: { ...darkTheme, mode: 'dark' as const },
};

export default themeManager;