import React from 'react'
import { motion } from 'framer-motion'
import { Check, Star } from 'lucide-react'
import { useSiteStore } from '@core/state/siteStore'
import { useTheme } from '@core/theme/ThemeProvider'

// ═══════════════════════════════════════════════════════════════════
// 💰 PRICING SECTION
// ═══════════════════════════════════════════════════════════════════

const SPACING_CLASSES = {
  compact: 'py-12 md:py-16',
  normal: 'py-16 md:py-24',
  spacious: 'py-20 md:py-32',
}

function PricingSection({ sectionId = 'pricing' }) {
  const section = useSiteStore((s) => s.getSection(sectionId))
  const { colors, gradient } = useTheme()
  
  if (!section) return null
  
  const { content, layout, plans = [], colors: sectionColors = {} } = section
  const variant = layout?.variant || 'cards'
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
          background: `radial-gradient(ellipse at top, ${colors.accent.primary}08 0%, transparent 50%)`,
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

        {/* Plans */}
        {variant === 'cards' && (
          <CardsLayout plans={plans} colors={colors} gradient={gradient} />
        )}
        
        {variant === 'table' && (
          <TableLayout plans={plans} colors={colors} gradient={gradient} />
        )}
        
        {variant === 'minimal' && (
          <MinimalLayout plans={plans} colors={colors} gradient={gradient} />
        )}
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════
// 🃏 CARDS LAYOUT
// ═══════════════════════════════════════════════════════════════════

function CardsLayout({ plans, colors, gradient }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
      {plans.map((plan, index) => (
        <motion.div
          key={plan.id}
          className={`relative p-6 md:p-8 rounded-2xl ${
            plan.highlighted ? 'md:-mt-4 md:mb-4' : ''
          }`}
          style={{
            background: plan.highlighted ? gradient : colors.surface,
            border: plan.highlighted ? 'none' : `1px solid ${colors.border}`,
            boxShadow: plan.highlighted 
              ? `0 20px 60px ${colors.accent.primary}30` 
              : 'none',
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ 
            y: -5,
            boxShadow: plan.highlighted 
              ? `0 30px 80px ${colors.accent.primary}40`
              : `0 20px 40px ${colors.accent.primary}20`,
          }}
        >
          {/* Badge */}
          {plan.badge && (
            <div 
              className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1"
              style={{
                background: plan.highlighted ? 'white' : gradient,
                color: plan.highlighted ? colors.accent.primary : 'white',
              }}
            >
              <Star className="w-3 h-3" fill="currentColor" />
              {plan.badge}
            </div>
          )}
          
          {/* Plan name */}
          <h3 
            className="text-xl font-bold mb-2"
            style={{ color: plan.highlighted ? 'white' : colors.text.primary }}
          >
            {plan.name}
          </h3>
          
          {/* Description */}
          <p 
            className="text-sm mb-4"
            style={{ color: plan.highlighted ? 'rgba(255,255,255,0.8)' : colors.text.muted }}
          >
            {plan.description}
          </p>
          
          {/* Price */}
          <div className="mb-6">
            <span 
              className="text-4xl font-extrabold"
              style={{ color: plan.highlighted ? 'white' : colors.text.primary }}
            >
              {plan.price}
            </span>
            <span 
              className="text-sm"
              style={{ color: plan.highlighted ? 'rgba(255,255,255,0.7)' : colors.text.muted }}
            >
              {plan.period}
            </span>
          </div>
          
          {/* Features */}
          <ul className="space-y-3 mb-8">
            {plan.features?.map((feature, i) => (
              <li key={i} className="flex items-center gap-3">
                <div 
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ 
                    background: plan.highlighted 
                      ? 'rgba(255,255,255,0.2)' 
                      : `${colors.accent.success}20`,
                  }}
                >
                  <Check 
                    className="w-3 h-3" 
                    style={{ 
                      color: plan.highlighted ? 'white' : colors.accent.success,
                    }}
                  />
                </div>
                <span 
                  className="text-sm"
                  style={{ 
                    color: plan.highlighted ? 'rgba(255,255,255,0.9)' : colors.text.secondary,
                  }}
                >
                  {feature}
                </span>
              </li>
            ))}
          </ul>
          
          {/* CTA */}
          <motion.button
            className="w-full py-3 rounded-xl font-semibold transition-all"
            style={{
              background: plan.highlighted ? 'white' : gradient,
              color: plan.highlighted ? colors.accent.primary : 'white',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {plan.cta}
          </motion.button>
        </motion.div>
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// 📊 TABLE LAYOUT
// ═══════════════════════════════════════════════════════════════════

function TableLayout({ plans, colors, gradient }) {
  // Obtenir toutes les features uniques
  const allFeatures = [...new Set(plans.flatMap(p => p.features || []))]
  
  return (
    <div 
      className="overflow-x-auto rounded-2xl"
      style={{ 
        background: colors.surface,
        border: `1px solid ${colors.border}`,
      }}
    >
      <table className="w-full">
        <thead>
          <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
            <th className="p-4 text-left" style={{ color: colors.text.muted }}>
              Fonctionnalités
            </th>
            {plans.map((plan) => (
              <th 
                key={plan.id} 
                className="p-4 text-center"
                style={{ 
                  color: plan.highlighted ? colors.accent.primary : colors.text.primary,
                }}
              >
                <div className="font-bold text-lg">{plan.name}</div>
                <div className="text-2xl font-extrabold mt-1">
                  {plan.price}
                  <span className="text-sm font-normal" style={{ color: colors.text.muted }}>
                    {plan.period}
                  </span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allFeatures.map((feature, i) => (
            <tr 
              key={i} 
              style={{ borderBottom: `1px solid ${colors.border}` }}
            >
              <td className="p-4" style={{ color: colors.text.secondary }}>
                {feature}
              </td>
              {plans.map((plan) => (
                <td key={plan.id} className="p-4 text-center">
                  {plan.features?.includes(feature) ? (
                    <Check className="w-5 h-5 mx-auto" style={{ color: colors.accent.success }} />
                  ) : (
                    <span style={{ color: colors.text.light }}>—</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// ✨ MINIMAL LAYOUT
// ═══════════════════════════════════════════════════════════════════

function MinimalLayout({ plans, colors, gradient }) {
  return (
    <div className="flex flex-col md:flex-row gap-6 justify-center max-w-4xl mx-auto">
      {plans.map((plan, index) => (
        <motion.div
          key={plan.id}
          className="flex-1 p-6 rounded-xl text-center"
          style={{
            background: plan.highlighted ? `${colors.accent.primary}10` : 'transparent',
            border: `2px solid ${plan.highlighted ? colors.accent.primary : colors.border}`,
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
        >
          <h3 
            className="font-bold mb-2"
            style={{ color: colors.text.primary }}
          >
            {plan.name}
          </h3>
          <div 
            className="text-3xl font-extrabold mb-4"
            style={{ color: plan.highlighted ? colors.accent.primary : colors.text.primary }}
          >
            {plan.price}
            <span className="text-sm font-normal" style={{ color: colors.text.muted }}>
              {plan.period}
            </span>
          </div>
          <motion.button
            className="px-6 py-2 rounded-lg font-medium"
            style={{
              background: plan.highlighted ? gradient : 'transparent',
              color: plan.highlighted ? 'white' : colors.text.primary,
              border: plan.highlighted ? 'none' : `1px solid ${colors.border}`,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {plan.cta}
          </motion.button>
        </motion.div>
      ))}
    </div>
  )
}

export default PricingSection
