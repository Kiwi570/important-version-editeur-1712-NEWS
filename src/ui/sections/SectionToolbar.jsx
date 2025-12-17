import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Type, Layout } from 'lucide-react'
import { useEditorStore } from '@core/state/editorStore'

// ═══════════════════════════════════════════════════════════════════
// 🛠️ SECTION TOOLBAR - Boutons flottants Contenu/Layout
// Apparaît au hover de chaque section
// ═══════════════════════════════════════════════════════════════════

function SectionToolbar({ sectionId, isVisible }) {
  const openEditorPopup = useEditorStore((s) => s.openEditorPopup)
  const mode = useEditorStore((s) => s.mode)
  
  // Ne pas afficher en mode preview
  if (mode === 'preview') return null
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="absolute top-4 right-4 z-30 flex gap-2"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ duration: 0.2 }}
        >
          {/* Bouton Contenu */}
          <motion.button
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
            onClick={(e) => {
              e.stopPropagation()
              openEditorPopup('content', sectionId)
            }}
            whileHover={{ 
              scale: 1.1, 
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
              background: 'white',
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0 }}
          >
            <Type className="w-[18px] h-[18px]" style={{ color: '#1E1B4B' }} />
          </motion.button>
          
          {/* Bouton Layout */}
          <motion.button
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
            onClick={(e) => {
              e.stopPropagation()
              openEditorPopup('layout', sectionId)
            }}
            whileHover={{ 
              scale: 1.1, 
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
              background: 'white',
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 }}
          >
            <Layout className="w-[18px] h-[18px]" style={{ color: '#1E1B4B' }} />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SectionToolbar
