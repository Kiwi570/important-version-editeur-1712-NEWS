import React from 'react'
import { motion } from 'framer-motion'
import { useSiteStore } from '@core/state/siteStore'
import { useTheme } from '@core/theme/ThemeProvider'

// ═══════════════════════════════════════════════════════════════════
// 🚀 HOW IT WORKS SECTION
// ═══════════════════════════════════════════════════════════════════

const SPACING_CLASSES = {
  compact: 'py-12 md:py-16',
  normal: 'py-16 md:py-24',
  spacious: 'py-20 md:py-32',
}

function HowItWorksSection({ sectionId = 'howItWorks' }) {
  const section = useSiteStore((s) => s.getSection(sectionId))
  const { colors, gradient } = useTheme()
  
  if (!section) return null
  
  const { content, layout, steps = [], colors: sectionColors = {} } = section
  const variant = layout?.variant || 'timeline'
  const spacing = layout?.spacing || 'normal'
  const spacingClass = SPACING_CLASSES[spacing] || SPACING_CLASSES.normal

  // Couleurs
  const titleColor = sectionColors.title || colors.text.primary
  const subtitleColor = sectionColors.subtitle || colors.text.muted

  return (
    <section className={`${spacingClass} relative overflow-hidden`}>
      {/* Background */}
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${colors.accent.primary}05 50%, transparent 100%)`,
        }}
      />
      
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

        {/* Steps selon le variant */}
        {variant === 'timeline' && (
          <TimelineLayout steps={steps} colors={colors} gradient={gradient} />
        )}
        
        {variant === 'cards' && (
          <CardsLayout steps={steps} colors={colors} gradient={gradient} />
        )}
        
        {variant === 'minimal' && (
          <MinimalLayout steps={steps} colors={colors} gradient={gradient} />
        )}
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════
// 📍 TIMELINE LAYOUT
// ═══════════════════════════════════════════════════════════════════

function TimelineLayout({ steps, colors, gradient }) {
  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Ligne centrale */}
      <div 
        className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 hidden md:block"
        style={{ background: gradient }}
      />
      
      {steps.map((step, index) => (
        <motion.div
          key={step.id}
          className={`relative flex items-center gap-8 mb-12 last:mb-0 ${
            index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
          }`}
          initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.15 }}
        >
          {/* Content */}
          <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
            <motion.div
              className="p-6 rounded-2xl"
              style={{
                background: colors.surface,
                border: `1px solid ${colors.border}`,
              }}
              whileHover={{ 
                scale: 1.02,
                borderColor: colors.accent.primary,
                boxShadow: `0 10px 30px ${colors.accent.primary}20`,
              }}
            >
              <h3 
                className="text-xl font-bold mb-2"
                style={{ color: colors.text.primary }}
              >
                {step.title}
              </h3>
              <p style={{ color: colors.text.muted }}>
                {step.description}
              </p>
            </motion.div>
          </div>
          
          {/* Number Circle */}
          <motion.div 
            className="relative z-10 w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
            style={{ background: gradient }}
            whileHover={{ scale: 1.1 }}
            animate={{
              boxShadow: [
                `0 0 0 0 ${colors.accent.primary}40`,
                `0 0 0 10px ${colors.accent.primary}00`,
              ],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.3,
            }}
          >
            {step.number}
          </motion.div>
          
          {/* Empty space for alignment */}
          <div className="flex-1 hidden md:block" />
        </motion.div>
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// 🃏 CARDS LAYOUT
// ═══════════════════════════════════════════════════════════════════

function CardsLayout({ steps, colors, gradient }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
      {steps.map((step, index) => (
        <motion.div
          key={step.id}
          className="relative p-6 md:p-8 rounded-2xl text-center group"
          style={{
            background: colors.surface,
            border: `1px solid ${colors.border}`,
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ 
            y: -5,
            borderColor: colors.accent.primary,
            boxShadow: `0 20px 40px ${colors.accent.primary}20`,
          }}
        >
          {/* Connector line */}
          {index < steps.length - 1 && (
            <div 
              className="absolute top-1/2 -right-4 md:-right-6 w-8 md:w-12 h-0.5 hidden md:block"
              style={{ background: gradient }}
            />
          )}
          
          {/* Number */}
          <motion.div 
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-5"
            style={{ background: gradient }}
            whileHover={{ scale: 1.1, rotate: 10 }}
          >
            {step.number}
          </motion.div>
          
          {/* Content */}
          <h3 
            className="text-xl font-bold mb-2"
            style={{ color: colors.text.primary }}
          >
            {step.title}
          </h3>
          <p style={{ color: colors.text.muted }}>
            {step.description}
          </p>
        </motion.div>
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// ✨ MINIMAL LAYOUT
// ═══════════════════════════════════════════════════════════════════

function MinimalLayout({ steps, colors, gradient }) {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {steps.map((step, index) => (
        <motion.div
          key={step.id}
          className="flex items-start gap-6"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
        >
          {/* Number */}
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
            style={{ background: gradient }}
          >
            {step.number}
          </div>
          
          {/* Content */}
          <div className="flex-1 pt-1">
            <h3 
              className="text-lg font-bold mb-1"
              style={{ color: colors.text.primary }}
            >
              {step.title}
            </h3>
            <p style={{ color: colors.text.muted }}>
              {step.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default HowItWorksSection
