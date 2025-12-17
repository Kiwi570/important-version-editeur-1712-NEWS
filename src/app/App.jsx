import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Rocket } from 'lucide-react'
import { ThemeProvider } from '@core/theme/ThemeProvider'
import { useEditorStore } from '@core/state/editorStore'
import { useSiteStore } from '@core/state/siteStore'

// Layout
import SortableSidebar from '@ui/layout/SortableSidebar'
import Canvas from '@ui/editor/Canvas'
import LumiPanel from '@ui/lumi/LumiPanel'
import Toast from '@ui/feedback/Toast'

// Modals
import ExportModal from '@ui/modals/ExportModal'

// ═══════════════════════════════════════════════════════════════════
// 🫧 BULLE EDITOR V2.2 - PHASE 3 (EXPORT)
// ═══════════════════════════════════════════════════════════════════

function AppContent() {
  const lumiOpen = useEditorStore((s) => s.lumiOpen)
  const toggleLumi = useEditorStore((s) => s.toggleLumi)
  const setActiveSection = useEditorStore((s) => s.setActiveSection)
  const activeSection = useEditorStore((s) => s.activeSection)
  const setPreviewDevice = useEditorStore((s) => s.setPreviewDevice)
  const openModal = useEditorStore((s) => s.openModal)
  const headerOpen = useEditorStore((s) => s.headerOpen)
  
  const undo = useSiteStore((s) => s.undo)
  const redo = useSiteStore((s) => s.redo)
  const canUndo = useSiteStore((s) => s.canUndo)
  const canRedo = useSiteStore((s) => s.canRedo)

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd/Ctrl + Z = Undo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        if (canUndo()) undo()
      }
      
      // Cmd/Ctrl + Shift + Z or Cmd/Ctrl + Y = Redo
      if ((e.metaKey || e.ctrlKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault()
        if (canRedo()) redo()
      }
      
      // Cmd/Ctrl + K = Toggle Lumi
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        toggleLumi()
      }
      
      // Cmd/Ctrl + E = Export
      if ((e.metaKey || e.ctrlKey) && e.key === 'e') {
        e.preventDefault()
        openModal('export')
      }
      
      // Escape = Clear selection / Close modal
      if (e.key === 'Escape') {
        setActiveSection(null)
      }
      
      // 1, 2, 3 = Device shortcuts
      if (e.key === '1' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setPreviewDevice('desktop')
      }
      if (e.key === '2' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setPreviewDevice('tablet')
      }
      if (e.key === '3' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setPreviewDevice('mobile')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo, canUndo, canRedo, toggleLumi, setActiveSection, setPreviewDevice, openModal])

  // Select hero by default
  useEffect(() => {
    if (!activeSection) {
      setActiveSection('hero')
    }
  }, [])

  const [activeTab, setActiveTab] = useState(1)

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[var(--color-bg)]">
      {/* Sortable Sidebar - 100% hauteur */}
      <SortableSidebar />
      
      {/* Zone droite : Header + (Canvas + Bulle) */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header avec animation: ouverture slide gauche→droite, fermeture hauteur progressive */}
        <AnimatePresence mode="wait">
          {headerOpen && (
            <motion.div 
              className="w-full shrink-0 overflow-hidden"
              initial={{ height: 80 }}
              animate={{ height: 80 }}
              exit={{ height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <motion.div
                className="h-20 w-full flex items-center justify-between px-6"
                style={{ 
                  background: 'linear-gradient(to right, #FFFFFF 0%, #FFFFFF 25%, #d0d4e0 40%, #6b7280 55%, #2d2d44 70%, #1a1a2e 80%, #1a1a2e 100%)',
                  borderBottom: '1px solid #E2E8F0'
                }}
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                {/* Spacer gauche */}
                <div className="w-32" />
                
                {/* Onglets 1, 2, 3 au centre */}
                <div className="flex items-center gap-3">
                  {[1, 2, 3].map((num) => (
                    <motion.button
                      key={num}
                      onClick={() => setActiveTab(num)}
                      className="w-10 h-10 rounded-lg flex items-center justify-center font-semibold text-sm cursor-pointer"
                      style={{
                        background: activeTab === num 
                          ? 'linear-gradient(135deg, #F472B6 0%, #A78BFA 50%, #22D3EE 100%)'
                          : '#F1F5F9',
                        color: activeTab === num ? '#FFFFFF' : '#64748B',
                        boxShadow: activeTab === num ? '0 4px 15px rgba(168, 85, 247, 0.4)' : 'none'
                      }}
                      whileHover={{ scale: 1.05, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {num}
                    </motion.button>
                  ))}
                </div>
                
                {/* Bouton Publier à droite */}
                <motion.button
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, #F472B6 0%, #A78BFA 50%, #22D3EE 100%)',
                    color: '#FFFFFF',
                    boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)'
                  }}
                  whileHover={{ scale: 1.05, boxShadow: '0 6px 20px rgba(168, 85, 247, 0.5)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Rocket className="w-4 h-4" />
                  Publier
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Zone Canvas + Bulle côte à côte */}
        <div className="flex-1 flex overflow-hidden">
          {/* Canvas */}
          <div className="flex-1 h-full overflow-hidden">
            <Canvas />
          </div>
          
          {/* Lumi Panel - descend sous le header */}
          <AnimatePresence mode="wait">
            {lumiOpen && <LumiPanel />}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Toast notifications */}
      <Toast />
      
      {/* Export Modal */}
      <ExportModal />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// 🚀 APP WRAPPER WITH PROVIDERS
// ═══════════════════════════════════════════════════════════════════

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App
