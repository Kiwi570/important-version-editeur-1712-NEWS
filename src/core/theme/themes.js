// ═══════════════════════════════════════════════════════════════════
// 🎨 BULLE EDITOR - SYSTÈME DE THÈMES
// ═══════════════════════════════════════════════════════════════════

export const THEMES = {
  aurora: {
    id: 'aurora',
    name: 'Aurora',
    emoji: '🌌',
    description: 'Violet, rose et cyan - Le thème signature de Bulle',
    preview: {
      bg: '#0a0a0f',
      primary: '#A78BFA',
      secondary: '#F472B6',
      tertiary: '#22D3EE',
    },
    colors: {
      background: '#0a0a0f',
      backgroundSecondary: '#12121a',
      surface: '#1a1a2e',
      surfaceHover: '#252542',
      border: 'rgba(255, 255, 255, 0.1)',
      borderHover: 'rgba(255, 255, 255, 0.2)',
      text: {
        primary: '#FFFFFF',
        secondary: '#E5E7EB',
        muted: '#9CA3AF',
        light: '#6B7280',
      },
      accent: {
        primary: '#A78BFA',
        secondary: '#F472B6',
        tertiary: '#22D3EE',
        success: '#34D399',
        warning: '#FBBF24',
        error: '#EF4444',
      },
    },
    gradient: 'linear-gradient(135deg, #A78BFA 0%, #F472B6 50%, #22D3EE 100%)',
    gradientSubtle: 'linear-gradient(135deg, rgba(167, 139, 250, 0.2) 0%, rgba(244, 114, 182, 0.15) 100%)',
    shadows: {
      glow: '0 0 20px rgba(167, 139, 250, 0.3)',
      glowStrong: '0 0 40px rgba(167, 139, 250, 0.5)',
      card: '0 10px 40px rgba(0, 0, 0, 0.3)',
    },
    isDark: true,
  },

  corporate: {
    id: 'corporate',
    name: 'Corporate',
    emoji: '🏢',
    description: 'Bleu marine professionnel et épuré',
    preview: {
      bg: '#0f172a',
      primary: '#3B82F6',
      secondary: '#06B6D4',
      tertiary: '#8B5CF6',
    },
    colors: {
      background: '#0f172a',
      backgroundSecondary: '#1e293b',
      surface: '#334155',
      surfaceHover: '#475569',
      border: 'rgba(148, 163, 184, 0.2)',
      borderHover: 'rgba(148, 163, 184, 0.4)',
      text: {
        primary: '#F8FAFC',
        secondary: '#E2E8F0',
        muted: '#94A3B8',
        light: '#64748B',
      },
      accent: {
        primary: '#3B82F6',
        secondary: '#06B6D4',
        tertiary: '#8B5CF6',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
      },
    },
    gradient: 'linear-gradient(135deg, #1E3A5F 0%, #3B82F6 50%, #06B6D4 100%)',
    gradientSubtle: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(6, 182, 212, 0.15) 100%)',
    shadows: {
      glow: '0 0 20px rgba(59, 130, 246, 0.3)',
      glowStrong: '0 0 40px rgba(59, 130, 246, 0.5)',
      card: '0 10px 40px rgba(0, 0, 0, 0.4)',
    },
    isDark: true,
  },

  pastel: {
    id: 'pastel',
    name: 'Pastel',
    emoji: '🌸',
    description: 'Doux et chaleureux, parfait pour le lifestyle',
    preview: {
      bg: '#FDF2F8',
      primary: '#EC4899',
      secondary: '#A78BFA',
      tertiary: '#34D399',
    },
    colors: {
      background: '#FDF2F8',
      backgroundSecondary: '#FCE7F3',
      surface: '#FFFFFF',
      surfaceHover: '#FDF2F8',
      border: 'rgba(236, 72, 153, 0.2)',
      borderHover: 'rgba(236, 72, 153, 0.4)',
      text: {
        primary: '#1F2937',
        secondary: '#374151',
        muted: '#6B7280',
        light: '#9CA3AF',
      },
      accent: {
        primary: '#EC4899',
        secondary: '#A78BFA',
        tertiary: '#34D399',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
      },
    },
    gradient: 'linear-gradient(135deg, #FBCFE8 0%, #DDD6FE 50%, #A7F3D0 100%)',
    gradientSubtle: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(167, 139, 250, 0.1) 100%)',
    shadows: {
      glow: '0 0 20px rgba(236, 72, 153, 0.2)',
      glowStrong: '0 0 40px rgba(236, 72, 153, 0.3)',
      card: '0 10px 40px rgba(236, 72, 153, 0.1)',
    },
    isDark: false,
  },

  neon: {
    id: 'neon',
    name: 'Neon',
    emoji: '⚡',
    description: 'Cyberpunk et électrique',
    preview: {
      bg: '#030712',
      primary: '#22C55E',
      secondary: '#F43F5E',
      tertiary: '#FACC15',
    },
    colors: {
      background: '#030712',
      backgroundSecondary: '#0a0a0f',
      surface: '#111827',
      surfaceHover: '#1F2937',
      border: 'rgba(34, 197, 94, 0.3)',
      borderHover: 'rgba(34, 197, 94, 0.5)',
      text: {
        primary: '#F0FDF4',
        secondary: '#DCFCE7',
        muted: '#86EFAC',
        light: '#4ADE80',
      },
      accent: {
        primary: '#22C55E',
        secondary: '#F43F5E',
        tertiary: '#FACC15',
        success: '#22C55E',
        warning: '#FACC15',
        error: '#F43F5E',
      },
    },
    gradient: 'linear-gradient(135deg, #22C55E 0%, #F43F5E 50%, #FACC15 100%)',
    gradientSubtle: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(244, 63, 94, 0.15) 100%)',
    shadows: {
      glow: '0 0 30px rgba(34, 197, 94, 0.5)',
      glowStrong: '0 0 60px rgba(34, 197, 94, 0.7)',
      card: '0 10px 40px rgba(0, 0, 0, 0.5)',
    },
    isDark: true,
  },

  minimal: {
    id: 'minimal',
    name: 'Minimal',
    emoji: '🪨',
    description: 'Élégance sobre en noir et blanc',
    preview: {
      bg: '#FFFFFF',
      primary: '#111827',
      secondary: '#4B5563',
      tertiary: '#6B7280',
    },
    colors: {
      background: '#FFFFFF',
      backgroundSecondary: '#F9FAFB',
      surface: '#F3F4F6',
      surfaceHover: '#E5E7EB',
      border: 'rgba(0, 0, 0, 0.1)',
      borderHover: 'rgba(0, 0, 0, 0.2)',
      text: {
        primary: '#111827',
        secondary: '#1F2937',
        muted: '#6B7280',
        light: '#9CA3AF',
      },
      accent: {
        primary: '#111827',
        secondary: '#4B5563',
        tertiary: '#6B7280',
        success: '#059669',
        warning: '#D97706',
        error: '#DC2626',
      },
    },
    gradient: 'linear-gradient(135deg, #111827 0%, #374151 50%, #6B7280 100%)',
    gradientSubtle: 'linear-gradient(135deg, rgba(17, 24, 39, 0.05) 0%, rgba(75, 85, 99, 0.05) 100%)',
    shadows: {
      glow: '0 0 20px rgba(0, 0, 0, 0.1)',
      glowStrong: '0 0 40px rgba(0, 0, 0, 0.15)',
      card: '0 4px 20px rgba(0, 0, 0, 0.08)',
    },
    isDark: false,
  },
}

// Liste ordonnée des thèmes pour l'affichage
export const THEME_ORDER = ['aurora', 'corporate', 'pastel', 'neon', 'minimal']

// Obtenir un thème par ID
export const getTheme = (themeId) => THEMES[themeId] || THEMES.aurora

// Obtenir la liste des thèmes
export const getThemeList = () => THEME_ORDER.map(id => THEMES[id])

// Appliquer un thème au document
export const applyTheme = (themeId) => {
  const theme = getTheme(themeId)
  document.documentElement.setAttribute('data-theme', themeId)
  
  // Mettre à jour les méta-couleurs pour les navigateurs mobiles
  const metaThemeColor = document.querySelector('meta[name="theme-color"]')
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', theme.colors.background)
  }
  
  return theme
}

// Détecter si le système préfère le mode sombre
export const prefersDarkMode = () => {
  if (typeof window === 'undefined') return true
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

// Obtenir le thème par défaut basé sur les préférences système
export const getDefaultTheme = () => {
  return prefersDarkMode() ? 'aurora' : 'minimal'
}

export default THEMES
