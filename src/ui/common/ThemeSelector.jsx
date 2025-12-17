import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette, Check, X } from 'lucide-react'
import { useSiteStore } from '@core/state/siteStore'
import { useEditorStore } from '@core/state/editorStore'
import { THEMES, THEME_ORDER, getTheme } from '@core/theme/themes'

// ═══════════════════════════════════════════════════════════════════
// 🎨 COMPOSANT THEME SELECTOR
// ═══════════════════════════════════════════════════════════════════

function ThemeSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const currentThemeId = useSiteStore((s) => s.site?.theme || 'aurora')
  const setTheme = useSiteStore((s) => s.setTheme)
  const showToast = useEditorStore((s) => s.showToast)
  
  const currentTheme = getTheme(currentThemeId)
  
  const handleThemeSelect = (themeId) => {
    setTheme(themeId)
    const theme = getTheme(themeId)
    showToast(`${theme.emoji} Thème ${theme.name} appliqué !`, 'success')
    setIsOpen(false)
  }
  
  return (
    <div className="relative">
      {/* Bouton déclencheur */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center gap-2 px-3 py-2 rounded-xl overflow-hidden group"
        style={{
          background: isOpen ? currentTheme.gradient : 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
          }}
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
        />
        
        <Palette className="w-4 h-4 text-white relative z-10" />
        <span className="text-sm font-medium text-white relative z-10 hidden sm:inline">
          {currentTheme.emoji} {currentTheme.name}
        </span>
        <span className="text-sm font-medium text-white relative z-10 sm:hidden">
          {currentTheme.emoji}
        </span>
      </motion.button>
      
      {/* Popup de sélection */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            
            {/* Panel */}
            <motion.div
              className="absolute top-full right-0 mt-2 z-50 p-4 rounded-2xl"
              style={{
                background: 'rgba(18, 18, 26, 0.98)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                backdropFilter: 'blur(20px)',
                minWidth: '320px',
              }}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Palette className="w-5 h-5" style={{ color: currentTheme.colors.accent.primary }} />
                  Choisis ton thème
                </h3>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.1)' }}
                  whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.2)' }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4 text-white/60" />
                </motion.button>
              </div>
              
              {/* Grille de thèmes */}
              <div className="grid grid-cols-1 gap-3">
                {THEME_ORDER.map((themeId, index) => {
                  const theme = THEMES[themeId]
                  const isActive = themeId === currentThemeId
                  
                  return (
                    <motion.button
                      key={themeId}
                      onClick={() => handleThemeSelect(themeId)}
                      className="relative flex items-center gap-4 p-3 rounded-xl text-left overflow-hidden group"
                      style={{
                        background: isActive 
                          ? theme.gradientSubtle 
                          : 'rgba(255,255,255,0.03)',
                        border: isActive 
                          ? `2px solid ${theme.colors.accent.primary}` 
                          : '2px solid transparent',
                      }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ 
                        scale: 1.02,
                        background: theme.gradientSubtle,
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Aperçu des couleurs */}
                      <div 
                        className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 relative overflow-hidden"
                        style={{ background: theme.preview.bg }}
                      >
                        {/* Gradient orbs */}
                        <div 
                          className="absolute w-6 h-6 rounded-full blur-sm"
                          style={{ 
                            background: theme.preview.primary,
                            top: '20%',
                            left: '20%',
                          }}
                        />
                        <div 
                          className="absolute w-5 h-5 rounded-full blur-sm"
                          style={{ 
                            background: theme.preview.secondary,
                            bottom: '25%',
                            right: '20%',
                          }}
                        />
                        <div 
                          className="absolute w-4 h-4 rounded-full blur-sm"
                          style={{ 
                            background: theme.preview.tertiary,
                            top: '50%',
                            right: '30%',
                          }}
                        />
                        
                        {/* Emoji */}
                        <span className="text-xl relative z-10">{theme.emoji}</span>
                      </div>
                      
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{theme.name}</span>
                          {theme.isDark ? (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/60">
                              Dark
                            </span>
                          ) : (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/10 text-white/60">
                              Light
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-white/50 truncate">{theme.description}</p>
                      </div>
                      
                      {/* Check mark si actif */}
                      {isActive && (
                        <motion.div
                          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: theme.gradient }}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', damping: 15 }}
                        >
                          <Check className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                      
                      {/* Hover indicator */}
                      {!isActive && (
                        <motion.div
                          className="absolute inset-0 rounded-xl pointer-events-none"
                          style={{
                            background: theme.gradient,
                            opacity: 0,
                          }}
                          whileHover={{ opacity: 0.1 }}
                        />
                      )}
                    </motion.button>
                  )
                })}
              </div>
              
              {/* Footer hint */}
              <p className="text-xs text-white/30 text-center mt-4">
                ✨ Le thème s'applique à tout ton site
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ThemeSelector
