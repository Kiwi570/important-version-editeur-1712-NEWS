import React, { createContext, useContext, useEffect, useMemo } from 'react'
import { useSiteStore } from '@core/state/siteStore'
import { THEMES, getTheme, applyTheme } from './themes'

// ═══════════════════════════════════════════════════════════════════
// 🎨 CONTEXTE DU THÈME
// ═══════════════════════════════════════════════════════════════════

const ThemeContext = createContext({
  theme: THEMES.aurora,
  themeId: 'aurora',
  isDark: true,
  colors: THEMES.aurora.colors,
  gradient: THEMES.aurora.gradient,
})

// ═══════════════════════════════════════════════════════════════════
// 🎨 PROVIDER DU THÈME
// ═══════════════════════════════════════════════════════════════════

export function ThemeProvider({ children }) {
  const themeId = useSiteStore((s) => s.site?.theme || 'aurora')
  
  // Mémoiser l'objet thème
  const theme = useMemo(() => getTheme(themeId), [themeId])
  
  // Appliquer le thème au document quand il change
  useEffect(() => {
    applyTheme(themeId)
    
    // Ajouter une classe au body pour les styles qui dépendent du mode clair/sombre
    if (theme.isDark) {
      document.body.classList.add('dark-mode')
      document.body.classList.remove('light-mode')
    } else {
      document.body.classList.add('light-mode')
      document.body.classList.remove('dark-mode')
    }
  }, [themeId, theme.isDark])
  
  // Valeur du contexte
  const value = useMemo(() => ({
    theme,
    themeId,
    isDark: theme.isDark,
    colors: theme.colors,
    gradient: theme.gradient,
  }), [theme, themeId])
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

// ═══════════════════════════════════════════════════════════════════
// 🪝 HOOK POUR UTILISER LE THÈME
// ═══════════════════════════════════════════════════════════════════

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// ═══════════════════════════════════════════════════════════════════
// 🎨 HOOK POUR LES COULEURS DYNAMIQUES
// ═══════════════════════════════════════════════════════════════════

export function useThemeColors() {
  const { colors, gradient, isDark } = useTheme()
  
  return useMemo(() => ({
    ...colors,
    gradient,
    isDark,
    // Helpers pour les styles inline
    getTextColor: (variant = 'primary') => colors.text[variant],
    getAccentColor: (variant = 'primary') => colors.accent[variant],
    getBg: () => colors.background,
    getSurface: () => colors.surface,
    getBorder: () => colors.border,
  }), [colors, gradient, isDark])
}

// ═══════════════════════════════════════════════════════════════════
// 🎨 COMPOSANT DE STYLE DYNAMIQUE
// ═══════════════════════════════════════════════════════════════════

export function ThemedBox({ 
  children, 
  variant = 'surface', 
  hover = false,
  glow = false,
  className = '',
  style = {},
  ...props 
}) {
  const { colors, gradient } = useTheme()
  
  const baseStyles = {
    surface: {
      background: colors.surface,
      border: `1px solid ${colors.border}`,
    },
    card: {
      background: colors.surface,
      border: `1px solid ${colors.border}`,
      borderRadius: 'var(--radius-lg)',
    },
    gradient: {
      background: gradient,
    },
    glass: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      border: `1px solid ${colors.border}`,
    },
  }
  
  const hoverStyles = hover ? {
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  } : {}
  
  const glowStyles = glow ? {
    boxShadow: `0 0 20px ${colors.accent.primary}40`,
  } : {}
  
  return (
    <div
      className={className}
      style={{
        ...baseStyles[variant],
        ...hoverStyles,
        ...glowStyles,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  )
}

export default ThemeProvider
