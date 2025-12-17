import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Eye, EyeOff, Trash2, Copy } from 'lucide-react'
import { useSiteStore } from '@core/state/siteStore'
import { useEditorStore } from '@core/state/editorStore'
import { useTheme } from '@core/theme/ThemeProvider'
import DynamicIcon from '@ui/common/DynamicIcon'

// ═══════════════════════════════════════════════════════════════════
// 📍 SIDEBAR
// ═══════════════════════════════════════════════════════════════════

// Mapping type → icône Lucide
const SECTION_ICONS = {
  hero: 'Sparkles',
  features: 'Grid3X3',
  howItWorks: 'GitBranch',
  pricing: 'CreditCard',
  faq: 'HelpCircle',
}

// Mapping type → label
const SECTION_LABELS = {
  hero: 'Hero',
  features: 'Features',
  howItWorks: 'Étapes',
  pricing: 'Tarifs',
  faq: 'FAQ',
}

// Types ajoutables (pas hero)
const ADDABLE_SECTIONS = ['features', 'howItWorks', 'pricing', 'faq']

function Sidebar() {
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [hoveredId, setHoveredId] = useState(null)
  
  const sectionsOrder = useSiteStore((s) => s.site?.sectionsOrder || [])
  const sectionsVisibility = useSiteStore((s) => s.site?.sectionsVisibility || {})
  const sections = useSiteStore((s) => s.site?.sections || {})
  const addSection = useSiteStore((s) => s.addSection)
  const deleteSection = useSiteStore((s) => s.deleteSection)
  const duplicateSection = useSiteStore((s) => s.duplicateSection)
  const toggleVisibility = useSiteStore((s) => s.toggleVisibility)
  
  const activeSection = useEditorStore((s) => s.activeSection)
  const setActiveSection = useEditorStore((s) => s.setActiveSection)
  const showToast = useEditorStore((s) => s.showToast)
  
  const { colors, gradient } = useTheme()

  const handleAddSection = (type) => {
    const newId = addSection(type)
    setActiveSection(newId)
    setShowAddMenu(false)
    showToast(`✨ Section ${SECTION_LABELS[type]} ajoutée !`, 'success')
  }

  const handleDelete = (e, sectionId) => {
    e.stopPropagation()
    if (sectionId === 'hero') return
    deleteSection(sectionId)
    if (activeSection === sectionId) setActiveSection(null)
    showToast('🗑️ Section supprimée', 'info')
  }

  const handleDuplicate = (e, sectionId) => {
    e.stopPropagation()
    const newId = duplicateSection(sectionId)
    if (newId) {
      setActiveSection(newId)
      showToast('📋 Section dupliquée !', 'success')
    }
  }

  const handleToggleVisibility = (e, sectionId) => {
    e.stopPropagation()
    toggleVisibility(sectionId)
  }

  return (
    <div 
      className="w-20 flex flex-col items-center py-4 relative z-20"
      style={{ 
        background: '#FFFFFF',
        borderRight: `1px solid ${colors.border}`,
      }}
    >
      {/* Logo */}
      <motion.div 
        className="mb-6 cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setActiveSection(null)}
      >
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
          style={{ background: gradient }}
        >
          🫧
        </div>
      </motion.div>

      {/* Sections list */}
      <div className="flex-1 flex flex-col gap-2 w-full px-2">
        {sectionsOrder.map((sectionId) => {
          const section = sections[sectionId]
          if (!section) return null
          
          const isActive = activeSection === sectionId
          const isVisible = sectionsVisibility[sectionId] !== false
          const isHovered = hoveredId === sectionId
          const isHero = sectionId === 'hero'
          
          return (
            <motion.div
              key={sectionId}
              className="relative"
              onMouseEnter={() => setHoveredId(sectionId)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Main button */}
              <motion.button
                className={`w-full aspect-square rounded-xl flex flex-col items-center justify-center gap-1 relative overflow-hidden transition-all ${
                  !isVisible ? 'opacity-40' : ''
                }`}
                style={{
                  background: isActive ? gradient : colors.surface,
                  border: `1px solid ${isActive ? 'transparent' : colors.border}`,
                }}
                onClick={() => setActiveSection(sectionId)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0"
                    style={{ background: gradient }}
                    layoutId="activeSection"
                  />
                )}
                
                <DynamicIcon 
                  name={SECTION_ICONS[section.type] || 'Box'}
                  size={20}
                  color={isActive ? 'white' : colors.text.muted}
                  className="relative z-10"
                />
                <span 
                  className="text-[9px] font-medium relative z-10"
                  style={{ color: isActive ? 'white' : colors.text.muted }}
                >
                  {SECTION_LABELS[section.type]}
                </span>
              </motion.button>

              {/* Actions menu on hover */}
              <AnimatePresence>
                {isHovered && !isHero && (
                  <motion.div
                    className="absolute left-full top-0 ml-2 flex flex-col gap-1 z-30"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                  >
                    {/* Toggle visibility */}
                    <motion.button
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ 
                        background: colors.surface,
                        border: `1px solid ${colors.border}`,
                      }}
                      onClick={(e) => handleToggleVisibility(e, sectionId)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title={isVisible ? 'Masquer' : 'Afficher'}
                    >
                      {isVisible ? (
                        <Eye className="w-4 h-4" style={{ color: colors.text.muted }} />
                      ) : (
                        <EyeOff className="w-4 h-4" style={{ color: colors.text.muted }} />
                      )}
                    </motion.button>
                    
                    {/* Duplicate */}
                    <motion.button
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ 
                        background: colors.surface,
                        border: `1px solid ${colors.border}`,
                      }}
                      onClick={(e) => handleDuplicate(e, sectionId)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Dupliquer"
                    >
                      <Copy className="w-4 h-4" style={{ color: colors.text.muted }} />
                    </motion.button>
                    
                    {/* Delete */}
                    <motion.button
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ 
                        background: colors.surface,
                        border: `1px solid ${colors.border}`,
                      }}
                      onClick={(e) => handleDelete(e, sectionId)}
                      whileHover={{ scale: 1.1, background: '#EF444420' }}
                      whileTap={{ scale: 0.9 }}
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" style={{ color: '#EF4444' }} />
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {/* Add section button */}
      <div className="relative mt-4">
        <motion.button
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ 
            background: showAddMenu ? gradient : colors.surface,
            border: `1px solid ${showAddMenu ? 'transparent' : colors.border}`,
          }}
          onClick={() => setShowAddMenu(!showAddMenu)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div animate={{ rotate: showAddMenu ? 45 : 0 }}>
            <Plus 
              className="w-5 h-5" 
              style={{ color: showAddMenu ? 'white' : colors.text.muted }}
            />
          </motion.div>
        </motion.button>

        {/* Add menu popup */}
        <AnimatePresence>
          {showAddMenu && (
            <motion.div
              className="absolute left-full bottom-0 ml-3 p-3 rounded-2xl z-50"
              style={{
                background: colors.surface,
                border: `1px solid ${colors.border}`,
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              }}
              initial={{ opacity: 0, x: -10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -10, scale: 0.95 }}
            >
              <div className="flex items-center justify-between mb-3">
                <span 
                  className="text-sm font-semibold"
                  style={{ color: colors.text.primary }}
                >
                  Ajouter une section
                </span>
                <motion.button
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: colors.border }}
                  onClick={() => setShowAddMenu(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-3 h-3" style={{ color: colors.text.muted }} />
                </motion.button>
              </div>
              
              <div className="grid grid-cols-2 gap-2" style={{ width: '200px' }}>
                {ADDABLE_SECTIONS.map((type) => (
                  <motion.button
                    key={type}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl"
                    style={{ 
                      background: colors.backgroundSecondary,
                      border: `1px solid ${colors.border}`,
                    }}
                    onClick={() => handleAddSection(type)}
                    whileHover={{ 
                      scale: 1.05,
                      borderColor: colors.accent.primary,
                      background: `${colors.accent.primary}10`,
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <DynamicIcon 
                      name={SECTION_ICONS[type]}
                      size={24}
                      color={colors.accent.primary}
                    />
                    <span 
                      className="text-xs font-medium"
                      style={{ color: colors.text.secondary }}
                    >
                      {SECTION_LABELS[type]}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Sidebar
