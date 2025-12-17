import React, { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSiteStore } from '@core/state/siteStore'
import { useEditorStore } from '@core/state/editorStore'
import { useTheme } from '@core/theme/ThemeProvider'

// Sections
import HeroSection from '@ui/sections/HeroSection'
import FeaturesSection from '@ui/sections/FeaturesSection'
import HowItWorksSection from '@ui/sections/HowItWorksSection'
import PricingSection from '@ui/sections/PricingSection'
import FaqSection from '@ui/sections/FaqSection'

// ═══════════════════════════════════════════════════════════════════
// 🎨 CANVAS - Zone de preview
// ═══════════════════════════════════════════════════════════════════

const SECTION_COMPONENTS = {
  hero: HeroSection,
  features: FeaturesSection,
  howItWorks: HowItWorksSection,
  pricing: PricingSection,
  faq: FaqSection,
}

// Device configurations
const DEVICE_CONFIG = {
  desktop: {
    width: '100%',
    maxWidth: 'none',
    frame: false,
  },
  tablet: {
    width: '768px',
    maxWidth: '768px',
    frame: true,
    frameRadius: '24px',
  },
  mobile: {
    width: '375px',
    maxWidth: '375px',
    frame: true,
    frameRadius: '32px',
  },
}

function Canvas() {
  const canvasRef = useRef(null)
  const sectionRefs = useRef({})
  
  const sectionsOrder = useSiteStore((s) => s.site?.sectionsOrder || [])
  const sectionsVisibility = useSiteStore((s) => s.site?.sectionsVisibility || {})
  const sections = useSiteStore((s) => s.site?.sections || {})
  
  const activeSection = useEditorStore((s) => s.activeSection)
  const highlightedSection = useEditorStore((s) => s.highlightedSection)
  const hoveredSection = useEditorStore((s) => s.hoveredSection)
  const setActiveSection = useEditorStore((s) => s.setActiveSection)
  const setHoveredSection = useEditorStore((s) => s.setHoveredSection)
  const mode = useEditorStore((s) => s.mode)
  const previewDevice = useEditorStore((s) => s.previewDevice)
  
  const { colors, gradient } = useTheme()

  // Scroll to active section
  useEffect(() => {
    if (activeSection && sectionRefs.current[activeSection]) {
      sectionRefs.current[activeSection].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [activeSection])

  // Visible sections
  const visibleSections = sectionsOrder.filter(
    (id) => sectionsVisibility[id] !== false && sections[id]
  )

  // Device config
  const deviceConfig = DEVICE_CONFIG[previewDevice]
  const isFramed = deviceConfig.frame

  return (
    <div 
      ref={canvasRef}
      className="h-full flex-1 overflow-y-auto overflow-x-hidden relative flex justify-center"
      style={{ background: isFramed ? colors.backgroundSecondary : colors.background }}
    >
      {/* Container avec transition fluide */}
      <motion.div 
        className={`relative ${isFramed ? 'my-8' : ''}`}
        layout
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        {/* Device frame (pour tablet/mobile) */}
        {isFramed && (
          <motion.div
            className="absolute -inset-3 rounded-[32px] pointer-events-none"
            style={{
              background: 'linear-gradient(145deg, #2a2a3e, #1a1a2e)',
              boxShadow: `
                0 50px 100px rgba(0,0,0,0.5),
                inset 0 1px 0 rgba(255,255,255,0.1),
                inset 0 -1px 0 rgba(0,0,0,0.3)
              `,
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            {/* Notch for mobile */}
            {previewDevice === 'mobile' && (
              <div 
                className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 rounded-b-2xl"
                style={{ background: '#1a1a2e' }}
              />
            )}
          </motion.div>
        )}
        
        {/* Preview container */}
        <motion.div 
          className="relative overflow-hidden"
          style={{
            width: deviceConfig.width,
            maxWidth: deviceConfig.maxWidth,
            minWidth: isFramed ? deviceConfig.width : 'auto',
            borderRadius: isFramed ? deviceConfig.frameRadius : '0',
            background: colors.background,
            boxShadow: isFramed ? 'none' : 'none',
          }}
          layout
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
          {visibleSections.map((sectionId) => {
            const section = sections[sectionId]
            if (!section) return null
            
            const Component = SECTION_COMPONENTS[section.type]
            if (!Component) return null
            
            const isActive = activeSection === sectionId
            const isHighlighted = highlightedSection === sectionId
            
            return (
              <div
                key={sectionId}
                ref={(el) => (sectionRefs.current[sectionId] = el)}
                className="relative group"
                onClick={() => mode === 'edit' && setActiveSection(sectionId)}
                onMouseEnter={() => mode === 'edit' && setHoveredSection(sectionId)}
                onMouseLeave={() => mode === 'edit' && setHoveredSection(null)}
              >
                {/* Indicateur de section active */}
                <AnimatePresence>
                  {isActive && mode === 'edit' && (
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 w-1 z-20"
                      style={{ background: gradient }}
                      initial={{ scaleY: 0, opacity: 0 }}
                      animate={{ scaleY: 1, opacity: 1 }}
                      exit={{ scaleY: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Bulle animée */}
                      <motion.div
                        className="absolute left-0 w-3 h-3 rounded-full -translate-x-1"
                        style={{ background: gradient }}
                        animate={{ y: ['0%', '100%', '0%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Highlight animation */}
                <AnimatePresence>
                  {isHighlighted && (
                    <motion.div
                      className="absolute inset-0 z-10 pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.div
                        className="absolute inset-0"
                        style={{
                          border: `2px solid ${colors.accent.primary}`,
                          boxShadow: `0 0 30px ${colors.accent.primary}40`,
                        }}
                        animate={{
                          boxShadow: [
                            `0 0 20px ${colors.accent.primary}30`,
                            `0 0 40px ${colors.accent.primary}50`,
                            `0 0 20px ${colors.accent.primary}30`,
                          ],
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Hover overlay en mode edit */}
                {mode === 'edit' && (
                  <div 
                    className={`absolute inset-0 z-10 transition-all duration-200 pointer-events-none ${
                      isActive ? 'ring-2 ring-inset' : 'group-hover:ring-1 group-hover:ring-inset'
                    }`}
                    style={{
                      ringColor: isActive ? colors.accent.primary : colors.border,
                    }}
                  />
                )}
                
                {/* Section Component */}
                <Component sectionId={sectionId} />
              </div>
            )
          })}
          
          {/* Empty state */}
          {visibleSections.length === 0 && (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <motion.div
                  className="text-6xl mb-4"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🫧
                </motion.div>
                <h3 
                  className="text-xl font-bold mb-2"
                  style={{ color: colors.text.primary }}
                >
                  Aucune section visible
                </h3>
                <p style={{ color: colors.text.muted }}>
                  Ajoute des sections depuis la sidebar
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
      
      {/* Device indicator badge */}
      <AnimatePresence>
        {isFramed && (
          <motion.div 
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-4 py-2 rounded-full"
            style={{ 
              background: colors.surface,
              border: `1px solid ${colors.border}`,
              boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <span className="text-lg">
              {previewDevice === 'tablet' ? '📱' : '📱'}
            </span>
            <span 
              className="text-sm font-medium"
              style={{ color: colors.text.muted }}
            >
              {previewDevice === 'tablet' ? 'Tablet (768px)' : 'Mobile (375px)'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Canvas
