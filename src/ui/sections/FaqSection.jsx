import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Plus, Minus } from 'lucide-react'
import { useSiteStore } from '@core/state/siteStore'
import { useTheme } from '@core/theme/ThemeProvider'

// ═══════════════════════════════════════════════════════════════════
// ❓ FAQ SECTION
// ═══════════════════════════════════════════════════════════════════

const SPACING_CLASSES = {
  compact: 'py-12 md:py-16',
  normal: 'py-16 md:py-24',
  spacious: 'py-20 md:py-32',
}

function FaqSection({ sectionId = 'faq' }) {
  const section = useSiteStore((s) => s.getSection(sectionId))
  const { colors, gradient } = useTheme()
  
  if (!section) return null
  
  const { content, layout, items = [], colors: sectionColors = {} } = section
  const variant = layout?.variant || 'accordion'
  const spacing = layout?.spacing || 'normal'
  const spacingClass = SPACING_CLASSES[spacing] || SPACING_CLASSES.normal

  // Couleurs
  const titleColor = sectionColors.title || colors.text.primary
  const subtitleColor = sectionColors.subtitle || colors.text.muted

  return (
    <section className={`${spacingClass} relative overflow-hidden`}>
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4"
            style={{ color: titleColor }}
          >
            {content?.title}
          </h2>
          <p 
            className="text-lg md:text-xl max-w-2xl mx-auto"
            style={{ color: subtitleColor }}
          >
            {content?.subtitle}
          </p>
        </motion.div>

        {/* FAQ selon le variant */}
        {variant === 'accordion' && (
          <AccordionLayout items={items} colors={colors} gradient={gradient} />
        )}
        
        {variant === 'grid' && (
          <GridLayout items={items} colors={colors} gradient={gradient} />
        )}
        
        {variant === 'simple' && (
          <SimpleLayout items={items} colors={colors} gradient={gradient} />
        )}
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════
// 📋 ACCORDION LAYOUT
// ═══════════════════════════════════════════════════════════════════

function AccordionLayout({ items, colors, gradient }) {
  const [openIndex, setOpenIndex] = useState(null)
  
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {items.map((item, index) => {
        const isOpen = openIndex === index
        
        return (
          <motion.div
            key={item.id}
            className="rounded-2xl overflow-hidden"
            style={{
              background: colors.surface,
              border: `1px solid ${isOpen ? colors.accent.primary : colors.border}`,
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
          >
            {/* Question */}
            <motion.button
              className="w-full p-5 md:p-6 flex items-center justify-between gap-4 text-left"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              whileHover={{ background: colors.surfaceHover }}
            >
              <span 
                className="font-semibold text-lg"
                style={{ color: colors.text.primary }}
              >
                {item.question}
              </span>
              <motion.div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ 
                  background: isOpen ? gradient : `${colors.accent.primary}20`,
                }}
                animate={{ rotate: isOpen ? 180 : 0 }}
              >
                <ChevronDown 
                  className="w-5 h-5" 
                  style={{ color: isOpen ? 'white' : colors.accent.primary }}
                />
              </motion.div>
            </motion.button>
            
            {/* Answer */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div 
                    className="px-5 md:px-6 pb-5 md:pb-6"
                    style={{ color: colors.text.muted }}
                  >
                    <div 
                      className="pt-4"
                      style={{ borderTop: `1px solid ${colors.border}` }}
                    >
                      {item.answer}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// 🔲 GRID LAYOUT
// ═══════════════════════════════════════════════════════════════════

function GridLayout({ items, colors, gradient }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          className="p-6 rounded-2xl"
          style={{
            background: colors.surface,
            border: `1px solid ${colors.border}`,
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ 
            borderColor: colors.accent.primary,
            boxShadow: `0 10px 30px ${colors.accent.primary}15`,
          }}
        >
          {/* Question */}
          <div className="flex items-start gap-3 mb-3">
            <div 
              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: gradient }}
            >
              <span className="text-white text-sm font-bold">?</span>
            </div>
            <h3 
              className="font-semibold"
              style={{ color: colors.text.primary }}
            >
              {item.question}
            </h3>
          </div>
          
          {/* Answer */}
          <p 
            className="ml-9"
            style={{ color: colors.text.muted }}
          >
            {item.answer}
          </p>
        </motion.div>
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// ✨ SIMPLE LAYOUT
// ═══════════════════════════════════════════════════════════════════

function SimpleLayout({ items, colors, gradient }) {
  const [expandedItems, setExpandedItems] = useState([])
  
  const toggleItem = (id) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    )
  }
  
  return (
    <div className="max-w-2xl mx-auto divide-y" style={{ borderColor: colors.border }}>
      {items.map((item, index) => {
        const isExpanded = expandedItems.includes(item.id)
        
        return (
          <motion.div
            key={item.id}
            className="py-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
          >
            <button
              className="w-full flex items-center justify-between gap-4 text-left"
              onClick={() => toggleItem(item.id)}
            >
              <span 
                className="font-medium"
                style={{ color: colors.text.primary }}
              >
                {item.question}
              </span>
              <motion.div
                animate={{ rotate: isExpanded ? 45 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <Plus 
                  className="w-5 h-5 flex-shrink-0" 
                  style={{ color: colors.accent.primary }}
                />
              </motion.div>
            </button>
            
            <AnimatePresence>
              {isExpanded && (
                <motion.p
                  className="mt-3"
                  style={{ color: colors.text.muted }}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {item.answer}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}

export default FaqSection
