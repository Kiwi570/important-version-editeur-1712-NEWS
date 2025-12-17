import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Eye, EyeOff, Trash2, Copy, Lock } from 'lucide-react'
import { useSiteStore } from '@core/state/siteStore'
import { useEditorStore } from '@core/state/editorStore'
import { useTheme } from '@core/theme/ThemeProvider'
import DynamicIcon from '@ui/common/DynamicIcon'

// ═══════════════════════════════════════════════════════════════════
// 🎯 SORTABLE SECTION - Item draggable
// ═══════════════════════════════════════════════════════════════════

function SortableSection({ id, section, isActive, isHero, icon, label }) {
  const [isHovered, setIsHovered] = useState(false)
  
  const sectionsVisibility = useSiteStore((s) => s.site?.sectionsVisibility || {})
  const deleteSection = useSiteStore((s) => s.deleteSection)
  const duplicateSection = useSiteStore((s) => s.duplicateSection)
  const toggleVisibility = useSiteStore((s) => s.toggleVisibility)
  
  const activeSection = useEditorStore((s) => s.activeSection)
  const setActiveSection = useEditorStore((s) => s.setActiveSection)
  const showToast = useEditorStore((s) => s.showToast)
  
  const { colors, gradient } = useTheme()

  const isVisible = sectionsVisibility[id] !== false

  // Sortable hook
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id,
    disabled: isHero, // Hero can't be dragged
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  }

  // Handlers
  const handleClick = () => {
    setActiveSection(id)
  }

  const handleToggleVisibility = (e) => {
    e.stopPropagation()
    toggleVisibility(id)
  }

  const handleDuplicate = (e) => {
    e.stopPropagation()
    const newId = duplicateSection(id)
    if (newId) {
      setActiveSection(newId)
      showToast('📋 Section dupliquée !', 'success')
    }
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    if (isHero) return
    deleteSection(id)
    if (activeSection === id) setActiveSection(null)
    showToast('🗑️ Section supprimée', 'info')
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main button */}
      <motion.div
        className={`w-full aspect-square rounded-xl flex flex-col items-center justify-center relative overflow-hidden cursor-pointer ${
          !isVisible ? 'opacity-40' : ''
        }`}
        style={{
          background: isActive ? gradient : colors.surface,
          border: `1px solid ${isActive ? 'transparent' : colors.border}`,
          boxShadow: isDragging ? `0 10px 30px ${colors.accent.primary}40` : 'none',
        }}
        onClick={handleClick}
        whileHover={{ scale: isDragging ? 1 : 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Drag handle (visible on hover, not for hero) */}
        {!isHero && (
          <motion.div
            className="absolute top-1 left-1/2 -translate-x-1/2 cursor-grab active:cursor-grabbing"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered || isDragging ? 1 : 0 }}
            {...attributes}
            {...listeners}
          >
            <GripVertical 
              className="w-4 h-4" 
              style={{ color: isActive ? 'rgba(255,255,255,0.7)' : colors.text.light }}
            />
          </motion.div>
        )}

        {/* Lock icon for hero */}
        {isHero && (
          <motion.div
            className="absolute top-1 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 0.7 : 0 }}
          >
            <Lock 
              className="w-3 h-3" 
              style={{ color: isActive ? 'white' : colors.text.light }}
            />
          </motion.div>
        )}

        {/* Icon */}
        <DynamicIcon 
          name={icon || 'Box'}
          size={20}
          color={isActive ? 'white' : colors.text.muted}
        />
        
        {/* Label */}
        <span 
          className="text-[9px] font-medium mt-1"
          style={{ color: isActive ? 'white' : colors.text.muted }}
        >
          {label}
        </span>
      </motion.div>

      {/* Actions menu on hover (not for hero) */}
      <AnimatePresence>
        {isHovered && !isHero && !isDragging && (
          <motion.div
            className="absolute left-full top-0 ml-2 flex flex-col gap-1 z-30"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
          >
            {/* Toggle visibility */}
            <ActionButton
              icon={isVisible ? Eye : EyeOff}
              onClick={handleToggleVisibility}
              tooltip={isVisible ? 'Masquer' : 'Afficher'}
              colors={colors}
            />
            
            {/* Duplicate */}
            <ActionButton
              icon={Copy}
              onClick={handleDuplicate}
              tooltip="Dupliquer"
              colors={colors}
            />
            
            {/* Delete */}
            <ActionButton
              icon={Trash2}
              onClick={handleDelete}
              tooltip="Supprimer"
              colors={colors}
              danger
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drop indicator line */}
      {isDragging && (
        <motion.div
          className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
          style={{ background: gradient }}
          animate={{ 
            boxShadow: [
              `0 0 5px ${colors.accent.primary}`,
              `0 0 15px ${colors.accent.primary}`,
              `0 0 5px ${colors.accent.primary}`,
            ]
          }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// 🔘 ACTION BUTTON
// ═══════════════════════════════════════════════════════════════════

function ActionButton({ icon: Icon, onClick, tooltip, colors, danger }) {
  return (
    <motion.button
      className="w-8 h-8 rounded-lg flex items-center justify-center"
      style={{ 
        background: colors.surface,
        border: `1px solid ${colors.border}`,
      }}
      onClick={onClick}
      whileHover={{ 
        scale: 1.1,
        background: danger ? '#EF444420' : colors.surfaceHover,
      }}
      whileTap={{ scale: 0.9 }}
      title={tooltip}
    >
      <Icon 
        className="w-4 h-4" 
        style={{ color: danger ? '#EF4444' : colors.text.muted }}
      />
    </motion.button>
  )
}

export default SortableSection
