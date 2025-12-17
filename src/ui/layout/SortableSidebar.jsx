import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Plus, X, Menu } from 'lucide-react'
import { useSiteStore } from '@core/state/siteStore'
import { useEditorStore } from '@core/state/editorStore'
import { useTheme } from '@core/theme/ThemeProvider'
import SortableSection from './SortableSection'
import DynamicIcon from '@ui/common/DynamicIcon'

// ═══════════════════════════════════════════════════════════════════
// 🔀 SORTABLE SIDEBAR - Drag & Drop des sections
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

function SortableSidebar() {
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [activeId, setActiveId] = useState(null)
  
  const sectionsOrder = useSiteStore((s) => s.site?.sectionsOrder || [])
  const sections = useSiteStore((s) => s.site?.sections || {})
  const reorderSections = useSiteStore((s) => s.reorderSections)
  const addSection = useSiteStore((s) => s.addSection)
  
  const activeSection = useEditorStore((s) => s.activeSection)
  const setActiveSection = useEditorStore((s) => s.setActiveSection)
  const showToast = useEditorStore((s) => s.showToast)
  const toggleHeader = useEditorStore((s) => s.toggleHeader)
  
  const { colors, gradient } = useTheme()

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Handle drag start
  const handleDragStart = (event) => {
    setActiveId(event.active.id)
  }

  // Handle drag end
  const handleDragEnd = (event) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return
    if (active.id === over.id) return
    
    // Don't allow moving hero
    if (active.id === 'hero') {
      showToast('🔒 Le Hero reste toujours en première position !', 'info')
      return
    }
    
    // Don't allow moving before hero
    if (over.id === 'hero') {
      showToast('🔒 Rien ne peut passer avant le Hero !', 'info')
      return
    }

    const oldIndex = sectionsOrder.indexOf(active.id)
    const newIndex = sectionsOrder.indexOf(over.id)

    if (oldIndex !== newIndex) {
      reorderSections(oldIndex, newIndex)
      showToast('✨ Section déplacée !', 'success')
    }
  }

  // Handle add section
  const handleAddSection = (type) => {
    const newId = addSection(type)
    setActiveSection(newId)
    setShowAddMenu(false)
    showToast(`✨ Section ${SECTION_LABELS[type]} ajoutée !`, 'success')
  }

  // Get active section for overlay
  const activeDragSection = activeId ? sections[activeId] : null

  return (
    <div 
      className="w-20 flex flex-col items-center pb-4 relative z-20"
      style={{ 
        background: '#FFFFFF',
        borderRight: `1px solid ${colors.border}`,
      }}
    >
      {/* Bandeau blanc avec icône Menu dégradé - même hauteur (h-20) */}
      <div 
        className="w-full h-20 flex justify-center items-center shrink-0"
        style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}
      >
        <motion.button 
          className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #F472B6 0%, #A78BFA 50%, #22D3EE 100%)' }}
          onClick={toggleHeader}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Menu className="w-5 h-5" style={{ color: '#FFFFFF' }} />
        </motion.button>
      </div>

      {/* Sections list with DnD - Centré verticalement */}
      <div className="flex-1 flex flex-col justify-center gap-2 w-full px-2 overflow-y-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sectionsOrder}
            strategy={verticalListSortingStrategy}
          >
            {sectionsOrder.map((sectionId) => {
              const section = sections[sectionId]
              if (!section) return null
              
              return (
                <SortableSection
                  key={sectionId}
                  id={sectionId}
                  section={section}
                  isActive={activeSection === sectionId}
                  isHero={sectionId === 'hero'}
                  icon={SECTION_ICONS[section.type]}
                  label={SECTION_LABELS[section.type]}
                />
              )
            })}
          </SortableContext>

          {/* Drag Overlay */}
          <DragOverlay>
            {activeId && activeDragSection ? (
              <motion.div
                className="w-16 aspect-square rounded-xl flex flex-col items-center justify-center gap-1"
                style={{
                  background: gradient,
                  boxShadow: `0 10px 40px ${colors.accent.primary}50`,
                  transform: 'scale(1.05)',
                }}
                initial={{ scale: 1 }}
                animate={{ scale: 1.05, rotate: [0, 2, -2, 0] }}
              >
                <DynamicIcon 
                  name={SECTION_ICONS[activeDragSection.type] || 'Box'}
                  size={20}
                  color="white"
                />
                <span className="text-[9px] font-medium text-white">
                  {SECTION_LABELS[activeDragSection.type]}
                </span>
              </motion.div>
            ) : null}
          </DragOverlay>
        </DndContext>
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

export default SortableSidebar
