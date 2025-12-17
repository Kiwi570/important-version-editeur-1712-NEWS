import React from 'react'
import { motion } from 'framer-motion'
import { useSiteStore } from '@core/state/siteStore'
import { useTheme } from '@core/theme/ThemeProvider'

// ═══════════════════════════════════════════════════════════════════
// 🦸 HERO SECTION - Version 2.0 (Fix clignotement)
// Composants définis à l'extérieur pour éviter les re-renders
// ═══════════════════════════════════════════════════════════════════

const SPACING_CLASSES = {
  compact: 'py-12 md:py-16',
  normal: 'py-16 md:py-24',
  spacious: 'py-20 md:py-32',
}

// ═══════════════════════════════════════════════════════════════════
// 🏷️ BADGE - Externe pour stabilité
// ═══════════════════════════════════════════════════════════════════
const Badge = ({ text, badgeColor }) => (
  <div 
    className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border"
    style={{ 
      backgroundColor: badgeColor + '15',
      borderColor: badgeColor + '40',
      color: badgeColor
    }}
  >
    <span className="text-sm font-medium">{text}</span>
  </div>
)

// ═══════════════════════════════════════════════════════════════════
// 🔘 CTA BUTTONS - Externe pour stabilité
// ═══════════════════════════════════════════════════════════════════
const CTAButtons = ({ primary, secondary, centered = false, ctaPrimaryColor, colors }) => (
  <div className={`flex flex-wrap gap-4 ${centered ? 'justify-center' : ''}`}>
    {primary && (
      <motion.button 
        className="px-8 py-4 rounded-2xl font-semibold text-white shadow-lg transition-all"
        style={{ 
          backgroundColor: ctaPrimaryColor,
          boxShadow: `0 10px 40px ${ctaPrimaryColor}40`,
        }}
        whileHover={{ scale: 1.02, y: -2, boxShadow: `0 15px 50px ${ctaPrimaryColor}50` }}
        whileTap={{ scale: 0.98 }}
      >
        {primary}
      </motion.button>
    )}
    {secondary && (
      <motion.button 
        className="px-8 py-4 rounded-2xl font-semibold transition-all"
        style={{
          background: 'transparent',
          border: `2px solid ${colors.border}`,
          color: colors.text.primary,
        }}
        whileHover={{ 
          scale: 1.02, 
          y: -2,
          borderColor: colors.accent.primary,
          background: `${colors.accent.primary}10`,
        }} 
        whileTap={{ scale: 0.98 }}
      >
        {secondary}
      </motion.button>
    )}
  </div>
)

// ═══════════════════════════════════════════════════════════════════
// ✓ TRUST BADGES - Externe pour stabilité
// ═══════════════════════════════════════════════════════════════════
const TrustBadges = ({ colors }) => (
  <div 
    className="mt-12 flex flex-wrap items-center justify-center gap-6 md:gap-8" 
    style={{ color: colors.text.light }}
  >
    {[
      { icon: '✓', text: 'Sans carte bancaire' },
      { icon: '✓', text: 'Setup en 2 min' },
      { icon: '✓', text: 'Support 24/7' },
    ].map((item, i) => (
      <div key={i} className="flex items-center gap-2">
        <span style={{ color: colors.accent.success }}>{item.icon}</span>
        <span className="text-sm">{item.text}</span>
      </div>
    ))}
  </div>
)

// ═══════════════════════════════════════════════════════════════════
// 🖼️ IMAGE PLACEHOLDER - Externe pour stabilité
// ═══════════════════════════════════════════════════════════════════
const ImagePlaceholder = ({ emoji = '🫧', gradient, colors, image }) => (
  <div className="relative">
    <div 
      className="absolute inset-0 rounded-3xl blur-3xl opacity-20"
      style={{ background: gradient }}
    />
    <div 
      className="relative rounded-3xl p-8 flex items-center justify-center min-h-[300px] md:min-h-[350px]"
      style={{ 
        background: colors.surface,
        border: `1px solid ${colors.border}`,
      }}
    >
      <div className="text-center">
        {image ? (
          <img 
            src={image} 
            alt="" 
            className="max-w-full max-h-[300px] rounded-2xl object-cover shadow-2xl" 
          />
        ) : (
          <>
            <motion.span 
              className="text-6xl md:text-7xl block mb-4" 
              animate={{ y: [0, -10, 0] }} 
              transition={{ duration: 3, repeat: Infinity }}
            >
              {emoji}
            </motion.span>
            <p style={{ color: colors.text.muted }} className="text-sm">
              Image ou illustration
            </p>
          </>
        )}
      </div>
    </div>
  </div>
)

