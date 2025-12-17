import React from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useSiteStore } from '@core/state/siteStore'
import { useEditorStore } from '@core/state/editorStore'
import { useTheme } from '@core/theme/ThemeProvider'

// ═══════════════════════════════════════════════════════════════════
// 📐 LAYOUT PANEL
// ═══════════════════════════════════════════════════════════════════

const LAYOUTS = {
  hero: [
    { id: 'centered', name: 'Centré', icon: '⬜', description: 'Texte centré, idéal pour un message fort' },
    { id: 'split-left', name: 'Image gauche', icon: '◧', description: 'Image à gauche, texte à droite' },
    { id: 'split-right', name: 'Image droite', icon: '◨', description: 'Texte à gauche, image à droite' },
  ],
  features: [
    { id: 'grid-3', name: 'Grille 3 colonnes', icon: '▦', description: 'Classique et équilibré' },
    { id: 'grid-2', name: 'Grille 2 colonnes', icon: '▤', description: 'Plus d\'espace pour chaque feature' },
    { id: 'list', name: 'Liste', icon: '▥', description: 'Features en liste verticale' },
  ],
  howItWorks: [
    { id: 'timeline', name: 'Timeline', icon: '⏳', description: 'Étapes en alternance' },
    { id: 'cards', name: 'Cartes', icon: '▣', description: 'Étapes en cartes horizontales' },
    { id: 'minimal', name: 'Minimal', icon: '▫', description: 'Simple et épuré' },
  ],
  pricing: [
    { id: 'cards', name: 'Cartes', icon: '▣', description: 'Chaque plan dans une carte' },
    { id: 'table', name: 'Tableau', icon: '▤', description: 'Comparaison en tableau' },
    { id: 'minimal', name: 'Minimal', icon: '▫', description: 'Épuré et simple' },
  ],
  faq: [
    { id: 'accordion', name: 'Accordéon', icon: '▼', description: 'Questions dépliables' },
    { id: 'grid', name: 'Grille', icon: '▦', description: 'Questions en grille' },
    { id: 'simple', name: 'Simple', icon: '▫', description: 'Liste simple' },
  ],
}

const SPACING_OPTIONS = [
  { id: 'compact', name: 'Compact', description: 'Moins d\'espace' },
  { id: 'normal', name: 'Normal', description: 'Équilibré' },
  { id: 'spacious', name: 'Spacieux', description: 'Plus d\'air' },
]

function LayoutPanel() {
  const activeSection = useEditorStore((s) => s.activeSection)
  const highlightSection = useEditorStore((s) => s.highlightSection)
  const showToast = useEditorStore((s) => s.showToast)
  
  const section = useSiteStore((s) => activeSection ? s.getSection(activeSection) : null)
  const updateLayout = useSiteStore((s) => s.updateLayout)
  
  const { colors, gradient } = useTheme()

  if (!activeSection || !section) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center">
          <motion.div
            className="text-5xl mb-4"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            📐
          </motion.div>
          <p style={{ color: colors.text.muted }}>
            Sélectionne une section pour modifier son layout
          </p>
        </div>
      </div>
    )
  }

  const layouts = LAYOUTS[section.type] || []
  const currentLayout = section.layout?.variant || layouts[0]?.id
  const currentSpacing = section.layout?.spacing || 'normal'

  const handleLayoutChange = (layoutId) => {
    updateLayout(activeSection, { variant: layoutId })
    highlightSection(activeSection)
    showToast(`✨ Layout changé !`, 'success')
  }

  const handleSpacingChange = (spacingId) => {
    updateLayout(activeSection, { spacing: spacingId })
    highlightSection(activeSection)
  }

  return (
    <div className="h-full overflow-y-auto p-4 space-y-6">
      {/* Section badge */}
      <div 
        className="px-3 py-2 rounded-lg text-xs font-medium"
        style={{ 
          background: `${colors.accent.primary}15`,
          color: colors.accent.primary,
        }}
      >
        Section: {section.type.charAt(0).toUpperCase() + section.type.slice(1)}
      </div>

      {/* Layout options */}
      <div className="space-y-3">
        <label 
          className="text-xs font-medium"
          style={{ color: colors.text.muted }}
        >
          Disposition
        </label>
        
        <div className="space-y-2">
          {layouts.map((layout) => {
            const isActive = currentLayout === layout.id
            
            return (
              <motion.button
                key={layout.id}
                className="w-full flex items-center gap-4 p-4 rounded-xl text-left"
                style={{
                  background: isActive ? `${colors.accent.primary}15` : colors.surface,
                  border: `2px solid ${isActive ? colors.accent.primary : colors.border}`,
                }}
                onClick={() => handleLayoutChange(layout.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Icon */}
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ 
                    background: isActive ? gradient : colors.backgroundSecondary,
                  }}
                >
                  {isActive ? (
                    <Check className="w-6 h-6 text-white" />
                  ) : (
                    <span style={{ opacity: 0.5 }}>{layout.icon}</span>
                  )}
                </div>
                
                {/* Text */}
                <div className="flex-1">
                  <div 
                    className="font-semibold"
                    style={{ color: colors.text.primary }}
                  >
                    {layout.name}
                  </div>
                  <div 
                    className="text-xs"
                    style={{ color: colors.text.muted }}
                  >
                    {layout.description}
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Spacing options */}
      <div className="space-y-3">
        <label 
          className="text-xs font-medium"
          style={{ color: colors.text.muted }}
        >
          Espacement
        </label>
        
        <div className="flex gap-2">
          {SPACING_OPTIONS.map((spacing) => {
            const isActive = currentSpacing === spacing.id
            
            return (
              <motion.button
                key={spacing.id}
                className="flex-1 py-3 rounded-xl text-center"
                style={{
                  background: isActive ? gradient : colors.surface,
                  border: `1px solid ${isActive ? 'transparent' : colors.border}`,
                  color: isActive ? 'white' : colors.text.muted,
                }}
                onClick={() => handleSpacingChange(spacing.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-sm font-medium">{spacing.name}</div>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Visual preview hint */}
      <div 
        className="p-4 rounded-xl text-center"
        style={{ 
          background: colors.surface,
          border: `1px dashed ${colors.border}`,
        }}
      >
        <p 
          className="text-xs"
          style={{ color: colors.text.light }}
        >
          💡 Les changements s'appliquent en temps réel sur le canvas
        </p>
      </div>
    </div>
  )
}

export default LayoutPanel
