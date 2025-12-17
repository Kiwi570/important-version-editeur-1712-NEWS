import React from 'react'
import { motion } from 'framer-motion'
import { useSiteStore } from '@core/state/siteStore'
import { useTheme } from '@core/theme/ThemeProvider'
import DynamicIcon from '@ui/common/DynamicIcon'

// ═══════════════════════════════════════════════════════════════════
// ⭐ FEATURES SECTION
// ═══════════════════════════════════════════════════════════════════

const SPACING_CLASSES = {
  compact: 'py-12 md:py-16',
  normal: 'py-16 md:py-24',
  spacious: 'py-20 md:py-32',
}

function FeaturesSection({ sectionId = 'features' }) {
  const section = useSiteStore((s) => s.getSection(sectionId))
  const { colors, gradient } = useTheme()
  
  if (!section) return null
  
  const { content, layout, items = [], colors: sectionColors = {} } = section
  const variant = layout?.variant || 'grid-3'
  const spacing = layout?.spacing || 'normal'
  const spacingClass = SPACING_CLASSES[spacing] || SPACING_CLASSES.normal

  // Couleurs
  const titleColor = sectionColors.title || colors.text.primary
  const subtitleColor = sectionColors.subtitle || colors.text.muted

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
      },
    },
  }

  // Grilles selon le variant
  const gridClasses = {
    'grid-3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    'grid-2': 'grid-cols-1 md:grid-cols-2',
    'list': 'grid-cols-1 max-w-2xl mx-auto',
  }

  return (
    <section className={`${spacingClass} relative overflow-hidden`}>
      {/* Background subtil */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(ellipse at center, ${colors.accent.primary}10 0%, transparent 70%)`,
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

        {/* Features Grid */}
        <motion.div 
          className={`grid ${gridClasses[variant] || gridClasses['grid-3']} gap-6 md:gap-8`}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {items.map((item, index) => (
            <FeatureCard 
              key={item.id} 
              item={item} 
              index={index}
              variant={variant}
              colors={colors}
              variants={itemVariants}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════
// 🃏 FEATURE CARD
// ═══════════════════════════════════════════════════════════════════

function FeatureCard({ item, index, variant, colors, variants }) {
  const isListVariant = variant === 'list'
  
  return (
    <motion.div
      className={`group relative p-6 md:p-8 rounded-2xl transition-all duration-300 ${
        isListVariant ? 'flex items-start gap-6' : ''
      }`}
      style={{
        background: colors.surface,
        border: `1px solid ${colors.border}`,
      }}
      variants={variants}
      whileHover={{ 
        y: -5,
        borderColor: item.color || colors.accent.primary,
        boxShadow: `0 20px 40px ${item.color || colors.accent.primary}20`,
      }}
    >
      {/* Glow effect on hover */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${item.color || colors.accent.primary}10 0%, transparent 70%)`,
        }}
      />

      {/* Icon */}
      <motion.div 
        className={`relative flex items-center justify-center rounded-2xl ${
          isListVariant ? 'w-16 h-16 flex-shrink-0' : 'w-14 h-14 mb-5'
        }`}
        style={{
          background: `${item.color || colors.accent.primary}15`,
          border: `1px solid ${item.color || colors.accent.primary}30`,
        }}
        whileHover={{ scale: 1.1, rotate: 5 }}
      >
        <DynamicIcon 
          name={item.icon || 'Sparkles'} 
          size={isListVariant ? 28 : 24} 
          color={item.color || colors.accent.primary}
        />
        
        {/* Sparkle effect */}
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3"
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: index * 0.2,
          }}
        >
          <DynamicIcon 
            name="Sparkles" 
            size={12} 
            color={item.color || colors.accent.primary}
          />
        </motion.div>
      </motion.div>

      {/* Content */}
      <div className={isListVariant ? 'flex-1' : ''}>
        <h3 
          className="text-lg md:text-xl font-bold mb-2 transition-colors"
          style={{ color: colors.text.primary }}
        >
          {item.title}
        </h3>
        <p 
          className="text-sm md:text-base leading-relaxed"
          style={{ color: colors.text.muted }}
        >
          {item.description}
        </p>
      </div>

      {/* Numéro décoratif (pour grid) */}
      {!isListVariant && (
        <div 
          className="absolute top-4 right-4 text-4xl font-black opacity-5"
          style={{ color: item.color || colors.accent.primary }}
        >
          {String(index + 1).padStart(2, '0')}
        </div>
      )}
    </motion.div>
  )
}

export default FeaturesSection