// ═══════════════════════════════════════════════════════════════════
// 🌌 BACKGROUND ANIMÉ
// ═══════════════════════════════════════════════════════════════════
const HeroBackground = ({ colors }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div 
      className="absolute w-72 md:w-96 h-72 md:h-96 rounded-full blur-3xl animate-float"
      style={{ background: colors.accent.primary, opacity: 0.1, top: '15%', left: '15%' }}
    />
    <div 
      className="absolute w-64 md:w-80 h-64 md:h-80 rounded-full blur-3xl animate-float"
      style={{ background: colors.accent.secondary, opacity: 0.1, bottom: '20%', right: '20%', animationDelay: '-2s' }}
    />
    <div 
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[600px] h-[400px] md:h-[600px] rounded-full blur-3xl"
      style={{ background: colors.accent.tertiary, opacity: 0.05 }}
    />
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="absolute w-4 h-4 rounded-full animate-float"
        style={{
          background: colors.accent.primary,
          opacity: 0.3,
          left: `${20 + i * 15}%`,
          top: `${30 + (i % 3) * 20}%`,
          animationDelay: `${i * 0.5}s`,
        }}
      />
    ))}
  </div>
)

// ═══════════════════════════════════════════════════════════════════
// 🦸 HERO SECTION - Composant principal
// ═══════════════════════════════════════════════════════════════════
function HeroSection({ sectionId = 'hero' }) {
  const section = useSiteStore((s) => s.getSection(sectionId))
  const { colors, gradient } = useTheme()
  
  if (!section) return null
  
  const { content, layout, colors: sectionColors = {} } = section
  const variant = layout?.variant || 'centered'
  const spacing = layout?.spacing || 'normal'
  const spacingClass = SPACING_CLASSES[spacing] || SPACING_CLASSES.normal

  const titleColor = sectionColors.title || colors.text.primary
  const subtitleColor = sectionColors.subtitle || colors.text.muted
  const badgeColor = sectionColors.badge || colors.accent.primary
  const ctaPrimaryColor = sectionColors.ctaPrimary || colors.accent.primary

  const renderTitle = () => {
    const title = content?.title || ''
    const highlight = content?.titleHighlight || ''
    if (!highlight || !title.includes(highlight)) {
      return <span style={{ color: titleColor }}>{title}</span>
    }
    const parts = title.split(highlight)
    return (
      <>
        <span style={{ color: titleColor }}>{parts[0]}</span>
        <span className="text-gradient-animated">{highlight}</span>
        <span style={{ color: titleColor }}>{parts[1]}</span>
      </>
    )
  }

  // Layout Split Left
  if (variant === 'split-left') {
    return (
      <section className={`${spacingClass} overflow-hidden relative`}>
        <HeroBackground colors={colors} />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <ImagePlaceholder emoji="🫧" gradient={gradient} colors={colors} image={content?.image} />
            </div>
            <div>
              {content?.badge && <Badge text={content.badge} badgeColor={badgeColor} />}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-6">
                {renderTitle()}
              </h1>
              <p className="text-lg mb-8" style={{ color: subtitleColor }}>{content?.subtitle}</p>
              <CTAButtons primary={content?.ctaPrimary} secondary={content?.ctaSecondary} ctaPrimaryColor={ctaPrimaryColor} colors={colors} />
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Layout Split Right
  if (variant === 'split-right') {
    return (
      <section className={`${spacingClass} overflow-hidden relative`}>
        <HeroBackground colors={colors} />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              {content?.badge && <Badge text={content.badge} badgeColor={badgeColor} />}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-6">
                {renderTitle()}
              </h1>
              <p className="text-lg mb-8" style={{ color: subtitleColor }}>{content?.subtitle}</p>
              <CTAButtons primary={content?.ctaPrimary} secondary={content?.ctaSecondary} ctaPrimaryColor={ctaPrimaryColor} colors={colors} />
            </div>
            <div>
              <ImagePlaceholder emoji="✨" gradient={gradient} colors={colors} image={content?.image} />
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Layout Centered (default)
  return (
    <section className={`relative ${spacingClass} overflow-hidden`}>
      <HeroBackground colors={colors} />
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {content?.badge && <Badge text={content.badge} badgeColor={badgeColor} />}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            {renderTitle()}
          </h1>
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto" style={{ color: subtitleColor }}>
            {content?.subtitle}
          </p>
          <CTAButtons primary={content?.ctaPrimary} secondary={content?.ctaSecondary} centered ctaPrimaryColor={ctaPrimaryColor} colors={colors} />
          <TrustBadges colors={colors} />
        </div>
      </div>
    </section>
  )
}

export default HeroSection
